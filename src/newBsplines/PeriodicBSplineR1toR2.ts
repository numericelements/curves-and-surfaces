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
    private static internalConstructor: boolean = false;

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    private constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1], degree: number) {
        super(controlPoints, knots);
        this._degree = degree;
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

    static create(controlPoints: Vector2d[], knots: number[], degree: number): PeriodicBSplineR1toR2 | undefined {
        try{
            if(degree < 0) {
                const error = new ErrorLog(this.constructor.name, "create", "Negative degree for periodic B-Spline cannot be processed.");
                throw(error);
            } else if(degree === 0) {
                const error = new ErrorLog("function", "buildPeriodicBSplineR1toR2", "A degree 0 periodic B-Spline cannot be defined. Please, use a non-uniform non periodic B-Spline.");
                throw(error);
            } else if(degree > 0 && (knots.length - controlPoints.length) !== 1) {
                const error = new ErrorLog("function", "buildPeriodicBSplineR1toR2", "Inconsistent numbers of knots and control points.");
                throw(error);
            } else if(knots.length < (degree + 1)) {
                const error = new ErrorLog("function", "buildPeriodicBSplineR1toR2", "Inconsistent numbers of control points. Not enough control points to define a basis of B-Splines");
                throw(error);
            }
            return new PeriodicBSplineR1toR2(controlPoints, knots, degree);
        } catch(error) {
            console.error(error);
            return undefined;
        } 
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
        for(let i = 0; i <= this._degree; i += 1) {
            let knotSequence = this._increasingKnotSequence.deepCopy();
            let controlPolygon = this._controlPoints.slice();
            let k = 0;
            for(let j = i; j < (this._increasingKnotSequence.length() - 1); j += this._degree + 1) {
                const indexStrctIncreasingSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(j));
                knotSequence.raiseKnotMultiplicity(indexStrctIncreasingSeq, 1);
                if(j < this._controlPoints.length) {
                    const controlPoint = this._controlPoints[j];
                    controlPolygon.splice((j + k), 0, controlPoint);
                }
                k += 1;
            }
            knotSequences.push(knotSequence.allAbscissae);
            controlPolygons.push(controlPolygon);
        }
        return {
            knotVectors : knotSequences,
            CPs : controlPolygons
        };
    }

    findSpanBoehmAlgorithm(u: number): KnotIndexIncreasingSequence {
        // Special case
        if (u === this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1))) {
            return new KnotIndexIncreasingSequence(0);
        }
        // Do binary search
        let low = 0;
        let high = this._increasingKnotSequence.length() - 1;
        let i = Math.floor((low + high) / 2);
        let rightBound;
        const lastAbscissa = this._increasingKnotSequence.allAbscissae[this._increasingKnotSequence.allAbscissae.length - 1];
        if(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + 1)) === this._increasingKnotSequence.allAbscissae[0]) {
            rightBound = lastAbscissa;
        } else {
            rightBound = this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + 1))
        }
        while (!(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i)) <= u && u < rightBound)) {
            if (u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i))) {
                high = i;
            } else {
                low = i;
            }
            i = Math.floor((low + high) / 2);
            if(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + 1)) === this._increasingKnotSequence.allAbscissae[0]) {
                rightBound = lastAbscissa;
            } else {
                rightBound = this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + 1))
            }
        }
        return new KnotIndexIncreasingSequence(i);
    }

    regularizeKnotIntervalsOfSubsquence(index: KnotIndexIncreasingSequence, subSequence: number[]): void {
        if((index.knotIndex - this._degree + 1) >= 0) {
            if(subSequence.find((knot) => knot === 0.0) === 0.0 && subSequence[0] !== 0.0) {
                let subSeqIndex = subSequence.length - 1;
                while(subSeqIndex > 0 && subSequence[subSeqIndex] !== 0.0) {
                    subSequence[subSeqIndex] = subSequence[subSeqIndex] + this._increasingKnotSequence.getPeriod();
                    subSeqIndex--;
                }
                while(subSeqIndex > 0 && subSequence[subSeqIndex] === 0.0) {
                    subSequence[subSeqIndex] = this._increasingKnotSequence.getPeriod();
                    subSeqIndex--;
                }
            }
        } else {
            let subSeqIndex = 0;
            while(subSeqIndex < subSequence.length && subSequence[subSeqIndex] !== 0.0) {
                subSequence[subSeqIndex] = subSequence[subSeqIndex] - this._increasingKnotSequence.getPeriod();
                subSeqIndex++;
            }
        }
    }

    insertKnotBoehmAlgorithm(u: number, times: number = 1): void {
        // Uses Boehm algorithm without restriction on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        try{
            if (times <= 0 || times > (this._degree + 1)) {
                const error = new ErrorLog(this.constructor.name, "insertKnotBoehmAlgorithm", "The knot multiplicity prescribed is incompatible with the curve degree. No insrtion is perfomed.");
                throw(error);
            }
            let index = this.findSpanBoehmAlgorithm(u);
            if(u > this._increasingKnotSequence.abscissaAtIndex(index)
                && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(index.knotIndex + 1))) {
                // if(times > )
            }
            let multiplicity = 0;
            const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
            if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
                multiplicity = this.knotMultiplicity(indexStrictInc);
            }
    
            let newIndexStrictInc: KnotIndexStrictlyIncreasingSequence = new KnotIndexStrictlyIncreasingSequence();
            for (let t = 0; t < times; t += 1) {
                const newControlPoints = [];
                if((index.knotIndex - this._degree + 1) > 0) {
                    for (let i = 0; i < index.knotIndex; i += 1) {
                        newControlPoints[i] = this._controlPoints[i];
                    }
                } else if((index.knotIndex - this._degree + 1) <= 0) {
                    let higherIndex = this._controlPoints.length;
                    if((index.knotIndex - this._degree + 1) < 0) {
                        higherIndex = this._controlPoints.length + (index.knotIndex - this._degree + 1);
                    }
                    for (let i = 0; i < higherIndex; i += 1) {
                        newControlPoints[i] = this._controlPoints[i];
                    }
                }
    
                let subSequence: number[] = [];
                if((index.knotIndex - this._degree + 1) >= 0) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                        new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                    this.regularizeKnotIntervalsOfSubsquence(index, subSequence);
                } else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1 + (index.knotIndex - this._degree + 1)),
                        new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1 + index.knotIndex - multiplicity + this._degree));
                    this.regularizeKnotIntervalsOfSubsquence(index, subSequence);
                }
                for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                    const offset = index.knotIndex - this._degree + 1;
                    const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                    let indexCP = i;
                    if((i - 1) >= 0) {
                        newControlPoints[indexCP] = (this._controlPoints[indexCP - 1].multiply(1 - alpha)).add(this._controlPoints[indexCP].multiply(alpha));
                    } else {
                        indexCP = this._controlPoints.length + i;
                        if(i === 0) {
                            newControlPoints[indexCP] = (this._controlPoints[indexCP - 1].multiply(1 - alpha)).add(this._controlPoints[i].multiply(alpha));
                        } else {
                            newControlPoints[indexCP] = (this._controlPoints[indexCP].multiply(1 - alpha)).add(this._controlPoints[indexCP - 1].multiply(alpha));
                        }
                    }
                }
                if((index.knotIndex - this._degree + 1) > 0) {
                    for (let i = index.knotIndex - multiplicity; i < this._controlPoints.length; i += 1) {
                        newControlPoints[i + 1] = this._controlPoints[i];
                    }
                } else if((index.knotIndex - this._degree + 1) < 0) {
                    let lowerIndex = this._controlPoints.length + (index.knotIndex - this._degree + 1)
                    for (let i = lowerIndex; i < this._controlPoints.length; i += 1) {
                        newControlPoints[i + 1] = this._controlPoints[i];
                    }
                }
                if(multiplicity > 0) {
                    this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
                } else if(multiplicity === 0 && t === 0) {
                    this._increasingKnotSequence.insertKnot(u, 1);
                    const newIndex = this._increasingKnotSequence.findSpan(u);
                    newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
                } else {
                    this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
                }
                this._controlPoints = newControlPoints.slice();
                multiplicity += 1;
            }
        } catch(error) {
            console.error(error);
            return;
        }
    }

    degreeIncrement(): PeriodicBSplineR1toR2 | undefined {
        const intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        const splineHigherDegree = new PeriodicBSplineR1toR2(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0], (this._degree + 1));
        for(let i = 1; i <= this._degree; i += 1) {
            const strictIncSeq_splineHigherDegree = splineHigherDegree._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            const splineTemp = new PeriodicBSplineR1toR2(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i], (this._degree + 1));
            const strictIncSeq_splineTemp = splineTemp._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
            for(let j = 0; j < (strictIncSeq_splineHigherDegree.length() - 1); j++) {
                const index = new KnotIndexStrictlyIncreasingSequence(j);
                if(strictIncSeq_splineHigherDegree.knotMultiplicity(index) > strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineTemp.insertKnotBoehmAlgorithm(strictIncSeq_splineTemp.abscissaAtIndex(index));
                if(strictIncSeq_splineHigherDegree.knotMultiplicity(index) < strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineHigherDegree.insertKnotBoehmAlgorithm(strictIncSeq_splineHigherDegree.abscissaAtIndex(index));
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
