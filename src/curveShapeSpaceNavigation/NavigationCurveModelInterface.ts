import { CurveModelInterface } from "../newModels/CurveModelInterface";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { NavigationState } from "./NavigationState";

export interface NavigationCurveModelInterface {

    navigationState: NavigationState;

    selectedControlPoint?: number;

    curveModel: CurveModelInterface;

    // sliding: boolean;

    // controlOfInflection: boolean;

    // controlOfCurvatureExtrema: boolean;

    shapeNavigableCurve: ShapeNavigableCurve;

    navigateSpace(selectedControlPoint: number, x: number, y: number): void;
}