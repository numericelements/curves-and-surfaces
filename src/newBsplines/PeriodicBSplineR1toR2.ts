import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { AbstractBSplineR1toR2, TOL_KNOT_COINCIDENCE, deepCopyControlPoints } from "./AbstractBSplineR1toR2";
import { BSplineR1toR2 } from "./BSplineR1toR2";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { clampingFindSpan } from "./Piegl_Tiller_NURBS_Book";

/**
 * A B-Spline function from a one dimensional real periodic space to a two dimensional real space
 * with a periodic knot sequence
 */
export class PeriodicBSplineR1toR2 extends AbstractBSplineR1toR2 {

    protected _increasingKnotSequence: IncreasingPeriodicKnotSequenceClosedCurve;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1], degree: number) {
        super(controlPoints, knots);
        if(degree === 0) {
            const error = new ErrorLog(this.constructor.name, "constructor", "A degree 0 periodic B-Spline cannot be defined. Please, use a non-uniform non periodic B-Spline.");
            error.logMessageToConsole();
        } else if(degree > 0 && (knots.length - controlPoints.length) !== 1) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent numbers of knots and control points.");
            error.logMessageToConsole();
        } else if(knots.length < (degree + 1)) {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent numbers of control points. Not enough control points to define a basis of B-Splines");
            error.logMessageToConsole();
        }
        const maxMultiplicity = this._degree;
        // after modification of IncreasingPeriodicKnotSequenceClosedCurve, must set to correctly refer to max order of multiplicity:
        // const maxMultiplicity = this._degree - 1;
        this._increasingKnotSequence = new IncreasingPeriodicKnotSequenceClosedCurve(this._degree, knots);
    }

    get knots() : number[] {
        const knots: number[] = [];
        for(const knot of this._increasingKnotSequence) {
            if(knot !== undefined) knots.push(knot);
        }
        return knots;
    }

    get freeControlPoints(): Vector2d[] {
        return this.controlPoints;
    }

    protected factory(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]): PeriodicBSplineR1toR2 {
        return new PeriodicBSplineR1toR2(controlPoints, knots, this._degree);
    }

    /**
     * Return a deep copy of this b-spline
     */
    clone(): PeriodicBSplineR1toR2 {
        const cloneControlPoints = deepCopyControlPoints(this._controlPoints);
        return new PeriodicBSplineR1toR2(cloneControlPoints, this.knots.slice(), this._degree);
    }

    optimizerStep(step: number[]): void {
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            this._controlPoints[i].x += step[i];
            this._controlPoints[i].y += step[i + this._controlPoints.length];
        }
    }

    /**
     * 
     * @param fromU Parametric position where the section starts
     * @param toU Parametric position where the section ends
     * @retrun the BSpline_R1_to_R2 section
     */
    extract(fromU: number, toU: number): BSplineR1toR2 {

        let spline = this.clone();
        if(Math.abs(fromU - toU) < TOL_KNOT_COINCIDENCE) {
            const warning = new WarningLog(this.constructor.name, "extract", "The bounding abscissa are either identical or close enough to each other. No curve interval can be extracted. The curve is open at the user prescribed abscissa.");
            warning.logMessageToConsole();
            spline.clamp(fromU);
        } else if(fromU < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(0))) {
            const warning = new WarningLog(this.constructor.name, "extract", "First abscissa is negative. Positive abscissa only are valid.");
            warning.logMessageToConsole();
        }
        if(toU > this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(this._increasingKnotSequence.length()))) {
            toU = toU - toU % this._increasingKnotSequence.getPeriod();
        }
        // need to redefine clamp for periodic b-splines
        spline.clamp(fromU);
        spline.clamp(toU);

        const newFromSpan = clampingFindSpan(fromU, spline.knots, spline._degree);
        const newToSpan = clampingFindSpan(toU, spline.knots, spline._degree);

        let newKnots : number[] = [];
        let newControlPoints : Vector2d[] = [];


        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline.knots[i]);
        }

        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }

        return new BSplineR1toR2(newControlPoints, newKnots);
    }

    elevateDegree(times: number = 1): void {
    }

    generateIntermediateSplinesForDegreeElevation(): {knotVectors: number[][], CPs: Array<Vector2d[]>} {
        const knotSequences: number[][] = [];
        const controlPolygons: Array<Vector2d[]> = [];
        // const strictIncSeq = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        // const lastIndex = new KnotIndexStrictlyIncreasingSequence(strictIncSeq.length() - 1);
        for(let i = 0; i <= this._degree; i += 1) {
            let knotSequence = this._increasingKnotSequence.deepCopy();
            let controlPolygon = this._controlPoints.slice();
            let k = 0;
            for(let j = i; j < this._increasingKnotSequence.length(); j += this._degree + 1) {
                const indexStrctIncreasingSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(j));
                knotSequence.raiseKnotMultiplicity(indexStrctIncreasingSeq, 1);
                if(j < this._controlPoints.length) {
                    const controlPoint = this._controlPoints[j];
                    controlPolygon.splice((j + k), 0, controlPoint);
                }
                k += 1;
            }
            // const strictIncKnotSequence = knotSequence.toStrictlyIncreasingKnotSequence();
            // knotSequence = strictIncKnotSequence.toIncreasingKnotSequence();
            knotSequences.push(knotSequence.allAbscissae);
            controlPolygons.push(controlPolygon);
        }
        return {
            knotVectors : knotSequences,
            CPs : controlPolygons
        };
    }

    degreeIncrement(): PeriodicBSplineR1toR2 {
        const intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        const splineHigherDegree = new PeriodicBSplineR1toR2(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0], (this._degree + 1));
        // const strictIncSeq_splineHigherDegree = splineHigherDegree._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        for(let i = 1; i <= this._degree; i += 1) {
            const strictIncSeq_splineHigherDegree = splineHigherDegree._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            const splineTemp = new PeriodicBSplineR1toR2(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i], (this._degree + 1));
            const strictIncSeq_splineTemp = splineTemp._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            // for(let j = 1; j < (strictIncSeq_splineHigherDegree.length() - 1); j++) {
            for(let j = 0; j < strictIncSeq_splineHigherDegree.length(); j++) {
                const index = new KnotIndexStrictlyIncreasingSequence(j);
                if(strictIncSeq_splineHigherDegree.knotMultiplicity(index) > strictIncSeq_splineTemp.knotMultiplicity(index))
                // if(strictIncSeq_splineHigherDegree.knotMultiplicity(index) > strictIncSeq_splineTemp.knotMultiplicity(index)
                //     && splineTemp._increasingKnotSequence.knotMultiplicity(index) !== splineHigherDegree._increasingKnotSequence.knotMultiplicity(index))
                    splineTemp.insertKnotBoehmAlgorithm(strictIncSeq_splineTemp.abscissaAtIndex(index));
                    // splineTemp.insertKnotIntoTempSpline(strictIncSeq_splineTemp.abscissaAtIndex(index));
                if(strictIncSeq_splineHigherDegree.knotMultiplicity(index) < strictIncSeq_splineTemp.knotMultiplicity(index))
                // if(strictIncSeq_splineHigherDegree.knotMultiplicity(index) < strictIncSeq_splineTemp.knotMultiplicity(index)
                //     && splineTemp._increasingKnotSequence.knotMultiplicity(index) !== splineHigherDegree._increasingKnotSequence.knotMultiplicity(index))
                    splineHigherDegree.insertKnotBoehmAlgorithm(strictIncSeq_splineHigherDegree.abscissaAtIndex(index));
                    // splineHigherDegree.insertKnotIntoTempSpline(strictIncSeq_splineHigherDegree.abscissaAtIndex(index));
            }
            let tempCPs: Vector2d[] = [];
            for(let ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                tempCPs[ind] = splineHigherDegree.controlPoints[ind].add(splineTemp.controlPoints[ind]);
            }
            splineHigherDegree.controlPoints = tempCPs;
        }
        let tempHigherDegCP: Vector2d[] = [];
        for(let j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
            tempHigherDegCP[j] = splineHigherDegree.controlPoints[j].multiply(1 / (this._degree + 1));
        }
        splineHigherDegree.controlPoints = tempHigherDegCP.slice(0, tempHigherDegCP.length - 1);
        console.log("degreeIncrease: " + splineHigherDegree._increasingKnotSequence.allAbscissae);
        return new PeriodicBSplineR1toR2(splineHigherDegree.controlPoints, splineHigherDegree._increasingKnotSequence.allAbscissae, (this._degree + 1));
    }

    scale(factor: number) {
        const cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(element.multiply(factor))
        });
        return new PeriodicBSplineR1toR2(cp, this.knots.slice(), this._degree)
    }

    scaleY(factor: number) {
        const cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d(element.x, element.y * factor))
        });
        return new PeriodicBSplineR1toR2(cp, this.knots.slice(), this._degree)
    }

    scaleX(factor: number) {
        const cp: Array<Vector2d> = []
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d(element.x * factor, element.y))
        });
        return new PeriodicBSplineR1toR2(cp, this.knots.slice(), this._degree)
    }

    evaluateOutsideRefInterval(u: number): Vector2d {
        const warning = new WarningLog(this.constructor.name, "evaluateOutsideRefInterval", "Cannot evaluate periodic B-Spline outside its interval of definition.");
        warning.logMessageToConsole();
        return new Vector2d()
    }
}