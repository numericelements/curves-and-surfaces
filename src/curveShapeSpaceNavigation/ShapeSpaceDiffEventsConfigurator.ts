import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure"; 
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { CurveCategory } from "../shapeNavigableCurve/CurveCategory";
import { WarningLog } from "../errorProcessing/ErrorLoging";


export class ShapeSpaceConfiguratorWithInflectionsNoSliding implements ShapeSpaceDiffEventsConfigurator {

    private curveModel: CurveCategory;
    //public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveModel: CurveCategory) {
        this.curveModel = curveModel;

    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        let warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }

}

export class ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        let warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }


    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // removeCurvatureExtremaFromShapeSpaceMonitoring(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        let warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }


    // setShapeSpaceMonitoringToNoMonitoring(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToInflectionsAndCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        let warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();

    }

    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithInflectionsSliding implements ShapeSpaceDiffEventsConfigurator {

    private curveModel: CurveCategory;
    //public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveModel: CurveCategory) {
        this.curveModel = curveModel;

    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        let warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

}

export class ShapeSpaceConfiguratorWithCurvatureExtremaSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        let warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

}

export class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        let warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

}

export class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        let warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}