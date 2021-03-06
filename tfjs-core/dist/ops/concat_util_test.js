/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
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
import * as concat_util from './concat_util';
describe('concat_util.assertConcatShapesMatch rank=3D', () => {
    it('Non-3D tensor x1', () => {
        const assertFn = () => {
            concat_util.assertParamsConsistent([[1], [1, 2, 3]], 1);
        };
        expect(assertFn).toThrow();
    });
    it('Non-3D tensor x2', () => {
        const assertFn = () => {
            concat_util.assertParamsConsistent([[1, 2, 3], [2, 3]], 1);
        };
        expect(assertFn).toThrow();
    });
    it('axis out of bound', () => {
        const assertFn = () => {
            concat_util.assertParamsConsistent([[1, 2, 3], [1, 2, 3]], 4);
        };
        expect(assertFn).toThrow();
    });
    it('non-axis shape mismatch', () => {
        const assertFn = () => {
            concat_util.assertParamsConsistent([[2, 3, 3], [2, 2, 4]], 2);
        };
        expect(assertFn).toThrow();
    });
    it('shapes line up', () => {
        const assertFn = () => {
            concat_util.assertParamsConsistent([[2, 3, 3], [2, 3, 4]], 2);
        };
        expect(assertFn).not.toThrow();
    });
    it('3 shapes, all line up', () => {
        const assertFn = () => {
            concat_util.assertParamsConsistent([[2, 3, 3], [2, 3, 4], [2, 3, 8]], 2);
        };
        expect(assertFn).not.toThrow();
    });
    it('3 shapes, 3rd shape does not line up', () => {
        const assertFn = () => {
            concat_util.assertParamsConsistent([[2, 5, 3], [2, 1, 3], [2, 1, 5]], 1);
        };
        expect(assertFn).toThrow();
    });
});
describe('concat_util.computeConcatOutputShape', () => {
    it('compute output shape, axis=0', () => {
        expect(concat_util.computeOutShape([[2, 2, 3], [1, 2, 3]], 0)).toEqual([
            3, 2, 3
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0X3V0aWxfdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2NvbmNhdF91dGlsX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxLQUFLLFdBQVcsTUFBTSxlQUFlLENBQUM7QUFFN0MsUUFBUSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtJQUMzRCxFQUFFLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQzFCLE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRTtZQUNwQixXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDMUIsTUFBTSxRQUFRLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQztRQUVGLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDM0IsTUFBTSxRQUFRLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFF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TExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIGNvbmNhdF91dGlsIGZyb20gJy4vY29uY2F0X3V0aWwnO1xuXG5kZXNjcmliZSgnY29uY2F0X3V0aWwuYXNzZXJ0Q29uY2F0U2hhcGVzTWF0Y2ggcmFuaz0zRCcsICgpID0+IHtcbiAgaXQoJ05vbi0zRCB0ZW5zb3IgeDEnLCAoKSA9PiB7XG4gICAgY29uc3QgYXNzZXJ0Rm4gPSAoKSA9PiB7XG4gICAgICBjb25jYXRfdXRpbC5hc3NlcnRQYXJhbXNDb25zaXN0ZW50KFtbMV0sIFsxLCAyLCAzXV0sIDEpO1xuICAgIH07XG5cbiAgICBleHBlY3QoYXNzZXJ0Rm4pLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgaXQoJ05vbi0zRCB0ZW5zb3IgeDInLCAoKSA9PiB7XG4gICAgY29uc3QgYXNzZXJ0Rm4gPSAoKSA9PiB7XG4gICAgICBjb25jYXRfdXRpbC5hc3NlcnRQYXJhbXNDb25zaXN0ZW50KFtbMSwgMiwgM10sIFsyLCAzXV0sIDEpO1xuICAgIH07XG5cbiAgICBleHBlY3QoYXNzZXJ0Rm4pLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgaXQoJ2F4aXMgb3V0IG9mIGJvdW5kJywgKCkgPT4ge1xuICAgIGNvbnN0IGFzc2VydEZuID0gKCkgPT4ge1xuICAgICAgY29uY2F0X3V0aWwuYXNzZXJ0UGFyYW1zQ29uc2lzdGVudChbWzEsIDIsIDNdLCBbMSwgMiwgM11dLCA0KTtcbiAgICB9O1xuXG4gICAgZXhwZWN0KGFzc2VydEZuKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGl0KCdub24tYXhpcyBzaGFwZSBtaXNtYXRjaCcsICgpID0+IHtcbiAgICBjb25zdCBhc3NlcnRGbiA9ICgpID0+IHtcbiAgICAgIGNvbmNhdF91dGlsLmFzc2VydFBhcmFtc0NvbnNpc3RlbnQoW1syLCAzLCAzXSwgWzIsIDIsIDRdXSwgMik7XG4gICAgfTtcblxuICAgIGV4cGVjdChhc3NlcnRGbikudG9UaHJvdygpO1xuICB9KTtcblxuICBpdCgnc2hhcGVzIGxpbmUgdXAnLCAoKSA9PiB7XG4gICAgY29uc3QgYXNzZXJ0Rm4gPSAoKSA9PiB7XG4gICAgICBjb25jYXRfdXRpbC5hc3NlcnRQYXJhbXNDb25zaXN0ZW50KFtbMiwgMywgM10sIFsyLCAzLCA0XV0sIDIpO1xuICAgIH07XG5cbiAgICBleHBlY3QoYXNzZXJ0Rm4pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGl0KCczIHNoYXBlcywgYWxsIGxpbmUgdXAnLCAoKSA9PiB7XG4gICAgY29uc3QgYXNzZXJ0Rm4gPSAoKSA9PiB7XG4gICAgICBjb25jYXRfdXRpbC5hc3NlcnRQYXJhbXNDb25zaXN0ZW50KFtbMiwgMywgM10sIFsyLCAzLCA0XSwgWzIsIDMsIDhdXSwgMik7XG4gICAgfTtcbiAgICBleHBlY3QoYXNzZXJ0Rm4pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGl0KCczIHNoYXBlcywgM3JkIHNoYXBlIGRvZXMgbm90IGxpbmUgdXAnLCAoKSA9PiB7XG4gICAgY29uc3QgYXNzZXJ0Rm4gPSAoKSA9PiB7XG4gICAgICBjb25jYXRfdXRpbC5hc3NlcnRQYXJhbXNDb25zaXN0ZW50KFtbMiwgNSwgM10sIFsyLCAxLCAzXSwgWzIsIDEsIDVdXSwgMSk7XG4gICAgfTtcbiAgICBleHBlY3QoYXNzZXJ0Rm4pLnRvVGhyb3coKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NvbmNhdF91dGlsLmNvbXB1dGVDb25jYXRPdXRwdXRTaGFwZScsICgpID0+IHtcbiAgaXQoJ2NvbXB1dGUgb3V0cHV0IHNoYXBlLCBheGlzPTAnLCAoKSA9PiB7XG4gICAgZXhwZWN0KGNvbmNhdF91dGlsLmNvbXB1dGVPdXRTaGFwZShbWzIsIDIsIDNdLCBbMSwgMiwgM11dLCAwKSkudG9FcXVhbChbXG4gICAgICAzLCAyLCAzXG4gICAgXSk7XG4gIH0pO1xufSk7XG4iXX0=