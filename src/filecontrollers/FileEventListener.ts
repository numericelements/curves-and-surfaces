import { ChartSceneController } from "../chartcontrollers/ChartSceneController"
import { resetChartContext } from "../chartviews/ChartEventListener"
import { CurveSceneController } from "../controllers/CurveSceneController"
import { ErrorLog } from "../errorProcessing/ErrorLoging"
import { currentCurveDegree, inputDegree, toggleButtonCurvatureExtrema, toggleButtonCurveClamping, toggleButtonInflection, toggleButtonSliding } from "../main"

export function fileEventListener(sceneController: CurveSceneController, chartSceneController: ChartSceneController): string {
// function fileEventListener(sceneController: CurveSceneController, chartSceneController: ChartSceneController): string {

    /* JCL 2020/10/13 Get input IDs for file management purposes */
    const buttonFileLoad = <HTMLButtonElement> document.getElementById("buttonFileLoad")
    const buttonFileSave = <HTMLButtonElement> document.getElementById("buttonFileSave")
    const inputFileLoad = <HTMLInputElement>document.getElementById("inputFileLoad")
    const inputFileSave = <HTMLInputElement> document.getElementById("inputFileSave")
    const inputFileName = <HTMLInputElement> document.getElementById("inputFileName")
    const validateInput = <HTMLButtonElement> document.getElementById("validateInput")
    const labelFileExtension = <HTMLLabelElement> document.getElementById("labelFileExtension")
    
    let currentFileName: string = ""
    const fileR = new FileReader()
    let updatedCurrentDegree = currentCurveDegree;


    function buttonFileLoadCurve(ev: MouseEvent) {
        if(inputFileLoad !== null) inputFileLoad.click();
    }

    function buttonFileSaveCurve(ev: MouseEvent) {
        if(currentFileName === "") {
            inputFileName.style.display = "inline";
            labelFileExtension.style.display = "inline";
            validateInput.style.display = "inline";
        }
        else {
            sceneController.saveCurveToFile(currentFileName);
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
                        currentFileName = curveFile.name;
                        if(currentFileName.indexOf(".json") !== -1) {
                            fileR.readAsText(curveFile);
                        } else if(currentFileName.indexOf(".png") !== -1) {
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
        currentFileName = inputFileName.value;
        console.log("inputButtonValidate:" + inputFileName.value)
        inputFileName.style.display = "none";
        labelFileExtension.style.display = "none";
        validateInput.style.display = "none";
        sceneController.saveCurveToFile(currentFileName);
    }

    function processInputFile(ev: ProgressEvent) {
        if(ev.target !== null) console.log("Reading the file" + currentFileName);
        if(fileR.readyState === fileR.DONE) {
            if(fileR.result !== null) {
                let aString = "";
                if(typeof fileR.result === "string") {
                    aString = fileR.result.toString();
                } else {
                    /* JCL 2020/10/16 fileR.result is of type ArrayBuffer */
                    if(currentFileName.indexOf(".png") !== -1) {
                        console.log("Input file is an image. No need to reinitialize curve controls.")
                        return
                    }
                }
                let aSpline = sceneController.loadCurveFromFile(aString);

                if(typeof(aSpline) !== "undefined") {
                    /* JCL 2020/10/18 Reconfigure the degree selector */
                    let newCurveDegree = aSpline.degree;
                    if(newCurveDegree >= 3) {
                        let optionNumber = Number(currentCurveDegree) - 2;
                        let optionName = "option";
                        let option;
                        for(let i = 1; i < (newCurveDegree - 2); i += 1) {
                            option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                            if(option !== null) option.setAttribute("disabled", "");
                            else throw new Error('No id found to identify an Option in the Selector');
                        }
                        option = <HTMLOptionElement> document.getElementById(optionName + optionNumber);
                        option.removeAttribute("selected");
                        option = <HTMLOptionElement> document.getElementById(optionName + (newCurveDegree - 2).toString());
                        option.setAttribute("selected", "selected");
                        // for(let i = (newCurveDegree - 2); i <= 4; i += 1) {
                        //     option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                        //     if(option !== null) option.setAttribute("disabled", "disabled");
                        //     // if(option !== null) option.removeAttribute("disabled");
                        //     else throw new Error('No id found to identify an Option in the Selector');
                        // }
                        updatedCurrentDegree = newCurveDegree.toString();
                        // currentCurveDegree = newCurveDegree.toString();
                        inputDegree.click();
                    } else {
                        throw new Error("Unable to assign a consistent curve degree when loading a curve. Curve degree must be greater or equal to 3.");
                    }
                } else throw new Error("Unable to update the curve degree selector. Undefined curve model");

                /* JCL 2020/10/18 Reset the appropriate control buttons */
                if(!sceneController.sliding) {
                    toggleButtonSliding.click()
                }
                if(!sceneController.controlOfCurvatureExtrema) {
                    toggleButtonCurvatureExtrema.click()
                }
                if(!sceneController.controlOfInflection) {
                    toggleButtonInflection.click()
                }
                if(!sceneController.controlOfCurveClamping) {
                    toggleButtonCurveClamping.click()
                }
                if(typeof(aSpline) !== "undefined") {
                    sceneController.resetCurveContext(aSpline.knots, aSpline.controlPoints);
                    if(sceneController.curveModel === undefined) {
                        const error = new ErrorLog("main", "processInputFile", "Unable to get a curveModel to restart the chartSceneController.");
                        error.logMessageToConsole();
                        return;
                    }
                    resetChartContext(chartSceneController, sceneController.curveModel);
                } else throw new Error("Unable to reset the curve context. Undefined curve model");
                // to be discussed
                //sceneController = new CurveSceneController(canvas, gl, , curveModel)

            } else {
                throw new Error('Error when reading the input file. Incorrect text format.');
            } 
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

    return updatedCurrentDegree;
}