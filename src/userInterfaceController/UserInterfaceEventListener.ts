import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { ChartSceneController, CHART_TITLES } from "../chartcontrollers/ChartSceneController";
import { CurveSceneController } from "../controllers/CurveSceneController";
import { CurveModeler } from "../curveModeler/CurveModeler";
import { ActiveLocationControl, CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { IObserver } from "../designPatterns/Observer";
import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { FileController } from "../filecontrollers/FileController";
import { CurveModel, DEFAULT_CURVE_DEGREE } from "../models/CurveModel";
import { CurveModelObserverInChartEventListener, CurveModelObserverInCurveModelEventListener, CurveModelObserverInShapeSpaceNavigationEventListener } from "../models/CurveModelObserver";

// export abstract class UserInterfaceEventListener {

// }

// export class ChartEventListener extends UserInterfaceEventListener {
export class ChartEventListener {

    private _curveModel: CurveModel;
    private chartRenderingContext:  CanvasRenderingContext2D[] = [];
    private _chartSceneController: ChartSceneController;
    private canvasChart1: HTMLCanvasElement;
    private canvasChart2: HTMLCanvasElement;
    private canvasChart3: HTMLCanvasElement;
    private checkBoxFunctionA: HTMLButtonElement;
    private checkBoxFunctionB: HTMLButtonElement;
    private checkBoxFunctionBsqrtScaled: HTMLButtonElement;
    private checkBoxCurvature: HTMLButtonElement;
    private checkBoxAbsCurvature: HTMLButtonElement;

    private chartFunctionA: boolean;
    private chartFunctionB: boolean;
    private chartCurvatureCrv: boolean;
    private chartAbsCurvatureCurv: boolean;
    private chartFunctionBsqrtScaled: boolean;
    private noAddChart: boolean;

    private ctxChart1: CanvasRenderingContext2D | null;
    private ctxChart2: CanvasRenderingContext2D | null;
    private ctxChart3: CanvasRenderingContext2D | null;

    // private  static a: ChartEventListener

    constructor(curveModel: CurveModel) {
        // super();
        // ChartEventListener.a = this
        this._curveModel = curveModel;
        this.canvasChart1 = <HTMLCanvasElement> document.getElementById('chart1');
        this.canvasChart2 = <HTMLCanvasElement> document.getElementById('chart2');
        this.canvasChart3 = <HTMLCanvasElement> document.getElementById('chart3');

        this.checkBoxFunctionA = <HTMLButtonElement> document.getElementById("chkBoxFunctionA");
        this.checkBoxFunctionB = <HTMLButtonElement> document.getElementById("chkBoxFunctionB");
        this.checkBoxFunctionBsqrtScaled = <HTMLButtonElement> document.getElementById("chkBoxSqrtFunctionB");
        this.checkBoxCurvature = <HTMLButtonElement> document.getElementById("chkBoxCurvature");
        this.checkBoxAbsCurvature = <HTMLButtonElement> document.getElementById("chkBoxAbsCurvature");

        this.chartFunctionA = false;
        this.chartFunctionB = false;
        this.chartCurvatureCrv = false;
        this.chartAbsCurvatureCurv = false;
        this.chartFunctionBsqrtScaled = false;
        this.noAddChart = false;

        this.ctxChart1 = this.canvasChart1.getContext('2d');
        this.ctxChart2 = this.canvasChart2.getContext('2d');
        this.ctxChart3 = this.canvasChart3.getContext('2d');
        this.setupChartRenderingContexts();
        this._chartSceneController = new ChartSceneController(this.chartRenderingContext, this._curveModel);

        /* Add event handlers for checkbox processing */
        this.checkBoxFunctionA.addEventListener('click', this.chkboxFunctionA.bind(this));
        this.checkBoxFunctionB.addEventListener('click', this.chkboxFunctionB.bind(this));
        this.checkBoxFunctionBsqrtScaled.addEventListener('click', this.chkboxFunctionBsqrtScaled.bind(this));
        this.checkBoxCurvature.addEventListener('click', this.chkboxCurvature.bind(this));
        this.checkBoxAbsCurvature.addEventListener('click', this.chkboxAbsCurvature.bind(this));
    }

    get chartSceneController() {
        return this._chartSceneController;
    }

    get curveModel() {
        return this._curveModel;
    }
    set curveModel(curveModel:CurveModel) {
        this._curveModel = curveModel;
    }

    setupChartRenderingContexts(): void {
        if(this.ctxChart1 !== null) this.chartRenderingContext.push(this.ctxChart1);
        if(this.ctxChart2 !== null) this.chartRenderingContext.push(this.ctxChart2);
        if(this.ctxChart3 !== null) this.chartRenderingContext.push(this.ctxChart3);
        if(this.ctxChart1 === null || this.ctxChart2 === null || this.ctxChart3 === null) {
            const error = new ErrorLog(this.constructor.name, "setupChartRenderingContexts", "Unable to get one or more CanvasRenderingContext2D required to process charts.");
            error.logMessageToConsole();
        }
    }

    uncheckCkbox(): void {
        console.log("uncheckChart " + this._chartSceneController.uncheckedChart)
        if(CHART_TITLES.indexOf(this._chartSceneController.uncheckedChart) !== -1) {
            this.noAddChart = true;
            switch(this._chartSceneController.uncheckedChart) {
                case CHART_TITLES[0]:
                    console.log("uncheck " +CHART_TITLES[0])
                    this.checkBoxFunctionA.click();
                    break;
                case CHART_TITLES[1]:
                    console.log("uncheck " +CHART_TITLES[1])
                    this.checkBoxFunctionB.click();
                    break;
                case CHART_TITLES[2]:
                    console.log("uncheck " +CHART_TITLES[2])
                    this.checkBoxCurvature.click();
                    break;
                case CHART_TITLES[3]:
                    console.log("uncheck " +CHART_TITLES[3])
                    this.checkBoxAbsCurvature.click();
                    break;
                case CHART_TITLES[4]:
                    console.log("uncheck " +CHART_TITLES[4])
                    this.checkBoxFunctionBsqrtScaled.click();
                    break;
            }
        }
        this._chartSceneController.resetUncheckedChart();
        this.noAddChart = false;
    }

    chkboxFunctionA() {
        // if(ChartEventListener.a.chartFunctionA) {
        if(this.chartFunctionA) {
            this.chartFunctionA = false;
            if(!this.noAddChart) this._chartSceneController.addChart(CHART_TITLES[0]);
        } else {
            this.chartFunctionA = true;
            this._chartSceneController.addChart(CHART_TITLES[0]);
            this.uncheckCkbox();
        }
    }

    chkboxFunctionB() {
        if(this.chartFunctionB) {
            this.chartFunctionB = false;
            if(!this.noAddChart) this._chartSceneController.addChart(CHART_TITLES[1]);
        } else {
            this.chartFunctionB = true;
            this._chartSceneController.addChart(CHART_TITLES[1]);
            this.uncheckCkbox();
        }
    }

    chkboxFunctionBsqrtScaled() {
        if(this.chartFunctionBsqrtScaled) {
            this.chartFunctionBsqrtScaled = false;
            if(!this.noAddChart) this._chartSceneController.addChart(CHART_TITLES[4]);
        } else {
            this.chartFunctionBsqrtScaled = true;
            this._chartSceneController.addChart(CHART_TITLES[4]);
            this.uncheckCkbox();
        }
    }

    chkboxCurvature() {
        if(this.chartCurvatureCrv) {
            this.chartCurvatureCrv = false;
            if(!this.noAddChart) this._chartSceneController.addChart(CHART_TITLES[2]);
        } else {
            this.chartCurvatureCrv = true;
            this._chartSceneController.addChart(CHART_TITLES[2]);
            this.uncheckCkbox();
        }
    }

    chkboxAbsCurvature() {
        if(this.chartAbsCurvatureCurv) {
            this.chartAbsCurvatureCurv = false;
            if(!this.noAddChart) this._chartSceneController.addChart(CHART_TITLES[3]);
        } else {
            this.chartAbsCurvatureCurv = true;
            this._chartSceneController.addChart(CHART_TITLES[3]);
            this.uncheckCkbox();
        }
    }

    resetChartContext(): void {
        this._chartSceneController.restart(this._curveModel);
        this.noAddChart = true;
        if(this.chartFunctionA) this.checkBoxFunctionA.click();
        if(this.chartFunctionB) this.checkBoxFunctionB.click();
        if(this.chartCurvatureCrv) this.checkBoxCurvature.click();
        if(this.chartAbsCurvatureCurv) this.checkBoxAbsCurvature.click();
        if(this.chartFunctionBsqrtScaled) this.checkBoxFunctionBsqrtScaled.click();
        this.noAddChart = false;
    }
}

// export class FileEventListener extends UserInterfaceEventListener {
export class FileEventListener {

    private curveModel: CurveModel;
    private fileR: FileReader;
    private fileController: FileController;
    private chartEventListener: ChartEventListener;
    private curveModelEventListener: CurveModelerEventListener;
    private shapeSpaceNavigationEventListener: ShapeSpaceNavigationEventListener;
    private curveSceneController: CurveSceneController;
    private buttonFileLoad: HTMLButtonElement;
    private buttonFileSave: HTMLButtonElement;
    private inputFileLoad: HTMLInputElement;
    private inputFileSave: HTMLInputElement;
    private inputFileName: HTMLInputElement;
    private validateInput: HTMLButtonElement;
    private labelFileExtension: HTMLLabelElement;

    private currentFileName: string;

    constructor(curveModel: CurveModel, chartEventListener: ChartEventListener,
        curveModelEventListener: CurveModelerEventListener, shapeSpaceNavigationEventListener: ShapeSpaceNavigationEventListener,
        curveSceneController: CurveSceneController){
        // super();
        this.curveModel = curveModel;
        this.chartEventListener = chartEventListener;
        this.curveModelEventListener = curveModelEventListener;
        this.shapeSpaceNavigationEventListener = shapeSpaceNavigationEventListener;
        this.curveSceneController = curveSceneController;
        
        /* JCL 2020/10/13 Get input IDs for file management purposes */
        this.buttonFileLoad = <HTMLButtonElement> document.getElementById("buttonFileLoad");
        this.buttonFileSave = <HTMLButtonElement> document.getElementById("buttonFileSave");
        this.inputFileLoad = <HTMLInputElement>document.getElementById("inputFileLoad");
        this.inputFileSave = <HTMLInputElement> document.getElementById("inputFileSave");
        this.inputFileName = <HTMLInputElement> document.getElementById("inputFileName");
        this.validateInput = <HTMLButtonElement> document.getElementById("validateInput");
        this.labelFileExtension = <HTMLLabelElement> document.getElementById("labelFileExtension");

        this.fileR = new FileReader();
        this.fileController = new FileController(this.curveModel, this.curveSceneController);
        this.currentFileName = "";

        this.fileController.registerObserver(new CurveModelObserverInChartEventListener(this.chartEventListener));
        this.fileController.registerObserver(new CurveModelObserverInCurveModelEventListener(this.curveModelEventListener));
        this.fileController.registerObserver(new CurveModelObserverInShapeSpaceNavigationEventListener(this.shapeSpaceNavigationEventListener));

        /* JCL 2020/10/13 Add event handlers for file processing */
        this.buttonFileLoad.addEventListener('click', this.buttonFileLoadCurve.bind(this));
        this.buttonFileSave.addEventListener('click', this.buttonFileSaveCurve.bind(this));
        this.inputFileLoad.addEventListener('input', this.inputLoadFileCurve.bind(this));
        this.inputFileSave.addEventListener('input', this.inputSaveFileCurve.bind(this));
        this.inputFileName.addEventListener('input', this.inputCurveFileName.bind(this));
        this.validateInput.addEventListener('click', this.inputButtonValidate.bind(this));
        this.fileR.addEventListener('load', this.processInputFile.bind(this));
    }


    buttonFileLoadCurve(ev: MouseEvent) {
        if(this.inputFileLoad !== null) this.inputFileLoad.click();
    }

    buttonFileSaveCurve(ev: MouseEvent) {
        if(this.currentFileName === "") {
            this.inputFileName.style.display = "inline";
            this.labelFileExtension.style.display = "inline";
            this.validateInput.style.display = "inline";
        } else {
            this.fileController.saveCurveToFile(this.currentFileName);
        }
        ev.preventDefault();
    }

    inputLoadFileCurve() {
        if(this.inputFileLoad !== null) {
            let aFileList = this.inputFileLoad.files;
            if(aFileList !== null && aFileList.length > 0) {
                if(aFileList.item(0)?.name !== undefined) {
                    let curveFile = aFileList.item(0);
                    if(curveFile !== null) {
                        this.inputFileLoad.value = "";
                        this.currentFileName = curveFile.name;
                        if(this.currentFileName.indexOf(".json") !== -1) {
                            this.fileR.readAsText(curveFile);
                        } else if(this.currentFileName.indexOf(".png") !== -1) {
                            console.log("read an image");
                            this.fileR.readAsArrayBuffer(curveFile);
                            /* for test purposes to load an image
                            // iconKnotInsertion.src = currentFileName
                            //imageFile = curveFile*/
                        }
                    }
                }
            }
        }
    }

    inputSaveFileCurve() {
    }

    inputCurveFileName() {
    }

    inputButtonValidate() {
        this.currentFileName = this.inputFileName.value;
        console.log("inputButtonValidate:" + this.inputFileName.value)
        this.inputFileName.style.display = "none";
        this.labelFileExtension.style.display = "none";
        this.validateInput.style.display = "none";
        this.fileController.saveCurveToFile(this.currentFileName);
    }

    getFileContent(ev: ProgressEvent): void {
        if(ev.target !== null) console.log("Reading the file: " + this.currentFileName);
        if(this.fileR.readyState === this.fileR.DONE) {
            if(this.fileR.result !== null) {
                this.currentFileName = "";
                if(typeof this.fileR.result === "string") {
                    this.currentFileName = this.fileR.result.toString();
                    return;
                } else {
                    /* JCL 2020/10/16 fileR.result is of type ArrayBuffer */
                    if(this.currentFileName.indexOf(".png") !== -1) {
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

    processInputFile(ev: ProgressEvent) {
        this.getFileContent(ev);
        const aSpline = this.fileController.loadCurveFromFile(this.currentFileName);

        if(typeof(aSpline) !== "undefined") {
            this.fileController.resetCurveContext(aSpline.knots, aSpline.controlPoints);
            this.curveModel = this.fileController.curveModel;
            if(this.curveModel === undefined) {
                const error = new ErrorLog("FileEventListener", "processInputFile", "Unable to get a curveModel to restart the chartSceneController.");
                error.logMessageToConsole();
                return;
            }
        } else {
            const error = new ErrorLog("FileEventListener", "processInputFile", "Unable to reset the curve context. Undefined curve model.");
            error.logMessageToConsole();
        }
    }

}

// export class CurveModelerEventListener extends UserInterfaceEventListener {
export class CurveModelerEventListener {

    private _curveModeler: CurveModeler;
    private _curveModel: CurveModel;
    private _inputCurveCategory: HTMLSelectElement;
    private _inputDegree: HTMLSelectElement;
    private _currentCurveDegree: string;
    private _currentCurveCategory: string;

    public activeLocationControl: ActiveLocationControl

    constructor() {
        // super();
        /* Get selector ID for curve category and degree*/
        this._currentCurveDegree = "3";
        this._currentCurveCategory = "0";
        this._inputCurveCategory = <HTMLSelectElement> document.getElementById("curveCategory");
        this._inputDegree = <HTMLSelectElement> document.getElementById("curveDegree");

        // to be used later
        this._curveModeler = new CurveModeler();
        this._curveModel = new CurveModel();
        this.activeLocationControl = this._curveModeler.curveShapeSpaceNavigator.activeLocationControl

        /* JCL  Add event handlers for curve degree and curve category selection processing */
        this._inputDegree.addEventListener('input', this.inputSelectDegree.bind(this));
        this._inputDegree.addEventListener('click', this.clickSelectDegree.bind(this));

        this._inputCurveCategory.addEventListener('input', this.inputSelectCurveCategory.bind(this));
        this._inputCurveCategory.addEventListener('click', this.clickCurveCategory.bind(this));
    }

    get currentCurveDegree() {
        return this._currentCurveDegree;
    }

    set currentCurveDegree(curveDegree: string) {
        this._currentCurveDegree = curveDegree;
    }

    get inputDegree() {
        return this._inputDegree;
    }

    get curveModel() {
        return this._curveModel;
    }

    set curveModel(curveModel: CurveModel) {
        this._curveModel = curveModel;
    }

    get curveModeler() {
        return this._curveModeler;
    }

    set curveModeler(curveModeler: CurveModeler) {
        this._curveModeler = curveModeler;
    }

    clickSelectDegree() {
        console.log("select Degree click");
        this._inputDegree.value = this._currentCurveDegree;
    }

    clickCurveCategory() {
        console.log("select Curve type click");
        this._inputCurveCategory.value = this._currentCurveCategory;
    }

    inputSelectCurveCategory() {
        console.log("select" + this._inputCurveCategory.value);
        let curveCategory: number;
        curveCategory = Number(this._inputCurveCategory.value);
        this._currentCurveCategory = this._inputCurveCategory.value;
        this.curveModeler.inputSelectCurveCategory(curveCategory);
    }

    inputSelectDegree() {
        console.log("select:  " + this._inputDegree.value);
        const optionName = "option";
        let curveDegree: number;
        if(!isNaN(Number(this._inputDegree.value))){
            curveDegree = Number(this._inputDegree.value);
            this._currentCurveDegree = this._inputDegree.value;
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

    updateCurveDegreeSelector(newCurveDegree: number): void {
        if(newCurveDegree >= DEFAULT_CURVE_DEGREE) {
            const optionNumber = Number(this.currentCurveDegree) - DEFAULT_CURVE_DEGREE + 1;
            const optionName = "option";
            let option;
            for(let i = 1; i < (newCurveDegree - DEFAULT_CURVE_DEGREE + 1); i += 1) {
                option = <HTMLOptionElement> document.getElementById(optionName + i.toString());
                if(option !== null) option.setAttribute("disabled", "");
                else
                {
                    const error = new ErrorLog(this.constructor.name, "updateCurveDegreeSelector", "No id found to identify an Option in the Selector.");
                    error.logMessageToConsole();
                }
            }
            option = <HTMLOptionElement> document.getElementById(optionName + optionNumber);
            option.removeAttribute("selected");
            option = <HTMLOptionElement> document.getElementById(optionName + (newCurveDegree - 2).toString());
            option.setAttribute("selected", "selected");
            this.currentCurveDegree = newCurveDegree.toString();
            this.inputDegree.click();
        } else {
            const error = new ErrorLog("FileEventListener", "processInputFile", "Unable to assign a consistent curve degree when loading a curve. Curve degree must be greater or equal to 3.");
            error.logMessageToConsole();
        }
    }
}

// export class ShapeSpaceNavigationEventListener extends UserInterfaceEventListener {
export class ShapeSpaceNavigationEventListener {

    private _toggleButtonCurvatureExtrema:  HTMLButtonElement;
    private _toggleButtonInflection: HTMLButtonElement;
    private _toggleButtonSliding: HTMLButtonElement;
    private _toggleButtonCurveClamping: HTMLButtonElement;

    private _currentNavigationMode: string;
    private _inputNavigationMode: HTMLSelectElement;
    private _curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    private controlOfCurvatureExtrema: boolean;
    private controlOfInflection: boolean;
    private sliding: boolean;
    private controlOfCurveClamping: boolean;

    private sceneController: CurveSceneController;

    constructor(curveModeler: CurveModeler, sceneController: CurveSceneController) {
        // super();
        this.sceneController = sceneController;
        this._curveShapeSpaceNavigator = curveModeler.curveShapeSpaceNavigator;
        /* Get control button IDs for curve shape control*/
        this._toggleButtonCurvatureExtrema = <HTMLButtonElement> document.getElementById("toggleButtonCurvatureExtrema");
        this._toggleButtonInflection = <HTMLButtonElement> document.getElementById("toggleButtonInflections");
        this._toggleButtonSliding = <HTMLButtonElement> document.getElementById("toggleButtonSliding");
        this._toggleButtonCurveClamping = <HTMLButtonElement> document.getElementById("toggleButtonCurveClamping");
    
        /* Get control button IDs for curve shape control*/
        this._currentNavigationMode = "0";
        this._inputNavigationMode = <HTMLSelectElement> document.getElementById("navigationMode");


        this.controlOfCurvatureExtrema = true;
        this.controlOfInflection = true;
        this.sliding = true;
        this.controlOfCurveClamping = true;

        this._inputNavigationMode.addEventListener('input', this.inputSelectNavigationMode.bind(this));
        this._inputNavigationMode.addEventListener('click', this.clickNavigationMode.bind(this));

        this._toggleButtonCurvatureExtrema.addEventListener('click', this.toggleControlOfCurvatureExtrema.bind(this));
        this._toggleButtonInflection.addEventListener('click', this.toggleControlOfInflections.bind(this));
        this._toggleButtonSliding.addEventListener('click', this.toggleSliding.bind(this));
        this._toggleButtonCurveClamping.addEventListener('click', this.toggleCurveClamping.bind(this));
    }

    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }

    get toggleButtonCurvatureExtrema() {
        return this._toggleButtonCurvatureExtrema;
    }

    get toggleButtonInflection() {
        return this._toggleButtonInflection;
    }

    get toggleButtonSliding() {
        return this._toggleButtonSliding;
    }

    get toggleButtonCurveClamping() {
        return this._toggleButtonCurveClamping;
    }

    toggleControlOfCurvatureExtrema() {
        this.controlOfCurvatureExtrema = !this.controlOfCurvatureExtrema;
        this._curveShapeSpaceNavigator.toggleControlOfCurvatureExtrema();
    }

    toggleControlOfInflections() {
        this.controlOfInflection = !this.controlOfInflection;
        this._curveShapeSpaceNavigator.toggleControlOfInflections();
    }

    toggleSliding() {
        this.sliding = !this.sliding;
        this._curveShapeSpaceNavigator.toggleSliding();
    }

    toggleCurveClamping() {
        this.controlOfCurveClamping = !this.controlOfCurveClamping;
        this.sceneController.toggleCurveClamping();
    }

    clickNavigationMode() {
        console.log("select Navigation click");
        this._inputNavigationMode.value = this._currentNavigationMode;
    }

    inputSelectNavigationMode() {
        console.log("select" + this._inputNavigationMode.value);
        const navigationMode = Number(this._inputNavigationMode.value);
        this._currentNavigationMode = this._inputNavigationMode.value;
        this.curveShapeSpaceNavigator.inputSelectNavigationProcess(navigationMode);
    }

    resetCurveShapeControlButtons() {
        if(!this.sliding) {
            this._toggleButtonSliding.click();
        }
        if(!this.controlOfCurvatureExtrema) {
            this._toggleButtonCurvatureExtrema.click();
        }
        if(!this.controlOfInflection) {
            this._toggleButtonInflection.click();
        }
        if(!this.controlOfCurveClamping) {
            this._toggleButtonCurveClamping.click();
        }
    }

}
