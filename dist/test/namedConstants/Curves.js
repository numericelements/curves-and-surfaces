"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2 = exports.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1 = exports.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1 = exports.TOL_EVAL_ZEROS_BSPL_R1TOR1 = void 0;
// B-Spline R1 to R1 and periodic B-Spline R1 to R1
// f(u) = sigma(0, n) P_i N_i,m(u)
// Set tolerance to evaluate the accuracy of zeros locations
// Accuracy of f(u_j) = 0
exports.TOL_EVAL_ZEROS_BSPL_R1TOR1 = 1e-7;
// Set tolerance to evaluate the accuracy of a curve point location
// Accuracy of f(u) given u
exports.TOL_COMPARISON_PT_CRV_BSPL_R1TOR1 = 1e-10;
// Set tolerance to evaluate the accuracy of a curve control point location
// Accuracy of control points P'_j = g(sigma(0, n) P_i N_i,m(u)) after applying a transformation g to f(u)
exports.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1 = 1e-10;
// B-Spline R1 to R2 and periodic B-Spline R1 to R2
// P(u) = sigma(0, n) P_i N_i, m(u) where P_i is a 2D vector
// Set tolerance to evaluate the accuracy of a curve control point location
// Accuracy of control points P'_j = g(sigma(0, n) P_i N_i,m(u)) after applying a transformation g to P(u)
// The accuracy is identical along the x and y axes
exports.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2 = exports.TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR1;
