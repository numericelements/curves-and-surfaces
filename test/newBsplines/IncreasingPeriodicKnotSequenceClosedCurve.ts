import { expect } from "chai";
import { IncreasingPeriodicKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingPeriodicKnotSequenceClosedCurve";
import { KNOT_COINCIDENCE_TOLERANCE, KNOT_SEQUENCE_ORIGIN } from "../../src/namedConstants/KnotSequences";
import { INCREASINGPERIODICKNOTSEQUENCE, NO_KNOT_PERIODIC_CURVE, UNIFORM_PERIODICKNOTSEQUENCE } from "../../src/newBsplines/KnotSequenceConstructorInterface";
import { fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence } from "../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence";
import { EM_INDICES_SPAN_TWICE_PERIOD, EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE, EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_NON_INCREASING_KNOT_VALUES, EM_NULL_KNOT_SEQUENCE, EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE, EM_SEQUENCE_ORIGIN_REMOVAL, EM_SIZENORMALIZED_BSPLINEBASIS, EM_START_INDEX_GREATER_THAN_END_INDEX, EM_START_INDEX_OUTOF_RANGE, EM_U_OUTOF_KNOTSEQ_RANGE } from "../../src/ErrorMessages/KnotSequences";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF } from "../namedConstants/GeneralPurpose";
import { KnotIndexStrictlyIncreasingSequence } from "../../src/newBsplines/KnotIndexStrictlyIncreasingSequence";
import { KnotIndexIncreasingSequence } from "../../src/newBsplines/KnotIndexIncreasingSequence";
import { EM_KNOT_INDEX_VALUE } from "../../src/ErrorMessages/Knots";

describe('IncreasingPeriodicKnotSequenceClosedCurve', () => {
    
    describe('Constructor', () => {

        describe(NO_KNOT_PERIODIC_CURVE, () => {
            it('cannot be initialized with a max multiplicity order smaller than 1 with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 0;
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('can be initialized with (maxMultiplicityOrder + 1) knots with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const upperBound = 3;
                for(let i = maxMultiplicityOrder; i < maxMultiplicityOrder + upperBound; i++) {
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(i, {type: NO_KNOT_PERIODIC_CURVE})
                    expect(seq.maxMultiplicityOrder).to.eql(i)
                    const multiplicities: Array<number> = [];
                    const knots: Array<number> = [];
                    for(let j = 0; j < i + 1; j++) {
                        knots.push(j)
                        multiplicities.push(1)
                    }
                    expect(seq.allAbscissae).to.eql(knots)
                    expect(seq.multiplicities()).to.eql(multiplicities)
                    expect(seq.length()).to.eql(i + 1)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                }
            });

            it('can be initialized with 3 knots when maxMultiplicityOrder = 1 with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 1;
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const knots = [0, 1, 2]
                expect(seq.allAbscissae).to.eql(knots)
                expect(seq.length()).to.eql(maxMultiplicityOrder + 2)
            });

            it('can get properties of the knot sequence initialized with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotSpacingUniform).to.eql(true)
            });

            it('can check that the origin of a knot sequence coincides with OPEN_KNOT_SEQUENCE_ORIGIN when initialized with ' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(() => seq.checkCurveOrigin()).to.not.throw()
            });

            it('can get the uMax of a knot sequence initialized with ' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.uMax).to.eql(3)
            });

            it('can get the property of the knot sequence about non uniform multiplicity as true when maxMultiplicityOrder = 1 when initialized with type constructor' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 1;
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: NO_KNOT_PERIODIC_CURVE})
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
        });

        describe(UNIFORM_PERIODICKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0
                const BsplBasisSize = 2
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than 2 when maxMultiplicity = 1 with ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 1
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 1
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                for(let i = 1; i < 4; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 4
                    for(let j = maxMultiplicityOrder + 1; j < (maxMultiplicityOrder + upperBound); j++) {
                        if(!(i === 1 && j < 3)) {
                            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: j})
                            const knots: number[] = []
                            for(let k = 0; k < j; k++) {
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

            it('can check that the origin of a knot sequence coincides with OPEN_KNOT_SEQUENCE_ORIGIN when initialized with ' + NO_KNOT_PERIODIC_CURVE, () => {
                const maxMultiplicityOrder = 2;
                const BsplBasisSize = 3
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(() => seq.checkCurveOrigin()).to.not.throw()
            });

            it('can get the u interval upper bound produced by the initializer ' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 3
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - 1)
            });

            it('can get the properties of knot sequnence produced by the initializer' + UNIFORM_PERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 3
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: UNIFORM_PERIODICKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
        });

        describe(INCREASINGPERIODICKNOTSEQUENCE, () => {

            it('cannot be initialized with a max multiplicity order smaller than 1 with type constructor' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0;
                const periodicKnots = [1]
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });
        
            it('cannot be initialized with a non increasing knot sequence with type constructor' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const knots: number [] = [0, 1, 2, 1.5, 3, 4]
                const maxMultiplicityOrder = 2;
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots1: number [] = [0, -0.5, 1, 2, 3, 4]
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots1})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots2: number [] = [0, 1, 2, 3, 4, 3.5]
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots2})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
            });

            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder with ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 1, 1, 2, 3]
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a knot multiplicity order greater than maxMultiplicityOrder at the sequence origin with ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots = [0, 0, 0, 0, 1, 2, 3, 3, 3, 3]
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a null knot length array ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const periodicKnots: number[] = []
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot initialize a periodic knot sequence if its origin is not zero', () => {
                const periodicKnots = [1, 2, 3, 4];
                const maxMultiplicityOrder = 2;
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})).to.throw(EM_ORIGIN_NORMALIZEDKNOT_SEQUENCE)
            });
    
            it('cannot initialize a periodic knot sequence if end knot multiplicities differ when multiplicity is greater than maxMultiplicityOrder', () => {
                const knots = [0, 0, 1, 2, 3, 4];
                const maxMultiplicityOrder = 1;
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot initialize a periodic knot sequence if end knot multiplicities differ when multiplicity is equal or lower than maxMultiplicityOrder', () => {
                const knots = [0, 0, 1, 2, 3, 4];
                const maxMultiplicityOrder = 2;
                expect(() => new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots})).to.throw(EM_KNOT_MULTIPLICITIES_AT_NORMALIZED_BASIS_BOUNDS_DIFFER)
            });

            it('can be initialized with type constructor ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1;
                const periodicKnots = [0, 1, 2]
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                const seq1: number[] = [];
                for(const knot of seq) {
                    if(knot !== undefined) seq1.push(knot)
                }
                expect(seq.allAbscissae).to.eql(seq1)
            });

            it('can get the properties of the knot sequence initialized with ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });

            it('can get the knot index of the knot sequence origin initialized with ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                expect(seq.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)
            });

            it('can get the uMax of the knot sequence origin initialized with ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2;
                const periodicKnots = [0, 1, 2]
                const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                expect(seq.uMax).to.eql(seq.allAbscissae[seq.allAbscissae.length - 1])
            });

            describe('Initialization of knot sequences for non uniform closed B-splines', () => {
                it('can be initialized with an initializer ' + INCREASINGPERIODICKNOTSEQUENCE + '. Non uniform knot sequence of closed curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0, 1, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(periodicKnots)
                });

                it('can get the properties of the knot sequence with type constructor ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0, 1, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                });

                it('check that the non uniform property is deactivated for all knot sequences of this class', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0, 1, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0, 1, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)
                    expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length -1])
                });

                it('can be initialized with ' + INCREASINGPERIODICKNOTSEQUENCE + ' initializer. non uniform knot sequence of closed curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(periodicKnots)
                });
    
                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots with type constructor ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)
                    expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
                });
            });

            describe('Initialization of knot sequences for uniform closed B-splines', () => {

                it('can be initialized with an initializer ' + INCREASINGPERIODICKNOTSEQUENCE + '. uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 2
                    const periodicKnots = [0, 1, 2, 3, 5, 6]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(periodicKnots)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 1
                    const periodicKnots = [0, 1, 2, 3, 4, 5]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
                    const maxMultiplicityOrder = 1
                    const periodicKnots = [0, 1, 2.5, 3, 4, 5]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of closed curve', () => {
                    const maxMultiplicityOrder = 2
                    const periodicKnots = [0, 0.5, 0.6, 0.7, 0.8, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.allAbscissae[0]).to.eql(0)
                    expect(seq.uMax).to.eql(1)
                });
            });

            describe('Initialization of arbitrary knot sequences for B-splines', () => {
                it('can be initialized with ' + INCREASINGPERIODICKNOTSEQUENCE + ' initializer. arbitrary knot sequence', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(periodicKnots)
                });

                it('can get the properties of the knot sequence. closed B-Spline with arbitrary distributed knots', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: arbitrary knot sequence of closed B-spline', () => {
                    const maxMultiplicityOrder = 3
                    const periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1]
                    const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
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
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.allAbscissae).to.eql(periodicKnots)
        });

        it('can use the iterator to access the knots of the sequence', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 0, 0, 1, 2, 2, 2]
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const seq1: number[] = [];
            for(const knot of seq) {
                if(knot !== undefined) seq1.push(knot)
            }
            expect(seq1).to.eql(periodicKnots)
        });

        it('can get the maximum multiplicity order of the knot sequence', () => {
            const maxMultiplicityOrder = 2
            const periodicKnots = [0, 1, 2, 3, 4, 5]
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        });

    });

    describe('Methods', () => {

        it('can clone the knot sequence with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 0, 0, 1, 1, 1.5, 2, 2, 2]
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seq1 = seq.clone()
            expect(seq1).to.eql(seq)
            const periodicKnots1 = [0, 1, 2, 3, 4]
            const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1})
            const seq3 = seq2.clone()
            expect(seq3).to.eql(seq2)
        });

        it('can get the length of an increasing knot sequence', () => {
            const periodicKnots = [0, 1, 2, 3, 4];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.length()).to.eql(periodicKnots.length)
    
            const periodicKnots1 = [0, 0, 0, 1, 1, 1]
            const maxMultiplicityOrder1 = 3;
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1})
            expect(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder1)
            expect(seq1.length()).to.eql(periodicKnots1.length)
    
            const maxMultiplicityOrder2 = 3
            const periodicKnots2 = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1]
            const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder2, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots2})
            expect(seq2.maxMultiplicityOrder).to.eql(maxMultiplicityOrder2)
            expect(seq2.length()).to.eql(periodicKnots2.length)
        });

        it('can get the distinct abscissae of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0, 0, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const knots1 = periodicKnots.slice(maxMultiplicityOrder - 1, periodicKnots.length - maxMultiplicityOrder + 1)
            expect(seq.distinctAbscissae()).to.eql(knots1)
        });

        it('can get the distinct abscissae of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1])
        });

        it('can get the distinct multiplicities of a minimal knot sequence conforming to a non-uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots})
            expect(seq.multiplicities()).to.eql([3, 3])
        });

        it('can get the distinct multiplicities of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.multiplicities()).to.eql([3, 1, 1, 2, 3])
        });

        it('can get the period of a knot sequence conforming to a non-uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.getPeriod()).to.eql(seq.lastKnot())
        });

        it('can get the period of a knot sequence conforming to a uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0.5, 0.6, 0.7, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.getPeriod()).to.eql(seq.lastKnot())
        });

        it('cannot get the knot abscissa from a sequence index when the index is out of range with negative values', () => {
            const maxMultiplicityOrder = 3
            const periodicKnots = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
        });

        it('can obtain the knot abscissa given the knot index for a uniform knot sequence for all knots except the last one', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            for(let i = 0; i < periodicKnots.length - 1; i++) {
                expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(i))).to.eql(periodicKnots[i])
            }
        });

        it('can obtain the knot abscissa given the knot index for a uniform knot sequence for the last one', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(periodicKnots.length - 1))).to.eql(KNOT_SEQUENCE_ORIGIN)
        });

        it('can obtain the knot abscissa given the knot index for a uniform knot sequence whatever the index greater than the period', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            for(let i = periodicKnots.length - 1; i < 2 * (periodicKnots.length - 1); i++) {
                expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(i))).to.eql(periodicKnots[i - (periodicKnots.length - 1)])
            }
        });

        it('can generate the knot index of the strictly increasing sequence from the knot index of the increasing sequence. case of uniform knot sequence and indices smaller than periodicKnots.length - 1', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            for(let i = 0; i < periodicKnots.length - 1; i++) {
                expect(seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(i)).knotIndex).to.eql(i)
            }
        });

        it('can generate the knot index of the strictly increasing sequence from the knot index of the increasing sequence. case of uniform knot sequence and last index of the increasing sequence', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            expect(seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(periodicKnots.length - 1)).knotIndex).to.eql(0)
        });

        it('can generate the knot index of the strictly increasing sequence from the knot index of the increasing sequence. case of uniform knot sequence and indices greater than the period', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            for(let i = periodicKnots.length; i < 2 * (periodicKnots.length - 1); i++) {
                expect(seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(i)).knotIndex).to.eql(i)
            }
        });

        it('can generate the knot index of the strictly increasing sequence from the knot index of the increasing sequence. case of arbitrary knot sequence', () => {
            const periodicKnots1 = [0, 1, 1, 2, 3, 3, 4, 5];
            const maxMultiplicityOrder = 2
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1});
            expect(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq1.allAbscissae.length).to.eql(8)
            let index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(0));
            expect(index.knotIndex).to.eql(0)
            index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(2));
            expect(index.knotIndex).to.eql(1)
            index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(4));
            expect(index.knotIndex).to.eql(3)
            index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(8));
            expect(index.knotIndex).to.eql(6)
        });

        it('can get the knot multiplicity from a knot sequence index', () => {
            const maxMultiplicityOrder = 3
            const knots = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots})
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

        it('cannot extract a subset of a knot sequence when start index is negative', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(-1), new KnotIndexIncreasingSequence(0))).to.throw(EM_KNOT_INDEX_VALUE);
        });

        it('cannot extract a subsequence of a knot sequence when start index is greater than the last index of the subset', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            let Istart = 1
            let Iend = 0
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw(EM_START_INDEX_OUTOF_RANGE);
            Istart = 0
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw(EM_START_INDEX_OUTOF_RANGE);
        });

        it('cannot extract a subsequence of a knot sequence when start index is greater than the last index of the increasing knot sequence', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            let Istart = periodicKnots.length
            let Iend = periodicKnots.length + 1
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw(EM_START_INDEX_GREATER_THAN_END_INDEX);
        });

        it('cannot extract a subsequence of a knot sequence when start and end indices span more than twice the period of the sequence', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            let Istart = 0
            let Iend = 2 * periodicKnots.length - 1
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw(EM_INDICES_SPAN_TWICE_PERIOD);
            Istart = 1
            Iend = 2 * periodicKnots.length
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw(EM_INDICES_SPAN_TWICE_PERIOD);
        });

        it('can extract a subsequence of a knot sequence. Case of uniform B-spline', () => {
            const periodicKnots = [0, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(3));
            expect(abscissae).to.eql([0, 1, 2, 3])
            const abscissae1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(6));
            expect(abscissae1).to.eql([2, 3, 4, 5, 6])
            const abscissae2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(5));
            expect(abscissae2).to.eql(periodicKnots)
        });

        it('can extract a subsequence of a knot sequence with knot multiplicities greater than one.', () => {
            const knots = [0, 1, 1, 2, 3, 4, 5];
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(7)
            const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(4));
            expect(abscissae).to.eql([0, 1, 1, 2, 3])
    
            const knots1 = [0, 1, 1, 2, 3, 4, 5, 6];
            const maxMultiplicityOrder1 = 3
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder1, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots1});
            expect(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder1)
            expect(seq1.allAbscissae.length).to.eql(8)
            const abscissae1 = seq1.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(6));
            expect(abscissae1).to.eql([1, 2, 3, 4, 5])
    
            const knots2 = [0, 0, 1, 2, 3, 4, 5, 6, 6];
            const maxMultiplicityOrder2 = 3
            const seq2 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder2, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots2});
            expect(seq2.maxMultiplicityOrder).to.eql(maxMultiplicityOrder2)
            expect(seq2.allAbscissae.length).to.eql(9)
            const abscissae2 = seq2.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(4));
            expect(abscissae2).to.eql([0, 0, 1, 2, 3])
    
            const knots3 = [0, 0, 1, 2, 3, 4, 5, 6, 6];
            const maxMultiplicityOrder3 = 3
            const seq3 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder3, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots3});
            expect(seq3.maxMultiplicityOrder).to.eql(maxMultiplicityOrder3)
            expect(seq3.allAbscissae.length).to.eql(9)
            const abscissae3 = seq3.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(7));
            expect(abscissae3).to.eql([2, 3, 4, 5, 6])
    
            const knots4 = [0, 0, 1, 2, 3, 4, 5, 6, 6];
            const maxMultiplicityOrder4 = 3
            const seq4 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder4, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots4});
            expect(seq4.maxMultiplicityOrder).to.eql(maxMultiplicityOrder4)
            expect(seq4.allAbscissae.length).to.eql(9)
            const abscissae4 = seq4.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(4), new KnotIndexIncreasingSequence(8));
            expect(abscissae4).to.eql([3, 4, 5, 6, 6])
        });

        it('can extract a subsequence from a knot sequence with various knot multiplicities.', () => {
            const knots = [0, 0, 1, 2, 3, 4, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 12];
            const maxMultiplicityOrder = 4
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(17)
            const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(15), new KnotIndexIncreasingSequence(21));
            expect(abscissae).to.eql([12, 12, 13, 14, 15, 16, 16])
            const abscissae1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(16), new KnotIndexIncreasingSequence(22));
            expect(abscissae1).to.eql([12, 13, 14, 15, 16, 16, 17])
        });
    
        it('can extract a subsequence from a knot sequence when indices cover the period of the B-Spline and knots are of multiplicity one.', () => {
            const knots = [0, 1, 2, 3, 4];
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(5)
            const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(5));
            expect(abscissae).to.eql([1, 2, 3, 4, 5])
            const abscissae2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(7));
            expect(abscissae2).to.eql([3, 4, 5, 6, 7])
            const abscissae3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(4));
            expect(abscissae3).to.eql([0, 1, 2, 3, 4])
            const abscissae4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(4), new KnotIndexIncreasingSequence(8));
            expect(abscissae4).to.eql([4, 5, 6, 7, 8])
        });
    
        it('can extract a subsequence from a knot sequence when indices cover the period of the B-Spline and end knots are of multiplicity greater than one.', () => {
            const knots = [0, 0, 1, 2, 3, 4, 4];
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(7)
            const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(7));
            expect(abscissae).to.eql([1, 2, 3, 4, 4, 5])
            const abscissae1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(8));
            expect(abscissae1).to.eql([2, 3, 4, 4, 5, 6])
            const abscissae2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(4), new KnotIndexIncreasingSequence(9));
            expect(abscissae2).to.eql([3, 4, 4, 5, 6, 7])
            const abscissae3 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(6));
            expect(abscissae3).to.eql([0, 1, 2, 3, 4, 4])
            const abscissae4 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(6));
            expect(abscissae4).to.eql([0, 0, 1, 2, 3, 4, 4])
            const abscissae5 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(6), new KnotIndexIncreasingSequence(12));
            expect(abscissae5).to.eql([4, 5, 6, 7, 8, 8, 9])
        });

        it('can extract a subsequence of a knot sequence. Case of non uniform B-spline', () => {
            const periodicKnots = [0, 0, 1, 1];
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots});
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.allAbscissae.length).to.eql(periodicKnots.length)
            const abscissae = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(0), new KnotIndexIncreasingSequence(2));
            expect(abscissae).to.eql([0, 0, 1])
        });

        it('cannot check if an abscissa coincides with a knot belonging to the interval of the curve if this abscissa is outside the interval of the normalized basis', () => {
            const periodicKnots: number [] = [0, 1, 2, 3, 4, 5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            let abscissae = 5.5;
            expect(() => seq.isAbscissaCoincidingWithKnot(abscissae)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
            abscissae = -0.5;
            expect(() => seq.isAbscissaCoincidingWithKnot(abscissae)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
        });

        it('can check if an abscissa coincides with a knot belonging to the interval of the normalized basis', () => {
            const periodicKnots: number [] = [0, 1, 2, 3, 4, 5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
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
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const abscissae = seq.distinctAbscissae()
            for(let i = 0; i < abscissae.length; i++) {
                expect(seq.isKnotlMultiplicityZero(abscissae[i])).to.eql(false)
                if(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE) < seq.uMax)
                    expect(seq.isKnotlMultiplicityZero(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
                if(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE) > 0)
                    expect(seq.isKnotlMultiplicityZero(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(true)
            }
        });

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.insertKnot(0.5)).to.eql(false)
            expect(seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false)
            expect(seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false)
        });

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one and does not issue an error message if the multiplicity is greater than maxMultiplicityOrder', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.insertKnot(0.5, maxMultiplicityOrder)).to.eql(false)
            expect(seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false)
            expect(seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false)
        });

        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const newKnotAbscissa = 0.3;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(() => seq.insertKnot(newKnotAbscissa, 5)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(() => seq.insertKnot(1.2, 1)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)

            const knots1: number [] = [0, 1, 2, 3, 4]
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots1})
            expect(() => seq1.insertKnot(4.2, 1)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(() => seq.insertKnot(-0.2, 1)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)

            const knots1: number [] = [0, 1, 2, 3, 4]
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: knots1})
            expect(() => seq1.insertKnot(-0.2, 1)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
        });

        it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.insertKnot(0.3, 3)).to.eql(true)
            expect(seq.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1])
            expect(seq.multiplicities()).to.eql([3, 3, 1, 1, 2, 3])
        });

        it('check knot sequence properties after knot insertion', () => {
            const periodicKnots: number [] = [0, 1, 2, 3, 4]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seq1 = seq.clone()
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
            expect(seq.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)
            
            expect(seq.insertKnot(1.2, 1)).to.eql(true)
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
            expect(seq.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)

            expect(seq1.insertKnot(1.2, 2)).to.eql(true)
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq1.uMax).to.eql(periodicKnots[periodicKnots.length - 1])
            expect(seq1.allAbscissae[0]).to.eql(KNOT_SEQUENCE_ORIGIN)
        });

        it('cannot raise the multiplicity of an intermediate knot more than maxMultiplicityOrder with constructor type' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.length()).to.eql(periodicKnots.length)
            const mult = maxMultiplicityOrder - 1
            for(let i = maxMultiplicityOrder; i < (periodicKnots.length - maxMultiplicityOrder); i++) {
                const seq1 = seq.clone()
                const index = seq.findSpan(periodicKnots[i])
                const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
                expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, mult)).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
            }
        });

        it('can raise the order of multiplicity of a knot in the knot sequence of a periodic B-spline', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 3;
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1])
            let index = seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(1))
            const seq1 = seq.raiseKnotMultiplicity(index, 1)
            expect(seq1.multiplicities()).to.eql([1, 2, 1, 1, 1, 1, 1, 1, 1])
            expect(seq1.knotMultiplicity(index)).to.eql(2)
            index = seq1.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(0))
            const seq2 = seq1.raiseKnotMultiplicity(index, 1)
            expect(seq2.multiplicities()).to.eql([2, 2, 1, 1, 1, 1, 1, 1, 2])
            expect(seq2.knotMultiplicity(index)).to.eql(2)
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexIncreasingSequence(i)
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                const seq2 = seq1.raiseKnotMultiplicity(indexStrictInc, 1)
                expect(seq2.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexIncreasingSequence(i)
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                const seq2 = seq1.raiseKnotMultiplicity(indexStrictInc, 1)
                expect(seq2.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('can raise the multiplicity of an existing knot with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const index = seq.findSpan(0.2)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            const seq1 = seq.raiseKnotMultiplicity(indexStrictInc, 1)
            expect(seq1.multiplicities()).to.eql([1, 1, 2, 1, 1, 1])
            expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, 2)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });

        it('can raise the multiplicity of an extreme knot with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(0)
            const seq1 = seq.raiseKnotMultiplicity(indexStrictInc, 1)
            expect(seq1.multiplicities()).to.eql([2, 1, 1, 1, 1, 2])
            expect(() => seq1.raiseKnotMultiplicity(indexStrictInc, 2)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });

        it('can revert the knot sequence for a uniform B-spline', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            // const seqRef = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            
            const periodicKnots1: number [] = [0, 0.05, 0.2, 0.35, 0.4, 0.5]
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1})
            // const seqRef1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1})
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
            const periodicKnots: number [] = [0, 0, 0.3, 0.4, 0.5, 0.5, 0.8, 0.8]
            const maxMultiplicityOrder = 2
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            // const seqRef = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seqReversed = seq.revertKnotSequence();
            const seqReReversed = seqReversed.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqReReversed.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqReReversed.multiplicities())
            const periodicKnots1: number [] = [0, 0, 0.2, 0.2, 0.5, 0.8, 0.8]
            const seq1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1})
            // const seqRef1 = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots1})
            const seqReversed1 = seq1.revertKnotSequence();
            const seqReReversed1 = seqReversed1.revertKnotSequence();
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqReReversed1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.multiplicities()).to.eql(seqReReversed1.multiplicities())
        });

        it('can get the order of multiplicity of a knot from its abscissa', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const distinctKnots = seq.distinctAbscissae();
            const knotMultiplities = seq.multiplicities();
            for(let i = 0; i < distinctKnots.length; i++) {
                expect(seq.knotMultiplicityAtAbscissa(distinctKnots[i])).to.eql(knotMultiplities[i])
            }
        });

        it('get an order of multiplicity 0 and a warning message when the abscissa does not coincide with a knot', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0)
            // const multiplicity = seq.knotMultiplicityAtAbscissa(0.1)
            // expect(() => seq.knotMultiplicityAtAbscissa(0.1)).to.eql(WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE)
        });
    
        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seqStrInc = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq)
            expect(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('can decrement the multiplicity of a knot when the knot index is an extreme knot with constructor type: ' + INCREASINGPERIODICKNOTSEQUENCE, () => {
            const periodicKnots: number [] = [0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seq1 = seq.clone()
            seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(0))
            const newMultiplicities = [2, 1, 2, 1, 1, 2]
            expect(seq.multiplicities()).to.eql(newMultiplicities)
            const lastIndex = seq.toKnotIndexStrictlyIncreasingSequence(new KnotIndexIncreasingSequence(seq.length() - 1))
            seq1.decrementKnotMultiplicityMutSeq(lastIndex)
            expect(seq1.multiplicities()).to.eql(newMultiplicities)
        });

        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            for(let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.clone()
                seq1.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(i))
                expect(seq1.length()).to.eql(seq.length() - 1)
            }
        });

        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
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
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(0))).to.throw(EM_SEQUENCE_ORIGIN_REMOVAL)
            expect(() => seq.decrementKnotMultiplicityMutSeq(new KnotIndexStrictlyIncreasingSequence(seq.distinctAbscissae().length - 1))).to.throw(EM_SEQUENCE_ORIGIN_REMOVAL)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const abscissa = 0.3
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1])
            expect(seq.isKnotSpacingUniform).to.eql(true)
            seq.decrementKnotMultiplicityMutSeq(indexStrictInc)
            expect(seq.isKnotSpacingUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const abscissa = 0.2
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(seq.multiplicities()).to.eql([1, 1, 2, 1, 1, 1])
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            seq.decrementKnotMultiplicityMutSeq(indexStrictInc)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.8, 0.8, 0.8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            const seqStrInc = fromIncreasingPeriodicToStrictlyIncreasingPeriodicKnotSequence(seq)
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(seqStrInc.length() - 1)
            expect(seq.multiplicities()).to.eql([3, 1, 2, 1, 1, 3])
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            seq.decrementKnotMultiplicityMutSeq(indexStrictInc)
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.multiplicities()).to.eql([2, 1, 2, 1, 1, 2])
        });

        it('cannot find the span index in the knot sequence if the abscissa is negative', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(() => seq.findSpan(-0.1)).to.throw(EM_U_OUTOF_KNOTSEQ_RANGE)
        });

        it('can find the span index in the knot sequence if the abscissa is over the knot sequence period', () => {
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
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
            const periodicKnots: number [] = [0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
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
            const periodicKnots: number [] = [0, 0, 0.1, 0.2, 0.5, 0.6, 0.7, 0.7, 0.8, 0.9, 1, 1]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const lastAbscissa = seq.lastKnot()
            expect(seq.uMax).to.eql(lastAbscissa)
            let indexOffset = - 1;
            let indexOffset2 = indexOffset
            const lastAbscissaIndex = seq.distinctAbscissae().length - 1
            for(let i = 0; i <= lastAbscissaIndex; i++) {
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

        it('can find the span index in the knot sequence from an abscissa for a uniform periodic B-spline', () => {
            const periodicKnots: number [] = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingPeriodicKnotSequenceClosedCurve(maxMultiplicityOrder, {type: INCREASINGPERIODICKNOTSEQUENCE, periodicKnots: periodicKnots})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
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

    });

});