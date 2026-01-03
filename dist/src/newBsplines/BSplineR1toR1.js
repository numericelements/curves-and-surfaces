"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSplineR1toR1 = exports.KNOT_REMOVAL_TOLERANCE = void 0;
const Piegl_Tiller_NURBS_Book_1 = require("./Piegl_Tiller_NURBS_Book");
const Vector2d_1 = require("../mathVector/Vector2d");
const AbstractBSplineR1toR1_1 = require("./AbstractBSplineR1toR1");
const BernsteinDecompositionR1toR1_1 = require("./BernsteinDecompositionR1toR1");
const BSplineR1toR2_1 = require("./BSplineR1toR2");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const IncreasingOpenKnotSequenceOpenCurve_1 = require("./IncreasingOpenKnotSequenceOpenCurve");
const KnotSequences_1 = require("../namedConstants/KnotSequences");
const KnotSequenceConstructorInterface_1 = require("./KnotSequenceConstructorInterface");
const fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1 = require("./KnotSequenceAndUtilities/fromStrictlyIncreasingtToIncreasingKnotSequenceOC");
const fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1 = require("./KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC");
const KnotIndexStrictlyIncreasingSequence_1 = require("./KnotIndexStrictlyIncreasingSequence");
const KnotIndexIncreasingSequence_1 = require("./KnotIndexIncreasingSequence");
const Knots_1 = require("../namedConstants/Knots");
exports.KNOT_REMOVAL_TOLERANCE = 10e-5;
/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
class BSplineR1toR1 extends AbstractBSplineR1toR1_1.AbstractBSplineR1toR1 {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints = [0], knots = [0, 1]) {
        super(controlPoints, knots);
        const maxMultiplicityOrder = this._degree + 1;
        // this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots});
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots });
    }
    get knots() {
        return this._increasingKnotSequence.allAbscissae;
    }
    get increasingKnotSequence() {
        return this._increasingKnotSequence;
    }
    set knots(knots) {
        this._degree = this.computeDegree(knots.length);
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(this._degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: knots });
    }
    bernsteinDecomposition() {
        // Piegl_Tiller_NURBS_Book.ts
        return new BernsteinDecompositionR1toR1_1.BernsteinDecompositionR1toR1((0, Piegl_Tiller_NURBS_Book_1.decomposeFunction)(this));
    }
    clone() {
        return new BSplineR1toR1(this._controlPoints.slice(), this._increasingKnotSequence.allAbscissae.slice());
    }
    derivative() {
        const newControlPoints = [];
        const knotIdx_MultDegPlusOne = [];
        // const strictlyIncSeq = this._increasingKnotSequence.toStrictlyIncreasingKnotSequence();
        let strictlyIncSeq = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(this._increasingKnotSequence);
        const strictlyIncSeq_Mult = strictlyIncSeq.multiplicities();
        for (let i = 0; i < strictlyIncSeq_Mult.length; i++) {
            if (strictlyIncSeq_Mult[i] === (this._degree + 1) && i !== 0 && i !== (strictlyIncSeq.length() - 1))
                knotIdx_MultDegPlusOne.push(i);
        }
        for (let i = 0; i < this._controlPoints.length - 1; i += 1) {
            const indexIncSeq1 = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + this._degree + 1);
            const indexStrictIncSeq1 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq1);
            const indexIncSeq2 = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1);
            const indexStrictIncSeq2 = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq2);
            if (indexStrictIncSeq1.knotIndex !== indexStrictIncSeq2.knotIndex) {
                const newCtrlPt = (this._controlPoints[i + 1] - (this._controlPoints[i])) * (this._degree /
                    (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq1) - this._increasingKnotSequence.abscissaAtIndex(indexIncSeq2)));
                newControlPoints.push(newCtrlPt);
            }
        }
        for (const multiplicity of knotIdx_MultDegPlusOne) {
            // strictlyIncSeq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(multiplicity));
            const strictlyIncSeq1 = strictlyIncSeq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(multiplicity), false);
            strictlyIncSeq = strictlyIncSeq1.clone();
        }
        // const newIncKnotSeq = strictlyIncSeq.toIncreasingKnotSequence();
        const newIncKnotSeq = (0, fromStrictlyIncreasingtToIncreasingKnotSequenceOC_1.fromStrictlyIncreasingtToIncreasingKnotSequenceOC)(strictlyIncSeq);
        const newKnots = newIncKnotSeq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(newIncKnotSeq.length() - 2));
        // if(newKnots[0] !== 0.0) {
        //     const offset = newKnots[0];
        //     for(let i = 0; i < newKnots.length; i++) {
        //         newKnots[i] -= offset;
        //     }
        // }
        return new BSplineR1toR1(newControlPoints, newKnots);
    }
    /* JCL 2024/05/11 increase the degree of the spline while preserving its shape (Prautzsch algorithm) */
    degreeIncrement() {
        const intermSplKnotsAndCPs = this.generateIntermediateSplinesForDegreeElevation();
        let splineHigherDegree = new BSplineR1toR1(intermSplKnotsAndCPs.CPs[0], intermSplKnotsAndCPs.knotVectors[0]);
        for (let i = 1; i <= this._degree; i += 1) {
            let splineTemp = new BSplineR1toR1(intermSplKnotsAndCPs.CPs[i], intermSplKnotsAndCPs.knotVectors[i]);
            const strictIncSeq_splineHigherDegree = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(splineHigherDegree._increasingKnotSequence);
            const strictIncSeq_splineTemp = (0, fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC_1.fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC)(splineTemp._increasingKnotSequence);
            for (let j = 1; j < (strictIncSeq_splineHigherDegree.length() - 1); j++) {
                const index = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(j);
                if (strictIncSeq_splineHigherDegree.knotMultiplicity(index) > strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineTemp.insertKnotBoehmAlgorithm(strictIncSeq_splineTemp.abscissaAtIndex(index));
                if (strictIncSeq_splineHigherDegree.knotMultiplicity(index) < strictIncSeq_splineTemp.knotMultiplicity(index))
                    splineHigherDegree.insertKnotBoehmAlgorithm(strictIncSeq_splineHigherDegree.abscissaAtIndex(index));
            }
            // let j = 0, k = 0;
            // while(j < splineHigherDegree._increasingKnotSequence.length()) {
            //     if(splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(j)) !== splineTemp._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(k))
            //         && splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(j)) < splineTemp._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(k))) {
            //         splineTemp.insertKnotBoehmAlgorithm(splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(j)), 1);
            //     } else if(splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(j)) !== splineTemp._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(k))
            //         && splineHigherDegree._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(j)) > splineTemp._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(k))) {
            //         splineHigherDegree.insertKnotBoehmAlgorithm(splineTemp.knots[k], 1);
            //     }
            //     j += 1;
            //     k += 1;
            // }
            let tempCPs = [];
            for (let ind = 0; ind < splineHigherDegree.controlPoints.length; ind += 1) {
                tempCPs[ind] = splineHigherDegree.controlPoints[ind] + splineTemp.controlPoints[ind];
            }
            splineHigherDegree.controlPoints = tempCPs;
        }
        let tempHigherDegCP = [];
        for (let j = 0; j < splineHigherDegree.controlPoints.length; j += 1) {
            tempHigherDegCP[j] = splineHigherDegree.controlPoints[j] * (1 / (this.degree + 1));
        }
        splineHigherDegree.controlPoints = tempHigherDegCP;
        console.log("degreeIncrease: " + splineHigherDegree._increasingKnotSequence.allAbscissae);
        return new BSplineR1toR1(splineHigherDegree.controlPoints, splineHigherDegree._increasingKnotSequence.allAbscissae);
    }
    generateIntermediateSplinesForDegreeElevation() {
        const knotSequences = [];
        const controlPolygons = [];
        for (let i = 0; i <= this._degree; i += 1) {
            let knotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(this._increasingKnotSequence.maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: this._increasingKnotSequence.allAbscissae });
            let controlPolygon = this._controlPoints.slice();
            let k = 0;
            const knotIndices = [];
            for (let j = i; j < this._increasingKnotSequence.length(); j += this._degree + 1) {
                const indexStrctIncreasingSeq = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(j));
                knotIndices.push(indexStrctIncreasingSeq);
                // const knotSequence1 = knotSequence.raiseKnotMultiplicity(indexStrctIncreasingSeq, 1, false);
                // const knotSequence2 = new IncreasingOpenKnotSequenceOpenCurve(this._increasingKnotSequence.maxMultiplicityOrder +  1, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knotSequence1.allAbscissae});
                // knotSequence = knotSequence2.clone();
                if (j < this._controlPoints.length) {
                    let controlPoint = this._controlPoints[j];
                    controlPolygon.splice((j + k), 0, controlPoint);
                }
                k += 1;
            }
            const knotSequence1 = knotSequence.raiseKnotMultiplicity(knotIndices, 1, false);
            knotSequences.push(knotSequence1.allAbscissae);
            // knotSequences.push(knotSequence.allAbscissae);
            controlPolygons.push(controlPolygon);
        }
        return {
            knotVectors: knotSequences,
            CPs: controlPolygons
        };
    }
    insertKnotBoehmAlgorithm(u, times = 1) {
        // Uses Boehm algorithm without restriction on the structure of the knot sequence,
        //i.e. applicable to non uniform or arbitrary knot sequences
        if (times <= 0) {
            return;
        }
        let index = this.findSpanBoehmAlgorithm(u);
        if (u > this._increasingKnotSequence.abscissaAtIndex(index) && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex + 1))) {
            // if(times > )
        }
        let multiplicity = 0;
        if (this._increasingKnotSequence.isAbscissaCoincidingWithKnot(u)
            && Math.abs(u - this._increasingKnotSequence.abscissaAtIndex(index)) < KnotSequences_1.KNOT_COINCIDENCE_TOLERANCE) {
            multiplicity = this._increasingKnotSequence.knotMultiplicityAtAbscissa(this._increasingKnotSequence.abscissaAtIndex(index));
        }
        if ((multiplicity + times) > (this._degree + 1)) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "insertKnot", "The number of times the knot should be inserted is incompatible with the curve degree.");
            console.log("u = ", u, " multiplicity + times = ", (multiplicity + times));
            error.logMessage();
            return;
        }
        const indexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(index);
        let newIndexStrictInc = new KnotIndexStrictlyIncreasingSequence_1.KnotIndexStrictlyIncreasingSequence(Knots_1.DEFAULT_KNOT_INDEX);
        for (let t = 0; t < times; t += 1) {
            const newControlPoints = [];
            for (let i = 0; i < index.knotIndex; i += 1) {
                newControlPoints[i] = this._controlPoints[i];
            }
            const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - this._degree + 1), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index.knotIndex - multiplicity + this._degree));
            for (let i = index.knotIndex - this._degree + 1; i <= index.knotIndex - multiplicity; i += 1) {
                const offset = index.knotIndex - this._degree + 1;
                // let alpha = (u - this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i)))
                // / (this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i + this._degree)) - this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence(i)));
                const alpha = (u - subSequence[i - offset]) / (subSequence[i + this._degree - offset] - subSequence[i - offset]);
                newControlPoints[i] = this._controlPoints[i - 1] * (1 - alpha) + this._controlPoints[i] * (alpha);
            }
            for (let i = index.knotIndex - multiplicity; i < this._controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this._controlPoints[i];
            }
            if (multiplicity > 0) {
                this._increasingKnotSequence.raiseKnotMultiplicity(indexStrictInc, 1);
            }
            else if (multiplicity === 0 && t === 0) {
                this._increasingKnotSequence.insertKnot(u, 1);
                const newIndex = this._increasingKnotSequence.findSpan(u);
                newIndexStrictInc = this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(newIndex);
            }
            else {
                this._increasingKnotSequence.raiseKnotMultiplicity(newIndexStrictInc, 1);
            }
            // this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index.knotIndex += 1;
        }
    }
    findSpanBoehmAlgorithm(u) {
        // Special case
        if (u === this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 1))) {
            return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(this._increasingKnotSequence.length() - this._degree - 2);
        }
        // Do binary search
        let low = 0;
        let high = this._increasingKnotSequence.length() - 1 - this._degree;
        let i = Math.floor((low + high) / 2);
        while (!(this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i)) <= u && u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i + 1)))) {
            if (u < this._increasingKnotSequence.abscissaAtIndex(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i))) {
                high = i;
            }
            else {
                low = i;
            }
            i = Math.floor((low + high) / 2);
        }
        return new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(i);
    }
    elevateDegree(times = 1) {
        const bds = this.bernsteinDecomposition();
        bds.elevateDegree();
        const knots = this.distinctKnots();
        const newSpline = (0, BernsteinDecompositionR1toR1_1.splineRecomposition)(bds, knots);
        for (let i = 0; i < knots.length; i += 1) {
            let m = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(this._increasingKnotSequence.findSpan(knots[i])));
            for (let j = 0; j < newSpline.degree - m - 1; j += 1) {
                newSpline.removeKnot(newSpline.increasingKnotSequence.findSpan(newSpline.knots[i]).knotIndex);
            }
        }
        this.controlPoints = newSpline.controlPoints;
        this._increasingKnotSequence = new IncreasingOpenKnotSequenceOpenCurve_1.IncreasingOpenKnotSequenceOpenCurve(newSpline.degree + 1, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE, knots: newSpline.knots });
        this._degree = newSpline.degree;
    }
    removeKnot(indexFromFindSpan, tolerance = exports.KNOT_REMOVAL_TOLERANCE) {
        //Piegl and Tiller, The NURBS book, p : 185
        const index = indexFromFindSpan;
        // end knots are not removed
        // if (index > this._degree && index < this._knots.length - this._degree - 1) {
        if (index > this._degree && index < this._increasingKnotSequence.length() - this._degree - 1) {
            throw new Error("index out of range");
        }
        const indexIncSeq = new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(index);
        const multiplicity = this.knotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        const last = index - multiplicity;
        const first = index - this.degree;
        const offset = first - 1;
        const local = [];
        local[0] = this.controlPoints[offset];
        local[last + 1 - offset] = this.controlPoints[last + 1];
        let i = first;
        let j = last;
        let ii = 1;
        let jj = last - offset;
        let removable = false;
        const subSequence = this._increasingKnotSequence.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(first), new KnotIndexIncreasingSequence_1.KnotIndexIncreasingSequence(last + this.degree + 1));
        // Compute new control points for one removal step
        const offset_i = first;
        while (j > i) {
            const offset_j = last;
            const alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            const alpha_j = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[j - offset_j]) / (subSequence[j + this.degree + 1 - offset_j] - subSequence[j - offset_j]);
            local[ii] = (this.controlPoints[i] - (local[ii - 1] * (1.0 - alpha_i))) / alpha_i;
            local[jj] = (this.controlPoints[j] - (local[jj + 1] * (alpha_j))) / (1.0 - alpha_j);
            ++i;
            ++ii;
            --j;
            --jj;
        }
        if (j < i) {
            if ((local[ii - 1] - (local[jj + 1])) <= tolerance) {
                removable = true;
            }
        }
        else {
            const alpha_i = (this._increasingKnotSequence.abscissaAtIndex(indexIncSeq) - subSequence[i - offset_i]) / (subSequence[i + this.degree + 1 - offset_i] - subSequence[i - offset_i]);
            if (((this.controlPoints[i] - (local[ii + 1] * (alpha_i))) + (local[ii - 1] * (1.0 - alpha_i))) <= tolerance) {
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
        this._increasingKnotSequence = this._increasingKnotSequence.decrementKnotMultiplicity(this._increasingKnotSequence.toKnotIndexStrictlyIncreasingSequence(indexIncSeq));
        const fout = (2 * index - multiplicity - this.degree) / 2;
        this._controlPoints.splice(fout, 1);
    }
    moveControlPoint(i, delta) {
        if (i < 0 || i >= this.controlPoints.length) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "moveControlPoint", "Control point index is out of range.");
            error.logMessage();
            return;
        }
        this.controlPoints[i] += delta;
    }
    convertTocurve() {
        let x = this.grevilleAbscissae();
        let cp = [];
        for (let i = 0; i < x.length; i += 1) {
            cp.push(new Vector2d_1.Vector2d(x[i], this._controlPoints[i]));
        }
        return new BSplineR1toR2_1.BSplineR1toR2(cp, this._increasingKnotSequence.allAbscissae);
    }
    evaluateOutsideRefInterval(u) {
        let result;
        const spline = this.clone();
        const knots = spline.distinctKnots().slice();
        if (u >= knots[0] && u <= knots[knots.length - 1]) {
            result = 0.0;
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "evaluateOutsideRefInterval", "Parameter value for evaluation is not outside the knot interval.");
            error.logMessage();
        }
        else {
            const extendedSpline = spline.extend(u);
            if (u < knots[0]) {
                result = extendedSpline.evaluate(0.0);
            }
            else {
                result = extendedSpline.evaluate(knots[knots.length - 1]);
            }
        }
        return result;
    }
    extend(uAbsc) {
        let result = new BSplineR1toR1();
        const knots = this.distinctKnots().slice();
        if (uAbsc >= knots[0] && uAbsc <= knots[knots.length - 1]) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extend", "Parameter value for extension is not outside the knot interval.");
            error.logMessage();
        }
        else {
            let tempCurve = this.clone();
            let reversed = false;
            let u;
            if (uAbsc > knots[knots.length - 1]) {
                tempCurve = this.revertCurve();
                u = knots[knots.length - 1] - uAbsc;
                reversed = true;
            }
            else {
                u = uAbsc;
            }
            let tempCtrlPoly = tempCurve._controlPoints;
            let tempKnots = tempCurve._increasingKnotSequence.allAbscissae;
            const vertices = [];
            for (let i = 1; i < this._degree + 1; i++) {
                let controlPolygon = [];
                controlPolygon.push(tempCtrlPoly[i]);
                const u1 = (tempKnots[this._degree + i] - u) / (tempKnots[this._degree + i] - tempKnots[0]);
                const u2 = (u - tempKnots[0]) / (tempKnots[this._degree + i] - tempKnots[0]);
                const vertex = tempCtrlPoly[i - 1] * u1 + tempCtrlPoly[i] * u2;
                controlPolygon.splice(0, 0, vertex);
                for (let j = 1; j < i; j++) {
                    const u1 = (tempKnots[this._degree + i - j] - u) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    const u2 = (u - tempKnots[0]) / (tempKnots[this._degree + i - j] - tempKnots[0]);
                    const vertex = vertices[i - 2][vertices[i - 2].length - 1 - j] * u1 + controlPolygon[0] * u2;
                    controlPolygon.splice(0, 0, vertex);
                }
                vertices.push(controlPolygon);
            }
            for (let k = 0; k < this._degree + 1; k++) {
                tempCtrlPoly[k] = vertices[vertices.length - 1][k];
                tempKnots[k] = u;
            }
            // const intervalSpan = tempKnots[tempKnots.length - 1] - tempKnots[0];
            const offset = tempKnots[0];
            for (let i = 0; i < tempKnots.length; i++) {
                // tempKnots[i] = tempKnots[tempKnots.length - 1] - (tempKnots[tempKnots.length - 1] - tempKnots[i]) / intervalSpan;
                tempKnots[i] = tempKnots[i] - offset;
            }
            result = new BSplineR1toR1(tempCtrlPoly, tempKnots);
            if (reversed)
                result = result.revertCurve();
        }
        return result;
    }
    revertCurve() {
        const vertices = [];
        for (let i = 0; i < this._controlPoints.length; i++) {
            vertices.push(this._controlPoints[this._controlPoints.length - 1 - i]);
        }
        const result = new BSplineR1toR1(vertices, this._increasingKnotSequence.revertKnotSequence().allAbscissae);
        return result;
    }
}
exports.BSplineR1toR1 = BSplineR1toR1;
