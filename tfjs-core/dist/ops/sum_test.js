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
import { expectArraysClose, expectArraysEqual } from '../test_util';
describeWithFlags('sum', ALL_ENVS, () => {
    it('basic', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const result = tf.sum(a);
        expectArraysClose(await result.data(), 7);
    });
    it('propagates NaNs', async () => {
        const a = tf.tensor2d([1, 2, 3, NaN, 0, 1], [3, 2]);
        expectArraysEqual(await tf.sum(a).data(), NaN);
    });
    it('sum over dtype int32', async () => {
        const a = tf.tensor1d([1, 5, 7, 3], 'int32');
        const sum = tf.sum(a);
        expectArraysEqual(await sum.data(), 16);
    });
    it('sum over dtype bool', async () => {
        const a = tf.tensor1d([true, false, false, true, true], 'bool');
        const sum = tf.sum(a);
        expectArraysEqual(await sum.data(), 3);
    });
    it('sums all values in 2D array with keep dim', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const res = tf.sum(a, null, true /* keepDims */);
        expect(res.shape).toEqual([1, 1]);
        expectArraysClose(await res.data(), [7]);
    });
    it('sums across axis=0 in 2D array', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const res = tf.sum(a, [0]);
        expect(res.shape).toEqual([2]);
        expectArraysClose(await res.data(), [4, 3]);
    });
    it('sums across axis=0 in 2D array, keepDims', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const res = tf.sum(a, [0], true /* keepDims */);
        expect(res.shape).toEqual([1, 2]);
        expectArraysClose(await res.data(), [4, 3]);
    });
    it('sums across axis=1 in 2D array', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const res = tf.sum(a, [1]);
        expect(res.shape).toEqual([3]);
        expectArraysClose(await res.data(), [3, 3, 1]);
    });
    it('2D, axis=1 provided as number', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [2, 3]);
        const res = tf.sum(a, 1);
        expect(res.shape).toEqual([2]);
        expectArraysClose(await res.data(), [6, 1]);
    });
    it('2D, axis = -1 provided as number', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [2, 3]);
        const res = tf.sum(a, -1);
        expect(res.shape).toEqual([2]);
        expectArraysClose(await res.data(), [6, 1]);
    });
    it('sums across axis=0,1 in 2D array', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const res = tf.sum(a, [0, 1]);
        expect(res.shape).toEqual([]);
        expectArraysClose(await res.data(), [7]);
    });
    it('2D, axis=[-1,-2] in 2D array', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const res = tf.sum(a, [-1, -2]);
        expect(res.shape).toEqual([]);
        expectArraysClose(await res.data(), [7]);
    });
    it('4D, axis=[2, 2, 1], need permutation.', async () => {
        const a = tf.tensor4d([1, 2, 3, 4], [1, 2, 2, 1]);
        const res = tf.sum(a, 0);
        expect(res.shape).toEqual([2, 2, 1]);
        expectArraysClose(await res.data(), [1, 2, 3, 4]);
    });
    it('gradients: sum(2d)', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const dy = tf.scalar(10);
        const gradients = tf.grad(a => a.sum())(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [10, 10, 10, 10, 10, 10]);
    });
    it('gradient with clones', async () => {
        const a = tf.tensor2d([1, 2, 3, 0, 0, 1], [3, 2]);
        const dy = tf.scalar(10);
        const gradients = tf.grad(a => a.clone().sum().clone())(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [10, 10, 10, 10, 10, 10]);
    });
    it('gradients: sum(2d, axis=0)', async () => {
        const a = tf.tensor2d([[1, 2], [3, 0], [0, 1]], [3, 2]);
        const dy = tf.tensor1d([10, 20]);
        const axis = 0;
        const gradients = tf.grad(a => a.sum(axis))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [10, 20, 10, 20, 10, 20]);
    });
    it('gradients: sum(2d, axis=1)', async () => {
        const a = tf.tensor2d([[1, 2], [3, 0], [0, 1]], [3, 2]);
        const dy = tf.tensor1d([10, 20, 30]);
        const axis = 1;
        const gradients = tf.grad(a => a.sum(axis))(a, dy);
        expect(gradients.shape).toEqual(a.shape);
        expect(gradients.dtype).toEqual('float32');
        expectArraysClose(await gradients.data(), [10, 10, 20, 20, 30, 30]);
    });
    it('throws when passed a non-tensor', () => {
        expect(() => tf.sum({}))
            .toThrowError(/Argument 'x' passed to 'sum' must be a Tensor/);
    });
    it('accepts a tensor-like object', async () => {
        const result = tf.sum([[1, 2], [3, 0], [0, 1]]);
        expectArraysClose(await result.data(), 7);
    });
    it('throws error for string tensor', () => {
        expect(() => tf.sum(['a']))
            .toThrowError(/Argument 'x' passed to 'sum' must be numeric tensor/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9zdW1fdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFFSCxPQUFPLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQixPQUFPLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRWxFLGlCQUFpQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDckIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLGlCQUFpQixDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM3QyxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ25DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDaEUsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN6RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFakQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDOUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxD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Q0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5QixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDckQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV6QixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpCLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNDLGlCQUFpQixDQUFDLE1BQU0sU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRS9ELE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxpQkFBaUIsQ0FBQyxNQUFNLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMxQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxF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QUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCAqIGFzIHRmIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCB7QUxMX0VOVlMsIGRlc2NyaWJlV2l0aEZsYWdzfSBmcm9tICcuLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZSwgZXhwZWN0QXJyYXlzRXF1YWx9IGZyb20gJy4uL3Rlc3RfdXRpbCc7XG5cbmRlc2NyaWJlV2l0aEZsYWdzKCdzdW0nLCBBTExfRU5WUywgKCkgPT4ge1xuICBpdCgnYmFzaWMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCAwLCAwLCAxXSwgWzMsIDJdKTtcbiAgICBjb25zdCByZXN1bHQgPSB0Zi5zdW0oYSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzdWx0LmRhdGEoKSwgNyk7XG4gIH0pO1xuXG4gIGl0KCdwcm9wYWdhdGVzIE5hTnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCBOYU4sIDAsIDFdLCBbMywgMl0pO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHRmLnN1bShhKS5kYXRhKCksIE5hTik7XG4gIH0pO1xuXG4gIGl0KCdzdW0gb3ZlciBkdHlwZSBpbnQzMicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoWzEsIDUsIDcsIDNdLCAnaW50MzInKTtcbiAgICBjb25zdCBzdW0gPSB0Zi5zdW0oYSk7XG4gICAgZXhwZWN0QXJyYXlzRXF1YWwoYXdhaXQgc3VtLmRhdGEoKSwgMTYpO1xuICB9KTtcblxuICBpdCgnc3VtIG92ZXIgZHR5cGUgYm9vbCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMWQoW3RydWUsIGZhbHNlLCBmYWxzZSwgdHJ1ZSwgdHJ1ZV0sICdib29sJyk7XG4gICAgY29uc3Qgc3VtID0gdGYuc3VtKGEpO1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKGF3YWl0IHN1bS5kYXRhKCksIDMpO1xuICB9KTtcblxuICBpdCgnc3VtcyBhbGwgdmFsdWVzIGluIDJEIGFycmF5IHdpdGgga2VlcCBkaW0nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCAwLCAwLCAxXSwgWzMsIDJdKTtcbiAgICBjb25zdCByZXMgPSB0Zi5zdW0oYSwgbnVsbCwgdHJ1ZSAvKiBrZWVwRGltcyAqLyk7XG5cbiAgICBleHBlY3QocmVzLnNoYXBlKS50b0VxdWFsKFsxLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzddKTtcbiAgfSk7XG5cbiAgaXQoJ3N1bXMgYWNyb3NzIGF4aXM9MCBpbiAyRCBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDAsIDAsIDFdLCBbMywgMl0pO1xuICAgIGNvbnN0IHJlcyA9IHRmLnN1bShhLCBbMF0pO1xuXG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFs0LCAzXSk7XG4gIH0pO1xuXG4gIGl0KCdzdW1zIGFjcm9zcyBheGlzPTAgaW4gMkQgYXJyYXksIGtlZXBEaW1zJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGEgPSB0Zi50ZW5zb3IyZChbMSwgMiwgMywgMCwgMCwgMV0sIFszLCAyXSk7XG4gICAgY29uc3QgcmVzID0gdGYuc3VtKGEsIFswXSwgdHJ1ZSAvKiBrZWVwRGltcyAqLyk7XG5cbiAgICBleHBlY3QocmVzLnNoYXBlKS50b0VxdWFsKFsxLCAyXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzQsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ3N1bXMgYWNyb3NzIGF4aXM9MSBpbiAyRCBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDAsIDAsIDFdLCBbMywgMl0pO1xuICAgIGNvbnN0IHJlcyA9IHRmLnN1bShhLCBbMV0pO1xuXG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbM10pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFszLCAzLCAxXSk7XG4gIH0pO1xuXG4gIGl0KCcyRCwgYXhpcz0xIHByb3ZpZGVkIGFzIG51bWJlcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDAsIDAsIDFdLCBbMiwgM10pO1xuICAgIGNvbnN0IHJlcyA9IHRmLnN1bShhLCAxKTtcblxuICAgIGV4cGVjdChyZXMuc2hhcGUpLnRvRXF1YWwoWzJdKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCByZXMuZGF0YSgpLCBbNiwgMV0pO1xuICB9KTtcblxuICBpdCgnMkQsIGF4aXMgPSAtMSBwcm92aWRlZCBhcyBudW1iZXInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCAwLCAwLCAxXSwgWzIsIDNdKTtcbiAgICBjb25zdCByZXMgPSB0Zi5zdW0oYSwgLTEpO1xuXG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbMl0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlcy5kYXRhKCksIFs2LCAxXSk7XG4gIH0pO1xuXG4gIGl0KCdzdW1zIGFjcm9zcyBheGlzPTAsMSBpbiAyRCBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDAsIDAsIDFdLCBbMywgMl0pO1xuICAgIGNvbnN0IHJlcyA9IHRmLnN1bShhLCBbMCwgMV0pO1xuXG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzddKTtcbiAgfSk7XG5cbiAgaXQoJzJELCBheGlzPVstMSwtMl0gaW4gMkQgYXJyYXknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCAwLCAwLCAxXSwgWzMsIDJdKTtcbiAgICBjb25zdCByZXMgPSB0Zi5zdW0oYSwgWy0xLCAtMl0pO1xuXG4gICAgZXhwZWN0KHJlcy5zaGFwZSkudG9FcXVhbChbXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzddKTtcbiAgfSk7XG5cbiAgaXQoJzRELCBheGlzPVsyLCAyLCAxXSwgbmVlZCBwZXJtdXRhdGlvbi4nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjRkKFsxLCAyLCAzLCA0XSwgWzEsIDIsIDIsIDFdKTtcbiAgICBjb25zdCByZXMgPSB0Zi5zdW0oYSwgMCk7XG5cbiAgICBleHBlY3QocmVzLnNoYXBlKS50b0VxdWFsKFsyLCAyLCAxXSk7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UoYXdhaXQgcmVzLmRhdGEoKSwgWzEsIDIsIDMsIDRdKTtcbiAgfSk7XG5cbiAgaXQoJ2dyYWRpZW50czogc3VtKDJkKScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoWzEsIDIsIDMsIDAsIDAsIDFdLCBbMywgMl0pO1xuICAgIGNvbnN0IGR5ID0gdGYuc2NhbGFyKDEwKTtcblxuICAgIGNvbnN0IGdyYWRpZW50cyA9IHRmLmdyYWQoYSA9PiBhLnN1bSgpKShhLCBkeSk7XG5cbiAgICBleHBlY3QoZ3JhZGllbnRzLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChncmFkaWVudHMuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBncmFkaWVudHMuZGF0YSgpLCBbMTAsIDEwLCAxMCwgMTAsIDEwLCAxMF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnQgd2l0aCBjbG9uZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFsxLCAyLCAzLCAwLCAwLCAxXSwgWzMsIDJdKTtcbiAgICBjb25zdCBkeSA9IHRmLnNjYWxhcigxMCk7XG5cbiAgICBjb25zdCBncmFkaWVudHMgPSB0Zi5ncmFkKGEgPT4gYS5jbG9uZSgpLnN1bSgpLmNsb25lKCkpKGEsIGR5KTtcblxuICAgIGV4cGVjdChncmFkaWVudHMuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGdyYWRpZW50cy5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGdyYWRpZW50cy5kYXRhKCksIFsxMCwgMTAsIDEwLCAxMCwgMTAsIDEwXSk7XG4gIH0pO1xuXG4gIGl0KCdncmFkaWVudHM6IHN1bSgyZCwgYXhpcz0wKScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBhID0gdGYudGVuc29yMmQoW1sxLCAyXSwgWzMsIDBdLCBbMCwgMV1dLCBbMywgMl0pO1xuICAgIGNvbnN0IGR5ID0gdGYudGVuc29yMWQoWzEwLCAyMF0pO1xuICAgIGNvbnN0IGF4aXMgPSAwO1xuXG4gICAgY29uc3QgZ3JhZGllbnRzID0gdGYuZ3JhZChhID0+IGEuc3VtKGF4aXMpKShhLCBkeSk7XG5cbiAgICBleHBlY3QoZ3JhZGllbnRzLnNoYXBlKS50b0VxdWFsKGEuc2hhcGUpO1xuICAgIGV4cGVjdChncmFkaWVudHMuZHR5cGUpLnRvRXF1YWwoJ2Zsb2F0MzInKTtcbiAgICBleHBlY3RBcnJheXNDbG9zZShhd2FpdCBncmFkaWVudHMuZGF0YSgpLCBbMTAsIDIwLCAxMCwgMjAsIDEwLCAyMF0pO1xuICB9KTtcblxuICBpdCgnZ3JhZGllbnRzOiBzdW0oMmQsIGF4aXM9MSknLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgYSA9IHRmLnRlbnNvcjJkKFtbMSwgMl0sIFszLCAwXSwgWzAsIDFdXSwgWzMsIDJdKTtcbiAgICBjb25zdCBkeSA9IHRmLnRlbnNvcjFkKFsxMCwgMjAsIDMwXSk7XG4gICAgY29uc3QgYXhpcyA9IDE7XG5cbiAgICBjb25zdCBncmFkaWVudHMgPSB0Zi5ncmFkKGEgPT4gYS5zdW0oYXhpcykpKGEsIGR5KTtcblxuICAgIGV4cGVjdChncmFkaWVudHMuc2hhcGUpLnRvRXF1YWwoYS5zaGFwZSk7XG4gICAgZXhwZWN0KGdyYWRpZW50cy5kdHlwZSkudG9FcXVhbCgnZmxvYXQzMicpO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IGdyYWRpZW50cy5kYXRhKCksIFsxMCwgMTAsIDIwLCAyMCwgMzAsIDMwXSk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgd2hlbiBwYXNzZWQgYSBub24tdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5zdW0oe30gYXMgdGYuVGVuc29yKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcigvQXJndW1lbnQgJ3gnIHBhc3NlZCB0byAnc3VtJyBtdXN0IGJlIGEgVGVuc29yLyk7XG4gIH0pO1xuXG4gIGl0KCdhY2NlcHRzIGEgdGVuc29yLWxpa2Ugb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRmLnN1bShbWzEsIDJdLCBbMywgMF0sIFswLCAxXV0pO1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKGF3YWl0IHJlc3VsdC5kYXRhKCksIDcpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGVycm9yIGZvciBzdHJpbmcgdGVuc29yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB0Zi5zdW0oWydhJ10pKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9Bcmd1bWVudCAneCcgcGFzc2VkIHRvICdzdW0nIG11c3QgYmUgbnVtZXJpYyB0ZW5zb3IvKTtcbiAgfSk7XG59KTtcbiJdfQ==