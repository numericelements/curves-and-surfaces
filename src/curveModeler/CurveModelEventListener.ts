import { CurveModel } from "../models/CurveModel";
import { CurveModeler } from "./CurveModeler";


export function curveModelEventListener(): CurveModel {

    const inputDegree = <HTMLSelectElement> document.getElementById("curveDegree");
    let currentCurveDegree = "3";
    const inputCurveCategory = <HTMLSelectElement> document.getElementById("curveCategory");
    let currentCurveCategory = "0";

    let curveModel: CurveModel;

    const curveModeler = new CurveModeler();
    curveModel = new CurveModel();

    function inputSelectDegree() {
        console.log("select:  " + inputDegree.value);
        let optionName = "option"
        let curveDegree: number;
        if(!isNaN(Number(inputDegree.value))){
            curveDegree = Number(inputDegree.value);
            currentCurveDegree = inputDegree.value;
            // sceneController.inputSelectDegree(curveDegree);
            if(curveDegree > 3) {
                for(let i = 1; i < (curveDegree - 2); i += 1) {
                    console.log("select" + optionName + i.toString());
                    let option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                    if(option !== null) option.setAttribute("disabled", "");
                    else throw new Error('No id found to identify an Option in the Selector');
                }
            }
        } else {
              throw new Error('The selected option cannot be converted into a Number');
        }
    }

    function inputSelectCurveCategory() {
        console.log("select" + inputCurveCategory.value);
        let curveCategory: number;
        curveCategory = Number(inputCurveCategory.value);
        currentCurveCategory = inputCurveCategory.value;
        // sceneController.inputSelectCurveCategoryProcess(curveCategory);
    }

    function clickSelectDegree() {
        console.log("select Degree click");
        inputDegree.value = currentCurveDegree;
    }

    function clickCurveCategory() {
        console.log("select Curve type click");
        inputCurveCategory.value = currentCurveCategory;
    }

        /* JCL 2020/10/07 Add event handlers for curve degree selection processing */
        inputDegree.addEventListener('input', inputSelectDegree);
        inputDegree.addEventListener('click', clickSelectDegree);

        inputCurveCategory.addEventListener('input', inputSelectCurveCategory);
        inputCurveCategory.addEventListener('click', clickCurveCategory);

    return curveModel;
}