import { computeStrides, sizeFromShape } from '../util';
/**
 * Check whether updates.shape = indices.shape[:batchDim] +
 * shape[sliceDim:]
 *
 * @param x The input tensor.
 */
export function validateUpdateShape(shape, indices, updates) {
    const sliceDim = (indices.rank > 1) ? indices.shape[indices.rank - 1] : 1;
    const batchDim = (indices.rank > 1) ? indices.rank - 1 : 1;
    const shapeError = 'Must have updates.shape = indices.shape[:batchDim] + ' +
        `shape[sliceDim:], got updates.shape: ${updates.shape}` +
        `, indices.shape: ${indices.shape}, shape: ${shape}` +
        `, sliceDim: ${sliceDim}, and batchDim: ${batchDim}.`;
    if (updates.rank < batchDim) {
        throw new Error(shapeError + ` update.rank < ${batchDim}. `);
    }
    if (shape.length < sliceDim + (updates.rank - batchDim)) {
        throw new Error(shapeError +
            ` Output shape length < ${sliceDim + (updates.rank - batchDim)}`);
    }
    if (updates.rank !== batchDim + shape.length - sliceDim) {
        throw new Error(shapeError + ` update.rank != ${batchDim + shape.length - sliceDim}`);
    }
    for (let d = 0; d < batchDim; ++d) {
        if (updates.shape[d] !== indices.shape[d]) {
            throw new Error(shapeError +
                ` updates.shape[${d}] (${updates.shape[d]}) != indices.shape[${d}] (${indices.shape[d]}).`);
        }
    }
    for (let d = 0; d < updates.rank - batchDim; ++d) {
        if (updates.shape[d + batchDim] !== shape[d + sliceDim]) {
            throw new Error(shapeError +
                ` updates.shape[${d + batchDim}] (${updates.shape[d + batchDim]}) != shape[${d + batchDim}] (${shape[d + batchDim]})`);
        }
    }
}
/**
 * Validate scatter nd inputs.
 *
 * @param update The tensor contains the update values.
 * @param indices The tensor contains the indices for the update values.
 * @param shape The shape of the output tensor.
 */
export function validateInput(updates, indices, shape) {
    if (indices.rank < 1) {
        throw new Error('tf.scatterND() expects the indices to be rank 1 or higher,' +
            ` but the rank was ${indices.rank}.`);
    }
    if (updates.rank < 1) {
        throw new Error('tf.scatterND() expects the updates to be rank 1 or higher,' +
            ` but the rank was ${updates.rank}.`);
    }
    if (indices.dtype !== 'int32') {
        throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${indices.dtype}`);
    }
    if (shape.length < 1) {
        throw new Error(`Output rank must be greater or equal to 1, but got shape: ${shape}`);
    }
    if (shape.length === 0) {
        if (indices.size === 0) {
            throw new Error(`Indices specified for empty output. indices shape: ${indices.shape}`);
        }
        if (updates.size === 0) {
            throw new Error(`Updates specified for empty output. updates shape: ${updates.shape}`);
        }
    }
    validateUpdateShape(shape, indices, updates);
}
/**
 * Calculate the shape information for the output.
 *
 * @param update The tensor contains the update values.
 * @param indices The tensor contains the indices for the update values.
 * @param shape The shape of the output tensor.
 *
 * @returns ScatterShapeInfo
 */
export function calculateShapes(updates, indices, shape) {
    // Calculate the number of dimensions in indices
    const indicesRank = indices.shape.length;
    const sliceRank = (indicesRank > 1) ? indices.shape[indicesRank - 1] : 1;
    // Calculate the number of elements that make up each slice of our updated
    // tensor. This allows us to work with flattened tensors and copy over whole
    // slices at a time.
    const totalNd = shape.length;
    let sliceSize = 1;
    for (let i = sliceRank; i < totalNd; ++i) {
        sliceSize *= shape[i];
    }
    const safeSliceDim = (sliceRank < 1) ? 1 : sliceRank;
    const numUpdates = sizeFromShape(indices.shape) / safeSliceDim;
    const strides = [...computeStrides(shape.slice(0, sliceRank)), 1];
    const outputSize = sizeFromShape(shape);
    return { sliceRank, numUpdates, sliceSize, strides, outputSize };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhdHRlcl9uZF91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vdGZqcy1jb3JlL3NyYy9vcHMvc2NhdHRlcl9uZF91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWtCQSxPQUFPLEVBQUMsY0FBYyxFQUFFLGFBQWEsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUV0RDs7Ozs7R0FLRztBQUNILE1BQU0sVUFBVSxtQkFBbUIsQ0FDL0IsS0FBZSxFQUFFLE9BQWUsRUFBRSxPQUFlO0lBQ25ELE1BQU0sUUFBUSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUUsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTNELE1BQU0sVUFBVSxHQUFHLHVEQUF1RDtRQUN0RSx3Q0FBd0MsT0FBTyxDQUFDLEtBQUssRUFBRTtRQUN2RCxvQkFBb0IsT0FBTyxDQUFDLEtBQUssWUFBWSxLQUFLLEVBQUU7UUFDcEQsZUFBZSxRQUFRLG1CQUFtQixRQUFRLEdBQUcsQ0FBQztJQUUxRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEdBQUcsUUFBUSxFQUFFO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsVUFBVSxHQUFHLGtCQUFrQixRQUFRLElBQUksQ0FBQyxDQUFDO0tBQzlEO0lBQ0QsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLFFBQVEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLEVBQUU7UUFDdkQsTUFBTSxJQUFJLEtBQUssQ0FDWCxVQUFVO1lB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cmlnaHQgMjAxOCBHb29nbGUgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5pbXBvcnQge1RlbnNvckluZm99IGZyb20gJy4uL2tlcm5lbF9yZWdpc3RyeSc7XG5pbXBvcnQge1RlbnNvcn0gZnJvbSAnLi4vdGVuc29yJztcbmltcG9ydCB7Y29tcHV0ZVN0cmlkZXMsIHNpemVGcm9tU2hhcGV9IGZyb20gJy4uL3V0aWwnO1xuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdXBkYXRlcy5zaGFwZSA9IGluZGljZXMuc2hhcGVbOmJhdGNoRGltXSArXG4gKiBzaGFwZVtzbGljZURpbTpdXG4gKlxuICogQHBhcmFtIHggVGhlIGlucHV0IHRlbnNvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlVXBkYXRlU2hhcGUoXG4gICAgc2hhcGU6IG51bWJlcltdLCBpbmRpY2VzOiBUZW5zb3IsIHVwZGF0ZXM6IFRlbnNvcikge1xuICBjb25zdCBzbGljZURpbSA9IChpbmRpY2VzLnJhbmsgPiAxKSA/IGluZGljZXMuc2hhcGVbaW5kaWNlcy5yYW5rIC0gMV0gOiAxO1xuICBjb25zdCBiYXRjaERpbSA9IChpbmRpY2VzLnJhbmsgPiAxKSA/IGluZGljZXMucmFuayAtIDEgOiAxO1xuXG4gIGNvbnN0IHNoYXBlRXJyb3IgPSAnTXVzdCBoYXZlIHVwZGF0ZXMuc2hhcGUgPSBpbmRpY2VzLnNoYXBlWzpiYXRjaERpbV0gKyAnICtcbiAgICAgIGBzaGFwZVtzbGljZURpbTpdLCBnb3QgdXBkYXRlcy5zaGFwZTogJHt1cGRhdGVzLnNoYXBlfWAgK1xuICAgICAgYCwgaW5kaWNlcy5zaGFwZTogJHtpbmRpY2VzLnNoYXBlfSwgc2hhcGU6ICR7c2hhcGV9YCArXG4gICAgICBgLCBzbGljZURpbTogJHtzbGljZURpbX0sIGFuZCBiYXRjaERpbTogJHtiYXRjaERpbX0uYDtcblxuICBpZiAodXBkYXRlcy5yYW5rIDwgYmF0Y2hEaW0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Ioc2hhcGVFcnJvciArIGAgdXBkYXRlLnJhbmsgPCAke2JhdGNoRGltfS4gYCk7XG4gIH1cbiAgaWYgKHNoYXBlLmxlbmd0aCA8IHNsaWNlRGltICsgKHVwZGF0ZXMucmFuayAtIGJhdGNoRGltKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgc2hhcGVFcnJvciArXG4gICAgICAgIGAgT3V0cHV0IHNoYXBlIGxlbmd0aCA8ICR7c2xpY2VEaW0gKyAodXBkYXRlcy5yYW5rIC0gYmF0Y2hEaW0pfWApO1xuICB9XG4gIGlmICh1cGRhdGVzLnJhbmsgIT09IGJhdGNoRGltICsgc2hhcGUubGVuZ3RoIC0gc2xpY2VEaW0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIHNoYXBlRXJyb3IgKyBgIHVwZGF0ZS5yYW5rICE9ICR7YmF0Y2hEaW0gKyBzaGFwZS5sZW5ndGggLSBzbGljZURpbX1gKTtcbiAgfVxuICBmb3IgKGxldCBkID0gMDsgZCA8IGJhdGNoRGltOyArK2QpIHtcbiAgICBpZiAodXBkYXRlcy5zaGFwZVtkXSAhPT0gaW5kaWNlcy5zaGFwZVtkXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIHNoYXBlRXJyb3IgK1xuICAgICAgICAgIGAgdXBkYXRlcy5zaGFwZVske2R9XSAoJHt1cGRhdGVzLnNoYXBlW2RdfSkgIT0gaW5kaWNlcy5zaGFwZVske2R9XSAoJHtcbiAgICAgICAgICAgICAgaW5kaWNlcy5zaGFwZVtkXX0pLmApO1xuICAgIH1cbiAgfVxuICBmb3IgKGxldCBkID0gMDsgZCA8IHVwZGF0ZXMucmFuayAtIGJhdGNoRGltOyArK2QpIHtcbiAgICBpZiAodXBkYXRlcy5zaGFwZVtkICsgYmF0Y2hEaW1dICE9PSBzaGFwZVtkICsgc2xpY2VEaW1dKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgc2hhcGVFcnJvciArXG4gICAgICAgICAgYCB1cGRhdGVzLnNoYXBlWyR7ZCArIGJhdGNoRGltfV0gKCR7XG4gICAgICAgICAgICAgIHVwZGF0ZXMuc2hhcGVbZCArIGJhdGNoRGltXX0pICE9IHNoYXBlWyR7ZCArIGJhdGNoRGltfV0gKCR7XG4gICAgICAgICAgICAgIHNoYXBlW2QgKyBiYXRjaERpbV19KWApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjYXR0ZXJTaGFwZUluZm8ge1xuICBzbGljZVJhbms6IG51bWJlcjtcbiAgbnVtVXBkYXRlczogbnVtYmVyO1xuICBzbGljZVNpemU6IG51bWJlcjtcbiAgc3RyaWRlczogbnVtYmVyW107XG4gIG91dHB1dFNpemU6IG51bWJlcjtcbn1cbi8qKlxuICogVmFsaWRhdGUgc2NhdHRlciBuZCBpbnB1dHMuXG4gKlxuICogQHBhcmFtIHVwZGF0ZSBUaGUgdGVuc29yIGNvbnRhaW5zIHRoZSB1cGRhdGUgdmFsdWVzLlxuICogQHBhcmFtIGluZGljZXMgVGhlIHRlbnNvciBjb250YWlucyB0aGUgaW5kaWNlcyBmb3IgdGhlIHVwZGF0ZSB2YWx1ZXMuXG4gKiBAcGFyYW0gc2hhcGUgVGhlIHNoYXBlIG9mIHRoZSBvdXRwdXQgdGVuc29yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVJbnB1dChcbiAgICB1cGRhdGVzOiBUZW5zb3IsIGluZGljZXM6IFRlbnNvciwgc2hhcGU6IG51bWJlcltdKSB7XG4gIGlmIChpbmRpY2VzLnJhbmsgPCAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAndGYuc2NhdHRlck5EKCkgZXhwZWN0cyB0aGUgaW5kaWNlcyB0byBiZSByYW5rIDEgb3IgaGlnaGVyLCcgK1xuICAgICAgICBgIGJ1dCB0aGUgcmFuayB3YXMgJHtpbmRpY2VzLnJhbmt9LmApO1xuICB9XG4gIGlmICh1cGRhdGVzLnJhbmsgPCAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAndGYuc2NhdHRlck5EKCkgZXhwZWN0cyB0aGUgdXBkYXRlcyB0byBiZSByYW5rIDEgb3IgaGlnaGVyLCcgK1xuICAgICAgICBgIGJ1dCB0aGUgcmFuayB3YXMgJHt1cGRhdGVzLnJhbmt9LmApO1xuICB9XG4gIGlmIChpbmRpY2VzLmR0eXBlICE9PSAnaW50MzInKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZHR5cGUgb2YgJ2luZGljZXMnIHNob3VsZCBiZSBpbnQzMiwgYnV0IGdvdCBkdHlwZTogJHtcbiAgICAgICAgaW5kaWNlcy5kdHlwZX1gKTtcbiAgfVxuICBpZiAoc2hhcGUubGVuZ3RoIDwgMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYE91dHB1dCByYW5rIG11c3QgYmUgZ3JlYXRlciBvciBlcXVhbCB0byAxLCBidXQgZ290IHNoYXBlOiAke3NoYXBlfWApO1xuICB9XG5cbiAgaWYgKHNoYXBlLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpbmRpY2VzLnNpemUgPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW5kaWNlcyBzcGVjaWZpZWQgZm9yIGVtcHR5IG91dHB1dC4gaW5kaWNlcyBzaGFwZTogJHtcbiAgICAgICAgICBpbmRpY2VzLnNoYXBlfWApO1xuICAgIH1cbiAgICBpZiAodXBkYXRlcy5zaXplID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVwZGF0ZXMgc3BlY2lmaWVkIGZvciBlbXB0eSBvdXRwdXQuIHVwZGF0ZXMgc2hhcGU6ICR7XG4gICAgICAgICAgdXBkYXRlcy5zaGFwZX1gKTtcbiAgICB9XG4gIH1cblxuICB2YWxpZGF0ZVVwZGF0ZVNoYXBlKHNoYXBlLCBpbmRpY2VzLCB1cGRhdGVzKTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIHNoYXBlIGluZm9ybWF0aW9uIGZvciB0aGUgb3V0cHV0LlxuICpcbiAqIEBwYXJhbSB1cGRhdGUgVGhlIHRlbnNvciBjb250YWlucyB0aGUgdXBkYXRlIHZhbHVlcy5cbiAqIEBwYXJhbSBpbmRpY2VzIFRoZSB0ZW5zb3IgY29udGFpbnMgdGhlIGluZGljZXMgZm9yIHRoZSB1cGRhdGUgdmFsdWVzLlxuICogQHBhcmFtIHNoYXBlIFRoZSBzaGFwZSBvZiB0aGUgb3V0cHV0IHRlbnNvci5cbiAqXG4gKiBAcmV0dXJucyBTY2F0dGVyU2hhcGVJbmZvXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVTaGFwZXMoXG4gICAgdXBkYXRlczogVGVuc29ySW5mbywgaW5kaWNlczogVGVuc29ySW5mbyxcbiAgICBzaGFwZTogbnVtYmVyW10pOiBTY2F0dGVyU2hhcGVJbmZvIHtcbiAgLy8gQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2YgZGltZW5zaW9ucyBpbiBpbmRpY2VzXG4gIGNvbnN0IGluZGljZXNSYW5rID0gaW5kaWNlcy5zaGFwZS5sZW5ndGg7XG4gIGNvbnN0IHNsaWNlUmFuayA9IChpbmRpY2VzUmFuayA+IDEpID8gaW5kaWNlcy5zaGFwZVtpbmRpY2VzUmFuayAtIDFdIDogMTtcblxuICAvLyBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBlbGVtZW50cyB0aGF0IG1ha2UgdXAgZWFjaCBzbGljZSBvZiBvdXIgdXBkYXRlZFxuICAvLyB0ZW5zb3IuIFRoaXMgYWxsb3dzIHVzIHRvIHdvcmsgd2l0aCBmbGF0dGVuZWQgdGVuc29ycyBhbmQgY29weSBvdmVyIHdob2xlXG4gIC8vIHNsaWNlcyBhdCBhIHRpbWUuXG4gIGNvbnN0IHRvdGFsTmQgPSBzaGFwZS5sZW5ndGg7XG5cbiAgbGV0IHNsaWNlU2l6ZSA9IDE7XG4gIGZvciAobGV0IGkgPSBzbGljZVJhbms7IGkgPCB0b3RhbE5kOyArK2kpIHtcbiAgICBzbGljZVNpemUgKj0gc2hhcGVbaV07XG4gIH1cblxuICBjb25zdCBzYWZlU2xpY2VEaW0gPSAoc2xpY2VSYW5rIDwgMSkgPyAxIDogc2xpY2VSYW5rO1xuICBjb25zdCBudW1VcGRhdGVzID0gc2l6ZUZyb21TaGFwZShpbmRpY2VzLnNoYXBlKSAvIHNhZmVTbGljZURpbTtcblxuICBjb25zdCBzdHJpZGVzID0gWy4uLmNvbXB1dGVTdHJpZGVzKHNoYXBlLnNsaWNlKDAsIHNsaWNlUmFuaykpLCAxXTtcbiAgY29uc3Qgb3V0cHV0U2l6ZSA9IHNpemVGcm9tU2hhcGUoc2hhcGUpO1xuICByZXR1cm4ge3NsaWNlUmFuaywgbnVtVXBkYXRlcywgc2xpY2VTaXplLCBzdHJpZGVzLCBvdXRwdXRTaXplfTtcbn1cbiJdfQ==