import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsNoSliding, 
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding, 
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding,
    ShapeSpaceConfiguratorWithInflectionsSliding,
    ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding, 
    ShapeSpaceConfiguratorWithCurvatureExtremaSliding,
    ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsConfigurator"
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ShapeSpaceNavigationEventListener } from "../userInterfaceController/UserInterfaceEventListener";

export abstract class CurveControlState {

    protected readonly shapeSpaceNavigationEventListener: ShapeSpaceNavigationEventListener;
    protected readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(context: ShapeSpaceNavigationEventListener) {
        this.shapeSpaceNavigationEventListener = context;
        this.curveShapeSpaceNavigator = context.curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
    }

    // setContext(context: ShapeSpaceNavigationEventListener) {
    //     this.shapeSpaceNavigationEventListener = context;
    // }

    // updateShapeSpaceNavigator(): void {
    //     this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this.curveSceneController.shapeSpaceDiffEventsStructure.shapeSpaceDiffEventsConfigurator;
    // }

    abstract handleInflections(): void

    abstract handleCurvatureExtrema(): void

    abstract handleSliding(): void
}

export class HandleInflectionsNoSlidingState extends CurveControlState {

    constructor(context: ShapeSpaceNavigationEventListener) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsNoSliding(this.curveShapeSpaceNavigator));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleNoDiffEventNoSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleSliding(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

}

export class HandleCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: ShapeSpaceNavigationEventListener) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator));
        this.shapeNavigableCurve.notifyObservers();
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleNoDiffEventNoSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleSliding(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleCurvatureExtremaSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }
}

export class HandleInflectionsAndCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(context: ShapeSpaceNavigationEventListener) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }
    
    handleCurvatureExtrema(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsNoSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleSliding(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }
}

export class HandleNoDiffEventNoSlidingState extends CurveControlState {

    constructor(context: ShapeSpaceNavigationEventListener) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsNoSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleSliding(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleNoDiffEventSlidingState(this.shapeSpaceNavigationEventListener))
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }
}

export class HandleInflectionsSlidingState extends CurveControlState {

    constructor(context: ShapeSpaceNavigationEventListener) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsSliding(this.curveShapeSpaceNavigator));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleNoDiffEventSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleSliding(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsNoSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

}

export class HandleCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: ShapeSpaceNavigationEventListener) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtremaSliding(this.curveShapeSpaceNavigator));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleNoDiffEventSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleSliding(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

}

export class HandleInflectionsAndCurvatureExtremaSlidingState extends CurveControlState {

    constructor(context: ShapeSpaceNavigationEventListener) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(new ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding(this.curveShapeSpaceNavigator));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleCurvatureExtremaSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }
    
    handleCurvatureExtrema(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleSliding(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

}

export class HandleNoDiffEventSlidingState extends CurveControlState {

    constructor(context: ShapeSpaceNavigationEventListener) {
        super(context)
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.changeShapeSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding(this.curveShapeSpaceNavigator));
        this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.monitorCurveShape();
    }

    handleInflections(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleInflectionsSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleCurvatureExtremaSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }

    handleSliding(): void {
        this.shapeSpaceNavigationEventListener.transitionTo(new HandleNoDiffEventNoSlidingState(this.shapeSpaceNavigationEventListener));
        const shapeSpaceConfigurationChange = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange;
        if(shapeSpaceConfigurationChange) {
            this.shapeNavigableCurve.notifyObservers();
            this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator.shapeSpaceConfigurationChange = false;
        }
    }
}