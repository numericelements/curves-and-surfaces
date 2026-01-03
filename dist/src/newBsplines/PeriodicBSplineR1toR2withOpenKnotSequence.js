"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_PeriodicBSplineR1toR2 = exports.PeriodicBSplineR1toR2withOpenKnotSequence = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Vector2d_1 = require("../mathVector/Vector2d");
const AbstractBSplineR1toR2_1 = require("./AbstractBSplineR1toR2");
const BernsteinDecompositionR1toR1_1 = require("./BernsteinDecompositionR1toR1");
const BSplineR1toR1_1 = require("./BSplineR1toR1");
const BSplineR1toR2_1 = require("./BSplineR1toR2");
const IncreasingOpenKnotSequenceClosedCurve_1 = require("./IncreasingOpenKnotSequenceClosedCurve");
const fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const fromIncreasingOpentoIncreasingPeriodicKnotSequence_1 = require("./KnotSequenceAndUtilities/fromIncreasingOpentoIncreasingPeriodicKnotSequence");
const PeriodicBSplineR1toR1_1 = require("./PeriodicBSplineR1toR1");
const PeriodicBSplineR1toR2_1 = require("./PeriodicBSplineR1toR2");
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
const KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
const Knots_1 = require("../namedConstants/Knots");
/**
 * A B-Spline function from a one dimensional real periodic space to a two dimensional real space
 */
class PeriodicBSplineR1toR2withOpenKnotSequence extends AbstractBSplineR1toR2_1.AbstractBSplineR1toR2 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [new Vector2d_1.Vector2d(0, 0)], knots = [0, 1]) {
        super(controlPoints, knots);
        const maxMultiplicityOrder = this._degree + 1;
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
    }
    get knots() {
        const knots = [];
        for (const knot of this._increasingKnotSequence) {
            if (knot !== undefined)
                knots.push(knot);
        }
        return knots;
    }
    get periodicControlPointsLength() {
        // const indexOrigin = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.indexKnotOrigin);
        const indexOrigin = this._increasingKnotSequence.indexKnotOrigin;
        let multiplicityBoundary = this.knotMultiplicity(indexOrigin);
        if (multiplicityBoundary === (this._degree + 1)) {
            multiplicityBoundary--;
        }
        return this._controlPoints.length - this._degree + (multiplicityBoundary - 1);
    }
    get freeControlPoints() {
        const periodicControlPoints = [];
        for (let i = 0; i < this.periodicControlPointsLength; i += 1) {
            periodicControlPoints.push(this._controlPoints[i].clone());
        }
        return periodicControlPoints;
    }
    // protected override factory(controlPoints: readonly Vector2d[] = [new Vector2d(0, 0)], knots: readonly number[] = [0, 1]) {
    create(controlPoints = [new Vector2d_1.Vector2d(0, 0)], knots = [0, 1]) {
        return new PeriodicBSplineR1toR2withOpenKnotSequence(controlPoints, knots);
    }
    getClampSpline() {
        const s = this.clone();
        const degree = this._degree;
        s.clamp(s.knots[degree]);
        s.clamp(s.knots[s.knots.length - degree - 1]);
        const newControlPoints = s.controlPoints.slice(degree, s.controlPoints.length - degree);
        const newKnots = s.knots.slice(degree, s.knots.length - degree);
        return new BSplineR1toR2_1.BSplineR1toR2(newControlPoints, newKnots);
    }
    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints = (0, AbstractBSplineR1toR2_1.deepCopyControlPoints)(this._controlPoints);
        return new PeriodicBSplineR1toR2withOpenKnotSequence(cloneControlPoints, this._increasingKnotSequence.allAbscissae.slice());
    }
    optimizerStep(step) {
        const n = this.periodicControlPointsLength;
        for (let i = 0; i < n; i += 1) {
            this.moveControlPoint(i, step[i], step[i + n]);
        }
    }
    moveControlPoint(i, deltaX, deltaY) {
        if (i < 0 || i >= this.periodicControlPointsLength) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "moveControlPoint", "Control point indentifier is out of range.");
            throw (error);
        }
        super.moveControlPoint(i, deltaX, deltaY);
        let n = this.periodicControlPointsLength;
        if (i < this.degree) {
            super.setControlPointPosition(n + i, this.getControlPoint(i));
        }
    }
    /**
     *
     * @param fromU Parametric position where the section start
     * @param toU Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    extract(fromU, toU) {
        let spline = this.clone();
        spline.clamp(fromU);
        spline.clamp(toU);
        const newFromSpan = (0, Piegl_Tiller_NURBS_Book_1.clampingFindSpan)(fromU, spline.knots, spline._degree);
        const newToSpan = (0, Piegl_Tiller_NURBS_Book_1.clampingFindSpan)(toU, spline.knots, spline._degree);
        let newKnots = [];
        let newControlPoints = [];
        for (let i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline.knots[i]);
        }
        for (let i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector2d_1.Vector2d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(newControlPoints, newKnots);
    }
    elevateDegree(times = 1) {
        const sx = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(this.getControlPointsX(), this.knots);
        const sy = new PeriodicBSplineR1toR1_1.PeriodicBSplineR1toR1(this.getControlPointsY(), this.knots);
        const bdsx = sx.bernsteinDecomposition();
        const bdsy = sy.bernsteinDecomposition();
        bdsx.elevateDegree();
        bdsy.elevateDegree();
        const knots = this.getDistinctKnots();
        const sxNew = (0, BernsteinDecompositionR1toR1_1.splineRecomposition)(bdsx, knots);
        const syNew = (0, BernsteinDecompositionR1toR1_1.splineRecomposition)(bdsy, knots);
        const newcp = [];
        for (let i = 0; i < sxNew.controlPoints.length; i += 1) {
            newcp.push(new Vector2d_1.Vector2d(sxNew.controlPoints[i], syNew.controlPoints[i]));
        }
        const newSpline = new PeriodicBSplineR1toR2withOpenKnotSequence(newcp, sxNew.knots);
        for (let i = 0; i < knots.length; i += 1) {
            let m = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.findSpan(knots[i])));
            for (let j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot((0, Piegl_Tiller_NURBS_Book_1.findSpan)(newSpline.knots[i], newSpline.knots, newSpline.degree));
            }
        }
        this._controlPoints = newSpline.controlPoints;
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(newSpline.degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newSpline.knots });
        this._degree = newSpline.degree;
    }
    generateKnotSequenceOfBSplineR1toR2() {
        const knotSequence = this._increasingKnotSequence.allAbscissae;
        const distinctKnots = this.getDistinctKnots();
        // const knotMultiplicity: number[] = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence().multiplicities();
        const knotMultiplicity = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(this._increasingKnotSequence).multiplicities();
        if (knotMultiplicity.length !== distinctKnots.length) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "generateKnotSequenceOfBSplineR1toR2", "inconsistent set of knot multiplicities compared to the disctinct knot values.");
            error.logMessage();
        }
        else if (knotMultiplicity[0] !== knotMultiplicity[knotMultiplicity.length - 1]) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "generateKnotSequenceOfBSplineR1toR2", "knot multiplicities at sequence extremities differ. Cannot generate the knot sequence of the corresponding open curve.");
            error.logMessage();
        }
        const knotToAddAtOrigin = [];
        for (let j = 0; j < (this._degree - knotMultiplicity[0] + 2); j++) {
            knotToAddAtOrigin.push(knotSequence[0] + (knotSequence[knotSequence.length - 1 - this._degree - j] - knotSequence[knotSequence.length - 1]));
        }
        const knotToAddAtExtremity = [];
        for (let j = 0; j < (this._degree - knotMultiplicity[knotMultiplicity.length - 1] + 2); j++) {
            knotToAddAtExtremity.push(knotSequence[knotSequence.length - 1] + (knotSequence[j + 1] - knotSequence[0]));
        }
        let result = knotToAddAtOrigin.concat(knotSequence).concat(knotToAddAtExtremity);
        return result;
    }
    // generateKnotSequenceOfBSplineR1toR2(): number[] {
    //     const knotSequence = this._knots;
    //     const distinctKnots = this.getDistinctKnots();
    //     const knotMultiplicity: number[] = [];
    //     let i = this._knots.length - 1;
    //     while(i > 0) {
    //         const multiplicity = this.knotMultiplicity(i);
    //         knotMultiplicity.splice(0, 0, multiplicity);
    //         i = i - multiplicity;
    //     }
    //     if(knotMultiplicity.length !== distinctKnots.length) {
    //         const error = new ErrorLog(this.constructor.name, "generateKnotSequenceOfBSplineR1toR2", "inconsistent set of knot multiplicities compared to the disctinct knot values.");
    //         error.logMessageToConsole();
    //     } else if(knotMultiplicity[0] !== knotMultiplicity[knotMultiplicity.length - 1]) {
    //         const error = new ErrorLog(this.constructor.name, "generateKnotSequenceOfBSplineR1toR2", "knot multiplicities at sequence extremities differ. Cannot generate the knot sequence of the corresponding open curve.");
    //         error.logMessageToConsole();
    //     }
    //     const knotToAddAtOrigin: number[] = [];
    //     for(let j = 0; j < (this._degree - knotMultiplicity[0] + 2); j++) {
    //         knotToAddAtOrigin.push(knotSequence[0] + (knotSequence[knotSequence.length - 1 - this._degree - j] - knotSequence[knotSequence.length - 1]));
    //     }
    //     const knotToAddAtExtremity: number[] = [];
    //     for(let j = 0; j < (this._degree - knotMultiplicity[knotMultiplicity.length - 1] + 2); j++) {
    //         knotToAddAtExtremity.push(knotSequence[knotSequence.length - 1] + (knotSequence[j + 1] - knotSequence[0]));
    //     }
    //     let result =  knotToAddAtOrigin.concat(knotSequence).concat(knotToAddAtExtremity);
    //     return result;
    // }
    generateKnotSequenceOfPeriodicBSplineR1toR2(bSplineDegreeUp) {
        const knotSequenceDegreeUp = bSplineDegreeUp.increasingKnotSequence.allAbscissae;
        while (knotSequenceDegreeUp[0] !== this._increasingKnotSequence.allAbscissae[0]) {
            knotSequenceDegreeUp.splice(0, 1);
        }
        while (knotSequenceDegreeUp[knotSequenceDegreeUp.length - 1] !== this._increasingKnotSequence.allAbscissae[this._increasingKnotSequence.length() - 1]) {
            knotSequenceDegreeUp.splice((knotSequenceDegreeUp.length - 1), 1);
        }
        return knotSequenceDegreeUp;
    }
    // generateKnotSequenceOfPeriodicBSplineR1toR2(bSplineDegreeUp: BSplineR1toR2): number[] {
    //     let knotSequenceDegreeUp = bSplineDegreeUp.knots;
    //     while(knotSequenceDegreeUp[0] !== this._knots[0]) {
    //         knotSequenceDegreeUp.splice(0, 1);
    //     }
    //     while(knotSequenceDegreeUp[knotSequenceDegreeUp.length - 1] !== this._knots[this._knots.length - 1]) {
    //         knotSequenceDegreeUp.splice((knotSequenceDegreeUp.length - 1), 1);
    //     }
    //     return knotSequenceDegreeUp;
    // }
    generateControlPolygonOfBSplineR1toR2() {
        let result = [];
        // const knotMultiplicity: number[] = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence().multiplicities();
        const knotMultiplicity = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(this._increasingKnotSequence).multiplicities();
        if (knotMultiplicity[0] === (this._degree + 1)) {
            result = this._controlPoints;
        }
        else {
            const controlPtsToAddAtOrigin = [];
            for (let j = 0; j < (this._degree - knotMultiplicity[0] + 2); j++) {
                controlPtsToAddAtOrigin.push(this._controlPoints[this._controlPoints.length - 1 - j]);
            }
            result = controlPtsToAddAtOrigin.concat(this._controlPoints);
        }
        return result;
    }
    // generateControlPolygonOfBSplineR1toR2(): Vector2d[] {
    //     let result: Vector2d[] = [];
    //     const knotMultiplicity: number[] = [];
    //     let i = this._knots.length - 1;
    //     while(i > 0) {
    //         const multiplicity = this.knotMultiplicity(i);
    //         knotMultiplicity.splice(0, 0, multiplicity);
    //         i = i - multiplicity;
    //     }
    //     if(knotMultiplicity[0] === (this._degree + 1)) {
    //         result = this._controlPoints;
    //     } else {
    //         const controlPtsToAddAtOrigin: Vector2d[] = [];
    //         for(let j = 0; j < (this._degree - knotMultiplicity[0] + 2); j++) {
    //             controlPtsToAddAtOrigin.push(this._controlPoints[this._controlPoints.length - 1 - j]);
    //         }
    //         result = controlPtsToAddAtOrigin.concat(this._controlPoints);
    //     }
    //     return result;
    // }
    generateControlPolygonOfPeriodicBSplineR1toR2(bSplineDegreeUp) {
        const controlPolygonDegreeUp = bSplineDegreeUp.controlPoints;
        controlPolygonDegreeUp.splice(0, bSplineDegreeUp.degree);
        controlPolygonDegreeUp.splice((controlPolygonDegreeUp.length - 1), 1);
        return controlPolygonDegreeUp;
    }
    generateBSplineR1toR2() {
        return new BSplineR1toR2_1.BSplineR1toR2(this._controlPoints, this._increasingKnotSequence.allAbscissae);
    }
    degreeIncrement() {
        // temporary setting -> the design of an interface should avoid the definition of this method
        return new PeriodicBSplineR1toR2withOpenKnotSequence();
    }
    toPeriodicBSplineR1toR2() {
        // const periodicSequence = this._increasingKnotSequence.toPeriodicKnotSequence();
        const periodicSequence = (0, fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence)(this._increasingKnotSequence);
        const increasingKnotAbscissae = periodicSequence.allAbscissae;
        const controlPoints = this._controlPoints.slice(this._degree, this._controlPoints.length);
        const multiplicityOrigin = periodicSequence.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(0));
        for (let i = 0; i < (multiplicityOrigin - 1); i++) {
            controlPoints.splice(controlPoints.length, 0, this._controlPoints[i + this._degree - (multiplicityOrigin - 1)]);
        }
        const periodicBSpline = new PeriodicBSplineR1toR2_1.PeriodicBSplineR1toR2(controlPoints, increasingKnotAbscissae, this._degree);
        if (periodicBSpline === undefined) {
            return undefined;
        }
        else {
            return periodicBSpline;
        }
    }
    grevilleAbscissae() {
        const result = [];
        for (let i = 0; i < this.freeControlPoints.length; i += 1) {
            let sum = 0;
            const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree - 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 2 * this._degree - 2));
            for (const knot of subSequence) {
                sum += knot;
            }
            result.push(sum / this._degree);
        }
        return result;
    }
    // Probably not compatible with periodic BSplines -> to be modified
    removeKnot(indexFromFindSpan, tolerance = BSplineR1toR1_1.KNOT_REMOVAL_TOLERANCE) {
        //Piegl and Tiller, The NURBS book, p : 185
        const index = indexFromFindSpan;
        // end knots are not removed
        if (index > this._degree && index < this._increasingKnotSequence.length() - this._degree - 1) {
            throw new Error("index out of range");
        }
        const indexIncSeq = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
        const multiplicity = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        const last = index - multiplicity;
        const first = index - this._degree;
        const offset = first - 1;
        //std::vector<vectorType> local(2*degree+1);
        const local = [];
        local[0] = this.controlPoints[offset];
        local[last + 1 - offset] = this.controlPoints[last + 1];
        let i = first;
        let j = last;
        let ii = 1;
        let jj = last - offset;
        let removable = false;
        const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(first), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(last + this.degree + 1));
        // Compute new control point for one removal step
        const offset_i = first;
        while (j > i) {
            const offset_j = last;
            const alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            const alpha_j = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[j - offset_j]) / (subSequence[j + this.degree + 1 - offset_j] - subSequence[j - offset_j]);
            local[ii] = (this.controlPoints[i].substract(local[ii - 1].multiply(1.0 - alpha_i))).multiply(1 / alpha_i);
            local[jj] = (this.controlPoints[j].substract(local[jj + 1].multiply(alpha_j))).multiply(1 / (1.0 - alpha_j));
            ++i;
            ++ii;
            --j;
            --jj;
        }
        if (j < i) {
            if ((local[ii - 1].substract(local[jj + 1])).norm() <= tolerance) {
                removable = true;
            }
        }
        else {
            const alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            if (((this.controlPoints[i].substract((local[ii + 1].multiply(alpha_i)))).add(local[ii - 1].multiply(1.0 - alpha_i))).norm() <= tolerance) {
                removable = true;
            }
        }
        if (!removable)
            return;
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
        this._increasingKnotSequence = this._increasingKnotSequence.decrementKnotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        const fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    }
    // removeKnot(indexFromFindSpan: number, tolerance: number = 10e-5): void {
    //     //Piegl and Tiller, The NURBS book, p : 185
    //     const index = indexFromFindSpan;
    //     // end knots are not removed
    //     if (index > this._degree && index < this.knots.length-this._degree - 1) {
    //         throw new Error("index out of range");
    //     }
    //     //const double tolerance = 1;
    //     const multiplicity = this.knotMultiplicity(index);
    //     const last = index - multiplicity;
    //     const first = index -this.degree;
    //     const offset = first -1;
    //     //std::vector<vectorType> local(2*degree+1);
    //     let local: Vector2d[] = [];
    //     local[0] = this.controlPoints[offset];
    //     local[last+1-offset] = this.controlPoints[last+1];
    //     let i = first;
    //     let j = last;
    //     let ii = 1;
    //     let jj = last - offset;
    //     let removable = false;
    //     // Compute new control point for one removal step
    //     while (j>i){
    //         let alpha_i = (this.knots[index] - this.knots[i])/(this.knots[i+this.degree+1]-this.knots[i]);
    //         let alpha_j = (this.knots[index] - this.knots[j])/(this.knots[j+this.degree+1] - this.knots[j]);
    //         local[ii] = (this.controlPoints[i].substract(local[ii-1].multiply(1.0-alpha_i))).multiply(1 / alpha_i ) 
    //         local[jj] = (this.controlPoints[j].substract(local[jj+1].multiply(alpha_j))).multiply(1 / (1.0-alpha_j) )
    //         ++i;
    //         ++ii;
    //         --j;
    //         --jj;
    //     }
    //     if (j < i) {
    //         if ((local[ii-1].substract(local[jj+1])).norm() <= tolerance){
    //             removable = true;
    //         }
    //     }
    //     else {
    //         const alpha_i = (this.knots[index] - this.knots[i]) / (this.knots[i+this.degree+1]-this.knots[i]) ;
    //         if ( ((this.controlPoints[i].substract((local[ii+1].multiply(alpha_i)))).add (local[ii-1].multiply(1.0- alpha_i))).norm() <= tolerance) {
    //             removable = true;
    //         }
    //     }
    //     if (!removable) return;
    //     else {
    //         let indInc = first;
    //         let indDec = last;
    //         while (indDec > indInc) {
    //             this.controlPoints[indInc] = local[indInc-offset];
    //             this.controlPoints[indDec] = local[indDec-offset];
    //             ++indInc;
    //             --indDec;
    //         }
    //     }
    //     this.knots.splice(index, 1);
    //     const fout = (2*index - multiplicity - this.degree) / 2;
    //     this._controlPoints.splice(fout, 1);
    // }
    getDistinctKnots() {
        // const indexStrctInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.indexKnotOrigin);
        const indexStrctInc = this._increasingKnotSequence.indexKnotOrigin;
        const multiplicityBoundary = this.knotMultiplicity(indexStrctInc);
        const result = super.getDistinctKnots();
        return result.slice(this.degree - (multiplicityBoundary - 1), result.length - this.degree + (multiplicityBoundary - 1));
    }
    setControlPointPosition(i, value) {
        if (i < 0 || i >= this.periodicControlPointsLength) {
            throw new Error("Control point indentifier is out of range");
        }
        super.setControlPointPosition(i, value.clone());
        if (i < this._degree) {
            const j = this.periodicControlPointsLength + i;
            super.setControlPointPosition(j, value.clone());
        }
    }
    isKnotlMultiplicityZero(u) {
        let multiplicityZero = true;
        if (this.isAbscissaCoincidingWithKnot(u))
            multiplicityZero = false;
        return multiplicityZero;
    }
    findCoincidentKnot(u) {
        let index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        if (!this.isKnotlMultiplicityZero(u))
            index = this.getFirstKnotIndexCoincidentWithAbscissa(u);
        return index;
    }
    insertKnot(u) {
        let uToInsert = u;
        let index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        if (!this.isKnotlMultiplicityZero(u)) {
            index = this.findCoincidentKnot(u);
            const indexSpan = this._increasingKnotSequence.findSpan(this._increasingKnotSequence.abscissaAtIndex(index));
            uToInsert = this._increasingKnotSequence.abscissaAtIndex(indexSpan);
        }
        if (uToInsert < this.knots[2 * this._degree] || uToInsert > this.knots[this.knots.length - 2 * this._degree - 1]) {
            const knotAbsc = this._increasingKnotSequence.allAbscissae;
            const indexOrigin = this._increasingKnotSequence.indexKnotOrigin;
            // temporary modif
            const knotAbscResetOrigin = [];
            // const knotAbscResetOrigin = resetKnotAbscissaeToOrigin(knotAbsc);
            const sameSplineOpenCurve = new BSplineR1toR2_1.BSplineR1toR2(this.controlPoints, knotAbscResetOrigin);
            // const newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexOrigin) + uToInsert;
            const indexInc = this._increasingKnotSequence.toKnotIndexIncreasingSequence(indexOrigin);
            const newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexInc) + uToInsert;
            const indexSpan = this._increasingKnotSequence.findSpan(uToInsert);
            const indexStrictIncSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexSpan);
            const knotMultiplicity = this.knotMultiplicity(indexStrictIncSeq);
            if (knotMultiplicity === this._degree) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "cannot insert knot. Current knot multiplicity already equals curve degree.");
                error.logMessage();
            }
            else {
                // two knot insertions must take place to preserve the periodic structure of the function basis
                // unless if uToInsert = uSymmetric. In this case, only one knot insertion is possible
                const uSymmetric = this.findKnotAbscissaeRightBound() + knotAbscResetOrigin[indexOrigin.knotIndex];
                sameSplineOpenCurve.insertKnot(newUToInsert, 1);
                if ((uSymmetric - uToInsert) !== uToInsert) {
                    sameSplineOpenCurve.insertKnot(uSymmetric - uToInsert, 1);
                }
                let newKnotAbsc = sameSplineOpenCurve.increasingKnotSequence.allAbscissae;
                for (let i = 0; i < newKnotAbsc.length; i++) {
                    newKnotAbsc[i] -= knotAbscResetOrigin[indexOrigin.knotIndex];
                }
                let newCtrlPts = sameSplineOpenCurve.controlPoints;
                if (indexSpan.knotIndex === indexOrigin.knotIndex) {
                    // the knot inserted is located at the origin of the periodic curve. To obtain the new knot
                    // sequence, the extreme knots must be removed as well as the corresponding control points
                    newKnotAbsc = newKnotAbsc.slice(1, newKnotAbsc.length - 1);
                    newCtrlPts = sameSplineOpenCurve.controlPoints.slice(1, sameSplineOpenCurve.controlPoints.length - 1);
                }
                this._controlPoints = newCtrlPts;
                this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newKnotAbsc });
            }
            return;
        }
        else {
            super.insertKnot(uToInsert, 1);
        }
    }
    insertKnotIntoTempSpline(u) {
        let uToInsert = u;
        let index = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        if (!this.isKnotlMultiplicityZero(u)) {
            index = this.findCoincidentKnot(u);
            const indexSpan = this._increasingKnotSequence.findSpan(this._increasingKnotSequence.abscissaAtIndex(index));
            uToInsert = this._increasingKnotSequence.abscissaAtIndex(indexSpan);
        }
        if (uToInsert < this.knots[2 * this._degree] || uToInsert > this.knots[this.knots.length - 2 * this._degree - 1]) {
            const knotAbsc = this._increasingKnotSequence.allAbscissae;
            const indexOrigin = this._increasingKnotSequence.indexKnotOrigin;
            // temporary modif
            const knotAbscResetOrigin = (0, Piegl_Tiller_NURBS_Book_1.resetKnotAbscissaeToOrigin)(knotAbsc);
            const sameSplineOpenCurve = new BSplineR1toR2_1.BSplineR1toR2(this.controlPoints, knotAbscResetOrigin);
            // const newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexOrigin) + uToInsert;
            const indexIncSeq = this._increasingKnotSequence.toKnotIndexIncreasingSequence(indexOrigin);
            const newUToInsert = sameSplineOpenCurve.increasingKnotSequence.abscissaAtIndex(indexIncSeq) + uToInsert;
            const indexSpan = this._increasingKnotSequence.findSpan(uToInsert);
            const indexStrictIncSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexSpan);
            const knotMultiplicity = this.knotMultiplicity(indexStrictIncSeq);
            if (knotMultiplicity === this._degree) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "cannot insert knot. Current knot multiplicity already equals curve degree.");
                error.logMessage();
            }
            else {
                // two knot insertions must take place to preserve the periodic structure of the function basis
                // unless if uToInsert = uSymmetric. In this case, only one knot insertion is possible
                const uSymmetric = this.findKnotAbscissaeRightBound() + knotAbscResetOrigin[indexOrigin.knotIndex];
                sameSplineOpenCurve.insertKnot(newUToInsert, 1);
                if ((uSymmetric - uToInsert) !== uToInsert) {
                    sameSplineOpenCurve.insertKnot(uSymmetric - uToInsert, 1);
                }
                let newKnotAbsc = sameSplineOpenCurve.increasingKnotSequence.allAbscissae;
                for (let i = 0; i < newKnotAbsc.length; i++) {
                    newKnotAbsc[i] -= knotAbscResetOrigin[indexOrigin.knotIndex];
                }
                let newCtrlPts = sameSplineOpenCurve.controlPoints;
                // if(indexSpan.knotIndex === indexOrigin.knotIndex) {
                //     // the knot inserted is located at the origin of the periodic curve. To obtain the new knot
                //     // sequence, the extreme knots must be removed as well as the corresponding control points
                //     newKnotAbsc = newKnotAbsc.slice(1, newKnotAbsc.length - 1);
                //     newCtrlPts = sameSplineOpenCurve.controlPoints.slice(1, sameSplineOpenCurve.controlPoints.length - 1);
                // }
                this._controlPoints = newCtrlPts;
                this._increasingKnotSequence = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: newKnotAbsc });
            }
            return;
        }
        else {
            super.insertKnot(uToInsert, 1);
        }
    }
    findKnotAbscissaeRightBound() {
        let result = 0.0;
        let cumulativeMultiplicity = 0;
        // const strictIncSeq = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        const strictIncSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC)(this._increasingKnotSequence);
        const indexOrigin = this._increasingKnotSequence.indexKnotOrigin;
        for (let j = 0; j < indexOrigin.knotIndex; j++) {
            cumulativeMultiplicity += strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(j));
        }
        const multiplicityAtOrigin = strictIncSeq.knotMultiplicity(indexOrigin);
        let cumulativeMultRightBound = 0;
        for (let i = strictIncSeq.length() - 1; i >= strictIncSeq.length() - indexOrigin.knotIndex; i--) {
            cumulativeMultRightBound += strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(i));
        }
        if (multiplicityAtOrigin === strictIncSeq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictIncSeq.length() - indexOrigin.knotIndex - 1)))
            result = strictIncSeq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(strictIncSeq.length() - indexOrigin.knotIndex - 1));
        return result;
    }
    scale(factor) {
        const cp = [];
        this._controlPoints.forEach(element => {
            cp.push(element.multiply(factor));
        });
        return new PeriodicBSplineR1toR2withOpenKnotSequence(cp, this.knots.slice());
    }
    scaleY(factor) {
        const cp = [];
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d_1.Vector2d(element.x, element.y * factor));
        });
        return new PeriodicBSplineR1toR2withOpenKnotSequence(cp, this.knots.slice());
    }
    scaleX(factor) {
        const cp = [];
        this._controlPoints.forEach(element => {
            cp.push(new Vector2d_1.Vector2d(element.x * factor, element.y));
        });
        return new PeriodicBSplineR1toR2withOpenKnotSequence(cp, this.knots.slice());
    }
    evaluateOutsideRefInterval(u) {
        let result = new Vector2d_1.Vector2d();
        const knots = this.getDistinctKnots();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        }
        else {
            u = u % (knots[knots.length - 1] - knots[0]);
            result = this.evaluate(u);
        }
        return result;
    }
}
exports.PeriodicBSplineR1toR2withOpenKnotSequence = PeriodicBSplineR1toR2withOpenKnotSequence;
function create_PeriodicBSplineR1toR2(controlPoints, knots) {
    const newControlPoints = [];
    for (const cp of controlPoints) {
        newControlPoints.push(new Vector2d_1.Vector2d(cp[0], cp[1]));
    }
    return new PeriodicBSplineR1toR2withOpenKnotSequence(newControlPoints, knots);
}
exports.create_PeriodicBSplineR1toR2 = create_PeriodicBSplineR1toR2;
