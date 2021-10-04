import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure"; 
import { ShapeSpaceDiffEvventsConfigurator } from "../designPatterns/ShapeSpaceConfigurator";
import { CurveModels2D } from "../models/CurveModels2D";

// export abstract class ShapeSpaceDiffEventsConfigurator {

//     protected shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;

//     constructor(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
//         this.shapSpaceDiffEventsStructure = shapSpaceDiffEventsStructure;
//     }

//     setShapeSpaceDiffEventsStructure(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
//         this.shapSpaceDiffEventsStructure = shapSpaceDiffEventsStructure;
//     }

//     abstract setShapeSpaceMonitoringToInflections(): void;

//     abstract setShapeSpaceMonitoringToCurvatureExtrema(): void;

//     abstract setShapeSpaceMonitoringToInflectionsAndCurvatureExtrema(): void;
// }

export class ShapeSpaceConfiguratorWithInflections implements ShapeSpaceDiffEvventsConfigurator {

    //public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {


        //this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this.curveModeler);
    }

    monitorCurveUsingDiffrentialEvents(curveModel: CurveModels2D): void {

    }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }

}

export class ShapeSpaceConfiguratorWithCurvatureExtrema implements ShapeSpaceDiffEvventsConfigurator {

    monitorCurveUsingDiffrentialEvents(curveModel: CurveModels2D): void {

    }


    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // removeCurvatureExtremaFromShapeSpaceMonitoring(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtrema implements ShapeSpaceDiffEvventsConfigurator {

    monitorCurveUsingDiffrentialEvents(curveModel: CurveModels2D): void {

    }


    // setShapeSpaceMonitoringToNoMonitoring(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToInflectionsAndCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema implements ShapeSpaceDiffEvventsConfigurator {

    monitorCurveUsingDiffrentialEvents(curveModel: CurveModels2D): void {

    }

    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}