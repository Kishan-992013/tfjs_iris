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
describeWithFlags('bincount', ALL_ENVS, () => {
    it('with 0-length weights.', async () => {
        const x = tf.tensor1d([1, 1, 1, 2], 'int32');
        const weights = tf.tensor1d([]);
        const size = 3;
        const result = tf.bincount(x, weights, size);
        expect(result.shape).toEqual([3]);
        expectArraysClose(await result.data(), [0, 3, 1]);
    });
    it('with number out of range.', async () => {
        const x = tf.tensor1d([1, 1, 1, 2], 'int32');
        const weights = tf.tensor1d([]);
        const size = 2;
        const result = tf.bincount(x, weights, size);
        expect(result.shape).toEqual([2]);
        expectArraysClose(await result.data(), [0, 3]);
    });
    it('with 1d float weights.', async () => {
        const x = tf.tensor1d([1, 1, 1, 2], 'int32');
        const weights = tf.tensor1d([0.5, 0.3, 0.3, 0.1]);
        const size = 3;
        const result = tf.bincount(x, weights, size);
        expect(result.shape).toEqual([3]);
        expectArraysClose(await result.data(), [0, 1.1, 0.1]);
    });
    it('with 1d float weights and number out of range.', async () => {
        const x = tf.tensor1d([1, 1, 1, 2], 'int32');
        const weights = tf.tensor1d([0.5, 0.3, 0.3, 0.1]);
        const size = 2;
        const result = tf.bincount(x, weights, size);
        expect(result.shape).toEqual([2]);
        expectArraysClose(await result.data(), [0, 1.1]);
    });
    it('throws error for non int x tensor.', async () => {
        const x = tf.tensor1d([1, 1, 1, 2], 'float32');
        const weights = tf.tensor1d([]);
        const size = 3;
        expect(() => tf.bincount(x, weights, size)).toThrowError();
    });
    it('throws error if size is negative.', async () => {
        const x = tf.tensor1d([1, 1, 1, 2], 'int32');
        const weights = tf.tensor1d([]);
        const size = -1;
        expect(() => tf.bincount(x, weights, size)).toThrowError();
    });
    it('throws error when shape is different.', async () => {
        const x = tf.tensor1d([1, 1, 1, 2], 'int32');
        const weights = tf.tensor1d([0.5, 0.3]);
        const size = 2;
        expect(() => tf.bincount(x, weights, size)).toThrowError();
    });
    it('hands output from other ops.', async () => {
        const x = tf.tensor1d([1, 1, 1, 2], 'int32');
        const weights = tf.tensor1d([]);
        const size = 4;
        const added = tf.add(x, tf.tensor1d([1], 'int32'));
        const result = tf.bincount(added, weights, size);
        expect(result.shape).toEqual([4]);
        expectArraysClose(await result.data(), [0, 0, 3, 1]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluY291bnRfdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2JpbmNvdW50X3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBRUgsT0FBTyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUvQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUMzQyxFQUFFLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRWYsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTdDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxpQkFBaUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN6QyxN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QUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNmLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQWMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVqRCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2JpbmNvdW50JywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ3dpdGggMC1sZW5ndGggd2VpZ2h0cy4nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAxLCAxLCAyXSwgJ2ludDMyJyk7XG4gICAgY29uc3Qgd2VpZ2h0cyA9IHRmLnRlbnNvcjFkKFtdKTtcbiAgICBjb25zdCBzaXplID0gMztcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRmLmJpbmNvdW50KHgsIHdlaWdodHMsIHNpemUpO1xuXG4gICAgZXhwZWN0KHJlc3VsdC5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLCAzLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCd3aXRoIG51bWJlciBvdXQgb2YgcmFuZ2UuJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMSwgMSwgMl0sICdpbnQzMicpO1xuICAgIGNvbnN0IHdlaWdodHMgPSB0Zi50ZW5zb3IxZChbXSk7XG4gICAgY29uc3Qgc2l6ZSA9IDI7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5iaW5jb3VudCh4LCB3ZWlnaHRzLCBzaXplKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMCwgM10pO1xuICB9KTtcblxuICBpdCgnd2l0aCAxZCBmbG9hdCB3ZWlnaHRzLicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDEsIDEsIDJdLCAnaW50MzInKTtcbiAgICBjb25zdCB3ZWlnaHRzID0gdGYudGVuc29yMWQoWzAuNSwgMC4zLCAwLjMsIDAuMV0pO1xuICAgIGNvbnN0IHNpemUgPSAzO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGYuYmluY291bnQoeCwgd2VpZ2h0cywgc2l6ZSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFszXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAsIDEuMSwgMC4xXSk7XG4gIH0pO1xuXG4gIGl0KCd3aXRoIDFkIGZsb2F0IHdlaWdodHMgYW5kIG51bWJlciBvdXQgb2YgcmFuZ2UuJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMSwgMSwgMl0sICdpbnQzMicpO1xuICAgIGNvbnN0IHdlaWdodHMgPSB0Zi50ZW5zb3IxZChbMC41LCAwLjMsIDAuMywgMC4xXSk7XG4gICAgY29uc3Qgc2l6ZSA9IDI7XG5cbiAgICBjb25zdCByZXN1bHQgPSB0Zi5iaW5jb3VudCh4LCB3ZWlnaHRzLCBzaXplKTtcblxuICAgIGV4cGVjdChyZXN1bHQuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBbMCwgMS4xXSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZXJyb3IgZm9yIG5vbiBpbnQgeCB0ZW5zb3IuJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMSwgMSwgMl0sICdmbG9hdDMyJyk7XG4gICAgY29uc3Qgd2VpZ2h0cyA9IHRmLnRlbnNvcjFkKFtdKTtcbiAgICBjb25zdCBzaXplID0gMztcblxuICAgIGV4cGVjdCgoKSA9PiB0Zi5iaW5jb3VudCh4LCB3ZWlnaHRzLCBzaXplKSkudG9UaHJvd0Vycm9yKCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZXJyb3IgaWYgc2l6ZSBpcyBuZWdhdGl2ZS4nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAxLCAxLCAyXSwgJ2ludDMyJyk7XG4gICAgY29uc3Qgd2VpZ2h0cyA9IHRmLnRlbnNvcjFkKFtdKTtcbiAgICBjb25zdCBzaXplID0gLTE7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuYmluY291bnQoeCwgd2VpZ2h0cywgc2l6ZSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGVycm9yIHdoZW4gc2hhcGUgaXMgZGlmZmVyZW50LicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDEsIDEsIDJdLCAnaW50MzInKTtcbiAgICBjb25zdCB3ZWlnaHRzID0gdGYudGVuc29yMWQoWzAuNSwgMC4zXSk7XG4gICAgY29uc3Qgc2l6ZSA9IDI7XG5cbiAgICBleHBlY3QoKCkgPT4gdGYuYmluY291bnQoeCwgd2VpZ2h0cywgc2l6ZSkpLnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICBpdCgnaGFuZHMgb3V0cHV0IGZyb20gb3RoZXIgb3BzLicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDEsIDEsIDJdLCAnaW50MzInKTtcbiAgICBjb25zdCB3ZWlnaHRzID0gdGYudGVuc29yMWQoW10pO1xuICAgIGNvbnN0IHNpemUgPSA0O1xuICAgIGNvbnN0IGFkZGVkID0gdGYuYWRkPHRmLlRlbnNvcjFEPih4LCB0Zi50ZW5zb3IxZChbMV0sICdpbnQzMicpKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5iaW5jb3VudChhZGRlZCwgd2VpZ2h0cywgc2l6ZSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFs0XSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzAsIDAsIDMsIDFdKTtcbiAgfSk7XG59KTtcbiJdfQ==