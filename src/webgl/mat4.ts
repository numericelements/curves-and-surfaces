

//http://glmatrix.net/docs/mat4.js.html


export function identity_mat4() {
    let result = new Float32Array(16)
    result[0] = 1
    result[5] = 1
    result[10] = 1
    result[15] = 1
    return result
}

export function fromQuat(quaternion: Float32Array) {
    let result = new Float32Array(16)
    let x = quaternion[0], y = quaternion[1], z = quaternion[2], w = quaternion[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    result[0] = 1 - yy - zz;
    result[1] = yx + wz;
    result[2] = zx - wy;
    result[3] = 0;
    result[4] = yx - wz;
    result[5] = 1 - xx - zz;
    result[6] = zy + wx;
    result[7] = 0;
    result[8] = zx + wy;
    result[9] = zy - wx;
    result[10] = 1 - xx - yy;
    result[11] = 0;
    result[12] = 0;
    result[13] = 0;
    result[14] = 0;
    result[15] = 1;
    return result;
}

function hypot(...args: number[]) {
    var y = 0, i = args.length;
    while (i--) y += args[i] * args[i];
    return Math.sqrt(y);
}

export function lookAt(eye: Float32Array, center: Float32Array, up: Float32Array) {
    let result = new Float32Array(16)
    const EPSILON = 0.000001
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len
    let eyex = eye[0]
    let eyey = eye[1]
    let eyez = eye[2]
    let upx = up[0]
    let upy = up[1]
    let upz = up[2]
    let centerx = center[0]
    let centery = center[1]
    let centerz = center[2]
    if (Math.abs(eyex - centerx) < EPSILON &&
        Math.abs(eyey - centery) < EPSILON &&
        Math.abs(eyez - centerz) < EPSILON) {
        return identity_mat4();
    }
    z0 = eyex - centerx
    z1 = eyey - centery
    z2 = eyez - centerz
    len = 1 / hypot(z0, z1, z2)
    z0 *= len
    z1 *= len
    z2 *= len
    x0 = upy * z2 - upz * z1
    x1 = upz * z0 - upx * z2
    x2 = upx * z1 - upy * z0
    len = hypot(x0, x1, x2)
    if (!len) {
        x0 = 0
        x1 = 0
        x2 = 0
    } else {
        len = 1 / len
        x0 *= len
        x1 *= len
        x2 *= len
    }
    y0 = z1 * x2 - z2 * x1
    y1 = z2 * x0 - z0 * x2
    y2 = z0 * x1 - z1 * x0
    len = hypot(y0, y1, y2)
    if (!len) {
        y0 = 0
        y1 = 0
        y2 = 0
    } else {
        len = 1 / len
        y0 *= len
        y1 *= len
        y2 *= len
    }
    result[0] = x0
    result[1] = y0
    result[2] = z0
    result[3] = 0
    result[4] = x1
    result[5] = y1
    result[6] = z1
    result[7] = 0
    result[8] = x2
    result[9] = y2
    result[10] = z2
    result[11] = 0
    result[12] = -(x0 * eyex + x1 * eyey + x2 * eyez)
    result[13] = -(y0 * eyex + y1 * eyey + y2 * eyez)
    result[14] = -(z0 * eyex + z1 * eyey + z2 * eyez)
    result[15] = 1
    return result
}

/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param fovy Vertical field of view in radians
 * @param aspect Aspect ratio. typically viewport width/height
 * @param  near Near bound of the frustum
 * @param  far Far bound of the frustum, can be null or Infinity
 * @returns projection matrix
 */

export function perspective(fovy: number, aspect: number, near: number, far: number) {
    let f = 1.0 / Math.tan(fovy / 2), nf;
    let result = new Float32Array(16)
    result[0] = f / aspect;
    result[1] = 0;
    result[2] = 0;
    result[3] = 0;
    result[4] = 0;
    result[5] = f;
    result[6] = 0;
    result[7] = 0;
    result[8] = 0;
    result[9] = 0;
    result[11] = -1;
    result[12] = 0;
    result[13] = 0;
    result[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      result[10] = (far + near) * nf;
      result[14] = (2 * far * near) * nf;
    } else {
      result[10] = -1;
      result[14] = -2 * near;
    }
    return result;
  }


  /**
 * Multiplies two mat4s
 *
 * @param  a the first operand
 * @param  b the second operand
 * @returns matrix
 */
export function multiply(a: Float32Array, b: Float32Array) {
    let result = new Float32Array(16)
    let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3]
    let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]
    let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]
    let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15]
    // Cache only the current line of the second matrix
    let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
    result[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30
    result[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31
    result[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32
    result[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33
    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7]
    result[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30
    result[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31
    result[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32
    result[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33
    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11]
    result[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30
    result[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31
    result[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32
    result[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33
    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15]
    result[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30
    result[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31
    result[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32
    result[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33
    return result
  }


/**
 * Translate a mat4 by the given vector
 *
 * @param a the matrix to translate
 * @param v vector to translate by
 * @returns matrix
 */
export function translate(a: Float32Array, v: Float32Array) {
    let result = new Float32Array(16)
    const x = v[0], y = v[1], z = v[2];
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3]
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]
    result[0] = a00; result[1] = a01; result[2] = a02; result[3] = a03;
    result[4] = a10; result[5] = a11; result[6] = a12; result[7] = a13;
    result[8] = a20; result[9] = a21; result[10] = a22; result[11] = a23;
    result[12] = a00 * x + a10 * y + a20 * z + a[12];
    result[13] = a01 * x + a11 * y + a21 * z + a[13];
    result[14] = a02 * x + a12 * y + a22 * z + a[14];
    result[15] = a03 * x + a13 * y + a23 * z + a[15];
    return result;
  }


  /**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param  left Left bound of the frustum
 * @param  right Right bound of the frustum
 * @param  bottom Bottom bound of the frustum
 * @param  top Top bound of the frustum
 * @param  near Near bound of the frustum
 * @param far Far bound of the frustum
 * @return result mat4 frustum matrix 
 */
export function ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    let result = new Float32Array(16)
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    result[0] = -2 * lr;
    result[1] = 0;
    result[2] = 0;
    result[3] = 0;
    result[4] = 0;
    result[5] = -2 * bt;
    result[6] = 0;
    result[7] = 0;
    result[8] = 0;
    result[9] = 0;
    result[10] = 2 * nf;
    result[11] = 0;
    result[12] = (left + right) * lr;
    result[13] = (top + bottom) * bt;
    result[14] = (far + near) * nf;
    result[15] = 1;
    return result;
  }

  /**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param x, y the vector to transform
 * @param  m matrix to transform with
 * @returns newX, newY
 */
export function mat4_times_vec2(m: Float32Array , x: number, y: number) {
    
    const newX = m[0] * x + m[4] * y + m[12];
    const newY = m[1] * x + m[5] * y + m[13];
    return {x: newX, y: newY};
  }