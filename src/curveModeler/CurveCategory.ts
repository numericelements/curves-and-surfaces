import { CurveModeler } from "../curveModeler/CurveModeler";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { CurveModel } from "../models/CurveModel";

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
    public curveModel: CurveModel;

    constructor(curveModeler: CurveModeler) {
        super(curveModeler);
        // JCL temporaire: pour assurer la compatibilité avec les classes existantes
        this.curveModel = new CurveModel();

        this.curveShapeSpaceNavigator = new CurveShapeSpaceNavigator(this.curveModeler);
    }
    setCurveCategoryToClosedPlanar(): void {
        this.curveModeler.changeCurveCategory(new ClosedPlanarCurve(this.curveModeler));
    }

    setCurveCategoryToOpenPlanar(): void {
        console.log("No curve categoiry change there.");
    }
}

export class ClosedPlanarCurve extends CurveCategory {

    setCurveCategoryToOpenPlanar(): void {
        this.curveModeler.changeCurveCategory(new OpenPlanarCurve(this.curveModeler));
    }

    setCurveCategoryToClosedPlanar(): void {
        console.log("No curve categoiry change there.");
    }
}