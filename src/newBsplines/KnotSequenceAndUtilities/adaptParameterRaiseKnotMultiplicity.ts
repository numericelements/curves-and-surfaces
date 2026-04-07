import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";

/**
 * Method decorator that normalises the first argument of `raiseKnotMultiplicity` to an array.
 *
 * @description
 * Allows callers to pass either a single `KnotIndexStrictlyIncreasingSequence` or an array.
 * The decorator wraps the decorated method so the underlying implementation always
 * receives an array of indices.
 *
 * @returns A TypeScript method decorator.
 */
export function adaptParameterRaiseKnotMultiplicity() {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, multiplicity: number, checkSequenceConsistency: boolean) {
        const input = Array.isArray(index) ? index : [index];
        return originalMethod.call(this, input, multiplicity, checkSequenceConsistency);
      };
    };
}