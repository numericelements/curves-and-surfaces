import { expect } from 'chai';
import { EM_KNOT_INDEX_VALUE, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from '../../src/newBsplines/Knot';
import { IncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve';
import { findSpan } from '../../src/newBsplines/Piegl_Tiller_NURBS_Book';
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from '../../src/newBsplines/KnotSequenceConstructorInterface';
import { NormalizedBasisAtSequenceEnd } from '../../src/newBsplines/AbstractOpenKnotSequence';
import { fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC } from '../../src/newBsplines/KnotSequenceConversionAndUtilities';
import { OPEN_KNOT_SEQUENCE_ORIGIN, KNOT_COINCIDENCE_TOLERANCE } from '../../src/namedConstants/KnotSequences';
import { EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_SIZENORMALIZED_BSPLINEBASIS, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT, EM_NULL_KNOT_SEQUENCE, EM_NON_INCREASING_KNOT_VALUES, EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE, EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART, EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_KNOT_INSERTION_OVER_UMAX, EM_KNOT_INSERTION_UNDER_SEQORIGIN, EM_MAXMULTIPLICITY_ORDER_ATKNOT, EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS, EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ, EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_KNOTINDEX_INC_SEQ_TOO_LARGE, EM_INDICES_FOR_EXTRACTION_OUTOF_RANGE, EM_NOT_NORMALIZED_BASIS, EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT } from '../../src/ErrorMessages/KnotSequences';
import { WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE } from '../../src/WarningMessages/KnotSequences';
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF } from '../namedConstants/GeneralPurpose';
import { TOL_KNOT_COINCIDENCE } from '../../src/newBsplines/AbstractBSplineR1toR2';


describe('IncreasingOpenKnotSequenceOpenCurve', () => {

    describe('Constructor', () => {

        describe(NO_KNOT_OPEN_CURVE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 0
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('can be initialized without a knot sequence with NO_KNOT_OPEN_CURVE initializer', () => {
                for(let i = 1; i < 4; i++) {
                    const maxMultiplicityOrder = i
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                    const knots: number[] = []
                    for(let j = 1; j <= maxMultiplicityOrder; j++) {
                        knots.splice(0, 0, 0)
                        knots.splice((knots.length), 0, 1)
                    }
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                }
            });

            it('can get the knot index of the curve origin with ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the properties of knot sequnence produced with the initializer ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            });

            it('can get the u interval upper bound produced with the initializer ' + NO_KNOT_OPEN_CURVE, () => {
                const maxMultiplicityOrder = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                const lastIndex = seq.length() - 1
                expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(0))).to.eql(0.0)
                expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(lastIndex))).to.eql(1.0)
                expect(seq.uMax).to.eql(1.0)
            });
        });

        describe(UNIFORM_OPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 2
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 1
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a size of normalized B-spline basis produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                for(let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 4
                    for(let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: j})
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
            });

            it('can get the knot index of the curve origin produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the u interval upper bound produced by the initializer ' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - 1)
            });

            it('can get the properties of knot sequnence produced by the initializer' + UNIFORM_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
        });

        describe(UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 2
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with ' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE + ' initializer if the basis dimension prescribed does not enable generating a normalized basis of B-Splines', () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 2;
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a number of control points produced by the initializer' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                for(let i = 2; i < 5; i++) {
                    const maxMultiplicityOrder = i
                    const upperBound = 3
                    for(let j = maxMultiplicityOrder; j < (maxMultiplicityOrder + upperBound); j++) {
                        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: j})
                        const knots: number[] = []
                        for(let k = 0; k < maxMultiplicityOrder; k++) {
                            knots.push(0)
                        }
                        for(let k = 0; k < maxMultiplicityOrder; k++) {
                            knots.push(j - maxMultiplicityOrder + 1)
                        }
                        for(let k = 0; k < (j - maxMultiplicityOrder); k++) {
                            knots.splice((maxMultiplicityOrder + k), 0, (k + 1))
                        }
                        const seq1: number[] = [];
                        for(const knot of seq) {
                            if(knot !== undefined) seq1.push(knot)
                        }
                        expect(seq1).to.eql(knots)
                    }
                }
            });

            it('can get the knot index of the curve origin produced by the initializer' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the u interval upper bound produced by the initializer' +  UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - maxMultiplicityOrder + 1)
            });

            it('can get the properties of knot sequence produced by the initializer' + UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            });
        });

        describe(INCREASINGOPENKNOTSEQUENCE, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence produced by the initializer' + INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = []
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a number of knots smaller than maxMultiplicityOrder for a constructor type ' + INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [-1, 0, 1]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_NOT_NORMALIZED_BASIS)
            });

            it('cannot initialize a knot sequence with a number of knots such that there no interval of normalized basis left.', () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [-2, -1, 0, 1, 2]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot initialize a knot sequence with a number of knots such that the interval of normalized basis reduces to zero.', () => {
                const maxMultiplicityOrder = 4
                const knots: number [] = [-3, -2, -1, 0, 1, 2, 3]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots1: number [] = [0, 0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots2: number [] = [0, 0, 0, 0.5, 2, 2, 2, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });
        
            it('cannot be initialized with a non increasing knot sequence produced by the initializer' + INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0, 0, -0.5, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots2: number [] = [0, 0, 0, 1, 2, 3, 4, 4, 3.5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
            });

            it('cannot be initialized for non-uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + INCREASINGOPENKNOTSEQUENCE, () => {
                const maxMultiplicityOrder = 3;
                let knots: number [] = [0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5]
                const upperBound = knots.length;
                for(let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const knots1 = knots.slice();
                    for( let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i])
                    }
                    expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
                    knots = knots1.slice()
                }
            });
        
            it('cannot be initialized for uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + INCREASINGOPENKNOTSEQUENCE, () => {
                let knots: number [] = [-2, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 7]
                const maxMultiplicityOrder = 3;
                const upperBound = knots.length;
                for(let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const knots1 = knots.slice();
                    for( let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i])
                    }
                    expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
                    knots = knots1.slice()
                }
            });
        
            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCE + "when knot multiplicities from the sequence start don't define a normalized basis", () => {
                const curveDegree = 3;
                const maxMultiplicityOrder = curveDegree + 1
                const knots = [-1, -1, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
            });
        
            it("cannot be initialized with an initializer " + INCREASINGOPENKNOTSEQUENCE + "when knot multiplicities from the sequence end don't define a normalized basis", () => {
                const curveDegree = 3;
                const maxMultiplicityOrder = curveDegree + 1
                const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 2, 2 ]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND)
            });

            describe('Initialization of knot sequences for non uniform B-splines', () => {
                it('can be initialized with an initializer ' + INCREASINGOPENKNOTSEQUENCE + ' . Non uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                });
    
                it('can check the initializer ' + INCREASINGOPENKNOTSEQUENCE + 'for consistency of the knot sequence and knot multiplicities', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    const seq1 = seq.allAbscissae;
                    expect(() => seq.checkSizeConsistency(seq1.slice(1, seq1.length - 1))).to.throw(EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ)
                });
    
                it('can get the properties of the knot sequence. Non uniform B-Spline without intermediate knot', () => {
                    const curveDegree = 3;
                    const maxMultiplicityOrder = curveDegree + 1
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
                });
    
                it('can get the knot index and the abscissa of the upper bound of the normalized basis. Non uniform B-Spline without intermediate knot', () => {
                    const curveDegree = 3;
                    const maxMultiplicityOrder = curveDegree + 1
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                    expect(seq.uMax).to.eql(knots[knots.length -1])
                });
    
                it('can be initialized with an initializer ' + INCREASINGOPENKNOTSEQUENCE + '. non uniform knot sequence of open curve with intermediate knots', () => {
                    const curveDegree = 3;
                    const maxMultiplicityOrder = curveDegree + 1
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                });
    
                it('can get the properties of knot sequence: non uniform knot sequence of open curve with intermediate knots.', () => {
                    const curveDegree = 3;
                    const maxMultiplicityOrder = curveDegree + 1
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
                });
    
                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: non uniform knot sequence of open curve with intermediate knots', () => {
                    const curveDegree = 3;
                    const maxMultiplicityOrder = curveDegree + 1
                    const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(0))
                    expect(seq.uMax).to.eql(1)
                });
            });

            describe('Initialization of knot sequences for uniform B-splines', () => {
                it('can be initialized with an initializer ' + INCREASINGOPENKNOTSEQUENCE + '. uniform knot sequence of open curve without intermediate knots', () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2, 3, 5, 6, 7]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with uniformly distributed knots', () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2, 3, 4, 5, 6]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the properties of the knot sequence. uniform B-Spline with non uniformly distributed knots', () => {
                    const maxMultiplicityOrder = 2
                    const knots = [-1, 0, 1, 2.5, 3, 4, 5, 6]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(true)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and the abscissa upper bound of the normalized basis: uniform knot sequence of open curve', () => {
                    const maxMultiplicityOrder = 3
                    const knots = [-2, -1, 0, 0.5, 0.6, 0.7, 0.7, 1, 2.5, 3]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.indexKnotOrigin).to.eql(new KnotIndexStrictlyIncreasingSequence(maxMultiplicityOrder - 1))
                    expect(seq.uMax).to.eql(1)
                });
            });

            describe('Initialization of arbitrary knot sequences for B-splines', () => {
                it('can be initialized with uniform like knots at left and non-uniform knots at right.', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql([-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1])
                });
            
                it('can get the properties of an arbitrary knot sequence', () => {
                    const maxMultiplicityOrder = 4
                    const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.isKnotSpacingUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityUniform).to.eql(false)
                    expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
                });

                it('can get the knot index of the sequence origin and maximal abscissa of the normalized knot sequence', () => {
                    const knots: number [] = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                    const maxMultiplicityOrder = 4
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.indexKnotOrigin.knotIndex).to.eql(2)
                    expect(seq.uMax).to.eql(1)
                });
            });
        });

        describe(INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence produced by the initializer ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = []
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0.5, 2, 3, 4, 5, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots1: number [] = [0, 0, 0, 0, 0.5, 2, 3, 4, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots2: number [] = [0, 0.5, 2, 2, 2, 2, 3, 4, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots2})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });

            it('cannot be initialized with a knot sequence producing a non normalized basis', () => {
                const knots: number [] = [-1, 0, 1]
                const maxMultiplicityOrder = 4
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})).to.throw(EM_NOT_NORMALIZED_BASIS)
            });

            it('cannot be initialized with a knot sequence able to produce normalized basis intervals that are incompatible with each other', () => {
                const knots: number [] = [-2, -1, 0, 1, 2]
                const maxMultiplicityOrder = 4
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });

            it('cannot be initialized with a knot sequence producing a normalized basis interval with null amplitude', () => {
                const knots: number [] = [-3, -2, -1, 0, 1, 2, 3]
                const maxMultiplicityOrder = 4
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})).to.throw(EM_NORMALIZED_BASIS_INTERVAL_NOTSUFFICIENT)
            });
        
            it('cannot be initialized with a non increasing knot sequence produced by the initializer ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0, -0.5, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots1})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots2: number [] = [0, 0, 1, 2, 3, 4, 4, 3.5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots2})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
            });

            it('can be initialized with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
                const maxMultiplicityOrder = 3;
                let knots: number [] = [0, 0, 0, 0.5, 2, 3, 4, 5, 5]
                const upperBound = knots.length;
                const multiplicityFirstKnot = 3;
                const multiplicityLastKnot = 2;
                for(let i = multiplicityFirstKnot; i < upperBound - multiplicityLastKnot - 1; i++) {
                    const knots1 = knots.slice();
                    for( let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i])
                    }
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.allAbscissae).to.eql(knots)
        });

        it('can use the iterator to access the knots of the sequence', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 2, 2, 2, 2]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const seq1: number[] = [];
            for(const knot of seq) {
                if(knot !== undefined) seq1.push(knot)
            }
            expect(seq1).to.eql(knots)
        });

        it('can get the status of the knot sequence about the description of C0 discontinuity', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true)
        });

        it('can get the maximum multiplicity order of the knot sequence', () => {
            const maxMultiplicityOrder = 3
            const knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
        });
    });

    describe('Methods', () => {

        it('can clone the knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const seq1 = seq.clone()
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(false)
            expect(seq1).to.eql(seq)
        });

        it('can clone the knot sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const seq1 = seq.clone()
            expect(seq1.isSequenceUpToC0Discontinuity).to.eql(true)
            expect(seq1).to.eql(seq)
        });

        it('can compute the knot sequence length', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq.length()).to.eql(12)
            const knots1 = [0, 0, 0, 0, 1, 1, 1, 1 ]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            expect(seq1.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(seq1.length()).to.eql(8)
        });

        it('can get the distinct abscissae of a knot sequence', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const abscissae = seq.distinctAbscissae()
            expect(abscissae).to.eql([0, 0.5, 0.6, 0.7, 1])
        });
    
        it('can get the multiplicity of each knot of a knot sequence', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const multiplicities = seq.multiplicities()
            expect(multiplicities).to.eql([4, 1, 1, 2, 4])
        });

        it('can check the coincidence of an abscissa with a knot', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const abscissae = seq.distinctAbscissae();
            for(let i = 0; i < abscissae.length; i++) {
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] + (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i] - (COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF * KNOT_COINCIDENCE_TOLERANCE))).to.eql(false)
                expect(seq.isAbscissaCoincidingWithKnot(abscissae[i])).to.eql(true)
            }
        });

        it('can get the knot index in the associated strictly increasing sequence from a sequence index of the increasing sequence.', () => {
            const maxMultiplicityOrder = 4;
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
    

        it('can check if the knot multiplicity at a given abscissa is zero', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.insertKnot(0.5)).to.eql(false)
            expect(seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false)
            expect(seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF))).to.eql(false)
        });

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is too close to an existing one and does not issue an error message if the multiplicity is greater than maxMultiplicityOrder', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.insertKnot(0.5, maxMultiplicityOrder)).to.eql(false)
            expect(seq.insertKnot(0.5 + (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false)
            expect(seq.insertKnot(0.5 - (KNOT_COINCIDENCE_TOLERANCE/COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF), maxMultiplicityOrder)).to.eql(false)
        });
    
        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const newKnotAbscissa = 0.3;
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(() => seq.insertKnot(newKnotAbscissa, 5)).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case over uMax', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(() => seq.insertKnot(1.2, 1)).to.throw(EM_KNOT_INSERTION_OVER_UMAX)

            const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            expect(() => seq1.insertKnot(4.2, 1)).to.throw(EM_KNOT_INSERTION_OVER_UMAX)
        });

        it('cannot insert a new knot outside the knot sequence definition interval [0, uMax]: case lower than sequence origin', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(() => seq.insertKnot(-0.2, 1)).to.throw(EM_KNOT_INSERTION_UNDER_SEQORIGIN)

            const knots1: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            expect(() => seq1.insertKnot(-3.2, 1)).to.throw(EM_KNOT_INSERTION_UNDER_SEQORIGIN)
        });

        it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.insertKnot(0.3, 3)).to.eql(true)
            expect(seq.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1])
            expect(seq.multiplicities()).to.eql([4, 3, 1, 1, 2, 4])
        });

        it('check knot sequence properties after knot insertion', () => {
            const knots: number [] = [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            expect(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.abscissaAtIndex(new KnotIndexIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_INC_SEQ_TOO_LARGE)
        });

        it('can get the knot abscissa from a sequence index. Case of non uniform B-Spline', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const knots = [-3, -2, -1, 0, 0.5, 0.6, 0.7, 0.7, 1, 2, 3, 4]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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

        it('cannot convert a strictly increasing knot index into an increasing knot index if the strictly increasing index is out of range', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(seq.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        
            const knots1: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.4, 0.5, 0.5, 0.5, 1, 1, 1, 1]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            expect(seq1.isKnotSpacingUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(true)
            const seqStrcInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq1)
            expect(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq1.toKnotIndexIncreasingSequence(new KnotIndexStrictlyIncreasingSequence(seqStrcInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('can convert a strictly increasing knot index into an increasing knot index for a uniform knot sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            const seqStrcInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
            let offSet = 0
            for(let i = 0; i < seqStrcInc.length(); i++) {
                const index = new KnotIndexStrictlyIncreasingSequence(i)
                const indexInc = seq.toKnotIndexIncreasingSequence(index)
                expect(indexInc.knotIndex).to.eql(i + offSet)
                offSet = offSet + seq.knotMultiplicity(index) - 1
            }
        });

        it('cannot raise the multiplicity of an intermediate knot more than (maxMultiplicityOrder - 1) whether knot sequence consistency check is active or not and with constructor type' + INCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
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

        it('cannot raise the multiplicity of an intermediate knot to more than maxMultiplicityOrder with knot sequence consistency check and with constructor type' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities = seq.multiplicities()
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
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

        it('cannot raise the multiplicity of extreme knots with uniform knot sequence consistency check and with constructor type' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities = seq.multiplicities()
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
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

        it('cannot raise the multiplicity of extreme knots with non uniform knot sequence consistency check and with constructor type' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities = seq.multiplicities()
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
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

        it('can raise the multiplicity of any knot of a uniform sequence to more than maxMultiplicityOrder without knot sequence consistency check and with constructor type' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            expect(seq.length()).to.eql(knots.length)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            const multiplicities = seq.multiplicities()
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
            const sequenceConsistencyCheck = false
            for(let i = 0; i < multiplicities.length; i++) {
                expect(seqStrInc.knotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i))).to.eql(multiplicities[i])
            }
            for(let i = 0; i < knots.length; i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexIncreasingSequence(i)
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                seq1.raiseKnotMultiplicity(indexStrictInc, maxMultiplicityOrder, sequenceConsistencyCheck)
                expect(seq1.multiplicities()[i]).to.eql(maxMultiplicityOrder + 1)
            }
        });
    
        it('check the knot sequence property update after raising the multiplicity of a knot of a uniform multiplicity sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            const sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexIncreasingSequence(i)
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                seq1.raiseKnotMultiplicity(indexStrictInc, 1, sequenceConsistencyCheck)
                expect(seq1.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            }
        });

        it('check the knot sequence property update after raising the multiplicity of a knot of a non uniform multiplicity sequence with constructor type ' + INCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            const sequenceConsistencyCheck = true
            for(let i = maxMultiplicityOrder; i < (seq.length() - maxMultiplicityOrder - 1); i++) {
                const seq1 = seq.clone()
                const index = new KnotIndexIncreasingSequence(i)
                const indexStrictInc = seq1.toKnotIndexStrictlyIncreasingSequence(index)
                seq1.raiseKnotMultiplicity(indexStrictInc, 1, sequenceConsistencyCheck)
                expect(seq1.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            }
        });

        it('can raise the multiplicity of an existing knot with constructor type ' + INCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const index = seq.findSpan(0.2)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            const sequenceConsistencyCheck = true
            seq.raiseKnotMultiplicity(indexStrictInc, 1)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(() => seq.raiseKnotMultiplicity(indexStrictInc, 2, sequenceConsistencyCheck)).to.throw()
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + INCREASINGOPENKNOTSEQUENCE, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
            // test without knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()), false)).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range with constructor type ' + INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(true)
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
            // test without knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1), false)).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()), false)).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of a knot when the knot index is not an intermadiate knot (Case of non uniform B-Spline.) with constructor type: ' + INCREASINGOPENKNOTSEQUENCE + ' and active sequence consistency check', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
            expect(seq.isSequenceUpToC0Discontinuity).to.eql(false)
            const basisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd();
            // test with knot sequence consistency check
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0))).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
            expect(() => seq.decrementKnotMultiplicity(basisAtEnd.knot)).to.throw(EM_MULTIPLICITY_ORDER_MODIFYING_NORMALIZED_BASIS)
        });

        it('can decrement the multiplicity of an existing knot when the knot multiplicity is one whatever the knot index when the knot sequence consistency is unchecked', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const sequenceConsistencyCheck = false
            for(let i = 0; i < seq.distinctAbscissae().length; i++) {
                const seq1 = seq.clone()
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                expect(seq1.length()).to.eql(seq.length() - 1)
            }
        });

        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one and the knot is strictly inside the normalized basis interval', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const sequenceConsistencyCheck = true
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            for(let i = maxMultiplicityOrder; i < seq.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq1 = seq.clone()
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
            const seq2 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            for(let i = maxMultiplicityOrder; i < seq2.distinctAbscissae().length - maxMultiplicityOrder; i++) {
                const seq1 = seq2.clone()
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq2.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq2.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1)
                }
            }
        });

        it('can decrement the multiplicity of an existing knot and remove it when its multiplicity equals one', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const sequenceConsistencyCheck = true
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            for(let i = 1; i < seq.distinctAbscissae().length - 1; i++) {
                const seq1 = seq.clone()
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq.multiplicities()[i] - 1)
                }
            }
            const seq2 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            for(let i = 1; i < seq2.distinctAbscissae().length - 1; i++) {
                const seq1 = seq2.clone()
                seq1.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(i), sequenceConsistencyCheck)
                if(seq2.multiplicities()[i] === 1) {
                    expect(seq1.length()).to.eql(seq2.length() - 1)
                } else {
                    expect(seq1.multiplicities()[i]).to.eql(seq2.multiplicities()[i] - 1)
                }
            }
        });

        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const abscissa = 0.3
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            const sequenceConsistencyCheck = true
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(seq.isKnotSpacingUniform).to.eql(true)
            seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck)
            expect(seq.isKnotSpacingUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const sequenceConsistencyCheck = true
            const abscissa = 0.2
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck)
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence when the knot sequence  consistency is not checked', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.8, 0.8, 0.8, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const sequenceConsistencyCheck = false
            const seqStrInc = fromIncreasingToStrictlyIncreasingOpenKnotSequenceOC(seq)
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(seqStrInc.length() - 1)
            expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 4])
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            seq.decrementKnotMultiplicity(indexStrictInc, sequenceConsistencyCheck)
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 3])
        });

        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence origin is updated as well as some abscissae', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))
            expect(abscissa).to.eql(OPEN_KNOT_SEQUENCE_ORIGIN)
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq.indexKnotOrigin).to.eql(indexOrigin)
            expect(seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))).to.eql(OPEN_KNOT_SEQUENCE_ORIGIN)
            const updatedKnots: number [] = [-0.4, -0.3, -0.2, 0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]
            for(let i = 0; i < seq.allAbscissae.length; i++) {
                expect(seq.allAbscissae[i]).to.be.closeTo(updatedKnots[i], TOL_KNOT_COINCIDENCE)
            }
            expect(seq.uMax).to.eql(0.4)
        });

        it('can get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at uMax is removed. Knot sequence consistency is not checked during knot multiplicity decrement but the sequence uMax is updated as well as some abscissae', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const sequenceConsistencyCheck = false
            const indexUMax = seq.getKnotIndicesBoundingNormalizedBasis().end.knot;
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexUMax))
            expect(abscissa).to.eql(seq.uMax)
            seq.decrementKnotMultiplicity(indexUMax, sequenceConsistencyCheck)
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq.uMax).to.eql(0.4)
            const updatedKnots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8]
            for(let i = 0; i < seq.allAbscissae.length; i++) {
                expect(seq.allAbscissae[i]).to.be.closeTo(updatedKnots[i], TOL_KNOT_COINCIDENCE)
            }
            expect(seq.uMax).to.eql(0.4)
        });

        it('cannot get a consistent knot sequence origin when a knot multiplicity is decremented and the knot at origin is removed. Knot sequence consistency is not checked during knot multiplicity decrement and the sequence origin cannot be updated', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.2, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))
            expect(abscissa).to.eql(OPEN_KNOT_SEQUENCE_ORIGIN)
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            expect(() => seq.updateKnotSequenceThroughNormalizedBasisAnalysis()).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
        });

        it('cannot get consistent knot sequence normalized basis when a knot multiplicity is decremented and the knot at origin is removed when the knot sequence consistency is not checked during knot multiplicity decrement', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            let indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceEnd.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart.knot.knotIndex).to.eql(indexOrigin.knotIndex)
            seq.decrementKnotMultiplicity(indexOrigin, sequenceConsistencyCheck)
            indexNormalizedBasisAtStart = seq.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceEnd.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart.knot.knotIndex).to.not.eql(indexOrigin.knotIndex)
            expect(seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexNormalizedBasisAtStart.knot))).to.not.eql(OPEN_KNOT_SEQUENCE_ORIGIN)

            const knots1: number [] = [0, 0, 0, 0, 0.1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5, 0.5, 0.5]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            const indexOrigin1 = seq1.indexKnotOrigin
            let indexNormalizedBasisAtStart1 = seq1.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceEnd.StrictlyNormalized)
            expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.eql(indexOrigin1.knotIndex)
            seq1.decrementKnotMultiplicity(indexOrigin1, sequenceConsistencyCheck)
            indexNormalizedBasisAtStart1 = seq1.getKnotIndexNormalizedBasisAtSequenceStart()
            expect(indexNormalizedBasisAtStart1.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceEnd.OverDefined)
            expect(indexNormalizedBasisAtStart1.knot.knotIndex).to.not.eql(indexOrigin1.knotIndex)
            expect(seq1.abscissaAtIndex(seq1.toKnotIndexIncreasingSequence(indexNormalizedBasisAtStart1.knot))).to.not.eql(OPEN_KNOT_SEQUENCE_ORIGIN)
        });

        it('can update the origin and uMax of a knot sequence whose knot multiplicities have been increased/decreased without knot conformity checking', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY, knots: knots})
            const sequenceConsistencyCheck = false
            const indexOrigin = seq.indexKnotOrigin
            const abscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(indexOrigin))
            expect(abscissa).to.eql(OPEN_KNOT_SEQUENCE_ORIGIN)
            expect(seq.uMax).to.eql(0.5)
            seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(0), sequenceConsistencyCheck)
            seq.updateKnotSequenceThroughNormalizedBasisAnalysis()
            expect(seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(seq.indexKnotOrigin))).to.eql(OPEN_KNOT_SEQUENCE_ORIGIN)
            expect(seq.uMax).to.eql(0.4)
        });

        it('can revert the knot sequence for a uniform B-spline', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const seqRef = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            seq.revertKnotSequence();
            seq.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqRef.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqRef.multiplicities())
            
            const knots1: number [] = [-0.3, -0.2, -0.1, 0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            const seqRef1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            seq1.revertKnotSequence();
            seq1.revertKnotSequence();
            let i = 0;
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqRef1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE);
            }
            expect(seq1.multiplicities()).to.eql(seqRef1.multiplicities())
        });
    
        it('can revert the knot sequence for a non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0.3, 0.4, 0.5, 0.5, 0.8, 0.8, 0.8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const seqRef = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            seq.revertKnotSequence();
            seq.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqRef.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql(seqRef.multiplicities())
            const knots1: number [] = [0, 0, 0, 0.2, 0.2, 0.5, 0.8, 0.8, 0.8]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            const seqRef1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            seq1.revertKnotSequence();
            seq1.revertKnotSequence();
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqRef1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.multiplicities()).to.eql(seqRef1.multiplicities())
        });

        it('can get the order of multiplicity of a knot from its abscissa', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const distinctKnots = seq.distinctAbscissae();
            const knotMultiplities = seq.multiplicities();
            for(let i = 0; i < distinctKnots.length; i++) {
                expect(seq.knotMultiplicityAtAbscissa(distinctKnots[i])).to.eql(knotMultiplities[i])
            }
        });

        it('get an order of multiplicity 0 and a warning message when the abscissa does not coincide with a knot', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0)
            // const multiplicity = seq.knotMultiplicityAtAbscissa(0.1)
            // expect(() => seq.knotMultiplicityAtAbscissa(0.1)).to.eql(WM_ABSCISSA_NOT_FOUND_IN_SEQUENCE)
        });

        it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
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

        it('comparison with the former findSpan function devoted non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            let index = seq.findSpan(0.0)
            // compare with the findSpan function initially set up and devoted to non-uniform B-splines
            let indexCompare = findSpan(0.0, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.1)
            indexCompare = findSpan(0.1, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.5)
            indexCompare = findSpan(0.5, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.55)
            indexCompare = findSpan(0.55, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.6)
            indexCompare = findSpan(0.6, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.65)
            indexCompare = findSpan(0.65, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.7)
            indexCompare = findSpan(0.7, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(0.9)
            indexCompare = findSpan(0.9, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
            index = seq.findSpan(1.0)
            indexCompare = findSpan(1.0, knots, 3);
            expect(index.knotIndex).to.eql(indexCompare)
        });

        it('can find the span index in the knot sequence from an abscissa for an arbitrary B-spline', () => {
            const knots: number [] = [-0.5, -0.5, -0.5, 0.0, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            let lastAbscissa = seq.abscissaAtIndex(new KnotIndexIncreasingSequence(seq.length() - 1))
            const indexOrigin = seq.indexKnotOrigin
            const knotMultiplicityAtOrigin = seq.knotMultiplicity(indexOrigin)
            expect(seq.uMax).to.eql(lastAbscissa)
            let indexOffset = maxMultiplicityOrder - knotMultiplicityAtOrigin - 1;
            let indexOffset2 = indexOffset
            for(let i = indexOrigin.knotIndex; i < seq.distinctAbscissae().length; i++) {
                const abscissa = seq.distinctAbscissae()[i]
                let index = seq.findSpan(abscissa)
                if(i !== (seq.distinctAbscissae().length - 1)) indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa)
                expect(index.knotIndex).to.eql(indexOffset)
                if(i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2
                    index = seq.findSpan(abscissa1)
                    indexOffset2 = indexOffset2 + seq.knotMultiplicityAtAbscissa(abscissa)
                    expect(index.knotIndex).to.eql(indexOffset2)
                }
            }
            const knots1: number [] = [-0.5, -0.5, -0.5, 0.0, 0.6, 0.7, 0.7, 1, 2.0 ]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            expect(seq1.isKnotMultiplicityUniform).to.eql(false)
            expect(seq1.isKnotMultiplicityNonUniform).to.eql(false)
            let indexNormalizedBasisAtEnd = seq1.getKnotIndexNormalizedBasisAtSequenceEnd()
            expect(indexNormalizedBasisAtEnd.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceEnd.StrictlyNormalized)
            const lastIndex = indexNormalizedBasisAtEnd.knot
            lastAbscissa = seq1.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(lastIndex))
            expect(seq1.uMax).to.eql(lastAbscissa)
            const indexOrigin1 = seq1.indexKnotOrigin
            const knotMultiplicityAtOrigin1 = seq1.knotMultiplicity(indexOrigin1)
            let indexOffset1 = maxMultiplicityOrder - knotMultiplicityAtOrigin1 - 1;
            let indexOffset4 = indexOffset1
            for(let i = indexOrigin1.knotIndex; i < lastIndex.knotIndex; i++) {
                const abscissa = seq.distinctAbscissae()[i]
                let index = seq.findSpan(abscissa)
                if(i !== (seq.distinctAbscissae().length - 1)) indexOffset1 = indexOffset1 + seq.knotMultiplicityAtAbscissa(abscissa)
                expect(index.knotIndex).to.eql(indexOffset1)
                if(i < seq.distinctAbscissae().length - 1) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2
                    index = seq.findSpan(abscissa1)
                    indexOffset4 = indexOffset4 + seq.knotMultiplicityAtAbscissa(abscissa)
                    expect(index.knotIndex).to.eql(indexOffset4)
                }
            }
        });

        it('can find the span index in the knot sequence from an abscissa for a uniform B-spline', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.isKnotSpacingUniform).to.eql(true)
            expect(seq.isKnotMultiplicityUniform).to.eql(true)
            const indexNormalizedBasisAtEnd = seq.getKnotIndexNormalizedBasisAtSequenceEnd()
            expect(indexNormalizedBasisAtEnd.basisAtSeqExt).to.eql(NormalizedBasisAtSequenceEnd.StrictlyNormalized)
            const lastIndex = indexNormalizedBasisAtEnd.knot
            const lastAbscissa = seq.abscissaAtIndex(seq.toKnotIndexIncreasingSequence(lastIndex))
            expect(seq.uMax).to.eql(lastAbscissa)
            const indexOrigin = seq.indexKnotOrigin
            const knotMultiplicityAtOrigin = seq.knotMultiplicity(indexOrigin)
            let indexOffset = maxMultiplicityOrder - knotMultiplicityAtOrigin - 1;
            let indexOffset1 = indexOffset;
            for(let i = indexOrigin.knotIndex; i < lastIndex.knotIndex; i++) {
                const abscissa = seq.distinctAbscissae()[i]
                let index = seq.findSpan(abscissa)
                if(i !== lastIndex.knotIndex) indexOffset = indexOffset + seq.knotMultiplicityAtAbscissa(abscissa)
                expect(index.knotIndex).to.eql(indexOffset)
                if(i < lastIndex.knotIndex) {
                    const abscissa1 = (abscissa + seq.distinctAbscissae()[i + 1]) / 2
                    index = seq.findSpan(abscissa1)
                    indexOffset1 = indexOffset1 + seq.knotMultiplicityAtAbscissa(abscissa)
                    expect(index.knotIndex).to.eql(indexOffset1)
                }
            }
        });
    });

});