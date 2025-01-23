import { expect } from "chai";
import { IncreasingOpenKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve";
import { clampingFindSpan } from "../../src/newBsplines/Piegl_Tiller_NURBS_Book";
import { INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, NO_KNOT_CLOSED_CURVE, UNIFORM_OPENKNOTSEQUENCE } from "../../src/newBsplines/KnotSequenceConstructorInterface";
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC } from "../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC";
import { EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE, EM_KNOT_INSERTION_OVER_UMAX, EM_KNOT_INSERTION_UNDER_SEQORIGIN, EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER, EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE, EM_MAXMULTIPLICITY_ORDER_ATKNOT, EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT, EM_NON_INCREASING_KNOT_VALUES, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT, EM_NOT_NORMALIZED_BASIS, EM_NULL_KNOT_SEQUENCE, EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ, EM_SIZENORMALIZED_BSPLINEBASIS } from "../../src/ErrorMessages/KnotSequences";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF } from "../namedConstants/GeneralPurpose";
import { KNOT_COINCIDENCE_TOLERANCE, NormalizedBasisAtSequenceExtremity, KNOT_SEQUENCE_ORIGIN } from "../../src/namedConstants/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/KnotIndexStrictlyIncreasingSequence";
import { KnotIndexIncreasingSequence } from "../../src/newBsplines/KnotIndexIncreasingSequence";
import { EM_KNOT_INDEX_VALUE } from "../../src/ErrorMessages/Knots";

describe('IncreasingOpenKnotSequenceClosedCurve', () => {

    describe('Constructor', () => {
    
        describe(NO_KNOT_CLOSED_CURVE, () => {

            it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 1;
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('can be initialized with (3 * maxMultiplicityOrder - 2) knots with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 3;
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(seq.length()).to.eql(3 * maxMultiplicityOrder - 2)
                expect(seq.freeKnots).to.eql([1])
                expect(seq.periodicKnots).to.eql([0, 1, 2])
                const seq1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) seq1.push(knot)
                }
                expect(seq1).to.eql([-2, -1, 0, 1, 2, 3, 4])
            });

            it('can be initialized with 5 knots ((3 * maxMultiplicityOrder - 1) knots) when maxMultiplicityOrder = 2 with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(seq.length()).to.eql(5)
                expect(seq.freeKnots).to.eql([1])
                expect(seq.periodicKnots).to.eql([0, 1, 2])
                const seq1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) seq1.push(knot)
                }
                expect(seq1).to.eql([-1, 0, 1, 2, 3])
            });

            it('can get properties of the knot sequence initialized with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotSpacingUniform).to.eql(true)
            });

            it('can get the knot index of the origin of a knot sequence initialized with ' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(1)
            });

            it('can get the uMax of a knot sequence initialized with ' + NO_KNOT_CLOSED_CURVE + 'specific case with maxMultiplicityOrder = 2', () => {
                const maxMultiplicityOrder = 2;
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.uMax).to.eql(2)
            });

            it('can get the uMax of a knot sequence initialized with ' + NO_KNOT_CLOSED_CURVE + 'generic case with maxMultiplicityOrder > 2', () => {
                const maxMultiplicityOrder = 3;
                const upperBound = 4;
                for(let i = maxMultiplicityOrder; i < maxMultiplicityOrder + upperBound; i++) {
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(i, {type: NO_KNOT_CLOSED_CURVE})
                    expect(seq.uMax).to.eql(i - 1)
                }
            });
        });

        describe(UNIFORM_OPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 2
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than 3 when maxMultiplicity = 2 with ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 2
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 2
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                for(let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 4
                    for(let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        if(!(maxMultiplicityOrder === 2 && j < 3)) {
                            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: j})
                            const knots: number[] = []
                            for(let k = - (maxMultiplicityOrder - 1); k < (j + maxMultiplicityOrder - 1); k++) {
                                knots.push(k)
                            }
                            const seq1: number[] = [];
                            for(const knot of seq) {
                                if(knot !== undefined) seq1.push(knot)
                            }
                            expect(seq1).to.eql(knots)
                        }
                    }
                }
            });

            it('can get the knot index of the curve origin produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the u interval upper bound produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - 1)
            });

            it('can get the properties of knot sequnence produced by the initializer' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
        });  

        describe(INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {

            it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 1;
                const periodicKnots = [0, 1]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });
        
            it('cannot be initialized with a non increasing knot sequence with type constructor' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const knots: number [] = [0, 1, 2, 1.5, 3, 4]
                const maxMultiplicityOrder = 3;
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots1: number [] = [0, -0.5, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots1})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots2: number [] = [0, 1, 2, 3, 4, 3.5]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots2})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
            });
        
            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder with ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 1, 1, 1, 1, 2, 3]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });
        
            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder at the sequence origin with ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 0, 0, 0, 1, 2, 3, 3, 3, 3]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a null knot length array ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots: number[] = []
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot initialize a knot sequence if end knot multiplicities differ when multiplicity is equal or greater than maxMultiplicityOrder', () => {
                const periodicKnots = [0, 0, 1, 2, 3, 4];
                const maxMultiplicityOrder = 2;
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            it('cannot initialize a knot sequence if end knot multiplicities differ when multiplicity is lower than maxMultiplicityOrder', () => {
                const periodicKnots = [0, 0, 1, 2, 3, 4];
                const maxMultiplicityOrder = 3;
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });
        
            it('can be initialized with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const seq1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) seq1.push(knot)
                }
                expect(seq.allAbscissae).to.eql(seq1)
                expect(seq.periodicKnots).to.eql(periodicKnots)
            });

            it('can get the properties of the knot sequence initialized with ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                expect(seq.uMax).to.eql(2)
            });

            it('can get the knot index of the knot sequence origin initialized with ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the uMax of the knot sequence origin initialized with ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots})
                expect(seq.uMax).to.eql(seq.length() - maxMultiplicityOrder - 1)
            });
        });

        describe(INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {

            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence with type constructor' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const knots: number [] = []
                const maxMultiplicityOrder = 3;
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a number of knots smaller than maxMultiplicityOrder for a constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [-1, 0, 1]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NOT_NORMALIZED_BASIS)
            });

            it('cannot initialize a knot sequence with a number of knots such that there no interval of normalized basis left with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [-2, -1, 0, 1, 2]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot initialize a knot sequence with a number of knots such that the interval of normalized basis reduces to zero with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [-3, -2, -1, 0, 1, 2, 3]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot be initialized with a non increasing knot sequence with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const knots: number [] = [-2, -1, 0, 1, 2, 1.5, 3, 4]
                const maxMultiplicityOrder = 3;
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots2: number [] = [-2, -1, 0, 1, 2, 3, 4, 3.5]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
            });

            it('cannot be initialized with a knot sequence containing a knot at sequence extremity with more than maxMultiplicityOrder multiplicity with constryctor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const knots: number [] = [0, 0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                const maxMultiplicityOrder = 4
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });
    
            it('cannot be initialized with a knot sequence containing a knot with more than maxMultiplicityOrder multiplicity with constryctor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const knots: number [] = [-0.3, 0, 0, 0, 0.5, 0.6, 0.6, 0.6, 0.6, 0.6, 0.7, 0.7, 1, 1, 1, 1.5]
                const maxMultiplicityOrder = 4
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities from the sequence start don't define a normalized basis", () => {
                const maxMultiplicityOrder = 4
                const knots = [-1, -1, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
            });

            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities from the sequence end don't define a normalized basis", () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 2, 2 ]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND)
            });

            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities at normalized basis extremities differ. Uniform B-Spline type", () => {
                const maxMultiplicityOrder = 4
                const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 6, 7, 8]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            it('cannot be initialized with the initializer ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' when knot multiplicities at normalized basis extremities differ. Non-uniform B-Spline type', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 0, 0, 0, 1, 1, 1, 2]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at left from the origin don't match those at the left hand side of the right bound of the normalized basis interval", () => {
                const maxMultiplicityOrder = 4
                const knots = [-3, -2, -1, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
                const knots1 = [-3, -2, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
                const knots2 = [-3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
            });

            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at right from the right bound of the normalized basis interval don't match those at the right hand side of the origin", () => {
                const maxMultiplicityOrder = 4
                const knots3 = [-0.3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots4 = [-0.3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1.5, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots4})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots5 = [-0.3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1.5, 1.6, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots5})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots6 = [-0.3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1.5, 1.6, 1.7]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots6})).to.not.throw()
            });

            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at left from the origin don't match those at the left hand side of the right bound of the normalized basis interval. The knot at origin has a multiplicity greater than one.", () => {
                const maxMultiplicityOrder = 4
                const knots = [-3, -2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
                const knots1 = [-3, -0.2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
            });

            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at right from the right bound of the normalized basis interval don't match those at the right hand side of the origin", () => {
                const maxMultiplicityOrder = 4
                const knots3 = [-0.3, -0.2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots4 = [-0.3, -0.2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 1.5, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots4})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots5 = [-0.3, -0.2, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.8, 1, 1, 1.5, 1.6]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots5})).to.not.throw()
            });

            it('cannot be initialized with the initializer ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' when knot multiplicities at normalized basis extremities differ', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 0, 0, 0, 1, 1, 1, 2]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            describe('Initialization of knot sequences for non uniform closed B-splines', () => {

                it('can be initialized with an initializer ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + '. Non uniform knot sequence of closed curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                });

                it('can check the initializer ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + 'for consistency of the knot sequence and knot multiplicities', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    const seq1 = seq.allAbscissae;
                    expect(() => seq.checkSizeConsistency(seq1.slice(1, seq1.length - 1))).to.throw(EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ)
                });
    
                it('can get the properties of the knot sequence with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                });
    
                it('check that the non uniform property is deactivated for all knot sequences of this class', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                    expect(seq.uMax).to.eql(knots[knots.length -1])
                });
    
                it('can be initialized with ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' initializer. non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                });
    
                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots with type constructor ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                    expect(seq.uMax).to.eql(1)
                });
            });


            describe('Initialization of knot sequences for uniform  closed B-splines', () => {

                it('can be initialized with an initializer ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + '. uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2, 3, 5, 6, 7]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2, 3, 4, 5, 6]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2.5, 3, 4, 5, 6]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of closed curve', () => {
                    const maxMultiplicityOrder = 3
                    const knots = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1))
                    expect(seq.uMax).to.eql(1)
                });
            });

            describe('Initialization of arbitrary knot sequences for B-splines', () => {
                it('can be initialized with ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' initializer. arbitrary knot sequence', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                });

                it('can get the properties of the knot sequence. closed B-Spline with arbitrary distributed knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: arbitrary knot sequence of closed B-spline', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6 ]
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(1))
                    expect(seq.uMax).to.eql(1)
                });
            });

        });

        describe(INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {

            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence produced by the initializer ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = []
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0.5, 2, 3, 4, 5, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots1: number [] = [0, 0, 0, 0, 0.5, 2, 3, 4, 5]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots2: number [] = [0, 0.5, 2, 2, 2, 2, 3, 4, 5]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots2})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a knot sequence producing a non normalized basis', () => {
                const knots: number [] = [-1, 0, 1]
                const maxMultiplicityOrder = 4
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NOT_NORMALIZED_BASIS)
            });

            it('cannot be initialized with a knot sequence able to produce normalized basis intervals that are incompatible with each other', () => {
                const knots: number [] = [-2, -1, 0, 1, 2]
                const maxMultiplicityOrder = 4
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot be initialized with a knot sequence producing a normalized basis interval with null amplitude', () => {
                const knots: number [] = [-3, -2, -1, 0, 1, 2, 3]
                const maxMultiplicityOrder = 4
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });
        
            it('cannot be initialized with a non increasing knot sequence produced by the initializer ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0, -0.5, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots2: number [] = [0, 0, 1, 2, 3, 4, 4, 3.5]
                expect(() => new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots2})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
            });

            it('can be initialized with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3;
                let knots: number [] = [-1, 0, 0, 0.5, 2, 3, 4, 4, 4.5]
                const upperBound = knots.length;
                for(let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const knots1 = knots.slice();
                    for( let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i])
                    }
                    const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
                    expect(seq.allAbscissae).to.eql(knots)
                    knots = knots1.slice()
                }
            });
        });


    });

    describe('Accessors', () => {
        it('can get all the abscissa of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.allAbscissae).to.eql(knots)
        });

        it('can use the iterator to access the knots of the sequence', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 2, 2, 2, 2]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const seq1: number[] = [];
            for(const knot of seq) {
                if(knot !== undefined) seq1.push(knot)
            }
            expect(seq1).to.eql(knots)
        });

        it('can get the periodic knots of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const knots1: number[] = [];
            for(let i = seq.maxMultiplicityOrder - 1; i < (seq.length() - seq.maxMultiplicityOrder + 1); i++) {
                knots1.push(knots[i])
            }
            expect(seq.periodicKnots).to.eql(knots1)
        });

        it('can get the periodic knots of the knot sequence when the knot at the sequence origin has a multiplicity greater than one', () => {
            const maxMultiplicityOrder = 3
            const knots = [-1, 0, 0, 1, 2, 3, 4, 5, 5, 6]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const knots1: number[] = [];
            const indexOrigin = seq.indexKnotOrigin;
            const multiplicityOrigin = seq.knotMultiplicity(indexOrigin)
            for(let i = seq.maxMultiplicityOrder - multiplicityOrigin; i < (seq.length() - seq.maxMultiplicityOrder + multiplicityOrigin); i++) {
                knots1.push(knots[i])
            }
            expect(seq.periodicKnots).to.eql(knots1)
        });

        it('can get the free knots (the knots that are effectively independent of each other when considering the control points associated with the knot sequence) of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const knots1: number[] = [];
            for(let i = seq.maxMultiplicityOrder; i < (seq.length() - seq.maxMultiplicityOrder); i++) {
                knots1.push(knots[i])
            }
            expect(seq.freeKnots).to.eql(knots1)
        });

        it('can get the knot index of the knot defining the origin of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1))
        });

        it('can get the knot index of the knot defining the origin of the knot sequence. Case of non-uniform knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [0, 0, 0, 1, 2, 3, 4, 5, 5, 5]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
        });

        it('can get the status of the knot sequence about the description of C0 discontinuity', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true)
        });

        it('can get the maximum multiplicity order of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        });
    });
    
    describe('Methods', () => {

        it('can clone the knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq1 = seq.clone()
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq1).to.eql(seq)
            const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq2 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            expect(seq2.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq3 = seq2.clone()
            expect(seq3.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq3).to.eql(seq2)
        });

        it('can clone the knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const seq1 = seq.clone()
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true)
            expect(seq1).to.eql(seq)
            const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq2 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1})
            expect(seq2.isSequenceUpToC0Discontinuity).to.eql(true)
            const seq3 = seq2.clone()
            expect(seq3.isSequenceUpToC0Discontinuity).to.eql(true)
            expect(seq3).to.eql(seq2)
        });

        it('can get the knot sequence length', () => {
            const curveDegree = 3
            const knots = [-0.3, -0.3, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1.5, 1.6 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(curveDegree + 1)
            expect(seq.length()).to.eql(knots.length)
            const knots1 = [0, 0, 0, 0, 1, 1, 1, 1 ]
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            expect(seq1.maxMultiplicityOrder).to.eql(curveDegree + 1)
            expect(seq1.length()).to.eql(knots1.length)
        });

        it('can get the distinct abscissae of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const knots1 = knots.slice(maxMultiplicityOrder - 1, knots.length - maxMultiplicityOrder + 1)
            expect(seq.distinctAbscissae()).to.eql(knots1)
        });

        it('can get the distinct abscissae of a knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        });

        it('can get the distinct multiplicities of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.multiplicities()).to.eql([4, 4])
        });

        it('can get the distinct multiplicities of a knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4])
        });
    
        it('cannot get the knot abscissa from a sequence index when the index is out of range', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_INC_SEQ_TOO_LARGE)
        });

        it('can get the knot abscissa from a sequence index. Case of non uniform B-Spline', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissae = seq.allAbscissae;
            for(let i = 0; i < seq.length(); i++) {
                let index = new KnotIndexIncreasingSequence(i);
                let abscissa = seq.abscissaAtIndex(index)
                expect(abscissa).to.eql(abscissae[i])
            }
        });

        it('can get the knot abscissa from a sequence index. Case of uniform B-Spline', () => {
            const maxMultiplicityOrder = 4
            const knots = [-0.4, -0.3, -0.3, 0, 0.5, 0.6, 0.7, 0.7, 1, 1.5, 1.6, 1.7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissae = seq.allAbscissae;
            for(let i = 0; i < seq.length(); i++) {
                let index = new KnotIndexIncreasingSequence(i);
                let abscissa = seq.abscissaAtIndex(index)
                expect(abscissa).to.eql(abscissae[i])
            }
        });
    
        it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing sequence.', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            let index = new KnotIndexIncreasingSequence(0);
            let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            expect(indexStrictlyIncSeq.knotIndex).to.eql(0)
            index = new KnotIndexIncreasingSequence(3);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(indexStrictlyIncSeq.knotIndex).to.eql(0)
            index = new KnotIndexIncreasingSequence(4);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(indexStrictlyIncSeq.knotIndex).to.eql(1)
            index = new KnotIndexIncreasingSequence(11);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(indexStrictlyIncSeq.knotIndex).to.eql(4)
        });
    
            
        it('cannot convert a strictly increasing knot index into an increasing knot index if the strictly increasing index is out of range', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        
            const knots1: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.4, 0.5, 0.5, 0.5, 1, 1, 1, 1]
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
            const seqStrcInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq1)
            expect(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(seqStrcInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('can convert a strictly increasing knot index into an increasing knot index for a uniform knot sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                const indexInc = seq.toKnotIndexIncreasingSequence(index)
                expect(indexInc.knotIndex).to.eql(i)
            }
        });

        it('can convert a strictly increasing knot index into an increasing knot index for a non-uniform knot sequence', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.4, 0.5, 0.5, 0.5, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const seqStrcInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq)
            let offSet = 0
            for(let i = 0; i < seqStrcInc.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                const indexInc = seq.toKnotIndexIncreasingSequence(index)
                expect(indexInc.knotIndex).to.eql(i + offSet)
                offSet = offSet + seq.knotMultiplicity(index) - 1
            }
        });

        it('can get the knot multiplicity from a sequence index', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const multiplicities = seq.multiplicities()
            let cumulativeMult = 0;
            for(let i = 0; i < multiplicities.length; i++) {
                let j = 0;
                while(j < multiplicities[i]) {
                    const index = new KnotIndexIncreasingSequence(j + cumulativeMult);
                    const indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                    expect(seq.knotMultiplicity(indexStrictlyIncSeq)).to.eql(multiplicities[i])
                    j++;
                }
                cumulativeMult += multiplicities[i]
            }
        });

        it('cannot extract a subset of an increasing knot sequence when indices are out of range', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.uMax).to.eql(0.5)
            let Istart = 0
            let Iend = Istart
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.not.throw(EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE)
            Istart = 6
            Iend = 5
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw(EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE)
            Iend = seq.distinctAbscissae().length
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw(EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE)
            Istart = -1
            Iend = seq.distinctAbscissae().length - 1
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw(EM_KNOT_INDEX_VALUE)
        });
    
        it('can extract a subset of an increasing knot sequence of a uniform B-spline', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.uMax).to.eql(0.5)
            const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(1))
            expect(subseq).to.eql([-0.3, -0.2])
            const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(6))
            expect(subseq1).to.eql([0, 0.1, 0.2, 0.3])
            const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(5), new KnotIndexIncreasingSequence(8))
            expect(subseq2).to.eql([0.2, 0.3, 0.4, 0.5])
            const subseq3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(knots.length - 2), new KnotIndexIncreasingSequence(knots.length - 1))
            expect(subseq3).to.eql([0.7, 0.8])
            const subseq4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(knots.length - 1))
            expect(subseq4).to.eql(knots)
        });
    
        it('can extract a subset of an increasing knot sequence of a non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 1, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(1))
            expect(subseq).to.eql([0, 0])
            const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(4))
            expect(subseq1).to.eql([0, 0, 1])
            const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(5))
            expect(subseq2).to.eql([0, 1, 1])
            const subseq3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(knots.length - 2), new KnotIndexIncreasingSequence(knots.length -1))
            expect(subseq3).to.eql([1, 1])
            const subseq4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(knots.length -1))
            expect(subseq4).to.eql(knots)
        });
    
        it('can get knot multiplicity at knot sequence origin', () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            let maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
            expect(seq.getKnotMultiplicityAtSequenceOrigin()).to.eql(1)
            const knots1: number [] = [-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
            maxMultiplicityOrder = 4
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            expect(seq1.distinctAbscissae()).to.eql([-0.2, -0.1, 0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2])
            expect(seq1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
            expect(seq1.getKnotMultiplicityAtSequenceOrigin()).to.eql(2)
            const knots2: number [] = [-0.1, 0.0, 0.0, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1, 1, 1.1 ]
            const seq2 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2})
            expect(seq2.distinctAbscissae()).to.eql([-0.1, 0, 0.1, 0.6, 0.7, 0.9, 1, 1.1])
            expect(seq2.multiplicities()).to.eql([1, 3, 1, 1, 1, 1, 3, 1])
            expect(seq2.getKnotMultiplicityAtSequenceOrigin()).to.eql(3)
            const knots3: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq3 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3})
            expect(seq3.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
            expect(seq3.multiplicities()).to.eql([4, 1, 1, 2, 4])
            expect(seq3.getKnotMultiplicityAtSequenceOrigin()).to.eql(4)
        });
    
        it('can check if an abscissa coincides with a knot belonging to the interval of the normalized basis', () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const abscissae = seq.distinctAbscissae();
            for(let i = maxMultiplicityOrder - 1; i < abscissae.length - maxMultiplicityOrder; i++) {
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true)
            }
        });

        it('cannot check if an abscissa coincides with a knot belonging to the interval of the curve if this abscissa is outside the interval of the normalized basis', () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const abscissae = seq.distinctAbscissae();
            for(let i = 0; i < maxMultiplicityOrder - 1; i++) {
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(() => seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.throw(EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[abscissae.length - 1 - i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[abscissae.length - 1 - i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(() => seq.isAbscissaCoincidingWithKnot(abscissae[abscissae.length - 1 - i])).to.throw(EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE)
            }
        });

        it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing sequence.', () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            let index = new KnotIndexIncreasingSequence(0);
            let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            expect(indexStrictlyIncSeq.knotIndex).to.eql(0)
            index = new KnotIndexIncreasingSequence(3);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(indexStrictlyIncSeq.knotIndex).to.eql(0)
            index = new KnotIndexIncreasingSequence(4);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(indexStrictlyIncSeq.knotIndex).to.eql(1)
            index = new KnotIndexIncreasingSequence(11);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(indexStrictlyIncSeq.knotIndex).to.eql(4)
        });

        it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing uniform sequence.', () => {
            const maxMultiplicityOrder = 4;
            const knots = [-0.4, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6, 1.7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            for(let i = 0; i < seq.allAbscissae.length; i++) {
                let index = new KnotIndexIncreasingSequence(i);
                let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                expect(indexStrictlyIncSeq.knotIndex).to.eql(i)
            }
        });

        it('can check if the knot multiplicity at a given abscissa is zero', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const abscissae = seq.distinctAbscissae()
            for(let i = 0; i < abscissae.length; i++) {
                expect(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false)
                expect(seq.isKnotlMultiplicityZero(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
                expect(seq.isKnotlMultiplicityZero(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
            }
        });
    
        it('can get the knot multiplicity from an index of the strictly increasing sequence', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const multiplicities = seq.multiplicities();
            for(let i = 0; i < multiplicities.length; i++) {
                let index = new KnotIndexStrictlyIncreasingSequence(i)
                let multiplicity = seq.knotMultiplicity(index)
                expect(multiplicity).to.eql(multiplicities[i])
            }
            for(let i = 0; i < seq.allAbscissae.length; i++) {
                let index = new KnotIndexIncreasingSequence(i);
                let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                let multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
                expect(multiplicity).to.eql(multiplicities[indexStrictlyIncSeq.knotIndex])
            }
        });

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.insertKnot(0.5)).to.eql(false)
            expect(seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false)
            expect(seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false)
        });

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one and does not issue an error message if the multiplicity is greater than maxMultiplicityOrder', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.insertKnot(0.5, maxMultiplicityOrder)).to.eql(false)
            expect(seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false)
            expect(seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false)
        });
    
        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const newKnotAbscissa = 0.3;
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(() => seq.insertKnot(newKnotAbscissa, 5)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(() => seq.insertKnot(1.2, 1)).to.throw(EM_KNOT_INSERTION_OVER_UMAX)

            const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            expect(() => seq1.insertKnot(4.2, 1)).to.throw(EM_KNOT_INSERTION_OVER_UMAX)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(() => seq.insertKnot(-0.2, 1)).to.throw(EM_KNOT_INSERTION_UNDER_SEQORIGIN)

            const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            expect(() => seq1.insertKnot(-3.2, 1)).to.throw(EM_KNOT_INSERTION_UNDER_SEQORIGIN)
        });

        it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.insertKnot(0.3, 3)).to.eql(true)
            expect(seq.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1])
            expect(seq.multiplicities()).to.eql([4, 3, 1, 1, 2, 4])
        });

        it('check knot sequence properties after knot insertion', () => {
            const knots: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const seq1 = seq.clone()
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.uMax).to.eql(4)
            expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            
            expect(seq.insertKnot(1.2, 1)).to.eql(true)
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.uMax).to.eql(4)
            expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)

            expect(seq1.insertKnot(1.2, 2)).to.eql(true)
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq1.uMax).to.eql(4)
            expect(seq1.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
        });

        it('cannot get the knot abscissa from a sequence index when the index is out of range', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_INC_SEQ_TOO_LARGE)
        });

        it('can get the knot abscissa from a sequence index. Case of non uniform B-Spline', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissae = seq.allAbscissae;
            for(let i = 0; i < seq.length(); i++) {
                let index = new KnotIndexIncreasingSequence(i);
                let abscissa = seq.abscissaAtIndex(index)
                expect(abscissa).to.eql(abscissae[i])
            }
        });

        it('can get the knot abscissa from a sequence index. Case of uniform B-Spline', () => {
            const maxMultiplicityOrder = 4
            const knots = [-0.4, -0.3, -0.3, 0, 0.5, 0.6, 0.7, 0.7, 1, 1.5, 1.6, 1.7]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissae = seq.allAbscissae;
            for(let i = 0; i < seq.length(); i++) {
                let index = new KnotIndexIncreasingSequence(i);
                let abscissa = seq.abscissaAtIndex(index)
                expect(abscissa).to.eql(abscissae[i])
            }
        });

        it('can get the knot multiplicity from a sequence index', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const multiplicities = seq.multiplicities()
            let cumulativeMult = 0;
            for(let i = 0; i < multiplicities.length; i++) {
                let j = 0;
                while(j < multiplicities[i]) {
                    const index = new KnotIndexIncreasingSequence(j + cumulativeMult);
                    const indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
                    expect(seq.knotMultiplicity(indexStrictlyIncSeq)).to.eql(multiplicities[i])
                    j++;
                }
                cumulativeMult += multiplicities[i]
            }
        });

        it('cannot raise the multiplicity of an intermediate knot more than (maxMultiplicityOrder - 1) whether knot sequence consistency check is active or not and with constructor type' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const mult = maxMultiplicityOrder - 1
            let sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq.findSpan(knots[i])
                const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
                expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, mult, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
            }
            sequenceConsistencyCheck = false
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq.findSpan(knots[i])
                const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
                expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, mult, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
            }
        });

        it('cannot raise the multiplicity of an intermediate knot to more than maxMultiplicityOrder with knot sequence consistency check and with constructor type' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities = seq.multiplicities()
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq)
            const sequenceConsistencyCheck = true
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq1.findSpan(knots[i])
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_ATKNOT)
            }
        });

        it('cannot raise the multiplicity of extreme knots with uniform knot sequence consistency check and with constructor type' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities = seq.multiplicities()
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq)
            const sequenceConsistencyCheck = true
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = 0; i < maxMultiplicityOrder; i++) {
                let seq1 = seq.clone()
                let index = new KnotIndexIncreasingSequence(i)
                let indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
                seq1 = seq.clone()
                index = new KnotIndexIncreasingSequence(seq1.length() - i - 1)
                indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            }
        });

        it('cannot raise the multiplicity of extreme knots with non uniform knot sequence consistency check and with constructor type' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities = seq.multiplicities()
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq)
            const sequenceConsistencyCheck = true
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = 0; i < maxMultiplicityOrder; i++) {
                let seq1 = seq.clone()
                let index = new KnotIndexIncreasingSequence(i)
                let indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
                seq1 = seq.clone()
                index = new KnotIndexIncreasingSequence(seq1.length() - i - 1)
                indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            }
        });


        it('can raise the multiplicity of any knot of a uniform sequence to more than maxMultiplicityOrder without knot sequence consistency check and with constructor type' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities = seq.multiplicities()
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq)
            const sequenceConsistencyCheck = false
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = 0; i < knots.length; i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexIncreasingSequence(i)
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                const seq2 = seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)
                expect(seq2.multiplicities()[i]).to.eql(maxMultiplicityOrder + 1)
            }
        });
    
        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexIncreasingSequence(i)
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                const seq2 = seq1.raiseKnotMultiplicity(indexStrictInc, 1, sequenceConsistencyCheck)
                expect(seq2.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexIncreasingSequence(i)
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                const seq2 = seq1.raiseKnotMultiplicity(indexStrictInc, 1, sequenceConsistencyCheck)
                expect(seq2.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('can raise the multiplicity of an existing knot with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const index = seq.findSpan(0.3)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            const sequenceConsistencyCheck = true
            const seq1 = seq.raiseKnotMultiplicity(indexStrictInc, 1)
            expect(seq1.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, 2, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
        });

        it('can revert the knot sequence for a uniform B-spline', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            // const seqRef = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            
            const knots1: number [] = [-0.3, -0.15, -0.1, 0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.55, 0.7, 0.85]
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            // const seqRef1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            let i = 0;
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE);
            }
            expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities())
        });
    
        it('can revert the knot sequence for a non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0.3, 0.4, 0.5, 0.5, 0.8, 0.8, 0.8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            // const seqRef = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            const knots1: number [] = [0, 0, 0, 0.2, 0.2, 0.5, 0.8, 0.8, 0.8]
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            // const seqRef1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities())
        });

        it('can get the order of multiplicity of a knot from its abscissa', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const distinctKnots = seq.distinctAbscissae();
            const knotMultiplities = seq.multiplicities();
            for(let i = 0; i < distinctKnots.length; i++) {
                expect(seq.knotMultiplicityAtAbscissa(distinctKnots[i])).to.eql(knotMultiplities[i])
            }
        });

        it('get an order of multiplicity 0 and a warning message when the abscissa does not coincide with a knot', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0)
            // const multiplicity = seq.knotMultiplicityAtAbscissa(0.1)
            // expect(() => seq.knotMultiplicityAtAbscissa(0.1)).to.eql(WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE)
        });


        it('can decrement the degree of a knot sequence of degree 3 without knots of multiplicity greater than one', () => {
            const knots: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
            const newSeq = seq.decrementMaxMultiplicityOrder();
            const newKnots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            let i = 0
            for(const knot of newSeq) {
                expect(knot).to.eql(newKnots[i])
                i++
            }
        });
    
        it('can decrement the degree of a knot sequence of degree 2 with knots of multiplicity greater than two', () => {
            const knots: number [] = [-2, -1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
            const newSeq = seq.decrementMaxMultiplicityOrder();
            const newKnots: number [] = [-1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8]
            expect(newSeq.maxMultiplicityOrder).to.eql(2)
            let i = 0
            for(const knot of newSeq) {
                expect(knot).to.eql(newKnots[i])
                i++
            }
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
            // test without knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()), false)).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
            // test without knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()), false)).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is not an intermadiate knot (Case of non uniform B-Spline.) with constructor type: ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' and active sequence consistency check', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const basisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd();
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0))).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            expect(() => seq.decrementKnotMultiplicity(basisAtEnd.knot)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
        });
    

        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const sequenceConsistencyCheck = false
            for(let i = 0; i < seq.distinctAbscissae().length; i++) {
                const seq1 = seq.clone()
                const seq2 = seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                expect(seq2.length()).to.eql(seq.length() - 1)
            }
        });

        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7]
            const maxMultiplicityOrder = 4
            const sequenceConsistencyCheck = true
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            for(let i = maxMultiplicityOrder; i < seq.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
            const seq2 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            for(let i = maxMultiplicityOrder; i < seq2.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq3 = seq2.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq2.multiplicities()[i] === 1) {
                    expect(seq3.length()).to.eql(seq2.length() - 1)
                } else {
                    expect(seq3.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1)
                }
            }
        });

        it('can decrement the multiplicity of an existing knot and remove it when its multiplicity equals one', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const sequenceConsistencyCheck = true
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            for(let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
            const seq2 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            for(let i = 1; i < seq2.distinctAbscissae().length - 1; i++) {
                const seq3 = seq2.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq2.multiplicities()[i] === 1) {
                    expect(seq3.length()).to.eql(seq2.length() - 1)
                } else {
                    expect(seq3.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1)
                }
            }
        });

        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const abscissa = 0.3
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            const sequenceConsistencyCheck = true
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2])
            expect(seq.isKnotSpacingUniform).to.eql(true)
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck)
            expect(seq1.isKnotSpacingUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const sequenceConsistencyCheck = true
            const abscissa = 0.2
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2])
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck)
            expect(seq1.isKnotSpacingUniform).to.eql(true)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.8, 0.8, 0.8, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const sequenceConsistencyCheck = false
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceCC(seq)
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(seqStrInc.length() - 1)
            expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 4])
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const seq1 = seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck)
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq1.multiplicities()).to.eql([4, 1, 2, 1, 1, 3])
        });

        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence origin is updated as well as some abscissae', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq1.indexKnotOrigin).to.eql(indexOrigin)
            expect(seq1.abscissaAtIndex(seq1.toKnotIndexIncreasingSequence(indexOrigin))).to.eql(KNOT_SEQUENCE_ORIGIN)
            const updatedKnots: number [] = [-0.4, -0.3, -0.2, 0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.6]
            for(let i = 0; i < seq1.allAbscissae.length; i++) {
                expect(seq1.allAbscissae[i]).to.be.closeTo(updatedKnots[i], KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.uMax).to.eql(0.4)
        });

        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at uMax is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence uMax is updated as well as some abscissae', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const sequenceConsistencyCheck = false
            const indexUMax = seq.getKnotIndicesBoundingNormalizedBasis().end.knot;
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexUMax))
            expect(abscissa).to.eql(seq.uMax)
            const seq1 = seq.decrementKnotMultiplicity(indexUMax, sequenceConsistencyCheck)
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq1.uMax).to.eql(0.4)
            const updatedKnots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.6, 0.7, 0.7]
            for(let i = 0; i < seq1.allAbscissae.length; i++) {
                expect(seq1.allAbscissae[i]).to.be.closeTo(updatedKnots[i], KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.uMax).to.eql(0.4)
        });

        it('cannot get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement and the sequence origin cannot be updated', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.2, 0.2, 0.2, 0.3, 0.4, 0.5, 0.7, 0.7, 0.7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            expect(() => seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
        });

        it('cannot get consistent knot sequence normalized basis when a knot multiplicity is decremented and the knot at origin is removed when the knot sequence consistency is not checked during knot multiplicity decrement', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            let indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart.knot.knotIndex).to.eql(indexOrigin.knotIndex)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            indexNormalizedBasisAtStart = seq1.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart.knot.knotIndex).to.not.eql(indexOrigin.knotIndex)
            expect(seq1.abscissaAtIndex(seq1.toKnotIndexIncreasingSequence(indexNormalizedBasisAtStart.knot))).to.not.eql(KNOT_SEQUENCE_ORIGIN)

            const knots1: number [] = [0, 0, 0, 0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const seq2 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1})
            const indexOrigin1 = seq2.indexKnotOrigin
            let indexNormalizedBasisAtStart1 = seq2.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.eql(indexOrigin1.knotIndex)
            const seq3 = seq2.decrementKnotMultiplicity(indexOrigin1, sequenceConsistencyCheck)
            indexNormalizedBasisAtStart1 = seq3.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.OverDefined)
            expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.not.eql(indexOrigin1.knotIndex)
            expect(seq3.abscissaAtIndex(seq3.toKnotIndexIncreasingSequence(indexNormalizedBasisAtStart1.knot))).to.not.eql(KNOT_SEQUENCE_ORIGIN)
        });

        it('can update the origin and uMax of a knot sequence whose knot multiplicities have been increased/decreased without knot conformity checking', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            expect(seq.uMax).to.eql(0.5)
            const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck)
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq1.abscissaAtIndex(seq1.toKnotIndexIncreasingSequence(seq.indexKnotOrigin))).to.eql(KNOT_SEQUENCE_ORIGIN)
            expect(seq1.uMax).to.eql(0.4)
        });

        it('cannot decrement the maximal multiplicity order of the knot sequence when the maximal multiplicity order of a knot sequence is 2 with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots1: number [] = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7]
            const maxMultiplicityOrder1 = 2
            const seq1 = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1});
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(() => seq1.decrementMaxMultiplicityOrder()).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT);
        });

        it('can decrement the maximal multiplicity order of a knot sequence of maxMultiplicity = 2 with knots of multiplicity greater than one', () => {
            const knots: number [] = [-1, 0, 1, 1, 2, 3, 4, 5, 6, 7, 8]
            const maxMultiplicityOrder = 2
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
            const newSeq = seq.decrementMaxMultiplicityOrder();
            const newKnots: number [] = [0, 1, 2, 3, 4, 5, 6, 7]
            expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            let i = 0
            for(const knot of newSeq) {
                expect(knot).to.eql(newKnots[i])
                i++
            }
        });
    
        it('can decrement the maximal multiplicity order of a knot sequence of maxMultiplicity = 3 with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
            const newSeq = seq.decrementMaxMultiplicityOrder();
            const newKnots: number [] = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7]
            expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            let i = 0
            for(const knot of newSeq) {
                expect(knot).to.eql(newKnots[i])
                i++
            }
        });

        it('can decrement the maximal multiplicity order of a knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-3, -2, -1, 0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots});
            const newSeq = seq.decrementMaxMultiplicityOrder();
            const newKnots: number [] = [-2, -1, 0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9]
            expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            let i = 0
            for(const knot of newSeq) {
                expect(knot).to.eql(newKnots[i])
                i++
            }
        });

        it('can decrement the maximal multiplicity order of a knot sequence of maxMultiplicity = 2 with a knot of multiplicity greater than one at sequence origin', () => {
            const knots: number [] = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7]
            const maxMultiplicityOrder = 2
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
            const newSeq = seq.decrementMaxMultiplicityOrder();
            const newKnots: number [] = [0, 1, 2, 3, 4, 5, 6, 7]
            expect(newSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder - 1)
            let i = 0
            for(const knot of newSeq) {
                expect(knot).to.eql(newKnots[i])
                i++
            }
        });

        it('check that the knot sequence properties are preserved when decrementing the maximal multiplicity order of a knot sequence', () => {
            const knots: number [] = [0, 0, 1, 2, 3, 4, 5, 6, 7, 7]
            const maxMultiplicityOrder = 2
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots});
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const newSeq = seq.decrementMaxMultiplicityOrder();
            expect(newSeq.maxMultiplicityOrder).to.eql(1)
            expect(newSeq.isSequenceUpToC0Discontinuity).to.eql(true)
        });

        it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            let indexOffset = -1;
            let indexOffset1 = -1;
            for(let i = 0; i < seq.distinctAbscissae().length; i++) {
                const abscissa = seq.distinctAbscissae()[i]
                let index = seq.findSpan(abscissa)
                if(i !== (seq.distinctAbscissae().length - 1)) indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa)
                expect(index.knotIndex).to.eql(indexOffset)
                if(i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2
                    index = seq.findSpan(abscissa1)
                    indexOffset1 = indexOffset1 + seq.knotMultiplicityAtAbscissa(abscissa)
                    expect(index.knotIndex).to.eql(indexOffset1)
                }
            }

        });
    
        it('can find the span index in the knot sequence from an abscissa for a periodic B-spline with an arbitrary knot sequence', () => {
            const knots: number [] = [- 0.2, - 0.1, 0, 0, 0.1, 0.2, 0.5, 0.6, 0.7, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            let lastAbscissa = seq.abscissaAtIndex(new KnotIndexIncreasingSequence(seq.length() - maxMultiplicityOrder))
            const indexOrigin = seq.indexKnotOrigin
            const knotMultiplicityAtOrigin = seq.knotMultiplicity(indexOrigin)
            expect(seq.uMax).to.eql(lastAbscissa)
            let indexOffset = maxMultiplicityOrder - knotMultiplicityAtOrigin - 1;
            let indexOffset2 = indexOffset
            let lastAbscissaIndex = seq.distinctAbscissae().length - 1
            const distinctAbscissae = seq.distinctAbscissae()
            while(distinctAbscissae[lastAbscissaIndex] !== seq.uMax) {
                lastAbscissaIndex--
            }
            for(let i = indexOrigin.knotIndex; i <= lastAbscissaIndex; i++) {
                const abscissa = seq.distinctAbscissae()[i]
                let index = seq.findSpan(abscissa)
                if(i !== lastAbscissaIndex) indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa)
                expect(index.knotIndex).to.eql(indexOffset)
                if(i < lastAbscissaIndex) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2
                    index = seq.findSpan(abscissa1)
                    indexOffset2 = indexOffset2 + seq.knotMultiplicityAtAbscissa(abscissa)
                    expect(index.knotIndex).to.eql(indexOffset2)
                }
            }
        });
    
        it('comparison with the former clampingFindSpan function devoted to periodic uniform B-splines with a periodic uniform B-Spline', () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
            const curveDegree = 2
            const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            let index = seq.findSpan(0.0)
            // compare with the clampingFindSpan function initially set up and devoted to uniform B-splines
            let indexCompare = clampingFindSpan(0.0, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(1)
            indexCompare = clampingFindSpan(1, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(2)
            indexCompare = clampingFindSpan(2, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(3)
            indexCompare = clampingFindSpan(3, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(4)
            indexCompare = clampingFindSpan(4, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(5)
            indexCompare = clampingFindSpan(5, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(6)
            indexCompare = clampingFindSpan(6, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            // Currently, 04/2024, clampingFindSpan does not behave like findSpan function for the last knot
            // The method findSpan, at the opposite has the same behavior for the classes of knot sequences
            // -> this last comparison is removed while checking if necessary to distinguish these baheviors or not
            // index = seq.findSpan(7)
            // indexCompare = clampingFindSpan(7, knots, 2);
            // expect(index.knotIndex).to.eql(indexCompare)
        });
    
        it('comparison with the former clampingFindSpan function devoted to periodic uniform B-splines', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3
            const seq = new IncreasingOpenKnotSequenceClosedCurve(curveDegree + 1, {type: INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots})
            let index = seq.findSpan(0.0)
            // compare with the clampingFindSpan function initially set up and devoted to uniform B-splines
            let indexCompare = clampingFindSpan(0.0, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.1)
            indexCompare = clampingFindSpan(0.1, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.5)
            indexCompare = clampingFindSpan(0.5, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.55)
            indexCompare = clampingFindSpan(0.55, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.6)
            indexCompare = clampingFindSpan(0.6, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.65)
            indexCompare = clampingFindSpan(0.65, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.7)
            indexCompare = clampingFindSpan(0.7, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.9)
            indexCompare = clampingFindSpan(0.9, knots, curveDegree);
            expect(index.knotIndex).to.eql(indexCompare)
            // Similar remark to the test above
            // -> this last comparison is removed while checking if necessary to distinguish these baheviors or not
            // index = seq.findSpan(1.0)
            // indexCompare = clampingFindSpan(1.0, knots, curveDegree);
            // expect(index.knotIndex).to.eql(indexCompare)
        });
    
    });

});