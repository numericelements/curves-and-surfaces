

export function toFloat32Array(v : number[]) {
    let result = new Float32Array(v.length)
    for (let i = 0; i < v.length; i += 1) {
        result[i] = v[i]
    }
    return result
} 

export function toUint16Array(v : number[]) {
    let result = new Uint16Array(v.length)
    for (let i = 0; i < v.length; i += 1) {
        result[i] = v[i]
    }
    return result
} 