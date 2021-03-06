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
import { nonMaxSuppressionV5Impl } from '../../backends/non_max_suppression_impl';
import { convertToTensor } from '../../tensor_util_env';
import { nonMaxSuppSanityCheck } from '../nonmax_util';
import { tensor1d } from '../tensor1d';
/**
 * Asynchronously performs non maximum suppression of bounding boxes based on
 * iou (intersection over union).
 *
 * This op also supports a Soft-NMS mode (c.f.
 * Bodla et al, https://arxiv.org/abs/1704.04503) where boxes reduce the score
 * of other overlapping boxes, therefore favoring different regions of the image
 * with high scores. To enable this Soft-NMS mode, set the `softNmsSigma`
 * parameter to be larger than 0.
 *
 * @param boxes a 2d tensor of shape `[numBoxes, 4]`. Each entry is
 *     `[y1, x1, y2, x2]`, where `(y1, x1)` and `(y2, x2)` are the corners of
 *     the bounding box.
 * @param scores a 1d tensor providing the box scores of shape `[numBoxes]`.
 * @param maxOutputSize The maximum number of boxes to be selected.
 * @param iouThreshold A float representing the threshold for deciding whether
 *     boxes overlap too much with respect to IOU. Must be between [0, 1].
 *     Defaults to 0.5 (50% box overlap).
 * @param scoreThreshold A threshold for deciding when to remove boxes based
 *     on score. Defaults to -inf, which means any score is accepted.
 * @param softNmsSigma A float representing the sigma parameter for Soft NMS.
 *     When sigma is 0, it falls back to nonMaxSuppression.
 * @return A map with the following properties:
 *     - selectedIndices: A 1D tensor with the selected box indices.
 *     - selectedScores: A 1D tensor with the corresponding scores for each
 *       selected box.
 *
 * @doc {heading: 'Operations', subheading: 'Images', namespace: 'image'}
 */
async function nonMaxSuppressionWithScoreAsync_(boxes, scores, maxOutputSize, iouThreshold = 0.5, scoreThreshold = Number.NEGATIVE_INFINITY, softNmsSigma = 0.0) {
    const $boxes = convertToTensor(boxes, 'boxes', 'nonMaxSuppressionAsync');
    const $scores = convertToTensor(scores, 'scores', 'nonMaxSuppressionAsync');
    const params = nonMaxSuppSanityCheck($boxes, $scores, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma);
    maxOutputSize = params.maxOutputSize;
    iouThreshold = params.iouThreshold;
    scoreThreshold = params.scoreThreshold;
    softNmsSigma = params.softNmsSigma;
    const boxesAndScores = await Promise.all([$boxes.data(), $scores.data()]);
    const boxesVals = boxesAndScores[0];
    const scoresVals = boxesAndScores[1];
    // We call a cpu based impl directly with the typedarray data  here rather
    // than a kernel because all kernels are synchronous (and thus cannot await
    // .data()).
    const { selectedIndices, selectedScores } = nonMaxSuppressionV5Impl(boxesVals, scoresVals, maxOutputSize, iouThreshold, scoreThreshold, softNmsSigma);
    if ($boxes !== boxes) {
        $boxes.dispose();
    }
    if ($scores !== scores) {
        $scores.dispose();
    }
    return {
        selectedIndices: tensor1d(selectedIndices, 'int32'),
        selectedScores: tensor1d(selectedScores)
    };
}
export const nonMaxSuppressionWithScoreAsync = nonMaxSuppressionWithScoreAsync_;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9uX21heF9zdXBwcmVzc2lvbl93aXRoX3Njb3JlX2FzeW5jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvaW1hZ2Uvbm9uX21heF9zdXBwcmVzc2lvbl93aXRoX3Njb3JlX2FzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBR2hGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUV0RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBRXJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEJHO0FBQ0gsS0FBSyxVQUFVLGdDQUFnQyxDQUMzQyxLQUEwQixFQUFFLE1BQTJCLEVBQ3ZELGFBQXFCLEVBQUUsWUFBWSxHQUFHLEdBQUcsRUFDekMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFDekMsWUFBWSxHQUFHLEdBQUc7SUFDcEIsTUFBTSxNQUFNLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztJQUN6RSxNQUFNLE9BQU8sR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBRTVFLE1BQU0sTUFBTSxHQUFHLHFCQUFxQixDQUNoQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUM1RCxZQUFZLENBQUMsQ0FBQztJQUNsQixhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztJQUNyQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUNuQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUN2QyxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztJQUVuQyxNQUFNLGNBQWMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxRSxNQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJDLDBFQUEwRTtJQUMxRSwyRUFBMkU7SUFDM0UsWUFBWTtJQUNaLE1BQU0sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFDLEdBQUcsdUJBQXVCLENBQzdELFNBQVMsRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQ2xFLFlBQVksQ0FBQyxDQUFDO0lBRWxCLElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtRQUNwQixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDbEI7SUFDRCxJQUFJLE9BQU8sS0FBSyxNQUFNLEVBQUU7UUFDdEIsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ25CO0lBRUQsT0FBTztRQUNMLGVBQWUsRUFBRSxRQUFRLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQztRQUNuRCxjQUFjLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQztLQUN6QyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLCtCQUErQixHQUFHLGdDQUFnQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtub25NYXhTdXBwcmVzc2lvblY1SW1wbH0gZnJvbSAnLi4vLi4vYmFja2VuZHMvbm9uX21heF9zdXBwcmVzc2lvbl9pbXBsJztcbmltcG9ydCB7VGVuc29yMUQsIFRlbnNvcjJEfSBmcm9tICcuLi8uLi90ZW5zb3InO1xuaW1wb3J0IHtOYW1lZFRlbnNvck1hcH0gZnJvbSAnLi4vLi4vdGVuc29yX3R5cGVzJztcbmltcG9ydCB7Y29udmVydFRvVGVuc29yfSBmcm9tICcuLi8uLi90ZW5zb3JfdXRpbF9lbnYnO1xuaW1wb3J0IHtUZW5zb3JMaWtlfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQge25vbk1heFN1cHBTYW5pdHlDaGVja30gZnJvbSAnLi4vbm9ubWF4X3V0aWwnO1xuaW1wb3J0IHt0ZW5zb3IxZH0gZnJvbSAnLi4vdGVuc29yMWQnO1xuXG4vKipcbiAqIEFzeW5jaHJvbm91c2x5IHBlcmZvcm1zIG5vbiBtYXhpbXVtIHN1cHByZXNzaW9uIG9mIGJvdW5kaW5nIGJveGVzIGJhc2VkIG9uXG4gKiBpb3UgKGludGVyc2VjdGlvbiBvdmVyIHVuaW9uKS5cbiAqXG4gKiBUaGlzIG9wIGFsc28gc3VwcG9ydHMgYSBTb2Z0LU5NUyBtb2RlIChjLmYuXG4gKiBCb2RsYSBldCBhbCwgaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzE3MDQuMDQ1MDMpIHdoZXJlIGJveGVzIHJlZHVjZSB0aGUgc2NvcmVcbiAqIG9mIG90aGVyIG92ZXJsYXBwaW5nIGJveGVzLCB0aGVyZWZvcmUgZmF2b3JpbmcgZGlmZmVyZW50IHJlZ2lvbnMgb2YgdGhlIGltYWdlXG4gKiB3aXRoIGhpZ2ggc2NvcmVzLiBUbyBlbmFibGUgdGhpcyBTb2Z0LU5NUyBtb2RlLCBzZXQgdGhlIGBzb2Z0Tm1zU2lnbWFgXG4gKiBwYXJhbWV0ZXIgdG8gYmUgbGFyZ2VyIHRoYW4gMC5cbiAqXG4gKiBAcGFyYW0gYm94ZXMgYSAyZCB0ZW5zb3Igb2Ygc2hhcGUgYFtudW1Cb3hlcywgNF1gLiBFYWNoIGVudHJ5IGlzXG4gKiAgICAgYFt5MSwgeDEsIHkyLCB4Ml1gLCB3aGVyZSBgKHkxLCB4MSlgIGFuZCBgKHkyLCB4MilgIGFyZSB0aGUgY29ybmVycyBvZlxuICogICAgIHRoZSBib3VuZGluZyBib3guXG4gKiBAcGFyYW0gc2NvcmVzIGEgMWQgdGVuc29yIHByb3ZpZGluZyB0aGUgYm94IHNjb3JlcyBvZiBzaGFwZSBgW251bUJveGVzXWAuXG4gKiBAcGFyYW0gbWF4T3V0cHV0U2l6ZSBUaGUgbWF4aW11bSBudW1iZXIgb2YgYm94ZXMgdG8gYmUgc2VsZWN0ZWQuXG4gKiBAcGFyYW0gaW91VGhyZXNob2xkIEEgZmxvYXQgcmVwcmVzZW50aW5nIHRoZSB0aHJlc2hvbGQgZm9yIGRlY2lkaW5nIHdoZXRoZXJcbiAqICAgICBib3hlcyBvdmVybGFwIHRvbyBtdWNoIHdpdGggcmVzcGVjdCB0byBJT1UuIE11c3QgYmUgYmV0d2VlbiBbMCwgMV0uXG4gKiAgICAgRGVmYXVsdHMgdG8gMC41ICg1MCUgYm94IG92ZXJsYXApLlxuICogQHBhcmFtIHNjb3JlVGhyZXNob2xkIEEgdGhyZXNob2xkIGZvciBkZWNpZGluZyB3aGVuIHRvIHJlbW92ZSBib3hlcyBiYXNlZFxuICogICAgIG9uIHNjb3JlLiBEZWZhdWx0cyB0byAtaW5mLCB3aGljaCBtZWFucyBhbnkgc2NvcmUgaXMgYWNjZXB0ZWQuXG4gKiBAcGFyYW0gc29mdE5tc1NpZ21hIEEgZmxvYXQgcmVwcmVzZW50aW5nIHRoZSBzaWdtYSBwYXJhbWV0ZXIgZm9yIFNvZnQgTk1TLlxuICogICAgIFdoZW4gc2lnbWEgaXMgMCwgaXQgZmFsbHMgYmFjayB0byBub25NYXhTdXBwcmVzc2lvbi5cbiAqIEByZXR1cm4gQSBtYXAgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKiAgICAgLSBzZWxlY3RlZEluZGljZXM6IEEgMUQgdGVuc29yIHdpdGggdGhlIHNlbGVjdGVkIGJveCBpbmRpY2VzLlxuICogICAgIC0gc2VsZWN0ZWRTY29yZXM6IEEgMUQgdGVuc29yIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgc2NvcmVzIGZvciBlYWNoXG4gKiAgICAgICBzZWxlY3RlZCBib3guXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnSW1hZ2VzJywgbmFtZXNwYWNlOiAnaW1hZ2UnfVxuICovXG5hc3luYyBmdW5jdGlvbiBub25NYXhTdXBwcmVzc2lvbldpdGhTY29yZUFzeW5jXyhcbiAgICBib3hlczogVGVuc29yMkR8VGVuc29yTGlrZSwgc2NvcmVzOiBUZW5zb3IxRHxUZW5zb3JMaWtlLFxuICAgIG1heE91dHB1dFNpemU6IG51bWJlciwgaW91VGhyZXNob2xkID0gMC41LFxuICAgIHNjb3JlVGhyZXNob2xkID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLFxuICAgIHNvZnRObXNTaWdtYSA9IDAuMCk6IFByb21pc2U8TmFtZWRUZW5zb3JNYXA+IHtcbiAgY29uc3QgJGJveGVzID0gY29udmVydFRvVGVuc29yKGJveGVzLCAnYm94ZXMnLCAnbm9uTWF4U3VwcHJlc3Npb25Bc3luYycpO1xuICBjb25zdCAkc2NvcmVzID0gY29udmVydFRvVGVuc29yKHNjb3JlcywgJ3Njb3JlcycsICdub25NYXhTdXBwcmVzc2lvbkFzeW5jJyk7XG5cbiAgY29uc3QgcGFyYW1zID0gbm9uTWF4U3VwcFNhbml0eUNoZWNrKFxuICAgICAgJGJveGVzLCAkc2NvcmVzLCBtYXhPdXRwdXRTaXplLCBpb3VUaHJlc2hvbGQsIHNjb3JlVGhyZXNob2xkLFxuICAgICAgc29mdE5tc1NpZ21hKTtcbiAgbWF4T3V0cHV0U2l6ZSA9IHBhcmFtcy5tYXhPdXRwdXRTaXplO1xuICBpb3VUaHJlc2hvbGQgPSBwYXJhbXMuaW91VGhyZXNob2xkO1xuICBzY29yZVRocmVzaG9sZCA9IHBhcmFtcy5zY29yZVRocmVzaG9sZDtcbiAgc29mdE5tc1NpZ21hID0gcGFyYW1zLnNvZnRObXNTaWdtYTtcblxuICBjb25zdCBib3hlc0FuZFNjb3JlcyA9IGF3YWl0IFByb21pc2UuYWxsKFskYm94ZXMuZGF0YSgpLCAkc2NvcmVzLmRhdGEoKV0pO1xuICBjb25zdCBib3hlc1ZhbHMgPSBib3hlc0FuZFNjb3Jlc1swXTtcbiAgY29uc3Qgc2NvcmVzVmFscyA9IGJveGVzQW5kU2NvcmVzWzFdO1xuXG4gIC8vIFdlIGNhbGwgYSBjcHUgYmFzZWQgaW1wbCBkaXJlY3RseSB3aXRoIHRoZSB0eXBlZGFycmF5IGRhdGEgIGhlcmUgcmF0aGVyXG4gIC8vIHRoYW4gYSBrZXJuZWwgYmVjYXVzZSBhbGwga2VybmVscyBhcmUgc3luY2hyb25vdXMgKGFuZCB0aHVzIGNhbm5vdCBhd2FpdFxuICAvLyAuZGF0YSgpKS5cbiAgY29uc3Qge3NlbGVjdGVkSW5kaWNlcywgc2VsZWN0ZWRTY29yZXN9ID0gbm9uTWF4U3VwcHJlc3Npb25WNUltcGwoXG4gICAgICBib3hlc1ZhbHMsIHNjb3Jlc1ZhbHMsIG1heE91dHB1dFNpemUsIGlvdVRocmVzaG9sZCwgc2NvcmVUaHJlc2hvbGQsXG4gICAgICBzb2Z0Tm1zU2lnbWEpO1xuXG4gIGlmICgkYm94ZXMgIT09IGJveGVzKSB7XG4gICAgJGJveGVzLmRpc3Bvc2UoKTtcbiAgfVxuICBpZiAoJHNjb3JlcyAhPT0gc2NvcmVzKSB7XG4gICAgJHNjb3Jlcy5kaXNwb3NlKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNlbGVjdGVkSW5kaWNlczogdGVuc29yMWQoc2VsZWN0ZWRJbmRpY2VzLCAnaW50MzInKSxcbiAgICBzZWxlY3RlZFNjb3JlczogdGVuc29yMWQoc2VsZWN0ZWRTY29yZXMpXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBub25NYXhTdXBwcmVzc2lvbldpdGhTY29yZUFzeW5jID0gbm9uTWF4U3VwcHJlc3Npb25XaXRoU2NvcmVBc3luY187XG4iXX0=