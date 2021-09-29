import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure"; 

export abstract class ShapeSpaceDiffEventsConfigurator {

    protected shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;

    constructor(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
        this.shapSpaceDiffEventsStructure = shapSpaceDiffEventsStructure;
    }

    setShapeSpaceDiffEventsStructure(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        this.shapSpaceDiffEventsStructure = shapSpaceDiffEventsStructure;
    }

    abstract setShapeSpaceMonitoringToInflections(): void;

    abstract setShapeSpaceMonitoringToCurvatureExtrema(): void;
}

export class ShapeSpaceConfiguratorWithInflections extends ShapeSpaceDiffEventsConfigurator {

    //public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(shapSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure) {
        super(shapSpaceDiffEventsStructure);

        //this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this.curveModeler);
    }
    setShapeSpaceMonitoringToCurvatureExtrema(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }

    setShapeSpaceMonitoringToInflectionsAndCurvatureExtrema(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }

    setShapeSpaceMonitoringToNoMonitoring(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }

    setShapeSpaceMonitoringToInflections(): void {
        console.log("no state change there.");
    }

}

export class ShapeSpaceConfiguratorWithCurvatureExtrema extends ShapeSpaceDiffEventsConfigurator {

    setShapeSpaceMonitoringToInflections(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    }

    setShapeSpaceMonitoringToInflectionsAndCurvatureExtrema(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }

    setShapeSpaceMonitoringToNoMonitoring(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }

    setShapeSpaceMonitoringToCurvatureExtrema(): void {
        console.log("no state change there.");
    }
}

export class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtrema extends ShapeSpaceDiffEventsConfigurator {

    setShapeSpaceMonitoringToInflections(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    }

    setShapeSpaceMonitoringToCurvatureExtrema(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }

    // JCL transition dependant de l'IHM
    setShapeSpaceMonitoringToNoMonitoring(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }

}

export class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema extends ShapeSpaceDiffEventsConfigurator {

    setShapeSpaceMonitoringToInflections(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    }

    setShapeSpaceMonitoringToCurvatureExtrema(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }

    // JCL transition dependant de l'IHM
    setShapeSpaceMonitoringToInflectionsAndCurvatureExtrema(): void {
        this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    }
}