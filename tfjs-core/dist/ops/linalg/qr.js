/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import { ENGINE } from '../../engine';
import { dispose } from '../../globals';
import { assert } from '../../util';
import { clone } from '../clone';
import { concat } from '../concat';
import { div } from '../div';
import { eye } from '../eye';
import { greater } from '../greater';
import { matMul } from '../mat_mul';
import { mul } from '../mul';
import { neg } from '../neg';
import { norm } from '../norm';
import { op } from '../operation';
import { reshape } from '../reshape';
import { slice } from '../slice';
import { stack } from '../stack';
import { sub } from '../sub';
import { tensor2d } from '../tensor2d';
import { transpose } from '../transpose';
import { unstack } from '../unstack';
import { where } from '../where';
/**
 * Compute QR decomposition of m-by-n matrix using Householder transformation.
 *
 * Implementation based on
 *   [http://www.cs.cornell.edu/~bindel/class/cs6210-f09/lec18.pdf]
 * (http://www.cs.cornell.edu/~bindel/class/cs6210-f09/lec18.pdf)
 *
 * ```js
 * const a = tf.tensor2d([[1, 2], [3, 4]]);
 * let [q, r] = tf.linalg.qr(a);
 * console.log('Q');
 * q.print();
 * console.log('R');
 * r.print();
 * console.log('Orthogonalized');
 * q.dot(q.transpose()).print()  // should be nearly the identity matrix.
 * console.log('Reconstructed');
 * q.dot(r).print(); // should be nearly [[1, 2], [3, 4]];
 * ```
 *
 * @param x The `tf.Tensor` to be QR-decomposed. Must have rank >= 2. Suppose
 *   it has the shape `[..., M, N]`.
 * @param fullMatrices An optional boolean parameter. Defaults to `false`.
 *   If `true`, compute full-sized `Q`. If `false` (the default),
 *   compute only the leading N columns of `Q` and `R`.
 * @returns An `Array` of two `tf.Tensor`s: `[Q, R]`. `Q` is a unitary matrix,
 *   i.e., its columns all have unit norm and are mutually orthogonal.
 *   If `M >= N`,
 *     If `fullMatrices` is `false` (default),
 *       - `Q` has a shape of `[..., M, N]`,
 *       - `R` has a shape of `[..., N, N]`.
 *     If `fullMatrices` is `true` (default),
 *       - `Q` has a shape of `[..., M, M]`,
 *       - `R` has a shape of `[..., M, N]`.
 *   If `M < N`,
 *     - `Q` has a shape of `[..., M, M]`,
 *     - `R` has a shape of `[..., M, N]`.
 * @throws If the rank of `x` is less than 2.
 *
 * @doc {heading:'Operations',
 *       subheading:'Linear Algebra',
 *       namespace:'linalg'}
 */
function qr_(x, fullMatrices = false) {
    assert(x.rank >= 2, () => `qr() requires input tensor to have a rank >= 2, but got rank ${x.rank}`);
    if (x.rank === 2) {
        return qr2d(x, fullMatrices);
    }
    else {
        // Rank > 2.
        // TODO(cais): Below we split the input into individual 2D tensors,
        //   perform QR decomposition on them and then stack the results back
        //   together. We should explore whether this can be parallelized.
        const outerDimsProd = x.shape.slice(0, x.shape.length - 2)
            .reduce((value, prev) => value * prev);
        const x2ds = unstack(reshape(x, [
            outerDimsProd, x.shape[x.shape.length - 2],
            x.shape[x.shape.length - 1]
        ]), 0);
        const q2ds = [];
        const r2ds = [];
        x2ds.forEach(x2d => {
            const [q2d, r2d] = qr2d(x2d, fullMatrices);
            q2ds.push(q2d);
            r2ds.push(r2d);
        });
        const q = reshape(stack(q2ds, 0), x.shape);
        const r = reshape(stack(r2ds, 0), x.shape);
        return [q, r];
    }
}
function qr2d(x, fullMatrices = false) {
    return ENGINE.tidy(() => {
        assert(x.shape.length === 2, () => `qr2d() requires a 2D Tensor, but got a ${x.shape.length}D Tensor.`);
        const m = x.shape[0];
        const n = x.shape[1];
        let q = eye(m); // Orthogonal transform so far.
        let r = clone(x); // Transformed matrix so far.
        const one2D = tensor2d([[1]], [1, 1]);
        let w = clone(one2D);
        const iters = m >= n ? n : m;
        for (let j = 0; j < iters; ++j) {
            // This tidy within the for-loop ensures we clean up temporary
            // tensors as soon as they are no longer needed.
            const rTemp = r;
            const wTemp = w;
            const qTemp = q;
            [w, r, q] = ENGINE.tidy(() => {
                // Find H = I - tau * w * w', to put zeros below R(j, j).
                const rjEnd1 = slice(r, [j, j], [m - j, 1]);
                const normX = norm(rjEnd1);
                const rjj = slice(r, [j, j], [1, 1]);
                // The sign() function returns 0 on 0, which causes division by zero.
                const s = where(greater(rjj, 0), tensor2d([[-1]]), tensor2d([[1]]));
                const u1 = sub(rjj, mul(s, normX));
                const wPre = div(rjEnd1, u1);
                if (wPre.shape[0] === 1) {
                    w = clone(one2D);
                }
                else {
                    w = concat([
                        one2D,
                        slice(wPre, [1, 0], [wPre.shape[0] - 1, wPre.shape[1]])
                    ], 0);
                }
                const tau = neg(div(matMul(s, u1), normX));
                // -- R := HR, Q := QH.
                const rjEndAll = slice(r, [j, 0], [m - j, n]);
                const tauTimesW = mul(tau, w);
                const wT = transpose(w);
                if (j === 0) {
                    r = sub(rjEndAll, matMul(tauTimesW, matMul(wT, rjEndAll)));
                }
                else {
                    const rTimesTau = sub(rjEndAll, matMul(tauTimesW, matMul(wT, rjEndAll)));
                    r = concat([slice(r, [0, 0], [j, n]), rTimesTau], 0);
                }
                const tawTimesWT = transpose(tauTimesW);
                const qAllJEnd = slice(q, [0, j], [m, q.shape[1] - j]);
                if (j === 0) {
                    q = sub(qAllJEnd, matMul(matMul(qAllJEnd, w), tawTimesWT));
                }
                else {
                    const qTimesTau = sub(qAllJEnd, matMul(matMul(qAllJEnd, w), tawTimesWT));
                    q = concat([slice(q, [0, 0], [m, j]), qTimesTau], 1);
                }
                return [w, r, q];
            });
            dispose([rTemp, wTemp, qTemp]);
        }
        if (!fullMatrices && m > n) {
            q = slice(q, [0, 0], [m, n]);
            r = slice(r, [0, 0], [n, n]);
        }
        return [q, r];
    });
}
export const qr = op({ qr_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9saW5hbGcvcXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXRDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFbEMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDM0IsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbEMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUMzQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzNCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDN0IsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNoQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzNCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDckMs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Q0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDNUQ7cUJBQU07b0JBQ0wsTUFBTSxTQUFTLEdBQ1gsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN0RDtnQkFDRCxNQUFNLFVBQVUsR0FBYSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ1gsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztpQkFDNUQ7cUJBQU07b0JBQ0wsTUFBTSxTQUFTLEdBQ1gsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUMzRCxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN0RDtnQkFDRCxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNoQztRQUVELElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMxQixDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDOUI7UUFFRCxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLENBQUMsQ0FBeUIsQ0FBQztBQUM3QixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge0VOR0lORX0gZnJvbSAnLi4vLi4vZW5naW5lJztcbmltcG9ydCB7ZGlzcG9zZX0gZnJvbSAnLi4vLi4vZ2xvYmFscyc7XG5pbXBvcnQge1RlbnNvciwgVGVuc29yMkR9IGZyb20gJy4uLy4uL3RlbnNvcic7XG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmltcG9ydCB7Y2xvbmV9IGZyb20gJy4uL2Nsb25lJztcbmltcG9ydCB7Y29uY2F0fSBmcm9tICcuLi9jb25jYXQnO1xuaW1wb3J0IHtkaXZ9IGZyb20gJy4uL2Rpdic7XG5pbXBvcnQge2V5ZX0gZnJvbSAnLi4vZXllJztcbmltcG9ydCB7Z3JlYXRlcn0gZnJvbSAnLi4vZ3JlYXRlcic7XG5pbXBvcnQge21hdE11bH0gZnJvbSAnLi4vbWF0X211bCc7XG5pbXBvcnQge211bH0gZnJvbSAnLi4vbXVsJztcbmltcG9ydCB7bmVnfSBmcm9tICcuLi9uZWcnO1xuaW1wb3J0IHtub3JtfSBmcm9tICcuLi9ub3JtJztcbmltcG9ydCB7b3B9IGZyb20gJy4uL29wZXJhdGlvbic7XG5pbXBvcnQge3Jlc2hhcGV9IGZyb20gJy4uL3Jlc2hhcGUnO1xuaW1wb3J0IHtzbGljZX0gZnJvbSAnLi4vc2xpY2UnO1xuaW1wb3J0IHtzdGFja30gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHtzdWJ9IGZyb20gJy4uL3N1Yic7XG5pbXBvcnQge3RlbnNvcjJkfSBmcm9tICcuLi90ZW5zb3IyZCc7XG5pbXBvcnQge3RyYW5zcG9zZX0gZnJvbSAnLi4vdHJhbnNwb3NlJztcbmltcG9ydCB7dW5zdGFja30gZnJvbSAnLi4vdW5zdGFjayc7XG5pbXBvcnQge3doZXJlfSBmcm9tICcuLi93aGVyZSc7XG5cbi8qKlxuICogQ29tcHV0ZSBRUiBkZWNvbXBvc2l0aW9uIG9mIG0tYnktbiBtYXRyaXggdXNpbmcgSG91c2Vob2xkZXIgdHJhbnNmb3JtYXRpb24uXG4gKlxuICogSW1wbGVtZW50YXRpb24gYmFzZWQgb25cbiAqICAgW2h0dHA6Ly93d3cuY3MuY29ybmVsbC5lZHUvfmJpbmRlbC9jbGFzcy9jczYyMTAtZjA5L2xlYzE4LnBkZl1cbiAqIChodHRwOi8vd3d3LmNzLmNvcm5lbGwuZWR1L35iaW5kZWwvY2xhc3MvY3M2MjEwLWYwOS9sZWMxOC5wZGYpXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbWzEsIDJdLCBbMywgNF1dKTtcbiAqIGxldCBbcSwgcl0gPSB0Zi5saW5hbGcucXIoYSk7XG4gKiBjb25zb2xlLmxvZygnUScpO1xuICogcS5wcmludCgpO1xuICogY29uc29sZS5sb2coJ1InKTtcbiAqIHIucHJpbnQoKTtcbiAqIGNvbnNvbGUubG9nKCdPcnRob2dvbmFsaXplZCcpO1xuICogcS5kb3QocS50cmFuc3Bvc2UoKSkucHJpbnQoKSAgLy8gc2hvdWxkIGJlIG5lYXJseSB0aGUgaWRlbnRpdHkgbWF0cml4LlxuICogY29uc29sZS5sb2coJ1JlY29uc3RydWN0ZWQnKTtcbiAqIHEuZG90KHIpLnByaW50KCk7IC8vIHNob3VsZCBiZSBuZWFybHkgW1sxLCAyXSwgWzMsIDRdXTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB4IFRoZSBgdGYuVGVuc29yYCB0byBiZSBRUi1kZWNvbXBvc2VkLiBNdXN0IGhhdmUgcmFuayA+PSAyLiBTdXBwb3NlXG4gKiAgIGl0IGhhcyB0aGUgc2hhcGUgYFsuLi4sIE0sIE5dYC5cbiAqIEBwYXJhbSBmdWxsTWF0cmljZXMgQW4gb3B0aW9uYWwgYm9vbGVhbiBwYXJhbWV0ZXIuIERlZmF1bHRzIHRvIGBmYWxzZWAuXG4gKiAgIElmIGB0cnVlYCwgY29tcHV0ZSBmdWxsLXNpemVkIGBRYC4gSWYgYGZhbHNlYCAodGhlIGRlZmF1bHQpLFxuICogICBjb21wdXRlIG9ubHkgdGhlIGxlYWRpbmcgTiBjb2x1bW5zIG9mIGBRYCBhbmQgYFJgLlxuICogQHJldHVybnMgQW4gYEFycmF5YCBvZiB0d28gYHRmLlRlbnNvcmBzOiBgW1EsIFJdYC4gYFFgIGlzIGEgdW5pdGFyeSBtYXRyaXgsXG4gKiAgIGkuZS4sIGl0cyBjb2x1bW5zIGFsbCBoYXZlIHVuaXQgbm9ybSBhbmQgYXJlIG11dHVhbGx5IG9ydGhvZ29uYWwuXG4gKiAgIElmIGBNID49IE5gLFxuICogICAgIElmIGBmdWxsTWF0cmljZXNgIGlzIGBmYWxzZWAgKGRlZmF1bHQpLFxuICogICAgICAgLSBgUWAgaGFzIGEgc2hhcGUgb2YgYFsuLi4sIE0sIE5dYCxcbiAqICAgICAgIC0gYFJgIGhhcyBhIHNoYXBlIG9mIGBbLi4uLCBOLCBOXWAuXG4gKiAgICAgSWYgYGZ1bGxNYXRyaWNlc2AgaXMgYHRydWVgIChkZWZhdWx0KSxcbiAqICAgICAgIC0gYFFgIGhhcyBhIHNoYXBlIG9mIGBbLi4uLCBNLCBNXWAsXG4gKiAgICAgICAtIGBSYCBoYXMgYSBzaGFwZSBvZiBgWy4uLiwgTSwgTl1gLlxuICogICBJZiBgTSA8IE5gLFxuICogICAgIC0gYFFgIGhhcyBhIHNoYXBlIG9mIGBbLi4uLCBNLCBNXWAsXG4gKiAgICAgLSBgUmAgaGFzIGEgc2hhcGUgb2YgYFsuLi4sIE0sIE5dYC5cbiAqIEB0aHJvd3MgSWYgdGhlIHJhbmsgb2YgYHhgIGlzIGxlc3MgdGhhbiAyLlxuICpcbiAqIEBkb2Mge2hlYWRpbmc6J09wZXJhdGlvbnMnLFxuICogICAgICAgc3ViaGVhZGluZzonTGluZWFyIEFsZ2VicmEnLFxuICogICAgICAgbmFtZXNwYWNlOidsaW5hbGcnfVxuICovXG5mdW5jdGlvbiBxcl8oeDogVGVuc29yLCBmdWxsTWF0cmljZXMgPSBmYWxzZSk6IFtUZW5zb3IsIFRlbnNvcl0ge1xuICBhc3NlcnQoXG4gICAgICB4LnJhbmsgPj0gMixcbiAgICAgICgpID0+IGBxcigpIHJlcXVpcmVzIGlucHV0IHRlbnNvciB0byBoYXZlIGEgcmFuayA+PSAyLCBidXQgZ290IHJhbmsgJHtcbiAgICAgICAgICB4LnJhbmt9YCk7XG5cbiAgaWYgKHgucmFuayA9PT0gMikge1xuICAgIHJldHVybiBxcjJkKHggYXMgVGVuc29yMkQsIGZ1bGxNYXRyaWNlcyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gUmFuayA+IDIuXG4gICAgLy8gVE9ETyhjYWlzKTogQmVsb3cgd2Ugc3BsaXQgdGhlIGlucHV0IGludG8gaW5kaXZpZHVhbCAyRCB0ZW5zb3JzLFxuICAgIC8vICAgcGVyZm9ybSBRUiBkZWNvbXBvc2l0aW9uIG9uIHRoZW0gYW5kIHRoZW4gc3RhY2sgdGhlIHJlc3VsdHMgYmFja1xuICAgIC8vICAgdG9nZXRoZXIuIFdlIHNob3VsZCBleHBsb3JlIHdoZXRoZXIgdGhpcyBjYW4gYmUgcGFyYWxsZWxpemVkLlxuICAgIGNvbnN0IG91dGVyRGltc1Byb2QgPSB4LnNoYXBlLnNsaWNlKDAsIHguc2hhcGUubGVuZ3RoIC0gMilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKHZhbHVlLCBwcmV2KSA9PiB2YWx1ZSAqIHByZXYpO1xuICAgIGNvbnN0IHgyZHMgPSB1bnN0YWNrKFxuICAgICAgICByZXNoYXBlKFxuICAgICAgICAgICAgeCxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgb3V0ZXJEaW1zUHJvZCwgeC5zaGFwZVt4LnNoYXBlLmxlbmd0aCAtIDJdLFxuICAgICAgICAgICAgICB4LnNoYXBlW3guc2hhcGUubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgIF0pLFxuICAgICAgICAwKTtcbiAgICBjb25zdCBxMmRzOiBUZW5zb3IyRFtdID0gW107XG4gICAgY29uc3QgcjJkczogVGVuc29yMkRbXSA9IFtdO1xuICAgIHgyZHMuZm9yRWFjaCh4MmQgPT4ge1xuICAgICAgY29uc3QgW3EyZCwgcjJkXSA9IHFyMmQoeDJkIGFzIFRlbnNvcjJELCBmdWxsTWF0cmljZXMpO1xuICAgICAgcTJkcy5wdXNoKHEyZCk7XG4gICAgICByMmRzLnB1c2gocjJkKTtcbiAgICB9KTtcbiAgICBjb25zdCBxID0gcmVzaGFwZShzdGFjayhxMmRzLCAwKSwgeC5zaGFwZSk7XG4gICAgY29uc3QgciA9IHJlc2hhcGUoc3RhY2socjJkcywgMCksIHguc2hhcGUpO1xuICAgIHJldHVybiBbcSwgcl07XG4gIH1cbn1cblxuZnVuY3Rpb24gcXIyZCh4OiBUZW5zb3IyRCwgZnVsbE1hdHJpY2VzID0gZmFsc2UpOiBbVGVuc29yMkQsIFRlbnNvcjJEXSB7XG4gIHJldHVybiBFTkdJTkUudGlkeSgoKSA9PiB7XG4gICAgYXNzZXJ0KFxuICAgICAgICB4LnNoYXBlLmxlbmd0aCA9PT0gMixcbiAgICAgICAgKCkgPT4gYHFyMmQoKSByZXF1aXJlcyBhIDJEIFRlbnNvciwgYnV0IGdvdCBhICR7XG4gICAgICAgICAgICB4LnNoYXBlLmxlbmd0aH1EIFRlbnNvci5gKTtcblxuICAgIGNvbnN0IG0gPSB4LnNoYXBlWzBdO1xuICAgIGNvbnN0IG4gPSB4LnNoYXBlWzFdO1xuXG4gICAgbGV0IHEgPSBleWUobSk7ICAgIC8vIE9ydGhvZ29uYWwgdHJhbnNmb3JtIHNvIGZhci5cbiAgICBsZXQgciA9IGNsb25lKHgpOyAgLy8gVHJhbnNmb3JtZWQgbWF0cml4IHNvIGZhci5cblxuICAgIGNvbnN0IG9uZTJEID0gdGVuc29yMmQoW1sxXV0sIFsxLCAxXSk7XG4gICAgbGV0IHc6IFRlbnNvcjJEID0gY2xvbmUob25lMkQpO1xuXG4gICAgY29uc3QgaXRlcnMgPSBtID49IG4gPyBuIDogbTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGl0ZXJzOyArK2opIHtcbiAgICAgIC8vIFRoaXMgdGlkeSB3aXRoaW4gdGhlIGZvci1sb29wIGVuc3VyZXMgd2UgY2xlYW4gdXAgdGVtcG9yYXJ5XG4gICAgICAvLyB0ZW5zb3JzIGFzIHNvb24gYXMgdGhleSBhcmUgbm8gbG9uZ2VyIG5lZWRlZC5cbiAgICAgIGNvbnN0IHJUZW1wID0gcjtcbiAgICAgIGNvbnN0IHdUZW1wID0gdztcbiAgICAgIGNvbnN0IHFUZW1wID0gcTtcbiAgICAgIFt3LCByLCBxXSA9IEVOR0lORS50aWR5KCgpOiBbVGVuc29yMkQsIFRlbnNvcjJELCBUZW5zb3IyRF0gPT4ge1xuICAgICAgICAvLyBGaW5kIEggPSBJIC0gdGF1ICogdyAqIHcnLCB0byBwdXQgemVyb3MgYmVsb3cgUihqLCBqKS5cbiAgICAgICAgY29uc3QgcmpFbmQxID0gc2xpY2UociwgW2osIGpdLCBbbSAtIGosIDFdKTtcbiAgICAgICAgY29uc3Qgbm9ybVggPSBub3JtKHJqRW5kMSk7XG4gICAgICAgIGNvbnN0IHJqaiA9IHNsaWNlKHIsIFtqLCBqXSwgWzEsIDFdKTtcblxuICAgICAgICAvLyBUaGUgc2lnbigpIGZ1bmN0aW9uIHJldHVybnMgMCBvbiAwLCB3aGljaCBjYXVzZXMgZGl2aXNpb24gYnkgemVyby5cbiAgICAgICAgY29uc3QgcyA9IHdoZXJlKGdyZWF0ZXIocmpqLCAwKSwgdGVuc29yMmQoW1stMV1dKSwgdGVuc29yMmQoW1sxXV0pKTtcblxuICAgICAgICBjb25zdCB1MSA9IHN1YihyamosIG11bChzLCBub3JtWCkpO1xuICAgICAgICBjb25zdCB3UHJlID0gZGl2KHJqRW5kMSwgdTEpO1xuICAgICAgICBpZiAod1ByZS5zaGFwZVswXSA9PT0gMSkge1xuICAgICAgICAgIHcgPSBjbG9uZShvbmUyRCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdyA9IGNvbmNhdChcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIG9uZTJELFxuICAgICAgICAgICAgICAgIHNsaWNlKHdQcmUsIFsxLCAwXSwgW3dQcmUuc2hhcGVbMF0gLSAxLCB3UHJlLnNoYXBlWzFdXSkgYXNcbiAgICAgICAgICAgICAgICAgICAgVGVuc29yMkRcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgMCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGF1ID0gbmVnKGRpdihtYXRNdWwocywgdTEpLCBub3JtWCkpIGFzIFRlbnNvcjJEO1xuXG4gICAgICAgIC8vIC0tIFIgOj0gSFIsIFEgOj0gUUguXG4gICAgICAgIGNvbnN0IHJqRW5kQWxsID0gc2xpY2UociwgW2osIDBdLCBbbSAtIGosIG5dKTtcbiAgICAgICAgY29uc3QgdGF1VGltZXNXOiBUZW5zb3IyRCA9IG11bCh0YXUsIHcpO1xuICAgICAgICBjb25zdCB3VDogVGVuc29yMkQgPSB0cmFuc3Bvc2Uodyk7XG4gICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgciA9IHN1YihyakVuZEFsbCwgbWF0TXVsKHRhdVRpbWVzVywgbWF0TXVsKHdULCByakVuZEFsbCkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCByVGltZXNUYXU6IFRlbnNvcjJEID1cbiAgICAgICAgICAgICAgc3ViKHJqRW5kQWxsLCBtYXRNdWwodGF1VGltZXNXLCBtYXRNdWwod1QsIHJqRW5kQWxsKSkpO1xuICAgICAgICAgIHIgPSBjb25jYXQoW3NsaWNlKHIsIFswLCAwXSwgW2osIG5dKSwgclRpbWVzVGF1XSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdGF3VGltZXNXVDogVGVuc29yMkQgPSB0cmFuc3Bvc2UodGF1VGltZXNXKTtcbiAgICAgICAgY29uc3QgcUFsbEpFbmQgPSBzbGljZShxLCBbMCwgal0sIFttLCBxLnNoYXBlWzFdIC0gal0pO1xuICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgIHEgPSBzdWIocUFsbEpFbmQsIG1hdE11bChtYXRNdWwocUFsbEpFbmQsIHcpLCB0YXdUaW1lc1dUKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgcVRpbWVzVGF1OiBUZW5zb3IyRCA9XG4gICAgICAgICAgICAgIHN1YihxQWxsSkVuZCwgbWF0TXVsKG1hdE11bChxQWxsSkVuZCwgdyksIHRhd1RpbWVzV1QpKTtcbiAgICAgICAgICBxID0gY29uY2F0KFtzbGljZShxLCBbMCwgMF0sIFttLCBqXSksIHFUaW1lc1RhdV0sIDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbdywgciwgcV07XG4gICAgICB9KTtcbiAgICAgIGRpc3Bvc2UoW3JUZW1wLCB3VGVtcCwgcVRlbXBdKTtcbiAgICB9XG5cbiAgICBpZiAoIWZ1bGxNYXRyaWNlcyAmJiBtID4gbikge1xuICAgICAgcSA9IHNsaWNlKHEsIFswLCAwXSwgW20sIG5dKTtcbiAgICAgIHIgPSBzbGljZShyLCBbMCwgMF0sIFtuLCBuXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtxLCByXTtcbiAgfSkgYXMgW1RlbnNvcjJELCBUZW5zb3IyRF07XG59XG5cbmV4cG9ydCBjb25zdCBxciA9IG9wKHtxcl99KTtcbiJdfQ==