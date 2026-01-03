"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WM_GEOMETRIC_CONSTRAINTS_POLYGON_VERTICES = exports.WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE = void 0;
// All knot sequences
// The abscissa specified for a request or a knot sequence operation has not been found into the sequence
exports.WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE = "Knot abscissa cannot be found into the knot sequence.";
// When no, or not enough, intermediate knots exist between the end knots of an open knot sequence of a closed curve, some geometric constraints on the control polygon vertices must exist to describe a closed curve
exports.WM_GEOMETRIC_CONSTRAINTS_POLYGON_VERTICES = "Geometric constraints must exist on control polygon vertices to produce a closed curve.";
