import { CurveConstraintClampedFirstAndLastControlPoint, CurveConstraintClampedFirstControlPoint, CurveConstraintClampedLastControlPoint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { CCurveNavigationStrictlyInsideShapeSpace, CCurveNavigationThroughSimplerShapeSpaces, CCurveNavigationWithoutShapeSpaceMonitoring, OCurveNavigationStrictlyInsideShapeSpace, OCurveNavigationThroughSimplerShapeSpaces, OCurveNavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { SceneInteractionStrategy } from "../designPatterns/SceneInteractionStrategy";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModel } from "../newModels/CurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { ClosedPlanarCurve, OpenPlanarCurve } from "../shapeNavigableCurve/CurveCategory";
import { EventMgmtAtCurveExtremities } from "../shapeNavigableCurve/EventMgmtAtCurveExtremities";
import { EventSlideOutsideCurve, EventStayInsideCurve, NoEventToManageForClosedCurve } from "../shapeNavigableCurve/EventStateAtCurveExtremity";
import { NO_CONSTRAINT, ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ClickButtonView } from "../views/ClickButtonView";
import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { CurveSceneController } from "./CurveSceneController";

export abstract class CurveSceneControllerInteractionStrategy implements SceneInteractionStrategy {

    protected readonly _curveSceneController: CurveSceneController;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected selectedControlPoint: number | null;


    constructor(curveSceneController: CurveSceneController) {
        this._curveSceneController = curveSceneController;
        this.shapeNavigableCurve = this._curveSceneController.shapeNavigableCurve;
        this.curveShapeSpaceNavigator = this._curveSceneController.curveShapeSpaceNavigator;
        this.selectedControlPoint = null;
    }

    get curveSceneController(): CurveSceneController{
        return this.curveSceneController;
    }

    abstract processLeftMouseDownInteraction(ndcX: number, ndcY: number): void;

    abstract processLeftMouseDragInteraction(ndcX: number, ndcY: number): void;

    abstract processLeftMouseUpInteraction(): void;

    abstract processShiftKeyDownInteraction(): void;

    abstract processShiftKeyUpInteraction(): void;
}

// Remark: the interaction states hereunder are independent of the clamping process that can be applied
// to all configurations underneath

export class CurveSceneControllerKnotInsertion extends CurveSceneControllerInteractionStrategy {

    // double click has no effect 
    // leftMouseDown_event to select the knot location on the curve
    // leftMouseDragged_event has no effect
    // shift key has no effect

    private readonly curveModel: CurveModelInterface;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
    }

    insertKnotIntoCurve(controlPointIndex: number | null): void {
        let cp = controlPointIndex;
        if(this.curveModel instanceof CurveModel) {
            if(cp === 0) { cp += 1 };
            if(cp === this.curveModel.spline.controlPoints.length -1) { cp -= 1 };
        }
        const grevilleAbscissae = this.curveModel.spline.grevilleAbscissae();
        if(cp != null) {
            const spline = this.curveModel.spline;
            spline.insertKnot(grevilleAbscissae[cp], 1)
            this.curveModel.setSpline(spline);
            this.updateClampedPoints(grevilleAbscissae[cp]);
            this.curveModel.notifyObservers();
            // JCL this could be better handled with an update process of shapenavigableCurve observers ?
            this.curveShapeSpaceNavigator.navigationState.setCurrentCurve(this.curveModel.spline);
            this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline.clone();
            if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy instanceof CurveConstraintClampedFirstAndLastControlPoint) {
                this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.setCurrentCurve(this.curveModel.spline);
            }
            this.curveShapeSpaceNavigator.navigationCurveModel.resetCurveToOptimize();
        }
    }

    updateClampedPoints(knotParametricLocation: number):void {
        // update the clamped points indices of the shape navigable curve
        this.shapeNavigableCurve.updateClampedPointsAfterKnotInsertion(knotParametricLocation);
        // update the indices of reference points used for curve geometric constraints
        if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy instanceof CurveConstraintClampedFirstControlPoint) {
            this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.referencePtIndex = this.shapeNavigableCurve.clampedPoints[0];
        } else if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy instanceof CurveConstraintClampedLastControlPoint) {
            this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.referencePtIndex = this.shapeNavigableCurve.clampedPoints[1];
        }
        // update the graphic location of clamped points
        this._curveSceneController.clampedControlPointView.clearSelectedPoints();
        if(this.shapeNavigableCurve.clampedPoints[0] !== NO_CONSTRAINT)
            this._curveSceneController.clampedControlPointView.setSelectedKnot(this.shapeNavigableCurve.clampedPoints[0]);
        if(this.shapeNavigableCurve.clampedPoints[1] !== NO_CONSTRAINT)
            this._curveSceneController.clampedControlPointView.setSelectedKnot(this.shapeNavigableCurve.clampedPoints[1]);
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "insert knot");
        warning.logMessageToConsole();
        this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
        this.insertKnotIntoCurve(this.selectedControlPoint);
        this._curveSceneController.selectedControlPoint = null;
        this.selectedControlPoint = null;
        this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
        this._curveSceneController.renderFrame();
        if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this._curveSceneController));
        } else if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationThroughSimplerShapeSpaces) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
        } else if(this.curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace
            || this.curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationStrictlyInsideShapeSpace) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
        }
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyDownInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }
}

export class CurveSceneControllerNoShapeSpaceConstraintsCPSelection extends CurveSceneControllerInteractionStrategy {

    // double click has no effect
    // leftMouseDown_event, leftMouseDragged_event, leftMouseUp_event are active for control points only
    // shift key has no effect

    private readonly insertKnotButtonView: ClickButtonView;
    private readonly curveModel: CurveModelInterface;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.insertKnotButtonView = this._curveSceneController.insertKnotButtonView;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveModel.notifyObservers();
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        if(this.insertKnotButtonView.buttonSelection(ndcX, ndcY)) {
            console.log("insertButton")
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerKnotInsertion(this._curveSceneController));
        }
        else {
            this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
            console.log(" select CP id = ", this.selectedControlPoint)
            this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
            this._curveSceneController.renderFrame();
            if(this.selectedControlPoint !== null) {
                this._curveSceneController.selectedControlPoint = this.selectedControlPoint;
                this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPDragging(this._curveSceneController));
            }
        }
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyDownInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }
}

export class CurveSceneControllerNoShapeSpaceConstraintsCPDragging extends CurveSceneControllerInteractionStrategy {

    private readonly curveModel: CurveModelInterface;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        const x = ndcX;
        const y = ndcY;
        if(this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }

    processLeftMouseUpInteraction(): void {
        console.log(" processLeftMouseUpInteraction")
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNoShapeSpaceConstraintsCPSelection(this._curveSceneController));
    }

    processShiftKeyDownInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }
}

export class CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection extends CurveSceneControllerInteractionStrategy {

    // double click has no effect
    // leftMouseDown_event, leftMouseDragged_event, leftMouseUp_event are active for control points only
    // shift key is active to monitor differential events leaving/entering the curve -> for Open curves only
    // (cannot be active if event sliding is not active)
    // discontinuity crossing of curvature derivative for cubic curves has no influence here and should be
    // managed through a button attached to the navigation interface

    private readonly insertKnotButtonView: ClickButtonView;
    private readonly curveModel: CurveModelInterface;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.insertKnotButtonView = this._curveSceneController.insertKnotButtonView;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
        this.curveModel.notifyObservers();
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        if(this.insertKnotButtonView.buttonSelection(ndcX, ndcY)) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerKnotInsertion(this._curveSceneController));
            console.log("Nested simplified spaces: insertButton")
        } else {
            this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
            this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
            this._curveSceneController.renderFrame();
            if(this.selectedControlPoint !== null) {
                this._curveSceneController.selectedControlPoint = this.selectedControlPoint;
                if(this.shapeNavigableCurve.curveCategory instanceof OpenPlanarCurve) {
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
                } else if(this.shapeNavigableCurve.curveCategory instanceof ClosedPlanarCurve) {
                    // this.shapeNavigableCurve.changeMngmtOfEventAtExtremity(new NoEventToManageForClosedCurve(this.shapeNavigableCurve.eventMgmtAtExtremities));
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve(this._curveSceneController));
                }
            }
        }
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        // const warning = new WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        // warning.logMessageToConsole();
    }

    processLeftMouseUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyDownInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }
}

export class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve extends CurveSceneControllerInteractionStrategy {

    protected readonly controlOfInflection: boolean;
    protected readonly controlOfCurvatureExtrema: boolean;
    protected readonly curveModel: CurveModelInterface;
    // private curveControl: CurveControlStrategyInterface;
    protected eventMgmtAtExtremities: EventMgmtAtCurveExtremities;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.controlOfInflection = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections;
        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
        // this.curveControl = this._curveSceneController.curveControl;
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        const x = ndcX;
        const y = ndcY;
        // console.log(" simpler spaces: selected point = ", this.selectedControlPoint);
        if(this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            // console.log("x0= " + this.curveModel.spline.controlPoints[0].x + " y0= " + this.curveModel.spline.controlPoints[0].y +
            // " x1= " + this.curveModel.spline.controlPoints[ this.curveModel.spline.controlPoints.length - 1].x + " y1= " + this.curveModel.spline.controlPoints[ this.curveModel.spline.controlPoints.length - 1].y)
            if(!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization 
                because it is part of the optimize method (whether sliding is active or not) */
                this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
            } else if(this._curveSceneController.allowShapeSpaceChange === true) {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied) {
                    console.log("Constraints not satisfied - must change interaction Strategy");
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied(this._curveSceneController));
                } else {
                    this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                    this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
                }
            // } else if((this.activeExtremaLocationControl !== ActiveExtremaLocationControl.stopDeforming && this.activeInflectionLocationControl !== ActiveInflectionLocationControl.stopDeforming) 
            // || this.allowShapeSpaceChange === true) {
                /*if(this.curveControl instanceof SlidingStrategy && this.curveControl.lastDiffEvent !== NeighboringEventsType.none) {
                    if(this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumLeftBoundary || this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumRightBoundary) {

                    }
                }*/
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }

    processLeftMouseUpInteraction(): void {
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    }

    processShiftKeyDownInteraction(): void {
        // this.curveEventAtExtremityMayVanish = true;
        this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        // this.curveEventAtExtremityMayVanish = false;
        this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }
}

export class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied extends CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve {

    protected eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    private readonly lastValidCurve: BSplineR1toR2Interface;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.lastValidCurve = this.curveModel.spline.clone();
        this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        this._curveSceneController.highlightedControlPolygonView.update(this.lastValidCurve);
        this._curveSceneController.phantomCurveView.update(this.lastValidCurve);
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        const x = ndcX;
        const y = ndcY;
        console.log(" simpler spaces: selected point = ", this.selectedControlPoint);
        if(this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            if(!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization 
                because it is part of the optimize method (whether sliding is active or not) */
                this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
            } else if(this._curveSceneController.allowShapeSpaceChange === true) {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied)
                    console.log("Constraints not satisfied - new interaction Strategy");
                this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }

    processLeftMouseUpInteraction(): void {
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    }

    processShiftKeyDownInteraction(): void {
        // this.curveEventAtExtremityMayVanish = true;
        this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        // this.curveEventAtExtremityMayVanish = false;
        this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }
}

export class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve extends CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve {

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
    }

    processShiftKeyDownInteraction(): void {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }
}

export class CurveSceneControllerStrictlyInsideShapeSpaceCPSelection extends CurveSceneControllerInteractionStrategy {

    // double click has no effect
    // leftMouseDown_event, leftMouseDragged_event, leftMouseUp_event are active for control points
    // (1) shift key is active to monitor differential events leaving/entering the curve -> Event management at 
    // extremities based on the locations of differential events -> for Open curves only
    // (cannot be active if event sliding is not active)
    // (2) shift key is active to monitor changes of shape space (event removal through merging/event insertion)
    // -> shape space transition based on the locations of differential events
    // (necessarily different from (1) because differential events are processed as couples here whereas they
    // are individuals in (1)) -> configurations are exclusive from each other
    // discontinuity crossing of curvature derivative for cubic curves has no influence here and should be
    // managed through a button attached to the navigation interface

    private readonly insertKnotButtonView: ClickButtonView;
    private readonly curveModel: CurveModelInterface;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.insertKnotButtonView = this._curveSceneController.insertKnotButtonView;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveModel.notifyObservers();
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        if(this.insertKnotButtonView.buttonSelection(ndcX, ndcY)) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerKnotInsertion(this._curveSceneController));
        }
        else {
            this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
            this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
            this._curveSceneController.renderFrame();
            if(this.selectedControlPoint !== null) {
                this._curveSceneController.selectedControlPoint = this.selectedControlPoint;
                if(this.shapeNavigableCurve.curveCategory instanceof OpenPlanarCurve) {
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve(this._curveSceneController));
                } else if(this.shapeNavigableCurve.curveCategory instanceof ClosedCurveModel) {
                    this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new NoEventToManageForClosedCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve(this._curveSceneController));
                }
            }
        }
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDragInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyDownInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        const warning = new WarningLog(this.constructor.name, "processshiftKeyUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }
}

export class CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve extends CurveSceneControllerInteractionStrategy {

    private readonly controlOfInflection: boolean;
    private readonly controlOfCurvatureExtrema: boolean;
    private readonly curveModel: CurveModelInterface;
    // private curveControl: CurveControlStrategyInterface;
    protected eventMgmtAtExtremities: EventMgmtAtCurveExtremities;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.controlOfInflection = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlInflections;
        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        // this.curveControl = this.curveShapeSpaceNavigator.curveControl;
        // this.curveControl = this._curveSceneController.curveControl;
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        const x = ndcX;
        const y = ndcY;
        if(this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            if(!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization 
                because it is part of the optimize method (whether sliding is active or not) */
                this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y)
            } else if(this._curveSceneController.allowShapeSpaceChange === true) {
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
            // } else if((this.activeExtremaLocationControl !== ActiveExtremaLocationControl.stopDeforming && this.activeInflectionLocationControl !== ActiveInflectionLocationControl.stopDeforming) 
            // || this.allowShapeSpaceChange === true) {
                /*if(this.curveControl instanceof SlidingStrategy && this.curveControl.lastDiffEvent !== NeighboringEventsType.none) {
                    if(this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumLeftBoundary || this.curveControl.lastDiffEvent === NeighboringEventsType.neighboringCurExtremumRightBoundary) {

                    }
                }*/
                // this.curveControl.optimize(this.selectedControlPoint, x, y);
                this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }

    processLeftMouseUpInteraction(): void {
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
    }

    processShiftKeyDownInteraction(): void {
        // this.curveEventAtExtremityMayVanish = true;
        this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        // this.curveEventAtExtremityMayVanish = false;
        this.curveShapeSpaceNavigator.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }
}

export class CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve extends CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve {

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
    }

    processShiftKeyDownInteraction(): void {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventState.constructor.name);
        message.logMessageToConsole();
    }
}