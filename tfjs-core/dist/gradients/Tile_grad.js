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
import { Tile } from '../kernel_names';
import { add } from '../ops/add';
import { slice } from '../ops/slice';
import { zerosLike } from '../ops/zeros_like';
export const tileGradConfig = {
    kernelName: Tile,
    inputsToSave: ['x'],
    gradFunc: (dy, saved, attrs) => {
        const [x] = saved;
        const { reps } = attrs;
        const derX = () => {
            let xGrad = zerosLike(x);
            // TODO(cais): Maybe reduce memory footprint by avoiding repeated
            // slicing.
            if (x.rank === 1) {
                for (let i = 0; i < reps[0]; ++i) {
                    xGrad = add(xGrad, slice(dy, [i * x.shape[0]], [x.shape[0]]));
                }
            }
            else if (x.rank === 2) {
                for (let i = 0; i < reps[0]; ++i) {
                    for (let j = 0; j < reps[1]; ++j) {
                        xGrad = add(xGrad, slice(dy, [i * x.shape[0], j * x.shape[1]], [
                            x.shape[0], x.shape[1]
                        ]));
                    }
                }
            }
            else if (x.rank === 3) {
                for (let i = 0; i < reps[0]; ++i) {
                    for (let j = 0; j < reps[1]; ++j) {
                        for (let k = 0; k < reps[2]; ++k) {
                            xGrad =
                                add(xGrad, slice(dy, [i * x.shape[0], j * x.shape[1], k * x.shape[2]], [x.shape[0], x.shape[1], x.shape[2]]));
                        }
                    }
                }
            }
            else if (x.rank === 4) {
                for (let i = 0; i < reps[0]; ++i) {
                    for (let j = 0; j < reps[1]; ++j) {
                        for (let k = 0; k < reps[2]; ++k) {
                            for (let l = 0; l < reps[3]; ++l) {
                                xGrad =
                                    add(xGrad, slice(dy, [
                                        i * x.shape[0], j * x.shape[1], k * x.shape[2],
                                        l * x.shape[3]
                                    ], [x.shape[0], x.shape[1], x.shape[2], x.shape[3]]));
                            }
                        }
                    }
                }
            }
            else {
                throw new Error(`Gradient for tile operation is not implemented for rank-` +
                    `${x.rank} tensors yet.`);
            }
            return xGrad;
        };
        return { x: derX };
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGlsZV9ncmFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9ncmFkaWVudHMvVGlsZV9ncmFkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxJQUFJLEVBQVksTUFBTSxpQkFBaUIsQ0FBQztBQUVoRCxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDbkMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRzVDLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBZTtJQUN4QyxVQUFVLEVBQUUsSUFBSTtJQUNoQixZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkIsUUFBUSxFQUFFLENBQUMsRUFBVSxFQUFFLEtBQWUsRUFBRSxLQUFtQixFQUFFLEVBQUU7UUFDN0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNsQixNQUFNLEVBQUMsSUFBSSxFQUFDLEdBQUcsS0FBNkIsQ0FBQztRQUU3QyxNQUFNLElBQUksR0FBRyxHQUFHLEVBQUU7WUFDaEIsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLGlFQUFpRTtZQUNqRSxXQUFXO1lBQ1gsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtnQkFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDaEMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMvRDthQUNGO2lCQUFNLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7Z0JBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7b0JBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7d0JBQ2hDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOzRCQUNqRCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3lCQUN2QixDQUFDLENBQUMsQ0FBQztxQkFDakI7aUJBQ0Y7YUFDRjtpQkFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUN2QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO29CQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO3dCQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFOzRCQUNoQyxLQUFLO2dDQUNELEdBQUcsQ0FBQyxLQUFLLEVBQ0wsS0FBSyxDQUNELEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3BELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3BEO3FCQUNGO2lCQUNGO2FBQ0Y7aUJBQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtnQkFDdkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtvQkFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTt3QkFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTs0QkFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtnQ0FDaEMsS0FBSztvQ0FDRCxHQUFHLENBQUMsS0FBSyxFQUNMLEtBQUssQ0FDRCxFQUFFLEVBQ0Y7d0NBQ0UsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dDQUM5QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUNBQ2YsRUFDRCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ2hFO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FDWCwwREFBMEQ7b0JBQzFELEdBQUcsQ0FBQyxDQUFDLElBQUksZUFBZSxDQUFDLENBQUM7YUFDL0I7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQztRQUNGLE9BQU8sRUFBQyxDQUFDLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDbkIsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGlsZSwgVGlsZUF0dHJzfSBmcm9tICcuLi9rZXJuZWxfbmFtZXMnO1xuaW1wb3J0IHtHcmFkQ29uZmlnLCBOYW1lZEF0dHJNYXB9IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge2FkZH0gZnJvbSAnLi4vb3BzL2FkZCc7XG5pbXBvcnQge3NsaWNlfSBmcm9tICcuLi9vcHMvc2xpY2UnO1xuaW1wb3J0IHt6ZXJvc0xpa2V9IGZyb20gJy4uL29wcy96ZXJvc19saWtlJztcbmltcG9ydCB7VGVuc29yfSBmcm9tICcuLi90ZW5zb3InO1xuXG5leHBvcnQgY29uc3QgdGlsZUdyYWRDb25maWc6IEdyYWRDb25maWcgPSB7XG4gIGtlcm5lbE5hbWU6IFRpbGUsXG4gIGlucHV0c1RvU2F2ZTogWyd4J10sXG4gIGdyYWRGdW5jOiAoZHk6IFRlbnNvciwgc2F2ZWQ6IFRlbnNvcltdLCBhdHRyczogTmFtZWRBdHRyTWFwKSA9PiB7XG4gICAgY29uc3QgW3hdID0gc2F2ZWQ7XG4gICAgY29uc3Qge3JlcHN9ID0gYXR0cnMgYXMgdW5rbm93biBhcyBUaWxlQXR0cnM7XG5cbiAgICBjb25zdCBkZXJYID0gKCkgPT4ge1xuICAgICAgbGV0IHhHcmFkID0gemVyb3NMaWtlKHgpO1xuICAgICAgLy8gVE9ETyhjYWlzKTogTWF5YmUgcmVkdWNlIG1lbW9yeSBmb290cHJpbnQgYnkgYXZvaWRpbmcgcmVwZWF0ZWRcbiAgICAgIC8vIHNsaWNpbmcuXG4gICAgICBpZiAoeC5yYW5rID09PSAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVwc1swXTsgKytpKSB7XG4gICAgICAgICAgeEdyYWQgPSBhZGQoeEdyYWQsIHNsaWNlKGR5LCBbaSAqIHguc2hhcGVbMF1dLCBbeC5zaGFwZVswXV0pKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh4LnJhbmsgPT09IDIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXBzWzBdOyArK2kpIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlcHNbMV07ICsraikge1xuICAgICAgICAgICAgeEdyYWQgPSBhZGQoeEdyYWQsIHNsaWNlKGR5LCBbaSAqIHguc2hhcGVbMF0sIGogKiB4LnNoYXBlWzFdXSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICB4LnNoYXBlWzBdLCB4LnNoYXBlWzFdXG4gICAgICAgICAgICAgICAgICAgICAgICBdKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHgucmFuayA9PT0gMykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcHNbMF07ICsraSkge1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVwc1sxXTsgKytqKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHJlcHNbMl07ICsraykge1xuICAgICAgICAgICAgICB4R3JhZCA9XG4gICAgICAgICAgICAgICAgICBhZGQoeEdyYWQsXG4gICAgICAgICAgICAgICAgICAgICAgc2xpY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGR5LCBbaSAqIHguc2hhcGVbMF0sIGogKiB4LnNoYXBlWzFdLCBrICogeC5zaGFwZVsyXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFt4LnNoYXBlWzBdLCB4LnNoYXBlWzFdLCB4LnNoYXBlWzJdXSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh4LnJhbmsgPT09IDQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXBzWzBdOyArK2kpIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlcHNbMV07ICsraikge1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCByZXBzWzJdOyArK2spIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCByZXBzWzNdOyArK2wpIHtcbiAgICAgICAgICAgICAgICB4R3JhZCA9XG4gICAgICAgICAgICAgICAgICAgIGFkZCh4R3JhZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgKiB4LnNoYXBlWzBdLCBqICogeC5zaGFwZVsxXSwgayAqIHguc2hhcGVbMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsICogeC5zaGFwZVszXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3guc2hhcGVbMF0sIHguc2hhcGVbMV0sIHguc2hhcGVbMl0sIHguc2hhcGVbM11dKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBHcmFkaWVudCBmb3IgdGlsZSBvcGVyYXRpb24gaXMgbm90IGltcGxlbWVudGVkIGZvciByYW5rLWAgK1xuICAgICAgICAgICAgYCR7eC5yYW5rfSB0ZW5zb3JzIHlldC5gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB4R3JhZDtcbiAgICB9O1xuICAgIHJldHVybiB7eDogZGVyWH07XG4gIH0sXG59O1xuIl19