import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Knot, KnotIndexStrictlyIncreasingSequence } from "./Knot";
import { INCREASINGOPENKNOTSEQUENCE, IncreasingOpenKnotSequence, IncreasingOpenKnotSequenceCCurve, IncreasingOpenKnotSequenceCCurve_allKnots, INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSUBSEQUENCE, IncreasingOpenKnotSubSequence, IncreasingOpenKnotSubSequenceCCurve, INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE, StrictlyIncreasingOpenKnotSequence, STRICTLYINCREASINGOPENKNOTSEQUENCE, StrictlyIncreasingOpenKnotSequenceCCurve, StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, Uniform_OpenKnotSequence, UNIFORM_OPENKNOTSEQUENCE, Uniform_PeriodicKnotSequence, UNIFORM_PERIODICKNOTSEQUENCE, UniformlySpreadInterKnots_OpenKnotSequence, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from "./KnotSequenceConstructorInterface";

// Important remark: There is an interaction between KNOT_COINCIDENCE_TOLERANCE and CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// when computing the zeros of a BSplineR1toR1. KNOT_COINCIDENCE_TOLERANCE currently set to 10E-2 CONVERGENCE_TOLERANCE_FOR_ZEROS_COMPUTATION
// It may be needed to check if there are side effects (JCL 2024/05/06).
export const KNOT_COINCIDENCE_TOLERANCE = 10E-10;

export abstract class AbstractKnotSequence {

    protected abstract knotSequence: Array<Knot>;
    protected _maxMultiplicityOrder: number;
    protected _isKnotSpacingUniform: boolean;
    protected _isKnotMultiplicityUniform: boolean;

    constructor(maxMultiplicityOrder: number) {
        this._maxMultiplicityOrder = maxMultiplicityOrder;
        this._isKnotSpacingUniform = true;
        this._isKnotMultiplicityUniform = true;
    }

    get maxMultiplicityOrder() {
        return this._maxMultiplicityOrder;
    }

    get isKnotSpacingUniform() {
        return this._isKnotSpacingUniform;
    }

    get isKnotMultiplicityUniform() {
        return this._isKnotMultiplicityUniform;
    }

    constructorInputMultOrderAssessment(minValue: number): void {
        const error = new ErrorLog(this.constructor.name, "constructor");
        if(this._maxMultiplicityOrder < minValue) {
            error.addMessage("Maximal value of knot multiplicity order is too small for this category of knot sequence. Cannot proceed.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    distinctAbscissae(): number[] {
        let abscissae: number[] = [];
        for(const knot of this.knotSequence) {
            abscissae.push(knot.abscissa);
        }
        return abscissae;
    }

    multiplicities(): number[] {
        let multiplicities: number[] = [];
        for(const knot of this.knotSequence) {
            multiplicities.push(knot.multiplicity);
        }
        return multiplicities;
    }

    maxMultiplicityOrderInputParamAssessment(multiplicity: number, methodName: string): void {
        const error = new ErrorLog(this.constructor.name, methodName);
        if(multiplicity > this._maxMultiplicityOrder) {
            error.addMessage("Knot multiplicity is greater than the maximum multiplicity order set for the knot sequence.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    constructorInputArrayAssessment(knotParameters: IncreasingOpenKnotSequence | IncreasingOpenKnotSequenceCCurve_allKnots | IncreasingOpenKnotSubSequence |
        IncreasingOpenKnotSequenceCCurve | IncreasingOpenKnotSubSequenceCCurve | StrictlyIncreasingOpenKnotSequence | StrictlyIncreasingOpenKnotSequenceCCurve |
        StrictlyIncreasingOpenKnotSequenceCCurvee_allKnots): void {
        const error = new ErrorLog(this.constructor.name, "constructor");
        let message = "";
        const messageKnots = "Knot sequence with null length encountered. Cannot proceed.";
        const messageMultiplicities = "Knot multiplicity array with null length encountered. Cannot proceed.";
        const messageKnotLengthVsMultitplicityLength = "Knot sequence with length not equal to the multiplicity array length. Cannot proceed.";
        if(knotParameters.type === INCREASINGOPENKNOTSEQUENCE || knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS
            || knotParameters.type === INCREASINGOPENKNOTSUBSEQUENCE || knotParameters.type === INCREASINGOPENKNOTSUBSEQUENCECLOSEDCURVE) {
            if(knotParameters.knots.length === 0) message = messageKnots;
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCE || knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS) {
            if(knotParameters.knots.length === 0) {
                message = messageKnots;
            } else if(knotParameters.multiplicities.length === 0) {
                message = messageMultiplicities;
            } else if(knotParameters.knots.length !== knotParameters.multiplicities.length) {
                message = messageKnotLengthVsMultitplicityLength;
            }
        } else if(knotParameters.type === INCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            if((knotParameters.periodicKnots.length) === 0) message = messageKnots;
        } else if(knotParameters.type === STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE) {
            if(knotParameters.periodicKnots.length === 0) {
                message = messageKnots;
            } else if(knotParameters.multiplicities.length === 0) {
                message = messageMultiplicities;
            } else if(knotParameters.periodicKnots.length !== knotParameters.multiplicities.length) {
                message = messageKnotLengthVsMultitplicityLength;
            }
        }
        if(message !== "") {
            error.addMessage(message);
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    constructorInputBspBasisSizeAssessment(knotParameters: Uniform_OpenKnotSequence | UniformlySpreadInterKnots_OpenKnotSequence |
                                                            Uniform_PeriodicKnotSequence): void {
        const error = new ErrorLog(this.constructor.name, "constructor");
        error.addMessage("Knot sequence cannot be generated. Not enough control points to generate a B-Spline basis. Cannot proceed.");
        if(knotParameters.type === UNIFORM_OPENKNOTSEQUENCE || knotParameters.type === UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE) {
            if(knotParameters.BsplBasisSize < this._maxMultiplicityOrder) {
                console.log(error.logMessage());
                throw new RangeError(error.logMessage());
            }
        } else if(knotParameters.type === UNIFORM_PERIODICKNOTSEQUENCE) {
            if(knotParameters.BsplBasisSize < (this._maxMultiplicityOrder + 2)) {
                console.log(error.logMessage());
                throw new RangeError(error.logMessage());
            }
        }
    }

    checkMaxMultiplicityOrderConsistency(): void {
        for (const knot of this.knotSequence) {
            this.maxMultiplicityOrderInputParamAssessment(knot.multiplicity, "checkMaxMultiplicityOrderConsistency");
        }
    }

    checkUniformityOfKnotSpacing(): void {
        this._isKnotSpacingUniform = true;
        if(this.knotSequence.length > 1) {
            const spacing = this.knotSequence[1].abscissa - this.knotSequence[0].abscissa;
            for(let i = 1; i < (this.knotSequence.length - 1); i++) {
                const spacingAdjKnots = this.knotSequence[i + 1].abscissa - this.knotSequence[i].abscissa;
                if(spacingAdjKnots > (spacing + KNOT_COINCIDENCE_TOLERANCE) || spacingAdjKnots < (spacing - KNOT_COINCIDENCE_TOLERANCE)) this._isKnotSpacingUniform = false;
            }
        }
        return;
    }

    checkUniformityOfKnotMultiplicity(): void {
        this._isKnotMultiplicityUniform = true;
        for(const knot of this.knotSequence) {
            if(knot !== undefined && knot.multiplicity !== 1) this._isKnotMultiplicityUniform = false;
        }
        return;
    }

    abstract checkNonUniformKnotMultiplicityOrder(): void;

    checkMaxKnotMultiplicityAtIntermediateKnots(): void {
        let maxMultiplicityOrderReached = false;
        for(let knot = 1; knot < (this.knotSequence.length - 1); knot++) {
            if(this.knotSequence[knot].multiplicity === this._maxMultiplicityOrder) maxMultiplicityOrderReached = true;
        }
        if(maxMultiplicityOrderReached) {
            const error = new ErrorLog(this.constructor.name, "checkMaxKnotMultiplicityAtIntermediateKnots", "Maximal knot multiplicity reached at an intermediate knot. Please, split the curve at these knots to describe elementary B-splines.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    isAbscissaCoincidingWithKnot(abscissa: number): boolean {
        let coincident = false;
        for(const knot of this.knotSequence) {
            if(Math.abs(abscissa - knot.abscissa) < KNOT_COINCIDENCE_TOLERANCE) coincident = true;
        }
        return coincident;
    }

    isKnotlMultiplicityZero(abscissa: number): boolean {
        let multiplicityZero = true;
        if(this.isAbscissaCoincidingWithKnot(abscissa)) multiplicityZero = false;
        return multiplicityZero;
    }

    knotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): number {
        this.strictlyIncKnotIndexInputParamAssessment(index, "knotMultiplicity");
        const result = this.knotSequence[index.knotIndex].multiplicity;
        return result;
    }

    revertKnots(): void {
        const sequence: Array<Knot> = [];
        for(const knot of this.knotSequence) {
            sequence.push(new Knot(0.0))
        }
        let i = 0;
        for(const knot of this.knotSequence) {
            sequence[this.knotSequence.length - i - 1].abscissa = this.knotSequence[this.knotSequence.length - 1].abscissa - (knot.abscissa - this.knotSequence[0].abscissa);
            sequence[this.knotSequence.length - i - 1].multiplicity = knot.multiplicity;
            i++;
        }
        this.knotSequence = sequence.slice();
        return
    }

    strictlyIncKnotIndexInputParamAssessment(index: KnotIndexStrictlyIncreasingSequence, methodName: string): void {
        const error = new ErrorLog(this.constructor.name, methodName);
        if(index.knotIndex < 0 || index.knotIndex > this.knotSequence.length - 1) {
            error.addMessage("Knot index value in strictly increasing knot sequence is out of range.");
            console.log(error.logMessage());
            throw new RangeError(error.logMessage());
        }
    }

    decrementKnotMultiplicity(index: KnotIndexStrictlyIncreasingSequence): void {
        this.strictlyIncKnotIndexInputParamAssessment(index, "decrementKnotMultiplicity");
        this.knotSequence[index.knotIndex].multiplicity--;
        if(this.knotSequence[index.knotIndex].multiplicity === 0) {
            const abscissae = this.distinctAbscissae();
            const multiplicities = this.multiplicities();
            abscissae.splice(index.knotIndex, 1);
            multiplicities.splice(index.knotIndex, 1);
            this.knotSequence = [];
            let i = 0;
            for(const abscissa of abscissae) {
                const knot = new Knot(abscissa, multiplicities[i]);
                this.knotSequence.push(knot);
            }
        }
        this.checkUniformityOfKnotSpacing();
    }

}