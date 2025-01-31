import { expect } from "chai";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "../../src/newBsplines/StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { NO_KNOT_PERIODIC_CURVE, STRICTLYINCREASINGPERIODICKNOTSEQUENCE, UNIFORM_PERIODICKNOTSEQUENCE } from "../../src/newBsplines/KnotSequenceConstructorInterface";
import { EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER, EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE, EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS, EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_NON_STRICTLY_INCREASING_VALUES, EM_NULL_KNOT_SEQUENCE, EM_NULL_MULTIPLICITY_ARRAY, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SEQUENCE_ORIGIN_REMOVAL, EM_SIZENORMALIZED_BSPLINEBASIS, EM_U_OUTOF_KNOTSEQ_RANGE } from "../../src/ErrorMessages/KnotSequences";
import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN } from "../../src/namedConstants/KnotSequences";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF } from "../namedConstants/GeneralPurpose";
import { KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/KnotIndexStrictlyIncreasingSequence";
import { EM_KNOT_INDEX_VALUE } from "../../src/ErrorMessages/Knots";

describe('StrictlyIncreasingPeriodicKnotSequenceClosedCurve', () => {
    
    describe('Constructor', () => {

        describe(NO_KNOT_PERIODIC_CURVE, () => {
            it('cannot be initialized with a max multiplicity order smaller than 1 with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 0;
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('can be initialized with (maxMultiplicityOrder + 1) knots with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const knots = [0, 1, 2]
                expect(seq.allAbscissae).to.eql(knots)
                expect(seq.length()).to.eql(maxMultiplicityOrder + 1)
                const seq1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) {
                        seq1.push(knot.abscissa)
                        expect(knot.multiplicity).to.eql(1)
                    }
                }
                expect(seq1).to.eql(knots)
            });

            it('can be initialized with 3 knots when maxMultiplicityOrder = 1 with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 1;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const knots = [0, 1, 2]
                expect(seq.allAbscissae).to.eql(knots)
                expect(seq.length()).to.eql(maxMultiplicityOrder + 2)
            });

            it('can get properties of the knot sequence initialized with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotSpacingUniform).to.eql(true)
            });

            it('can check that the origin of a knot sequence coincides with OPEN_KNOT_SEQUENCE_ORIGIN when initialized with ' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(() => seq.checkCurveOrigin()).to.not.throw()
            });

            it('can get the uMax of a knot sequence initialized with ' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.uMax).to.eql(3)
            });

            it('can get the property of the knot sequence about non uniform multiplicity as true when maxMultiplicityOrder = 1 when initialized with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 1;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
        });


        describe(UNIFORM_PERIODICKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0
                const BsplBasisSize = 2
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than 2 when maxMultiplicity = 1 with ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 1
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 1
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                for(let i = 1; i < 4; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 4
                    for(let j = maxMultiplicityOrder + 1; j < (maxMultiplicityOrder + upperBound); j++) {
                        if(!(i === 1 && j < 3)) {
                            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: j})
                            const knots: number[] = []
                            for(let k = 0; k < j; k++) {
                                knots.push(k)
                            }
                            const seq1: number[] = [];
                            for(const knot of seq) {
                                if(knot !== undefined) {
                                    seq1.push(knot.abscissa)
                                    expect(knot.multiplicity).to.eql(1)
                                }
                            }
                            expect(seq1).to.eql(knots)
                        }
                    }
                }
            });

            it('can check that the origin of a knot sequence coincides with OPEN_KNOT_SEQUENCE_ORIGIN when initialized with ' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(() => seq.checkCurveOrigin()).to.not.throw()
            });

            it('can get the u interval upper bound produced by the initializer ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - 1)
            });

            it('can get the properties of knot sequnence produced by the initializer' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 3
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });

        });

        describe(STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {

            it('cannot be initialized with a max multiplicity order smaller than 1 with type constructor' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0;
                const periodicKnots = [1]
                const multiplicities = [1];
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a non increasing knot sequence with type constructor' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const periodicKnots: number [] = [0, 1, 2, 1.5, 3, 4]
                const multiplicities = [1, 1, 1, 1, 1, 1];
                const maxMultiplicityOrder = 2;
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                const periodicKnots1: number [] = [0, -0.5, 1, 2, 3, 4]
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
                const periodicKnots2: number [] = [0, 1, 2, 3, 4, 3.5]
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2, multiplicities: multiplicities})).to.throw(EM_NON_STRICTLY_INCREASING_VALUES)
            });

            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder with ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const periodicKnots = [0, 1, 1, 1, 2, 3];
                const multiplicities = [1, 3, 1, 1];
                const maxMultiplicityOrder = 2;
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw()
            });

            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder at the sequence origin with ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 1, 2, 3]
                const multiplicities = [4, 1, 1, 4];
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a null knot length array ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots: number[] = []
                const multiplicities = [1];
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a null multiplicity length array ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 1, 2, 3]
                const multiplicities: number[] = [];
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_NULL_MULTIPLICITY_ARRAY)
            });

            it('cannot be initialized when the size of the knot array differs from that of the multiplicity array ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 1, 2, 3]
                const multiplicities: number[] = [1, 1, 1];
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_KNOT_SIZE_MULTIPLICITY_SIZE_NOT_EQUAL)
            });

            it('cannot initialize a periodic knot sequence if its origin is not zero', () => {
                const periodicKnots = [1, 2, 3, 4];
                const multiplicities = [1, 1, 1, 1];
                const maxMultiplicityOrder = 2;
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE)
            });

            it('cannot initialize a periodic knot sequence if end knot multiplicities differ when multiplicity is greater than maxMultiplicityOrder', () => {
                const periodicKnots = [0, 1, 2, 3, 4];
                const multiplicities = [2, 1, 1, 1, 1];
                const maxMultiplicityOrder = 1;
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot initialize a periodic knot sequence if end knot multiplicities differ when multiplicity is equal or lower than maxMultiplicityOrder', () => {
                const periodicKnots = [0, 1, 2, 3, 4];
                const multiplicities = [2, 1, 1, 1, 1];
                const maxMultiplicityOrder = 2;
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            it('cannot initialize a periodic knot sequence if knot sequence length is smaller than (degree + 2) to generate a basis of splines', () => {
                const periodicKnots = [0, 1];
                const multiplicities = [1, 1];
                const maxMultiplicityOrder = 2;
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})).to.throw(EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS)

                const periodicKnots1 = [0, 1];
                const multiplicities1 = [1, 1];
                const maxMultiplicityOrder1 = 1;
                expect(() => new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})).to.throw(EM_KNOTSEQ_MULTIPLICITIES_INCOMPATIBLE_NORMALIZEDBASIS)
            });

            it('can be initialized with uniform or non uniform knot sequences as examples', () => {
                const periodicKnots = [0, 1, 2];
                const multiplicities = [1, 1, 1];
                const maxMultiplicityOrder = 2;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(seq.allAbscissae).to.eql(periodicKnots)

                const periodicKnots1 = [0, 1];
                const multiplicities1 = [2, 2];
                const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1});
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(seq.allAbscissae).to.eql(periodicKnots)
            });

            it('can be initialized with uniform knot sequence as minimal case linear closed polygon', () => {
                const periodicKnots = [0, 1, 2];
                const multiplicities = [1, 1, 1];
                const maxMultiplicityOrder = 1;
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                expect(seq.allAbscissae).to.eql(periodicKnots)
                expect(seq.multiplicities()).to.eql(multiplicities)
            });

            it('can get the properties of the knot sequence initialized with ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const multiplicities = [1, 1, 1];
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });

            it('can get the knot index of the knot sequence origin initialized with ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const multiplicities = [1, 1, 1];
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                expect(seq.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)
            });

            it('can get the uMax of the knot sequence origin initialized with ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const multiplicities = [1, 1, 1];
                const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                expect(seq.uMax).to.eql(seq.allAbscissae[seq.allAbscissae.length - 1])
            });

            describe('Initialization of knot sequences for non uniform closed B-splines', () => {
                it('can be initialized with an initializer ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE + '. Non uniform knot sequence of closed curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 1]
                    const multiplicities = [3, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    const multiplicities1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) {
                            seq1.push(knot.abscissa)
                            multiplicities1.push(knot.multiplicity)
                        }
                    }
                    expect(seq1).to.eql(periodicKnots)
                    expect(multiplicities1).to.eql(multiplicities)
                });

                it('can get the properties of the knot sequence with type constructor ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 1]
                    const multiplicities = [3, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                });

                it('check that the non uniform property is deactivated for all knot sequences of this class', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 1]
                    const multiplicities = [3, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 1]
                    const multiplicities = [3, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)
                    expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length -1])
                });

                it('can be initialized with ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE + ' initializer. non uniform knot sequence of closed curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities = [3, 1, 1, 2, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    const multiplicities1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) {
                            seq1.push(knot.abscissa)
                            multiplicities1.push(knot.multiplicity)
                        }
                    }
                    expect(seq1).to.eql(periodicKnots)
                    expect(multiplicities1).to.eql(multiplicities)
                });

                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots with type constructor ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities = [3, 1, 1, 2, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities = [3, 1, 1, 2, 3];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)
                    expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
                });
            });

            describe('Initialization of knot sequences for uniform closed B-splines', () => {

                it('can be initialized with an initializer ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE + '. uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 2
                    const periodicKnots = [0, 1, 2, 3, 5, 6]
                    const multiplicities = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    const multiplicities1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) {
                            seq1.push(knot.abscissa)
                            multiplicities1.push(knot.multiplicity)
                        }
                    }
                    expect(seq1).to.eql(periodicKnots)
                    expect(multiplicities1).to.eql(multiplicities)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots with constructor type ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 1
                    const periodicKnots = [0, 1, 2, 3, 4, 5]
                    const multiplicities = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots with constructor type ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 1
                    const periodicKnots = [0, 1, 2.5, 3, 4, 5]
                    const multiplicities = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of closed curve', () => {
                    const maxMultiplicityOrder = 2
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 0.8, 1]
                    const multiplicities = [1, 1, 1, 1, 1, 1];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.allAbscissae[0]).to.eql(0)
                    expect(seq.uMax).to.eql(1)
                });
            });

            describe('Initialization of arbitrary knot sequences for B-splines', () => {
                it('can be initialized with ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE + ' initializer. arbitrary knot sequence', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    const multiplicities1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) {
                            seq1.push(knot.abscissa)
                            multiplicities1.push(knot.multiplicity)
                        }
                    }
                    expect(seq1).to.eql(periodicKnots)
                    expect(multiplicities1).to.eql(multiplicities)
                });

                it('can get the properties of the knot sequence. closed B-Spline with arbitrary distributed knots', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: arbitrary knot sequence of closed B-spline', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
                    const multiplicities = [2, 1, 1, 2, 2];
                    const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
                    expect(seq.allAbscissae[0]).to.eql(0)
                    expect(seq.uMax).to.eql(1)
                });
            });
        });
    });

    describe('Accessors', () => {
        it('can get all the abscissa of the knot sequence', () => {
            const maxMultiplicityOrder = 2
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.allAbscissae).to.eql(periodicKnots)
        });

        it('can use the iterator to access the knots of the sequence', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 1, 2]
            const multiplicities = [3, 1, 3];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const seq1: number[] = [];
            const multiplicities1: number[] = [];
            for(const knot of seq) {
                if(knot !== undefined) {
                    seq1.push(knot.abscissa)
                    multiplicities1.push(knot.multiplicity)
                }
            }
            expect(seq1).to.eql(periodicKnots)
            expect(multiplicities1).to.eql(multiplicities)
        });

        it('can get the maximum multiplicity order of the knot sequence', () => {
            const maxMultiplicityOrder = 2
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        });

    });

    describe('Methods', () => {

        it('can clone the knot sequence with constructor type ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 1, 1.5, 2]
            const multiplicities = [3, 2, 1, 3];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const seq1 = seq.clone()
            expect(seq1).to.eql(seq)
            const periodicKnots1 = [0, 1, 2, 3, 4]
            const multiplicities1 = [1, 1, 1, 1, 1];
            const seq2 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})
            const seq3 = seq2.clone()
            expect(seq3).to.eql(seq2)
        });

        it('can get the length of a strictly increasing knot sequence', () => {
            const periodicKnots = [0, 1, 2, 3, 4];
            const multiplicities = [1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            const length = seq.length()
            expect(length).to.eql(periodicKnots.length)

            const periodicKnots1 = [0, 1, 2, 3, 4];
            const multiplicities1 = [1, 2, 1, 1, 1];
            const maxMultiplicityOrder1 = 2;
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1});
            const length1 = seq1.length()
            expect(length1).to.eql(periodicKnots1.length)

            const periodicKnots2 = [0, 1, 2, 3, 4];
            const multiplicities2 = [2, 1, 1, 1, 2];
            const maxMultiplicityOrder2 = 2;
            const seq2 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder2, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2, multiplicities: multiplicities2});
            const length2 = seq2.length()
            expect(length2).to.eql(periodicKnots2.length)
        });

        it('can get the distinct abscissae of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 1]
            const multiplicities = [3, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.distinctAbscissae()).to.eql(periodicKnots)
        });

        it('can get the distinct abscissae of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.distinctAbscissae()).to.eql(periodicKnots)
        });

        it('can get the distinct multiplicities of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 1]
            const multiplicities = [3, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.multiplicities()).to.eql(multiplicities)
        });

        it('can get the distinct multiplicities of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.multiplicities()).to.eql(multiplicities)
        });

        it('can get the period of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.getPeriod()).to.eql(seq.lastKnot())
        });

        it('can get the period of a knot sequence conforming to a uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.getPeriod()).to.eql(seq.lastKnot())
        });
    
        it('cannot get the knot abscissa from a sequence index when the index is out of range with negative values', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [3, 1, 1, 2, 3];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(() => seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
        });

        it('can obtain the knot abscissa given the knot index for a uniform knot sequence for all knots except the last one', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            for(let i = 0; i < periodicKnots.length - 1; i++) {
                expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(periodicKnots[i])
            }
        });

        it('can obtain the knot abscissa given the knot index for a uniform knot sequence for the last one', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(periodicKnots.length - 1))).to.eql(KNOT_SEQUENCE_ORIGIN)
        });

        it('can obtain the knot abscissa given the knot index for a uniform knot sequence whatever the index greater than the period', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 2;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            for(let i = periodicKnots.length - 1; i < 2 * (periodicKnots.length - 1); i++) {
                expect(seq.abscissaAtIndex(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(periodicKnots[i - (periodicKnots.length - 1)])
            }
        });

        it('can get the knot multiplicity from a knot sequence index', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [3, 1, 1, 2, 3];
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            let cumulativeMult = 0;
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seq.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
                cumulativeMult += multiplicities[i]
            }
        });

        it('cannot check if an abscissa coincides with a knot belonging to the interval of the curve if this abscissa is outside the interval of the normalized basis', () => {
            const periodicKnots: number [] = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            let abscissae = 5.5;
            expect(() => seq.isAbscissaCoincidingWithKnot(abscissae)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
            abscissae = -0.5;
            expect(() => seq.isAbscissaCoincidingWithKnot(abscissae)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
        });

        it('can check if an abscissa coincides with a knot belonging to the interval of the normalized basis', () => {
            const periodicKnots: number [] = [0, 1, 2, 3, 4, 5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const abscissae = seq.distinctAbscissae();
            for(let i = 0; i < abscissae.length; i++) {
                if(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE) < seq.uMax) {
                    expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                    expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true)
                }
                if(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE) > 0) {
                    expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                    expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true)
                }
            }
        });

        it('can check if the knot multiplicity at a given abscissa is zero', () => {
            const periodicKnots = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities = [3, 1, 1, 2, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const abscissae = seq.distinctAbscissae()
            for(let i = 0; i < abscissae.length; i++) {
                expect(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false)
                if(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE) < seq.uMax)
                    expect(seq.isKnotlMultiplicityZero(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
                if(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE) > 0)
                    expect(seq.isKnotlMultiplicityZero(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
            }
        });

        it('can revert the knot sequence for a uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 4
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            // const seqRef = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            
            const periodicKnots1: number [] = [0, 0.05, 0.2, 0.35, 0.4, 0.5]
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities})
            // const seqRef1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities})
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
            const periodicKnots: number [] = [0, 0.3, 0.4, 0.5, 0.8]
            const multiplicities = [2, 1, 1, 2, 2];
            const maxMultiplicityOrder = 2
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            // const seqRef = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            const periodicKnots1: number [] = [0, 0.2, 0.5, 0.8]
            const multiplicities1 = [2, 2, 1, 2];
            const seq1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})
            // const seqRef1 = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1, multiplicities: multiplicities1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i);
                expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities())
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('can decrement the multiplicity of a knot when the knot index is an extreme knot with constructor type: ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [3, 1, 2, 1, 1, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const seq1 = seq.clone()
            seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(0))
            const newMultiplicities = [2, 1, 2, 1, 1, 2]
            expect(seq.multiplicities()).to.eql(newMultiplicities)
            const lastIndex = new KnotIndexStrictlyIncreasingSequence(seq.length() - 1)
            seq1.decrementKnotMultiplicityMutSeq(lastIndex)
            expect(seq1.multiplicities()).to.eql(newMultiplicities)
        });

        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            for(let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.clone()
                seq1.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(i))
                expect(seq1.length()).to.eql(seq.length() - 1)
            }
        });

        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            for(let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.clone()
                seq1.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(i))
                if(seq.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
        });

        it('cannot decrement the multiplicity of an existing knot at sequence extremities and remove it when its multiplicity equals one', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(0))).to.throw(EM_SEQUENCE_ORIGIN_REMOVAL)
            expect(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(seq.distinctAbscissae().length - 1))).to.throw(EM_SEQUENCE_ORIGIN_REMOVAL)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const abscissa = 0.3
            const index = seq.findSpan(abscissa)
            expect(seq.multiplicities()).to.eql(multiplicities)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            seq.decrementKnotMultiplicityMutSeq(index)
            expect(seq.isKnotSpacingUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 2, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const abscissa = 0.2
            const index = seq.findSpan(abscissa)
            expect(seq.multiplicities()).to.eql(multiplicities)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            seq.decrementKnotMultiplicityMutSeq(index)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.8]
            const multiplicities = [3, 1, 2, 1, 1, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(seq.length() - 1)
            expect(seq.multiplicities()).to.eql(multiplicities)
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            seq.decrementKnotMultiplicityMutSeq(indexStrictInc)
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.multiplicities()).to.eql([2, 1, 2, 1, 1, 2])
        });

        it('cannot raise the multiplicity of an intermediate knot more than maxMultiplicityOrder with constructor type' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.length()).to.eql(periodicKnots.length)
            const mult = maxMultiplicityOrder - 1
            for(let i = maxMultiplicityOrder; i < (periodicKnots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq.findSpan(periodicKnots[i])
                expect(() => seq1.raiseKnotMultiplicity(index, mult)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
            }
        });

        it('can raise the order of multiplicity of a knot in the knot sequence of a periodic B-spline', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities = [1, 1, 1, 1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3;
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.multiplicities()).to.eql(multiplicities)
            let index = new KnotIndexStrictlyIncreasingSequence(1)
            seq.raiseKnotMultiplicity(index, 1)
            expect(seq.multiplicities()).to.eql([1, 2, 1, 1, 1, 1, 1, 1, 1])
            expect(seq.knotMultiplicity(index)).to.eql(2)
            index = new KnotIndexStrictlyIncreasingSequence(0)
            seq.raiseKnotMultiplicity(index, 1)
            expect(seq.multiplicities()).to.eql([2, 2, 1, 1, 1, 1, 1, 1, 2])
            expect(seq.knotMultiplicity(index)).to.eql(2)
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                seq1.raiseKnotMultiplicity(index, 1)
                expect(seq1.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [3, 1, 1, 1, 1, 3];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                seq1.raiseKnotMultiplicity(index, 1)
                expect(seq1.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('can raise the multiplicity of an existing knot with constructor type ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const index = seq.findSpan(0.2)
            seq.raiseKnotMultiplicity(index, 1)
            expect(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1])
            expect(() => seq.raiseKnotMultiplicity(index, 2)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });

        it('can raise the multiplicity of an extreme knot with constructor type ' + STRICTLYINCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const multiplicities = [1, 1, 1, 1, 1, 1];
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(0)
            seq.raiseKnotMultiplicity(indexStrictInc, 1)
            expect(seq.multiplicities()).to.eql([2, 1, 1, 1, 1, 2])
            expect(() => seq.raiseKnotMultiplicity(indexStrictInc, 2)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });


        it('cannot find the span index in the knot sequence if the abscissa is negative', () => {
            const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [3, 1, 1, 2, 3]
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(() => seq.findSpan(KNOT_SEQUENCE_ORIGIN - 0.1)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
        });

        it('can find the span index in the knot sequence if the abscissa is over the knot sequence period', () => {
            const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [3, 1, 1, 2, 3]
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            let lastAbscissa = seq.lastKnot()
            const index1 = seq.findSpan(0.1)
            const nbPeriod = 3
            for(let i = 1; i <= nbPeriod; i++) {
                const index = seq.findSpan(i * lastAbscissa + 0.1)
                expect(index.knotIndex).to.eql(index1.knotIndex)
            }
        });

        it('can find the span index in the knot sequence from an abscissa for a non uniform periodic B-spline with multiplicity greater than one at its origin', () => {
            const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const multiplicities: number[] = [3, 1, 1, 2, 3]
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities})
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
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
            const multiplicities: number[] = [2, 1, 1, 1, 1, 2, 1, 1, 2]
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const lastAbscissa = seq.lastKnot()
            expect(seq.uMax).to.eql(lastAbscissa)
            const lastAbscissaIndex = seq.distinctAbscissae().length - 1
            for(let i = 0; i <= lastAbscissaIndex; i++) {
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

        it('can find the span index in the knot sequence from an abscissa for a uniform periodic B-spline', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const multiplicities: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new StrictlyIncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: STRICTLYINCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots, multiplicities: multiplicities})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
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

    });
});