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
describeWithFlags('step kernel', ALL_ENVS, () => {
    it('with 1d tensor', async () => {
        const a = tf.tensor1d([1, -2, -.01, 3, -0.1]);
        const result = tf.step(a);
        expectArraysClose(await result.data(), [1, 0, 0, 1, 0]);
    });
    it('with 1d tensor and alpha', async () => {
        const a = tf.tensor1d([1, -2, -.01, 3, NaN]);
        const result = tf.step(a, 0.1);
        expectArraysClose(await result.data(), [1, 0.1, 0.1, 1, NaN]);
    });
    it('with 2d tensor', async () => {
        const a = tf.tensor2d([1, -5, -3, 4], [2, 2]);
        const result = tf.step(a);
        expect(result.shape).toEqual([2, 2]);
        expectArraysClose(await result.data(), [1, 0, 0, 1]);
    });
    it('propagates NaNs', async () => {
        const a = tf.tensor1d([1, -2, -.01, 3, NaN]);
        const result = tf.step(a);
        expectArraysClose(await result.data(), [1, 0, 0, 1, NaN]);
    });
    it('with int32 tensor', async () => {
        const a = tf.tensor1d([1, -2, 12345678, -12345678], 'int32');
        const result = tf.step(a);
        expect(result.dtype).toEqual('int32');
        expectArraysClose(await result.data(), [1, 0, 1, 0]);
    });
    it('gradients: Scalar', async () => {
        const a = tf.scalar(-4);
        const dy = tf.scalar(8);
        const gradients = tf.grad(a => tf.step(a))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [0]);
    });
    it('gradient with clones', async () => {
        const a = tf.scalar(-4);
        const dy = tf.scalar(8);
        const gradients = tf.grad(a => tf.step(a.clone()).clone())(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [0]);
    });
    it('gradients: Tensor1D', async () => {
        const a = tf.tensor1d([1, 2, -3, 5]);
        const dy = tf.tensor1d([1, 2, 3, 4]);
        const gradients = tf.grad(a => tf.step(a))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [0, 0, 0, 0]);
    });
    it('gradients: Tensor2D', async () => {
        const a = tf.tensor2d([3, -1, -2, 3], [2, 2]);
        const dy = tf.tensor2d([1, 2, 3, 4], [2, 2]);
        const gradients = tf.grad(a => tf.step(a))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [0, 0, 0, 0]);
    });
    it('throws when passed a non-tensor', () => {
        expect(() => tf.step({}))
            .toThrowError(/Argument 'x' passed to 'step' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const result = tf.step([1, -2, -.01, 3, -0.1]);
        expectArraysClose(await result.data(), [1, 0, 0, 1, 0]);
    });
    it('throws for string tensor', () => {
        expect(() => tf.step('q'))
            .toThrowError(/Argument 'x' passed to 'step' must be numeric/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcF90ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc3RlcF90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFL0MsaUJBQWlCLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDOUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzlCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMs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QyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLGlCQUFpQixDQUFDLE1BQU0sU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNuQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0MsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLGlCQUFpQixDQUFDLE1BQU0sU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDekMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBZSxDQUFDLENBQUM7YUFDakMsWUFBWSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9DLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3JCLFlBQVksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQ3JFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3N0ZXAga2VybmVsJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ3dpdGggMWQgdGVuc29yJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgLTIsIC0uMDEsIDMsIC0wLjFdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zdGVwKGEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsxLCAwLCAwLCAxLCAwXSk7XG4gIH0pO1xuXG4gIGl0KCd3aXRoIDFkIHRlbnNvciBhbmQgYWxwaGEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAtMiwgLS4wMSwgMywgTmFOXSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuc3RlcChhLCAwLjEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsxLCAwLjEsIDAuMSwgMSwgTmFOXSk7XG4gIH0pO1xuXG4gIGl0KCd3aXRoIDJkIHRlbnNvcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIC01LCAtMywgNF0sIFsyLCAyXSk7XG4gICAgY29uc3QgcmVzdWx0ID0gdGYuc3RlcChhKTtcbiAgICBleHBlY3QocmVzdWx0LnNoYXBlKS50b0VxdWFsKFsyLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzEsIDAsIDAsIDFdKTtcbiAgfSk7XG5cbiAgaXQoJ3Byb3BhZ2F0ZXMgTmFOcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIC0yLCAtLjAxLCAzLCBOYU5dKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zdGVwKGEpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsxLCAwLCAwLCAxLCBOYU5dKTtcbiAgfSk7XG5cbiAgaXQoJ3dpdGggaW50MzIgdGVuc29yJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IxZChbMSwgLTIsIDEyMzQ1Njc4LCAtMTIzNDU2NzhdLCAnaW50MzInKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zdGVwKGEpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvRXF1YWwoJ2ludDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgWzEsIDAsIDEsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50czogU2NhbGFyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi5zY2FsYXIoLTQpO1xuICAgIGNvbnN0IGR5ID0gdGYuc2NhbGFyKDgpO1xuXG4gICAgY29uc3QgZ3JhZGllbnRzID0gdGYuZ3JhZChhID0+IHRmLnN0ZXAoYSkpKGEsIGR5KTtcblxuICAgIGV4cGVjdChncmFkaWVudHMuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGdyYWRpZW50cy5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGdyYWRpZW50cy5kYXRhKCksIFswXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudCB3aXRoIGNsb25lcycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYuc2NhbGFyKC00KTtcbiAgICBjb25zdCBkeSA9IHRmLnNjYWxhcig4KTtcblxuICAgIGNvbnN0IGdyYWRpZW50cyA9IHRmLmdyYWQoYSA9PiB0Zi5zdGVwKGEuY2xvbmUoKSkuY2xvbmUoKSkoYSwgZHkpO1xuXG4gICAgZXhwZWN0KGdyYWRpZW50cy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZ3JhZGllbnRzLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZ3JhZGllbnRzLmRhdGEoKSwgWzBdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50czogVGVuc29yMUQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAtMywgNV0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdKTtcblxuICAgIGNvbnN0IGdyYWRpZW50cyA9IHRmLmdyYWQoYSA9PiB0Zi5zdGVwKGEpKShhLCBkeSk7XG5cbiAgICBleHBlY3QoZ3JhZGllbnRzLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChncmFkaWVudHMuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBncmFkaWVudHMuZGF0YSgpLCBbMCwgMCwgMCwgMF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBUZW5zb3IyRCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzMsIC0xLCAtMiwgM10sIFsyLCAyXSk7XG4gICAgY29uc3QgZHkgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNF0sIFsyLCAyXSk7XG5cbiAgICBjb25zdCBncmFkaWVudHMgPSB0Zi5ncmFkKGEgPT4gdGYuc3RlcChhKSkoYSwgZHkpO1xuXG4gICAgZXhwZWN0KGdyYWRpZW50cy5zaGFwZSkudG9FcXVhbChhLnNoYXBlKTtcbiAgICBleHBlY3QoZ3JhZGllbnRzLmR0eXBlKS50b0VxdWFsKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgZ3JhZGllbnRzLmRhdGEoKSwgWzAsIDAsIDAsIDBdKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyB3aGVuIHBhc3NlZCBhIG5vbi10ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnN0ZXAoe30gYXMgdGYuVGVuc29yKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnc3RlcCcgbXVzdCBiZSBhIFRlbnNvci8pO1xuICB9KTtcblxuICBpdCgnYWNjZXB0cyBhIHRlbnNvci1saWtlIG9iamVjdCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zdGVwKFsxLCAtMiwgLS4wMSwgMywgLTAuMV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIFsxLCAwLCAwLCAxLCAwXSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgZm9yIHN0cmluZyB0ZW5zb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRmLnN0ZXAoJ3EnKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnc3RlcCcgbXVzdCBiZSBudW1lcmljLyk7XG4gIH0pO1xufSk7XG4iXX0=