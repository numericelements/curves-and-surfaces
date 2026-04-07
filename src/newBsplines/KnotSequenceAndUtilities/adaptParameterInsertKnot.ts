/**
 * Method decorator that normalises the first argument of `insertKnot` to an array.
 *
 * @description
 * Allows callers to pass either a single abscissa (`number`) or an array of abscissae
 * (`readonly number[]`). The decorator wraps the decorated method so that the
 * underlying implementation always receives an array, removing the need for
 * overload handling inside every concrete class.
 *
 * @returns A TypeScript method decorator.
 *
 * @example
 * \@adaptParameterInsertKnot()
 * insertKnotAbscissaArrayMutSeq(abscissae: readonly number[], multiplicity: number): void { ... }
 */

export function adaptParameterInsertKnot() {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (abscissae: number | readonly number[], multiplicity: number) {
        const input = Array.isArray(abscissae) ? abscissae : [abscissae];
        return originalMethod.call(this, input, multiplicity);
      };
    };
}