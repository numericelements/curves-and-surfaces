import { ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding,
    ShapeSpaceConfiguratorWithInflectionsSliding,
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding, 
    ShapeSpaceConfiguratorWithCurvatureExtremaSliding,
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding} from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator"
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { NavigationCurveModel } from "../curveShapeSpaceNavigation/NavigationCurveModel";

export abstract class CurveControlState {

    protected navigationCurveModel: NavigationCurveModel;
    // protected curveSceneController: CurveSceneController;

    constructor(context: NavigationCurveModel) {
        this.navigationCurveModel = context;
        // if(this.curveShapeSpaceNavigator !== undefined) {
        //     this.curveShapeSpaceNavigator = this.curveSceneController.curveShapeSpaceNavigator;
        // }
        // else {
        //     this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(context.curveModeler);
        //     let error = new ErrorLog(this.constructor.name, 'constructor', 'Unable to update curveShapeSpaceNavigator context. Check its initialization.');
        //     error.logMessageToConsole();
        // }
    }

    setContext(context: NavigationCurveModel) {
        this.navigationCurveModel = context;
    }

    // updateShapeSpaceNavigator(): void {
    //     this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this.curveSceneController.shapeSpaceDiffEventsStructure.shapeSpaceDiffEventsConfigurator;
    // }

    abstract handleInflections(): void

    abstract handleCurvatureExtrema(): void

    abstract handleSliding(): void
}

export class HandleInflectionsNoSlidingState extends CurveControlState {

    constructor(context: NavigationCurveModel) {
        super(context)
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsNoSliding(this.navigationCurveModel.shapeNavigableCurve.curveCategory));
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.navigationCurveModel.transitionTo(new HandleNoDiffEventNoSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }

}

export class HandleCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: NavigationCurveModel) {
        super(context)
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding());
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.navigationCurveModel.transitionTo(new HandleNoDiffEventNoSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.navigationCurveModel.transitionTo(new HandleCurvatureExtremaSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }
}

export class HandleInflectionsAndCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: NavigationCurveModel) {
        super(context)
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding());
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.navigationCurveModel.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }
    
    handleCurvatureExtrema(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsNoSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }
}

export class HandleNoDiffEventNoSlidingState extends CurveControlState {

    constructor(context: NavigationCurveModel) {
        super(context)
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding());
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsNoSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.navigationCurveModel.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.navigationCurveModel.transitionTo(new HandleNoDiffEventSlidingState(this.navigationCurveModel))
        // this.updateShapeSpaceNavigator();
    }
}

export class HandleInflectionsSlidingState extends CurveControlState {

    constructor(context: NavigationCurveModel) {
        super(context)
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsSliding(this.navigationCurveModel.shapeNavigableCurve.curveCategory));
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.navigationCurveModel.transitionTo(new HandleNoDiffEventSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsNoSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

}

export class HandleCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: NavigationCurveModel) {
        super(context)
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaSliding());
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.navigationCurveModel.transitionTo(new HandleNoDiffEventSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.navigationCurveModel.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

}

export class HandleInflectionsAndCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: NavigationCurveModel) {
        super(context)
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding());
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.navigationCurveModel.transitionTo(new HandleCurvatureExtremaSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }
    
    handleCurvatureExtrema(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

}

export class HandleNoDiffEventSlidingState extends CurveControlState {

    constructor(context: NavigationCurveModel) {
        super(context)
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding());
        this.navigationCurveModel.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.navigationCurveModel.transitionTo(new HandleInflectionsSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

    handleCurvatureExtrema(): void {
        this.navigationCurveModel.transitionTo(new HandleCurvatureExtremaSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }

    handleSliding(): void {
        this.navigationCurveModel.transitionTo(new HandleNoDiffEventNoSlidingState(this.navigationCurveModel));
        // this.updateShapeSpaceNavigator();
    }
}