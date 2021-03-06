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
import { ENGINE } from '../engine';
import { DepthwiseConv2dNativeBackpropFilter } from '../kernel_names';
import { op } from './operation';
import { reshape } from './reshape';
function depthwiseConv2dNativeBackpropFilter_(x, dy, filterShape, strides, pad, dilations = [1, 1], dimRoundingMode) {
    let x4D = x;
    if (x.rank === 3) {
        x4D = reshape(x, [1, x.shape[0], x.shape[1], x.shape[2]]);
    }
    let dy4D = dy;
    if (dy4D.rank === 3) {
        dy4D = reshape(dy, [1, dy.shape[0], dy.shape[1], dy.shape[2]]);
    }
    const inputs = { x: x4D, dy: dy4D };
    const attrs = { strides, pad, dimRoundingMode, dilations, filterShape };
    // tslint:disable-next-line: no-unnecessary-type-assertion
    return ENGINE.runKernel(DepthwiseConv2dNativeBackpropFilter, inputs, attrs);
}
export const depthwiseConv2dNativeBackpropFilter = op({ depthwiseConv2dNativeBackpropFilter_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwdGh3aXNlX2NvbnYyZF9uYXRpdmVfYmFja3Byb3BfZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvZGVwdGh3aXNlX2NvbnYyZF9uYXRpdmVfYmFja3Byb3BfZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLG1DQUFtQyxFQUFzRixNQUFNLGlCQUFpQixDQUFDO0FBTXpKLE9BQU8sRUFBQyxFQUFFLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxTQUFTLG9DQUFvQyxDQUN6QyxDQUFJLEVBQUUsRUFBSyxFQUFFLFdBQTZDLEVBQzFELE9BQWdDLEVBQ2hDLEdBQTBDLEVBQzFDLFlBQXFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUMzQyxlQUF3QztJQUMxQyxJQUFJLEdBQUcsR0FBRyxDQUFhLENBQUM7SUFDeEIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNoQixHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDM0Q7SUFDRCxJQUFJLElBQUksR0FBRyxFQUFjLENBQUM7SUFDMUIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNuQixJQUFJLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEU7SUFFRCxNQUFNLE1BQU0sR0FBOEMsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUM3RSxNQUFNLEtBQUssR0FDUCxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUMsQ0FBQztJQUU1RCwwREFBMEQ7SUFDMUQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUNaLG1DQUFtQyxFQUNuQyxNQUE4QixFQUFFLEtBQTJCLENBQzFELENBQUM7QUFDZixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sbUNBQW1DLEdBQzVDLEVBQUUsQ0FBQyxFQUFDLG9DQUFvQyxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7RU5HSU5FfSBmcm9tICcuLi9lbmdpbmUnO1xuaW1wb3J0IHtEZXB0aHdpc2VDb252MmROYXRpdmVCYWNrcHJvcEZpbHRlciwgRGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BGaWx0ZXJBdHRycywgRGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BGaWx0ZXJJbnB1dHN9IGZyb20gJy4uL2tlcm5lbF9uYW1lcyc7XG5pbXBvcnQge05hbWVkQXR0ck1hcH0gZnJvbSAnLi4va2VybmVsX3JlZ2lzdHJ5JztcbmltcG9ydCB7VGVuc29yM0QsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vdGVuc29yX3R5cGVzJztcblxuaW1wb3J0IHtFeHBsaWNpdFBhZGRpbmd9IGZyb20gJy4vY29udl91dGlsJztcbmltcG9ydCB7b3B9IGZyb20gJy4vb3BlcmF0aW9uJztcbmltcG9ydCB7cmVzaGFwZX0gZnJvbSAnLi9yZXNoYXBlJztcblxuZnVuY3Rpb24gZGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BGaWx0ZXJfPFQgZXh0ZW5kcyBUZW5zb3IzRHxUZW5zb3I0RD4oXG4gICAgeDogVCwgZHk6IFQsIGZpbHRlclNoYXBlOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXSxcbiAgICBzdHJpZGVzOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlcixcbiAgICBwYWQ6ICd2YWxpZCd8J3NhbWUnfG51bWJlcnxFeHBsaWNpdFBhZGRpbmcsXG4gICAgZGlsYXRpb25zOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlciA9IFsxLCAxXSxcbiAgICBkaW1Sb3VuZGluZ01vZGU/OiAnZmxvb3InfCdyb3VuZCd8J2NlaWwnKTogVGVuc29yNEQge1xuICBsZXQgeDREID0geCBhcyBUZW5zb3I0RDtcbiAgaWYgKHgucmFuayA9PT0gMykge1xuICAgIHg0RCA9IHJlc2hhcGUoeCwgWzEsIHguc2hhcGVbMF0sIHguc2hhcGVbMV0sIHguc2hhcGVbMl1dKTtcbiAgfVxuICBsZXQgZHk0RCA9IGR5IGFzIFRlbnNvcjREO1xuICBpZiAoZHk0RC5yYW5rID09PSAzKSB7XG4gICAgZHk0RCA9IHJlc2hhcGUoZHksIFsxLCBkeS5zaGFwZVswXSwgZHkuc2hhcGVbMV0sIGR5LnNoYXBlWzJdXSk7XG4gIH1cblxuICBjb25zdCBpbnB1dHM6IERlcHRod2lzZUNvbnYyZE5hdGl2ZUJhY2twcm9wRmlsdGVySW5wdXRzID0ge3g6IHg0RCwgZHk6IGR5NER9O1xuICBjb25zdCBhdHRyczogRGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BGaWx0ZXJBdHRycyA9XG4gICAgICB7c3RyaWRlcywgcGFkLCBkaW1Sb3VuZGluZ01vZGUsIGRpbGF0aW9ucywgZmlsdGVyU2hhcGV9O1xuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgcmV0dXJuIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgICAgRGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BGaWx0ZXIsXG4gICAgICAgICAgICAgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLCBhdHRycyBhcyB7fSBhcyBOYW1lZEF0dHJNYXApIGFzXG4gICAgICBUZW5zb3I0RDtcbn1cblxuZXhwb3J0IGNvbnN0IGRlcHRod2lzZUNvbnYyZE5hdGl2ZUJhY2twcm9wRmlsdGVyID1cbiAgICBvcCh7ZGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BGaWx0ZXJffSk7XG4iXX0=