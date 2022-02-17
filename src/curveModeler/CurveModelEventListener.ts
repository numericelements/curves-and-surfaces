import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { CurveModel, DEFAULT_CURVE_DEGREE } from "../models/CurveModel";
import { CurveShapeModelerUserInterface } from "../userInterfaceConntroller/CurveShapeModelerUserInterface";
import { CurveModeler } from "./CurveModeler";

export function curveModelEventListener(curveShapeModelerUserInterface: CurveShapeModelerUserInterface): CurveModel {

    let curveModel: CurveModel;

    const curveModeler = new CurveModeler();
    curveModel = new CurveModel();

    function inputSelectDegree() {
        console.log("select:  " + curveShapeModelerUserInterface.inputDegree.value);
        const optionName = "option";
        let curveDegree: number;
        if(!isNaN(Number(curveShapeModelerUserInterface.inputDegree.value))){
            curveDegree = Number(curveShapeModelerUserInterface.inputDegree.value);
            curveShapeModelerUserInterface.currentCurveDegree = curveShapeModelerUserInterface.inputDegree.value;
            // sceneController.inputSelectDegree(curveDegree);
            if(curveDegree > DEFAULT_CURVE_DEGREE) {
                for(let i = 1; i < (curveDegree - DEFAULT_CURVE_DEGREE + 1); i += 1) {
                    console.log("select" + optionName + i.toString());
                    const option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                    if(option !== null) option.setAttribute("disabled", "");
                    else {
                        const error = new ErrorLog("curveModelEventListener", "inputSelectDegree", "No ID found to identify an Option in the Selector.");
                        error.logMessageToConsole();
                    }
                }
            }
        } else {
            const error = new ErrorLog("curveModelEventListener", "inputSelectDegree", "The selected option cannot be converted into a Number");
            error.logMessageToConsole();
        }
    }

    function inputSelectCurveCategory() {
        console.log("select" + curveShapeModelerUserInterface.inputCurveCategory.value);
        let curveCategory: number;
        curveCategory = Number(curveShapeModelerUserInterface.inputCurveCategory.value);
        curveShapeModelerUserInterface.currentCurveCategory = curveShapeModelerUserInterface.inputCurveCategory.value;
        curveModeler.inputSelectCurveCategoryProcess(curveCategory);
        // sceneController.inputSelectCurveCategoryProcess(curveCategory);
    }

    function clickSelectDegree() {
        console.log("select Degree click");
        curveShapeModelerUserInterface.inputDegree.value = curveShapeModelerUserInterface.currentCurveDegree;
    }

    function clickCurveCategory() {
        console.log("select Curve type click");
        curveShapeModelerUserInterface.inputCurveCategory.value = curveShapeModelerUserInterface.currentCurveCategory;
    }

    /* JCL 2020/10/07 Add event handlers for curve degree selection processing */
    curveShapeModelerUserInterface.inputDegree.addEventListener('input', inputSelectDegree);
    curveShapeModelerUserInterface.inputDegree.addEventListener('click', clickSelectDegree);

    curveShapeModelerUserInterface.inputCurveCategory.addEventListener('input', inputSelectCurveCategory);
    curveShapeModelerUserInterface.inputCurveCategory.addEventListener('click', clickCurveCategory);

    return curveModel;
}