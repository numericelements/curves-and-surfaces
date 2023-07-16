import { OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace } from "../bsplineOptimizationProblems/OptProblemOpenBSplineR1toR2";
import { CurveConstraintClampedFirstAndLastControlPoint, CurveConstraintClampedFirstControlPoint, CurveConstraintClampedLastControlPoint } from "../curveShapeSpaceNavigation/CurveConstraintStrategy";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { CCurveNavigationStrictlyInsideShapeSpace, CCurveNavigationThroughSimplerShapeSpaces, CCurveNavigationWithoutShapeSpaceMonitoring, OCurveNavigationStrictlyInsideShapeSpace, OCurveNavigationThroughSimplerShapeSpaces, OCurveNavigationWithoutShapeSpaceMonitoring } from "../curveShapeSpaceNavigation/NavigationState";
import { EventMgmtState } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { SceneInteractionStrategy } from "../designPatterns/SceneInteractionStrategy";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModel } from "../newModels/CurveModel";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { NeighboringEventsType } from "../sequenceOfDifferentialEvents/NeighboringEvents";
import { ClosedPlanarCurve, OpenPlanarCurve } from "../shapeNavigableCurve/CurveCategory";
import { EventMgmtAtCurveExtremities } from "../shapeNavigableCurve/EventMgmtAtCurveExtremities";
import { EventSlideOutsideCurve, EventStayInsideCurve, NoEventToManageForCurve } from "../shapeNavigableCurve/EventStateAtCurveExtremity";
import { NO_CONSTRAINT, ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ClickButtonView } from "../views/ClickButtonView";
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
            console.log(" select CP id = ", this.selectedControlPoint)
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
    protected managementOfEventsAtExtremities: EventMgmtState;
    protected readonly curveModel: CurveModelInterface;
    protected eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    protected eventsStayInsideInterval: boolean;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        // if(this.curveShapeSpaceNavigator.eventStateAtCrvExtremities instanceof EventStayInsideCurve) {
        //     this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval(this._curveSceneController));
        // }
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.controlOfInflection = this.curveShapeSpaceNavigator.getActiveControlInflections();
        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.getActiveControlCurvatureExtrema();
        this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        if(this.managementOfEventsAtExtremities === EventMgmtState.Active) {
            this.eventsStayInsideInterval = true;
        } else {
            this.eventsStayInsideInterval = false;
        }
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        console.log('drag CPDraggingOpenCurve')
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
            } else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.eventMgmtAtExtremities.clearEvents();
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied) {
                    console.log("Constraints not satisfied - must change interaction Strategy");
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied(this._curveSceneController));
                } else if (this.curveShapeSpaceNavigator.eventMgmtAtExtremities.eventOutOfInterval && this.eventsStayInsideInterval) {
                    console.log("An event went out of the interval. Display previous step");
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval(this._curveSceneController));
                } else {
                    if(this.curveShapeSpaceNavigator.eventMgmtAtExtremities.eventOutOfInterval) {
                        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.eventOutOfInterval = false;
                    }
                    this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                    this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
                }
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }

    processLeftMouseUpInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessageToConsole();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    }

    processShiftKeyDownInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", "events can slip out");
        message.logMessageToConsole();
        if(this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === EventMgmtState.Active) {
            this.eventsStayInsideInterval = false;
            this.curveShapeSpaceNavigator.setManagementDiffEventsAtExtremities(EventMgmtState.Inactive);
            this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        }
    }

    processShiftKeyUpInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", "events stay inside interval");
        message.logMessageToConsole();
        if(this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities() === EventMgmtState.Inactive) {
            const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", "events stay inside interval");
            message.logMessageToConsole();
            this.eventsStayInsideInterval = true;
            this.curveShapeSpaceNavigator.setManagementDiffEventsAtExtremities(EventMgmtState.Active);
            this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        }
    }
}

export class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveEventsInsideInterval extends CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve {

    protected readonly curveModel: CurveModelInterface;
    protected readonly eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    private curvatureExtSplippingOut: number[];
    private inflectionsSplippingOut: number[];

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.curvatureExtSplippingOut = [];
        this.inflectionsSplippingOut = [];
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        this.convertNeighboringEventsIntoDiffEventsToDisplay();
        this.curveModel.notifyObservers();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        console.log('drag CPDraggingOpenCurveEventsInsideInterval')
        const x = ndcX;
        const y = ndcY;
        // console.log(" simpler spaces: selected point = ", this.selectedControlPoint);
        if(this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            // console.log("x0= " + this.curveModel.spline.controlPoints[0].x + " y0= " + this.curveModel.spline.controlPoints[0].y +
            // " x1= " + this.curveModel.spline.controlPoints[ this.curveModel.spline.controlPoints.length - 1].x + " y1= " + this.curveModel.spline.controlPoints[ this.curveModel.spline.controlPoints.length - 1].y)
            if(!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                console.log("Inconsistent curve shape control settings");
            } else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.clearListsOfDiffEvents();
                this.updateDiffEventsToDisplay();
                this.eventMgmtAtExtremities.clearEvents();
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied) {
                    console.log("Constraints not satisfied - must change interaction Strategy");
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurveConstraintsUnsatisfied(this._curveSceneController));
                } else if(this.eventsStayInsideInterval) {
                    this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                    this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
                    this.eventMgmtAtExtremities.eventOutOfInterval = false;
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
                }
            }
            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }

    processLeftMouseUpInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", " come back to point selection");
        message.logMessageToConsole();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.clearPoints();
        this._curveSceneController.selectedSlipOutInflectionsView.clearPoints();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPSelection(this._curveSceneController));
    }

    processShiftKeyDownInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", " come back to drag point");
        message.logMessageToConsole();
        this.eventsStayInsideInterval = false;
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.clearPoints();
        this._curveSceneController.selectedSlipOutInflectionsView.clearPoints();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
    }

    processShiftKeyUpInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", " come back to drag point");
        message.logMessageToConsole();
        this.eventsStayInsideInterval = true;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve(this._curveSceneController));
    }

    clearListsOfDiffEvents(): void {
        this.curvatureExtSplippingOut = [];
        this.inflectionsSplippingOut = [];
    }

    updateDiffEventsToDisplay(): void {
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.updatePoints(this.curvatureExtSplippingOut);
        this._curveSceneController.selectedSlipOutInflectionsView.updatePoints(this.inflectionsSplippingOut);
    }

    convertNeighboringEventsIntoDiffEventsToDisplay(): void {
        this.curvatureExtSplippingOut = this.eventMgmtAtExtremities.locationsCurvExtrema;
        this.inflectionsSplippingOut = this.eventMgmtAtExtremities.locationsInflections;
        this.updateDiffEventsToDisplay();
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
            } else {
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
        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        // this.curveEventAtExtremityMayVanish = false;
        this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtExtremities));
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessageToConsole();
    }
}

export class CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingClosedCurve extends CurveSceneControllerNestedSimplifiedShapeSpacesCPDraggingOpenCurve {

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
    }

    processShiftKeyDownInteraction(): void {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
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
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
        this.curveModel.notifyObservers();
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        if(this.insertKnotButtonView.buttonSelection(ndcX, ndcY)) {
            this._curveSceneController.changeSceneInteraction(new CurveSceneControllerKnotInsertion(this._curveSceneController));
        }
        else {
            this.selectedControlPoint = this._curveSceneController.controlPointsView.pointSelection(ndcX, ndcY);
            console.log(" stricly inside shape space: select CP id = ", this.selectedControlPoint)
            this._curveSceneController.controlPointsView.setSelected(this.selectedControlPoint);
            this._curveSceneController.renderFrame();
            if(this.selectedControlPoint !== null) {
                this._curveSceneController.selectedControlPoint = this.selectedControlPoint;
                if(this.shapeNavigableCurve.curveCategory instanceof OpenPlanarCurve) {
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve(this._curveSceneController));
                } else if(this.shapeNavigableCurve.curveCategory instanceof ClosedCurveModel) {
                    // this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new NoEventToManageForCurve(this.curveShapeSpaceNavigator.eventMgmtAtExtremities));
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

    protected readonly controlOfInflection: boolean;
    protected readonly controlOfCurvatureExtrema: boolean;
    protected managementOfEventsAtExtremities: EventMgmtState;
    protected readonly curveModel: CurveModelInterface;
    protected eventMgmtAtExtremities: EventMgmtAtCurveExtremities;
    protected eventsStayInsideInterval: boolean;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.eventMgmtAtExtremities = this.curveShapeSpaceNavigator.eventMgmtAtExtremities;
        this.controlOfInflection = this.curveShapeSpaceNavigator.getActiveControlInflections();
        this.controlOfCurvatureExtrema = this.curveShapeSpaceNavigator.getActiveControlCurvatureExtrema();
        this.managementOfEventsAtExtremities = this.curveShapeSpaceNavigator.getManagementDiffEventsAtExtremities();
        if(this.managementOfEventsAtExtremities === EventMgmtState.Active) {
            this.eventsStayInsideInterval = true;
        } else {
            this.eventsStayInsideInterval = false;
        }
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
    }

    processLeftMouseDownInteraction(ndcX: number, ndcY: number): void {
        const warning = new WarningLog(this.constructor.name, "processLeftMouseDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        console.log('drag CPDraggingOpenCurve Stricly Inside Shape Space')
        const x = ndcX;
        const y = ndcY;
        if(this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            if(!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization 
                because it is part of the optimize method (whether sliding is active or not) */
                this.curveModel.setControlPointPosition(this.selectedControlPoint, x, y);
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
            } else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                console.log("navigate inside shape space")
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
            }
            // if(this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.isActive()) {
            if(this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                if(this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive()) {
                    console.log("need to change interaction strategy")
                    this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary(this._curveSceneController));
                }
            }

            this.curveModel.notifyObservers();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }

    processLeftMouseUpInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessageToConsole();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
    }

    processShiftKeyDownInteraction(): void {
        // this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventSlideOutsideCurve(this.eventMgmtAtExtremities));
        // this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        // const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        // message.logMessageToConsole();
        const warning = new WarningLog(this.constructor.name, "processShiftKeyDownInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        // this.curveShapeSpaceNavigator.eventMgmtAtExtremities.changeMngmtOfEventAtExtremity(new EventStayInsideCurve(this.eventMgmtAtExtremities));
        // this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        // const message = new WarningLog(this.constructor.name, " processShiftKeyUpInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        // message.logMessageToConsole();
        const warning = new WarningLog(this.constructor.name, "processShiftKeyUpInteraction", "nothing to do there");
        warning.logMessageToConsole();
    }
}

export class CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurveShapeSpaceBoundary extends CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve {

    protected readonly curveModel: CurveModelInterface;
    private adjacentShapeSpaceCurve: BSplineR1toR2Interface;
    private curvatureExtEntering: number[];
    private curvatureExtSplippingOut: number[];
    private inflectionsEntering: number[];
    private inflectionsSplippingOut: number[];
    private _displayPhantomEntities: boolean;

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
        this.curvatureExtEntering = [];
        this.curvatureExtSplippingOut = [];
        this.inflectionsEntering = [];
        this.inflectionsSplippingOut = [];
        this.selectedControlPoint = this._curveSceneController.selectedControlPoint;
        this.curveModel = this.shapeNavigableCurve.curveCategory.curveModel;
        this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
        // this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
        if(this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve !== undefined && !this.isNeighboringEventAtExtremity()) {
            this.adjacentShapeSpaceCurve = this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve;
            this._curveSceneController.highlightedControlPolygonView.update(this.adjacentShapeSpaceCurve);
            this._curveSceneController.phantomCurveView.update(this.adjacentShapeSpaceCurve);
        } else {
            this.adjacentShapeSpaceCurve = this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve;
        }
        if(this.isNeighboringEventAtExtremity()) {
            this._displayPhantomEntities = false;
        } else {
            this._displayPhantomEntities = true;
        }
        this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve.clone());
        this.convertNeighboringEventsIntoDiffEventsToDisplay();
        this.curveModel.notifyObservers();
        this.updateDiffEventsEnteringOnCurveAdjacentToShapeSpace();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.deactivate();
        if(this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
        }

    }

    get displayPhantomEntities(): boolean {
        return this._displayPhantomEntities;
    }

    processLeftMouseDragInteraction(ndcX: number, ndcY: number): void {
        const x = ndcX;
        const y = ndcY;
        console.log(" shape space boundary: selected point = ", this.selectedControlPoint);
        if(this.selectedControlPoint != null) {
            this._curveSceneController.controlPointsView.setSelected(null);
            if(!this.controlOfCurvatureExtrema && !this.controlOfInflection) {
                /* JCL 2020/11/12 Remove the setControlPoint as a preliminary step of optimization 
                because it is part of the optimize method (whether sliding is active or not) */
                console.log("Inconsistent curve shape control settings");
            } else {
                this.curveShapeSpaceNavigator.navigationCurveModel.currentCurve = this.curveModel.spline;
                this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve = this.curveModel.spline;
                this.clearListsOfDiffEvents();
                this.updateDiffEventsToDisplay();
                console.log("navigate at boundary")
                this.curveShapeSpaceNavigator.navigationCurveModel.navigateSpace(this.selectedControlPoint, x, y);
                if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.constraintsNotSatisfied)
                    console.log("Constraints not satisfied - new interaction Strategy");
                this.curveModel.setSpline(this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve);
                this._curveSceneController.curveModelDifferentialEventsExtractor.update(this.curveModel.spline);
                if(this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
                    // if(this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.isActive()) {
                    if(this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.isActive()) {
                        this.updateCurveAdjacentToShapeSpace();
                        this.convertNeighboringEventsIntoDiffEventsToDisplay();
                        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.deactivate();
                        this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
                    } else {
                        console.log("change interaction strategy to drag inside shape space");
                        this.clearListsOfDiffEvents();
                        this.updateDiffEventsToDisplay();
                        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.reset();
                        this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.reset();
                        this.curveModel.notifyObservers();
                        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
                        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve(this._curveSceneController));
                    }
                }
            }
            this.curveModel.notifyObservers();
            this.updateDiffEventsEnteringOnCurveAdjacentToShapeSpace();
            this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        }
    }

    processLeftMouseUpInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processLeftMouseUpInteraction ", "reset selected control point");
        message.logMessageToConsole();
        this.selectedControlPoint = null;
        this._curveSceneController.selectedControlPoint = null;
        this.clearListsOfDiffEvents();
        this.updateDiffEventsToDisplay();
        this.curveModel.notifyObservers();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPSelection(this._curveSceneController));
    }

    processShiftKeyDownInteraction(): void {
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", "free differential events");
        message.logMessageToConsole();
        this.clearListsOfDiffEvents();
        this.updateDiffEventsToDisplay();
        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.deactivate();
        // this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.boundaryEnforcer.addTransitionOfEvents(this.curveShapeSpaceNavigator.navigationState.currentNeighboringEvents);
        if(this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem instanceof OptProblemOpenBSplineR1toR2WithWeigthingFactorsStrictShapeSpace) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.deactivate();
            this.curveShapeSpaceNavigator.navigationCurveModel.curveShapeMonitoringStrategy.optimizationProblem.shapeSpaceBoundaryEnforcer.addTransitionOfEvents(this.curveShapeSpaceNavigator.navigationState.currentNeighboringEvents);
        }
        this.curveModel.notifyObservers();
        this._curveSceneController.curveModelDifferentialEventsExtractor.notifyObservers();
        this._curveSceneController.changeSceneInteraction(new CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve(this._curveSceneController));
    }

    clearListsOfDiffEvents(): void {
        this.curvatureExtEntering = [];
        this.curvatureExtSplippingOut = [];
        this.inflectionsEntering = [];
        this.inflectionsSplippingOut = [];
    }

    updateDiffEventsToDisplay(): void {
        this._curveSceneController.selectedSlipOutCurvatureExtremaView.updatePoints(this.curvatureExtSplippingOut);
        this._curveSceneController.selectedEnteringCurvatureExtremaView.updatePoints(this.curvatureExtEntering);
        this._curveSceneController.selectedSlipOutInflectionsView.updatePoints(this.inflectionsSplippingOut);
        this._curveSceneController.selectedEnteringInflectionsView.updatePoints(this.inflectionsEntering);
    }

    convertNeighboringEventsIntoDiffEventsToDisplay(): void {
        const sequenceOpt = this.curveShapeSpaceNavigator.navigationState.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        for(const neighboringEvents of this.curveShapeSpaceNavigator.navigationState.currentNeighboringEvents) {
            if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear) {
                this.curvatureExtEntering.push(0);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear) {
                this.curvatureExtEntering.push(this.curveModel.spline.knots[this.curveModel.spline.knots.length - 1]);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear) {
                const eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                this.curvatureExtSplippingOut.push(eventLocation);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear) {
                const eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                this.curvatureExtSplippingOut.push(eventLocation);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringCurvatureExtremaAppear) {
                const eventLocation1 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(0);
                this.curvatureExtEntering.push(eventLocation1.location);
                const eventLocation2 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(1);
                this.curvatureExtEntering.push(eventLocation2.location);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringCurvatureExtremaDisappear) {
                const eventLocation1 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(0);
                this.curvatureExtSplippingOut.push(eventLocation1.location);
                const eventLocation2 = this.curveShapeSpaceNavigator.navigationState.transitionEvents.eventAt(1);
                this.curvatureExtSplippingOut.push(eventLocation2.location);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear) {
                const eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                this.inflectionsSplippingOut.push(eventLocation);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionLeftBoundaryAppear) {
                this.inflectionsEntering.push(0);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionRightBoundaryDisappear) {
                const eventLocation = sequenceOpt.eventAt(neighboringEvents.index).location;
                this.inflectionsSplippingOut.push(eventLocation);
            } else if(neighboringEvents.type === NeighboringEventsType.neighboringInflectionRightBoundaryAppear) {
                this.inflectionsEntering.push(this.curveModel.spline.knots[this.curveModel.spline.knots.length - 1]);
            }
        }
        this.updateDiffEventsToDisplay();
    }

    updateCurveAdjacentToShapeSpace(): void {
        if(this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve !== undefined && !this.isNeighboringEventAtExtremity()) {
            this.adjacentShapeSpaceCurve = this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve;
            this._curveSceneController.highlightedControlPolygonView.update(this.adjacentShapeSpaceCurve);
            this._curveSceneController.phantomCurveView.update(this.adjacentShapeSpaceCurve);
        } else if(!this.isNeighboringEventAtExtremity()){
            this.adjacentShapeSpaceCurve = this.curveShapeSpaceNavigator.navigationCurveModel.optimizedCurve;
        }
        if(this.isNeighboringEventAtExtremity()) {
            this._displayPhantomEntities = false;
        } else {
            this._displayPhantomEntities = true;
        }
    }

    updateDiffEventsEnteringOnCurveAdjacentToShapeSpace(): void {
        if(this.curveShapeSpaceNavigator.navigationCurveModel.adjacentShapeSpaceCurve !== undefined && !this.isNeighboringEventAtExtremity()) {
            this._curveSceneController.selectedEnteringCurvatureExtremaView.update(this.adjacentShapeSpaceCurve);
            this._curveSceneController.selectedEnteringInflectionsView.update(this.adjacentShapeSpaceCurve);
            this.updateDiffEventsToDisplay();
        }
    }

    isNeighboringEventAtExtremity(): boolean {
        let result = false;
        const neighboringEvent = this.curveShapeSpaceNavigator.navigationCurveModel.navigationState.currentNeighboringEvents[0];
        switch(neighboringEvent.type) {
            case NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear:
                result = true;
                break;
            case NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear:
                result = true;
                break;
            case NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear:
                result = true;
                break;
            case NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear:
                result = true;
                break;
            case NeighboringEventsType.neighboringInflectionLeftBoundaryAppear:
                result = true;
                break;
            case NeighboringEventsType.neighboringInflectionLeftBoundaryDisappear:
                result = true;
                break;
            case NeighboringEventsType.neighboringInflectionRightBoundaryAppear:
                result = true;
                break;
            case NeighboringEventsType.neighboringInflectionRightBoundaryDisappear:
                result = true;
                break;
        }
        return result;
    }
}

export class CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingClosedCurve extends CurveSceneControllerStrictlyInsideShapeSpaceCPDraggingOpenCurve {

    constructor(curveSceneController: CurveSceneController) {
        super(curveSceneController);
    }

    processShiftKeyDownInteraction(): void {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessageToConsole();
    }

    processShiftKeyUpInteraction(): void {
        this.eventMgmtAtExtremities.processEventAtCurveExtremity();
        const message = new WarningLog(this.constructor.name, " processShiftKeyDownInteraction ", this.eventMgmtAtExtremities.eventStateAtCrvExtremities.constructor.name);
        message.logMessageToConsole();
    }
}