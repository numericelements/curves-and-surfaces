import { expect } from "chai";
import { StrictlyIncreasingOpenKnotSequenceClosedCurve } from "../../src/newBsplines/StrictlyIncreasingOpenKnotSequenceClosedCurve";
import { clampingFindSpan } from "../../src/newBsplines/Piegl_Tiller_NURBS_Book";
import { KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/Knot";
import { NO_KNOT_CLOSED_CURVE, STRICTLYINCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, UNIFORM_OPENKNOTSEQUENCE } from "../../src/newBsplines/KnotSequenceConstructorInterface";
import { EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER, EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_LEFT, EM_NO_PERIODICITY_KNOTINTERVALS_SEQUENCE_CLOSURE_RIGHT, EM_NON_STRICTLY_INCREASING_VALUES, EM_NOT_NORMALIZED_BASIS, EM_NULL_KNOT_SEQUENCE, EM_NULL_MULTIPLICITY_ARRAY, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ, EM_SIZENORMALIZED_BSPLINEBASIS } from "../../src/ErrorMessages/KnotSequences";
import { TOL_KNOT_COINCIDENCE } from "../../src/newBsplines/AbstractBSplineR1toR2";

describe('StrictlyIncreasingOpenKnotSequenceClosedCurve', () => {

    describe('Constructor', () => {

        describe(NO_KNOT_CLOSED_CURVE, () => {

            it('cannot be initialized with a max multiplicity order smaller than 2 with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 1;
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('can be initialized with type constructor' + NO_KNOT_CLOSED_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_CLOSED_CURVE})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
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

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 1
                expect(() => new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                for(let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 4
                    for(let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
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

        });
    });


    it('can get knot multiplicity at curve origin', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        let maxMultiplicityOrder = 3;
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.distinctAbscissae()).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        expect(seq.getKnotMultiplicityAtCurveOrigin()).to.eql(1)
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2 ]
        const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
        maxMultiplicityOrder = 4;
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
        expect(seq1.distinctAbscissae()).to.eql([-0.2, -0.1, 0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2])
        expect(seq1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
        expect(seq1.getKnotMultiplicityAtCurveOrigin()).to.eql(2)
        const knots2: number [] = [-0.1, 0.0, 0.1, 0.6, 0.7, 0.9, 1, 1.1 ]
        const multiplicities2: number [] = [1, 3, 1, 1, 1, 1, 3, 1];
        const seq2 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots2, multiplicities: multiplicities2})
        expect(seq2.distinctAbscissae()).to.eql([-0.1, 0, 0.1, 0.6, 0.7, 0.9, 1, 1.1])
        expect(seq2.multiplicities()).to.eql([1, 3, 1, 1, 1, 1, 3, 1])
        expect(seq2.getKnotMultiplicityAtCurveOrigin()).to.eql(3)
        const knots3: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities3: number [] = [4, 1, 1, 2, 4];
        const seq3 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots3, multiplicities: multiplicities3})
        expect(seq3.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        expect(seq3.multiplicities()).to.eql([4, 1, 1, 2, 4])
        expect(seq3.getKnotMultiplicityAtCurveOrigin()).to.eql(4)
    });

    it('can check if an abscissa coincides with a knot belonging to the effective interval of the curve', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const maxMultiplicityOrder = 3;
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        expect(seq.isAbscissaCoincidingWithKnot(0.0)).to.eql(true)
        expect(seq.isAbscissaCoincidingWithKnot(-1)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(5.0)).to.eql(true)
        expect(seq.isAbscissaCoincidingWithKnot(6.0)).to.eql(false)
        expect(seq.isAbscissaCoincidingWithKnot(0.5)).to.eql(false)
    });

    it('can convert the increasing knot sequence belonging to a strictly increasing knot sequence', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        let maxMultiplicityOrder = 3;
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        const seqIncreasing = seq.toIncreasingKnotSequence();
        expect(seqIncreasing.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        const sequence: number[] = []
        for(const knot of seqIncreasing) {
            if(knot !== undefined) sequence.push(knot)
        }
        expect(sequence).to.eql([-2, -1, 0, 1, 2, 3, 4, 5, 6, 7])
        const knots1: number [] = [-0.2, -0.1, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2 ]
        const multiplicities1: number [] = [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1];
        maxMultiplicityOrder = 4;
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1})
        const seqIncreasing1 = seq1.toIncreasingKnotSequence();
        expect(seqIncreasing1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1])
        const sequence1: number[] = []
        for(const knot of seqIncreasing1) {
            if(knot !== undefined) sequence1.push(knot)
        }
        expect(sequence1).to.eql([-0.2, -0.1, 0.0, 0.0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1, 1, 1.1, 1.2])
    });

    it('can insert a knot into knot sequence', () => {
        const knots: number [] = [-0.1, 0.0, 0.1, 0.5, 0.6, 0.9, 1, 1.1]
        const multiplicities: number[] = [1, 3, 1, 1, 1, 1, 3, 1]
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities});
        expect(seq.insertKnot(0.2, 2)).to.eql(true)
        expect(seq.distinctAbscissae()).to.eql([-0.1, 0.0, 0.1, 0.2, 0.5, 0.6, 0.9, 1, 1.1])
        expect(seq.multiplicities()).to.eql([1, 3, 1, 2, 1, 1, 1, 3, 1])
        const knots1: number [] = [0.0, 0.5, 0.6, 0.7, 1]
        const multiplicities1: number[] = [4, 1, 1, 2, 4]
        const seq1 = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots1, multiplicities: multiplicities1});
        expect(seq1.insertKnot(0.2, 2)).to.eql(true)
        expect(seq1.distinctAbscissae()).to.eql([0.0, 0.2, 0.5, 0.6, 0.7, 1])
        expect(seq1.multiplicities()).to.eql([4, 2, 1, 1, 2, 4])
    });

    it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
        const knots: number [] = [0, 0.5, 0.6, 0.7, 1]
        const multiplicities: number [] = [4, 1, 1, 2, 4];
        const maxMultiplicityOrder = 4;
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: knots, multiplicities: multiplicities})
        expect(seq.distinctAbscissae()).to.eql(knots)
        expect(seq.multiplicities()).to.eql(multiplicities)
        let index = seq.findSpan(0.0)
        expect(index.knotIndex).to.eql(0)
        index = seq.findSpan(0.1)
        expect(index.knotIndex).to.eql(0)
        index = seq.findSpan(0.5)
        expect(index.knotIndex).to.eql(1)
        index = seq.findSpan(0.55)
        expect(index.knotIndex).to.eql(1)
        index = seq.findSpan(0.6)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(0.65)
        expect(index.knotIndex).to.eql(2)
        index = seq.findSpan(0.7)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(0.9)
        expect(index.knotIndex).to.eql(3)
        index = seq.findSpan(1.0)
        expect(index.knotIndex).to.eql(3)
    });

    it('can transform an index of strictly increasing sequence into an index of the associated increasing sequence. Case of uniform knot sequence', () => {
        const knots: number [] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
        const multiplicities: number [] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
        const maxMultiplicityOrder = 3;
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        const incSeq = seq.toIncreasingKnotSequence();
        let indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(0));
        expect(indexIncSeq.knotIndex).to.eql(0);
        expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
        indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(1));
        expect(indexIncSeq.knotIndex).to.eql(1);
        expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(1))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
        indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(knots.length - 1));
        expect(indexIncSeq.knotIndex).to.eql(knots.length - 1);
        expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(knots.length - 1))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
    });

    it('can transform an index of strictly increasing sequence into an index of the associated increasing sequence. Case of arbitrary knot multiplicities', () => {
        const knots: number [] = [-1, 0, 1, 2, 3, 4, 5, 6]
        const multiplicities: number [] = [1, 2, 1, 1, 1, 1, 2, 1];
        const maxMultiplicityOrder = 3;
        const seq = new StrictlyIncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots, multiplicities: multiplicities})
        const incSeq = seq.toIncreasingKnotSequence();
        let indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(0));
        expect(indexIncSeq.knotIndex).to.eql(0);
        expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(0))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
        indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(1));
        expect(indexIncSeq.knotIndex).to.eql(1);
        expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(1))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
        indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(knots.length - 1));
        expect(indexIncSeq.knotIndex).to.eql(incSeq.length() - 1);
        expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(knots.length - 1))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
        indexIncSeq = seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(2));
        expect(indexIncSeq.knotIndex).to.eql(3);
        expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(2))).to.eql(incSeq.abscissaAtIndex(indexIncSeq));
    });

});