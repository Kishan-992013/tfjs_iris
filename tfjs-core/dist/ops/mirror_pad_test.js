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
import * as tf from '../index';
import { ALL_ENVS, describeWithFlags } from '../jasmine_util';
import { expectArraysClose } from '../test_util';
describeWithFlags('mirrorPad', ALL_ENVS, () => {
    it('MirrorPad tensor1d', async () => {
        const a = tf.tensor1d([1, 2, 3], 'int32');
        let b = tf.mirrorPad(a, [[2, 2]], 'reflect');
        expectArraysClose(await b.data(), [3, 2, 1, 2, 3, 2, 1]);
        expect(b.shape).toEqual([7]);
        b = tf.mirrorPad(a, [[2, 2]], 'symmetric');
        expectArraysClose(await b.data(), [2, 1, 1, 2, 3, 3, 2]);
        expect(b.shape).toEqual([7]);
    });
    it('MirrorPad tensor2d', async () => {
        const a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
        let b = tf.mirrorPad(a, [[1, 1], [1, 1]], 'reflect');
        // 5, 4, 5, 6, 5
        // 2, 1, 2, 3, 2
        // 5, 4, 5, 6, 5
        // 2, 1, 2, 3, 2
        expectArraysClose(await b.data(), [5, 4, 5, 6, 5, 2, 1, 2, 3, 2, 5, 4, 5, 6, 5, 2, 1, 2, 3, 2]);
        expect(b.shape).toEqual([4, 5]);
        b = tf.mirrorPad(a, [[1, 1], [1, 1]], 'symmetric');
        // 1, 1, 2, 3, 3
        // 1, 1, 2, 3, 3
        // 4, 4, 5, 6, 6
        // 4, 4, 5, 6, 6
        expectArraysClose(await b.data(), [1, 1, 2, 3, 3, 1, 1, 2, 3, 3, 4, 4, 5, 6, 6, 4, 4, 5, 6, 6]);
        expect(b.shape).toEqual([4, 5]);
    });
    it('MirrorPad tensor3d', async () => {
        const a = tf.tensor3d([[[1, 2]], [[3, 4]]], [2, 1, 2], 'int32');
        let b = tf.mirrorPad(a, [[1, 1], [0, 0], [1, 1]], 'reflect');
        // 4, 3, 4, 3
        // 2, 1, 2, 1
        // 4, 3, 4, 3
        // 2, 1, 2, 1
        expectArraysClose(await b.data(), [4, 3, 4, 3, 2, 1, 2, 1, 4, 3, 4, 3, 2, 1, 2, 1]);
        expect(b.shape).toEqual([4, 1, 4]);
        b = tf.mirrorPad(a, [[1, 1], [0, 0], [1, 1]], 'symmetric');
        // 1, 1, 2, 2
        // 1, 1, 2, 2
        // 3, 3, 4, 4
        // 3, 3, 4, 4
        expectArraysClose(await b.data(), [1, 1, 2, 2, 1, 1, 2, 2, 3, 3, 4, 4, 3, 3, 4, 4]);
        expect(b.shape).toEqual([4, 1, 4]);
    });
    it('MirrorPad tensor4d', async () => {
        const a = tf.tensor4d([[[[1, 2, 3, 4]]]], [1, 1, 1, 4], 'int32');
        let b = tf.mirrorPad(a, [[0, 0], [0, 0], [0, 0], [1, 1]], 'reflect');
        let expected = tf.tensor4d([[[[2, 1, 2, 3, 4, 3]]]], [1, 1, 1, 6], 'int32');
        expectArraysClose(await b.data(), await expected.data());
        expect(b.dtype).toBe('int32');
        expect(b.shape).toEqual([1, 1, 1, 6]);
        b = tf.mirrorPad(a, [[0, 0], [0, 0], [0, 0], [1, 1]], 'symmetric');
        expected = tf.tensor4d([[[[1, 1, 2, 3, 4, 4]]]], [1, 1, 1, 6], 'int32');
        expectArraysClose(await b.data(), await expected.data());
        expect(b.shape).toEqual([1, 1, 1, 6]);
    });
    it('throws when passed a non-tensor', () => {
        expect(() => tf.mirrorPad({}, [[0, 0]], 'reflect'))
            .toThrowError(/Argument 'x' passed to 'mirrorPad' must be a Tensor/);
    });
    it('does not leak memory', () => {
        const a = tf.tensor4d([[[[1, 2, 3, 4]]]], [1, 1, 1, 4], 'int32');
        // The first call to mirrorPad may create and keeps internal
        // singleton tensors. Subsequent calls should always create exactly
        // one new tensor.
        tf.mirrorPad(a, [[0, 0], [0, 0], [0, 0], [1, 1]], 'reflect');
        // Count before real call.
        const numTensors = tf.memory().numTensors;
        tf.mirrorPad(a, [[0, 0], [0, 0], [0, 0], [1, 1]], 'reflect');
        expect(tf.memory().numTensors).toEqual(numTensors + 1);
    });
    it('accepts a tensor-like object', async () => {
        const x = [[1, 2, 3], [4, 5, 6]];
        const res = tf.mirrorPad(x, [[1, 1], [1, 1]], 'reflect');
        // 5, 4, 5, 6, 5
        // 2, 1, 2, 3, 2
        // 5, 4, 5, 6, 5
        // 2, 1, 2, 3, 2
        expectArraysClose(await res.data(), [5, 4, 5, 6, 5, 2, 1, 2, 3, 2, 5, 4, 5, 6, 5, 2, 1, 2, 3, 2]);
        expect(res.shape).toEqual([4, 5]);
    });
    it('Should handle invalid paddings', () => {
        const a = tf.tensor1d([1, 2, 3, 4], 'int32');
        const f = () => {
            // tslint:disable-next-line:no-any
            tf.mirrorPad(a, [2, 2, 2], 'reflect');
        };
        expect(f).toThrowError();
    });
    it('Should handle paddings that are out of range', () => {
        const a = tf.tensor2d([[1, 2, 3], [4, 5, 6]], [2, 3], 'int32');
        let f = () => {
            // tslint:disable-next-line:no-any
            tf.mirrorPad(a, [[4, 1], [1, 1]], 'reflect');
        };
        expect(f).toThrowError();
        f = () => {
            // tslint:disable-next-line:no-any
            tf.mirrorPad(a, [[-1, 1], [1, 1]], 'reflect');
        };
        expect(f).toThrowError();
        f = () => {
            // tslint:disable-next-line:no-any
            tf.mirrorPad(a, [[2, 1], [1, 1]], 'reflect');
        };
        expect(f).toThrowError();
        f = () => {
            // tslint:disable-next-line:no-any
            tf.mirrorPad(a, [[3, 1], [1, 1]], 'symmetric');
        };
        expect(f).toThrowError();
    });
    it('Should handle NaNs', async () => {
        const a = tf.tensor2d([[1, NaN], [1, NaN]], [2, 2]);
        const b = tf.mirrorPad(a, [[1, 1], [1, 1]], 'reflect');
        // NaN, 1, NaN, 1
        // NaN, 1, NaN, 1
        // NaN, 1, NaN, 1
        // NaN, 1, NaN, 1
        expectArraysClose(await b.data(), [NaN, 1, NaN, 1, NaN, 1, NaN, 1, NaN, 1, NaN, 1, NaN, 1, NaN, 1]);
        expect(b.shape).toEqual([4, 4]);
    });
    it('grad', async () => {
        const a = tf.tensor1d([1, 2, 3]);
        const dy = tf.tensor1d([10, 20, 30, 40, 50, 60]);
        const da = tf.grad((a) => tf.mirrorPad(a, [[2, 1]], 'reflect'))(a, dy);
        expect(da.shape).toEqual([3]);
        expectArraysClose(await da.data(), [30, 40, 50]);
    });
    it('gradient with clones', async () => {
        const a = tf.tensor1d([1, 2, 3]);
        const dy = tf.tensor1d([10, 20, 30, 40, 50, 60]);
        const da = tf.grad((a) => tf.mirrorPad(a.clone(), [[2, 1]], 'reflect').clone())(a, dy);
        expect(da.shape).toEqual([3]);
        expectArraysClose(await da.data(), [30, 40, 50]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlycm9yX3BhZF90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvbWlycm9yX3BhZF90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFL0MsaUJBQWlCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDNUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdCLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDM0MsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNyRCxnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLGdCQUFnQjtRQUNoQixnQkFBZ0I7UUFDaEIsaUJBQWlCLENBQ2IsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQ2QsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWhDLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbkQsZ0JBQWdCO1FBQ2hCLGdCQUFnQjtRQUNoQixnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLGlCQUFpQixDQUNiLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUNkLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0QsYUFBYTtRQUViLGFBQWE7UUFFYixhQUFhO1FBRWIsYUFBYTtRQUNiLGlCQUFpQixDQUNiLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVuQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzNELGFBQWE7UUFFYixhQUFhO1FBRWIsYUFBYTtRQUViLGFBQWE7UUFDYixpQkFBaUIsQ0FDYixNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEUsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNuRSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN4RSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDekMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUMzRCxZQUFZLENBQUMscURBQXFELENBQUMsQ0FBQztJQUMzRSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDOUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakUsNERBQTREO1FBQzVELG1FQUFtRTtRQUNuRSxrQkFBa0I7UUFDbEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdELDBCQUEwQjtRQUMxQixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3pELGdCQUFnQjtRQUNoQixnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLGdCQUFnQjtRQUNoQixpQkFBaUIsQ0FDYixNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFDaEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtRQUN4QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQ2Isa0NBQWtDO1lBQ2xDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0IsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQ1gsa0NBQWtDO1lBQ2xDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFekIsQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUNQLGtDQUFrQztZQUNsQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFekIsQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUNQLGtDQUFrQztZQUNsQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXpCLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFDUCxrQ0FBa0M7WUFDbEMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2RCxpQkFBaUI7UUFDakIsaUJBQWlCO1FBQ2pCLGlCQUFpQjtRQUNqQixpQkFBaUI7UUFDakIsaUJBQWlCLENBQ2IsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQ2QsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUNkLENBQUMsQ0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUNkLENBQUMsQ0FBYyxFQUFFLEVBQUUsQ0FDZixFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ21pcnJvclBhZCcsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdNaXJyb3JQYWQgdGVuc29yMWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSwgJ2ludDMyJyk7XG4gICAgbGV0IGIgPSB0Zi5taXJyb3JQYWQoYSwgW1syLCAyXV0sICdyZWZsZWN0Jyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYi5kYXRhKCksIFszLCAyLCAxLCAyLCAzLCAyLCAxXSk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzddKTtcblxuICAgIGIgPSB0Zi5taXJyb3JQYWQoYSwgW1syLCAyXV0sICdzeW1tZXRyaWMnKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBiLmRhdGEoKSwgWzIsIDEsIDEsIDIsIDMsIDMsIDJdKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbN10pO1xuICB9KTtcblxuICBpdCgnTWlycm9yUGFkIHRlbnNvcjJkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbWzEsIDIsIDNdLCBbNCwgNSwgNl1dLCBbMiwgM10sICdpbnQzMicpO1xuICAgIGxldCBiID0gdGYubWlycm9yUGFkKGEsIFtbMSwgMV0sIFsxLCAxXV0sICdyZWZsZWN0Jyk7XG4gICAgLy8gNSwgNCwgNSwgNiwgNVxuICAgIC8vIDIsIDEsIDIsIDMsIDJcbiAgICAvLyA1LCA0LCA1LCA2LCA1XG4gICAgLy8gMiwgMSwgMiwgMywgMlxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCBiLmRhdGEoKSxcbiAgICAgICAgWzUsIDQsIDUsIDYsIDUsIDIsIDEsIDIsIDMsIDIsIDUsIDQsIDUsIDYsIDUsIDIsIDEsIDIsIDMsIDJdKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbNCwgNV0pO1xuXG4gICAgYiA9IHRmLm1pcnJvclBhZChhLCBbWzEsIDFdLCBbMSwgMV1dLCAnc3ltbWV0cmljJyk7XG4gICAgLy8gMSwgMSwgMiwgMywgM1xuICAgIC8vIDEsIDEsIDIsIDMsIDNcbiAgICAvLyA0LCA0LCA1LCA2LCA2XG4gICAgLy8gNCwgNCwgNSwgNiwgNlxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCBiLmRhdGEoKSxcbiAgICAgICAgWzEsIDEsIDIsIDMsIDMsIDEsIDEsIDIsIDMsIDMsIDQsIDQsIDUsIDYsIDYsIDQsIDQsIDUsIDYsIDZdKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbNCwgNV0pO1xuICB9KTtcblxuICBpdCgnTWlycm9yUGFkIHRlbnNvcjNkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IzZChbW1sxLCAyXV0sIFtbMywgNF1dXSwgWzIsIDEsIDJdLCAnaW50MzInKTtcbiAgICBsZXQgYiA9IHRmLm1pcnJvclBhZChhLCBbWzEsIDFdLCBbMCwgMF0sIFsxLCAxXV0sICdyZWZsZWN0Jyk7XG4gICAgLy8gNCwgMywgNCwgM1xuXG4gICAgLy8gMiwgMSwgMiwgMVxuXG4gICAgLy8gNCwgMywgNCwgM1xuXG4gICAgLy8gMiwgMSwgMiwgMVxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCBiLmRhdGEoKSwgWzQsIDMsIDQsIDMsIDIsIDEsIDIsIDEsIDQsIDMsIDQsIDMsIDIsIDEsIDIsIDFdKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbNCwgMSwgNF0pO1xuXG4gICAgYiA9IHRmLm1pcnJvclBhZChhLCBbWzEsIDFdLCBbMCwgMF0sIFsxLCAxXV0sICdzeW1tZXRyaWMnKTtcbiAgICAvLyAxLCAxLCAyLCAyXG5cbiAgICAvLyAxLCAxLCAyLCAyXG5cbiAgICAvLyAzLCAzLCA0LCA0XG5cbiAgICAvLyAzLCAzLCA0LCA0XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IGIuZGF0YSgpLCBbMSwgMSwgMiwgMiwgMSwgMSwgMiwgMiwgMywgMywgNCwgNCwgMywgMywgNCwgNF0pO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFs0LCAxLCA0XSk7XG4gIH0pO1xuXG4gIGl0KCdNaXJyb3JQYWQgdGVuc29yNGQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjRkKFtbW1sxLCAyLCAzLCA0XV1dXSwgWzEsIDEsIDEsIDRdLCAnaW50MzInKTtcbiAgICBsZXQgYiA9IHRmLm1pcnJvclBhZChhLCBbWzAsIDBdLCBbMCwgMF0sIFswLCAwXSwgWzEsIDFdXSwgJ3JlZmxlY3QnKTtcbiAgICBsZXQgZXhwZWN0ZWQgPSB0Zi50ZW5zb3I0ZChbW1tbMiwgMSwgMiwgMywgNCwgM11dXV0sIFsxLCAxLCAxLCA2XSwgJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYi5kYXRhKCksIGF3YWl0IGV4cGVjdGVkLmRhdGEoKSk7XG4gICAgZXhwZWN0KGIuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGIuc2hhcGUpLnRvRXF1YWwoWzEsIDEsIDEsIDZdKTtcblxuICAgIGIgPSB0Zi5taXJyb3JQYWQoYSwgW1swLCAwXSwgWzAsIDBdLCBbMCwgMF0sIFsxLCAxXV0sICdzeW1tZXRyaWMnKTtcbiAgICBleHBlY3RlZCA9IHRmLnRlbnNvcjRkKFtbW1sxLCAxLCAyLCAzLCA0LCA0XV1dXSwgWzEsIDEsIDEsIDZdLCAnaW50MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBiLmRhdGEoKSwgYXdhaXQgZXhwZWN0ZWQuZGF0YSgpKTtcbiAgICBleHBlY3QoYi5zaGFwZSkudG9FcXVhbChbMSwgMSwgMSwgNl0pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIGEgbm9uLXRlbnNvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYubWlycm9yUGFkKHt9IGFzIHRmLlRlbnNvciwgW1swLCAwXV0sICdyZWZsZWN0JykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICd4JyBwYXNzZWQgdG8gJ21pcnJvclBhZCcgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnZG9lcyBub3QgbGVhayBtZW1vcnknLCAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjRkKFtbW1sxLCAyLCAzLCA0XV1dXSwgWzEsIDEsIDEsIDRdLCAnaW50MzInKTtcbiAgICAvLyBUaGUgZmlyc3QgY2FsbCB0byBtaXJyb3JQYWQgbWF5IGNyZWF0ZSBhbmQga2VlcHMgaW50ZXJuYWxcbiAgICAvLyBzaW5nbGV0b24gdGVuc29ycy4gU3Vic2VxdWVudCBjYWxscyBzaG91bGQgYWx3YXlzIGNyZWF0ZSBleGFjdGx5XG4gICAgLy8gb25lIG5ldyB0ZW5zb3IuXG4gICAgdGYubWlycm9yUGFkKGEsIFtbMCwgMF0sIFswLCAwXSwgWzAsIDBdLCBbMSwgMV1dLCAncmVmbGVjdCcpO1xuICAgIC8vIENvdW50IGJlZm9yZSByZWFsIGNhbGwuXG4gICAgY29uc3QgbnVtVGVuc29ycyA9IHRmLm1lbW9yeSgpLm51bVRlbnNvcnM7XG4gICAgdGYubWlycm9yUGFkKGEsIFtbMCwgMF0sIFswLCAwXSwgWzAsIDBdLCBbMSwgMV1dLCAncmVmbGVjdCcpO1xuICAgIGV4cGVjdCh0Zi5tZW1vcnkoKS5udW1UZW5zb3JzKS50b0VxdWFsKG51bVRlbnNvcnMgKyAxKTtcbiAgfSk7XG5cbiAgaXQoJ2FjY2VwdHMgYSB0ZW5zb3ItbGlrZSBvYmplY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IFtbMSwgMiwgM10sIFs0LCA1LCA2XV07XG4gICAgY29uc3QgcmVzID0gdGYubWlycm9yUGFkKHgsIFtbMSwgMV0sIFsxLCAxXV0sICdyZWZsZWN0Jyk7XG4gICAgLy8gNSwgNCwgNSwgNiwgNVxuICAgIC8vIDIsIDEsIDIsIDMsIDJcbiAgICAvLyA1LCA0LCA1LCA2LCA1XG4gICAgLy8gMiwgMSwgMiwgMywgMlxuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCByZXMuZGF0YSgpLFxuICAgICAgICBbNSwgNCwgNSwgNiwgNSwgMiwgMSwgMiwgMywgMiwgNSwgNCwgNSwgNiwgNSwgMiwgMSwgMiwgMywgMl0pO1xuICAgIGV4cGVjdChyZXMuc2hhcGUpLnRvRXF1YWwoWzQsIDVdKTtcbiAgfSk7XG5cbiAgaXQoJ1Nob3VsZCBoYW5kbGUgaW52YWxpZCBwYWRkaW5ncycsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdLCAnaW50MzInKTtcbiAgICBjb25zdCBmID0gKCkgPT4ge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgdGYubWlycm9yUGFkKGEsIFsyLCAyLCAyXSBhcyBhbnksICdyZWZsZWN0Jyk7XG4gICAgfTtcbiAgICBleHBlY3QoZikudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCdTaG91bGQgaGFuZGxlIHBhZGRpbmdzIHRoYXQgYXJlIG91dCBvZiByYW5nZScsICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoW1sxLCAyLCAzXSwgWzQsIDUsIDZdXSwgWzIsIDNdLCAnaW50MzInKTtcbiAgICBsZXQgZiA9ICgpID0+IHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgIHRmLm1pcnJvclBhZChhLCBbWzQsIDFdLCBbMSwgMV1dLCAncmVmbGVjdCcpO1xuICAgIH07XG4gICAgZXhwZWN0KGYpLnRvVGhyb3dFcnJvcigpO1xuXG4gICAgZiA9ICgpID0+IHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgIHRmLm1pcnJvclBhZChhLCBbWy0xLCAxXSwgWzEsIDFdXSwgJ3JlZmxlY3QnKTtcbiAgICB9O1xuICAgIGV4cGVjdChmKS50b1Rocm93RXJyb3IoKTtcblxuICAgIGYgPSAoKSA9PiB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICB0Zi5taXJyb3JQYWQoYSwgW1syLCAxXSwgWzEsIDFdXSwgJ3JlZmxlY3QnKTtcbiAgICB9O1xuICAgIGV4cGVjdChmKS50b1Rocm93RXJyb3IoKTtcblxuICAgIGYgPSAoKSA9PiB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICB0Zi5taXJyb3JQYWQoYSwgW1szLCAxXSwgWzEsIDFdXSwgJ3N5bW1ldHJpYycpO1xuICAgIH07XG4gICAgZXhwZWN0KGYpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgnU2hvdWxkIGhhbmRsZSBOYU5zJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbWzEsIE5hTl0sIFsxLCBOYU5dXSwgWzIsIDJdKTtcbiAgICBjb25zdCBiID0gdGYubWlycm9yUGFkKGEsIFtbMSwgMV0sIFsxLCAxXV0sICdyZWZsZWN0Jyk7XG4gICAgLy8gTmFOLCAxLCBOYU4sIDFcbiAgICAvLyBOYU4sIDEsIE5hTiwgMVxuICAgIC8vIE5hTiwgMSwgTmFOLCAxXG4gICAgLy8gTmFOLCAxLCBOYU4sIDFcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgYi5kYXRhKCksXG4gICAgICAgIFtOYU4sIDEsIE5hTiwgMSwgTmFOLCAxLCBOYU4sIDEsIE5hTiwgMSwgTmFOLCAxLCBOYU4sIDEsIE5hTiwgMV0pO1xuICAgIGV4cGVjdChiLnNoYXBlKS50b0VxdWFsKFs0LCA0XSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgMiwgM10pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMWQoWzEwLCAyMCwgMzAsIDQwLCA1MCwgNjBdKTtcbiAgICBjb25zdCBkYSA9IHRmLmdyYWQoXG4gICAgICAgIChhOiB0Zi5UZW5zb3IxRCkgPT4gdGYubWlycm9yUGFkKGEsIFtbMiwgMV1dLCAncmVmbGVjdCcpKShhLCBkeSk7XG4gICAgZXhwZWN0KGRhLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbMzAsIDQwLCA1MF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQgd2l0aCBjbG9uZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzXSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IxZChbMTAsIDIwLCAzMCwgNDAsIDUwLCA2MF0pO1xuICAgIGNvbnN0IGRhID0gdGYuZ3JhZChcbiAgICAgICAgKGE6IHRmLlRlbnNvcjFEKSA9PlxuICAgICAgICAgICAgdGYubWlycm9yUGFkKGEuY2xvbmUoKSwgW1syLCAxXV0sICdyZWZsZWN0JykuY2xvbmUoKSkoYSwgZHkpO1xuICAgIGV4cGVjdChkYS5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGRhLmRhdGEoKSwgWzMwLCA0MCwgNTBdKTtcbiAgfSk7XG59KTtcbiJdfQ==