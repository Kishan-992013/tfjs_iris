/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
describeWithFlags('erf', ALL_ENVS, () => {
    it('basic', async () => {
        const values = [-0.25, 0.25, 0.5, .75, -0.4];
        const a = tf.tensor1d(values);
        const result = tf.erf(a);
        const expected = [-0.2763264, 0.2763264, 0.5204999, 0.7111556, -0.4283924];
        expectArraysClose(await result.data(), expected);
    });
    it('blowup', async () => {
        const values = [-1.4, -2.5, -3.1, -4.4];
        const a = tf.tensor1d(values);
        const result = tf.erf(a);
        const expected = [-0.9522852, -0.999593, -0.9999883, -1];
        expectArraysClose(await result.data(), expected);
    });
    it('scalar', async () => {
        const a = tf.scalar(1);
        const result = tf.erf(a);
        const expected = [0.8427008];
        expectArraysClose(await result.data(), expected);
    });
    it('scalar in int32', async () => {
        const a = tf.scalar(1, 'int32');
        const result = tf.erf(a);
        const expected = [0.8427008];
        expectArraysClose(await result.data(), expected);
    });
    it('tensor2d', async () => {
        const values = [0.2, 0.3, 0.4, 0.5];
        const a = tf.tensor2d(values, [2, 2]);
        const result = tf.erf(a);
        const expected = [0.2227026, 0.32862678, 0.42839235, 0.5204999];
        expectArraysClose(await result.data(), expected);
    });
    it('propagates NaNs', async () => {
        const a = tf.tensor1d([0.5, NaN, 0]);
        const res = tf.erf(a);
        expectArraysClose(await res.data(), [0.5204999, NaN, 0.0]);
    });
    it('gradients: Scalar', async () => {
        const a = tf.scalar(0.5);
        const dy = tf.scalar(8);
        const gradients = tf.grad(a => tf.erf(a))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [8 * 2 * Math.exp(-0.5 * 0.5) / Math.sqrt(Math.PI)]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(0.5);
        const dy = tf.scalar(8);
        const gradients = tf.grad(a => tf.erf(a.clone()).clone())(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [8 * 2 * Math.exp(-0.5 * 0.5) / Math.sqrt(Math.PI)]);
    });
    it('gradients: Tensor1D', async () => {
        const aValues = [-0.1, 0.2, 0.3, -0.5];
        const dyValues = [1, 2, 3, 4];
        const a = tf.tensor1d(aValues);
        const dy = tf.tensor1d(dyValues);
        const gradients = tf.grad(a => tf.erf(a))(a, dy);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] * 2 * Math.exp(-aValues[i] * aValues[i]) /
                Math.sqrt(Math.PI);
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
        const gradients = tf.grad(a => tf.erf(a))(a, dy);
        const expected = [];
        for (let i = 0; i < a.size; i++) {
            expected[i] = dyValues[i] * 2 * Math.exp(-aValues[i] * aValues[i]) /
                Math.sqrt(Math.PI);
        }
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), expected);
    });
    it('throws when passed a non-tensor', () => {
        expect(() => tf.erf({}))
            .toThrowError(/Argument 'x' passed to 'erf' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const result = tf.erf(1);
        expectArraysClose(await result.data(), [0.8427008]);
    });
    it('throws for string tensor', () => {
        expect(() => tf.erf('q'))
            .toThrowError(/Argument 'x' passed to 'erf' must be numeric/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJmX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9lcmZfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRS9DLGlCQUFpQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDckIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDM0UsaUJBQWlCLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxNQUFN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bGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2VyZicsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCdiYXNpYycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbLTAuMjUsIDAuMjUsIDAuNSwgLjc1LCAtMC40XTtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQodmFsdWVzKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5lcmYoYSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbLTAuMjc2MzI2NCwgMC4yNzYzMjY0LCAwLjUyMDQ5OTksIDAuNzExMTU1NiwgLTAuNDI4MzkyNF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnYmxvd3VwJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHZhbHVlcyA9IFstMS40LCAtMi41LCAtMy4xLCAtNC40XTtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQodmFsdWVzKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5lcmYoYSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbLTAuOTUyMjg1MiwgLTAuOTk5NTkzLCAtMC45OTk5ODgzLCAtMV07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnc2NhbGFyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoMSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZXJmKGEpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzAuODQyNzAwOF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnc2NhbGFyIGluIGludDMyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoMSwgJ2ludDMyJyk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZXJmKGEpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gWzAuODQyNzAwOF07XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgndGVuc29yMmQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdmFsdWVzID0gWzAuMiwgMC4zLCAwLjQsIDAuNV07XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKHZhbHVlcywgWzIsIDJdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5lcmYoYSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbMC4yMjI3MDI2LCAwLjMyODYyNjc4LCAwLjQyODM5MjM1LCAwLjUyMDQ5OTldO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ3Byb3BhZ2F0ZXMgTmFOcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzAuNSwgTmFOLCAwXSk7XG4gICAgY29uc3QgcmVzID0gdGYuZXJmKGEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFswLjUyMDQ5OTksIE5hTiwgMC4wXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFNjYWxhcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKDAuNSk7XG4gICAgY29uc3QgZHkgPSB0Zi5zY2FsYXIoOCk7XG4gICAgY29uc3QgZ3JhZGllbnRzID0gdGYuZ3JhZChhID0+IHRmLmVyZihhKSkoYSwgZHkpO1xuICAgIGV4cGVjdChncmFkaWVudHMuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGdyYWRpZW50cy5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICBhd2FpdCBncmFkaWVudHMuZGF0YSgpLFxuICAgICAgICBbOCAqIDIgKiBNYXRoLmV4cCgtMC41ICogMC41KSAvIE1hdGguc3FydChNYXRoLlBJKV0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQgd2l0aCBjbG9uZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcigwLjUpO1xuICAgIGNvbnN0IGR5ID0gdGYuc2NhbGFyKDgpO1xuICAgIGNvbnN0IGdyYWRpZW50cyA9IHRmLmdyYWQoYSA9PiB0Zi5lcmYoYS5jbG9uZSgpKS5jbG9uZSgpKShhLCBkeSk7XG4gICAgZXhwZWN0KGdyYWRpZW50cy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZ3JhZGllbnRzLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IGdyYWRpZW50cy5kYXRhKCksXG4gICAgICAgIFs4ICogMiAqIE1hdGguZXhwKC0wLjUgKiAwLjUpIC8gTWF0aC5zcXJ0KE1hdGguUEkpXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFRlbnNvcjFEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGFWYWx1ZXMgPSBbLTAuMSwgMC4yLCAwLjMsIC0wLjVdO1xuICAgIGNvbnN0IGR5VmFsdWVzID0gWzEsIDIsIDMsIDRdO1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChhVmFsdWVzKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjFkKGR5VmFsdWVzKTtcbiAgICBjb25zdCBncmFkaWVudHMgPSB0Zi5ncmFkKGEgPT4gdGYuZXJmKGEpKShhLCBkeSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGEuc2l6ZTsgaSsrKSB7XG4gICAgICBleHBlY3RlZFtpXSA9IGR5VmFsdWVzW2ldICogMiAqIE1hdGguZXhwKC1hVmFsdWVzW2ldICogYVZhbHVlc1tpXSkgL1xuICAgICAgICAgIE1hdGguc3FydChNYXRoLlBJKTtcbiAgICB9XG4gICAgZXhwZWN0KGdyYWRpZW50cy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZ3JhZGllbnRzLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZ3JhZGllbnRzLmRhdGEoKSwgZXhwZWN0ZWQpO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBUZW5zb3IyRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhVmFsdWVzID0gWy0wLjMsIDAuMSwgMC4yLCAwLjNdO1xuICAgIGNvbnN0IGR5VmFsdWVzID0gWzEsIDIsIDMsIDRdO1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChhVmFsdWVzLCBbMiwgMl0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMmQoZHlWYWx1ZXMsIFsyLCAyXSk7XG4gICAgY29uc3QgZ3JhZGllbnRzID0gdGYuZ3JhZChhID0+IHRmLmVyZihhKSkoYSwgZHkpO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhLnNpemU7IGkrKykge1xuICAgICAgZXhwZWN0ZWRbaV0gPSBkeVZhbHVlc1tpXSAqIDIgKiBNYXRoLmV4cCgtYVZhbHVlc1tpXSAqIGFWYWx1ZXNbaV0pIC9cbiAgICAgICAgICBNYXRoLnNxcnQoTWF0aC5QSSk7XG4gICAgfVxuICAgIGV4cGVjdChncmFkaWVudHMuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGdyYWRpZW50cy5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGdyYWRpZW50cy5kYXRhKCksIGV4cGVjdGVkKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIHBhc3NlZCBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLmVyZih7fSBhcyB0Zi5UZW5zb3IpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAneCcgcGFzc2VkIHRvICdlcmYnIG11c3QgYmUgYSBUZW5zb3IvKTtcbiAgfSk7XG5cbiAgaXQoJ2FjY2VwdHMgYSB0ZW5zb3ItbGlrZSBvYmplY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuZXJmKDEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFswLjg0MjcwMDhdKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBmb3Igc3RyaW5nIHRlbnNvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYuZXJmKCdxJykpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICd4JyBwYXNzZWQgdG8gJ2VyZicgbXVzdCBiZSBudW1lcmljLyk7XG4gIH0pO1xufSk7XG4iXX0=