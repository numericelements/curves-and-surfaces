import { error } from "console";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { LOWER_BOUND_CURVE_INTERVAL } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractBSplineR1toR2, TOL_KNOT_COINCIDENCE, deepCopyControlPoints } from "./AbstractBSplineR1toR2";
import { KNOT_REMOVAL_TOLERANCE } from "./BSplineR1toR1";
import { BSplineR1toR2 } from "./BSplineR1toR2";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "./IncreasingPeriodicKnotSequenceClosedCurve";
import { KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { PeriodicBSplineR1toR2withOpenKnotSequence } from "./PeriodicBSplineR1toR2withOpenKnotSequence";
import { basisFunctionsFromSequence, clampingFindSpan } from "./Piegl_Tiller_NURBS_Book";

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
        return this._controlPoints;
    }

    protected factory(controlPoints: Vector2d[] = [new Vector2d(0, 0)], knots: number[] = [0, 1]): PeriodicBSplineR1toR2 {
        return new PeriodicBSplineR1toR2(controlPoints, knots, this._degree);
    }

    static create(controlPoints: Vector2d[], knots: number[], degree: number): PeriodicBSplineR1toR2 | undefined {
        try{
            const increasingKnotSequence = new IncreasingPeriodicKnotSequenceClosedCurve(degree, knots);
            if(degree < 0) {
                const error = new ErrorLog(this.constructor.name, "create", "Negative degree for periodic B-Spline cannot be processed.");
                throw(error);
            } else if(degree === 0) {
                const error = new ErrorLog("function", "buildPeriodicBSplineR1toR2", "A degree 0 periodic B-Spline cannot be defined. Please, use a non-uniform non periodic B-Spline.");
                throw(error);
            } else if(degree > 0 && (knots.length - controlPoints.length) !== increasingKnotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0))) {
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

    abcsissaInputParamAssessment(u: number, methodName: string): void {
        if(u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(0))) {
            const error = new ErrorLog(this.constructor.name, methodName, "The abscissa cannot be negative. The corresponding method is not applied.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        } else if(u > this._increasingKnotSequence.getPeriod()) {
            const error = new ErrorLog(this.constructor.name, methodName, "The abscissa cannot be greater or equal than the knot sequence period. The corresponding method is not applied.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    /**
     * Periodic B-Spline evaluation
     * @param u The parameter
     * @returns the value of the periodic B-Spline at u
     */
    evaluate(u: number): Vector2d {
        try{
            this.abcsissaInputParamAssessment(u, "evaluate");
            const span = this._increasingKnotSequence.findSpan(u);
            const basis = basisFunctionsFromSequence(span.knotIndex, u, this._increasingKnotSequence);
            let result = new Vector2d(0, 0);
            for (let i = 0; i < this._degree + 1; i += 1) {
                if(basis[i] !== 0.0) {
                    const indexCP = this.fromIncKnotSeqIndexToControlPointIndex(span, i);
                    result.x += basis[i] * this._controlPoints[indexCP].x;
                    result.y += basis[i] * this._controlPoints[indexCP].y;
                }
            }
            return result;
        } catch(error) {
            if(error instanceof RangeError) {
                error = error + " Value Infinity is returned."
                console.error(error);
            }
            return new Vector2d(Infinity, Infinity);
        }
    }

    fromIncKnotSeqIndexToControlPointIndexInputParamAssessment(indexKSeq: KnotIndexIncreasingSequence, offset: number, methodName: string): void {
        this._increasingKnotSequence.knotIndexInputParamAssessment(indexKSeq, methodName);
        if(offset < 0 || offset > this._degree) {
            const error = new ErrorLog(this.constructor.name, methodName, "Offset value is out of range: must be positive or null and smaller or equal to the curve degree. Control point index cannot be defined.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    fromIncKnotSeqIndexToControlPointIndex(indexKSeq: KnotIndexIncreasingSequence, offset: number = 0): number {
        try {
            this.fromIncKnotSeqIndexToControlPointIndexInputParamAssessment(indexKSeq, offset, "fromIncKnotSeqIndexToControlPointIndex");
            let indexCP = Infinity;
            const multiplicityFirstKnot = this._increasingKnotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
            if(((indexKSeq.knotIndex - this._degree + offset) - (multiplicityFirstKnot - 1)) < 0) {
                indexCP = this._controlPoints.length + (indexKSeq.knotIndex - this._degree + offset) - (multiplicityFirstKnot - 1);
            } else if(((indexKSeq.knotIndex - this._degree + offset) - (multiplicityFirstKnot - 1)) >= 0 && (indexKSeq.knotIndex - this._degree + offset) < this._controlPoints.length) {
                indexCP = indexKSeq.knotIndex - this._degree + offset - (multiplicityFirstKnot - 1);
            } else {
                indexCP = indexKSeq.knotIndex - this._degree + offset - this._controlPoints.length;
            }
            return indexCP;
        } catch(error) {
            if(error instanceof RangeError) {
                error = error + " The control point index returned is Infinity."
                console.error(error);
            }
            return Infinity;
        }
    }

    /**
     * 
     * @param u1 Parametric position where the section starts. A value inside the interval span of the curve.
     * @param u2 Parametric position where the section ends. A positive value greater than or equal to fromU but not larger than
     * @retrun the BSpline_R1_to_R2 section as open curve.
     */
    // extract(fromU: number, toU: number): BSplineR1toR2 | undefined {

    extractInputParamAssessment(u1: number, u2: number): void {
        const abscissae = this._increasingKnotSequence.allAbscissae;
        if(u1 < abscissae[0]) {
            const error = new ErrorLog(this.constructor.name, "extract", "First abscissa is negative. Positive abscissa only are valid.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        } else if(u1 >= abscissae[abscissae.length - 1]) {
            const error = new ErrorLog(this.constructor.name, "extract", "First abscissa must be lower than the right bound of the knot sequence. Cannot proceed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
        if(u2 < abscissae[0]) {
            const error = new ErrorLog(this.constructor.name, "extract", "Second abscissa is negative. Positive abscissa only are valid.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        } else if(u2 >= abscissae[abscissae.length - 1]) {
            const error = new ErrorLog(this.constructor.name, "extract", "Second abscissa must be lower than the right bound of the knot sequence. Cannot proceed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
        return;
    }

    extract(u1: number, u2: number): BSplineR1toR2 | undefined {
        try{
            this.extractInputParamAssessment(u1, u2);
            const spline = this.clone();
            if(Math.abs(u1 - u2) < TOL_KNOT_COINCIDENCE) {
                const warning = new WarningLog(this.constructor.name, "extract", "The bounding abscissa are either identical or close enough to each other. No curve interval can be extracted. The curve is opened at the prescribed abscissa.");
                warning.logMessageToConsole();
                let index = this.findSpanBoehmAlgorithm(u1);
                if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u1) !== 0) {
                    u1 = this._increasingKnotSequence.abscissaAtIndex(index);
                }
                spline.clamp(u1);
            } else {
                spline.clamp(u1);
                spline.clamp(u2);
            }
            return spline.toOpenBSpline(u1, u2);
        } catch(error) {
            if(error instanceof RangeError) {
                console.error(error);
            }
            return undefined;
        }
    }

    clamp(u: number): void {
        try {
            this.abcsissaInputParamAssessment(u, "clamp");
            const index = this.findSpanBoehmAlgorithm(u);
            let indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
    
            let multiplicity = 0;
            if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
                && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < TOL_KNOT_COINCIDENCE) {
                multiplicity = this.knotMultiplicity(indexStrictInc);
            }
            const times = this._degree - multiplicity;
            this.insertKnotBoehmAlgorithm(u, times);
        } catch(error) {
            if(error instanceof RangeError) {
                console.error(error);
            }
        }
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
            if(i === 0) {
                const cp = controlPolygon.splice(0, 1);
                controlPolygon.splice(controlPolygon.length, 0, cp[0]);
            }
            controlPolygons.push(controlPolygon);
        }
        return {
            knotVectors : knotSequences,
            CPs : controlPolygons
        };
    }

    findSpanBoehmAlgorithm(u: number): KnotIndexIncreasingSequence {
        try{
            this.abcsissaInputParamAssessment(u, "findSpanBoehmAlgorithm");
            // Special case
            if (u === this._increasingKnotSequence.lastKnot()) {
                const multiplicityAtOrigin = this._increasingKnotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
                return new KnotIndexIncreasingSequence(multiplicityAtOrigin - 1);
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
        } catch(error) {
            if(error instanceof RangeError) {
                error = error + " Index value Infinity is returned."
                console.error(error);
            }
            return new KnotIndexIncreasingSequence(Infinity);
        }
    }

    regularizeKnotIntervalsOfSubsquence(index: KnotIndexIncreasingSequence, subSequence: number[]): void {
        if((index.knotIndex - this._degree + 1) >= 0) {
            let subSeqForTest: number[] = [];
            if(subSequence[0] === LOWER_BOUND_CURVE_INTERVAL) {
                subSeqForTest = subSequence.slice(1);
            } else {
                subSeqForTest = subSequence.slice();
            }
            if(subSeqForTest.find((knot) => knot === LOWER_BOUND_CURVE_INTERVAL) === LOWER_BOUND_CURVE_INTERVAL && subSeqForTest[0] !== LOWER_BOUND_CURVE_INTERVAL) {
            // if(subSequence.find((knot) => knot === 0.0) === 0.0 && subSequence[0] !== 0.0) {
                let subSeqIndex = subSequence.length - 1;
                while(subSeqIndex > 0 && subSequence[subSeqIndex] !== LOWER_BOUND_CURVE_INTERVAL) {
                    subSequence[subSeqIndex] = subSequence[subSeqIndex] + this._increasingKnotSequence.getPeriod();
                    subSeqIndex--;
                }
                while(subSeqIndex > 0 && subSequence[subSeqIndex] === LOWER_BOUND_CURVE_INTERVAL) {
                    subSequence[subSeqIndex] = this._increasingKnotSequence.getPeriod();
                    subSeqIndex--;
                }
            }
        } else {
            let subSeqIndex = 0;
            while(subSeqIndex < subSequence.length && subSequence[subSeqIndex] !== LOWER_BOUND_CURVE_INTERVAL) {
                subSequence[subSeqIndex] = subSequence[subSeqIndex] - this._increasingKnotSequence.getPeriod();
                subSeqIndex++;
            }
        }
    }

    insertKnotBoehmAlgorithmInputParamAssessment(u: number, times: number): void {
        this.abcsissaInputParamAssessment(u, "insertKnotBoehmAlgorithmInputParamAssessment");

        if(times <= 0) {
            const error = new ErrorLog(this.constructor.name, "insertKnotBoehmAlgorithmInputParamAssessment", "The knot multiplicity cannot be negative or null. No insertion is perfomed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        } else if(times > this._degree) {
            const error = new ErrorLog(this.constructor.name, "insertKnotBoehmAlgorithmInputParamAssessment", "The knot multiplicity cannot be greater than the curve degree. No insertion is perfomed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    insertKnotBoehmAlgorithm(u: number, times: number = 1): void {
        // Uses Boehm's algorithm without restriction on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        try{
            this.insertKnotBoehmAlgorithmInputParamAssessment(u, times);
            let index = this.findSpanBoehmAlgorithm(u);
            let multiplicityAtOrigin = this.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
            let multiplicity = 0;
            let indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
            if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u) !== 0) {
                multiplicity = this.knotMultiplicity(indexStrictInc);
            }
            for (let t = 0; t < times; t += 1) {
                const newControlPoints: Vector2d[] = [];
                let firstIndex = 0;
                let lastIndex = 0;
                if(index.knotIndex !== (multiplicity - 1)) {
                    firstIndex = (this._controlPoints.length + 1 + index.knotIndex - this._degree + 1 - (multiplicityAtOrigin - 1)) % (this._controlPoints.length + 1);
                    lastIndex = (this._controlPoints.length + 1 + index.knotIndex - multiplicity - (multiplicityAtOrigin - 1)) % (this._controlPoints.length + 1);
                } else {
                    firstIndex = this._controlPoints.length + index.knotIndex - this._degree + 1 - (multiplicityAtOrigin - 1);
                    lastIndex = this._controlPoints.length + index.knotIndex - multiplicity - (multiplicityAtOrigin - 1);
                }
                if(firstIndex > 0 && lastIndex > 0 && lastIndex >= firstIndex) {
                    for (let i = 0; i < firstIndex; i += 1) {
                        newControlPoints[i] = this._controlPoints[i];
                    }
                }
    
                let subSequence: number[] = [];
                if((index.knotIndex - this._degree + 1) >= 0) {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1),
                        new KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
                    this.regularizeKnotIntervalsOfSubsquence(index, subSequence);
                } else {
                    subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1 + (index.knotIndex - this._degree + 1) - (multiplicityAtOrigin - 1)),
                        new KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - 1 - (multiplicityAtOrigin - 1) + index.knotIndex - multiplicity + this._degree));
                    this.regularizeKnotIntervalsOfSubsquence(index, subSequence);
                }
                let indexCPn = 0;
                const offset = index.knotIndex - this._degree + 1;
                for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                    const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);

                    indexCPn = (this._controlPoints.length + 1 + i - (multiplicityAtOrigin - 1)) % (this._controlPoints.length + 1);
                    if(index.knotIndex === (multiplicity - 1)) {
                        indexCPn = (this._controlPoints.length + i - (multiplicityAtOrigin - 1));
                    }
                    if(indexCPn > 0 && indexCPn < this._controlPoints.length && lastIndex > firstIndex) {
                        newControlPoints[indexCPn] = (this._controlPoints[indexCPn - 1].multiply(1 - alpha)).add(this._controlPoints[indexCPn].multiply(alpha));
                    } else if(indexCPn > 0 && indexCPn <= this._controlPoints.length && lastIndex < firstIndex) {
                        if(indexCPn >= firstIndex) {
                            newControlPoints[indexCPn] = (this._controlPoints[indexCPn - 2].multiply(1 - alpha)).add(this._controlPoints[indexCPn - 1].multiply(alpha));
                        } else {
                            newControlPoints[indexCPn] = (this._controlPoints[indexCPn - 1].multiply(1 - alpha)).add(this._controlPoints[indexCPn].multiply(alpha));
                        }
                    } else if(indexCPn === 0) {
                        newControlPoints[0] = (this._controlPoints[this._controlPoints.length - 1].multiply(1 - alpha)).add(this._controlPoints[0].multiply(alpha));
                    // } else if(indexCPn === this._controlPoints.length && lastIndex >= firstIndex) {
                    //     // this configuration cannot occur given the equations of firstIndex and lastIndex
                    //     newControlPoints[this._controlPoints.length] = (this._controlPoints[this._controlPoints.length - 2].multiply(1 - alpha)).add(this._controlPoints[this._controlPoints.length - 1].multiply(alpha));
                    } else if(indexCPn === firstIndex && firstIndex === lastIndex) {
                        newControlPoints[indexCPn] = (this._controlPoints[indexCPn - 1].multiply(1 - alpha)).add(this._controlPoints[indexCPn].multiply(alpha));
                    }
                }
                let lastCP = this._controlPoints.length;
                if((firstIndex - 1) < this._controlPoints.length && firstIndex > lastIndex) lastCP = firstIndex - 1;
                for(let j = indexCPn; j < lastCP; j++) {
                    newControlPoints[j + 1] = this._controlPoints[j];
                }
                if(multiplicity > 0) {
                    this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
                } else if(multiplicity === 0 && t === 0) {
                    this._increasingKnotSequence.insertKnot(u, 1);
                    const newIndex = this._increasingKnotSequence.findSpan(u);
                    indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
                }
                this._controlPoints = newControlPoints.slice();
                if(index.knotIndex === 0 && multiplicity !== 0) multiplicityAtOrigin++;
                multiplicity++;
                index.knotIndex++;
            }
        } catch(error) {
            if(error instanceof RangeError) {
                console.error(error);
            }
            return;
        }
    }

    degreeIncrement(): PeriodicBSplineR1toR2 {
        const intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        const splineHigherDegree =  new PeriodicBSplineR1toR2(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0], (this._degree + 1));
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
        splineHigherDegree.controlPoints = tempHigherDegCP;
        return new PeriodicBSplineR1toR2(splineHigherDegree.controlPoints, splineHigherDegree._increasingKnotSequence.allAbscissae, (this._degree + 1));
    }

    grevilleAbscissae(): number[] {
        const result = [];
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            let sum = 0;
            const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(i + this._degree - 1),
            new KnotIndexIncreasingSequence(i + 2 * this._degree - 2));
            for (const knot of subSequence) {
                sum += knot;
            }
            result.push(sum / this._degree);
        }
        return result;
    }

    // Probably not compatible with periodic BSplines -> to be modified
    removeKnot(indexFromFindSpan: number, tolerance: number = KNOT_REMOVAL_TOLERANCE): void {
        //Piegl and Tiller, The NURBS book, p : 185
    
        const index = indexFromFindSpan;

        // end knots are not removed
        if (index > this._degree && index < this._increasingKnotSequence.length() - this._degree - 1) {
            throw new Error("index out of range");
        }
        
        const indexIncSeq = new KnotIndexIncreasingSequence(index);
        const multiplicity = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        
        const last = index - multiplicity;
        const first = index - this._degree;
        const offset = first - 1;
        //std::vector<vectorType> local(2*degree+1);
        const local: Vector2d[] = [];
        local[0] = this.controlPoints[offset];
        local[last + 1 - offset] = this.controlPoints[last + 1];
        let i = first;
        let j = last;
        let ii = 1;
        let jj = last - offset;
        let removable = false;
        
        const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(first), new KnotIndexIncreasingSequence(last + this.degree + 1));
        // Compute new control point for one removal step
        const offset_i = first;
        while (j > i) {
            const offset_j = last;
            const alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i])/(subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            const alpha_j = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[j - offset_j])/(subSequence[j + this.degree + 1 - offset_j] - subSequence[j - offset_j]);
            local[ii] = (this.controlPoints[i].substract(local[ii - 1].multiply(1.0 - alpha_i))).multiply(1 / alpha_i ) 
            local[jj] = (this.controlPoints[j].substract(local[jj + 1].multiply(alpha_j))).multiply(1 / (1.0 - alpha_j) )
            ++i;
            ++ii;
            --j;
            --jj;
        }
        
        if (j < i) {
            if ((local[ii - 1].substract(local[jj + 1])).norm() <= tolerance){
                removable = true;
            }
        }
        else {
            const alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            if( ((this.controlPoints[i].substract((local[ii + 1].multiply(alpha_i)))).add (local[ii - 1].multiply(1.0 - alpha_i))).norm() <= tolerance) {
                removable = true;
            }
        }
        
        if (!removable) return;
        else {
            let indInc = first;
            let indDec = last;
            while (indDec > indInc) {
                this.controlPoints[indInc] = local[indInc - offset];
                this.controlPoints[indDec] = local[indDec - offset];
                ++indInc;
                --indDec;
            }
        }
        
        // this.knots.splice(index, 1);
        this._increasingKnotSequence.decrementKnotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        
        const fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    }

    getDistinctKnots(): number[] {
        const multiplicityBoundary = this.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
        const result = super.getDistinctKnots();
        return result.slice(this.degree - (multiplicityBoundary - 1), result.length - this.degree + (multiplicityBoundary - 1));
    }

    isKnotlMultiplicityZero(u: number): boolean {
        try{
            this.abcsissaInputParamAssessment(u, "isKnotlMultiplicityZero");
            let multiplicityZero = true;
            if(this.isAbscissaCoincidingWithKnot(u)) multiplicityZero = false;
            return multiplicityZero;
        } catch(error) {
            if(error instanceof RangeError) {
                error = error + " Returns true considering the abscissa has necessarily a multiplicity of 0."
                console.error(error);
            }
            return true;
        }
    }

    findCoincidentKnot(u: number): KnotIndexIncreasingSequence {
        try{
            this.abcsissaInputParamAssessment(u, "findCoincidentKnot");
            let index = new KnotIndexIncreasingSequence();
            if(!this.isKnotlMultiplicityZero(u)) index = this.getFirstKnotIndexCoincidentWithAbscissa(u);
            return index;
        } catch(error) {
            if(error instanceof RangeError) {
                error = error + " Index value Infinity is returned."
                console.error(error);
            }
            return new KnotIndexIncreasingSequence(Infinity);
        }
    }

    insertKnot(u: number): void {
        let uToInsert = u;
        let index = new KnotIndexIncreasingSequence();
        if(!this.isKnotlMultiplicityZero(u)) {
            index = this.findCoincidentKnot(u);
            const indexSpan = this._increasingKnotSequence.findSpan(this._increasingKnotSequence.abscissaAtIndex(index));
            uToInsert = this._increasingKnotSequence.abscissaAtIndex(indexSpan);
        }
        if(uToInsert >= this.knots[0] && uToInsert <= this.knots[this.knots.length - 1]) {
            const knotAbsc = this._increasingKnotSequence.allAbscissae;
            const indexOrigin = new KnotIndexIncreasingSequence(0);
            const knotAbscResetOrigin = this.resetKnotAbscissaToOrigin(knotAbsc);
            const sameSplineOpenCurve = new BSplineR1toR2(this.controlPoints, knotAbscResetOrigin);
            const newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexOrigin) + uToInsert;

            const indexSpan = this._increasingKnotSequence.findSpan(uToInsert);
            const indexStrictIncSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexSpan);
            const knotMultiplicity = this.knotMultiplicity(indexStrictIncSeq);
            if(knotMultiplicity === this._degree) {
                const error = new ErrorLog(this.constructor.name, "insertKnot", "cannot insert knot. Current knot multiplicity already equals curve degree.");
                throw(error);
            } else {
                // two knot insertions must take place to preserve the periodic structure of the function basis
                // unless if uToInsert = uSymmetric. In this case, only one knot insertion is possible
                const uSymmetric = knotAbscResetOrigin[indexOrigin.knotIndex];
                // const uSymmetric = this.findKnotAbscissaeRightBound() + knotAbscResetOrigin[indexOrigin.knotIndex];
                sameSplineOpenCurve.insertKnot(newUToInsert, 1);
                if((uSymmetric - uToInsert) !== uToInsert) {
                    sameSplineOpenCurve.insertKnot(uSymmetric - uToInsert, 1);
                }
                let newKnotAbsc = sameSplineOpenCurve.increasingKnotSequence.allAbscissae;
                for(let i = 0; i < newKnotAbsc.length; i++) {
                    newKnotAbsc[i] -= knotAbscResetOrigin[indexOrigin.knotIndex];
                }
                let newCtrlPts: Array<Vector2d> = sameSplineOpenCurve.controlPoints;
                if(indexSpan.knotIndex === indexOrigin.knotIndex) {
                    // the knot inserted is located at the origin of the periodic curve. To obtain the new knot
                    // sequence, the extreme knots must be removed as well as the corresponding control points
                    newKnotAbsc = newKnotAbsc.slice(1, newKnotAbsc.length - 1);
                    newCtrlPts = sameSplineOpenCurve.controlPoints.slice(1, sameSplineOpenCurve.controlPoints.length - 1);
                }
                this._controlPoints = newCtrlPts;
                this._increasingKnotSequence = new IncreasingPeriodicKnotSequenceClosedCurve(this._degree, newKnotAbsc);
            }
            return;
        } else {
            const error = new ErrorLog(this.constructor.name, "insertKnot", "Cannot insert a knot outside the period of the knot sequence.");
            throw(error);
        }
    }

    scale(factor: number): PeriodicBSplineR1toR2 | undefined {
        try {
            this.scaleInputParamAssessment(factor);
            const cp: Array<Vector2d> = [];
            this._controlPoints.forEach(element => {
                cp.push(element.multiply(factor));
            });
            return new PeriodicBSplineR1toR2(cp, this.knots.slice(), this._degree);
        } catch(error) {
            if(error instanceof RangeError) {
                console.error(error);
            }
            return undefined;
        }
    }

    scaleY(factor: number): PeriodicBSplineR1toR2 | undefined {
        try {
            this.scaleInputParamAssessment(factor);
            const cp: Array<Vector2d> = [];
            this._controlPoints.forEach(element => {
                cp.push(new Vector2d(element.x, element.y * factor));
            });
            return new PeriodicBSplineR1toR2(cp, this.knots.slice(), this._degree);
        } catch(error) {
            if(error instanceof RangeError) {
                console.error(error);
            }
            return undefined;
        }
    }

    scaleX(factor: number): PeriodicBSplineR1toR2 | undefined {
        try{
            this.scaleInputParamAssessment(factor);
            const cp: Array<Vector2d> = [];
            this._controlPoints.forEach(element => {
                cp.push(new Vector2d(element.x * factor, element.y));
            });
            return new PeriodicBSplineR1toR2(cp, this.knots.slice(), this._degree);
        } catch(error) {
            if(error instanceof RangeError) {
                console.error(error);
            }
            return undefined;
        }
    }

    evaluateOutsideRefIntervalInputParamAssessment(u: number): void {
        if(u < (- this._increasingKnotSequence.getPeriod())) {
            const error = new ErrorLog(this.constructor.name, "evaluateOutsideRefIntervalInputParamAssessment", "Abscissa is negative. Its value is lower than the knot sequence period. No evaluation takes place.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    evaluateOutsideRefInterval(u: number): Vector2d {
        const strctIncSeq = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        const lastKnot = strctIncSeq.allAbscissae[strctIncSeq.allAbscissae.length - 1];
        try{
            this.evaluateOutsideRefIntervalInputParamAssessment(u);
            if(u >= 0 && u < lastKnot) {
                const warning = new WarningLog(this.constructor.name, "evaluateOutsideRefInterval", "Abscissa value falls within the interval of definition of the curve, use the evaluation method.");
                warning.logMessageToConsole();
                return this.evaluate(u);
            } else if(u < 0) {
                const uInInterval = u + this._increasingKnotSequence.getPeriod();
                return this.evaluate(uInInterval);
            } else if(u >= lastKnot) {
                const uInInterval = u % this._increasingKnotSequence.getPeriod();
                return this.evaluate(uInInterval);
            } else {
                const error = new ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Abscissa has not fallen into any predefined sub interval. No evaluation can take place.");
                console.log(error.logMessage());
                throw new EvalError(error.logMessage());
            }
        } catch(error) {
            if(error instanceof RangeError) {
                console.error(error);
            } else if(error instanceof EvalError) {
                console.error(error);
            }
            console.log("A null value is returned.");
            return new Vector2d();
        }
    }

    toPeriodicBSplineR1toR2withOpenKnotSequence(): PeriodicBSplineR1toR2withOpenKnotSequence {
        const knots = this._increasingKnotSequence.toOpenKnotSequence();
        let controlPoints = [];
        const multiplicityOrigin = this._increasingKnotSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
        for(let i = 0; i < this._degree; i++) {
            controlPoints[i] = this._controlPoints[this._controlPoints.length - this._degree + i];
        }
        for(let cp = 0; cp < this._controlPoints.length - (multiplicityOrigin - 1); cp++) {
            controlPoints.push(this._controlPoints[cp]);
        }
        return new PeriodicBSplineR1toR2withOpenKnotSequence(controlPoints, knots.allAbscissae);
    }

    toOpenBSplineInputParamAssessment(u1: number, u2: number): void {
        if(this.isKnotlMultiplicityZero(u1)) {
            const error = new ErrorLog(this.constructor.name, "toOpenBSplineInputParamAssessment", "First abscissa is not a knot. Curve opening process cannot take place.");
            console.log(error.logMessage());
            throw new TypeError(error.logMessage());
        } else if(this._increasingKnotSequence.knotMultiplicityAtAbscissa(u1) !== this._degree) {
            const error = new ErrorLog(this.constructor.name, "toOpenBSplineInputParamAssessment", "First abscissa has not a multiplicity equal to the curve degree. Curve opening process cannot take place.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
        if(this.isKnotlMultiplicityZero(u2)) {
            const error = new ErrorLog(this.constructor.name, "toOpenBSplineInputParamAssessment", "Second abscissa is not a knot. Curve opening process cannot take place.");
            console.log(error.logMessage());
            throw new TypeError(error.logMessage());
        } else if(this._increasingKnotSequence.knotMultiplicityAtAbscissa(u2) !== this._degree) {
            const error = new ErrorLog(this.constructor.name, "toOpenBSplineInputParamAssessment", "Second abscissa has not a multiplicity equal to the curve degree. Curve opening process cannot take place.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
        return;
    }

    toOpenBSpline(u1: number, u2: number): BSplineR1toR2 | undefined{
        let newKnots = [];
        let newControlPoints: Array<Vector2d> = [];
        const multiplicityAtOrigin = this.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0));
        try{
            this.toOpenBSplineInputParamAssessment(u1, u2);
            if(Math.abs(u1 - u2) < TOL_KNOT_COINCIDENCE) {
                const warning = new WarningLog(this.constructor.name, "toOpenBSpline", "The bounding abscissa are either identical or close enough to each other. No curve interval can be extracted. The curve is opened at the prescribed abscissa.");
                warning.logMessageToConsole();
                let index = this.findSpanBoehmAlgorithm(u1);
                if (this._increasingKnotSequence.knotMultiplicityAtAbscissa(u1) !== 0) {
                    u1 = this._increasingKnotSequence.abscissaAtIndex(index);
                }
                index = this.findSpanBoehmAlgorithm(u1);
                const firstIndex = new KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1);
                const knotSeqLength = this._increasingKnotSequence.allAbscissae.length;
                const lastIndex = new KnotIndexIncreasingSequence(index.knotIndex + knotSeqLength - 1 - (multiplicityAtOrigin - 1));
                newKnots = this._increasingKnotSequence.extractSubsetOfAbscissae(firstIndex, lastIndex);
                newKnots = this.resetKnotAbscissaToOrigin(newKnots);
                newKnots.splice(0, 0, newKnots[0]);
                newKnots.splice(newKnots.length, 0, newKnots[newKnots.length - 1]);
                const indexCP = this.fromIncKnotSeqIndexToControlPointIndex(index);
                for (let i = indexCP; i < this._controlPoints.length; i += 1) {
                    newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
                }
                if(indexCP !== 0) {
                    for (let i = 0; i <= indexCP; i += 1) {
                        newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
                    }
                } else {
                    newControlPoints.push(new Vector2d(newControlPoints[0].x, newControlPoints[0].y));
                }
            } else {
                const index1 = this.findSpanBoehmAlgorithm(u1);
                const index2 = this.findSpanBoehmAlgorithm(u2);
                let secondSegment = false;
                if(u2 < u1) secondSegment = true;
                const indexFirstKnot = new KnotIndexIncreasingSequence(index1.knotIndex - this._degree + 1);
                if(secondSegment) {
                    const indexLastKnot = new KnotIndexIncreasingSequence(index2.knotIndex + this._increasingKnotSequence.allAbscissae.length - multiplicityAtOrigin);
                    newKnots = this._increasingKnotSequence.extractSubsetOfAbscissae(indexFirstKnot, indexLastKnot);
                } else {
                    newKnots = this._increasingKnotSequence.extractSubsetOfAbscissae(indexFirstKnot, index2);
                }
                newKnots = this.resetKnotAbscissaToOrigin(newKnots);
                newKnots.splice(0, 0, newKnots[0]);
                newKnots.splice(newKnots.length, 0, newKnots[newKnots.length - 1]);
        
                const nbCtrlPts = newKnots.length - (this._degree + 1);
                const indexCP1 = this.fromIncKnotSeqIndexToControlPointIndex(index1);
                const indexCP2 = this.fromIncKnotSeqIndexToControlPointIndex(index2);
                let lastIndex = this._controlPoints.length;
                let spanAllIndices = false;
                if((indexCP1 + nbCtrlPts) <= this._controlPoints.length) {
                    spanAllIndices = true;
                    lastIndex = indexCP1 + nbCtrlPts;
                }
                for (let i = indexCP1; i < lastIndex; i += 1) {
                    newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
                }
                if(!spanAllIndices) {
                    lastIndex = indexCP2 + 1;
                    for (let i = 0; i < lastIndex; i += 1) {
                        newControlPoints.push(new Vector2d(this._controlPoints[i].x, this._controlPoints[i].y));
                    }
                }
            }
            return new BSplineR1toR2(newControlPoints, newKnots);
        } catch(error) {
            if(error instanceof RangeError) {
                console.error(error);
            } else if(error instanceof TypeError) {
                console.error(error);
            }
            return undefined;
        }
    }
}