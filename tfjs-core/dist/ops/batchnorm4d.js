import { convertToTensor } from '../tensor_util_env';
import * as util from '../util';
import { batchNorm } from './batchnorm';
import { op } from './operation';
/**
 * Batch normalization, strictly for 4D. For the more relaxed version, see
 * `tf.batchNorm`.
 *
 * @param x The input Tensor.
 * @param mean A mean Tensor.
 * @param variance A variance Tensor.
 * @param offset An offset Tensor.
 * @param scale A scale Tensor.
 * @param varianceEpsilon A small float number to avoid dividing by 0.
 */
function batchNorm4d_(x, mean, variance, offset, scale, varianceEpsilon) {
    const $x = convertToTensor(x, 'x', 'batchNorm');
    const $mean = convertToTensor(mean, 'mean', 'batchNorm');
    const $variance = convertToTensor(variance, 'variance', 'batchNorm');
    let $scale;
    if (scale != null) {
        $scale = convertToTensor(scale, 'scale', 'batchNorm');
    }
    let $offset;
    if (offset != null) {
        $offset = convertToTensor(offset, 'offset', 'batchNorm');
    }
    util.assert($x.rank === 4, () => `Error in batchNorm4D: x must be rank 4 but got rank ` +
        `${$x.rank}.`);
    util.assert($mean.rank === 4 || $mean.rank === 1, () => `Error in batchNorm4D: mean must be rank 4 or rank 1 but ` +
        `got rank ${$mean.rank}.`);
    util.assert($variance.rank === 4 || $variance.rank === 1, () => `Error in batchNorm4D: variance must be rank 4 or rank 1 ` +
        `but got rank ${$variance.rank}.`);
    if ($scale != null) {
        util.assert($scale.rank === 4 || $scale.rank === 1, () => `Error in batchNorm4D: scale must be rank 4 or rank 1 ` +
            `but got rank ${$scale.rank}.`);
    }
    if ($offset != null) {
        util.assert($offset.rank === 4 || $offset.rank === 1, () => `Error in batchNorm4D: offset must be rank 4 or rank 1 ` +
            `but got rank ${$offset.rank}.`);
    }
    return batchNorm($x, $mean, $variance, $offset, $scale, varianceEpsilon);
}
export const batchNorm4d = op({ batchNorm4d_ });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hub3JtNGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9iYXRjaG5vcm00ZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFpQkEsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE9BQU8sS0FBSyxJQUFJLE1BQU0sU0FBUyxDQUFDO0FBRWhDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdEMsT0FBTyxFQUFDLEVBQUUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUUvQjs7Ozs7Ozs7OztHQVVHO0FBQ0gsU0FBUyxZQUFZLENBQ2pCLENBQXNCLEVBQUUsSUFBa0MsRUFDMUQsUUFBc0MsRUFDdEMsTUFBcUMsRUFBRSxLQUFvQyxFQUMzRSxlQUF3QjtJQUMxQixNQUFNLEVBQUUsR0FBRyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNoRCxNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6RCxNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRSxJQUFJLE1BQXlCLENBQUM7SUFDOUIsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1FBQ2pCLE1BQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztLQUN2RDtJQUNELElBQUksT0FBMEIsQ0FBQztJQUMvQixJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7UUFDbEIsT0FBTyxHQUFHLGVBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBQzFEO0lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FDUCxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDYixHQUFHLEVBQUUsQ0FBQyxzREFBc0Q7UUFDeEQsR0FBRyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUN2QixJQUFJLENBQUMsTUFBTSxDQUNQLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUNwQyxHQUFHLEVBQUUsQ0FBQywwREFBMEQ7UUFDNUQsWUFBWSxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNuQyxJQUFJLENBQUMsTUFBTSxDQUNQLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUM1QyxHQUFHLEVBQUUsQ0FBQywwREFBMEQ7UUFDNUQsZ0JBQWdCLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUNQLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUN0QyxHQUFHLEVBQUUsQ0FBQyx1REFBdUQ7WUFDekQsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0tBQ3pDO0lBQ0QsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO1FBQ25CLElBQUksQ0FBQyxNQUFNLENBQ1AsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQ3hDLEdBQUcsRUFBRSxDQUFDLHdEQUF3RDtZQUMxRCxnQkFBZ0IsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7S0FDMUM7SUFDRCxPQUFPLFNBQVMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFFRCxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUMsWUFBWSxFQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7VGVuc29yMUQsIFRlbnNvcjREfSBmcm9tICcuLi90ZW5zb3InO1xuaW1wb3J0IHtjb252ZXJ0VG9UZW5zb3J9IGZyb20gJy4uL3RlbnNvcl91dGlsX2Vudic7XG5pbXBvcnQge1RlbnNvckxpa2V9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCc7XG5cbmltcG9ydCB7YmF0Y2hOb3JtfSBmcm9tICcuL2JhdGNobm9ybSc7XG5pbXBvcnQge29wfSBmcm9tICcuL29wZXJhdGlvbic7XG5cbi8qKlxuICogQmF0Y2ggbm9ybWFsaXphdGlvbiwgc3RyaWN0bHkgZm9yIDRELiBGb3IgdGhlIG1vcmUgcmVsYXhlZCB2ZXJzaW9uLCBzZWVcbiAqIGB0Zi5iYXRjaE5vcm1gLlxuICpcbiAqIEBwYXJhbSB4IFRoZSBpbnB1dCBUZW5zb3IuXG4gKiBAcGFyYW0gbWVhbiBBIG1lYW4gVGVuc29yLlxuICogQHBhcmFtIHZhcmlhbmNlIEEgdmFyaWFuY2UgVGVuc29yLlxuICogQHBhcmFtIG9mZnNldCBBbiBvZmZzZXQgVGVuc29yLlxuICogQHBhcmFtIHNjYWxlIEEgc2NhbGUgVGVuc29yLlxuICogQHBhcmFtIHZhcmlhbmNlRXBzaWxvbiBBIHNtYWxsIGZsb2F0IG51bWJlciB0byBhdm9pZCBkaXZpZGluZyBieSAwLlxuICovXG5mdW5jdGlvbiBiYXRjaE5vcm00ZF8oXG4gICAgeDogVGVuc29yNER8VGVuc29yTGlrZSwgbWVhbjogVGVuc29yNER8VGVuc29yMUR8VGVuc29yTGlrZSxcbiAgICB2YXJpYW5jZTogVGVuc29yNER8VGVuc29yMUR8VGVuc29yTGlrZSxcbiAgICBvZmZzZXQ/OiBUZW5zb3I0RHxUZW5zb3IxRHxUZW5zb3JMaWtlLCBzY2FsZT86IFRlbnNvcjREfFRlbnNvcjFEfFRlbnNvckxpa2UsXG4gICAgdmFyaWFuY2VFcHNpbG9uPzogbnVtYmVyKTogVGVuc29yNEQge1xuICBjb25zdCAkeCA9IGNvbnZlcnRUb1RlbnNvcih4LCAneCcsICdiYXRjaE5vcm0nKTtcbiAgY29uc3QgJG1lYW4gPSBjb252ZXJ0VG9UZW5zb3IobWVhbiwgJ21lYW4nLCAnYmF0Y2hOb3JtJyk7XG4gIGNvbnN0ICR2YXJpYW5jZSA9IGNvbnZlcnRUb1RlbnNvcih2YXJpYW5jZSwgJ3ZhcmlhbmNlJywgJ2JhdGNoTm9ybScpO1xuICBsZXQgJHNjYWxlOiBUZW5zb3I0RHxUZW5zb3IxRDtcbiAgaWYgKHNjYWxlICE9IG51bGwpIHtcbiAgICAkc2NhbGUgPSBjb252ZXJ0VG9UZW5zb3Ioc2NhbGUsICdzY2FsZScsICdiYXRjaE5vcm0nKTtcbiAgfVxuICBsZXQgJG9mZnNldDogVGVuc29yNER8VGVuc29yMUQ7XG4gIGlmIChvZmZzZXQgIT0gbnVsbCkge1xuICAgICRvZmZzZXQgPSBjb252ZXJ0VG9UZW5zb3Iob2Zmc2V0LCAnb2Zmc2V0JywgJ2JhdGNoTm9ybScpO1xuICB9XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHgucmFuayA9PT0gNCxcbiAgICAgICgpID0+IGBFcnJvciBpbiBiYXRjaE5vcm00RDogeCBtdXN0IGJlIHJhbmsgNCBidXQgZ290IHJhbmsgYCArXG4gICAgICAgICAgYCR7JHgucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJG1lYW4ucmFuayA9PT0gNCB8fCAkbWVhbi5yYW5rID09PSAxLFxuICAgICAgKCkgPT4gYEVycm9yIGluIGJhdGNoTm9ybTREOiBtZWFuIG11c3QgYmUgcmFuayA0IG9yIHJhbmsgMSBidXQgYCArXG4gICAgICAgICAgYGdvdCByYW5rICR7JG1lYW4ucmFua30uYCk7XG4gIHV0aWwuYXNzZXJ0KFxuICAgICAgJHZhcmlhbmNlLnJhbmsgPT09IDQgfHwgJHZhcmlhbmNlLnJhbmsgPT09IDEsXG4gICAgICAoKSA9PiBgRXJyb3IgaW4gYmF0Y2hOb3JtNEQ6IHZhcmlhbmNlIG11c3QgYmUgcmFuayA0IG9yIHJhbmsgMSBgICtcbiAgICAgICAgICBgYnV0IGdvdCByYW5rICR7JHZhcmlhbmNlLnJhbmt9LmApO1xuICBpZiAoJHNjYWxlICE9IG51bGwpIHtcbiAgICB1dGlsLmFzc2VydChcbiAgICAgICAgJHNjYWxlLnJhbmsgPT09IDQgfHwgJHNjYWxlLnJhbmsgPT09IDEsXG4gICAgICAgICgpID0+IGBFcnJvciBpbiBiYXRjaE5vcm00RDogc2NhbGUgbXVzdCBiZSByYW5rIDQgb3IgcmFuayAxIGAgK1xuICAgICAgICAgICAgYGJ1dCBnb3QgcmFuayAkeyRzY2FsZS5yYW5rfS5gKTtcbiAgfVxuICBpZiAoJG9mZnNldCAhPSBudWxsKSB7XG4gICAgdXRpbC5hc3NlcnQoXG4gICAgICAgICRvZmZzZXQucmFuayA9PT0gNCB8fCAkb2Zmc2V0LnJhbmsgPT09IDEsXG4gICAgICAgICgpID0+IGBFcnJvciBpbiBiYXRjaE5vcm00RDogb2Zmc2V0IG11c3QgYmUgcmFuayA0IG9yIHJhbmsgMSBgICtcbiAgICAgICAgICAgIGBidXQgZ290IHJhbmsgJHskb2Zmc2V0LnJhbmt9LmApO1xuICB9XG4gIHJldHVybiBiYXRjaE5vcm0oJHgsICRtZWFuLCAkdmFyaWFuY2UsICRvZmZzZXQsICRzY2FsZSwgdmFyaWFuY2VFcHNpbG9uKTtcbn1cblxuZXhwb3J0IGNvbnN0IGJhdGNoTm9ybTRkID0gb3Aoe2JhdGNoTm9ybTRkX30pO1xuIl19