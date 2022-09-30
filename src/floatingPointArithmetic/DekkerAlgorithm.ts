
export function split(x: number, s: number) {
    const c = Math.pow(2, s)
    const lambda = c * x
    const delta = x - lambda
    const x_h = lambda + delta
    const x_l = x - x_h
    return {h: x_h, l: x_l}
}

export function dekkerProduct(x: number, y: number) {
    const s = 27 // Math.ceil(53 / 2)
    const xs = split(x, s)
    const ys = split(y, s)
    const r1 = x * y
    const t1 = -r1 + xs.h * ys.h
    const t2 = t1 + xs.h * ys.l
    const t3 = t2 + xs.l * ys.h
    const r2 = t3 + xs.l * ys.l
    return {r1: r1, r2: r2}
}