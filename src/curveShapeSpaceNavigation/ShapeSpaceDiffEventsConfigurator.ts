import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure"; 
import { ShapeSpaceDiffEvventsConfigurator as ShapeSpaceDiffEventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { CurveModels2D } from "../models/CurveModels2D";
import { CurveCategory } from "../curveModeler/CurveCategory";


export class ShapeSpaceConfiguratorWithInflectionsNoSliding implements ShapeSpaceDiffEventsConfigurator {

    private curveModel: CurveCategory;
    //public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveModel: CurveCategory) {
        this.curveModel = curveModel;

        //this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this.curveModeler);
    }

    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapSpaceDiffEventsStructure.navigation = true;
    }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }

}

export class ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapSpaceDiffEventsStructure.navigation = true;
    }


    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // removeCurvatureExtremaFromShapeSpaceMonitoring(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapSpaceDiffEventsStructure.navigation = true;
    }


    // setShapeSpaceMonitoringToNoMonitoring(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToInflectionsAndCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapSpaceDiffEventsStructure.navigation = false;
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

    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapSpaceDiffEventsStructure.navigation = true;
    }

}

export class ShapeSpaceConfiguratorWithCurvatureExtremaSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapSpaceDiffEventsStructure.navigation = true;
    }

}

export class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapSpaceDiffEventsStructure.navigation = true;
    }

}

export class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding implements ShapeSpaceDiffEventsConfigurator {

    monitorCurveUsingDifferentialEvents(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapSpaceDiffEventsStructure.navigation = false;
    }

    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}