import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { findSpan } from "../newBsplines/Piegl_Tiller_NURBS_Book";
import { ComparatorOfSequencesOfDiffEvents } from "./ComparatorOfSequencesDiffEvents";
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
        return this._neighboringEvents;
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
        this._neighboringEvents = neighboringEvents;
    }

    set curveAnalyser1(curveAnalyser: CurveAnalyzerInterface) {
        this._curveAnalyser1 = curveAnalyser;
    }

    set curveAnalyser2(curveAnalyser: CurveAnalyzerInterface) {
        this._curveAnalyser2 = curveAnalyser;
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
            let variationsOptim1_2: number[] = []
            for(let exLocOpt = 0; exLocOpt < curvatureDerivativeExtremaLocationsOpt.length; exLocOpt +=1) {
                const currentNbExtremumLocations = curvatureExtremumInterval.length;
                const curvatureDerivExtremumOpt =  curvatureDerivativeNumeratorOpt.evaluate(curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                for(let zeroLoc = 0; zeroLoc < curvatureDerivativeZerosLocationsOpt.length - 1; zeroLoc+=1) {
                    if(curvatureDerivativeExtremaLocationsOpt[exLocOpt] > curvatureDerivativeZerosLocationsOpt[zeroLoc]
                        && curvatureDerivativeExtremaLocationsOpt[exLocOpt] < curvatureDerivativeZerosLocationsOpt[zeroLoc + 1]) {
                        curvatureExtremumInterval.push(zeroLoc);
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
                if(currentNbExtremumLocations === curvatureExtremumInterval.length) console.log("Problem to locate a curvature derivative extremum. ")
                if(curvatureDerivExtremumOpt > 0.0) {
                    for(let j = 0; j < curvatureDerivativeNumeratorOpt.controlPoints.length; j +=1) {
                        // variationsOptim1_2.push(curvatureDerivativeNumeratorOpt.controlPoints[j] - functionBOptim.controlPoints[j])
                        // variations1.push(functionBOptim.controlPoints[j] - curvatureDerivativeNumerator.controlPoints[j])
                        this._CPvariations.push(curvatureDerivativeNumeratorOpt.controlPoints[j] - curvatureDerivativeNumerator.controlPoints[j]);
                    }
                    console.log("variations1_2: " + variationsOptim1_2)
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