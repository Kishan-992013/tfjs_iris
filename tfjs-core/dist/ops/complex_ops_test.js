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
describeWithFlags('complex64', ALL_ENVS, () => {
    it('tf.complex', async () => {
        const real = tf.tensor1d([3, 30]);
        const imag = tf.tensor1d([4, 40]);
        const complex = tf.complex(real, imag);
        expect(complex.dtype).toBe('complex64');
        expect(complex.shape).toEqual(real.shape);
        expectArraysClose(await complex.data(), [3, 4, 30, 40]);
    });
    it('tf.real', async () => {
        const complex = tf.complex([3, 30], [4, 40]);
        const real = tf.real(complex);
        expect(real.dtype).toBe('float32');
        expect(real.shape).toEqual([2]);
        expectArraysClose(await real.data(), [3, 30]);
    });
    it('tf.imag', async () => {
        const complex = tf.complex([3, 30], [4, 40]);
        const imag = tf.imag(complex);
        expect(imag.dtype).toBe('float32');
        expect(imag.shape).toEqual([2]);
        expectArraysClose(await imag.data(), [4, 40]);
    });
    it('throws when shapes dont match', () => {
        const real = tf.tensor1d([3, 30]);
        const imag = tf.tensor1d([4, 40, 50]);
        const re = /real and imag shapes, 2 and 3, must match in call to tf.complex\(\)/;
        expect(() => tf.complex(real, imag)).toThrowError(re);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxleF9vcHNfdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL2NvbXBsZXhfb3BzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxLQUFLLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0IsT0FBTyxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzVELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUvQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUM1QyxFQUFFLENBQUMsWUFBWSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzFCLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFdkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLGlCQUFpQixDQUFDLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdkIsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGlCQUFpQixDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsU0FBUyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZCLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxpQkFBaUIsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtRQUN2QyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV0QyxNQUFNLEVBQUUsR0FDSixxRUFBcUUsQ0FBQztRQUMxRSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZX0gZnJvbSAnLi4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2NvbXBsZXg2NCcsIEFMTF9FTlZTLCAoKSA9PiB7XG4gIGl0KCd0Zi5jb21wbGV4JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlYWwgPSB0Zi50ZW5zb3IxZChbMywgMzBdKTtcbiAgICBjb25zdCBpbWFnID0gdGYudGVuc29yMWQoWzQsIDQwXSk7XG4gICAgY29uc3QgY29tcGxleCA9IHRmLmNvbXBsZXgocmVhbCwgaW1hZyk7XG5cbiAgICBleHBlY3QoY29tcGxleC5kdHlwZSkudG9CZSgnY29tcGxleDY0Jyk7XG4gICAgZXhwZWN0KGNvbXBsZXguc2hhcGUpLnRvRXF1YWwocmVhbC5zaGFwZSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgY29tcGxleC5kYXRhKCksIFszLCA0LCAzMCwgNDBdKTtcbiAgfSk7XG5cbiAgaXQoJ3RmLnJlYWwnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgY29tcGxleCA9IHRmLmNvbXBsZXgoWzMsIDMwXSwgWzQsIDQwXSk7XG4gICAgY29uc3QgcmVhbCA9IHRmLnJlYWwoY29tcGxleCk7XG5cbiAgICBleHBlY3QocmVhbC5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdChyZWFsLnNoYXBlKS50b0VxdWFsKFsyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVhbC5kYXRhKCksIFszLCAzMF0pO1xuICB9KTtcblxuICBpdCgndGYuaW1hZycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBjb21wbGV4ID0gdGYuY29tcGxleChbMywgMzBdLCBbNCwgNDBdKTtcbiAgICBjb25zdCBpbWFnID0gdGYuaW1hZyhjb21wbGV4KTtcblxuICAgIGV4cGVjdChpbWFnLmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KGltYWcuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBpbWFnLmRhdGEoKSwgWzQsIDQwXSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBzaGFwZXMgZG9udCBtYXRjaCcsICgpID0+IHtcbiAgICBjb25zdCByZWFsID0gdGYudGVuc29yMWQoWzMsIDMwXSk7XG4gICAgY29uc3QgaW1hZyA9IHRmLnRlbnNvcjFkKFs0LCA0MCwgNTBdKTtcblxuICAgIGNvbnN0IHJlID1cbiAgICAgICAgL3JlYWwgYW5kIGltYWcgc2hhcGVzLCAyIGFuZCAzLCBtdXN0IG1hdGNoIGluIGNhbGwgdG8gdGYuY29tcGxleFxcKFxcKS87XG4gICAgZXhwZWN0KCgpID0+IHRmLmNvbXBsZXgocmVhbCwgaW1hZykpLnRvVGhyb3dFcnJvcihyZSk7XG4gIH0pO1xufSk7XG4iXX0=