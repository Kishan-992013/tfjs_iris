/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import { ALL_ENVS, describeWithFlags } from './jasmine_util';
import { expectArraysClose, expectArraysEqual } from './test_util';
describeWithFlags('expectArraysEqual', ALL_ENVS, () => {
    it('same arrays', () => {
        expectArraysEqual([1, 2, 3], [1, 2, 3]);
    });
    it('throws on different arrays', () => {
        expect(() => expectArraysEqual([1, 2, 3], [3, 2, 1]))
            .toThrowError(/Arrays differ/);
    });
    it('same nested arrays', () => {
        expectArraysEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]]);
    });
    it('throws on different nested arrays', () => {
        expect(() => expectArraysEqual([[1, 2], [3, 4]], [[1, 2], [4, 3]]))
            .toThrowError(/Arrays differ/);
    });
    it('throws on different nested shapes', () => {
        expect(() => expectArraysEqual([[1, 2], [3, 4]], [1, 2, 3, 4]))
            .toThrowError(/Arrays have different shapes. Actual: \[2,2\]. Expected: \[4\]/);
    });
    it('float32 with regular array', () => {
        expectArraysEqual(new Float32Array([1, 2, 3]), [1, 2, 3]);
    });
    it('throws on different values of float32 with regular array', () => {
        expect(() => expectArraysEqual(new Float32Array([1, 2, 3]), [1, 2, 4]))
            .toThrowError(/Arrays differ/);
    });
    it('int32 with regular array', () => {
        expectArraysEqual(new Int32Array([1, 2, 3]), [1, 2, 3]);
    });
    it('throws on different values of int32 with regular array', () => {
        expect(() => expectArraysEqual(new Int32Array([1, 2, 3]), [1, 2, 4]))
            .toThrowError(/Arrays differ/);
    });
    it('throws on float32 with int32', () => {
        expect(() => expectArraysEqual(new Float32Array([1, 2, 3]), new Int32Array([1, 2, 3])))
            .toThrowError(/Arrays are of different type/);
    });
    it('throws on int32 with uint8', () => {
        expect(() => expectArraysEqual(new Int32Array([1, 2, 3]), new Uint8Array([1, 2, 3])))
            .toThrowError(/Arrays are of different type/);
    });
});
describeWithFlags('expectArraysClose', ALL_ENVS, () => {
    it('same arrays', () => {
        expectArraysClose([1, 2, 3], [1, 2, 3]);
    });
    it('throws on different arrays', () => {
        expect(() => expectArraysClose([1, 2, 3], [3, 2, 1]))
            .toThrowError(/Arrays differ/);
    });
    it('same nested arrays', () => {
        expectArraysClose([[1, 2], [3, 4]], [[1, 2], [3, 4]]);
    });
    it('throws on different nested arrays', () => {
        expect(() => expectArraysClose([[1, 2], [3, 4]], [[1, 2], [4, 3]]))
            .toThrowError(/Arrays differ/);
    });
    it('throws on different nested shapes', () => {
        expect(() => expectArraysClose([[1, 2], [3, 4]], [1, 2, 3, 4]))
            .toThrowError(/Arrays have different shapes. Actual: \[2,2\]. Expected: \[4\]/);
    });
    it('float32 with regular array', () => {
        expectArraysClose(new Float32Array([1, 2, 3]), [1, 2, 3]);
    });
    it('throws on different values of float32 with regular array', () => {
        expect(() => expectArraysClose(new Float32Array([1, 2, 3]), [1, 2, 4]))
            .toThrowError(/Arrays differ/);
    });
    it('int32 with regular array', () => {
        expectArraysClose(new Int32Array([1, 2, 3]), [1, 2, 3]);
    });
    it('throws on different values of int32 with regular array', () => {
        expect(() => expectArraysClose(new Int32Array([1, 2, 3]), [1, 2, 4]))
            .toThrowError(/Arrays differ/);
    });
    it('throws on float32 with int32', () => {
        expect(() => expectArraysClose(new Float32Array([1, 2, 3]), new Int32Array([1, 2, 3])))
            .toThrowError(/Arrays are of different type/);
    });
    it('throws on int32 with uint8', () => {
        expect(() => expectArraysClose(new Int32Array([1, 2, 3]), new Uint8Array([1, 2, 3])))
            .toThrowError(/Arrays are of different type/);
    });
    it('similar arrays with good epsilon', () => {
        const epsilon = 0.1;
        expectArraysClose(new Float32Array([1, 2, 3.08]), [1, 2, 3], epsilon);
    });
    it('similar arrays with bad epsilon', () => {
        const epsilon = 0.01;
        expect(() => expectArraysClose(new Float32Array([1, 2, 3.08]), [1, 2, 3], epsilon))
            .toThrowError(/Arrays differ/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF91dGlsX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL3Rlc3RfdXRpbF90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFakUsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNwRCxFQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUNyQixpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEQsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUM1QixpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUQsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUMzQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxRCxZQUFZLENBQ1QsZ0VBQWdFLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsaUJBQWlCLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1FBQ2xFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsRSxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLGlCQUFpQixDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtRQUNoRSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtRQUN0QyxNQUFNLENBQ0YsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQ25CLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0QsWUFBWSxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLE1BQU0sQ0FDRixHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FDbkIsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6RCxZQUFZLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUNwRCxFQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUNyQixpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEQsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUM1QixpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUQsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUMzQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxRCxZQUFZLENBQ1QsZ0VBQWdFLENBQUMsQ0FBQztJQUM1RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsaUJBQWlCLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1FBQ2xFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsRSxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLGlCQUFpQixDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtRQUNoRSxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEUsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtRQUN0QyxNQUFNLENBQ0YsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQ25CLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDM0QsWUFBWSxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLE1BQU0sQ0FDRixHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FDbkIsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6RCxZQUFZLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLGlCQUFpQixDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN4RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUU7UUFDekMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE1BQU0sQ0FDRixHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FDbkIsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ3ZELFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuXG5pbXBvcnQge0FMTF9FTlZTLCBkZXNjcmliZVdpdGhGbGFnc30gZnJvbSAnLi9qYXNtaW5lX3V0aWwnO1xuaW1wb3J0IHtleHBlY3RBcnJheXNDbG9zZSwgZXhwZWN0QXJyYXlzRXF1YWx9IGZyb20gJy4vdGVzdF91dGlsJztcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2V4cGVjdEFycmF5c0VxdWFsJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ3NhbWUgYXJyYXlzJywgKCkgPT4ge1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKFsxLCAyLCAzXSwgWzEsIDIsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBvbiBkaWZmZXJlbnQgYXJyYXlzJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBleHBlY3RBcnJheXNFcXVhbChbMSwgMiwgM10sIFszLCAyLCAxXSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FycmF5cyBkaWZmZXIvKTtcbiAgfSk7XG5cbiAgaXQoJ3NhbWUgbmVzdGVkIGFycmF5cycsICgpID0+IHtcbiAgICBleHBlY3RBcnJheXNFcXVhbChbWzEsIDJdLCBbMywgNF1dLCBbWzEsIDJdLCBbMywgNF1dKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBvbiBkaWZmZXJlbnQgbmVzdGVkIGFycmF5cycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gZXhwZWN0QXJyYXlzRXF1YWwoW1sxLCAyXSwgWzMsIDRdXSwgW1sxLCAyXSwgWzQsIDNdXSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FycmF5cyBkaWZmZXIvKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBvbiBkaWZmZXJlbnQgbmVzdGVkIHNoYXBlcycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gZXhwZWN0QXJyYXlzRXF1YWwoW1sxLCAyXSwgWzMsIDRdXSwgWzEsIDIsIDMsIDRdKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgIC9BcnJheXMgaGF2ZSBkaWZmZXJlbnQgc2hhcGVzLiBBY3R1YWw6IFxcWzIsMlxcXS4gRXhwZWN0ZWQ6IFxcWzRcXF0vKTtcbiAgfSk7XG5cbiAgaXQoJ2Zsb2F0MzIgd2l0aCByZWd1bGFyIGFycmF5JywgKCkgPT4ge1xuICAgIGV4cGVjdEFycmF5c0VxdWFsKG5ldyBGbG9hdDMyQXJyYXkoWzEsIDIsIDNdKSwgWzEsIDIsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBvbiBkaWZmZXJlbnQgdmFsdWVzIG9mIGZsb2F0MzIgd2l0aCByZWd1bGFyIGFycmF5JywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBleHBlY3RBcnJheXNFcXVhbChuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzXSksIFsxLCAyLCA0XSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FycmF5cyBkaWZmZXIvKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIHdpdGggcmVndWxhciBhcnJheScsICgpID0+IHtcbiAgICBleHBlY3RBcnJheXNFcXVhbChuZXcgSW50MzJBcnJheShbMSwgMiwgM10pLCBbMSwgMiwgM10pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIG9uIGRpZmZlcmVudCB2YWx1ZXMgb2YgaW50MzIgd2l0aCByZWd1bGFyIGFycmF5JywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBleHBlY3RBcnJheXNFcXVhbChuZXcgSW50MzJBcnJheShbMSwgMiwgM10pLCBbMSwgMiwgNF0pKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9BcnJheXMgZGlmZmVyLyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgb24gZmxvYXQzMiB3aXRoIGludDMyJywgKCkgPT4ge1xuICAgIGV4cGVjdChcbiAgICAgICAgKCkgPT4gZXhwZWN0QXJyYXlzRXF1YWwoXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzXSksIG5ldyBJbnQzMkFycmF5KFsxLCAyLCAzXSkpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9BcnJheXMgYXJlIG9mIGRpZmZlcmVudCB0eXBlLyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgb24gaW50MzIgd2l0aCB1aW50OCcsICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICAgICgpID0+IGV4cGVjdEFycmF5c0VxdWFsKFxuICAgICAgICAgICAgbmV3IEludDMyQXJyYXkoWzEsIDIsIDNdKSwgbmV3IFVpbnQ4QXJyYXkoWzEsIDIsIDNdKSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FycmF5cyBhcmUgb2YgZGlmZmVyZW50IHR5cGUvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmVXaXRoRmxhZ3MoJ2V4cGVjdEFycmF5c0Nsb3NlJywgQUxMX0VOVlMsICgpID0+IHtcbiAgaXQoJ3NhbWUgYXJyYXlzJywgKCkgPT4ge1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKFsxLCAyLCAzXSwgWzEsIDIsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBvbiBkaWZmZXJlbnQgYXJyYXlzJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBleHBlY3RBcnJheXNDbG9zZShbMSwgMiwgM10sIFszLCAyLCAxXSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FycmF5cyBkaWZmZXIvKTtcbiAgfSk7XG5cbiAgaXQoJ3NhbWUgbmVzdGVkIGFycmF5cycsICgpID0+IHtcbiAgICBleHBlY3RBcnJheXNDbG9zZShbWzEsIDJdLCBbMywgNF1dLCBbWzEsIDJdLCBbMywgNF1dKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBvbiBkaWZmZXJlbnQgbmVzdGVkIGFycmF5cycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gZXhwZWN0QXJyYXlzQ2xvc2UoW1sxLCAyXSwgWzMsIDRdXSwgW1sxLCAyXSwgWzQsIDNdXSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FycmF5cyBkaWZmZXIvKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBvbiBkaWZmZXJlbnQgbmVzdGVkIHNoYXBlcycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gZXhwZWN0QXJyYXlzQ2xvc2UoW1sxLCAyXSwgWzMsIDRdXSwgWzEsIDIsIDMsIDRdKSlcbiAgICAgICAgLnRvVGhyb3dFcnJvcihcbiAgICAgICAgICAgIC9BcnJheXMgaGF2ZSBkaWZmZXJlbnQgc2hhcGVzLiBBY3R1YWw6IFxcWzIsMlxcXS4gRXhwZWN0ZWQ6IFxcWzRcXF0vKTtcbiAgfSk7XG5cbiAgaXQoJ2Zsb2F0MzIgd2l0aCByZWd1bGFyIGFycmF5JywgKCkgPT4ge1xuICAgIGV4cGVjdEFycmF5c0Nsb3NlKG5ldyBGbG9hdDMyQXJyYXkoWzEsIDIsIDNdKSwgWzEsIDIsIDNdKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBvbiBkaWZmZXJlbnQgdmFsdWVzIG9mIGZsb2F0MzIgd2l0aCByZWd1bGFyIGFycmF5JywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBleHBlY3RBcnJheXNDbG9zZShuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzXSksIFsxLCAyLCA0XSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FycmF5cyBkaWZmZXIvKTtcbiAgfSk7XG5cbiAgaXQoJ2ludDMyIHdpdGggcmVndWxhciBhcnJheScsICgpID0+IHtcbiAgICBleHBlY3RBcnJheXNDbG9zZShuZXcgSW50MzJBcnJheShbMSwgMiwgM10pLCBbMSwgMiwgM10pO1xuICB9KTtcblxuICBpdCgndGhyb3dzIG9uIGRpZmZlcmVudCB2YWx1ZXMgb2YgaW50MzIgd2l0aCByZWd1bGFyIGFycmF5JywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBleHBlY3RBcnJheXNDbG9zZShuZXcgSW50MzJBcnJheShbMSwgMiwgM10pLCBbMSwgMiwgNF0pKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9BcnJheXMgZGlmZmVyLyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgb24gZmxvYXQzMiB3aXRoIGludDMyJywgKCkgPT4ge1xuICAgIGV4cGVjdChcbiAgICAgICAgKCkgPT4gZXhwZWN0QXJyYXlzQ2xvc2UoXG4gICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KFsxLCAyLCAzXSksIG5ldyBJbnQzMkFycmF5KFsxLCAyLCAzXSkpKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9BcnJheXMgYXJlIG9mIGRpZmZlcmVudCB0eXBlLyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3Mgb24gaW50MzIgd2l0aCB1aW50OCcsICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICAgICgpID0+IGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICAgICAgbmV3IEludDMyQXJyYXkoWzEsIDIsIDNdKSwgbmV3IFVpbnQ4QXJyYXkoWzEsIDIsIDNdKSkpXG4gICAgICAgIC50b1Rocm93RXJyb3IoL0FycmF5cyBhcmUgb2YgZGlmZmVyZW50IHR5cGUvKTtcbiAgfSk7XG5cbiAgaXQoJ3NpbWlsYXIgYXJyYXlzIHdpdGggZ29vZCBlcHNpbG9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGVwc2lsb24gPSAwLjE7XG4gICAgZXhwZWN0QXJyYXlzQ2xvc2UobmV3IEZsb2F0MzJBcnJheShbMSwgMiwgMy4wOF0pLCBbMSwgMiwgM10sIGVwc2lsb24pO1xuICB9KTtcblxuICBpdCgnc2ltaWxhciBhcnJheXMgd2l0aCBiYWQgZXBzaWxvbicsICgpID0+IHtcbiAgICBjb25zdCBlcHNpbG9uID0gMC4wMTtcbiAgICBleHBlY3QoXG4gICAgICAgICgpID0+IGV4cGVjdEFycmF5c0Nsb3NlKFxuICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShbMSwgMiwgMy4wOF0pLCBbMSwgMiwgM10sIGVwc2lsb24pKVxuICAgICAgICAudG9UaHJvd0Vycm9yKC9BcnJheXMgZGlmZmVyLyk7XG4gIH0pO1xufSk7XG4iXX0=