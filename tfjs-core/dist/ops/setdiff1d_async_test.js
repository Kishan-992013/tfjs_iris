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
describeWithFlags('setdiff1dAsync', ALL_ENVS, () => {
    it('1d int32 tensor', async () => {
        const x = tf.tensor1d([1, 2, 3, 4], 'int32');
        const y = tf.tensor1d([1, 2], 'int32');
        const [out, indices] = await tf.setdiff1dAsync(x, y);
        expect(out.dtype).toBe('int32');
        expect(indices.dtype).toBe('int32');
        expect(out.shape).toEqual([2]);
        expect(indices.shape).toEqual([2]);
        expectArraysClose(await out.data(), [3, 4]);
        expectArraysClose(await indices.data(), [2, 3]);
    });
    it('1d float32 tensor', async () => {
        const x = tf.tensor1d([1, 2, 3, 4], 'float32');
        const y = tf.tensor1d([1, 3], 'float32');
        const [out, indices] = await tf.setdiff1dAsync(x, y);
        expect(out.dtype).toBe('float32');
        expect(indices.dtype).toBe('int32');
        expect(out.shape).toEqual([2]);
        expect(indices.shape).toEqual([2]);
        expectArraysClose(await out.data(), [2, 4]);
        expectArraysClose(await indices.data(), [1, 3]);
    });
    it('empty output', async () => {
        const x = tf.tensor1d([1, 2, 3, 4], 'float32');
        const y = tf.tensor1d([1, 2, 3, 4], 'float32');
        const [out, indices] = await tf.setdiff1dAsync(x, y);
        expect(out.dtype).toBe('float32');
        expect(indices.dtype).toBe('int32');
        expect(out.shape).toEqual([0]);
        expect(indices.shape).toEqual([0]);
        expectArraysClose(await out.data(), []);
        expectArraysClose(await indices.data(), []);
    });
    it('tensor like', async () => {
        const x = [1, 2, 3, 4];
        const y = [1, 3];
        const [out, indices] = await tf.setdiff1dAsync(x, y);
        expect(out.dtype).toBe('float32');
        expect(indices.dtype).toBe('int32');
        expect(out.shape).toEqual([2]);
        expect(indices.shape).toEqual([2]);
        expectArraysClose(await out.data(), [2, 4]);
        expectArraysClose(await indices.data(), [1, 3]);
    });
    it('should throw if x is not 1d', async () => {
        const x = tf.tensor2d([1, 2, 3, 4], [4, 1], 'float32');
        const y = tf.tensor1d([1, 2, 3, 4], 'float32');
        try {
            await tf.setdiff1dAsync(x, y);
            throw new Error('The line above should have thrown an error');
        }
        catch (ex) {
            expect(ex.message).toBe('x should be 1D tensor, but got x (4,1).');
        }
    });
    it('should throw if y is not 1d', async () => {
        const x = tf.tensor1d([1, 2, 3, 4], 'float32');
        const y = tf.tensor2d([1, 2, 3, 4], [4, 1], 'float32');
        try {
            await tf.setdiff1dAsync(x, y);
            throw new Error('The line above should have thrown an error');
        }
        catch (ex) {
            expect(ex.message).toBe('y should be 1D tensor, but got y (4,1).');
        }
    });
    it('should throw if x and y dtype mismatch', async () => {
        const x = tf.tensor1d([1, 2, 3, 4], 'float32');
        const y = tf.tensor1d([1, 2, 3, 4], 'int32');
        try {
            await tf.setdiff1dAsync(x, y);
            throw new Error('The line above should have thrown an error');
        }
        catch (ex) {
            expect(ex.message)
                .toBe('x and y should have the same dtype,' +
                ' but got x (float32) and y (int32).');
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0ZGlmZjFkX2FzeW5jX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zZXRkaWZmMWRfYXN5bmNfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRS9DLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDakQsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7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d0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN0RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUk7WUFDRixNQUFNLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztTQUMvRDtRQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ1gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7aUJBQ2IsSUFBSSxDQUNELHFDQUFxQztnQkFDckMscUNBQXFDLENBQUMsQ0FBQztTQUNoRDtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3NldGRpZmYxZEFzeW5jJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJzFkIGludDMyIHRlbnNvcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB4ID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdLCAnaW50MzInKTtcbiAgICBjb25zdCB5ID0gdGYudGVuc29yMWQoWzEsIDJdLCAnaW50MzInKTtcbiAgICBjb25zdCBbb3V0LCBpbmRpY2VzXSA9IGF3YWl0IHRmLnNldGRpZmYxZEFzeW5jKHgsIHkpO1xuICAgIGV4cGVjdChvdXQuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KGluZGljZXMuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0KG91dC5zaGFwZSkudG9FcXVhbChbMl0pO1xuICAgIGV4cGVjdChpbmRpY2VzLnNoYXBlKS50b0VxdWFsKFsyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgb3V0LmRhdGEoKSwgWzMsIDRdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBpbmRpY2VzLmRhdGEoKSwgWzIsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJzFkIGZsb2F0MzIgdGVuc29yJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0sICdmbG9hdDMyJyk7XG4gICAgY29uc3QgeSA9IHRmLnRlbnNvcjFkKFsxLCAzXSwgJ2Zsb2F0MzInKTtcbiAgICBjb25zdCBbb3V0LCBpbmRpY2VzXSA9IGF3YWl0IHRmLnNldGRpZmYxZEFzeW5jKHgsIHkpO1xuICAgIGV4cGVjdChvdXQuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3Qob3V0LnNoYXBlKS50b0VxdWFsKFsyXSk7XG4gICAgZXhwZWN0KGluZGljZXMuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXQuZGF0YSgpLCBbMiwgNF0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGluZGljZXMuZGF0YSgpLCBbMSwgM10pO1xuICB9KTtcblxuICBpdCgnZW1wdHkgb3V0cHV0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0sICdmbG9hdDMyJyk7XG4gICAgY29uc3QgeSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSwgJ2Zsb2F0MzInKTtcbiAgICBjb25zdCBbb3V0LCBpbmRpY2VzXSA9IGF3YWl0IHRmLnNldGRpZmYxZEFzeW5jKHgsIHkpO1xuICAgIGV4cGVjdChvdXQuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3Qob3V0LnNoYXBlKS50b0VxdWFsKFswXSk7XG4gICAgZXhwZWN0KGluZGljZXMuc2hhcGUpLnRvRXF1YWwoWzBdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXQuZGF0YSgpLCBbXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgaW5kaWNlcy5kYXRhKCksIFtdKTtcbiAgfSk7XG5cbiAgaXQoJ3RlbnNvciBsaWtlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSBbMSwgMiwgMywgNF07XG4gICAgY29uc3QgeSA9IFsxLCAzXTtcbiAgICBjb25zdCBbb3V0LCBpbmRpY2VzXSA9IGF3YWl0IHRmLnNldGRpZmYxZEFzeW5jKHgsIHkpO1xuICAgIGV4cGVjdChvdXQuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QoaW5kaWNlcy5kdHlwZSkudG9CZSgnaW50MzInKTtcbiAgICBleHBlY3Qob3V0LnNoYXBlKS50b0VxdWFsKFsyXSk7XG4gICAgZXhwZWN0KGluZGljZXMuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBvdXQuZGF0YSgpLCBbMiwgNF0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGluZGljZXMuZGF0YSgpLCBbMSwgM10pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHRocm93IGlmIHggaXMgbm90IDFkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgNF0sIFs0LCAxXSwgJ2Zsb2F0MzInKTtcbiAgICBjb25zdCB5ID0gdGYudGVuc29yMWQoWzEsIDIsIDMsIDRdLCAnZmxvYXQzMicpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0Zi5zZXRkaWZmMWRBc3luYyh4LCB5KTtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGxpbmUgYWJvdmUgc2hvdWxkIGhhdmUgdGhyb3duIGFuIGVycm9yJyk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGV4cGVjdChleC5tZXNzYWdlKS50b0JlKCd4IHNob3VsZCBiZSAxRCB0ZW5zb3IsIGJ1dCBnb3QgeCAoNCwxKS4nKTtcbiAgICB9XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgdGhyb3cgaWYgeSBpcyBub3QgMWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeCA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSwgJ2Zsb2F0MzInKTtcbiAgICBjb25zdCB5ID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDRdLCBbNCwgMV0sICdmbG9hdDMyJyk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRmLnNldGRpZmYxZEFzeW5jKHgsIHkpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgbGluZSBhYm92ZSBzaG91bGQgaGF2ZSB0aHJvd24gYW4gZXJyb3InKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgZXhwZWN0KGV4Lm1lc3NhZ2UpLnRvQmUoJ3kgc2hvdWxkIGJlIDFEIHRlbnNvciwgYnV0IGdvdCB5ICg0LDEpLicpO1xuICAgIH1cbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCB0aHJvdyBpZiB4IGFuZCB5IGR0eXBlIG1pc21hdGNoJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHggPSB0Zi50ZW5zb3IxZChbMSwgMiwgMywgNF0sICdmbG9hdDMyJyk7XG4gICAgY29uc3QgeSA9IHRmLnRlbnNvcjFkKFsxLCAyLCAzLCA0XSwgJ2ludDMyJyk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRmLnNldGRpZmYxZEFzeW5jKHgsIHkpO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgbGluZSBhYm92ZSBzaG91bGQgaGF2ZSB0aHJvd24gYW4gZXJyb3InKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgZXhwZWN0KGV4Lm1lc3NhZ2UpXG4gICAgICAgICAgLnRvQmUoXG4gICAgICAgICAgICAgICd4IGFuZCB5IHNob3VsZCBoYXZlIHRoZSBzYW1lIGR0eXBlLCcgK1xuICAgICAgICAgICAgICAnIGJ1dCBnb3QgeCAoZmxvYXQzMikgYW5kIHkgKGludDMyKS4nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=