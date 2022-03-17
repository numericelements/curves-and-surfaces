
//http://glmatrix.net/docs/quat.js.html


export function identity_quat() {
    let result = new Float32Array(4)
    result[3] = 1
    return result
}


/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param  axis the axis around which to rotate
 * @param  rad the angle in radians
 * @returns  result
 **/
export function setAxisAngle(axis: Float32Array, rad: number) {
    rad = rad * 0.5
    let s = Math.sin(rad)
    let result = new Float32Array([0, 0, 0, 0])
    result[0] = s * axis[0]
    result[1] = s * axis[1]
    result[2] = s * axis[2]
    result[3] = Math.cos(rad)
    return result

}

/**
 * Multiplies two quaternions
 *
 * @param  a the first quaternion operand
 * @param  b the second quaternion operand
 * @returns the resulting quaternion
 */
export function multiply_quats(a: Float32Array, b: Float32Array) {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3]
    let bx = b[0], by = b[1], bz = b[2], bw = b[3]
    let result = new Float32Array([0, 0, 0, 0])
    result[0] = ax * bw + aw * bx + ay * bz - az * by
    result[1] = ay * bw + aw * by + az * bx - ax * bz
    result[2] = az * bw + aw * bz + ax * by - ay * bx
    result[3] = aw * bw - ax * bx - ay * by - az * bz
    return result

}

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param Angle to rotate around X axis in degrees.
 * @param Angle to rotate around Y axis in degrees.
 * @param Angle to rotate around Z axis in degrees.
 */
export function fromEuler(x: number, y: number, z: number) {
    let result = new Float32Array([0, 0, 0, 0])
    let halfToRad = 0.5 * Math.PI / 180.0
    x *= halfToRad
    y *= halfToRad
    z *= halfToRad
    let sx = Math.sin(x)
    let cx = Math.cos(x)
    let sy = Math.sin(y)
    let cy = Math.cos(y)
    let sz = Math.sin(z)
    let cz = Math.cos(z)
    result[0] = sx * cy * cz - cx * sy * sz
    result[1] = cx * sy * cz + sx * cy * sz
    result[2] = cx * cy * sz - sx * sy * cz
    result[3] = cx * cy * cz + sx * sy * sz
    return result
}