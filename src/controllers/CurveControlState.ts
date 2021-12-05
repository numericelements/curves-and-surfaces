import { CurveSceneController } from "./CurveSceneController";
import { ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding,
    ShapeSpaceConfiguratorWithInflectionsSliding,
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding, 
    ShapeSpaceConfiguratorWithCurvatureExtremaSliding,
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding} from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator"
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";

export abstract class CurveControlState {

    protected curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected curveSceneController: CurveSceneController;

    constructor(context: CurveSceneController) {
        this.curveSceneController = context;
        this.curveShapeSpaceNavigator = this.curveSceneController.curveShapeSpaceNavigator;
    }

    setContext(context: CurveSceneController) {
        this.curveSceneController = context;
    }


    updateShapeSpaceNavigator(): void {
        this.curveSceneController.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this.curveSceneController.shapeSpaceDiffEventsStructure.shapeSpaceConfigurator;
    }

    abstract handleInflections(): void

    abstract handleCurvatureExtrema(): void

    abstract handleSliding(): void
}

export class HandleInflectionsNoSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsNoSliding(this.curveSceneController.curveModeler.curveCategory));
        this.curveSceneController.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }

}

export class HandleCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding());
        this.curveSceneController.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }
}

export class HandleInflectionsAndCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding());
        this.curveSceneController.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }
    
    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsNoSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }
}

export class HandleNoDiffEventNoSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding());
        this.curveSceneController.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsNoSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventSlidingState(this.curveSceneController))
        this.updateShapeSpaceNavigator();
    }
}

export class HandleInflectionsSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsSliding(this.curveSceneController.curveModeler.curveCategory));
        this.curveSceneController.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventSlidingState(this.curveSceneController))
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsNoSlidingState(this.curveSceneController))
    }

}

export class HandleCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaSliding());
        this.curveSceneController.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveSceneController))
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveSceneController))
    }

}

export class HandleInflectionsAndCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding());
        this.curveSceneController.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveSceneController))
    }
    
    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveSceneController))
    }

}

export class HandleNoDiffEventSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding());
        this.curveSceneController.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsSlidingState(this.curveSceneController))
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveSceneController))
    }
}