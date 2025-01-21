import { expect } from "chai";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { NO_KNOT_CLOSED_CURVE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, UNIFORM_OPENKNOTSEQUENCE } from "../../src/newBsplines/KnotSequenceConstructorInterface";
import { EM_ABSCISSA_OUT_OF_KNOT_SEQUENCE_RANGE, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_KNOT_INSERTION_OVER_UMAX, EM_KNOT_INSERTION_UNDER_SEQORIGIN, EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER, EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE, EM_MAXMULTIPLICITY_ORDER_ATKNOT, EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT, EM_NON_STRICTLY_INCREASING_VALUES, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT, EM_NOT_NORMALIZED_BASIS, EM_NULL_KNOT_SEQUENCE, EM_NULL_MULTIPLICITY_ARRAY, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ, EM_SIZENORMALIZED_BSPLINEBASIS } from "../../src/ErrorMessages/KnotSequences";
import { TOL_KNOT_COINCIDENCE } from "../../src/newBsplines/AbstractBSplineR1toR2";
import { fromStrictlyIncreasingToIncreasingKnotSequenceCC } from "../../src/newBsplines/KnotSequenceAndUtilities/fromStrictlyIncreasingToIncreasingKnotSequenceCC";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF } from "../namedConstants/GeneralPurpose";
import { KNOT_COINCIDENCE_TOLERANCE, NormalizedBasisAtSequenceExtremity, KNOT_SEQUENCE_ORIGIN } from "../../src/namedConstants/KnotSequences";
import { WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE } from "../../src/WarningMessages/KnotSequences";
import { KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/KnotIndexStrictlyIncreasingSequence";
import { EM_KNOT_INDEX_VALUE } from "../../src/ErrorMessages/Knots";

describe('StrictlyIncreasingOpenKnotSequenceClosedCurve', () => {

    describe('Constructor', () => {

        describe(NO_KNOT_CLOSED_CURVE, () => {

            it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 1;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('can be initialized with (3 * maxMultiplicityOrder - 2) knots with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 3;
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(seq.length()).to.eql(3 * maxMultiplicityOrder - 2)
                expect(seq.periodicKnots.distinctAbscissae()).to.eql([0, 1, 2])
                expect(seq.periodicKnots.multiplicities()).to.eql([1, 1, 1])
                const seq1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) seq1.push(knot.abscissa)
                }
                expect(seq1).to.eql([-2, -1, 0, 1, 2, 3, 4])
            });

            it('can be initialized with 5 knots ((3 * maxMultiplicityOrder - 1) knots) when maxMultiplicityOrder = 2 with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(seq.length()).to.eql(5)
                expect(seq.periodicKnots.distinctAbscissae()).to.eql([0, 1, 2])
                expect(seq.periodicKnots.multiplicities()).to.eql([1, 1, 1])
                const seq1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) seq1.push(knot.abscissa)
                }
                expect(seq1).to.eql([-1, 0, 1, 2, 3])
            });

            it('can get properties of the knot sequence initialized with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotSpacingUniform).to.eql(true)
            });

            it('can get the knot index of the origin of a knot sequence initialized with ' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(1)
            });

            it('can get the uMax of a knot sequence initialized with ' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.uMax).to.eql(2)
            });
        });   

        describe(UNIFORM_OPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 2
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than 3 when maxMultiplicity = 2 with ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 2
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 2
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                for(let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 4
                    for(let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        if(!(maxMultiplicityOrder === 2 && j < 3)) {
                            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: j})
                            const knots: number[] = []
                            for(let k = - (maxMultiplicityOrder - 1); k < (j + maxMultiplicityOrder - 1); k++) {
                                knots.push(k)
                            }
                            const seq1: number[] = [];
                            for(const knot of seq) {
                                if(knot !== undefined) seq1.push(knot.abscissa)
                            }
                            expect(seq1).to.eql(knots)
                        }
                    }
                }
            });

            it('can get the knot index of the curve origin produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the u interval upper bound produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - 1)
            });

            it('can get the properties of knot sequnence produced by the initializer' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
        });  

        describe(STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {

            it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 1;
                const periodicKnots = [1]
                const multiplicities = [1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null length array of knots with intializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 3
                const periodicKnots: number [] = []
                const multiplicities: number[] = [1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a null length array of multiplicities with intializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const maxMultiplicityOrder = 3
                const periodicKnots: number [] = [0, 1, 2]
                const multiplicities: number[] = []
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_NULL_MULTIPLICITY_ARRAY)
            });

            it('cannot be initialized with a knot sequence having a length differing from that of the multiplicities with ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [4, 1, 1, 2]
                const maxMultiplicityOrder = 4;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL)
            });

            it('cannot initialize a knot sequence with a number of knots forming a basis with less than maxMultiplicityOrder basis functions for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE + ' case maxMultiplicityOrder = 2', () => {
                const maxMultiplicityOrder = 2
                const periodicKnots: number [] = [0, 1]
                const multiplicities: number [] = [1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('cannot initialize a knot sequence with a number of knots forming a basis with less than maxMultiplicityOrder basis functions for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE + ' case maxMultiplicityOrder > 2', () => {
                // case with knots of uniform multiplicity
                const maxMultiplicityOrder = 3
                const periodicKnots: number [] = [0, 1, 2]
                const multiplicities: number [] = [1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
                // case with knot at origin with multiplicity: maxMultiplicityOrder - 1
                const maxMultiplicityOrder1 = 4
                const periodicKnots1: number [] = [0, 1]
                const multiplicities1: number [] = [3, 3]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
                // case with knot at origin with multiplicity: maxMultiplicityOrder - 2
                const periodicKnots2: number [] = [0, 1, 2]
                const multiplicities2: number [] = [2, 1, 2]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots2, multiplicities: multiplicities2})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
                // case with knot at origin with multiplicity: maxMultiplicityOrder - 3
                const periodicKnots3: number [] = [0, 1, 2, 3]
                const multiplicities3: number [] = [1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots3, multiplicities: multiplicities3})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
                const periodicKnots4: number [] = [0, 1, 2]
                const multiplicities4: number [] = [1, 2, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots4, multiplicities: multiplicities4})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can initialize a knot sequence with a number of knots forming a minimal basis for a non uniform B-spline with a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                // case with knots of max multiplicity: non uniform knot sequence
                const maxMultiplicityOrder1 = 4
                const periodicKnots1: number [] = [0, 1]
                const multiplicities1: number [] = [4, 4]
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder1)
                expect(seq.distinctAbscissae()).to.eql(periodicKnots1)
                expect(seq.multiplicities()).to.eql(multiplicities1)
            });

            it('cannot be initialized with a non strictly increasing knot sequence with type constructor' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const periodicKnots: number [] = [0, 1, 2, 1.5, 3, 4]
                const multiplicities = [1, 1, 1, 1, 1, 1]
                const maxMultiplicityOrder = 3;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                const periodicKnots1: number [] = [0, -0.5, 1, 2, 3, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots1, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                const periodicKnots2: number [] = [0, 1, 2, 3, 4, 3.5]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots2, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
            });

            it('cannot be initialized with a knot sequence containing a knot with more than maxMultiplicityOrder multiplicity with constructor ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number [] = [5, 1, 1, 2, 4];
                const maxMultiplicityOrder = 4;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT);
            });

            it('cannot be initialized with an intermediate knot having more than maxMultiplicityOrder multiplicity with constructor ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number [] = [4, 1, 2, 1, 4];
                const maxMultiplicityOrder = 4;
                for( let i = 1; i < periodicKnots.length - 1; i++) {
                    const multiplicities1 = multiplicities.slice()
                    multiplicities1[i] = maxMultiplicityOrder + 1
                    expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT);
                }
            });

            it('cannot be initialized with an origin differing from zero with a first positive abscissa with constructor ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const periodicKnots: number [] = [0.1, 0.5, 0.6, 0.7, 1 ]
                const multiplicities: number [] = [4, 1, 1, 2, 4];
                let maxMultiplicityOrder = 4;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE)
                const periodicKnots1: number [] = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
                maxMultiplicityOrder = 3;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})).to.throw(EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE)
            });

            it('cannot be initialized with an origin differing from zero with a first negative abscissa with constructor ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                const periodicKnots: number [] = [-0.1, 0.0, 0.1, 0.3, 0.4]
                const multiplicities: number [] = [1, 3, 1, 3, 1];
                const maxMultiplicityOrder = 4;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE)
                const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.4, 0.5]
                const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots1, multiplicities: multiplicities1})).to.throw(EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE)
            });

            describe('Initialization of knot sequences for non uniform B-splines', () => {

                it('can be initialized with an initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE + ' . Non uniform knot sequence of closed curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const periodicKnots = [0, 1]
                    const multiplicities: number [] = [4, 4];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot.abscissa)
                    }
                    expect(seq1).to.eql(periodicKnots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                });

                it('can get the properties of the knot sequence. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 4
                    const periodicKnots = [0, 1]
                    const multiplicities: number [] = [4, 4];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 4
                    const periodicKnots = [0, 1]
                    const multiplicities: number [] = [4, 4];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                    expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
                });

                it('can be initialized with a knot sequence conforming to a non-uniform B-spline', () => {
                    const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [4, 1, 1, 2, 4];
                    const maxMultiplicityOrder = 4;
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities});
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot.abscissa)
                    }
                    expect(seq1).to.eql(periodicKnots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                });

                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots.', () => {
                    const maxMultiplicityOrder = 4
                    const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [4, 1, 1, 2, 4];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [4, 1, 1, 2, 4];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                    expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
                });

                it('can be initialized with different orders of multiplicity at the curve origin', () => {
                    const periodicKnots: number [] = [0.0, 0.1, 0.6, 0.7, 0.9, 1]
                    const multiplicities: number [] = [3, 1, 1, 1, 1, 3];
                    const maxMultiplicityOrder = 4;
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(1))
                    expect(seq.knotMultiplicity(seq.indexKnotOrigin)).to.eql(multiplicities[0])
                    const periodicKnots1: number [] = [0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1]
                    const multiplicities1: number [] = [2, 1, 1, 1, 1, 1, 1, 2];
                    const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})
                    expect(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    expect(seq1.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(2))
                    expect(seq1.knotMultiplicity(seq1.indexKnotOrigin)).to.eql(multiplicities1[0])
                    const periodicKnots2: number [] = [0.0, 0.1, 0.2, 0.3, 0.6, 0.7, 0.8, 0.9, 1]
                    const multiplicities2: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1];
                    const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots2, multiplicities: multiplicities2})
                    expect(seq2.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    expect(seq2.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(3))
                    expect(seq2.knotMultiplicity(seq2.indexKnotOrigin)).to.eql(multiplicities2[0])
                });
            });

            describe('Initialization of knot sequences for uniform B-splines', () => {
                it('can be initialized with an initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE + '. uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 2
                    const periodicKnots = [0, 1, 2, 3, 5, 6, 7]
                    const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities:multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot.abscissa)
                    }
                    expect(seq1).to.eql([-1].concat(periodicKnots).concat([8]))
                    expect(seq.multiplicities()).to.eql([1].concat(multiplicities).concat([1]))
                });

                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                    const maxMultiplicityOrder = 2
                    const periodicKnots = [0, 1, 2, 3, 4, 5, 6]
                    const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
                    const maxMultiplicityOrder = 2
                    const periodicKnots = [0, 1, 2.5, 3, 4, 5, 6]
                    const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of closed curve', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 0.8, 1]
                    const multiplicities: number [] = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1))
                    expect(seq.uMax).to.eql(1)
                });
            });

            describe('Initialization of arbitrary knot sequences for B-splines', () => {
                it('can be initialized with ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE + ' initializer. arbitrary knot sequence', () => {
                    const maxMultiplicityOrder = 4
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = seq.distinctAbscissae()
                    const abscissae = [-0.3].concat(periodicKnots).concat([1.5, 1.6])
                    expect(seq.distinctAbscissae().length).to.eql(abscissae.length)
                    for(let i = 0; i < seq1.length; i++) {
                            expect(seq1[i]).to.be.closeTo(abscissae[i], TOL_KNOT_COINCIDENCE)
                    }
                    expect(seq.multiplicities()).to.eql([2].concat(multiplicities).concat([1, 1]))
                });

                it('can get the properties of the knot sequence. closed B-Spline with arbitrary distributed knots', () => {
                    const maxMultiplicityOrder = 4
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: arbitrary knot sequence of closed B-spline', () => {
                    const maxMultiplicityOrder = 4
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(1))
                    expect(seq.uMax).to.eql(1)
                });
            });
        });

        describe(STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {

            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                const multiplicities: number [] = [1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence with type constructor' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const knots: number [] = []
                const multiplicities: number [] = [1, 1]
                const maxMultiplicityOrder = 3;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a null length array of multiplicities with intializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = [0, 1, 2]
                const multiplicities: number[] = []
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NULL_MULTIPLICITY_ARRAY)
            });

            it('cannot be initialized with a knot sequence having a length differing from that of the multiplicities with ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number[] = [4, 1, 1, 2]
                const maxMultiplicityOrder = 4;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL)
            });

            it('cannot initialize a knot sequence with a number of knots forming a basis with less than 4 basis functions (case maxMultiplicityOrder = 2) to generate a closed curve for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' case maxMultiplicityOrder = 2', () => {
                const maxMultiplicityOrder = 2
                const knots: number [] = [-1, 0, 1, 2]
                const multiplicities: number [] = [1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('cannot initialize a knot sequence with a number of knots forming a basis with less than 4 basis functions (case maxMultiplicityOrder = 2)  to generate a closed curve for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' case maxMultiplicityOrder = 2', () => {
                const maxMultiplicityOrder = 2
                const knots: number [] = [0, 1]
                const multiplicities: number [] = [2, 2]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('cannot initialize a knot sequence with a number of knots forming a basis with less than maxMultiplicityOrder basis functions for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' case maxMultiplicityOrder > 2', () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = [-2, -1, 0, 1, 2, 3]
                const multiplicities: number [] = [1, 1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
                const maxMultiplicityOrder1 = 4
                const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5]
                const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('cannot be initialized with a knot sequence containing a knot at sequence extremity with more than maxMultiplicityOrder multiplicity with constryctor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number [] = [5, 1, 1, 2, 4]
                const maxMultiplicityOrder = 4
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a knot sequence containing a knot with more than maxMultiplicityOrder multiplicity with constryctor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                const knots: number [] = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5]
                const multiplicities: number [] = [1, 3, 1, 5, 2, 3, 1]
                const maxMultiplicityOrder = 4
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities from the sequence start don't define a normalized basis", () => {
                const maxMultiplicityOrder = 4
                const knots = [-1, 0, 0.5, 0.6, 0.7, 1]
                const multiplicities: number [] = [2, 3, 1, 1, 2, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
            });

            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities from the sequence end don't define a normalized basis", () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 0.5, 0.6, 0.7, 1, 2]
                const multiplicities: number [] = [4, 1, 1, 2, 3, 2]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND)
            });

            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot multiplicities at normalized basis extremities differ. Uniform B-Spline type", () => {
                const maxMultiplicityOrder = 4
                const knots = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
                const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            it('cannot be initialized with the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' when knot multiplicities at normalized basis extremities differ. Non-uniform B-Spline type', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 1, 2]
                const multiplicities: number [] = [4, 3, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at left from the origin don't match those at the left hand side of the right bound of the normalized basis interval", () => {
                const maxMultiplicityOrder = 4
                const knots = [-3, -2, -1, 0, 0.5, 0.6, 0.7, 0.8, 1, 2, 3, 4]
                const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
                const knots1 = [-3, -2, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 2, 3, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
                const knots2 = [-3, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 2, 3, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
            });

            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at right from the right bound of the normalized basis interval don't match those at the right hand side of the origin", () => {
                const maxMultiplicityOrder = 4
                const knots3 = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 2, 3, 4]
                const multiplicities: number [] = [2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots4 = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 3, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots4, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots5 = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots5, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots6 = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6, 1.7]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots6, multiplicities: multiplicities})).to.not.throw()
            });

            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at left from the origin don't match those at the left hand side of the right bound of the normalized basis interval. The knot at origin has a multiplicity greater than one.", () => {
                const maxMultiplicityOrder = 4
                const knots = [-3, -2, 0, 0.5, 0.6, 0.7, 0.8, 1, 3, 4]
                const multiplicities: number [] = [1, 1, 2, 1, 1, 2, 1, 2, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
                const knots1 = [-3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 3, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
            });

            it("cannot be initialized with an initializer " + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + "when knot intervals at right from the right bound of the normalized basis interval don't match those at the right hand side of the origin", () => {
                const maxMultiplicityOrder = 4
                const knots3 = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 3, 4]
                const multiplicities: number [] = [1, 1, 2, 1, 1, 2, 1, 2, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots4 = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 4]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots4, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
                const knots5 = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots5, multiplicities: multiplicities})).to.not.throw()
            });

            it('cannot be initialized with the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' when knot multiplicities at normalized basis extremities differ', () => {
                const maxMultiplicityOrder = 4
                const knots = [0, 1, 2]
                const multiplicities: number [] = [4, 3, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            it('cannot be initialized with the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + " when knot multiplicities at sequence extremities are not distributed periodically to define a normalized basis at the left hand side", () => {
                const maxMultiplicityOrder = 4
                const knots = [-0.4, -0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6]
                const multiplicities: number [] = [1, 1, 2, 1, 1, 2, 2, 1, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT)
            });

            it('cannot be initialized with the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + " when knot multiplicities at sequence extremities are not distributed periodically to define a normalized basis at the right hand side", () => {
                const maxMultiplicityOrder = 4
                const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5]
                const multiplicities: number [] = [2, 2, 1, 1, 2, 2, 2]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT)
            });

            it('cannot be initialized with the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + " when knot abscissae are not strictly increasing", () => {
                const maxMultiplicityOrder = 4
                const knots = [-0.3, 0, 0.5, 0.4, 0.7, 1, 1.5]
                const multiplicities: number [] = [1, 3, 1, 1, 2, 3, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
            
                const knots1 = [-0.3, 0, 0.5, 0.5, 0.7, 1, 1.5]
                const multiplicities1: number [] = [1, 3, 1, 1, 2, 3, 1]
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
            });

            describe('Initialization of knot sequences for non uniform closed B-splines', () => {
                it('can be initialized with an initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + '. Non uniform knot sequence of closed curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 1]
                    const multiplicities: number [] = [4, 4]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot.abscissa)
                    }
                    expect(seq1).to.eql(knots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                });

                it('can get the properties of the knot sequence with type constructor ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 1]
                    const multiplicities: number [] = [4, 4]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                });
    
                it('check that the non uniform property is deactivated for all knot sequences of this class', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 1]
                    const multiplicities: number [] = [4, 4]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 1]
                    const multiplicities: number [] = [4, 4]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                    expect(seq.uMax).to.eql(knots[knots.length -1])
                });

                it('can be initialized with ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' initializer. non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [4, 1, 1, 2, 4]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot.abscissa)
                    }
                    expect(seq1).to.eql(knots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                });

                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots with type constructor ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [4, 1, 1, 2, 4]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities: number [] = [4, 1, 1, 2, 4]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                    expect(seq.uMax).to.eql(1)
                });
            });

            describe('Initialization of knot sequences for uniform  closed B-splines', () => {
                it('can be initialized with an initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + '. uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2, 3, 5, 6, 7]
                    const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot.abscissa)
                    }
                    expect(seq1).to.eql(knots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2, 3, 4, 5, 6]
                    const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2.5, 3, 4, 5, 6]
                    const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of closed curve', () => {
                    const maxMultiplicityOrder = 3
                    const knots = [-0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6]
                    const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1))
                    expect(seq.uMax).to.eql(1)
                });
            });

            describe('Initialization of arbitrary knot sequences for B-splines', () => {
                it('can be initialized with a knot sequence constrained by closure constraints', () => {
                    const knots: number [] = [-0.1, 0.0, 0.1, 0.2, 0.3, 0.4]
                    const multiplicities: number [] = [1, 3, 1, 1, 3, 1];
                    const maxMultiplicityOrder = 4;
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq2: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq2.push(knot.abscissa)
                    }
                    expect(seq2).to.eql(knots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                    const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
                    const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 2, 1, 1];
                    const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
                    expect(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq3: number[] = [];
                    for(const knot of seq1) {
                        if(knot !== undefined) seq3.push(knot.abscissa)
                    }
                    expect(seq3).to.eql(knots1)
                    expect(seq1.multiplicities()).to.eql(multiplicities1)
                });

                it('can be initialized with ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' initializer. arbitrary knot sequence', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6 ]
                    const multiplicities: number [] = [2, 2, 1, 1, 2, 2, 1, 1];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot.abscissa)
                    }
                    expect(seq1).to.eql(knots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                });

                it('can get the properties of the knot sequence. closed B-Spline with arbitrary distributed knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6 ]
                    const multiplicities: number [] = [2, 2, 1, 1, 2, 2, 1, 1];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: arbitrary knot sequence of closed B-spline', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6 ]
                    const multiplicities: number [] = [2, 2, 1, 1, 2, 2, 1, 1];
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(1))
                    expect(seq.uMax).to.eql(1)
                });
            });   

        });

        describe(STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                const multiplicities: number [] = [1, 1];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence produced by the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = []
                const multiplicities: number [] = [2, 2];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0.5, 2, 3, 4, 5]
                const multiplicities: number [] = [1, 1, 1, 1, 1, 4];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots1: number [] = [0, 0.5, 2, 3, 4, 5]
                const multiplicities1: number [] = [4, 1, 1, 1, 1, 1];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots2: number [] = [0, 0.5, 2, 3, 4, 5]
                const multiplicities2: number [] = [1, 1, 4, 1, 1, 1];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots2, multiplicities: multiplicities2})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a knot sequence producing a non normalized basis', () => {
                const knots: number [] = [-1, 0, 1]
                const multiplicities: number [] = [1, 1, 1];
                const maxMultiplicityOrder = 4
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NOT_NORMALIZED_BASIS)
            });

            it('cannot be initialized with a knot sequence able to produce normalized basis intervals that are incompatible with each other', () => {
                const knots: number [] = [-2, -1, 0, 1, 2]
                const multiplicities: number [] = [1, 1, 1, 1, 1];
                const maxMultiplicityOrder = 4
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot be initialized with a knot sequence producing a normalized basis interval with null amplitude', () => {
                const knots: number [] = [-3, -2, -1, 0, 1, 2, 3]
                const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1];
                const maxMultiplicityOrder = 4
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });
        
            it('cannot be initialized with a non strictly increasing knot sequence produced by the initializer ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, -0.5, 2, 3, 4, 5]
                const multiplicities: number [] = [2, 1, 1, 1, 1, 3];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
                const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                const knots2: number [] = [0, 1, 2, 3, 4, 3.5]
                const multiplicities2: number [] = [2, 1, 1, 1, 2, 1];
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots2, multiplicities: multiplicities2})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
            });

            it('can be initialized with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [-1, 0, 0.5, 2, 3, 4, 4.5]
                let multiplicities: number [] = [1, 2, 1, 1, 1, 2, 1];
                const upperBound = knots.length;
                for(let i = 2; i < upperBound - 2; i++) {
                    const multiplicities1 = multiplicities.slice();
                    multiplicities[i] = maxMultiplicityOrder
                    const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
                    expect(seq.allAbscissae).to.eql(knots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                    multiplicities = multiplicities1.slice()
                }
            });
        });
    });

    describe('Accessors', () => {
        it('can get all the abscissa of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.allAbscissae).to.eql(knots)
            expect(seq.multiplicities()).to.eql(multiplicities)
        });

        it('can use the iterator to access the knots of the sequence', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 1, 2]
            const multiplicities: number [] = [4, 1, 4];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const seq1: number[] = [];
            const seq2: number[] = [];
            for(const knot of seq) {
                if(knot !== undefined) {
                    seq1.push(knot.abscissa)
                    seq2.push(knot.multiplicity)
                }
            }
            expect(seq1).to.eql(knots)
            expect(seq2).to.eql(multiplicities)
        });

        it('can get the periodic knots of the knot sequence with constructor' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const knots1: number[] = [];
            const multiplicities1: number[] = [];
            for(let i = seq.maxMultiplicityOrder - 1; i < (seq.length() - seq.maxMultiplicityOrder + 1); i++) {
                knots1.push(knots[i])
                multiplicities1.push(multiplicities[i])
            }
            expect(seq.periodicKnots.allAbscissae).to.eql(knots1)
            expect(seq.periodicKnots.multiplicities()).to.eql(multiplicities1)
        });

        it('can get the periodic knots of the knot sequence when the knot at the sequence origin has a multiplicity greater than one with constructor ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 3
            const knots = [-1, 0, 1, 2, 3, 4, 5, 6]
            const multiplicities: number [] = [1, 2, 1, 1, 1, 1, 2, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const knots1: number[] = [];
            const multiplicities1: number[] = [];
            const indexOrigin = seq.indexKnotOrigin;
            const multiplicityOrigin = seq.knotMultiplicity(indexOrigin)
            for(let i = seq.maxMultiplicityOrder - multiplicityOrigin; i < (seq.length() - seq.maxMultiplicityOrder + multiplicityOrigin); i++) {
                knots1.push(knots[i])
                multiplicities1.push(multiplicities[i])
            }
            expect(seq.periodicKnots.allAbscissae).to.eql(knots1)
            expect(seq.periodicKnots.multiplicities()).to.eql(multiplicities1)
        });

        it('can get the periodic knots of the knot sequence with constructor' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.periodicKnots.allAbscissae).to.eql(periodicKnots)
            expect(seq.periodicKnots.multiplicities()).to.eql(multiplicities)
        });

        it('can get the periodic knots of the knot sequence when the knot at the sequence origin has a multiplicity greater than one with constructor ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities: number [] = [2, 1, 1, 1, 1, 2];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.periodicKnots.allAbscissae).to.eql(periodicKnots)
            expect(seq.periodicKnots.multiplicities()).to.eql(multiplicities)
        });

        it('can get the knot index of the knot defining the origin of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1))
        });

        it('can get the knot index of the knot defining the origin of the knot sequence. Case of non-uniform knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [0, 1, 2, 3, 4, 5]
            const multiplicities: number [] = [3, 1, 1, 1, 1, 3];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
        });

        it('can get the status of the knot sequence about the description of C0 discontinuity', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true)
        });

        it('can get the maximum multiplicity order of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        });
    });

    describe('Methods', () => {

        it('can clone the knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 1, 1.5, 2]
            const multiplicities: number [] = [4, 2, 1, 4];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq1 = seq.clone()
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq1).to.eql(seq)
            const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            expect(seq2.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq3 = seq2.clone()
            expect(seq3.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq3).to.eql(seq2)
        });

        it('can clone the knot sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 1, 1.5, 2]
            const multiplicities: number [] = [4, 2, 1, 4];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const seq1 = seq.clone()
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true)
            expect(seq1).to.eql(seq)
            const knots1 = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            expect(seq2.isSequenceUpToC0Discontinuity).to.eql(true)
            const seq3 = seq2.clone()
            expect(seq3.isSequenceUpToC0Discontinuity).to.eql(true)
            expect(seq3).to.eql(seq2)
        });

        it('can get the knot sequence length', () => {
            const maxMultiplicityOrder = 4
            const knots = [-0.3, 0, 0.5, 0.6, 0.7, 1, 1.5, 1.6 ]
            const multiplicities: number [] = [2, 2, 1, 1, 2, 2, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.length()).to.eql(knots.length)
            const knots1 = [0, 1]
            const multiplicities1: number [] = [4, 4];
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            expect(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq1.length()).to.eql(knots1.length)
        });

        it('can get the distinct abscissae of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 1]
            const multiplicities: number [] = [4, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.distinctAbscissae()).to.eql(knots)
        });

        it('can get the distinct abscissae of a knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.distinctAbscissae()).to.eql(knots)
        });

        it('can get the distinct multiplicities of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 1]
            const multiplicities: number [] = [4, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.multiplicities()).to.eql([4, 4])
        });

        it('can get the distinct multiplicities of a knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.multiplicities()).to.eql([4, 1, 1, 2, 4])
        });




        it('cannot get the knot abscissa from a sequence index when the index is out of range', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(() => seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_INC_SEQ_TOO_LARGE)
        });

        it('can get the knot abscissa from a sequence index. Case of non uniform B-Spline', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissae = seq.allAbscissae;
            for(let i = 0; i < seq.length(); i++) {
                let index = new KnotIndexStrictlyIncreasingSequence(i);
                let abscissa = seq.abscissaAtIndex(index)
                expect(abscissa).to.eql(abscissae[i])
            }
        });

        it('can get the knot abscissa from a sequence index. Case of uniform B-Spline', () => {
            const maxMultiplicityOrder = 4
            const knots = [-0.4, -0.3, -0.2, 0, 0.5, 0.6, 0.7, 0.8, 1, 1.5, 1.6, 1.7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissae = seq.allAbscissae;
            for(let i = 0; i < seq.length(); i++) {
                let index = new KnotIndexStrictlyIncreasingSequence(i);
                let abscissa = seq.abscissaAtIndex(index)
                expect(abscissa).to.eql(abscissae[i])
            }
        });

        it('cannot convert a strictly increasing knot index into an increasing knot index if the strictly increasing index is out of range', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        
            const knots1: number [] = [0, 0.1, 0.2, 0.4, 0.5, 1]
            const multiplicities1: number [] = [4, 1, 2, 1, 3, 4];
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
            const seqInc = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq1)
            expect(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(seqInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('can transform an index of strictly increasing sequence into an index of the associated increasing sequence. Case of uniform knot sequence', () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const incSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            for(let i = 0; i < seq.length(); i++) {
                let indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(i));
                expect(indexIncSeq.knotIndex).to.eql(i);
                expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
            }
        });
    
        it('can transform an index of strictly increasing sequence into an index of the associated increasing sequence. Case of arbitrary knot multiplicities', () => {
            const knots: number [] = [-1, 0, 1, 2, 3, 4, 5, 6]
            const multiplicities: number [] = [1, 2, 1, 1, 1, 1, 2, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const incSeq = fromStrictlyIncreasingToIncreasingKnotSequenceCC(seq);
            for(let i = 0; i < seq.length(); i++) {
                let indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(i));
                let index = 0
                for(let j = 0; j < i; j++) {
                    index += multiplicities[j]
                }
                expect(indexIncSeq.knotIndex).to.eql(index);
                expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
            }
        });

        it('can get knot multiplicity at curve origin', () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            let maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.distinctAbscissae()).to.eql(knots)
            expect(seq.multiplicities()).to.eql(multiplicities)
            expect(seq.getKnotMultiplicityAtCurveOrigin()).to.eql(1)
            const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2 ]
            const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
            maxMultiplicityOrder = 4;
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            expect(seq1.distinctAbscissae()).to.eql(knots1)
            expect(seq1.multiplicities()).to.eql(multiplicities1)
            expect(seq1.getKnotMultiplicityAtCurveOrigin()).to.eql(2)
            const knots2: number [] = [-0.1, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1.1 ]
            const multiplicities2: number [] = [1, 3, 1, 1, 1, 1, 3, 1];
            const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2, multiplicities: multiplicities2})
            expect(seq2.distinctAbscissae()).to.eql(knots2)
            expect(seq2.multiplicities()).to.eql(multiplicities2)
            expect(seq2.getKnotMultiplicityAtCurveOrigin()).to.eql(3)
            const knots3: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities3: number [] = [4, 1, 1, 2, 4];
            const seq3 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3, multiplicities: multiplicities3})
            expect(seq3.distinctAbscissae()).to.eql(knots3)
            expect(seq3.multiplicities()).to.eql(multiplicities3)
            expect(seq3.getKnotMultiplicityAtCurveOrigin()).to.eql(4)
        });

        it('can get the knot multiplicity from a sequence index', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            for(let i = 0; i < multiplicities.length; i++) {
                const indexStrictlyIncSeq = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seq.knotMultiplicity(indexStrictlyIncSeq)).to.eql(multiplicities[i])
            }
        });

        it('can check if an abscissa coincides with a knot belonging to the effective interval of the curve', () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            for(let i = maxMultiplicityOrder - 1; i < knots.length - maxMultiplicityOrder; i++) {
                expect(seq.isAbscissaCoincidingWithKnot(knots[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(knots[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(knots[i])).to.eql(true)
            }
        });

        it('cannot check if an abscissa coincides with a knot belonging to the interval of the curve if this abscissa is outside the interval of the normalized basis', () => {
            const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
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
    
        it('can check if the knot multiplicity at a given abscissa is zero', () => {
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            for(let i = 0; i < knots.length; i++) {
                expect(seq.isKnotlMultiplicityZero(knots[i])).to.eql(false)
                expect(seq.isKnotlMultiplicityZero(knots[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
                expect(seq.isKnotlMultiplicityZero(knots[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
            }
        });

        it('can get the knot multiplicity from an index of the strictly increasing sequence', () => {
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            for(let i = 0; i < multiplicities.length; i++) {
                let index = new KnotIndexStrictlyIncreasingSequence(i)
                let multiplicity = seq.knotMultiplicity(index)
                expect(multiplicity).to.eql(multiplicities[i])
            }
        });

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one', () => {
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.insertKnot(0.5)).to.eql(false)
            expect(seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false)
            expect(seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false)
        });

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one and does not issue an error message if the multiplicity is greater than maxMultiplicityOrder', () => {
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.insertKnot(0.5, maxMultiplicityOrder)).to.eql(false)
            expect(seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false)
            expect(seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false)
        });

            
        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const newKnotAbscissa = 0.3;
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(() => seq.insertKnot(newKnotAbscissa, 5)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', () => {
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(() => seq.insertKnot(1.2, 1)).to.throw(EM_KNOT_INSERTION_OVER_UMAX)

            const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            expect(() => seq1.insertKnot(4.2, 1)).to.throw(EM_KNOT_INSERTION_OVER_UMAX)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', () => {
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(() => seq.insertKnot(-0.2, 1)).to.throw(EM_KNOT_INSERTION_UNDER_SEQORIGIN)

            const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            expect(() => seq1.insertKnot(-3.2, 1)).to.throw(EM_KNOT_INSERTION_UNDER_SEQORIGIN)
        });

        it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
            const knots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.insertKnot(0.3, 3)).to.eql(true)
            expect(seq.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1])
            expect(seq.multiplicities()).to.eql([4, 3, 1, 1, 2, 4])
        });

        it('check knot sequence properties after knot insertion', () => {
            const knots: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
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
    
        it('cannot raise the multiplicity of an intermediate knot more than (maxMultiplicityOrder - 1) whether knot sequence consistency check is active or not and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const mult = maxMultiplicityOrder - 1
            let sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq.findSpan(knots[i])
                expect(() => seq1.raiseKnotMultiplicity(index, mult, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
            }
            sequenceConsistencyCheck = false
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq.findSpan(knots[i])
                expect(() => seq1.raiseKnotMultiplicity(index, mult, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
            }
        });

        it('cannot raise the multiplicity of an intermediate knot to more than maxMultiplicityOrder with knot sequence consistency check and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const sequenceConsistencyCheck = true
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = maxMultiplicityOrder; i < (knots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq1.findSpan(knots[i])
                expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_ATKNOT)
            }
        });

        it('cannot raise the multiplicity of extreme knots with uniform knot sequence consistency check and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const sequenceConsistencyCheck = true
            expect(seq.multiplicities()).to.eql(multiplicities)
            for(let i = 0; i < maxMultiplicityOrder; i++) {
                let seq1 = seq.clone()
                let index = new KnotIndexStrictlyIncreasingSequence(i)
                expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
                seq1 = seq.clone()
                index = new KnotIndexStrictlyIncreasingSequence(seq1.length() - i - 1)
                expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            }
        });

        it('cannot raise the multiplicity of extreme knots with non uniform knot sequence consistency check and with constructor type' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities: number [] = [4, 1, 1, 1, 1, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const sequenceConsistencyCheck = true
            expect(seq.multiplicities()).to.eql(multiplicities)
            let seq1 = seq.clone()
            let index = new KnotIndexStrictlyIncreasingSequence(0)
            expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            seq1 = seq.clone()
            index = new KnotIndexStrictlyIncreasingSequence(seq1.length() - 1)
            expect(() => seq1.raiseKnotMultiplicity(index, maxMultiplicityOrder, sequenceConsistencyCheck)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                seq1.raiseKnotMultiplicity(index, 1, sequenceConsistencyCheck)
                expect(seq1.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities: number [] = [4, 1, 1, 1, 1, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const sequenceConsistencyCheck = true
            for(let i = 1; i < (seq.length() - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                seq1.raiseKnotMultiplicity(index, 1, sequenceConsistencyCheck)
                expect(seq1.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('can raise the multiplicity of an existing knot with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const index = seq.findSpan(0.2)
            const sequenceConsistencyCheck = true
            seq.raiseKnotMultiplicity(index, 1)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(() => seq.raiseKnotMultiplicity(index, 2, sequenceConsistencyCheck)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
        });

        it('can revert the knot sequence for a uniform B-spline', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            // const seqRef = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            
            const knots1: number [] = [-0.3, -0.15, -0.1, 0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.55, 0.7, 0.85]
            const multiplicities1: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities})
            // const seqRef1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            let i = 0;
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE);
            }
            expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities())
        });

        it('can revert the knot sequence for a non uniform B-spline', () => {
            const knots: number [] = [0, 0.3, 0.4, 0.5, 0.8]
            const multiplicities: number [] = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            // const seqRef = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            const knots1: number [] = [0, 0.2, 0.5, 0.8]
            const multiplicities1: number [] = [3, 2, 1, 3];
            const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            // const seqRef1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities())
        });

        it('can get the order of multiplicity of a knot from its abscissa', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const distinctKnots = seq.distinctAbscissae();
            const knotMultiplities = seq.multiplicities();
            for(let i = 0; i < distinctKnots.length; i++) {
                expect(seq.knotMultiplicityAtAbscissa(distinctKnots[i])).to.eql(knotMultiplities[i])
            }
        });

        it('get an order of multiplicity 0 and a warning message when the abscissa does not coincide with a knot', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0)
            // const multiplicity = seq.knotMultiplicityAtAbscissa(0.1)
            // expect(() => seq.knotMultiplicityAtAbscissa(0.1)).to.eql(WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
            // test without knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seq.length()), false)).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
            // test without knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seq.length()), false)).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is not an intermadiate knot (Case of non uniform B-Spline.) with constructor type: ' + STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS + ' and active sequence consistency check', () => {
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities: number [] = [4, 1, 2, 1, 1, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const basisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd();
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0))).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            expect(() => seq.decrementKnotMultiplicity(basisAtEnd.knot)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
        });
    
        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            for(let i = 0; i < seq.distinctAbscissae().length; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                expect(seq1.length()).to.eql(seq.length() - 1)
            }
        });

        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2];
            const maxMultiplicityOrder = 4
            const sequenceConsistencyCheck = true
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            for(let i = maxMultiplicityOrder; i < seq.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
            const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
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
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities: number [] = [4, 1, 2, 1, 1, 4];
            const maxMultiplicityOrder = 4
            const sequenceConsistencyCheck = true
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            for(let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
            const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
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
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const abscissa = 0.3
            const index = seq.findSpan(abscissa)
            // const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            const sequenceConsistencyCheck = true
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2])
            expect(seq.isKnotSpacingUniform).to.eql(true)
            const seq1 = seq.decrementKnotMultiplicity(index, sequenceConsistencyCheck)
            expect(seq1.isKnotSpacingUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = true
            const abscissa = 0.2
            const index = seq.findSpan(abscissa)
            expect(seq.multiplicities()).to.eql(multiplicities)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            const seq1 = seq.decrementKnotMultiplicity(index, sequenceConsistencyCheck)
            expect(seq1.isKnotSpacingUniform).to.eql(true)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.8]
            const multiplicities: number [] = [4, 1, 2, 1, 1, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(seq.length() - 1)
            expect(seq.multiplicities()).to.eql(multiplicities)
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
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(indexOrigin)
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq1.indexKnotOrigin).to.eql(indexOrigin)
            expect(seq1.abscissaAtIndex(indexOrigin)).to.eql(KNOT_SEQUENCE_ORIGIN)
            const updatedKnots: number [] = [-0.4, -0.3, -0.2, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
            const updatedMultiplicities: number [] = [1, 1, 1, 1, 2, 1, 1, 1, 1, 2]
            for(let i = 0; i < seq1.allAbscissae.length; i++) {
                expect(seq1.allAbscissae[i]).to.be.closeTo(updatedKnots[i], TOL_KNOT_COINCIDENCE)
                expect(seq1.multiplicities()[i]).to.eql(updatedMultiplicities[i])
            }
            expect(seq1.uMax).to.eql(0.4)
        });

        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at uMax is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence uMax is updated as well as some abscissae', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexUMax = seq.getKnotIndicesBoundingNormalizedBasis().end.knot;
            const abscissa = seq.abscissaAtIndex(indexUMax)
            expect(abscissa).to.eql(seq.uMax)
            const seq1 = seq.decrementKnotMultiplicity(indexUMax, sequenceConsistencyCheck)
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq1.uMax).to.eql(0.4)
            const updatedKnots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.7]
            const updatedMultiplicities: number [] = [1, 1, 1, 1, 1, 2, 1, 1, 1, 2]
            for(let i = 0; i < seq1.allAbscissae.length; i++) {
                expect(seq1.allAbscissae[i]).to.be.closeTo(updatedKnots[i], TOL_KNOT_COINCIDENCE)
                expect(seq1.multiplicities()[i]).to.eql(updatedMultiplicities[i])
            }
            expect(seq1.uMax).to.eql(0.4)
        });

        it('cannot get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement and the sequence origin cannot be updated', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.2, 0.3, 0.4, 0.5, 0.7]
            const multiplicities: number [] = [1, 1, 1, 1, 3, 1, 1, 1, 3];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(indexOrigin)
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            expect(() => seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
        });

        it('cannot get consistent knot sequence normalized basis when a knot multiplicity is decremented and the knot at origin is removed when the knot sequence consistency is not checked during knot multiplicity decrement', () => {
            const knots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities: number [] = [4, 1, 2, 1, 1, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            let indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart.knot.knotIndex).to.eql(indexOrigin.knotIndex)
            const seq1 = seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            indexNormalizedBasisAtStart = seq1.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart.knot.knotIndex).to.not.eql(indexOrigin.knotIndex)
            expect(seq1.abscissaAtIndex(indexNormalizedBasisAtStart.knot)).to.not.eql(KNOT_SEQUENCE_ORIGIN)

            const knots1: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities1: number [] = [4, 2, 1, 1, 1, 4];
            const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
            const indexOrigin1 = seq1.indexKnotOrigin
            let indexNormalizedBasisAtStart1 = seq2.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.eql(indexOrigin1.knotIndex)
            const seq3 = seq2.decrementKnotMultiplicity(indexOrigin1, sequenceConsistencyCheck)
            indexNormalizedBasisAtStart1 = seq3.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceExtremity.OverDefined)
            expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.not.eql(indexOrigin1.knotIndex)
            expect(seq3.abscissaAtIndex(indexNormalizedBasisAtStart1.knot)).to.not.eql(KNOT_SEQUENCE_ORIGIN)
        });

        it('can update the origin and uMax of a knot sequence whose knot multiplicities have been increased/decreased without knot conformity checking', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(indexOrigin)
            expect(abscissa).to.eql(KNOT_SEQUENCE_ORIGIN)
            expect(seq.uMax).to.eql(0.5)
            const seq1 = seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck)
            seq1.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq1.abscissaAtIndex(seq.indexKnotOrigin)).to.eql(KNOT_SEQUENCE_ORIGIN)
            expect(seq1.uMax).to.eql(0.4)
        });

        it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
            const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number [] = [4, 1, 1, 2, 4];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            for(let i = 0; i < seq.distinctAbscissae().length; i++) {
                const abscissa = seq.distinctAbscissae()[i]
                let index = seq.findSpan(abscissa)
                if(i !== (seq.distinctAbscissae().length - 1)) {
                    expect(index.knotIndex).to.eql(i)
                } else {
                    expect(index.knotIndex).to.eql(i - 1)
                }
                if(i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2
                    index = seq.findSpan(abscissa1)
                    expect(index.knotIndex).to.eql(i)
                }
            }

        });

        it('can find the span index in the knot sequence from an abscissa for a periodic B-spline with an arbitrary knot sequence', () => {
            const knots: number [] = [- 0.2, - 0.1, 0, 0.1, 0.2, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2]
            const multiplicities: number [] = [1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            let lastAbscissa = seq.getKnotIndexNormalizedBasisAtSequenceEnd()
            const indexOrigin = seq.indexKnotOrigin
            const knotMultiplicityAtOrigin = seq.knotMultiplicity(indexOrigin)
            expect(seq.uMax).to.eql(seq.abscissaAtIndex(lastAbscissa.knot))
            let lastAbscissaIndex = seq.distinctAbscissae().length - 1
            const distinctAbscissae = seq.distinctAbscissae()
            while(distinctAbscissae[lastAbscissaIndex] !== seq.uMax) {
                lastAbscissaIndex--
            }
            for(let i = indexOrigin.knotIndex; i <= lastAbscissaIndex; i++) {
                const abscissa = seq.distinctAbscissae()[i]
                let index = seq.findSpan(abscissa)
                if(i !== lastAbscissaIndex) {
                    expect(index.knotIndex).to.eql(i)
                } else {
                    expect(index.knotIndex).to.eql(i - 1)
                }
                if(i < lastAbscissaIndex) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2
                    index = seq.findSpan(abscissa1)
                    expect(index.knotIndex).to.eql(i)
                }
            }
        });
    
    });

});