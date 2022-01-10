import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";

export interface ShapeSpaceDiffEventsConfigurator {
    
    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void;
}