import { CurveSceneController } from "./CurveSceneController";
import { ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding,
    ShapeSpaceConfiguratorWithInflectionsSliding,
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding, 
    ShapeSpaceConfiguratorWithCurvatureExtremaSliding,
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding} from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator"

export abstract class CurveControlState {

    protected curveSceneController: CurveSceneController;

    constructor(context: CurveSceneController) {
        this.curveSceneController = context;
    }

    setContext(context: CurveSceneController) {
        this.curveSceneController = context;
    }

    abstract handleInflections(): void

    abstract handleCurvatureExtrema(): void

    abstract handleSliding(): void
}

export class HandleInflectionsNoSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsNoSliding(this.curveSceneController.curveModeler.curveCategory));
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveSceneController))
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsSlidingState(this.curveSceneController))
    }

}

export class HandleCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding());
    }
    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveSceneController))
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveSceneController))
    }
}

export class HandleInflectionsAndCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding());
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveSceneController))
    }
    
    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsNoSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveSceneController))
    }
}

export class HandleNoDiffEventNoSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding());
    }

    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsNoSlidingState(this.curveSceneController))
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventSlidingState(this.curveSceneController))
    }
}

export class HandleInflectionsSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsSliding(this.curveSceneController.curveModeler.curveCategory));
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
    }
    handleInflections(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveSceneController))
    }

    handleCurvatureExtrema(): void {
        this.curveSceneController.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveSceneController))
    }

    handleSliding(): void {
        this.curveSceneController.transitionTo(new HandleInflectionsNoSlidingState(this.curveSceneController))
    }

}

export class HandleInflectionsAndCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: CurveSceneController) {
        super(context)
        this.curveSceneController.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding());
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