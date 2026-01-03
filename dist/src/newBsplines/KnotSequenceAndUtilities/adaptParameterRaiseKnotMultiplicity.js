"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptParameterRaiseKnotMultiplicity = void 0;
function adaptParameterRaiseKnotMultiplicity() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (index, multiplicity, checkSequenceConsistency) {
            const input = Array.isArray(index) ? index : [index];
            return originalMethod.call(this, input, multiplicity, checkSequenceConsistency);
        };
    };
}
exports.adaptParameterRaiseKnotMultiplicity = adaptParameterRaiseKnotMultiplicity;
