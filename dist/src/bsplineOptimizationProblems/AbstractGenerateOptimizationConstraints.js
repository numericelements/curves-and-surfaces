"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbtractGenerateOptimizationConstraints = void 0;
class AbtractGenerateOptimizationConstraints {
    generateOptimizationConstraints(shapeSpaceDiffEventsStructure) {
        this.generateInflectionConstraints(shapeSpaceDiffEventsStructure);
        this.generateCurvatureExtremaConstraints(shapeSpaceDiffEventsStructure);
    }
    generateInflectionConstraints(shapeSpaceDiffEventsStructure) {
        if (shapeSpaceDiffEventsStructure.activeControlInflections) {
        }
    }
    generateCurvatureExtremaConstraints(shapeSpaceDiffEventsStructure) {
    }
}
exports.AbtractGenerateOptimizationConstraints = AbtractGenerateOptimizationConstraints;
