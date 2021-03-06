import { reshape } from './reshape';
export function xAs4D(x) {
    let x4D;
    if (x.rank === 0 || x.rank === 1) {
        x4D = reshape(x, [1, 1, 1, x.size]);
    }
    else if (x.rank === 2) {
        x4D = reshape(x, [1, 1, x.shape[0], x.shape[1]]);
    }
    else if (x.rank === 3) {
        x4D = reshape(x, [1, x.shape[0], x.shape[1], x.shape[2]]);
    }
    else {
        x4D = x;
    }
    return x4D;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hub3JtX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWNvcmUvc3JjL29wcy9iYXRjaG5vcm1fdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrQkEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxNQUFNLFVBQVUsS0FBSyxDQUFpQixDQUFZO0lBQ2hELElBQUksR0FBYSxDQUFDO0lBQ2xCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDaEMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNyQztTQUFNLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDdkIsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEQ7U0FBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1FBQ3ZCLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMzRDtTQUFNO1FBQ0wsR0FBRyxHQUFHLENBQWEsQ0FBQztLQUNyQjtJQUVELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKi9cbmltcG9ydCB7VGVuc29yLCBUZW5zb3I0RH0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7UmFua30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtyZXNoYXBlfSBmcm9tICcuL3Jlc2hhcGUnO1xuXG5leHBvcnQgZnVuY3Rpb24geEFzNEQ8UiBleHRlbmRzIFJhbms+KHg6IFRlbnNvcjxSPikge1xuICBsZXQgeDREOiBUZW5zb3I0RDtcbiAgaWYgKHgucmFuayA9PT0gMCB8fCB4LnJhbmsgPT09IDEpIHtcbiAgICB4NEQgPSByZXNoYXBlKHgsIFsxLCAxLCAxLCB4LnNpemVdKTtcbiAgfSBlbHNlIGlmICh4LnJhbmsgPT09IDIpIHtcbiAgICB4NEQgPSByZXNoYXBlKHgsIFsxLCAxLCB4LnNoYXBlWzBdLCB4LnNoYXBlWzFdXSk7XG4gIH0gZWxzZSBpZiAoeC5yYW5rID09PSAzKSB7XG4gICAgeDREID0gcmVzaGFwZSh4LCBbMSwgeC5zaGFwZVswXSwgeC5zaGFwZVsxXSwgeC5zaGFwZVsyXV0pO1xuICB9IGVsc2Uge1xuICAgIHg0RCA9IHggYXMgVGVuc29yNEQ7XG4gIH1cblxuICByZXR1cm4geDREO1xufVxuIl19