"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptParameterDecrementKnotMultiplicity = void 0;
function adaptParameterDecrementKnotMultiplicity() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (index, checkSequenceConsistency) {
            const input = Array.isArray(index) ? index : [index];
            return originalMethod.call(this, input, checkSequenceConsistency);
        };
    };
}
exports.adaptParameterDecrementKnotMultiplicity = adaptParameterDecrementKnotMultiplicity;
