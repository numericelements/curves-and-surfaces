"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WM_ABSCISSA_TOO_CLOSE_TO_KNOT = exports.WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE = void 0;
// All knot sequences
// The abscissa specified for a request or a knot sequence operation has not been found into the sequence
exports.WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE = "Knot abscissa cannot be found into the knot sequence.";
// An abscissa differs from the abscissae of all the knots of the sequence but it is too close from one of them to able to create a new knot independent of the others
exports.WM_ABSCISSA_TOO_CLOSE_TO_KNOT = "Abscissa is too close from an existing knot: please, raise multiplicity of an existing knot.";
