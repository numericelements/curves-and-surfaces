import { KnotIndexStrictlyIncreasingSequence } from "../KnotIndexStrictlyIncreasingSequence";

export function adaptParameterDecrementKnotMultiplicity() {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (index: KnotIndexStrictlyIncreasingSequence | Array<KnotIndexStrictlyIncreasingSequence>, checkSequenceConsistency: boolean) {
        const input = Array.isArray(index) ? index : [index];
        return originalMethod.call(this, input, checkSequenceConsistency);
      };
    };
}