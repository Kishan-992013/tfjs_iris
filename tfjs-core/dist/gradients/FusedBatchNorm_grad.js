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
import { FusedBatchNorm } from '../kernel_names';
import { add } from '../ops/add';
import { getReductionAxes } from '../ops/broadcast_util';
import { mul } from '../ops/mul';
import { reshape } from '../ops/reshape';
import { rsqrt } from '../ops/rsqrt';
import { scalar } from '../ops/scalar';
import { sub } from '../ops/sub';
import { sum } from '../ops/sum';
import { tile } from '../ops/tile';
export const fusedBatchNormGradConfig = {
    kernelName: FusedBatchNorm,
    inputsToSave: ['x', 'mean', 'variance', 'scale'],
    gradFunc: (dy, saved, attrs) => {
        const { varianceEpsilon } = attrs;
        const [x, mean, variance, scale] = saved;
        const scaleValue = scale == null ? scalar(1) : scale;
        const reductionAxes = getReductionAxes(mean.shape, x.shape);
        const tileShape = [];
        if (mean.rank === 1) {
            for (let i = 0; i < x.shape.length - 1; ++i) {
                tileShape.push(x.shape[i]);
            }
            tileShape.push(1);
        }
        const xMinusMean = sub(x, mean);
        const dyTimesScaleValue = mul(dy, scaleValue);
        const oneOverSqrtVariance = rsqrt(add(variance, scalar(varianceEpsilon)));
        const minusHalfRCube = mul(mul(mul(oneOverSqrtVariance, oneOverSqrtVariance), oneOverSqrtVariance), scalar(-0.5));
        const derX = () => {
            if (mean.rank === 1) {
                return reshape(mul(mul(dy, tile(reshape(oneOverSqrtVariance, [1, 1, 1, mean.shape[0]]), tileShape)), scaleValue), x.shape);
            }
            else {
                return reshape(mul(mul(dy, oneOverSqrtVariance), scaleValue), x.shape);
            }
        };
        const derMean = () => {
            let meanDer = mul(mul(oneOverSqrtVariance, scalar(-1)), dyTimesScaleValue);
            if (mean.rank === 1) {
                meanDer = sum(meanDer, reductionAxes);
            }
            return reshape(meanDer, mean.shape);
        };
        const derVariance = () => {
            let varianceDer = mul(mul(minusHalfRCube, xMinusMean), dyTimesScaleValue);
            if (mean.rank === 1) {
                varianceDer = sum(varianceDer, reductionAxes);
            }
            return reshape(varianceDer, mean.shape);
        };
        const derScale = () => {
            const xMinusMean2TimesRsqrt = mul(xMinusMean, oneOverSqrtVariance);
            let scaleDer = mul(dy, xMinusMean2TimesRsqrt);
            if (mean.rank === 1) {
                scaleDer = sum(scaleDer, reductionAxes);
            }
            return reshape(scaleDer, mean.shape);
        };
        const derOffset = () => {
            let offsetDer = dy;
            if (mean.rank === 1) {
                offsetDer = sum(offsetDer, reductionAxes);
            }
            return reshape(offsetDer, mean.shape);
        };
        return {
            x: derX,
            mean: derMean,
            variance: derVariance,
            scale: derScale,
            offset: derOffset
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRnVzZWRCYXRjaE5vcm1fZ3JhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvZ3JhZGllbnRzL0Z1c2VkQmF0Y2hOb3JtX2dyYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsT0FBTyxFQUFDLGNBQWMsRUFBc0IsTUFBTSxpQkFBaUIsQ0FBQztBQUVwRSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxLQUFLLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDbkMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQy9CLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDL0IsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUlqQyxNQUFNLENBQUMsTUFBTSx3QkFBd0IsR0FBZTtJQUNsRCxVQUFVLEVBQUUsY0FBYztJQUMxQixZQUFZLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUM7SUFDaEQsUUFBUSxFQUFFLENBQ04sRUFBVSxFQUFFLEtBQWUsRUFBRSxLQUFtQixFQUFFLEVBQUU7UUFDdEQsTUFBTSxFQUFDLGVBQWUsRUFBQyxHQUFHLEtBQWtDLENBQUM7UUFDN0QsTUFBTSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUV6QyxNQUFN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QUM7UUFDekQsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxRQUFRLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBRW5FLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQztZQUM5QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUNuQixRQUFRLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQzthQUN6QztZQUNELE9BQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBb0IsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQztRQUNGLE1BQU0sU0FBUyxHQUFHLEdBQUcsRUFBRTtZQUNyQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDbkIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtnQkFDbkIsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDM0M7WUFDRCxPQUFPLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQW9CLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUM7UUFFRixPQUFPO1lBQ0wsQ0FBQyxFQUFFLElBQUk7WUFDUCxJQUFJLEVBQUUsT0FBTztZQUNiLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLEtBQUssRUFBRSxRQUFRO1lBQ2YsTUFBTSxFQUFFLFNBQVM7U0FDbEIsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuaW1wb3J0IHtGdXNlZEJhdGNoTm9ybSwgRnVzZWRCYXRjaE5vcm1BdHRyc30gZnJvbSAnLi4va2VybmVsX25hbWVzJztcbmltcG9ydCB7R3JhZENvbmZpZywgTmFtZWRBdHRyTWFwfSBmcm9tICcuLi9rZXJuZWxfcmVnaXN0cnknO1xuaW1wb3J0IHthZGR9IGZyb20gJy4uL29wcy9hZGQnO1xuaW1wb3J0IHtnZXRSZWR1Y3Rpb25BeGVzfSBmcm9tICcuLi9vcHMvYnJvYWRjYXN0X3V0aWwnO1xuaW1wb3J0IHttdWx9IGZyb20gJy4uL29wcy9tdWwnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuLi9vcHMvcmVzaGFwZSc7XG5pbXBvcnQge3JzcXJ0fSBmcm9tICcuLi9vcHMvcnNxcnQnO1xuaW1wb3J0IHtzY2FsYXJ9IGZyb20gJy4uL29wcy9zY2FsYXInO1xuaW1wb3J0IHtzdWJ9IGZyb20gJy4uL29wcy9zdWInO1xuaW1wb3J0IHtzdW19IGZyb20gJy4uL29wcy9zdW0nO1xuaW1wb3J0IHt0aWxlfSBmcm9tICcuLi9vcHMvdGlsZSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7UmFuaywgU2hhcGVNYXB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNvbnN0IGZ1c2VkQmF0Y2hOb3JtR3JhZENvbmZpZzogR3JhZENvbmZpZyA9IHtcbiAga2VybmVsTmFtZTogRnVzZWRCYXRjaE5vcm0sXG4gIGlucHV0c1RvU2F2ZTogWyd4JywgJ21lYW4nLCAndmFyaWFuY2UnLCAnc2NhbGUnXSxcbiAgZ3JhZEZ1bmM6IDxSIGV4dGVuZHMgUmFuaz4oXG4gICAgICBkeTogVGVuc29yLCBzYXZlZDogVGVuc29yW10sIGF0dHJzOiBOYW1lZEF0dHJNYXApID0+IHtcbiAgICBjb25zdCB7dmFyaWFuY2VFcHNpbG9ufSA9IGF0dHJzIGFzIHt9IGFzIEZ1c2VkQmF0Y2hOb3JtQXR0cnM7XG4gICAgY29uc3QgW3gsIG1lYW4sIHZhcmlhbmNlLCBzY2FsZV0gPSBzYXZlZDtcblxuICAgIGNvbnN0IHNjYWxlVmFsdWUgPSBzY2FsZSA9PSBudWxsID8gc2NhbGFyKDEpIDogc2NhbGU7XG4gICAgY29uc3QgcmVkdWN0aW9uQXhlcyA9IGdldFJlZHVjdGlvbkF4ZXMobWVhbi5zaGFwZSwgeC5zaGFwZSk7XG4gICAgY29uc3QgdGlsZVNoYXBlOiBudW1iZXJbXSA9IFtdO1xuICAgIGlmIChtZWFuLnJhbmsgPT09IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeC5zaGFwZS5sZW5ndGggLSAxOyArK2kpIHtcbiAgICAgICAgdGlsZVNoYXBlLnB1c2goeC5zaGFwZVtpXSk7XG4gICAgICB9XG4gICAgICB0aWxlU2hhcGUucHVzaCgxKTtcbiAgICB9XG5cbiAgICBjb25zdCB4TWludXNNZWFuID0gc3ViKHgsIG1lYW4pO1xuICAgIGNvbnN0IGR5VGltZXNTY2FsZVZhbHVlID0gbXVsKGR5LCBzY2FsZVZhbHVlKTtcbiAgICBjb25zdCBvbmVPdmVyU3FydFZhcmlhbmNlID0gcnNxcnQoYWRkKHZhcmlhbmNlLCBzY2FsYXIodmFyaWFuY2VFcHNpbG9uKSkpO1xuICAgIGNvbnN0IG1pbnVzSGFsZlJDdWJlID0gbXVsKFxuICAgICAgICBtdWwobXVsKG9uZU92ZXJTcXJ0VmFyaWFuY2UsIG9uZU92ZXJTcXJ0VmFyaWFuY2UpLCBvbmVPdmVyU3FydFZhcmlhbmNlKSxcbiAgICAgICAgc2NhbGFyKC0wLjUpKTtcblxuICAgIGNvbnN0IGRlclggPSAoKSA9PiB7XG4gICAgICBpZiAobWVhbi5yYW5rID09PSAxKSB7XG4gICAgICAgIHJldHVybiByZXNoYXBlKFxuICAgICAgICAgICAgbXVsKG11bChkeSxcbiAgICAgICAgICAgICAgICAgICAgdGlsZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2hhcGUob25lT3ZlclNxcnRWYXJpYW5jZSwgWzEsIDEsIDEsIG1lYW4uc2hhcGVbMF1dKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVTaGFwZSkpLFxuICAgICAgICAgICAgICAgIHNjYWxlVmFsdWUpLFxuICAgICAgICAgICAgeC5zaGFwZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzaGFwZShtdWwobXVsKGR5LCBvbmVPdmVyU3FydFZhcmlhbmNlKSwgc2NhbGVWYWx1ZSksIHguc2hhcGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgZGVyTWVhbiA9ICgpID0+IHtcbiAgICAgIGxldCBtZWFuRGVyID1cbiAgICAgICAgICBtdWwobXVsKG9uZU92ZXJTcXJ0VmFyaWFuY2UsIHNjYWxhcigtMSkpLCBkeVRpbWVzU2NhbGVWYWx1ZSk7XG4gICAgICBpZiAobWVhbi5yYW5rID09PSAxKSB7XG4gICAgICAgIG1lYW5EZXIgPSBzdW0obWVhbkRlciwgcmVkdWN0aW9uQXhlcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzaGFwZShtZWFuRGVyLCBtZWFuLnNoYXBlIGFzIFNoYXBlTWFwW1JdKTtcbiAgICB9O1xuICAgIGNvbnN0IGRlclZhcmlhbmNlID0gKCkgPT4ge1xuICAgICAgbGV0IHZhcmlhbmNlRGVyID0gbXVsKG11bChtaW51c0hhbGZSQ3ViZSwgeE1pbnVzTWVhbiksIGR5VGltZXNTY2FsZVZhbHVlKTtcblxuICAgICAgaWYgKG1lYW4ucmFuayA9PT0gMSkge1xuICAgICAgICB2YXJpYW5jZURlciA9IHN1bSh2YXJpYW5jZURlciwgcmVkdWN0aW9uQXhlcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzaGFwZSh2YXJpYW5jZURlciwgbWVhbi5zaGFwZSBhcyBTaGFwZU1hcFtSXSk7XG4gICAgfTtcbiAgICBjb25zdCBkZXJTY2FsZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHhNaW51c01lYW4yVGltZXNSc3FydCA9IG11bCh4TWludXNNZWFuLCBvbmVPdmVyU3FydFZhcmlhbmNlKTtcblxuICAgICAgbGV0IHNjYWxlRGVyID0gbXVsKGR5LCB4TWludXNNZWFuMlRpbWVzUnNxcnQpO1xuICAgICAgaWYgKG1lYW4ucmFuayA9PT0gMSkge1xuICAgICAgICBzY2FsZURlciA9IHN1bShzY2FsZURlciwgcmVkdWN0aW9uQXhlcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzaGFwZShzY2FsZURlciwgbWVhbi5zaGFwZSBhcyBTaGFwZU1hcFtSXSk7XG4gICAgfTtcbiAgICBjb25zdCBkZXJPZmZzZXQgPSAoKSA9PiB7XG4gICAgICBsZXQgb2Zmc2V0RGVyID0gZHk7XG4gICAgICBpZiAobWVhbi5yYW5rID09PSAxKSB7XG4gICAgICAgIG9mZnNldERlciA9IHN1bShvZmZzZXREZXIsIHJlZHVjdGlvbkF4ZXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc2hhcGUob2Zmc2V0RGVyLCBtZWFuLnNoYXBlIGFzIFNoYXBlTWFwW1JdKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IGRlclgsXG4gICAgICBtZWFuOiBkZXJNZWFuLFxuICAgICAgdmFyaWFuY2U6IGRlclZhcmlhbmNlLFxuICAgICAgc2NhbGU6IGRlclNjYWxlLFxuICAgICAgb2Zmc2V0OiBkZXJPZmZzZXRcbiAgICB9O1xuICB9XG59O1xuIl19