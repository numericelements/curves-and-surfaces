import { dekkerProduct } from "../../src/floatingPointArithmetic/DekkerAlgorithm";
import { twoSum } from "../../src/floatingPointArithmetic/Fast2Sum";

export function compensatedDotProduct(a: number[], b: number[]) {
    
    let sc = dekkerProduct(a[0], b[0])
    let st : {s: number, t: number} = {s: sc.r1, t: 0}
    let c: number = sc.r2
    console.log(sc)
    for (let i = 1; i < a.length; i += 1 ) {
        let p = dekkerProduct(a[i], b[i])
        st = twoSum(p.r1, st.s)
        c = c + (p.r2 + st.t)
    }
    return st.s + c
}