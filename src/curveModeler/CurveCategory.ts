import { CurveModeler } from "../curveModeler/CurveModeler";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { OpenCurveModel2D } from "../models/CurveModels2D";
import { WarningLog } from "../errorProcessing/ErrorLoging";

export abstract class CurveCategory {

    protected curveModeler: CurveModeler;

    constructor(curveModeler: CurveModeler) {
        this.curveModeler = curveModeler;
    }

    setCurveModeler(curveModeler: CurveModeler): void {
        this.curveModeler = curveModeler;
    }

    abstract setCurveCategoryToClosedPlanar(): void;

    abstract setCurveCategoryToOpenPlanar(): void;
}

export class OpenPlanarCurve extends CurveCategory {

    public curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    // JCL temporaire: pour assurer la compatibilité avec les classes existantes
    public curveModel: OpenCurveModel2D;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        // JCL temporaire: pour assurer la compatibilité avec les classes existantes
        this.curveModel = new OpenCurveModel2D();

        this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this.curveModeler);
    }
    setCurveCategoryToClosedPlanar(): void {
        this.curveModeler.changeCurveCategory(new ClosedPlanarCurve(this.curveModeler));
    }

    setCurveCategoryToOpenPlanar(): void {
        let warning = new WarningLog(this.constructor.name, "setCurveCategoryToOpenPlanar", "No curve category change there.");
        warning.logMessageToConsole();
    }
}

export class ClosedPlanarCurve extends CurveCategory {

    setCurveCategoryToOpenPlanar(): void {
        this.curveModeler.changeCurveCategory(new OpenPlanarCurve(this.curveModeler));
    }

    setCurveCategoryToClosedPlanar(): void {
        let warning = new WarningLog(this.constructor.name, "setCurveCategoryToOpenPlanar", "No curve category change there.");
        warning.logMessageToConsole();
    }
}