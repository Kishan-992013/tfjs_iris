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
import * as tf from './index';
import { ALL_ENVS, describeWithFlags } from './jasmine_util';
import { expectArraysClose, expectArraysEqual } from './test_util';
describeWithFlags('tf.buffer', ALL_ENVS, () => {
    it('float32', async () => {
        const buff = tf.buffer([1, 2, 3], 'float32');
        buff.set(1.3, 0, 0, 0);
        buff.set(2.9, 0, 1, 0);
        expect(buff.get(0, 0, 0)).toBeCloseTo(1.3);
        expect(buff.get(0, 0, 1)).toBeCloseTo(0);
        expect(buff.get(0, 0, 2)).toBeCloseTo(0);
        expect(buff.get(0, 1, 0)).toBeCloseTo(2.9);
        expect(buff.get(0, 1, 1)).toBeCloseTo(0);
        expect(buff.get(0, 1, 2)).toBeCloseTo(0);
        expectArraysClose(await buff.toTensor().data(), [1.3, 0, 0, 2.9, 0, 0]);
        expectArraysClose(buff.values, new Float32Array([1.3, 0, 0, 2.9, 0, 0]));
    });
    it('get() out of range throws', async () => {
        const t = tf.tensor([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
        const buff = await t.buffer();
        expect(buff.get(0, 0, 0)).toBeCloseTo(1);
        expect(buff.get(0, 0, 1)).toBeCloseTo(2);
        expect(() => buff.get(0, 0, 2))
            .toThrowError(/Requested out of range element/);
    });
    it('int32', async () => {
        const buff = tf.buffer([2, 3], 'int32');
        buff.set(1.3, 0, 0);
        buff.set(2.1, 1, 1);
        expect(buff.get(0, 0)).toEqual(1);
        expect(buff.get(0, 1)).toEqual(0);
        expect(buff.get(0, 2)).toEqual(0);
        expect(buff.get(1, 0)).toEqual(0);
        expect(buff.get(1, 1)).toEqual(2);
        expect(buff.get(1, 2)).toEqual(0);
        expectArraysClose(await buff.toTensor().data(), [1, 0, 0, 0, 2, 0]);
        expectArraysClose(buff.values, new Int32Array([1, 0, 0, 0, 2, 0]));
    });
    it('bool', async () => {
        const buff = tf.buffer([4], 'bool');
        buff.set(true, 1);
        buff.set(true, 2);
        expect(buff.get(0)).toBeFalsy();
        expect(buff.get(1)).toBeTruthy();
        expect(buff.get(2)).toBeTruthy();
        expect(buff.get(3)).toBeFalsy();
        expectArraysClose(await buff.toTensor().data(), [0, 1, 1, 0]);
        expectArraysClose(buff.values, new Uint8Array([0, 1, 1, 0]));
    });
    it('string', async () => {
        const buff = tf.buffer([2, 2], 'string');
        buff.set('first', 0, 0);
        buff.set('third', 1, 0);
        expect(buff.get(0, 0)).toEqual('first');
        expect(buff.get(0, 1)).toBeFalsy();
        expect(buff.get(1, 0)).toEqual('third');
        expect(buff.get(1, 1)).toBeFalsy();
        expectArraysEqual(await buff.toTensor().data(), ['first', null, 'third', null]);
    });
    it('throws when passed non-integer shape', () => {
        const msg = 'Tensor must have a shape comprised of positive ' +
            'integers but got shape [2,2.2].';
        expect(() => tf.buffer([2, 2.2])).toThrowError(msg);
    });
    it('throws when passed negative shape', () => {
        const msg = 'Tensor must have a shape comprised of positive ' +
            'integers but got shape [2,-2].';
        expect(() => tf.buffer([2, -2])).toThrowError(msg);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL2J1ZmZlcl90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFakUsaUJBQWlCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDNUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN2QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsaUJBQWlCLENBQUMsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLFlBQVksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3pDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7UUFD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LENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNuQyxpQkFBaUIsQ0FDYixNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQzlDLE1BQU0sR0FBRyxHQUFHLGlEQUFpRDtZQUN6RCxpQ0FBaUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUMzQyxNQUFNLEdBQUcsR0FBRyxpREFBaUQ7WUFDekQsZ0NBQWdDLENBQUM7UUFDckMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtBTExfRU5WUywgZGVzY3JpYmVXaXRoRmxhZ3N9IGZyb20gJy4vamFzbWluZV91dGlsJztcbmltcG9ydCB7ZXhwZWN0QXJyYXlzQ2xvc2UsIGV4cGVjdEFycmF5c0VxdWFsfSBmcm9tICcuL3Rlc3RfdXRpbCc7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCd0Zi5idWZmZXInLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnZmxvYXQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBidWZmID0gdGYuYnVmZmVyKFsxLCAyLCAzXSwgJ2Zsb2F0MzInKTtcbiAgICBidWZmLnNldCgxLjMsIDAsIDAsIDApO1xuICAgIGJ1ZmYuc2V0KDIuOSwgMCwgMSwgMCk7XG4gICAgZXhwZWN0KGJ1ZmYuZ2V0KDAsIDAsIDApKS50b0JlQ2xvc2VUbygxLjMpO1xuICAgIGV4cGVjdChidWZmLmdldCgwLCAwLCAxKSkudG9CZUNsb3NlVG8oMCk7XG4gICAgZXhwZWN0KGJ1ZmYuZ2V0KDAsIDAsIDIpKS50b0JlQ2xvc2VUbygwKTtcbiAgICBleHBlY3QoYnVmZi5nZXQoMCwgMSwgMCkpLnRvQmVDbG9zZVRvKDIuOSk7XG4gICAgZXhwZWN0KGJ1ZmYuZ2V0KDAsIDEsIDEpKS50b0JlQ2xvc2VUbygwKTtcbiAgICBleHBlY3QoYnVmZi5nZXQoMCwgMSwgMikpLnRvQmVDbG9zZVRvKDApO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGJ1ZmYudG9UZW5zb3IoKS5kYXRhKCksIFsxLjMsIDAsIDAsIDIuOSwgMCwgMF0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGJ1ZmYudmFsdWVzLCBuZXcgRmxvYXQzMkFycmF5KFsxLjMsIDAsIDAsIDIuOSwgMCwgMF0pKTtcbiAgfSk7XG5cbiAgaXQoJ2dldCgpIG91dCBvZiByYW5nZSB0aHJvd3MnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdCA9IHRmLnRlbnNvcihbMSwgMiwgMywgNCwgNSwgNiwgNywgOF0sIFsyLCAyLCAyXSk7XG5cbiAgICBjb25zdCBidWZmID0gYXdhaXQgdC5idWZmZXIoKTtcbiAgICBleHBlY3QoYnVmZi5nZXQoMCwgMCwgMCkpLnRvQmVDbG9zZVRvKDEpO1xuICAgIGV4cGVjdChidWZmLmdldCgwLCAwLCAxKSkudG9CZUNsb3NlVG8oMik7XG4gICAgZXhwZWN0KCgpID0+IGJ1ZmYuZ2V0KDAsIDAsIDIpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9SZXF1ZXN0ZWQgb3V0IG9mIHJhbmdlIGVsZW1lbnQvKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGJ1ZmYgPSB0Zi5idWZmZXIoWzIsIDNdLCAnaW50MzInKTtcbiAgICBidWZmLnNldCgxLjMsIDAsIDApO1xuICAgIGJ1ZmYuc2V0KDIuMSwgMSwgMSk7XG4gICAgZXhwZWN0KGJ1ZmYuZ2V0KDAsIDApKS50b0VxdWFsKDEpO1xuICAgIGV4cGVjdChidWZmLmdldCgwLCAxKSkudG9FcXVhbCgwKTtcbiAgICBleHBlY3QoYnVmZi5nZXQoMCwgMikpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0KGJ1ZmYuZ2V0KDEsIDApKS50b0VxdWFsKDApO1xuICAgIGV4cGVjdChidWZmLmdldCgxLCAxKSkudG9FcXVhbCgyKTtcbiAgICBleHBlY3QoYnVmZi5nZXQoMSwgMikpLnRvRXF1YWwoMCk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgYnVmZi50b1RlbnNvcigpLmRhdGEoKSwgWzEsIDAsIDAsIDAsIDIsIDBdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShidWZmLnZhbHVlcywgbmV3IEludDMyQXJyYXkoWzEsIDAsIDAsIDAsIDIsIDBdKSk7XG4gIH0pO1xuXG4gIGl0KCdib29sJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGJ1ZmYgPSB0Zi5idWZmZXIoWzRdLCAnYm9vbCcpO1xuICAgIGJ1ZmYuc2V0KHRydWUsIDEpO1xuICAgIGJ1ZmYuc2V0KHRydWUsIDIpO1xuICAgIGV4cGVjdChidWZmLmdldCgwKSkudG9CZUZhbHN5KCk7XG4gICAgZXhwZWN0KGJ1ZmYuZ2V0KDEpKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KGJ1ZmYuZ2V0KDIpKS50b0JlVHJ1dGh5KCk7XG4gICAgZXhwZWN0KGJ1ZmYuZ2V0KDMpKS50b0JlRmFsc3koKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBidWZmLnRvVGVuc29yKCkuZGF0YSgpLCBbMCwgMSwgMSwgMF0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGJ1ZmYudmFsdWVzLCBuZXcgVWludDhBcnJheShbMCwgMSwgMSwgMF0pKTtcbiAgfSk7XG5cbiAgaXQoJ3N0cmluZycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBidWZmID0gdGYuYnVmZmVyKFsyLCAyXSwgJ3N0cmluZycpO1xuICAgIGJ1ZmYuc2V0KCdmaXJzdCcsIDAsIDApO1xuICAgIGJ1ZmYuc2V0KCd0aGlyZCcsIDEsIDApO1xuICAgIGV4cGVjdChidWZmLmdldCgwLCAwKSkudG9FcXVhbCgnZmlyc3QnKTtcbiAgICBleHBlY3QoYnVmZi5nZXQoMCwgMSkpLnRvQmVGYWxzeSgpO1xuICAgIGV4cGVjdChidWZmLmdldCgxLCAwKSkudG9FcXVhbCgndGhpcmQnKTtcbiAgICBleHBlY3QoYnVmZi5nZXQoMSwgMSkpLnRvQmVGYWxzeSgpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKFxuICAgICAgICBhd2FpdCBidWZmLnRvVGVuc29yKCkuZGF0YSgpLCBbJ2ZpcnN0JywgbnVsbCwgJ3RoaXJkJywgbnVsbF0pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIG5vbi1pbnRlZ2VyIHNoYXBlJywgKCkgPT4ge1xuICAgIGNvbnN0IG1zZyA9ICdUZW5zb3IgbXVzdCBoYXZlIGEgc2hhcGUgY29tcHJpc2VkIG9mIHBvc2l0aXZlICcgK1xuICAgICAgICAnaW50ZWdlcnMgYnV0IGdvdCBzaGFwZSBbMiwyLjJdLic7XG4gICAgZXhwZWN0KCgpID0+IHRmLmJ1ZmZlcihbMiwgMi4yXSkpLnRvVGhyb3dFcnJvcihtc2cpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIHdoZW4gcGFzc2VkIG5lZ2F0aXZlIHNoYXBlJywgKCkgPT4ge1xuICAgIGNvbnN0IG1zZyA9ICdUZW5zb3IgbXVzdCBoYXZlIGEgc2hhcGUgY29tcHJpc2VkIG9mIHBvc2l0aXZlICcgK1xuICAgICAgICAnaW50ZWdlcnMgYnV0IGdvdCBzaGFwZSBbMiwtMl0uJztcbiAgICBleHBlY3QoKCkgPT4gdGYuYnVmZmVyKFsyLCAtMl0pKS50b1Rocm93RXJyb3IobXNnKTtcbiAgfSk7XG59KTtcbiJdfQ==