import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";

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