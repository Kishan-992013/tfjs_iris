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
describeWithFlags('sqrt', ALL_ENVS, () => {
    it('sqrt', async () => {
        const a = tf.tensor1d([2, 4]);
        const r = tf.sqrt(a);
        expectArraysClose(await r.data(), [Math.sqrt(2), Math.sqrt(4)]);
    });
    it('sqrt propagates NaNs', async () => {
        const a = tf.tensor1d([1, NaN]);
        const r = tf.sqrt(a);
        expectArraysClose(await r.data(), [Math.sqrt(1), NaN]);
    });
    it('gradients: Scalar', async () => {
        const a = tf.scalar(4);
        const dy = tf.scalar(8);
        const da = tf.grad(a => tf.sqrt(a))(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [8 / (2 * Math.sqrt(4))]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(4);
        const dy = tf.scalar(8);
        const da = tf.grad(a => tf.sqrt(a.clone()).clone())(a, dy);
        expect(da.shape).toEqual(a.shape);
        expect(da.dtype).toEqual('float32');
        expectArraysClose(await da.data(), [8 / (2 * Math.sqrt(4))]);
    });
    it('gradients: Tensor1D', async () => {
        const a = tf.tensor1d([1, 2, 3, 5]);
        const dy = tf.tensor1d([1, 2, 3, 4]);
        const gradients = tf.grad(a => tf.sqrt(a))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [
            1 / (2 * Math.sqrt(1)), 2 / (2 * Math.sqrt(2)),
            3 / (2 * Math.sqrt(3)), 4 / (2 * Math.sqrt(5))
        ], 1e-1);
    });
    it('gradients: Tensor2D', async () => {
        const a = tf.tensor2d([3, 1, 2, 3], [2, 2]);
        const dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const gradients = tf.grad(a => tf.sqrt(a))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [
            1 / (2 * Math.sqrt(3)), 2 / (2 * Math.sqrt(1)),
            3 / (2 * Math.sqrt(2)), 4 / (2 * Math.sqrt(3))
        ], 1e-1);
    });
    it('throws when passed a non-tensor', () => {
        expect(() => tf.sqrt({}))
            .toThrowError(/Argument 'x' passed to 'sqrt' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const r = tf.sqrt([2, 4]);
        expectArraysClose(await r.data(), [Math.sqrt(2), Math.sqrt(4)]);
    });
    it('throws for string tensor', () => {
        expect(() => tf.sqrt('q'))
            .toThrowError(/Argument 'x' passed to 'sqrt' must be float32/);
    });
    it('throws for int32 tensor', () => {
        expect(() => tf.sqrt(tf.tensor1d([1], 'int32')))
            .toThrowError(/Argument 'x' passed to 'sqrt' must be float32/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FydF90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3FydF90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFL0MsaUJBQWlCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdkMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLElBQUksRUFBRTtRQUNwQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckIsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJ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LENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzNDLFlBQVksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3JFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3NxcnQnLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnc3FydCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzIsIDRdKTtcbiAgICBjb25zdCByID0gdGYuc3FydChhKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByLmRhdGEoKSwgW01hdGguc3FydCgyKSwgTWF0aC5zcXJ0KDQpXSk7XG4gIH0pO1xuXG4gIGl0KCdzcXJ0IHByb3BhZ2F0ZXMgTmFOcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIE5hTl0pO1xuICAgIGNvbnN0IHIgPSB0Zi5zcXJ0KGEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHIuZGF0YSgpLCBbTWF0aC5zcXJ0KDEpLCBOYU5dKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50czogU2NhbGFyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoNCk7XG4gICAgY29uc3QgZHkgPSB0Zi5zY2FsYXIoOCk7XG5cbiAgICBjb25zdCBkYSA9IHRmLmdyYWQoYSA9PiB0Zi5zcXJ0KGEpKShhLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRhLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbOCAvICgyICogTWF0aC5zcXJ0KDQpKV0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQgd2l0aCBjbG9uZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnNjYWxhcig0KTtcbiAgICBjb25zdCBkeSA9IHRmLnNjYWxhcig4KTtcblxuICAgIGNvbnN0IGRhID0gdGYuZ3JhZChhID0+IHRmLnNxcnQoYS5jbG9uZSgpKS5jbG9uZSgpKShhLCBkeSk7XG5cbiAgICBleHBlY3QoZGEuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGRhLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZGEuZGF0YSgpLCBbOCAvICgyICogTWF0aC5zcXJ0KDQpKV0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBUZW5zb3IxRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDVdKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSk7XG5cbiAgICBjb25zdCBncmFkaWVudHMgPSB0Zi5ncmFkKGEgPT4gdGYuc3FydChhKSkoYSwgZHkpO1xuXG4gICAgZXhwZWN0KGdyYWRpZW50cy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZ3JhZGllbnRzLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IGdyYWRpZW50cy5kYXRhKCksXG4gICAgICAgIFtcbiAgICAgICAgICAxIC8gKDIgKiBNYXRoLnNxcnQoMSkpLCAyIC8gKDIgKiBNYXRoLnNxcnQoMikpLFxuICAgICAgICAgIDMgLyAoMiAqIE1hdGguc3FydCgzKSksIDQgLyAoMiAqIE1hdGguc3FydCg1KSlcbiAgICAgICAgXSxcbiAgICAgICAgMWUtMSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IFRlbnNvcjJEJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMywgMSwgMiwgM10sIFsyLCAyXSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNF0sIFsyLCAyXSk7XG5cbiAgICBjb25zdCBncmFkaWVudHMgPSB0Zi5ncmFkKGEgPT4gdGYuc3FydChhKSkoYSwgZHkpO1xuXG4gICAgZXhwZWN0KGdyYWRpZW50cy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZ3JhZGllbnRzLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgIGF3YWl0IGdyYWRpZW50cy5kYXRhKCksXG4gICAgICAgIFtcbiAgICAgICAgICAxIC8gKDIgKiBNYXRoLnNxcnQoMykpLCAyIC8gKDIgKiBNYXRoLnNxcnQoMSkpLFxuICAgICAgICAgIDMgLyAoMiAqIE1hdGguc3FydCgyKSksIDQgLyAoMiAqIE1hdGguc3FydCgzKSlcbiAgICAgICAgXSxcbiAgICAgICAgMWUtMSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5zcXJ0KHt9IGFzIHRmLlRlbnNvcikpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FyZ3VtZW50ICd4JyBwYXNzZWQgdG8gJ3NxcnQnIG11c3QgYmUgYSBUZW5zb3IvKTtcbiAgfSk7XG5cbiAgaXQoJ2FjY2VwdHMgYSB0ZW5zb3ItbGlrZSBvYmplY3QnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgciA9IHRmLnNxcnQoWzIsIDRdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByLmRhdGEoKSwgW01hdGguc3FydCgyKSwgTWF0aC5zcXJ0KDQpXSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZm9yIHN0cmluZyB0ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnNxcnQoJ3EnKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnc3FydCcgbXVzdCBiZSBmbG9hdDMyLyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZm9yIGludDMyIHRlbnNvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGYuc3FydCh0Zi50ZW5zb3IxZChbMV0sICdpbnQzMicpKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnc3FydCcgbXVzdCBiZSBmbG9hdDMyLyk7XG4gIH0pO1xufSk7XG4iXX0=