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
import { DepthwiseConv2dNativeBackpropInput } from '../kernel_names';
import { op } from './operation';
import { reshape } from './reshape';
function depthwiseConv2dNativeBackpropInput_(xShape, dy, filter, strides, pad, dilations = [1, 1], dimRoundingMode) {
    let dy4D = dy;
    let reshapedTo4D = false;
    if (dy.rank === 3) {
        reshapedTo4D = true;
        dy4D = reshape(dy, [1, dy.shape[0], dy.shape[1], dy.shape[2]]);
    }
    const inputs = { dy: dy4D, filter };
    const attrs = { strides, pad, dimRoundingMode, dilations, inputShape: xShape };
    const res = 
    // tslint:disable-next-line: no-unnecessary-type-assertion
    ENGINE.runKernel(DepthwiseConv2dNativeBackpropInput, inputs, attrs);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
export const depthwiseConv2dNativeBackpropInput = op({ depthwiseConv2dNativeBackpropInput_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwdGh3aXNlX2NvbnYyZF9uYXRpdmVfYmFja3Byb3BfaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9kZXB0aHdpc2VfY29udjJkX25hdGl2ZV9iYWNrcHJvcF9pbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxrQ0FBa0MsRUFBb0YsTUFBTSxpQkFBaUIsQ0FBQztBQU10SixPQUFPLEVBQUMsRUFBRSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEMsU0FBUyxtQ0FBbUMsQ0FDeEMsTUFBd0MsRUFBRSxFQUFLLEVBQUUsTUFBZ0IsRUFDakUsT0FBZ0MsRUFDaEMsR0FBMEMsRUFDMUMsWUFBcUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQzNDLGVBQXdDO0lBQzFDLElBQUksSUFBSSxHQUFHLEVBQWMsQ0FBQztJQUMxQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtRQUNqQixZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoRTtJQUVELE1BQU0sTUFBTSxHQUE2QyxFQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUM7SUFDNUUsTUFBTSxLQUFLLEdBQ1AsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBQyxDQUFDO0lBRW5FLE1BQU0sR0FBRztJQUNMLDBEQUEwRDtJQUMxRCxNQUFNLENBQUMsU0FBUyxDQUNaLGtDQUFrQyxFQUFFLE1BQThCLEVBQ2xFLEtBQTJCLENBQU0sQ0FBQztJQUUxQyxJQUFJLFlBQVksRUFBRTtRQUNoQixPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFNLENBQUM7S0FDdEU7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxrQ0FBa0MsR0FDM0MsRUFBRSxDQUFDLEVBQUMsbUNBQW1DLEVBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtFTkdJTkV9IGZyb20gJy4uL2VuZ2luZSc7XG5pbXBvcnQge0RlcHRod2lzZUNvbnYyZE5hdGl2ZUJhY2twcm9wSW5wdXQsIERlcHRod2lzZUNvbnYyZE5hdGl2ZUJhY2twcm9wSW5wdXRBdHRycywgRGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BJbnB1dElucHV0c30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7TmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHtUZW5zb3IzRCwgVGVuc29yNER9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQge05hbWVkVGVuc29yTWFwfSBmcm9tICcuLi90ZW5zb3JfdHlwZXMnO1xuXG5pbXBvcnQge0V4cGxpY2l0UGFkZGluZ30gZnJvbSAnLi9jb252X3V0aWwnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuXG5mdW5jdGlvbiBkZXB0aHdpc2VDb252MmROYXRpdmVCYWNrcHJvcElucHV0XzxUIGV4dGVuZHMgVGVuc29yM0R8VGVuc29yNEQ+KFxuICAgIHhTaGFwZTogW251bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0sIGR5OiBULCBmaWx0ZXI6IFRlbnNvcjRELFxuICAgIHN0cmlkZXM6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIHBhZDogJ3ZhbGlkJ3wnc2FtZSd8bnVtYmVyfEV4cGxpY2l0UGFkZGluZyxcbiAgICBkaWxhdGlvbnM6IFtudW1iZXIsIG51bWJlcl18bnVtYmVyID0gWzEsIDFdLFxuICAgIGRpbVJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcpOiBUIHtcbiAgbGV0IGR5NEQgPSBkeSBhcyBUZW5zb3I0RDtcbiAgbGV0IHJlc2hhcGVkVG80RCA9IGZhbHNlO1xuICBpZiAoZHkucmFuayA9PT0gMykge1xuICAgIHJlc2hhcGVkVG80RCA9IHRydWU7XG4gICAgZHk0RCA9IHJlc2hhcGUoZHksIFsxLCBkeS5zaGFwZVswXSwgZHkuc2hhcGVbMV0sIGR5LnNoYXBlWzJdXSk7XG4gIH1cblxuICBjb25zdCBpbnB1dHM6IERlcHRod2lzZUNvbnYyZE5hdGl2ZUJhY2twcm9wSW5wdXRJbnB1dHMgPSB7ZHk6IGR5NEQsIGZpbHRlcn07XG4gIGNvbnN0IGF0dHJzOiBEZXB0aHdpc2VDb252MmROYXRpdmVCYWNrcHJvcElucHV0QXR0cnMgPVxuICAgICAge3N0cmlkZXMsIHBhZCwgZGltUm91bmRpbmdNb2RlLCBkaWxhdGlvbnMsIGlucHV0U2hhcGU6IHhTaGFwZX07XG5cbiAgY29uc3QgcmVzID1cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tdW5uZWNlc3NhcnktdHlwZS1hc3NlcnRpb25cbiAgICAgIEVOR0lORS5ydW5LZXJuZWwoXG4gICAgICAgICAgRGVwdGh3aXNlQ29udjJkTmF0aXZlQmFja3Byb3BJbnB1dCwgaW5wdXRzIGFzIHt9IGFzIE5hbWVkVGVuc29yTWFwLFxuICAgICAgICAgIGF0dHJzIGFzIHt9IGFzIE5hbWVkQXR0ck1hcCkgYXMgVDtcblxuICBpZiAocmVzaGFwZWRUbzREKSB7XG4gICAgcmV0dXJuIHJlc2hhcGUocmVzLCBbcmVzLnNoYXBlWzFdLCByZXMuc2hhcGVbMl0sIHJlcy5zaGFwZVszXV0pIGFzIFQ7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGNvbnN0IGRlcHRod2lzZUNvbnYyZE5hdGl2ZUJhY2twcm9wSW5wdXQgPVxuICAgIG9wKHtkZXB0aHdpc2VDb252MmROYXRpdmVCYWNrcHJvcElucHV0X30pO1xuIl19