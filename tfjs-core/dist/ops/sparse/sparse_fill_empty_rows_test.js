/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
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
import * as tf from '../../index';
import { ALL_ENVS, describeWithFlags } from '../../jasmine_util';
import { expectArraysClose } from '../../test_util';
describeWithFlags('sparseFillEmptyRows', ALL_ENVS, () => {
    it('fill number', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([[0, 0], [1, 0], [1, 3], [1, 4], [3, 2], [3, 3]], [6, 2], 'int32'),
            val: [0, 10, 13, 14, 32, 33],
            shape: [5, 6],
        };
        const result = tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1);
        expectArraysClose(await result.outputIndices.data(), [[0, 0], [1, 0], [1, 3], [1, 4], [2, 0], [3, 2], [3, 3], [4, 0]]);
        expectArraysClose(await result.outputValues.data(), [0, 10, 13, 14, -1, 32, 33, -1]);
        expectArraysClose(await result.emptyRowIndicator.data(), [0, 0, 1, 0, 1]);
        expectArraysClose(await result.reverseIndexMap.data(), [0, 1, 2, 3, 5, 6]);
    });
    it('fill float', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([[0, 0], [1, 0], [1, 3], [1, 4], [3, 2], [3, 3]], [6, 2], 'int32'),
            val: tf.tensor1d([0.0, 10.0, 13.0, 14.0, 32.0, 33.0], 'float32'),
            shape: [5, 6],
        };
        const result = tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1);
        expectArraysClose(await result.outputIndices.data(), [[0, 0], [1, 0], [1, 3], [1, 4], [2, 0], [3, 2], [3, 3], [4, 0]]);
        expectArraysClose(await result.outputValues.data(), [0, 10, 13, 14, -1, 32, 33, -1]);
        expectArraysClose(await result.emptyRowIndicator.data(), [0, 0, 1, 0, 1]);
        expectArraysClose(await result.reverseIndexMap.data(), [0, 1, 2, 3, 5, 6]);
    });
    it('no empty rows', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([[0, 0], [1, 0], [1, 3], [1, 4]], [4, 2], 'int32'),
            val: [0, 10, 13, 14],
            shape: [2, 6],
        };
        const result = tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1);
        expectArraysClose(await result.outputIndices.data(), [[0, 0], [1, 0], [1, 3], [1, 4]]);
        expectArraysClose(await result.outputValues.data(), [0, 10, 13, 14]);
        expectArraysClose(await result.emptyRowIndicator.data(), [0, 0]);
        expectArraysClose(await result.reverseIndexMap.data(), [0, 1, 2, 3]);
    });
    it('no empty rows and unordered', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([[1, 2], [1, 3], [0, 1], [0, 3]], [4, 2], 'int32'),
            val: [1, 3, 2, 4],
            shape: [2, 5],
        };
        const result = tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1);
        expectArraysClose(await result.outputIndices.data(), [[0, 1], [0, 3], [1, 2], [1, 3]]);
        expectArraysClose(await result.outputValues.data(), [2, 4, 1, 3]);
        expectArraysClose(await result.emptyRowIndicator.data(), [0, 0]);
        expectArraysClose(await result.reverseIndexMap.data(), [2, 3, 0, 1]);
    });
    it('no rows', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([], [0, 2], 'int32'),
            val: [],
            shape: [0, 5],
        };
        const result = tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1);
        expectArraysClose(await result.outputIndices.data(), []);
        expectArraysClose(await result.outputValues.data(), []);
        expectArraysClose(await result.emptyRowIndicator.data(), []);
        expectArraysClose(await result.reverseIndexMap.data(), []);
    });
    it('check output metadata', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([[0, 0], [1, 0], [1, 3], [1, 4], [3, 2], [3, 3]], [6, 2], 'int32'),
            val: tf.tensor1d([0, 10, 13, 14, 32, 33], 'float32'),
            shape: [5, 6],
        };
        const result = tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1);
        expectArraysClose(await result.outputIndices.data(), [[0, 0], [1, 0], [1, 3], [1, 4], [2, 0], [3, 2], [3, 3], [4, 0]]);
        expectArraysClose(await result.outputValues.data(), [0, 10, 13, 14, -1, 32, 33, -1]);
        expectArraysClose(await result.emptyRowIndicator.data(), [0, 0, 1, 0, 1]);
        expectArraysClose(await result.reverseIndexMap.data(), [0, 1, 2, 3, 5, 6]);
        expect(result.outputIndices.shape).toEqual([8, 2]);
        expect(result.outputValues.shape).toEqual([8]);
        expect(result.emptyRowIndicator.shape).toEqual([5]);
        expect(result.reverseIndexMap.shape).toEqual([6]);
        expect(result.outputIndices.dtype).toEqual(sparseTensor.ind.dtype);
        expect(result.outputValues.dtype).toEqual(sparseTensor.val.dtype);
        expect(result.emptyRowIndicator.dtype).toEqual('bool');
        expect(result.reverseIndexMap.dtype).toEqual(sparseTensor.ind.dtype);
    });
    it('does not have memory leak.', async () => {
        const beforeDataIds = tf.engine().backend.numDataIds();
        const sparseTensor = {
            ind: tf.tensor2d([[0, 0], [1, 0], [1, 3], [1, 4], [3, 2], [3, 3]], [6, 2], 'int32'),
            val: [0, 10, 13, 14, 32, 33],
            shape: [5, 6],
        };
        const indices = sparseTensor.ind;
        const values = tf.tensor1d(sparseTensor.val, 'float32');
        const denseShape = tf.tensor1d(sparseTensor.shape, 'int32');
        const result = tf.sparse.sparseFillEmptyRows(indices, values, denseShape, -1);
        await result.outputIndices.data();
        await result.outputValues.data();
        await result.emptyRowIndicator.data();
        await result.reverseIndexMap.data();
        const afterResDataIds = tf.engine().backend.numDataIds();
        expect(afterResDataIds).toEqual(beforeDataIds + 7);
        indices.dispose();
        values.dispose();
        denseShape.dispose();
        result.outputIndices.dispose();
        result.outputValues.dispose();
        result.emptyRowIndicator.dispose();
        result.reverseIndexMap.dispose();
        const afterDisposeDataIds = tf.engine().backend.numDataIds();
        expect(afterDisposeDataIds).toEqual(beforeDataIds);
    });
    it('throw error if dense rows is empty and indices is not', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([[0, 0]], [1, 2], 'int32'),
            val: [1],
            shape: [0, 5],
        };
        expect(() => tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1))
            .toThrowError(/indices\.shape\[0\] = 1/);
    });
    it('throw error if negative row', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([[-1, 0]], [1, 2], 'int32'),
            val: [1],
            shape: [5, 5],
        };
        expect(() => tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1))
            .toThrowError('indices(0, 0) is invalid: -1 < 0');
    });
    it('throw error if row exceeds number of dense rows', async () => {
        const sparseTensor = {
            ind: tf.tensor2d([[5, 0]], [1, 2], 'int32'),
            val: [1],
            shape: [5, 5],
        };
        expect(() => tf.sparse.sparseFillEmptyRows(sparseTensor.ind, sparseTensor.val, sparseTensor.shape, -1))
            .toThrowError('indices(0, 0) is invalid: 5 >= 5');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhcnNlX2ZpbGxfZW1wdHlfcm93c190ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3BhcnNlL3NwYXJzZV9maWxsX2VtcHR5X3Jvd3NfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNsQyxPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFbEQsaUJBQWlCLENBQUMscUJBQXFCLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0RCxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzNCLE1BQU0sWUFBWSxHQUFHO1lBQ25CLEdBQUcsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUNaLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUM7WUFDdEUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDNUIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNkLENBQUM7UUFDRixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLG1CQUFtQixD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WSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMvRCxZQUFZLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQgKiBhcyB0ZiBmcm9tICcuLi8uLi9pbmRleCc7XG5pbXBvcnQge0FMTF9FTlZTLCBkZXNjcmliZVdpdGhGbGFnc30gZnJvbSAnLi4vLi4vamFzbWluZV91dGlsJztcbmltcG9ydCB7ZXhwZWN0QXJyYXlzQ2xvc2V9IGZyb20gJy4uLy4uL3Rlc3RfdXRpbCc7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdzcGFyc2VGaWxsRW1wdHlSb3dzJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ2ZpbGwgbnVtYmVyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHNwYXJzZVRlbnNvciA9IHtcbiAgICAgIGluZDogdGYudGVuc29yMmQoXG4gICAgICAgICAgW1swLCAwXSwgWzEsIDBdLCBbMSwgM10sIFsxLCA0XSwgWzMsIDJdLCBbMywgM11dLCBbNiwgMl0sICdpbnQzMicpLFxuICAgICAgdmFsOiBbMCwgMTAsIDEzLCAxNCwgMzIsIDMzXSxcbiAgICAgIHNoYXBlOiBbNSwgNl0sXG4gICAgfTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zcGFyc2Uuc3BhcnNlRmlsbEVtcHR5Um93cyhcbiAgICAgICAgc3BhcnNlVGVuc29yLmluZCwgc3BhcnNlVGVuc29yLnZhbCwgc3BhcnNlVGVuc29yLnNoYXBlLCAtMSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5vdXRwdXRJbmRpY2VzLmRhdGEoKSxcbiAgICAgICAgW1swLCAwXSwgWzEsIDBdLCBbMSwgM10sIFsxLCA0XSwgWzIsIDBdLCBbMywgMl0sIFszLCAzXSwgWzQsIDBdXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5vdXRwdXRWYWx1ZXMuZGF0YSgpLCBbMCwgMTAsIDEzLCAxNCwgLTEsIDMyLCAzMywgLTFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZW1wdHlSb3dJbmRpY2F0b3IuZGF0YSgpLCBbMCwgMCwgMSwgMCwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5yZXZlcnNlSW5kZXhNYXAuZGF0YSgpLCBbMCwgMSwgMiwgMywgNSwgNl0pO1xuICB9KTtcblxuICBpdCgnZmlsbCBmbG9hdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzcGFyc2VUZW5zb3IgPSB7XG4gICAgICBpbmQ6IHRmLnRlbnNvcjJkKFxuICAgICAgICAgIFtbMCwgMF0sIFsxLCAwXSwgWzEsIDNdLCBbMSwgNF0sIFszLCAyXSwgWzMsIDNdXSwgWzYsIDJdLCAnaW50MzInKSxcbiAgICAgIHZhbDogdGYudGVuc29yMWQoWzAuMCwgMTAuMCwgMTMuMCwgMTQuMCwgMzIuMCwgMzMuMF0sICdmbG9hdDMyJyksXG4gICAgICBzaGFwZTogWzUsIDZdLFxuICAgIH07XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuc3BhcnNlLnNwYXJzZUZpbGxFbXB0eVJvd3MoXG4gICAgICAgIHNwYXJzZVRlbnNvci5pbmQsIHNwYXJzZVRlbnNvci52YWwsIHNwYXJzZVRlbnNvci5zaGFwZSwgLTEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCByZXN1bHQub3V0cHV0SW5kaWNlcy5kYXRhKCksXG4gICAgICAgIFtbMCwgMF0sIFsxLCAwXSwgWzEsIDNdLCBbMSwgNF0sIFsyLCAwXSwgWzMsIDJdLCBbMywgM10sIFs0LCAwXV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCByZXN1bHQub3V0cHV0VmFsdWVzLmRhdGEoKSwgWzAsIDEwLCAxMywgMTQsIC0xLCAzMiwgMzMsIC0xXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmVtcHR5Um93SW5kaWNhdG9yLmRhdGEoKSwgWzAsIDAsIDEsIDAsIDFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQucmV2ZXJzZUluZGV4TWFwLmRhdGEoKSwgWzAsIDEsIDIsIDMsIDUsIDZdKTtcbiAgfSk7XG5cbiAgaXQoJ25vIGVtcHR5IHJvd3MnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgc3BhcnNlVGVuc29yID0ge1xuICAgICAgaW5kOiB0Zi50ZW5zb3IyZChbWzAsIDBdLCBbMSwgMF0sIFsxLCAzXSwgWzEsIDRdXSwgWzQsIDJdLCAnaW50MzInKSxcbiAgICAgIHZhbDogWzAsIDEwLCAxMywgMTRdLFxuICAgICAgc2hhcGU6IFsyLCA2XSxcbiAgICB9O1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLnNwYXJzZS5zcGFyc2VGaWxsRW1wdHlSb3dzKFxuICAgICAgICBzcGFyc2VUZW5zb3IuaW5kLCBzcGFyc2VUZW5zb3IudmFsLCBzcGFyc2VUZW5zb3Iuc2hhcGUsIC0xKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShcbiAgICAgICAgYXdhaXQgcmVzdWx0Lm91dHB1dEluZGljZXMuZGF0YSgpLCBbWzAsIDBdLCBbMSwgMF0sIFsxLCAzXSwgWzEsIDRdXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0Lm91dHB1dFZhbHVlcy5kYXRhKCksIFswLCAxMCwgMTMsIDE0XSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmVtcHR5Um93SW5kaWNhdG9yLmRhdGEoKSwgWzAsIDBdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQucmV2ZXJzZUluZGV4TWFwLmRhdGEoKSwgWzAsIDEsIDIsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ25vIGVtcHR5IHJvd3MgYW5kIHVub3JkZXJlZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzcGFyc2VUZW5zb3IgPSB7XG4gICAgICBpbmQ6IHRmLnRlbnNvcjJkKFtbMSwgMl0sIFsxLCAzXSwgWzAsIDFdLCBbMCwgM11dLCBbNCwgMl0sICdpbnQzMicpLFxuICAgICAgdmFsOiBbMSwgMywgMiwgNF0sXG4gICAgICBzaGFwZTogWzIsIDVdLFxuICAgIH07XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuc3BhcnNlLnNwYXJzZUZpbGxFbXB0eVJvd3MoXG4gICAgICAgIHNwYXJzZVRlbnNvci5pbmQsIHNwYXJzZVRlbnNvci52YWwsIHNwYXJzZVRlbnNvci5zaGFwZSwgLTEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCByZXN1bHQub3V0cHV0SW5kaWNlcy5kYXRhKCksIFtbMCwgMV0sIFswLCAzXSwgWzEsIDJdLCBbMSwgM11dKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQub3V0cHV0VmFsdWVzLmRhdGEoKSwgWzIsIDQsIDEsIDNdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZW1wdHlSb3dJbmRpY2F0b3IuZGF0YSgpLCBbMCwgMF0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5yZXZlcnNlSW5kZXhNYXAuZGF0YSgpLCBbMiwgMywgMCwgMV0pO1xuICB9KTtcblxuICBpdCgnbm8gcm93cycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzcGFyc2VUZW5zb3IgPSB7XG4gICAgICBpbmQ6IHRmLnRlbnNvcjJkKFtdLCBbMCwgMl0sICdpbnQzMicpLFxuICAgICAgdmFsOiBbXSBhcyBudW1iZXJbXSxcbiAgICAgIHNoYXBlOiBbMCwgNV0sXG4gICAgfTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zcGFyc2Uuc3BhcnNlRmlsbEVtcHR5Um93cyhcbiAgICAgICAgc3BhcnNlVGVuc29yLmluZCwgc3BhcnNlVGVuc29yLnZhbCwgc3BhcnNlVGVuc29yLnNoYXBlLCAtMSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0Lm91dHB1dEluZGljZXMuZGF0YSgpLCBbXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0Lm91dHB1dFZhbHVlcy5kYXRhKCksIFtdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZW1wdHlSb3dJbmRpY2F0b3IuZGF0YSgpLCBbXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LnJldmVyc2VJbmRleE1hcC5kYXRhKCksIFtdKTtcbiAgfSk7XG5cbiAgaXQoJ2NoZWNrIG91dHB1dCBtZXRhZGF0YScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzcGFyc2VUZW5zb3IgPSB7XG4gICAgICBpbmQ6IHRmLnRlbnNvcjJkKFxuICAgICAgICAgIFtbMCwgMF0sIFsxLCAwXSwgWzEsIDNdLCBbMSwgNF0sIFszLCAyXSwgWzMsIDNdXSwgWzYsIDJdLCAnaW50MzInKSxcbiAgICAgIHZhbDogdGYudGVuc29yMWQoWzAsIDEwLCAxMywgMTQsIDMyLCAzM10sICdmbG9hdDMyJyksXG4gICAgICBzaGFwZTogWzUsIDZdLFxuICAgIH07XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuc3BhcnNlLnNwYXJzZUZpbGxFbXB0eVJvd3MoXG4gICAgICAgIHNwYXJzZVRlbnNvci5pbmQsIHNwYXJzZVRlbnNvci52YWwsIHNwYXJzZVRlbnNvci5zaGFwZSwgLTEpO1xuXG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5vdXRwdXRJbmRpY2VzLmRhdGEoKSxcbiAgICAgICAgW1swLCAwXSwgWzEsIDBdLCBbMSwgM10sIFsxLCA0XSwgWzIsIDBdLCBbMywgMl0sIFszLCAzXSwgWzQsIDBdXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IHJlc3VsdC5vdXRwdXRWYWx1ZXMuZGF0YSgpLCBbMCwgMTAsIDEzLCAxNCwgLTEsIDMyLCAzMywgLTFdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZW1wdHlSb3dJbmRpY2F0b3IuZGF0YSgpLCBbMCwgMCwgMSwgMCwgMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5yZXZlcnNlSW5kZXhNYXAuZGF0YSgpLCBbMCwgMSwgMiwgMywgNSwgNl0pO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5vdXRwdXRJbmRpY2VzLnNoYXBlKS50b0VxdWFsKFs4LCAyXSk7XG4gICAgZXhwZWN0KHJlc3VsdC5vdXRwdXRWYWx1ZXMuc2hhcGUpLnRvRXF1YWwoWzhdKTtcbiAgICBleHBlY3QocmVzdWx0LmVtcHR5Um93SW5kaWNhdG9yLnNoYXBlKS50b0VxdWFsKFs1XSk7XG4gICAgZXhwZWN0KHJlc3VsdC5yZXZlcnNlSW5kZXhNYXAuc2hhcGUpLnRvRXF1YWwoWzZdKTtcblxuICAgIGV4cGVjdChyZXN1bHQub3V0cHV0SW5kaWNlcy5kdHlwZSkudG9FcXVhbChzcGFyc2VUZW5zb3IuaW5kLmR0eXBlKTtcbiAgICBleHBlY3QocmVzdWx0Lm91dHB1dFZhbHVlcy5kdHlwZSkudG9FcXVhbChzcGFyc2VUZW5zb3IudmFsLmR0eXBlKTtcbiAgICBleHBlY3QocmVzdWx0LmVtcHR5Um93SW5kaWNhdG9yLmR0eXBlKS50b0VxdWFsKCdib29sJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5yZXZlcnNlSW5kZXhNYXAuZHR5cGUpLnRvRXF1YWwoc3BhcnNlVGVuc29yLmluZC5kdHlwZSk7XG4gIH0pO1xuXG4gIGl0KCdkb2VzIG5vdCBoYXZlIG1lbW9yeSBsZWFrLicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBiZWZvcmVEYXRhSWRzID0gdGYuZW5naW5lKCkuYmFja2VuZC5udW1EYXRhSWRzKCk7XG5cbiAgICBjb25zdCBzcGFyc2VUZW5zb3IgPSB7XG4gICAgICBpbmQ6IHRmLnRlbnNvcjJkKFxuICAgICAgICAgIFtbMCwgMF0sIFsxLCAwXSwgWzEsIDNdLCBbMSwgNF0sIFszLCAyXSwgWzMsIDNdXSwgWzYsIDJdLCAnaW50MzInKSxcbiAgICAgIHZhbDogWzAsIDEwLCAxMywgMTQsIDMyLCAzM10sXG4gICAgICBzaGFwZTogWzUsIDZdLFxuICAgIH07XG4gICAgY29uc3QgaW5kaWNlcyA9IHNwYXJzZVRlbnNvci5pbmQ7XG4gICAgY29uc3QgdmFsdWVzID0gdGYudGVuc29yMWQoc3BhcnNlVGVuc29yLnZhbCwgJ2Zsb2F0MzInKTtcbiAgICBjb25zdCBkZW5zZVNoYXBlID0gdGYudGVuc29yMWQoc3BhcnNlVGVuc29yLnNoYXBlLCAnaW50MzInKTtcbiAgICBjb25zdCByZXN1bHQgPVxuICAgICAgICB0Zi5zcGFyc2Uuc3BhcnNlRmlsbEVtcHR5Um93cyhpbmRpY2VzLCB2YWx1ZXMsIGRlbnNlU2hhcGUsIC0xKTtcblxuICAgIGF3YWl0IHJlc3VsdC5vdXRwdXRJbmRpY2VzLmRhdGEoKTtcbiAgICBhd2FpdCByZXN1bHQub3V0cHV0VmFsdWVzLmRhdGEoKTtcbiAgICBhd2FpdCByZXN1bHQuZW1wdHlSb3dJbmRpY2F0b3IuZGF0YSgpO1xuICAgIGF3YWl0IHJlc3VsdC5yZXZlcnNlSW5kZXhNYXAuZGF0YSgpO1xuXG4gICAgY29uc3QgYWZ0ZXJSZXNEYXRhSWRzID0gdGYuZW5naW5lKCkuYmFja2VuZC5udW1EYXRhSWRzKCk7XG4gICAgZXhwZWN0KGFmdGVyUmVzRGF0YUlkcykudG9FcXVhbChiZWZvcmVEYXRhSWRzICsgNyk7XG5cbiAgICBpbmRpY2VzLmRpc3Bvc2UoKTtcbiAgICB2YWx1ZXMuZGlzcG9zZSgpO1xuICAgIGRlbnNlU2hhcGUuZGlzcG9zZSgpO1xuICAgIHJlc3VsdC5vdXRwdXRJbmRpY2VzLmRpc3Bvc2UoKTtcbiAgICByZXN1bHQub3V0cHV0VmFsdWVzLmRpc3Bvc2UoKTtcbiAgICByZXN1bHQuZW1wdHlSb3dJbmRpY2F0b3IuZGlzcG9zZSgpO1xuICAgIHJlc3VsdC5yZXZlcnNlSW5kZXhNYXAuZGlzcG9zZSgpO1xuXG4gICAgY29uc3QgYWZ0ZXJEaXNwb3NlRGF0YUlkcyA9IHRmLmVuZ2luZSgpLmJhY2tlbmQubnVtRGF0YUlkcygpO1xuICAgIGV4cGVjdChhZnRlckRpc3Bvc2VEYXRhSWRzKS50b0VxdWFsKGJlZm9yZURhdGFJZHMpO1xuICB9KTtcblxuICBpdCgndGhyb3cgZXJyb3IgaWYgZGVuc2Ugcm93cyBpcyBlbXB0eSBhbmQgaW5kaWNlcyBpcyBub3QnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgc3BhcnNlVGVuc29yID0ge1xuICAgICAgaW5kOiB0Zi50ZW5zb3IyZChbWzAsIDBdXSwgWzEsIDJdLCAnaW50MzInKSxcbiAgICAgIHZhbDogWzFdLFxuICAgICAgc2hhcGU6IFswLCA1XSxcbiAgICB9O1xuICAgIGV4cGVjdChcbiAgICAgICAgKCkgPT4gdGYuc3BhcnNlLnNwYXJzZUZpbGxFbXB0eVJvd3MoXG4gICAgICAgICAgICBzcGFyc2VUZW5zb3IuaW5kLCBzcGFyc2VUZW5zb3IudmFsLCBzcGFyc2VUZW5zb3Iuc2hhcGUsIC0xKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvaW5kaWNlc1xcLnNoYXBlXFxbMFxcXSA9IDEvKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93IGVycm9yIGlmIG5lZ2F0aXZlIHJvdycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzcGFyc2VUZW5zb3IgPSB7XG4gICAgICBpbmQ6IHRmLnRlbnNvcjJkKFtbLTEsIDBdXSwgWzEsIDJdLCAnaW50MzInKSxcbiAgICAgIHZhbDogWzFdLFxuICAgICAgc2hhcGU6IFs1LCA1XSxcbiAgICB9O1xuICAgIGV4cGVjdChcbiAgICAgICAgKCkgPT4gdGYuc3BhcnNlLnNwYXJzZUZpbGxFbXB0eVJvd3MoXG4gICAgICAgICAgICBzcGFyc2VUZW5zb3IuaW5kLCBzcGFyc2VUZW5zb3IudmFsLCBzcGFyc2VUZW5zb3Iuc2hhcGUsIC0xKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcignaW5kaWNlcygwLCAwKSBpcyBpbnZhbGlkOiAtMSA8IDAnKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93IGVycm9yIGlmIHJvdyBleGNlZWRzIG51bWJlciBvZiBkZW5zZSByb3dzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHNwYXJzZVRlbnNvciA9IHtcbiAgICAgIGluZDogdGYudGVuc29yMmQoW1s1LCAwXV0sIFsxLCAyXSwgJ2ludDMyJyksXG4gICAgICB2YWw6IFsxXSxcbiAgICAgIHNoYXBlOiBbNSwgNV0sXG4gICAgfTtcbiAgICBleHBlY3QoXG4gICAgICAgICgpID0+IHRmLnNwYXJzZS5zcGFyc2VGaWxsRW1wdHlSb3dzKFxuICAgICAgICAgICAgc3BhcnNlVGVuc29yLmluZCwgc3BhcnNlVGVuc29yLnZhbCwgc3BhcnNlVGVuc29yLnNoYXBlLCAtMSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoJ2luZGljZXMoMCwgMCkgaXMgaW52YWxpZDogNSA+PSA1Jyk7XG4gIH0pO1xufSk7XG4iXX0=