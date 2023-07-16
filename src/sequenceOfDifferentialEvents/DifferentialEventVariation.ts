import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR1Interface } from "../newBsplines/BSplineR1toR1Interface";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { findSpan } from "../newBsplines/Piegl_Tiller_NURBS_Book";
import { ComparatorOfSequencesOfDiffEvents, RETURN_ERROR_CODE } from "./ComparatorOfSequencesDiffEvents";
import { NeighboringEvents } from "./NeighboringEvents";
import { SequenceOfDifferentialEvents } from "./SequenceOfDifferentialEvents";

export class DiffrentialEventVariation {

    private _sequenceDiffEvents1: SequenceOfDifferentialEvents;
    private _sequenceDiffEvents2: SequenceOfDifferentialEvents;
    private _curveAnalyser1: CurveAnalyzerInterface;
    private _curveAnalyser2: CurveAnalyzerInterface;
    private _neighboringEvents: NeighboringEvents[];
    private _extremumValue: number;
    private _extremumValueOpt: number;
    private _extremumLocation: number;
    private _extremumLocationOpt: number;
    private _span: number;
    private _rangeOfInfluence: number;
    private _CPvariations: number[];
    

    constructor(curveAnalyserCurrentCurve: CurveAnalyzerInterface, curveAnalyserOptimizedCurve: CurveAnalyzerInterface) {
        this._curveAnalyser1 = curveAnalyserCurrentCurve;
        this._curveAnalyser2 = curveAnalyserOptimizedCurve;
        this._sequenceDiffEvents1 = this._curveAnalyser1.sequenceOfDifferentialEvents;
        this._sequenceDiffEvents2 = this._curveAnalyser2.sequenceOfDifferentialEvents;
        this._extremumValue = 0.0;
        this._extremumValueOpt = 0.0;
        this._extremumLocation = -1.0;
        this._extremumLocationOpt = -1.0;
        this._span = -1;
        this._rangeOfInfluence = 0;
        this._CPvariations = [];
        const seqComparator = new ComparatorOfSequencesOfDiffEvents(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
        seqComparator.locateNeiboringEvents();
        this._neighboringEvents = seqComparator.neighboringEvents;
    }

    get neighboringEvents(): NeighboringEvents[] {
        return this._neighboringEvents.slice();
    }

    get curveAnalyser1(): CurveAnalyzerInterface {
        return this._curveAnalyser1;
    }

    get curveAnalyser2(): CurveAnalyzerInterface {
        return this._curveAnalyser2;
    }

    get extremumValue(): number {
        return this._extremumValue;
    }

    get extremumValueOpt(): number {
        return this._extremumValueOpt;
    }

    get extremumLocation(): number {
        return this._extremumLocation;
    }

    get extremumLocationOpt(): number {
        return this._extremumLocationOpt;
    }

    get span(): number {
        return this._span;
    }

    get rangeOfInfluence(): number {
        return this._rangeOfInfluence;
    }

    get CPvariations(): number[] {
        return this._CPvariations.slice();
    }

    set neighboringEvents(neighboringEvents: NeighboringEvents[]) {
        this._neighboringEvents = neighboringEvents.slice();
    }

    set curveAnalyser1(curveAnalyser: CurveAnalyzerInterface) {
        this._curveAnalyser1 = curveAnalyser;
    }

    set curveAnalyser2(curveAnalyser: CurveAnalyzerInterface) {
        this._curveAnalyser2 = curveAnalyser;
    }

    set extremumValue(extremumValue: number) {
        this._extremumValue = extremumValue;
    }

    set extremumValueOpt(extremumValueOpt: number) {
        this._extremumValueOpt = extremumValueOpt;
    }

    set extremumLocation(extremumLocation: number) {
        this._extremumLocation = extremumLocation;
    }

    set extremumLocationOpt(extremumLocationOpt: number) {
        this._extremumLocationOpt = extremumLocationOpt;
    }

    set span(span: number) {
        this._span = span;
    }

    set rangeOfInfluence(rangeOfInfluence: number) {
        this._rangeOfInfluence = rangeOfInfluence;
    }

    set CPvariations(CPvariations: number[]) {
        this._CPvariations = CPvariations.slice();
    }

    neighboringEventsAt(index: number): NeighboringEvents {
        return this._neighboringEvents[index];
    }

    variationDifferentialEvents() {
        const curvatureDerivativeNumeratorOpt = this._curveAnalyser2.curvatureDerivativeNumerator;
        const curvatureDerivativeExtremaLocationsOpt = curvatureDerivativeNumeratorOpt.derivative().zeros();
        const curvatureDerivativeZerosLocationsOpt = curvatureDerivativeNumeratorOpt.zeros();

        const curvatureDerivativeNumerator = this._curveAnalyser1.curvatureDerivativeNumerator;
        const curvatureDerivativeExtremaLocations = curvatureDerivativeNumerator.derivative().zeros();
        const curvatureDerivativeZerosLocations = curvatureDerivativeNumerator.zeros();

        if((curvatureDerivativeZerosLocationsOpt.length - curvatureDerivativeZerosLocations.length) % 2 === 0) {
            /* JCL 06/03/2021 Configuration where one or more couples of extrema appeared */
            let curvatureExtremumInterval: number[] = [];
            // let variationsOptim1_2: number[] = []
            for(let exLocOpt = 0; exLocOpt < curvatureDerivativeExtremaLocationsOpt.length; exLocOpt +=1) {
                const currentNbExtremumLocations = curvatureExtremumInterval.length;
                const curvatureDerivExtremumOpt =  curvatureDerivativeNumeratorOpt.evaluate(curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                let extremumLocationFound = false;
                for(let zeroLoc = 0; zeroLoc < curvatureDerivativeZerosLocationsOpt.length - 1; zeroLoc+=1) {
                    if(curvatureDerivativeExtremaLocationsOpt[exLocOpt] > curvatureDerivativeZerosLocationsOpt[zeroLoc]
                        && curvatureDerivativeExtremaLocationsOpt[exLocOpt] < curvatureDerivativeZerosLocationsOpt[zeroLoc + 1]) {
                        curvatureExtremumInterval.push(zeroLoc);
                        extremumLocationFound = true;
                        if(curvatureDerivativeExtremaLocations.length === curvatureDerivativeExtremaLocationsOpt.length) {
                            this._extremumValue = curvatureDerivativeNumerator.evaluate(curvatureDerivativeExtremaLocations[exLocOpt]);
                            this._extremumLocation = curvatureDerivativeExtremaLocations[exLocOpt];
                        } else {
                            let minDist = Math.abs(curvatureDerivativeExtremaLocations[0] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                            let indexMin = 0;
                            for(let exLoc = 1; exLoc < curvatureDerivativeExtremaLocations.length; exLoc +=1) {
                                if(Math.abs(curvatureDerivativeExtremaLocations[exLoc] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]) < minDist) {
                                    minDist = Math.abs(curvatureDerivativeExtremaLocations[exLoc] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                                    indexMin = exLoc;
                                }
                            }
                            this._extremumValue = curvatureDerivativeNumerator.evaluate(curvatureDerivativeExtremaLocations[indexMin]);
                            this._extremumLocation = curvatureDerivativeExtremaLocations[indexMin];
                        }
                        const curvatureDerivExtremumOpt =  curvatureDerivativeNumeratorOpt.evaluate(curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                        this._extremumValueOpt = curvatureDerivExtremumOpt;
                        this._extremumLocationOpt = curvatureDerivativeExtremaLocationsOpt[exLocOpt];
                    }
                }
                if(extremumLocationFound) {
                    if(this._extremumValue * this._extremumValueOpt > 0) {
                        console.log("Inconsistency of function B(u) extrema values functionBExtremum: " + this._extremumValue + " functionBOptimExtremum" + this._extremumValueOpt)
                    }
    
                    if(currentNbExtremumLocations === curvatureExtremumInterval.length) console.log("Problem to locate a curvature derivative extremum. ")
                    if(curvatureDerivExtremumOpt > 0.0) {
                        for(let j = 0; j < curvatureDerivativeNumeratorOpt.controlPoints.length; j +=1) {
                            // variationsOptim1_2.push(curvatureDerivativeNumeratorOpt.controlPoints[j] - functionBOptim.controlPoints[j])
                            // variations1.push(functionBOptim.controlPoints[j] - curvatureDerivativeNumerator.controlPoints[j])
                            this._CPvariations.push(curvatureDerivativeNumeratorOpt.controlPoints[j] - curvatureDerivativeNumerator.controlPoints[j]);
                        }
                        console.log("variations1_2: " + this._CPvariations)
                    }
                    const span = findSpan(this._extremumLocation, curvatureDerivativeNumerator.knots, curvatureDerivativeNumerator.degree);
                    const spanOptim = findSpan(this._extremumLocationOpt, curvatureDerivativeNumeratorOpt.knots, curvatureDerivativeNumeratorOpt.degree);
                    const curveDegree = curvatureDerivativeNumerator.degree;
                    if(span === spanOptim) {
                        this._span = span;
                        this._rangeOfInfluence = curveDegree;
                    } else {
                        if(span < spanOptim) {
                            this._span = span;
                            this._rangeOfInfluence = curveDegree + spanOptim - span;
                        } else {
                            this._span = spanOptim;
                            this._rangeOfInfluence = curveDegree + span - spanOptim;
                        }
                    }
                }
            }
        } else {

        }
    }

    updateCPDisplacement(currentCurve: BSplineR1toR2Interface, selectedControlPoint: number, x: number, y: number): Vector2d {
        let newDisplacement = new Vector2d();
        const controlPointsInit = currentCurve.controlPoints;
        let ratio = Math.abs(this._extremumValue/(this._extremumValueOpt - this._extremumValue));
        newDisplacement.x = controlPointsInit[selectedControlPoint].x + (x - controlPointsInit[selectedControlPoint].x) * ratio;
        newDisplacement.y = controlPointsInit[selectedControlPoint].y + (y - controlPointsInit[selectedControlPoint].y) * ratio;
        return newDisplacement;
    }

    updateExtremumValueOptimized(curvatureDerivativeNumeratorOptimized: BSplineR1toR1Interface): void {
        const curvatureDerivativeNumeratorOpt = curvatureDerivativeNumeratorOptimized;
        const curvatureDerivativeExtremaLocationsOpt = curvatureDerivativeNumeratorOpt.derivative().zeros();
        const curvatureDerivativeZerosLocationsOpt = curvatureDerivativeNumeratorOpt.zeros();

        const curvatureDerivativeNumerator = this._curveAnalyser1.curvatureDerivativeNumerator;
        const curvatureDerivativeZerosLocations = curvatureDerivativeNumerator.zeros();

        if((curvatureDerivativeZerosLocationsOpt.length - curvatureDerivativeZerosLocations.length) % 2 === 0 
            && curvatureDerivativeZerosLocationsOpt.length !== curvatureDerivativeZerosLocations.length) {
            /* JCL 06/03/2021 Configuration where one or more couples of extrema appeared */
            let updateExtremumValue = false;
            for(const exLocOpt of curvatureDerivativeExtremaLocationsOpt) {
                let extremumLocationFound = false;
                for(let zeroLoc = 0; zeroLoc < curvatureDerivativeZerosLocationsOpt.length - 1; zeroLoc+=1) {
                    if(exLocOpt > curvatureDerivativeZerosLocationsOpt[zeroLoc]
                        && exLocOpt < curvatureDerivativeZerosLocationsOpt[zeroLoc + 1]) {
                        extremumLocationFound = true;
                        const curvatureDerivExtremumOpt =  curvatureDerivativeNumeratorOpt.evaluate(exLocOpt);
                        this._extremumValueOpt = curvatureDerivExtremumOpt;
                        updateExtremumValue = true;
                    }
                }
                if(extremumLocationFound && this._extremumValue * this._extremumValueOpt > 0) {
                    console.log("Inconsistency of function B(u) extrema values functionBExtremum: " + this._extremumValue + " functionBOptimExtremum" + this._extremumValueOpt);
                }
            }
            if(!updateExtremumValue) {
                console.log("Extremum has not been correctly located and not updated.");
            }
        } else {
            let closestExt = curvatureDerivativeNumerator.getExtremumClosestToZero();
            if(closestExt.location !== RETURN_ERROR_CODE) {
                this._extremumLocation = closestExt.location;
                this._extremumValue = closestExt.value;
            }
            let closestExtOpt = curvatureDerivativeNumeratorOpt.getExtremumClosestToZero();
            if(closestExtOpt.location !== RETURN_ERROR_CODE) {
                this._extremumLocationOpt = closestExtOpt.location;
                this._extremumValueOpt = closestExtOpt.value;
            }
        }
    }

    clearVariation(): void {
        this._extremumValue = 0.0;
        this._extremumValueOpt = 0.0;
        this._extremumLocation = -1.0;
        this._extremumLocationOpt = -1.0;
        this._span = -1;
        this._rangeOfInfluence = 0;
        this._CPvariations = [];
    }
}

export function deepCopyDifferentialEventVariation(diffEventVariation: DiffrentialEventVariation): DiffrentialEventVariation {
    const diffEvent = new DiffrentialEventVariation(diffEventVariation.curveAnalyser1, diffEventVariation.curveAnalyser2);
    diffEvent.extremumValue = diffEventVariation.extremumValue;
    diffEvent.extremumValueOpt = diffEventVariation.extremumValueOpt;
    diffEvent.extremumLocation = diffEventVariation.extremumLocation;
    diffEvent.extremumLocationOpt = diffEventVariation.extremumLocationOpt;
    diffEvent.neighboringEvents = diffEventVariation.neighboringEvents;
    diffEvent.span = diffEventVariation.span;
    diffEvent.rangeOfInfluence = diffEventVariation.rangeOfInfluence;
    diffEvent.CPvariations = diffEventVariation.CPvariations;
    return diffEvent;
}