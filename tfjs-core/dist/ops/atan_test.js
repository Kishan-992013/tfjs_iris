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
describeWithFlags('atan', ALL_ENVS, () => {
    it('basic', async () => {
        const values = [1, -3, 2, 7, -4];
        const a = tf.tensor1d(values);
        const result = tf.atan(a);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = Math.atan(values[i]);
        }
        expectArraysClose(await result.data(), expected);
    });
    it('6D atan', async () => {
        const a = tf.range(1, 65).reshape([2, 2, 2, 2, 2, 2]);
        const result = tf.atan(a);
        const expected = [];
        for (let i = 1; i < 65; ++i) {
            expected[i - 1] = Math.atan(i);
        }
        expectArraysClose(await result.data(), expected);
    });
    it('propagates NaNs', async () => {
        const a = tf.tensor1d([4, NaN, 0]);
        const res = tf.atan(a);
        expectArraysClose(await res.data(), [Math.atan(4), NaN, Math.atan(0)]);
    });
    it('gradients: Scalar', async () => {
        const a = tf.scalar(0.5);
        const dy = tf.scalar(8);
        const gradients = tf.grad(a => tf.atan(a))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [8 / (1 + (0.5 * 0.5))]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(0.5);
        const dy = tf.scalar(8);
        const gradients = tf.grad(a => tf.atan(a.clone()).clone())(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [8 / (1 + (0.5 * 0.5))]);
    });
    it('gradients: Tensor1D', async () => {
        const aValues = [-0.1, 0.2, 0.3, -0.5];
        const dyValues = [1, 2, 3, 4];
        const a = tf.tensor1d(aValues);
        const dy = tf.tensor1d(dyValues);
        const gradients = tf.grad(a => tf.atan(a))(a, dy);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / (1 + (aValues[i] * aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), expected);
    });
    it('gradients: Tensor2D', async () => {
        const aValues = [-0.3, 0.1, 0.2, 0.3];
        const dyValues = [1, 2, 3, 4];
        const a = tf.tensor2d(aValues, [2, 2]);
        const dy = tf.tensor2d(dyValues, [2, 2]);
        const gradients = tf.grad(a => tf.atan(a))(a, dy);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] / (1 + (aValues[i] * aValues[i]));
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), expected);
    });
    it('throws when passed a non-tensor', () => {
        expect(() => tf.atan({}))
            .toThrowError(/Argument 'x' passed to 'atan' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const values = [1, -3, 2, 7, -4];
        const result = tf.atan(values);
        const expected = [];
        for (let i = 0; i < values.length; i++) {
            expected[i] = Math.atan(values[i]);
        }
        expectArraysClose(await result.data(), expected);
    });
    it('throws for string tensor', () => {
        expect(() => tf.atan('q'))
            .toThrowError(/Argument 'x' passed to 'atan' must be numeric/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXRhbl90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvYXRhbl90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFL0MsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNwQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwQztRQUNELGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLFNBQVMsRUFBRSxLQUFLLElB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QVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0MsaUJBQWlCLENBQUMsTUFBTSxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbkMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFakMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEQsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQy9CLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3RDtRQUVELE1BQU0sQ0FBQyxTQUFTLENB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SCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JCLFlBQVksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3JFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2F0YW4nLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnYmFzaWMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdmFsdWVzID0gWzEsIC0zLCAyLCA3LCAtNF07XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKHZhbHVlcyk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuYXRhbihhKTtcblxuICAgIGNvbnN0IGV4cGVjdGVkID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLnNpemU7IGkrKykge1xuICAgICAgZXhwZWN0ZWRbaV0gPSBNYXRoLmF0YW4odmFsdWVzW2ldKTtcbiAgICB9XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnNkQgYXRhbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYucmFuZ2UoMSwgNjUpLnJlc2hhcGUoWzIsIDIsIDIsIDIsIDIsIDJdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5hdGFuKGEpO1xuXG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IDY1OyArK2kpIHtcbiAgICAgIGV4cGVjdGVkW2kgLSAxXSA9IE1hdGguYXRhbihpKTtcbiAgICB9XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgncHJvcGFnYXRlcyBOYU5zJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbNCwgTmFOLCAwXSk7XG4gICAgY29uc3QgcmVzID0gdGYuYXRhbihhKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXMuZGF0YSgpLCBbTWF0aC5hdGFuKDQpLCBOYU4sIE1hdGguYXRhbigwKV0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBTY2FsYXInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigwLjUpO1xuICAgIGNvbnN0IGR5ID0gdGYuc2NhbGFyKDgpO1xuXG4gICAgY29uc3QgZ3JhZGllbnRzID0gdGYuZ3JhZChhID0+IHRmLmF0YW4oYSkpKGEsIGR5KTtcblxuICAgIGV4cGVjdChncmFkaWVudHMuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGdyYWRpZW50cy5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGdyYWRpZW50cy5kYXRhKCksIFs4IC8gKDEgKyAoMC41ICogMC41KSldKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50IHdpdGggY2xvbmVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoMC41KTtcbiAgICBjb25zdCBkeSA9IHRmLnNjYWxhcig4KTtcblxuICAgIGNvbnN0IGdyYWRpZW50cyA9IHRmLmdyYWQoYSA9PiB0Zi5hdGFuKGEuY2xvbmUoKSkuY2xvbmUoKSkoYSwgZHkpO1xuXG4gICAgZXhwZWN0KGdyYWRpZW50cy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZ3JhZGllbnRzLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZ3JhZGllbnRzLmRhdGEoKSwgWzggLyAoMSArICgwLjUgKiAwLjUpKV0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBUZW5zb3IxRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhVmFsdWVzID0gWy0wLjEsIDAuMiwgMC4zLCAtMC41XTtcbiAgICBjb25zdCBkeVZhbHVlcyA9IFsxLCAyLCAzLCA0XTtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoYVZhbHVlcyk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IxZChkeVZhbHVlcyk7XG5cbiAgICBjb25zdCBncmFkaWVudHMgPSB0Zi5ncmFkKGEgPT4gdGYuYXRhbihhKSkoYSwgZHkpO1xuXG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEuc2l6ZTsgaSsrKSB7XG4gICAgICBleHBlY3RlZFtpXSA9IGR5VmFsdWVzW2ldIC8gKDEgKyAoYVZhbHVlc1tpXSAqIGFWYWx1ZXNbaV0pKTtcbiAgICB9XG5cbiAgICBleHBlY3QoZ3JhZGllbnRzLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChncmFkaWVudHMuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBncmFkaWVudHMuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGFWYWx1ZXMgPSBbLTAuMywgMC4xLCAwLjIsIDAuM107XG4gICAgY29uc3QgZHlWYWx1ZXMgPSBbMSwgMiwgMywgNF07XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKGFWYWx1ZXMsIFsyLCAyXSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IyZChkeVZhbHVlcywgWzIsIDJdKTtcblxuICAgIGNvbnN0IGdyYWRpZW50cyA9IHRmLmdyYWQoYSA9PiB0Zi5hdGFuKGEpKShhLCBkeSk7XG5cbiAgICBjb25zdCBleHBlY3RlZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYS5zaXplOyBpKyspIHtcbiAgICAgIGV4cGVjdGVkW2ldID0gZHlWYWx1ZXNbaV0gLyAoMSArIChhVmFsdWVzW2ldICogYVZhbHVlc1tpXSkpO1xuICAgIH1cblxuICAgIGV4cGVjdChncmFkaWVudHMuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGdyYWRpZW50cy5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGdyYWRpZW50cy5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIHBhc3NlZCBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLmF0YW4oe30gYXMgdGYuVGVuc29yKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnYXRhbicgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnYWNjZXB0cyBhIHRlbnNvci1saWtlIG9iamVjdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbMSwgLTMsIDIsIDcsIC00XTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5hdGFuKHZhbHVlcyk7XG5cbiAgICBjb25zdCBleHBlY3RlZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBleHBlY3RlZFtpXSA9IE1hdGguYXRhbih2YWx1ZXNbaV0pO1xuICAgIH1cbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXN1bHQuZGF0YSgpLCBleHBlY3RlZCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZm9yIHN0cmluZyB0ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLmF0YW4oJ3EnKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnYXRhbicgbXVzdCBiZSBudW1lcmljLyk7XG4gIH0pO1xufSk7XG4iXX0=