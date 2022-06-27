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
import * as util from '../util';
function nonMaxSuppSanityCheck(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma) {
    if (iouThreshold == null) {
        iouThreshold = 0.5;
    }
    if (scoreThreshold == null) {
        scoreThreshold = Number.NEGATIVE_INFINITY;
    }
    if (softNmsSigma == null) {
        softNmsSigma = 0.0;
    }
    const numBoxes = boxes.shape[0];
    maxOutputSize = Math.min(maxOutputSize, numBoxes);
    util.assert(0 <= iouThreshold && iouThreshold <= 1, () => `iouThreshold must be in [0, 1], but was '${iouThreshold}'`);
    util.assert(boxes.rank === 2, () => `boxes must be a 2D tensor, but was of rank '${boxes.rank}'`);
    util.assert(boxes.shape[1] === 4, () => `boxes must have 4 columns, but 2nd dimension was ${boxes.shape[1]}`);
    util.assert(scores.rank === 1, () => 'scores must be a 1D tensor');
    util.assert(scores.shape[0] === numBoxes, () => `scores has incompatible shape with boxes. Expected ${numBoxes}, ` +
        `but was ${scores.shape[0]}`);
    util.assert(0 <= softNmsSigma && softNmsSigma <= 1, () => `softNmsSigma must be in [0, 1], but was '${softNmsSigma}'`);
    return { maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma };
}
export { nonMaxSuppSanityCheck };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ubWF4X3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9ub25tYXhfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFHSCxPQUFPLEtBQUssSUFBSSxNQUFNLFNBQVMsQ0FBQztBQUVoQyxTQUFTLHFCQUFxQixDQUMxQixLQUFlLEVBQUUsTUFBZ0IsRUFBRSxhQUFxQixFQUN4RCxZQUFvQixFQUFFLGNBQXNCLEVBQUUsWUFBcUI7SUFNckUsSUFBSSxZQUFZLElBQUksSUFBSSxFQUFFO1FBQ3hCLFlBQVksR0FBRyxHQUFHLENBQUM7S0FDcEI7SUFDRCxJQUFJLGNBQWMsSUFBSSxJQUFJLEVBQUU7UUFDMUIsY0FBYyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztLQUMzQztJQUNELElBQUksWUFBWSxJQUFJLElBQUksRUFBRTtRQUN4QixZQUFZLEdBQUcsR0FBRyxDQUFDO0tBQ3BCO0lBRUQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFbEQsSUFBSSxDQUFDLE1BQU0sQ0FDUCxDQUFDLElBQUksWUFBWSxJQUFJLFlBQVksSUFBSSxDQUFDLEVBQ3RDLEdBQUcsRUFBRSxDQUFDLDRDQUE0QyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQ1AsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ2hCLEdBQUcsRUFBRSxDQUFDLCtDQUErQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUN4RSxJQUFJLENBQUMsTUFBTSxDQUNQLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUNwQixHQUFHLEVBQUUsQ0FDRCxvREFBb0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQ25FLElBQUksQ0FBQyxNQUFNLENBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQzVCLEdBQUcsRUFBRSxDQUFDLHNEQUFzRCxRQUFRLElBQUk7UUFDcEUsV0FBVyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0QyxJQUFJLENBQUMsTUFBTSxDQUNQLENBQUMsSUFBSSxZQUFZLElBQUksWUFBWSxJQUFJLENBQUMsRUFDdEMsR0FBRyxFQUFFLENBQUMsNENBQTRDLFlBQVksR0FBRyxDQUFDLENBQUM7SUFDdkUsT0FBTyxFQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLFlBQVksRUFBQyxDQUFDO0FBQ3JFLENBQUM7QUFFRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cblxuaW1wb3J0IHtUZW5zb3IxRCwgVGVuc29yMkR9IGZyb20gJy4uL3RlbnNvcic7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBub25NYXhTdXBwU2FuaXR5Q2hlY2soXG4gICAgYm94ZXM6IFRlbnNvcjJELCBzY29yZXM6IFRlbnNvcjFELCBtYXhPdXRwdXRTaXplOiBudW1iZXIsXG4gICAgaW91VGhyZXNob2xkOiBudW1iZXIsIHNjb3JlVGhyZXNob2xkOiBudW1iZXIsIHNvZnRObXNTaWdtYT86IG51bWJlcik6IHtcbiAgbWF4T3V0cHV0U2l6ZTogbnVtYmVyLFxuICBpb3VUaHJlc2hvbGQ6IG51bWJlcixcbiAgc2NvcmVUaHJlc2hvbGQ6IG51bWJlcixcbiAgc29mdE5tc1NpZ21hOiBudW1iZXJcbn0ge1xuICBpZiAoaW91VGhyZXNob2xkID09IG51bGwpIHtcbiAgICBpb3VUaHJlc2hvbGQgPSAwLjU7XG4gIH1cbiAgaWYgKHNjb3JlVGhyZXNob2xkID09IG51bGwpIHtcbiAgICBzY29yZVRocmVzaG9sZCA9IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbiAgfVxuICBpZiAoc29mdE5tc1NpZ21hID09IG51bGwpIHtcbiAgICBzb2Z0Tm1zU2lnbWEgPSAwLjA7XG4gIH1cblxuICBjb25zdCBudW1Cb3hlcyA9IGJveGVzLnNoYXBlWzBdO1xuICBtYXhPdXRwdXRTaXplID0gTWF0aC5taW4obWF4T3V0cHV0U2l6ZSwgbnVtQm94ZXMpO1xuXG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgMCA8PSBpb3VUaHJlc2hvbGQgJiYgaW91VGhyZXNob2xkIDw9IDEsXG4gICAgICAoKSA9PiBgaW91VGhyZXNob2xkIG11c3QgYmUgaW4gWzAsIDFdLCBidXQgd2FzICcke2lvdVRocmVzaG9sZH0nYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgYm94ZXMucmFuayA9PT0gMixcbiAgICAgICgpID0+IGBib3hlcyBtdXN0IGJlIGEgMkQgdGVuc29yLCBidXQgd2FzIG9mIHJhbmsgJyR7Ym94ZXMucmFua30nYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgYm94ZXMuc2hhcGVbMV0gPT09IDQsXG4gICAgICAoKSA9PlxuICAgICAgICAgIGBib3hlcyBtdXN0IGhhdmUgNCBjb2x1bW5zLCBidXQgMm5kIGRpbWVuc2lvbiB3YXMgJHtib3hlcy5zaGFwZVsxXX1gKTtcbiAgdXRpbC5hc3NlcnQoc2NvcmVzLnJhbmsgPT09IDEsICgpID0+ICdzY29yZXMgbXVzdCBiZSBhIDFEIHRlbnNvcicpO1xuICB1dGlsLmFzc2VydChcbiAgICAgIHNjb3Jlcy5zaGFwZVswXSA9PT0gbnVtQm94ZXMsXG4gICAgICAoKSA9PiBgc2NvcmVzIGhhcyBpbmNvbXBhdGlibGUgc2hhcGUgd2l0aCBib3hlcy4gRXhwZWN0ZWQgJHtudW1Cb3hlc30sIGAgK1xuICAgICAgICAgIGBidXQgd2FzICR7c2NvcmVzLnNoYXBlWzBdfWApO1xuICB1dGlsLmFzc2VydChcbiAgICAgIDAgPD0gc29mdE5tc1NpZ21hICYmIHNvZnRObXNTaWdtYSA8PSAxLFxuICAgICAgKCkgPT4gYHNvZnRObXNTaWdtYSBtdXN0IGJlIGluIFswLCAxXSwgYnV0IHdhcyAnJHtzb2Z0Tm1zU2lnbWF9J2ApO1xuICByZXR1cm4ge21heE91dHB1dFNpemUsIGlvdVRocmVzaG9sZCwgc2NvcmVUaHJlc2hvbGQsIHNvZnRObXNTaWdtYX07XG59XG5cbmV4cG9ydCB7bm9uTWF4U3VwcFNhbml0eUNoZWNrfTtcbiJdfQ==