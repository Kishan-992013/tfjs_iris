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
import { expectValuesInRange } from '../test_util';
const GAMMA_MIN = 0;
const GAMMA_MAX = 40;
describeWithFlags('randomGamma', ALL_ENVS, () => {
    it('should return a random 1D float32 array', async () => {
        const shape = [10];
        // Ensure defaults to float32 w/o type:
        let result = tf.randomGamma(shape, 2, 2);
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
        result = tf.randomGamma(shape, 2, 2, 'float32');
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 1D int32 array', async () => {
        const shape = [10];
        const result = tf.randomGamma(shape, 2, 2, 'int32');
        expect(result.dtype).toBe('int32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 2D float32 array', async () => {
        const shape = [3, 4];
        // Ensure defaults to float32 w/o type:
        let result = tf.randomGamma(shape, 2, 2);
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
        result = tf.randomGamma(shape, 2, 2, 'float32');
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 2D int32 array', async () => {
        const shape = [3, 4];
        const result = tf.randomGamma(shape, 2, 2, 'int32');
        expect(result.dtype).toBe('int32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 3D float32 array', async () => {
        const shape = [3, 4, 5];
        // Ensure defaults to float32 w/o type:
        let result = tf.randomGamma(shape, 2, 2);
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
        result = tf.randomGamma(shape, 2, 2, 'float32');
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 3D int32 array', async () => {
        const shape = [3, 4, 5];
        const result = tf.randomGamma(shape, 2, 2, 'int32');
        expect(result.dtype).toBe('int32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 4D float32 array', async () => {
        const shape = [3, 4, 5, 6];
        // Ensure defaults to float32 w/o type:
        let result = tf.randomGamma(shape, 2, 2);
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
        result = tf.randomGamma(shape, 2, 2, 'float32');
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 4D int32 array', async () => {
        const shape = [3, 4, 5, 6];
        const result = tf.randomGamma(shape, 2, 2, 'int32');
        expect(result.dtype).toBe('int32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 5D float32 array', async () => {
        const shape = [2, 3, 4, 5, 6];
        // Ensure defaults to float32 w/o type:
        let result = tf.randomGamma(shape, 2, 2);
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
        result = tf.randomGamma(shape, 2, 2, 'float32');
        expect(result.dtype).toBe('float32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
    it('should return a random 5D int32 array', async () => {
        const shape = [2, 3, 4, 5, 6];
        const result = tf.randomGamma(shape, 2, 2, 'int32');
        expect(result.dtype).toBe('int32');
        expectValuesInRange(await result.data(), GAMMA_MIN, GAMMA_MAX);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tX2dhbW1hX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9yYW5kb21fZ2FtbWFfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRWpELE1BQU0sU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNwQixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFFckIsaUJBQWlCLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDOUMsRUFBRSxDQUFDLHlDQUF5QyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZELE1BQU0sS0FBSyxHQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFN0IsdUNBQXVDO1FBQ3ZDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxtQkFBbUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFL0QsTUFBTSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsbUJBQW1CLENBQUMsTUFB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QUFDO1FBQ2hELE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JDLG1CQUFtQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNqRSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyRCxNQUFNLEtBQUssR0FBNkMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEUsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQyxtQkFBbUIsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDakUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0ICogYXMgdGYgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4uL2phc21pbmVfdXRpbCc7XG5pbXBvcnQge2V4cGVjdFZhbHVlc0luUmFuZ2V9IGZyb20gJy4uL3Rlc3RfdXRpbCc7XG5cbmNvbnN0IEdBTU1BX01JTiA9IDA7XG5jb25zdCBHQU1NQV9NQVggPSA0MDtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ3JhbmRvbUdhbW1hJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSByYW5kb20gMUQgZmxvYXQzMiBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzaGFwZTogW251bWJlcl0gPSBbMTBdO1xuXG4gICAgLy8gRW5zdXJlIGRlZmF1bHRzIHRvIGZsb2F0MzIgdy9vIHR5cGU6XG4gICAgbGV0IHJlc3VsdCA9IHRmLnJhbmRvbUdhbW1hKHNoYXBlLCAyLCAyKTtcbiAgICBleHBlY3QocmVzdWx0LmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0VmFsdWVzSW5SYW5nZShhd2FpdCByZXN1bHQuZGF0YSgpLCBHQU1NQV9NSU4sIEdBTU1BX01BWCk7XG5cbiAgICByZXN1bHQgPSB0Zi5yYW5kb21HYW1tYShzaGFwZSwgMiwgMiwgJ2Zsb2F0MzInKTtcbiAgICBleHBlY3QocmVzdWx0LmR0eXBlKS50b0JlKCdmbG9hdDMyJyk7XG4gICAgZXhwZWN0VmFsdWVzSW5SYW5nZShhd2FpdCByZXN1bHQuZGF0YSgpLCBHQU1NQV9NSU4sIEdBTU1BX01BWCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgcmFuZG9tIDFEIGludDMyIGFycmF5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHNoYXBlOiBbbnVtYmVyXSA9IFsxMF07XG4gICAgY29uc3QgcmVzdWx0ID0gdGYucmFuZG9tR2FtbWEoc2hhcGUsIDIsIDIsICdpbnQzMicpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0VmFsdWVzSW5SYW5nZShhd2FpdCByZXN1bHQuZGF0YSgpLCBHQU1NQV9NSU4sIEdBTU1BX01BWCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgcmFuZG9tIDJEIGZsb2F0MzIgYXJyYXknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgc2hhcGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMywgNF07XG5cbiAgICAvLyBFbnN1cmUgZGVmYXVsdHMgdG8gZmxvYXQzMiB3L28gdHlwZTpcbiAgICBsZXQgcmVzdWx0ID0gdGYucmFuZG9tR2FtbWEoc2hhcGUsIDIsIDIpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RWYWx1ZXNJblJhbmdlKGF3YWl0IHJlc3VsdC5kYXRhKCksIEdBTU1BX01JTiwgR0FNTUFfTUFYKTtcblxuICAgIHJlc3VsdCA9IHRmLnJhbmRvbUdhbW1hKHNoYXBlLCAyLCAyLCAnZmxvYXQzMicpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RWYWx1ZXNJblJhbmdlKGF3YWl0IHJlc3VsdC5kYXRhKCksIEdBTU1BX01JTiwgR0FNTUFfTUFYKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSByYW5kb20gMkQgaW50MzIgYXJyYXknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgc2hhcGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMywgNF07XG4gICAgY29uc3QgcmVzdWx0ID0gdGYucmFuZG9tR2FtbWEoc2hhcGUsIDIsIDIsICdpbnQzMicpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0VmFsdWVzSW5SYW5nZShhd2FpdCByZXN1bHQuZGF0YSgpLCBHQU1NQV9NSU4sIEdBTU1BX01BWCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgcmFuZG9tIDNEIGZsb2F0MzIgYXJyYXknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgc2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFszLCA0LCA1XTtcblxuICAgIC8vIEVuc3VyZSBkZWZhdWx0cyB0byBmbG9hdDMyIHcvbyB0eXBlOlxuICAgIGxldCByZXN1bHQgPSB0Zi5yYW5kb21HYW1tYShzaGFwZSwgMiwgMik7XG4gICAgZXhwZWN0KHJlc3VsdC5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdFZhbHVlc0luUmFuZ2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgR0FNTUFfTUlOLCBHQU1NQV9NQVgpO1xuXG4gICAgcmVzdWx0ID0gdGYucmFuZG9tR2FtbWEoc2hhcGUsIDIsIDIsICdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdFZhbHVlc0luUmFuZ2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgR0FNTUFfTUlOLCBHQU1NQV9NQVgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHJhbmRvbSAzRCBpbnQzMiBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWzMsIDQsIDVdO1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLnJhbmRvbUdhbW1hKHNoYXBlLCAyLCAyLCAnaW50MzInKTtcbiAgICBleHBlY3QocmVzdWx0LmR0eXBlKS50b0JlKCdpbnQzMicpO1xuICAgIGV4cGVjdFZhbHVlc0luUmFuZ2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgR0FNTUFfTUlOLCBHQU1NQV9NQVgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHJhbmRvbSA0RCBmbG9hdDMyIGFycmF5JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSA9IFszLCA0LCA1LCA2XTtcblxuICAgIC8vIEVuc3VyZSBkZWZhdWx0cyB0byBmbG9hdDMyIHcvbyB0eXBlOlxuICAgIGxldCByZXN1bHQgPSB0Zi5yYW5kb21HYW1tYShzaGFwZSwgMiwgMik7XG4gICAgZXhwZWN0KHJlc3VsdC5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdFZhbHVlc0luUmFuZ2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgR0FNTUFfTUlOLCBHQU1NQV9NQVgpO1xuXG4gICAgcmVzdWx0ID0gdGYucmFuZG9tR2FtbWEoc2hhcGUsIDIsIDIsICdmbG9hdDMyJyk7XG4gICAgZXhwZWN0KHJlc3VsdC5kdHlwZSkudG9CZSgnZmxvYXQzMicpO1xuICAgIGV4cGVjdFZhbHVlc0luUmFuZ2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgR0FNTUFfTUlOLCBHQU1NQV9NQVgpO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHJldHVybiBhIHJhbmRvbSA0RCBpbnQzMiBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBzaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMywgNCwgNSwgNl07XG4gICAgY29uc3QgcmVzdWx0ID0gdGYucmFuZG9tR2FtbWEoc2hhcGUsIDIsIDIsICdpbnQzMicpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0VmFsdWVzSW5SYW5nZShhd2FpdCByZXN1bHQuZGF0YSgpLCBHQU1NQV9NSU4sIEdBTU1BX01BWCk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGEgcmFuZG9tIDVEIGZsb2F0MzIgYXJyYXknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgc2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMywgNCwgNSwgNl07XG5cbiAgICAvLyBFbnN1cmUgZGVmYXVsdHMgdG8gZmxvYXQzMiB3L28gdHlwZTpcbiAgICBsZXQgcmVzdWx0ID0gdGYucmFuZG9tR2FtbWEoc2hhcGUsIDIsIDIpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RWYWx1ZXNJblJhbmdlKGF3YWl0IHJlc3VsdC5kYXRhKCksIEdBTU1BX01JTiwgR0FNTUFfTUFYKTtcblxuICAgIHJlc3VsdCA9IHRmLnJhbmRvbUdhbW1hKHNoYXBlLCAyLCAyLCAnZmxvYXQzMicpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RWYWx1ZXNJblJhbmdlKGF3YWl0IHJlc3VsdC5kYXRhKCksIEdBTU1BX01JTiwgR0FNTUFfTUFYKTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYSByYW5kb20gNUQgaW50MzIgYXJyYXknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgc2hhcGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0gPSBbMiwgMywgNCwgNSwgNl07XG4gICAgY29uc3QgcmVzdWx0ID0gdGYucmFuZG9tR2FtbWEoc2hhcGUsIDIsIDIsICdpbnQzMicpO1xuICAgIGV4cGVjdChyZXN1bHQuZHR5cGUpLnRvQmUoJ2ludDMyJyk7XG4gICAgZXhwZWN0VmFsdWVzSW5SYW5nZShhd2FpdCByZXN1bHQuZGF0YSgpLCBHQU1NQV9NSU4sIEdBTU1BX01BWCk7XG4gIH0pO1xufSk7XG4iXX0=