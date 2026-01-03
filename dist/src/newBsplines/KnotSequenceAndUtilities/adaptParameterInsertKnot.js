"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptParameterInsertKnot = void 0;
function adaptParameterInsertKnot() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (abscissae, multiplicity) {
            const input = Array.isArray(abscissae) ? abscissae : [abscissae];
            return originalMethod.call(this, input, multiplicity);
        };
    };
}
exports.adaptParameterInsertKnot = adaptParameterInsertKnot;
