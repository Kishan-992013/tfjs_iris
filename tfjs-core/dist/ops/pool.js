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
import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { avgPool } from './avg_pool';
import { batchToSpaceND } from './batch_to_space_nd';
import * as conv_util from './conv_util';
import { maxPool } from './max_pool';
import { op } from './operation';
import { reshape } from './reshape';
import { spaceToBatchND } from './space_to_batch_nd';
/**
 * Performs an N-D pooling operation
 *
 * @param input The input tensor, of rank 4 or rank 3 of shape
 *     `[batch, height, width, inChannels]`. If rank 3, batch of 1 is assumed.
 * @param windowShape The filter size: `[filterHeight, filterWidth]`. If
 *     `filterSize` is a single number, then `filterHeight == filterWidth`.
 * @param poolingType The type of pooling, either 'max' or 'avg'.
 * @param pad The type of padding algorithm:
 *    - `same` and stride 1: output will be of same size as input,
 *       regardless of filter size.
 *    - `valid`: output will be smaller than input if filter is larger
 *       than 1x1.
 *    - For more info, see this guide:
 *     [https://www.tensorflow.org/api_guides/python/nn#Convolution](
 *         https://www.tensorflow.org/api_guides/python/nn#Convolution)
 * @param dilations The dilation rates: `[dilationHeight, dilationWidth]`
 *     in which we sample input values across the height and width dimensions
 *     in dilated pooling. Defaults to `[1, 1]`. If `dilationRate` is a single
 *     number, then `dilationHeight == dilationWidth`. If it is greater than
 *     1, then all values of `strides` must be 1.
 * @param strides The strides of the pooling: `[strideHeight, strideWidth]`. If
 *     `strides` is a single number, then `strideHeight == strideWidth`.
 * @param dimRoundingMode A string from: 'ceil', 'round', 'floor'. If none is
 *     provided, it will default to truncate.
 *
 * @doc {heading: 'Operations', subheading: 'Convolution'}
 */
function pool_(input, windowShape, poolingType, pad, dilations, strides, dimRoundingMode) {
    if (dilations == null) {
        dilations = [1, 1];
    }
    if (strides == null) {
        strides = 1;
    }
    if (pad === 0) {
        pad = 'valid';
    }
    const $x = convertToTensor(input, 'x', 'maxPool');
    let x4D = $x;
    let reshapedTo4D = false;
    if ($x.rank === 3) {
        reshapedTo4D = true;
        x4D = reshape($x, [1, $x.shape[0], $x.shape[1], $x.shape[2]]);
    }
    util.assert(conv_util.eitherStridesOrDilationsAreOne(strides, dilations), () => 'Error in pool: Either strides or dilations must be 1. ' +
        `Got strides ${strides} and dilations '${dilations}'`);
    const convInfo = conv_util.computePool2DInfo(x4D.shape, windowShape, strides, dilations, pad);
    const dilation = [convInfo.dilationHeight, convInfo.dilationWidth];
    // The following implementation does batchToSpace(pool(spaceToBatch(x)))
    // whenever dilation > 1 since the TF kernels do not support dilation > 1.
    // tslint:disable-next-line:max-line-length
    // https://github.com/tensorflow/tensorflow/blob/50f6bb67dc98c9b74630b6047aae7a4f8a40fd02/tensorflow/python/ops/nn_ops.py#L1037
    let basePadding;
    if (pad === 'same') {
        basePadding = withSpaceToBatchBasePaddings([convInfo.filterHeight, convInfo.filterWidth], dilation);
    }
    else {
        basePadding = [[0, 0], [0, 0]];
    }
    const isDilationOne = dilation[0] === 1 && dilation[1] === 1;
    const [adjustedPadding, adjustedCrops] = requiredSpaceToBatchPaddings([convInfo.inHeight, convInfo.inWidth], dilation, basePadding);
    const convertedPad = isDilationOne ? pad : 'valid';
    const convertedX = isDilationOne ? x4D : spaceToBatchND(x4D, dilation, adjustedPadding);
    const forwardOp = poolingType === 'avg' ?
        () => avgPool(convertedX, windowShape, strides, convertedPad, dimRoundingMode) :
        () => maxPool(convertedX, windowShape, strides, convertedPad, dimRoundingMode);
    const y = forwardOp();
    const res = isDilationOne ? y : batchToSpaceND(y, dilation, adjustedCrops);
    if (reshapedTo4D) {
        return reshape(res, [res.shape[1], res.shape[2], res.shape[3]]);
    }
    return res;
}
// Helper function to compute crops and paddings for pool with dilation > 1.
// tslint:disable-next-line:max-line-length
// https://github.com/tensorflow/tensorflow/blob/50f6bb67dc98c9b74630b6047aae7a4f8a40fd02/tensorflow/python/ops/array_ops.py#L2184
function requiredSpaceToBatchPaddings(inputShape, blockShape, basePadding) {
    const padStart = basePadding.map(b => b[0]);
    const origPadEnd = basePadding.map(b => b[1]);
    const fullInputShape = inputShape.concat(padStart, origPadEnd);
    const padEndExtra = blockShape.map((b, i) => (b - fullInputShape[i] % b) % b);
    const padEnd = origPadEnd.map((s, i) => s + padEndExtra[i]);
    const paddings = blockShape.map((_, i) => [padStart[i], padEnd[i]]);
    const crops = blockShape.map((_, i) => [0, padEndExtra[i]]);
    return [paddings, crops];
}
// Helper function to compute base paddings for pool with dilation > 1.
// tslint:disable-next-line:max-line-length
// https://github.com/tensorflow/tensorflow/blob/50f6bb67dc98c9b74630b6047aae7a4f8a40fd02/tensorflow/python/ops/nn_ops.py#L524
function withSpaceToBatchBasePaddings(filterShape, dilation) {
    // Spatial dimensions of the filters and the upsampled filters in which we
    // introduce (rate - 1) zeros between consecutive filter values.
    const dilatedFilterShape = filterShape.map((s, i) => {
        return s + (s - 1) * (dilation[i] - 1);
    });
    const padExtraShape = dilatedFilterShape.map(s => s - 1);
    // When padding is odd, we pad more at end, following the same
    // convention as conv2d.
    const padExtraStart = padExtraShape.map(s => Math.floor(s / 2));
    const padExtraEnd = padExtraShape.map((s, i) => s - padExtraStart[i]);
    return padExtraShape.map((_, i) => {
        return [padExtraStart[i], padExtraEnd[i]];
    });
}
export const pool = op({ pool_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3RmanMtY29yZS9zcmMvb3BzL3Bvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sS0FBSyxTQUFTLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMvQixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVuRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkJHO0FBQ0gsU0FBUyxLQUFLLENBQ1YsS0FBbUIsRUFBRSxXQUFvQyxFQUN6RCxXQUF3QixFQUN4QixHQUFvRCxFQUNwRCxTQUFtQyxFQUFFLE9BQWlDLEVBQ3RFLGVBQXdDO0lBQzFDLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtRQUNyQixTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDcEI7SUFDRCxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7UUFDbkIsT0FBTyxHQUFHLENBQUMsQ0FBQztLQUNiO0lBQ0QsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFO1FBQ2IsR0FBRyxHQUFHLE9BQU8sQ0FBQztLQUNmO0lBRUQsTUFBTSxFQUFFLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxHQUFHLEVB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NUMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yM0QsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7YXZnUG9vbH0gZnJvbSAnLi9hdmdfcG9vbCc7XG5pbXBvcnQge2JhdGNoVG9TcGFjZU5EfSBmcm9tICcuL2JhdGNoX3RvX3NwYWNlX25kJztcbmltcG9ydCAqIGFzIGNvbnZfdXRpbCBmcm9tICcuL2NvbnZfdXRpbCc7XG5pbXBvcnQge21heFBvb2x9IGZyb20gJy4vbWF4X3Bvb2wnO1xuaW1wb3J0IHtvcH0gZnJvbSAnLi9vcGVyYXRpb24nO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuaW1wb3J0IHtzcGFjZVRvQmF0Y2hORH0gZnJvbSAnLi9zcGFjZV90b19iYXRjaF9uZCc7XG5cbi8qKlxuICogUGVyZm9ybXMgYW4gTi1EIHBvb2xpbmcgb3BlcmF0aW9uXG4gKlxuICogQHBhcmFtIGlucHV0IFRoZSBpbnB1dCB0ZW5zb3IsIG9mIHJhbmsgNCBvciByYW5rIDMgb2Ygc2hhcGVcbiAqICAgICBgW2JhdGNoLCBoZWlnaHQsIHdpZHRoLCBpbkNoYW5uZWxzXWAuIElmIHJhbmsgMywgYmF0Y2ggb2YgMSBpcyBhc3N1bWVkLlxuICogQHBhcmFtIHdpbmRvd1NoYXBlIFRoZSBmaWx0ZXIgc2l6ZTogYFtmaWx0ZXJIZWlnaHQsIGZpbHRlcldpZHRoXWAuIElmXG4gKiAgICAgYGZpbHRlclNpemVgIGlzIGEgc2luZ2xlIG51bWJlciwgdGhlbiBgZmlsdGVySGVpZ2h0ID09IGZpbHRlcldpZHRoYC5cbiAqIEBwYXJhbSBwb29saW5nVHlwZSBUaGUgdHlwZSBvZiBwb29saW5nLCBlaXRoZXIgJ21heCcgb3IgJ2F2ZycuXG4gKiBAcGFyYW0gcGFkIFRoZSB0eXBlIG9mIHBhZGRpbmcgYWxnb3JpdGhtOlxuICogICAgLSBgc2FtZWAgYW5kIHN0cmlkZSAxOiBvdXRwdXQgd2lsbCBiZSBvZiBzYW1lIHNpemUgYXMgaW5wdXQsXG4gKiAgICAgICByZWdhcmRsZXNzIG9mIGZpbHRlciBzaXplLlxuICogICAgLSBgdmFsaWRgOiBvdXRwdXQgd2lsbCBiZSBzbWFsbGVyIHRoYW4gaW5wdXQgaWYgZmlsdGVyIGlzIGxhcmdlclxuICogICAgICAgdGhhbiAxeDEuXG4gKiAgICAtIEZvciBtb3JlIGluZm8sIHNlZSB0aGlzIGd1aWRlOlxuICogICAgIFtodHRwczovL3d3dy50ZW5zb3JmbG93Lm9yZy9hcGlfZ3VpZGVzL3B5dGhvbi9ubiNDb252b2x1dGlvbl0oXG4gKiAgICAgICAgIGh0dHBzOi8vd3d3LnRlbnNvcmZsb3cub3JnL2FwaV9ndWlkZXMvcHl0aG9uL25uI0NvbnZvbHV0aW9uKVxuICogQHBhcmFtIGRpbGF0aW9ucyBUaGUgZGlsYXRpb24gcmF0ZXM6IGBbZGlsYXRpb25IZWlnaHQsIGRpbGF0aW9uV2lkdGhdYFxuICogICAgIGluIHdoaWNoIHdlIHNhbXBsZSBpbnB1dCB2YWx1ZXMgYWNyb3NzIHRoZSBoZWlnaHQgYW5kIHdpZHRoIGRpbWVuc2lvbnNcbiAqICAgICBpbiBkaWxhdGVkIHBvb2xpbmcuIERlZmF1bHRzIHRvIGBbMSwgMV1gLiBJZiBgZGlsYXRpb25SYXRlYCBpcyBhIHNpbmdsZVxuICogICAgIG51bWJlciwgdGhlbiBgZGlsYXRpb25IZWlnaHQgPT0gZGlsYXRpb25XaWR0aGAuIElmIGl0IGlzIGdyZWF0ZXIgdGhhblxuICogICAgIDEsIHRoZW4gYWxsIHZhbHVlcyBvZiBgc3RyaWRlc2AgbXVzdCBiZSAxLlxuICogQHBhcmFtIHN0cmlkZXMgVGhlIHN0cmlkZXMgb2YgdGhlIHBvb2xpbmc6IGBbc3RyaWRlSGVpZ2h0LCBzdHJpZGVXaWR0aF1gLiBJZlxuICogICAgIGBzdHJpZGVzYCBpcyBhIHNpbmdsZSBudW1iZXIsIHRoZW4gYHN0cmlkZUhlaWdodCA9PSBzdHJpZGVXaWR0aGAuXG4gKiBAcGFyYW0gZGltUm91bmRpbmdNb2RlIEEgc3RyaW5nIGZyb206ICdjZWlsJywgJ3JvdW5kJywgJ2Zsb29yJy4gSWYgbm9uZSBpc1xuICogICAgIHByb3ZpZGVkLCBpdCB3aWxsIGRlZmF1bHQgdG8gdHJ1bmNhdGUuXG4gKlxuICogQGRvYyB7aGVhZGluZzogJ09wZXJhdGlvbnMnLCBzdWJoZWFkaW5nOiAnQ29udm9sdXRpb24nfVxuICovXG5mdW5jdGlvbiBwb29sXzxUIGV4dGVuZHMgVGVuc29yM0R8VGVuc29yNEQ+KFxuICAgIGlucHV0OiBUfFRlbnNvckxpa2UsIHdpbmRvd1NoYXBlOiBbbnVtYmVyLCBudW1iZXJdfG51bWJlcixcbiAgICBwb29saW5nVHlwZTogJ2F2Zyd8J21heCcsXG4gICAgcGFkOiAndmFsaWQnfCdzYW1lJ3xudW1iZXJ8Y29udl91dGlsLkV4cGxpY2l0UGFkZGluZyxcbiAgICBkaWxhdGlvbnM/OiBbbnVtYmVyLCBudW1iZXJdfG51bWJlciwgc3RyaWRlcz86IFtudW1iZXIsIG51bWJlcl18bnVtYmVyLFxuICAgIGRpbVJvdW5kaW5nTW9kZT86ICdmbG9vcid8J3JvdW5kJ3wnY2VpbCcpIHtcbiAgaWYgKGRpbGF0aW9ucyA9PSBudWxsKSB7XG4gICAgZGlsYXRpb25zID0gWzEsIDFdO1xuICB9XG4gIGlmIChzdHJpZGVzID09IG51bGwpIHtcbiAgICBzdHJpZGVzID0gMTtcbiAgfVxuICBpZiAocGFkID09PSAwKSB7XG4gICAgcGFkID0gJ3ZhbGlkJztcbiAgfVxuXG4gIGNvbnN0ICR4ID0gY29udmVydFRvVGVuc29yKGlucHV0LCAneCcsICdtYXhQb29sJyk7XG4gIGxldCB4NEQgPSAkeCBhcyBUZW5zb3I0RDtcbiAgbGV0IHJlc2hhcGVkVG80RCA9IGZhbHNlO1xuXG4gIGlmICgkeC5yYW5rID09PSAzKSB7XG4gICAgcmVzaGFwZWRUbzREID0gdHJ1ZTtcbiAgICB4NEQgPSByZXNoYXBlKCR4LCBbMSwgJHguc2hhcGVbMF0sICR4LnNoYXBlWzFdLCAkeC5zaGFwZVsyXV0pO1xuICB9XG5cbiAgdXRpbC5hc3NlcnQoXG4gICAgICBjb252X3V0aWwuZWl0aGVyU3RyaWRlc09yRGlsYXRpb25zQXJlT25lKHN0cmlkZXMsIGRpbGF0aW9ucyksXG4gICAgICAoKSA9PiAnRXJyb3IgaW4gcG9vbDogRWl0aGVyIHN0cmlkZXMgb3IgZGlsYXRpb25zIG11c3QgYmUgMS4gJyArXG4gICAgICAgICAgYEdvdCBzdHJpZGVzICR7c3RyaWRlc30gYW5kIGRpbGF0aW9ucyAnJHtkaWxhdGlvbnN9J2ApO1xuXG4gIGNvbnN0IGNvbnZJbmZvID0gY29udl91dGlsLmNvbXB1dGVQb29sMkRJbmZvKFxuICAgICAgeDRELnNoYXBlLCB3aW5kb3dTaGFwZSwgc3RyaWRlcywgZGlsYXRpb25zLCBwYWQpO1xuICBjb25zdCBkaWxhdGlvbjogW251bWJlciwgbnVtYmVyXSA9XG4gICAgICBbY29udkluZm8uZGlsYXRpb25IZWlnaHQsIGNvbnZJbmZvLmRpbGF0aW9uV2lkdGhdO1xuXG4gIC8vIFRoZSBmb2xsb3dpbmcgaW1wbGVtZW50YXRpb24gZG9lcyBiYXRjaFRvU3BhY2UocG9vbChzcGFjZVRvQmF0Y2goeCkpKVxuICAvLyB3aGVuZXZlciBkaWxhdGlvbiA+IDEgc2luY2UgdGhlIFRGIGtlcm5lbHMgZG8gbm90IHN1cHBvcnQgZGlsYXRpb24gPiAxLlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RlbnNvcmZsb3cvYmxvYi81MGY2YmI2N2RjOThjOWI3NDYzMGI2MDQ3YWFlN2E0ZjhhNDBmZDAyL3RlbnNvcmZsb3cvcHl0aG9uL29wcy9ubl9vcHMucHkjTDEwMzdcblxuICBsZXQgYmFzZVBhZGRpbmc6IG51bWJlcltdW107XG4gIGlmIChwYWQgPT09ICdzYW1lJykge1xuICAgIGJhc2VQYWRkaW5nID0gd2l0aFNwYWNlVG9CYXRjaEJhc2VQYWRkaW5ncyhcbiAgICAgICAgW2NvbnZJbmZvLmZpbHRlckhlaWdodCwgY29udkluZm8uZmlsdGVyV2lkdGhdLCBkaWxhdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgYmFzZVBhZGRpbmcgPSBbWzAsIDBdLCBbMCwgMF1dO1xuICB9XG5cbiAgY29uc3QgaXNEaWxhdGlvbk9uZSA9IGRpbGF0aW9uWzBdID09PSAxICYmIGRpbGF0aW9uWzFdID09PSAxO1xuICBjb25zdCBbYWRqdXN0ZWRQYWRkaW5nLCBhZGp1c3RlZENyb3BzXSA9IHJlcXVpcmVkU3BhY2VUb0JhdGNoUGFkZGluZ3MoXG4gICAgICBbY29udkluZm8uaW5IZWlnaHQsIGNvbnZJbmZvLmluV2lkdGhdLCBkaWxhdGlvbiwgYmFzZVBhZGRpbmcpO1xuICBjb25zdCBjb252ZXJ0ZWRQYWQgPSBpc0RpbGF0aW9uT25lID8gcGFkIDogJ3ZhbGlkJztcbiAgY29uc3QgY29udmVydGVkWCA9XG4gICAgICBpc0RpbGF0aW9uT25lID8geDREIDogc3BhY2VUb0JhdGNoTkQoeDRELCBkaWxhdGlvbiwgYWRqdXN0ZWRQYWRkaW5nKTtcblxuICBjb25zdCBmb3J3YXJkT3AgPSBwb29saW5nVHlwZSA9PT0gJ2F2ZycgP1xuICAgICAgKCkgPT4gYXZnUG9vbChjb252ZXJ0ZWRYLCB3aW5kb3dTaGFwZSwgc3RyaWRlcywgY29udmVydGVkUGFkLFxuICAgICAgICAgICAgICAgICAgICBkaW1Sb3VuZGluZ01vZGUpIDpcbiAgICAgICgpID0+IG1heFBvb2woY29udmVydGVkWCwgd2luZG93U2hhcGUsIHN0cmlkZXMsIGNvbnZlcnRlZFBhZCxcbiAgICAgICAgICAgICAgICAgICAgZGltUm91bmRpbmdNb2RlKTtcbiAgY29uc3QgeSA9IGZvcndhcmRPcCgpO1xuXG4gIGNvbnN0IHJlcyA9IGlzRGlsYXRpb25PbmUgPyB5IDogYmF0Y2hUb1NwYWNlTkQoeSwgZGlsYXRpb24sIGFkanVzdGVkQ3JvcHMpO1xuXG4gIGlmIChyZXNoYXBlZFRvNEQpIHtcbiAgICByZXR1cm4gcmVzaGFwZShyZXMsIFtyZXMuc2hhcGVbMV0sIHJlcy5zaGFwZVsyXSwgcmVzLnNoYXBlWzNdXSkgYXMgVDtcbiAgfVxuXG4gIHJldHVybiByZXMgYXMgVDtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbXB1dGUgY3JvcHMgYW5kIHBhZGRpbmdzIGZvciBwb29sIHdpdGggZGlsYXRpb24gPiAxLlxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RlbnNvcmZsb3cvdGVuc29yZmxvdy9ibG9iLzUwZjZiYjY3ZGM5OGM5Yjc0NjMwYjYwNDdhYWU3YTRmOGE0MGZkMDIvdGVuc29yZmxvdy9weXRob24vb3BzL2FycmF5X29wcy5weSNMMjE4NFxuZnVuY3Rpb24gcmVxdWlyZWRTcGFjZVRvQmF0Y2hQYWRkaW5ncyhcbiAgICBpbnB1dFNoYXBlOiBbbnVtYmVyLCBudW1iZXJdLCBibG9ja1NoYXBlOiBbbnVtYmVyLCBudW1iZXJdLFxuICAgIGJhc2VQYWRkaW5nOiBudW1iZXJbXVtdKSB7XG4gIGNvbnN0IHBhZFN0YXJ0ID0gYmFzZVBhZGRpbmcubWFwKGIgPT4gYlswXSk7XG4gIGNvbnN0IG9yaWdQYWRFbmQgPSBiYXNlUGFkZGluZy5tYXAoYiA9PiBiWzFdKTtcbiAgY29uc3QgZnVsbElucHV0U2hhcGUgPSBpbnB1dFNoYXBlLmNvbmNhdChwYWRTdGFydCwgb3JpZ1BhZEVuZCk7XG4gIGNvbnN0IHBhZEVuZEV4dHJhID0gYmxvY2tTaGFwZS5tYXAoKGIsIGkpID0+IChiIC0gZnVsbElucHV0U2hhcGVbaV0gJSBiKSAlIGIpO1xuICBjb25zdCBwYWRFbmQgPSBvcmlnUGFkRW5kLm1hcCgocywgaSkgPT4gcyArIHBhZEVuZEV4dHJhW2ldKTtcbiAgY29uc3QgcGFkZGluZ3MgPSBibG9ja1NoYXBlLm1hcCgoXywgaSkgPT4gW3BhZFN0YXJ0W2ldLCBwYWRFbmRbaV1dKTtcbiAgY29uc3QgY3JvcHMgPSBibG9ja1NoYXBlLm1hcCgoXywgaSkgPT4gWzAsIHBhZEVuZEV4dHJhW2ldXSk7XG4gIHJldHVybiBbcGFkZGluZ3MsIGNyb3BzXTtcbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbXB1dGUgYmFzZSBwYWRkaW5ncyBmb3IgcG9vbCB3aXRoIGRpbGF0aW9uID4gMS5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90ZW5zb3JmbG93L3RlbnNvcmZsb3cvYmxvYi81MGY2YmI2N2RjOThjOWI3NDYzMGI2MDQ3YWFlN2E0ZjhhNDBmZDAyL3RlbnNvcmZsb3cvcHl0aG9uL29wcy9ubl9vcHMucHkjTDUyNFxuZnVuY3Rpb24gd2l0aFNwYWNlVG9CYXRjaEJhc2VQYWRkaW5ncyhcbiAgICBmaWx0ZXJTaGFwZTogW251bWJlciwgbnVtYmVyXSwgZGlsYXRpb246IFtudW1iZXIsIG51bWJlcl0pIHtcbiAgLy8gU3BhdGlhbCBkaW1lbnNpb25zIG9mIHRoZSBmaWx0ZXJzIGFuZCB0aGUgdXBzYW1wbGVkIGZpbHRlcnMgaW4gd2hpY2ggd2VcbiAgLy8gaW50cm9kdWNlIChyYXRlIC0gMSkgemVyb3MgYmV0d2VlbiBjb25zZWN1dGl2ZSBmaWx0ZXIgdmFsdWVzLlxuICBjb25zdCBkaWxhdGVkRmlsdGVyU2hhcGUgPSBmaWx0ZXJTaGFwZS5tYXAoKHMsIGkpID0+IHtcbiAgICByZXR1cm4gcyArIChzIC0gMSkgKiAoZGlsYXRpb25baV0gLSAxKTtcbiAgfSk7XG4gIGNvbnN0IHBhZEV4dHJhU2hhcGUgPSBkaWxhdGVkRmlsdGVyU2hhcGUubWFwKHMgPT4gcyAtIDEpO1xuXG4gIC8vIFdoZW4gcGFkZGluZyBpcyBvZGQsIHdlIHBhZCBtb3JlIGF0IGVuZCwgZm9sbG93aW5nIHRoZSBzYW1lXG4gIC8vIGNvbnZlbnRpb24gYXMgY29udjJkLlxuICBjb25zdCBwYWRFeHRyYVN0YXJ0ID0gcGFkRXh0cmFTaGFwZS5tYXAocyA9PiBNYXRoLmZsb29yKHMgLyAyKSk7XG4gIGNvbnN0IHBhZEV4dHJhRW5kID0gcGFkRXh0cmFTaGFwZS5tYXAoKHMsIGkpID0+IHMgLSBwYWRFeHRyYVN0YXJ0W2ldKTtcbiAgcmV0dXJuIHBhZEV4dHJhU2hhcGUubWFwKChfLCBpKSA9PiB7XG4gICAgcmV0dXJuIFtwYWRFeHRyYVN0YXJ0W2ldLCBwYWRFeHRyYUVuZFtpXV07XG4gIH0pO1xufVxuXG5leHBvcnQgY29uc3QgcG9vbCA9IG9wKHtwb29sX30pO1xuIl19