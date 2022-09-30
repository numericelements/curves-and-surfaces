
export function malcolmAlgorithm() {
    let a = 1
    while ((a + 1) - a === 1) {
        a *= 2
    }
    let b = 1
    while ((a + b) - a !== b) {
        b += 1
    }
    return b
}

export function precision(radix: number) {
    let i = 0
    let a = 1
    while ((a + 1) - a === 1) {
        a = radix * a
        i += 1
    }
    return i
}

