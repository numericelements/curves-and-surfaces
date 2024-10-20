import { BSplineR1toR2, create_BSplineR1toR2, create_BSplineR1toR2V2d } from "../newBsplines/BSplineR1toR2";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { IObservable, IObserver } from "../newDesignPatterns/Observer";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { saveAs } from "file-saver";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";

export class FileController {
// export class FileController implements IObservable<CurveModelInterface> {

    private readonly _curveModel: CurveModelInterface;
    private readonly _curveSceneController: CurveSceneController;
    private readonly curveModeler: ShapeNavigableCurve;

    constructor(curveModeler: ShapeNavigableCurve, curveSceneController: CurveSceneController) {
        this.curveModeler = curveModeler;
        this._curveModel = curveModeler.curveCategory.curveModel;
        this._curveSceneController = curveSceneController;
    }

    get curveModel() {
        return this._curveModel;
    }

    /* JCL 2020/10/13 Add curve serialization to file */
    saveCurveToFile(currentFileName: string): void {
        if(this._curveModel !== undefined) {
            const curveBlob = new Blob([JSON.stringify(this._curveModel.spline.knots) + JSON.stringify(this._curveModel.spline.controlPoints)],
                    { type: "application/json",});
            saveAs(curveBlob, currentFileName);
        } else {
            const error = new ErrorLog(this.constructor.name, "saveCurveToFile", "Cannot save the current curve to a file. Undefined curve model.");
            error.logMessage();
        }
    }

    inconsistentFileFormatMessage(): undefined {
        const warning = new WarningLog(this.constructor.name, "loadCurveFromFile", "inconsistent file format. Unable to load the curve.");
        warning.logMessage();
        return undefined;
    }

    loadCurveFromFile(aString: string): BSplineR1toR2;
    loadCurveFromFile(aString: string): undefined;
    loadCurveFromFile(aString: string): any {

        const locationClosingBracket = aString.indexOf("]");
        if(locationClosingBracket <= 0) this.inconsistentFileFormatMessage();

        const knotVector = aString.slice(0, locationClosingBracket + 1);
        const knots = JSON.parse(knotVector);
        if(typeof(knots) !== "object" ||
            (typeof(knots) === "object" && typeof(knots[0]) !== "number")) this.inconsistentFileFormatMessage();

        const controlPointVector = aString.slice(locationClosingBracket + 1);
        const controlPoints = JSON.parse(controlPointVector);
        if(typeof(controlPoints) !== "object" || 
            (typeof(controlPoints) === "object" && typeof(controlPoints[0].x) !== "number")) this.inconsistentFileFormatMessage();

        let CPs: Array<Vector2d> = [];
        for(let cp of controlPoints) {
            CPs.push(new Vector2d(cp.x, cp.y));
        }
        const tmpSpline = create_BSplineR1toR2V2d(CPs, knots);
        return tmpSpline;
    }

    resetCurveContext(knots: number[], controlPoints: Array<Vector2d>): void {
        const newSpline = create_BSplineR1toR2V2d(controlPoints, knots);
        if(this._curveModel !== undefined) {
            this._curveModel.setSpline(newSpline);
            this.curveModeler.notifyObservers();
            this._curveSceneController.curveModel = this._curveModel;
            this._curveSceneController.initCurveSceneView();
        } else {
            const error = new ErrorLog(this.constructor.name, "resetCurveContext", "Cannot load the current file content into a curve model. Undefined curve model.");
            error.logMessage();
        }
    }
}