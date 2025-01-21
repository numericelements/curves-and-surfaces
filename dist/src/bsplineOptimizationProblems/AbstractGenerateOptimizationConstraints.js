"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbtractGenerateOptimizationConstraints = void 0;
var AbtractGenerateOptimizationConstraints = /** @class */ (function () {
    function AbtractGenerateOptimizationConstraints() {
    }
    AbtractGenerateOptimizationConstraints.prototype.generateOptimizationConstraints = function (shapeSpaceDiffEventsStructure) {
        this.generateInflectionConstraints(shapeSpaceDiffEventsStructure);
        this.generateCurvatureExtremaConstraints(shapeSpaceDiffEventsStructure);
    };
    AbtractGenerateOptimizationConstraints.prototype.generateInflectionConstraints = function (shapeSpaceDiffEventsStructure) {
        if (shapeSpaceDiffEventsStructure.activeControlInflections) {
        }
    };
    AbtractGenerateOptimizationConstraints.prototype.generateCurvatureExtremaConstraints = function (shapeSpaceDiffEventsStructure) {
    };
    return AbtractGenerateOptimizationConstraints;
}());
exports.AbtractGenerateOptimizationConstraints = AbtractGenerateOptimizationConstraints;
