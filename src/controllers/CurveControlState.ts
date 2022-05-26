import { CurveSceneController } from "./CurveSceneController";
import { ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding,
    ShapeSpaceConfiguratorWithInflectionsSliding,
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding, 
    ShapeSpaceConfiguratorWithCurvatureExtremaSliding,
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding} from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator"
import { AbstractCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ErrorLog } from "../errorProcessing/ErrorLoging";

export abstract class CurveControlState {

    protected curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator;
    // protected curveSceneController: CurveSceneController;

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = context;
        // if(this.curveShapeSpaceNavigator !== undefined) {
        //     this.curveShapeSpaceNavigator = this.curveSceneController.curveShapeSpaceNavigator;
        // }
        // else {
        //     this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(context.curveModeler);
        //     let error = new ErrorLog(this.constructor.name, 'constructor', 'Unable to update curveShapeSpaceNavigator context. Check its initialization.');
        //     error.logMessageToConsole();
        // }
    }

    setContext(context: AbstractCurveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = context;
    }


    // updateShapeSpaceNavigator(): void {
    //     this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this.curveSceneController.shapeSpaceDiffEventsStructure.shapeSpaceDiffEventsConfigurator;
    // }

    abstract handleInflections(): void

    abstract handleCurvatureExtrema(): void

    abstract handleSliding(): void
}

export class HandleInflectionsNoSlidingState extends CurveControlState {

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsNoSliding(this.curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }

}

export class HandleCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding());
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }
}

export class HandleInflectionsAndCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding());
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }
    
    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }
}

export class HandleNoDiffEventNoSlidingState extends CurveControlState {

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding());
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator))
        // this.updateShapeSpaceNavigator();
    }
}

export class HandleInflectionsSlidingState extends CurveControlState {

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsSliding(this.curveShapeSpaceNavigator.shapeNavigableCurve.curveCategory));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

}

export class HandleCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaSliding());
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

}

export class HandleInflectionsAndCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding());
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }
    
    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

}

export class HandleNoDiffEventSlidingState extends CurveControlState {

    constructor(context: AbstractCurveShapeSpaceNavigator) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding());
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        // this.updateShapeSpaceNavigator();
    }
}