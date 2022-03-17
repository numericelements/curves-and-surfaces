//http://glmatrix.net/docs/mat4.js.html


/**
 * Copies the upper-left 3x3 values into a mat3.
 *
 * @param a   the source 4x4 matrix
 * @returns  3x3 matrix
 */
 export function mat4_to_mat3(a: Float32Array) {
    let result = new Float32Array(9)
    result[0] = a[0];
    result[1] = a[1];
    result[2] = a[2];
    result[3] = a[4];
    result[4] = a[5];
    result[5] = a[6];
    result[6] = a[8];
    result[7] = a[9];
    result[8] = a[10];
    return result;
  }