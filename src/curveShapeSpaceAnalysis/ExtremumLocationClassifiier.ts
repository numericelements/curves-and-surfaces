import { sign } from "../linearAlgebra/MathVectorBasicOperations";

export const INITIAL_INDEX = -1;

interface ExtremumLocation {index: number, value: number};

export class ExtremumLocationClassifier {

    public globalExtremum: ExtremumLocation;
    private _localExtremum: Array<ExtremumLocation> = [];
    private controlPoints: number[] = [];

    constructor(controlPoints: number[]) {
        this.controlPoints = controlPoints;
        this.globalExtremum = { index: INITIAL_INDEX, value: 0.0};
    }


    getLocalMinima(): void {
        for(let i = 0; i < this.controlPoints.length - 2; i += 1) {
            if(sign(this.controlPoints[i]) === 1 && sign(this.controlPoints[i + 1]) === 1 && sign(this.controlPoints[i + 2]) === 1) {
                if(this.controlPoints[i] > this.controlPoints[i + 1] && this.controlPoints[i + 1] < this.controlPoints[i + 2]) {
                    this._localExtremum.push({index: (i + 1), value: this.controlPoints[i + 1]})
                }
            }
        }
    }

    getLocalMaxima(): void {
        for(let i = 0; i < this.controlPoints.length - 2; i += 1) {
            if(sign(this.controlPoints[i]) === -1 && sign(this.controlPoints[i + 1]) === -1 && sign(this.controlPoints[i + 2]) === -1) {
                if(this.controlPoints[i] < this.controlPoints[i + 1] && this.controlPoints[i + 1] > this.controlPoints[i + 2]) {
                    this._localExtremum.push({index: (i + 1), value: this.controlPoints[i + 1]})
                }
            }
        }
    }

    getGlobalMinimum(): boolean {
        this.getLocalMinima();
        this.sortLocalExtrema();
        if(this.globalExtremum.index !== INITIAL_INDEX) {
            return true;
        } else {
            return false;
        }
    }

    getGlobalMaximum(): boolean {
        this.getLocalMaxima();
        this.sortLocalExtrema();
        if(this.globalExtremum.index !== INITIAL_INDEX) {
            return true;
        } else {
            return false;
        }
    }

    sortLocalExtrema(): void {
        if(this._localExtremum.length > 0) {
            this._localExtremum.sort(function(a, b) {
                if (a.value > b.value) {
                  return 1;
                }
                if (a.value < b.value) {
                  return -1;
                }
                return 0;
            })
            this.globalExtremum = {index: this._localExtremum[0].index, value: this._localExtremum[0].value}
        }
    }

}