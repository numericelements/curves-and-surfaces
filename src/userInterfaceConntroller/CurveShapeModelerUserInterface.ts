
export class CurveShapeModelerUserInterface {

    private _toggleButtonCurvatureExtrema:  HTMLButtonElement;
    private _toggleButtonInflection: HTMLButtonElement;
    private _toggleButtonSliding: HTMLButtonElement;
    private _toggleButtonCurveClamping: HTMLButtonElement;

    private _currentNavigationMode: string;
    private _inputNavigationMode: HTMLSelectElement;

    private _inputDegree: HTMLSelectElement;
    private _inputCurveCategory: HTMLSelectElement;
    private _currentCurveDegree: string;
    private _currentCurveCategory: string;

    private _currentFileName: string;

    constructor() {
        /* Get control button IDs for curve shape control*/
        this._toggleButtonCurvatureExtrema = <HTMLButtonElement> document.getElementById("toggleButtonCurvatureExtrema");
        this._toggleButtonInflection = <HTMLButtonElement> document.getElementById("toggleButtonInflections");
        this._toggleButtonSliding = <HTMLButtonElement> document.getElementById("toggleButtonSliding");
        this._toggleButtonCurveClamping = <HTMLButtonElement> document.getElementById("toggleButtonCurveClamping");
    
        /* Get control button IDs for curve shape control*/
        this._currentNavigationMode = "0";
        this._inputNavigationMode = <HTMLSelectElement> document.getElementById("navigationMode");

        /* Get selector ID for curve category and degree*/
        this._currentCurveDegree = "3";
        this._currentCurveCategory = "0";
        this._inputCurveCategory = <HTMLSelectElement> document.getElementById("curveCategory");
        this._inputDegree = <HTMLSelectElement> document.getElementById("curveDegree");

        this._currentFileName = "";
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

    get inputDegree() {
        return this._inputDegree;
    }

    get currentCurveDegree() {
        return this._currentCurveDegree;
    }

    set currentCurveDegree(curveDegree: string) {
        this._currentCurveDegree = curveDegree;
    }

    get currentFileName() {
        return this._currentFileName;
    }

    set currentFileName(fileName: string) {
        this._currentFileName = fileName;
    }

    get currentCurveCategory() {
        return this._currentCurveCategory;
    }

    set currentCurveCategory(curveCategory: string) {
        this._currentCurveCategory = curveCategory;
    }

    get inputCurveCategory() {
        return this._inputCurveCategory;
    }

    get currentNavigationMode() {
        return this._currentNavigationMode;
    }

    set currentNavigationMode(navigationMode: string) {
        this._currentNavigationMode = navigationMode;
    }

    get inputNavigationMode() {
        return this._inputNavigationMode;
    }
}