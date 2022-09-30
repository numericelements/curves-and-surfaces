
// https://github.com/viktors/node-kahan/blob/master/index.js
// Implements http://en.wikipedia.org/wiki/Kahan_summation_algorithm

export function kahanSum(inputArray: number[]) {
    let sum = 0.0
    let c = 0.0              // A running compensation for lost low-order bits.
    for(let element of inputArray) {
      let y = element - c   // So far, so good: c is zero.
      let t = sum + y       // Alas, sum is big, y small, so low-order digits of y are lost.
      c = (t - sum) - y     // (t - sum) recovers the high-order part of y; subtracting y recovers -(low part of y)
      sum = t               // Algebraically, c should always be zero. Beware eagerly optimising compilers!
    }                       // Next time around, the lost low part will be added to y in a fresh attempt.
    return sum
  }