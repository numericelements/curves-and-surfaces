import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";

export abstract class AbtractGenerateOptimizationConstraints {
    
    generateOptimizationConstraints(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        this.generateInflectionConstraints(shapeSpaceDiffEventsStructure);
        this.generateCurvatureExtremaConstraints(shapeSpaceDiffEventsStructure);
    }

    protected generateInflectionConstraints(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        if(shapeSpaceDiffEventsStructure.activeControlInflections) {
            
        }
    }

    protected generateCurvatureExtremaConstraints(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {

    }
}