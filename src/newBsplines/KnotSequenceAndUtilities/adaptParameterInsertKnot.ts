export function adaptParameterInsertKnot() {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (abscissae: number | number[], multiplicity: number) {
        const input = Array.isArray(abscissae) ? abscissae : [abscissae];
        return originalMethod.call(this, input, multiplicity);
      };
    };
}