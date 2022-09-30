
export function fast2Sum(a: number, b: number) {
    if (b > a) {
        const dum = a
        a = b
        b = dum
    }
    const s = a + b
    const z = s - a
    const t = b - z
    return {s: s, t: t}
}

export function twoSum(a: number, b: number) {
    const s = a + b
    const a_prime = s - b
    const b_prime = s - a_prime
    const delta_a = a - a_prime
    const delta_b = b - b_prime
    const t = delta_a + delta_b
    return {s: s, t: t}
}