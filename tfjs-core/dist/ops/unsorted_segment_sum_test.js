/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
import { PARALLELIZE_THRESHOLD } from './reduce_util';
describeWithFlags('unsortedSegmentSum', ALL_ENVS, () => {
    it('tensor1D', async () => {
        const t = tf.tensor1d([1, 2, 3, 4]);
        const segmentIds = tf.tensor1d([0, 2, 0, 1], 'int32');
        const numSegments = 3;
        const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments]);
        expectArraysClose(await res.data(), [4, 4, 2]);
    });
    it('tensor2D', async () => {
        const t = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const segmentIds = tf.tensor1d([0, 0], 'int32');
        const numSegments = 2;
        const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments, 2]);
        expectArraysClose(await res.data(), [4, 6, 0, 0]);
    });
    it('tensor3D', async () => {
        const t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [3, 2, 2]);
        const segmentIds = tf.tensor1d([2, 1, 2], 'int32');
        const numSegments = 3;
        const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments, 2, 2]);
        expectArraysClose(await res.data(), [0, 0, 0, 0, 5, 6, 7, 8, 10, 12, 14, 16]);
    });
    it('N > than parallelization threshold, tensor1D', async () => {
        const n = PARALLELIZE_THRESHOLD * 2;
        const values = new Float32Array(n);
        const numSegments = 5;
        const segmentIdValues = new Float32Array(n);
        const vals = new Float32Array(numSegments);
        for (let i = 0; i < n; i++) {
            values[i] = i;
            segmentIdValues[i] = i % numSegments;
            vals[i % numSegments] += i;
        }
        const t = tf.tensor1d(values);
        const segmentIds = tf.tensor1d(segmentIdValues, 'int32');
        const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments]);
        expectArraysClose(await res.data(), vals);
    });
    it('ignores negative segmentIds', async () => {
        const t = tf.tensor1d([1, 2, 3, 4]);
        const segmentIds = tf.tensor1d([0, 2, -1, 1], 'int32');
        const numSegments = 3;
        const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);
        expect(res.shape).toEqual([numSegments]);
        expectArraysClose(await res.data(), [1, 4, 2]);
    });
    it('gradient ignores negative segmentIds', async () => {
        const t = tf.tensor1d([1, 2, 3, 4]);
        const segmentIds = tf.tensor1d([0, 2, -1, 1], 'int32');
        const numSegments = 3;
        const dy = tf.tensor1d([11, 2, 7]);
        const gradient = tf.grad(a => tf.unsortedSegmentSum(a, segmentIds, numSegments))(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        expectArraysClose(await gradient.data(), [11, 7, 0, 2]);
    });
    it('tensor1D gradient', async () => {
        const t = tf.tensor1d([1, 2, 3, 4]);
        const segmentIds = tf.tensor1d([0, 2, 0, 1], 'int32');
        const numSegments = 3;
        const dy = tf.tensor1d([11, 2, 7]);
        const gradient = tf.grad(a => tf.unsortedSegmentSum(a, segmentIds, numSegments))(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        expectArraysClose(await gradient.data(), [11, 7, 11, 2]);
    });
    it('gradient with clones', async () => {
        const t = tf.tensor1d([1, 2, 3, 4]);
        const segmentIds = tf.tensor1d([0, 2, 0, 1], 'int32');
        const numSegments = 3;
        const dy = tf.tensor1d([11, 2, 7]);
        const gradient = tf.grad(a => tf.unsortedSegmentSum(a.clone(), segmentIds.clone(), numSegments)
            .clone())(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        expectArraysClose(await gradient.data(), [11, 7, 11, 2]);
    });
    it('tensor2D gradient', async () => {
        const t = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const segmentIds = tf.tensor1d([0, 0], 'int32');
        const numSegments = 2;
        const dy = tf.tensor2d([11, 2, 4, 5], [2, 2]);
        const gradient = tf.grad(a => tf.unsortedSegmentSum(a, segmentIds, numSegments))(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        expectArraysClose(await gradient.data(), [11, 2, 11, 2]);
    });
    it('tensor3D gradient', async () => {
        const t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [3, 2, 2]);
        const segmentIds = tf.tensor1d([2, 1, 2], 'int32');
        const numSegments = 3;
        const dy = tf.tensor3d([11, 2, 4, 5, 17, 31, 1, 0, -1, 14, 3, 28], [3, 2, 2]);
        const gradient = tf.grad(a => tf.unsortedSegmentSum(a, segmentIds, numSegments))(t, dy);
        expect(gradient.shape).toEqual(t.shape);
        expectArraysClose(await gradient.data(), [-1, 14, 3, 28, 17, 31, 1, 0, -1, 14, 3, 28]);
    });
    it('accepts a tensor-like object', async () => {
        const x = [1, 2, 3, 4];
        const segmentIds = [0, 2, 0, 1];
        const numSegments = 3;
        const res = tf.unsortedSegmentSum(x, segmentIds, numSegments);
        expect(res.shape).toEqual([3]);
        expectArraysClose(await res.data(), [4, 4, 2]);
    });
    it('accepts a tensor-like object chained', async () => {
        const x = tf.tensor1d([1, 2, 3, 4]);
        const segmentIds = [0, 2, 0, 1];
        const numSegments = 3;
        const res = x.unsortedSegmentSum(segmentIds, numSegments);
        expect(res.shape).toEqual([3]);
        expectArraysClose(await res.data(), [4, 4, 2]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5zb3J0ZWRfc2VnbWVudF9zdW1fdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3Vuc29ydGVkX3NlZ21lbnRfc3VtX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMvQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFcEQsaUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNyRCxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RCxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdEIsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFOUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMs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RSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNwRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQztRQUN0QixNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRTFELE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyB0ZiBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQge0FMTF9FTlZTLCBkZXNjcmliZVdpdGhGbGFnc30gZnJvbSAnLi4vamFzbWluZV91dGlsJztcbmltcG9ydCB7ZXhwZWN0QXJyYXlzQ2xvc2V9IGZyb20gJy4uL3Rlc3RfdXRpbCc7XG5pbXBvcnQge1BBUkFMTEVMSVpFX1RIUkVTSE9MRH0gZnJvbSAnLi9yZWR1Y2VfdXRpbCc7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCd1bnNvcnRlZFNlZ21lbnRTdW0nLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgndGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG4gICAgY29uc3Qgc2VnbWVudElkcyA9IHRmLnRlbnNvcjFkKFswLCAyLCAwLCAxXSwgJ2ludDMyJyk7XG4gICAgY29uc3QgbnVtU2VnbWVudHMgPSAzO1xuICAgIGNvbnN0IHJlcyA9IHRmLnVuc29ydGVkU2VnbWVudFN1bSh0LCBzZWdtZW50SWRzLCBudW1TZWdtZW50cyk7XG5cbiAgICBleHBlY3QocmVzLnNoYXBlKS50b0VxdWFsKFtudW1TZWdtZW50c10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFs0LCA0LCAyXSk7XG4gIH0pO1xuXG4gIGl0KCd0ZW5zb3IyRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0pO1xuICAgIGNvbnN0IHNlZ21lbnRJZHMgPSB0Zi50ZW5zb3IxZChbMCwgMF0sICdpbnQzMicpO1xuICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMjtcbiAgICBjb25zdCByZXMgPSB0Zi51bnNvcnRlZFNlZ21lbnRTdW0odCwgc2VnbWVudElkcywgbnVtU2VnbWVudHMpO1xuXG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbbnVtU2VnbWVudHMsIDJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXMuZGF0YSgpLCBbNCwgNiwgMCwgMF0pO1xuICB9KTtcblxuICBpdCgndGVuc29yM0QnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdCA9IHRmLnRlbnNvcjNkKFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXSwgWzMsIDIsIDJdKTtcbiAgICBjb25zdCBzZWdtZW50SWRzID0gdGYudGVuc29yMWQoWzIsIDEsIDJdLCAnaW50MzInKTtcbiAgICBjb25zdCBudW1TZWdtZW50cyA9IDM7XG4gICAgY29uc3QgcmVzID0gdGYudW5zb3J0ZWRTZWdtZW50U3VtKHQsIHNlZ21lbnRJZHMsIG51bVNlZ21lbnRzKTtcblxuICAgIGV4cGVjdChyZXMuc2hhcGUpLnRvRXF1YWwoW251bVNlZ21lbnRzLCAyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlcy5kYXRhKCksIFswLCAwLCAwLCAwLCA1LCA2LCA3LCA4LCAxMCwgMTIsIDE0LCAxNl0pO1xuICB9KTtcblxuICBpdCgnTiA+IHRoYW4gcGFyYWxsZWxpemF0aW9uIHRocmVzaG9sZCwgdGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbiA9IFBBUkFMTEVMSVpFX1RIUkVTSE9MRCAqIDI7XG4gICAgY29uc3QgdmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheShuKTtcbiAgICBjb25zdCBudW1TZWdtZW50cyA9IDU7XG4gICAgY29uc3Qgc2VnbWVudElkVmFsdWVzID0gbmV3IEZsb2F0MzJBcnJheShuKTtcbiAgICBjb25zdCB2YWxzID0gbmV3IEZsb2F0MzJBcnJheShudW1TZWdtZW50cyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IGk7XG4gICAgICBzZWdtZW50SWRWYWx1ZXNbaV0gPSBpICUgbnVtU2VnbWVudHM7XG4gICAgICB2YWxzW2kgJSBudW1TZWdtZW50c10gKz0gaTtcbiAgICB9XG4gICAgY29uc3QgdCA9IHRmLnRlbnNvcjFkKHZhbHVlcyk7XG4gICAgY29uc3Qgc2VnbWVudElkcyA9IHRmLnRlbnNvcjFkKHNlZ21lbnRJZFZhbHVlcywgJ2ludDMyJyk7XG4gICAgY29uc3QgcmVzID0gdGYudW5zb3J0ZWRTZWdtZW50U3VtKHQsIHNlZ21lbnRJZHMsIG51bVNlZ21lbnRzKTtcblxuICAgIGV4cGVjdChyZXMuc2hhcGUpLnRvRXF1YWwoW251bVNlZ21lbnRzXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgdmFscyk7XG4gIH0pO1xuXG4gIGl0KCdpZ25vcmVzIG5lZ2F0aXZlIHNlZ21lbnRJZHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG4gICAgY29uc3Qgc2VnbWVudElkcyA9IHRmLnRlbnNvcjFkKFswLCAyLCAtMSwgMV0sICdpbnQzMicpO1xuICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMztcblxuICAgIGNvbnN0IHJlcyA9IHRmLnVuc29ydGVkU2VnbWVudFN1bSh0LCBzZWdtZW50SWRzLCBudW1TZWdtZW50cyk7XG5cbiAgICBleHBlY3QocmVzLnNoYXBlKS50b0VxdWFsKFtudW1TZWdtZW50c10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFsxLCA0LCAyXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudCBpZ25vcmVzIG5lZ2F0aXZlIHNlZ21lbnRJZHMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG4gICAgY29uc3Qgc2VnbWVudElkcyA9IHRmLnRlbnNvcjFkKFswLCAyLCAtMSwgMV0sICdpbnQzMicpO1xuICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMztcblxuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMWQoWzExLCAyLCA3XSk7XG4gICAgY29uc3QgZ3JhZGllbnQgPVxuICAgICAgICB0Zi5ncmFkKGEgPT4gdGYudW5zb3J0ZWRTZWdtZW50U3VtKGEsIHNlZ21lbnRJZHMsIG51bVNlZ21lbnRzKSkodCwgZHkpO1xuXG4gICAgZXhwZWN0KGdyYWRpZW50LnNoYXBlKS50b0VxdWFsKHQuc2hhcGUpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGdyYWRpZW50LmRhdGEoKSwgWzExLCA3LCAwLCAyXSk7XG4gIH0pO1xuXG4gIGl0KCd0ZW5zb3IxRCBncmFkaWVudCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcbiAgICBjb25zdCBzZWdtZW50SWRzID0gdGYudGVuc29yMWQoWzAsIDIsIDAsIDFdLCAnaW50MzInKTtcbiAgICBjb25zdCBudW1TZWdtZW50cyA9IDM7XG5cbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjFkKFsxMSwgMiwgN10pO1xuICAgIGNvbnN0IGdyYWRpZW50ID1cbiAgICAgICAgdGYuZ3JhZChhID0+IHRmLnVuc29ydGVkU2VnbWVudFN1bShhLCBzZWdtZW50SWRzLCBudW1TZWdtZW50cykpKHQsIGR5KTtcblxuICAgIGV4cGVjdChncmFkaWVudC5zaGFwZSkudG9FcXVhbCh0LnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBncmFkaWVudC5kYXRhKCksIFsxMSwgNywgMTEsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IHdpdGggY2xvbmVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHQgPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0pO1xuICAgIGNvbnN0IHNlZ21lbnRJZHMgPSB0Zi50ZW5zb3IxZChbMCwgMiwgMCwgMV0sICdpbnQzMicpO1xuICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMztcblxuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMWQoWzExLCAyLCA3XSk7XG4gICAgY29uc3QgZ3JhZGllbnQgPSB0Zi5ncmFkKFxuICAgICAgICBhID0+IHRmLnVuc29ydGVkU2VnbWVudFN1bShhLmNsb25lKCksIHNlZ21lbnRJZHMuY2xvbmUoKSwgbnVtU2VnbWVudHMpXG4gICAgICAgICAgICAgICAgIC5jbG9uZSgpKSh0LCBkeSk7XG5cbiAgICBleHBlY3QoZ3JhZGllbnQuc2hhcGUpLnRvRXF1YWwodC5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZ3JhZGllbnQuZGF0YSgpLCBbMTEsIDcsIDExLCAyXSk7XG4gIH0pO1xuXG4gIGl0KCd0ZW5zb3IyRCBncmFkaWVudCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbMiwgMl0pO1xuICAgIGNvbnN0IHNlZ21lbnRJZHMgPSB0Zi50ZW5zb3IxZChbMCwgMF0sICdpbnQzMicpO1xuICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMjtcblxuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMmQoWzExLCAyLCA0LCA1XSwgWzIsIDJdKTtcbiAgICBjb25zdCBncmFkaWVudCA9XG4gICAgICAgIHRmLmdyYWQoYSA9PiB0Zi51bnNvcnRlZFNlZ21lbnRTdW0oYSwgc2VnbWVudElkcywgbnVtU2VnbWVudHMpKSh0LCBkeSk7XG5cbiAgICBleHBlY3QoZ3JhZGllbnQuc2hhcGUpLnRvRXF1YWwodC5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZ3JhZGllbnQuZGF0YSgpLCBbMTEsIDIsIDExLCAyXSk7XG4gIH0pO1xuXG4gIGl0KCd0ZW5zb3IzRCBncmFkaWVudCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0ID0gdGYudGVuc29yM2QoWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTJdLCBbMywgMiwgMl0pO1xuICAgIGNvbnN0IHNlZ21lbnRJZHMgPSB0Zi50ZW5zb3IxZChbMiwgMSwgMl0sICdpbnQzMicpO1xuICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMztcblxuICAgIGNvbnN0IGR5ID1cbiAgICAgICAgdGYudGVuc29yM2QoWzExLCAyLCA0LCA1LCAxNywgMzEsIDEsIDAsIC0xLCAxNCwgMywgMjhdLCBbMywgMiwgMl0pO1xuICAgIGNvbnN0IGdyYWRpZW50ID1cbiAgICAgICAgdGYuZ3JhZChhID0+IHRmLnVuc29ydGVkU2VnbWVudFN1bShhLCBzZWdtZW50SWRzLCBudW1TZWdtZW50cykpKHQsIGR5KTtcblxuICAgIGV4cGVjdChncmFkaWVudC5zaGFwZSkudG9FcXVhbCh0LnNoYXBlKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgZ3JhZGllbnQuZGF0YSgpLCBbLTEsIDE0LCAzLCAyOCwgMTcsIDMxLCAxLCAwLCAtMSwgMTQsIDMsIDI4XSk7XG4gIH0pO1xuXG4gIGl0KCdhY2NlcHRzIGEgdGVuc29yLWxpa2Ugb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSBbMSwgMiwgMywgNF07XG4gICAgY29uc3Qgc2VnbWVudElkcyA9IFswLCAyLCAwLCAxXTtcbiAgICBjb25zdCBudW1TZWdtZW50cyA9IDM7XG4gICAgY29uc3QgcmVzID0gdGYudW5zb3J0ZWRTZWdtZW50U3VtKHgsIHNlZ21lbnRJZHMsIG51bVNlZ21lbnRzKTtcbiAgICBleHBlY3QocmVzLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzQsIDQsIDJdKTtcbiAgfSk7XG5cbiAgaXQoJ2FjY2VwdHMgYSB0ZW5zb3ItbGlrZSBvYmplY3QgY2hhaW5lZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcbiAgICBjb25zdCBzZWdtZW50SWRzID0gWzAsIDIsIDAsIDFdO1xuICAgIGNvbnN0IG51bVNlZ21lbnRzID0gMztcbiAgICBjb25zdCByZXMgPSB4LnVuc29ydGVkU2VnbWVudFN1bShzZWdtZW50SWRzLCBudW1TZWdtZW50cyk7XG5cbiAgICBleHBlY3QocmVzLnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzQsIDQsIDJdKTtcbiAgfSk7XG59KTtcbiJdfQ==