import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { ChartSceneController } from "../chartcontrollers/ChartSceneController";
import { resetChartContext } from "../chartviews/ChartEventListener";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { DEFAULT_CURVE_DEGREE } from "../models/CurveModel";
import { CurveShapeModelerUserInterface } from "../userInterfaceConntroller/CurveShapeModelerUserInterface";
import { FileController } from "./FileController";

export function fileEventListener(sceneController: CurveSceneController, chartSceneController: ChartSceneController,
    curveShapeModelerUserInterface: CurveShapeModelerUserInterface): void {

    /* JCL 2020/10/13 Get input IDs for file management purposes */
    const buttonFileLoad = <HTMLButtonElement> document.getElementById("buttonFileLoad")
    const buttonFileSave = <HTMLButtonElement> document.getElementById("buttonFileSave")
    const inputFileLoad = <HTMLInputElement>document.getElementById("inputFileLoad")
    const inputFileSave = <HTMLInputElement> document.getElementById("inputFileSave")
    const inputFileName = <HTMLInputElement> document.getElementById("inputFileName")
    const validateInput = <HTMLButtonElement> document.getElementById("validateInput")
    const labelFileExtension = <HTMLLabelElement> document.getElementById("labelFileExtension")
    
    const fileR = new FileReader();
    let aString = "";
    const fileController = new FileController(sceneController.curveModel!, sceneController);


    function buttonFileLoadCurve(ev: MouseEvent) {
        if(inputFileLoad !== null) inputFileLoad.click();
    }

    function buttonFileSaveCurve(ev: MouseEvent) {
        if(curveShapeModelerUserInterface.currentFileName === "") {
            inputFileName.style.display = "inline";
            labelFileExtension.style.display = "inline";
            validateInput.style.display = "inline";
        } else {
            fileController.saveCurveToFile(curveShapeModelerUserInterface.currentFileName);
        }
        ev.preventDefault();
    }

    function inputLoadFileCurve() {
        if(inputFileLoad !== null) {
            let aFileList = inputFileLoad.files;
            if(aFileList !== null && aFileList.length > 0) {
                if(aFileList.item(0)?.name !== undefined) {
                    let curveFile = aFileList.item(0);
                    if(curveFile !== null) {
                        inputFileLoad.value = ""
                        curveShapeModelerUserInterface.currentFileName = curveFile.name;
                        if(curveShapeModelerUserInterface.currentFileName.indexOf(".json") !== -1) {
                            fileR.readAsText(curveFile);
                        } else if(curveShapeModelerUserInterface.currentFileName.indexOf(".png") !== -1) {
                            console.log("read an image");
                            fileR.readAsArrayBuffer(curveFile);
                            /* for test purposes to load an image
                            // iconKnotInsertion.src = currentFileName
                            //imageFile = curveFile*/
                        }
                    }
                }
            }
        }
    }

    function inputSaveFileCurve() {
    }

    function inputCurveFileName() {
    }

    function inputButtonValidate() {
        curveShapeModelerUserInterface.currentFileName = inputFileName.value;
        console.log("inputButtonValidate:" + inputFileName.value)
        inputFileName.style.display = "none";
        labelFileExtension.style.display = "none";
        validateInput.style.display = "none";
        fileController.saveCurveToFile(curveShapeModelerUserInterface.currentFileName);
    }

    function getFileContent(ev: ProgressEvent): void {
        if(ev.target !== null) console.log("Reading the file" + curveShapeModelerUserInterface.currentFileName);
        if(fileR.readyState === fileR.DONE) {
            if(fileR.result !== null) {
                aString = "";
                if(typeof fileR.result === "string") {
                    aString = fileR.result.toString();
                    return;
                } else {
                    /* JCL 2020/10/16 fileR.result is of type ArrayBuffer */
                    if(curveShapeModelerUserInterface.currentFileName.indexOf(".png") !== -1) {
                        console.log("Input file is an image. No need to reinitialize curve controls.")
                        return
                    }
                }
            } else {
                const error = new ErrorLog("FileEventListener", "processInputFile", "Error when reading the input file. Incorrect text format.");
                error.logMessageToConsole();
            }
        }
    }

    function updateCurveDegreeSelector(aSpline: BSpline_R1_to_R2) {
        const newCurveDegree = aSpline.degree;
        if(newCurveDegree >= DEFAULT_CURVE_DEGREE) {
            const optionNumber = Number(curveShapeModelerUserInterface.currentCurveDegree) - DEFAULT_CURVE_DEGREE + 1;
            const optionName = "option";
            let option;
            for(let i = 1; i < (newCurveDegree - DEFAULT_CURVE_DEGREE + 1); i += 1) {
                option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                if(option !== null) option.setAttribute("disabled", "");
                else throw new Error('No id found to identify an Option in the Selector');
            }
            option = <HTMLOptionElement> document.getElementById(optionName + optionNumber);
            option.removeAttribute("selected");
            option = <HTMLOptionElement> document.getElementById(optionName + (newCurveDegree - 2).toString());
            option.setAttribute("selected", "selected");
            curveShapeModelerUserInterface.currentCurveDegree = newCurveDegree.toString();
            curveShapeModelerUserInterface.inputDegree.click();
        } else {
            const error = new ErrorLog("FileEventListener", "processInputFile", "Unable to assign a consistent curve degree when loading a curve. Curve degree must be greater or equal to 3.");
            error.logMessageToConsole();
        }
    }

    function resetCurveShapeControlButtons() {
        if(!sceneController.sliding) {
            curveShapeModelerUserInterface.toggleButtonSliding.click();
        }
        if(!sceneController.controlOfCurvatureExtrema) {
            curveShapeModelerUserInterface.toggleButtonCurvatureExtrema.click();
        }
        if(!sceneController.controlOfInflection) {
            curveShapeModelerUserInterface.toggleButtonInflection.click();
        }
        if(!sceneController.controlOfCurveClamping) {
            curveShapeModelerUserInterface.toggleButtonCurveClamping.click();
        }
    }

    function processInputFile(ev: ProgressEvent) {
        getFileContent(ev);
        const aSpline = fileController.loadCurveFromFile(aString);

        if(typeof(aSpline) !== "undefined") {
            updateCurveDegreeSelector(aSpline);
            resetCurveShapeControlButtons();
            fileController.resetCurveContext(aSpline.knots, aSpline.controlPoints);
            if(sceneController.curveModel === undefined) {
                const error = new ErrorLog("FileEventListener", "processInputFile", "Unable to get a curveModel to restart the chartSceneController.");
                error.logMessageToConsole();
                return;
            }
            resetChartContext(chartSceneController, sceneController.curveModel);
        } else {
            const error = new ErrorLog("FileEventListener", "processInputFile", "Unable to reset the curve context. Undefined curve model.");
            error.logMessageToConsole();
        }
    }


        /* JCL 2020/10/13 Add event handlers for file processing */
        buttonFileLoad.addEventListener('click', buttonFileLoadCurve);
        buttonFileSave.addEventListener('click', buttonFileSaveCurve);
        inputFileLoad.addEventListener('input', inputLoadFileCurve);
        inputFileSave.addEventListener('input', inputSaveFileCurve);
        inputFileName.addEventListener('input', inputCurveFileName);
        validateInput.addEventListener('click', inputButtonValidate);
        fileR.addEventListener('load', processInputFile);

}