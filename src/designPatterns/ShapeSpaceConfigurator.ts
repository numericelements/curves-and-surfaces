import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";

export interface ShapeSpaceDiffEvventsConfigurator {
    
    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void;
}