import { expect } from 'chai';
import { EM_KNOT_INDEX_VALUE, KnotIndexIncreasingSequence, KnotIndexStrictlyIncreasingSequence } from '../../src/newBsplines/Knot';
import { IncreasingOpenKnotSequenceOpenCurve } from '../../src/newBsplines/IncreasingOpenKnotSequenceOpenCurve';
import { EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE, EM_MAXMULTIPLICITY_ORDER_KNOT, EM_MAXMULTIPLICITY_ORDER_SEQUENCE, EM_NON_INCREASING_KNOT_VALUES, EM_NULL_KNOT_SEQUENCE, EM_SEQUENCE_ORIGIN_REMOVAL, EM_SIZENORMALIZED_BSPLINEBASIS, KNOT_COINCIDENCE_TOLERANCE } from '../../src/newBsplines/AbstractKnotSequence';
import { findSpan } from '../../src/newBsplines/Piegl_Tiller_NURBS_Book';
import { INCREASINGOPENKNOTSEQUENCE, INCREASINGOPENKNOTSUBSEQUENCE, NO_KNOT_OPEN_CURVE, UNIFORM_OPENKNOTSEQUENCE, UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE } from '../../src/newBsplines/KnotSequenceConstructorInterface';
import { TOL_COMPARISON_CONTROLPTS_BSPL_R1TOR2 } from './BSplineR1toR2';
import { EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND, EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART } from '../../src/newBsplines/AbstractOpenKnotSequence';
import { EM_KNOTINDEX_INC_SEQ_NEGATIVE, EM_SIZE_KNOTSEQ_INCOMPATIBLE_SIZE_INTERNAL_STRICTLYINC_KNOTSEQ } from '../../src/newBsplines/AbstractIncreasingOpenKnotSequence';

export const COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF = 1.1;

describe('IncreasingOpenKnotSequenceOpenCurve', () => {

    describe('Constructor', () => {

        describe('NO_KNOT_OPEN_CURVE', () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type NO_KNOT_OPEN_CURVE', () => {
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

            it('can get the knot index of the curve origin with NO_KNOT_OPEN_CURVE initializer', () => {
                const maxMultiplicityOrder = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the properties of knot sequnence produced by NO_KNOT_OPEN_CURVE initializer', () => {
                const maxMultiplicityOrder = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            });

            it('can get the u interval upper bound with NO_KNOT_OPEN_CURVE initializer', () => {
                const maxMultiplicityOrder = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: NO_KNOT_OPEN_CURVE})
                const lastIndex = seq.length() - 1
                expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(0))).to.eql(0.0)
                expect(seq.abscissaAtIndex(new KnotIndexIncreasingSequence(lastIndex))).to.eql(1.0)
                expect(seq.uMax).to.eql(1.0)
            });
        });

        describe('UNIFORM_OPENKNOTSEQUENCE', () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type UNIFORM_OPENKNOTSEQUENCE', () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 2
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with a size of normalized B-spline basis smaller than the maximal multiplicity with UNIFORM_OPENKNOTSEQUENCE', () => {
                const maxMultiplicityOrder = 2
                const BsplBasisSize = 1
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a size of normalized B-spline basis with UNIFORM_OPENKNOTSEQUENCE initializer', () => {
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

            it('can get the knot index of the curve origin with UNIFORM_OPENKNOTSEQUENCE initializer', () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the u interval upper bound with UNIFORM_OPENKNOTSEQUENCE initializer', () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - 1)
            });

            it('can get the properties of knot sequnence produced by UNIFORM_OPENKNOTSEQUENCE initializer', () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 3
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORM_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(true)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(false)
            });
        });

        describe('UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE', () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than two for a constructor type UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE', () => {
                const maxMultiplicityOrder = 1
                const BsplBasisSize = 2
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot initialize a knot sequence with UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer if the basis dimension prescribed does not enable generating a normalized basis of B-Splines', () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 2;
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})).to.throw(EM_SIZENORMALIZED_BSPLINEBASIS)
            });

            it('can be initialized with a number of control points with UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
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

            it('can get the knot index of the curve origin with UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.indexKnotOrigin.knotIndex).to.eql(maxMultiplicityOrder - 1)
            });

            it('can get the u interval upper bound with UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4;
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.uMax).to.eql(BsplBasisSize - maxMultiplicityOrder + 1)
            });

            it('can get the properties of knot sequnence produced by UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE initializer', () => {
                const maxMultiplicityOrder = 3
                const BsplBasisSize = 4
                const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: UNIFORMLYSPREADINTERKNOTS_OPENKNOTSEQUENCE, BsplBasisSize: BsplBasisSize})
                expect(seq.isKnotSpacingUniform).to.eql(true)
                expect(seq.isKnotMultiplicityUniform).to.eql(false)
                expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            });
        });

        describe('INCREASINGOPENKNOTSEQUENCE', () => {
            it('cannot initialize a knot sequence with a maximal multiplicity order smaller than one for a constructor type INCREASINGOPENKNOTSEQUENCE', () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence with INCREASINGOPENKNOTSEQUENCE intializer', () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = []
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with INCREASINGOPENKNOTSEQUENCE', () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots1: number [] = [0, 0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots2: number [] = [0, 0, 0, 0.5, 2, 2, 2, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });
        
            it('cannot be initialized with a non increasing knot sequence with INCREASINGOPENKNOTSEQUENCE type constructor', () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0, 0, -0.5, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots2: number [] = [0, 0, 0, 1, 2, 3, 4, 4, 3.5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
            });

            it('cannot be initialized for non-uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with INCREASINGOPENKNOTSEQUENCE initializer', () => {
                const maxMultiplicityOrder = 3;
                let knots: number [] = [0, 0, 0, 0.5, 2, 3, 4, 5, 5, 5]
                const upperBound = knots.length;
                for(let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const knots1 = knots.slice();
                    for( let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i])
                    }
                    // to be added if maxMultiplicityOrder is effectively checked
                    // expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
                    knots = knots1.slice()
                }
            });
        
            it('cannot be initialized for uniform B-splines with an intermediate knot having a multiplicity equal to maxMultiplicityOrder with INCREASINGOPENKNOTSEQUENCE type constructor', () => {
                let knots: number [] = [-2, -1, 0, 0.5, 1, 2, 3, 4, 5, 6, 7]
                const maxMultiplicityOrder = 3;
                const upperBound = knots.length;
                for(let i = maxMultiplicityOrder; i < upperBound - maxMultiplicityOrder; i++) {
                    const knots1 = knots.slice();
                    for( let j = 1; j < maxMultiplicityOrder; j++) {
                        knots.splice(i, 0, knots[i])
                    }
                    // to be added if maxMultiplicityOrder is effectively checked
                    // expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_INTERMEDIATE_KNOT)
                    knots = knots1.slice()
                }
            });
        
            it("cannot be initialized with an initializer INCREASINGOPENKNOTSEQUENCE when knot multiplicities from the sequence start don't define a normalized basis", () => {
                const curveDegree = 3;
                const maxMultiplicityOrder = curveDegree + 1
                const knots = [-1, -1, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATSTART)
            });
        
            it("cannot be initialized with an initializer INCREASINGOPENKNOTSEQUENCE when knot multiplicities from the sequence end don't define a normalized basis", () => {
                const curveDegree = 3;
                const maxMultiplicityOrder = curveDegree + 1
                const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 2, 2 ]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw(EM_CUMULATIVE_KNOTMULTIPLICITY_ATEND)
            });

            describe('Initialization of knot sequences for non uniform B-splines', () => {
                it('can be initialized with an initializer INCREASINGOPENKNOTSEQUENCE. non uniform knot sequence of open curve without intermediate knots', () => {
                    const curveDegree = 3;
                    const maxMultiplicityOrder = curveDegree + 1
                    const knots = [0, 0, 0, 0, 1, 1, 1, 1 ]
                    const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
                    expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
                    const seq1: number[] = [];
                    for(const knot of seq) {
                        if(knot !== undefined) seq1.push(knot)
                    }
                    expect(seq1).to.eql(knots)
                });
    
                it('can check the initializer INCREASINGOPENKNOTSEQUENCE for consistency of the knot sequence and knot multiplicities', () => {
                    const curveDegree = 3;
                    const maxMultiplicityOrder = curveDegree + 1
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
    
                it('can be initialized with an initializer INCREASINGOPENKNOTSEQUENCE. non uniform knot sequence of open curve with intermediate knots', () => {
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
                it('can be initialized with an initializer INCREASINGOPENKNOTSEQUENCE. non uniform knot sequence of open curve without intermediate knots', () => {
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

        describe('INCREASINGOPENKNOTSUBSEQUENCE', () => {
            it('cannot initialize a knot sub sequence with a maximal multiplicity order smaller than one for a constructor type INCREASINGOPENKNOTSUBSEQUENCE', () => {
                const maxMultiplicityOrder = 0
                const knots: number [] = [0, 1]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSUBSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_SEQUENCE)
            });

            it('cannot be initialized with a null knot sequence with INCREASINGOPENKNOTSUBSEQUENCE intializer', () => {
                const maxMultiplicityOrder = 3
                const knots: number [] = []
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSUBSEQUENCE, knots: knots})).to.throw(EM_NULL_KNOT_SEQUENCE)
            });

            it('cannot be initialized with a knot having a multiplicity larger than maxMultiplicityOrder with INCREASINGOPENKNOTSUBSEQUENCE', () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0.5, 2, 3, 4, 5, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSUBSEQUENCE, knots: knots})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots1: number [] = [0, 0, 0, 0, 0.5, 2, 3, 4, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSUBSEQUENCE, knots: knots1})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
                const knots2: number [] = [0, 0.5, 2, 2, 2, 2, 3, 4, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSUBSEQUENCE, knots: knots2})).to.throw(EM_MAXMULTIPLICITY_ORDER_KNOT)
            });
        
            it('cannot be initialized with a non increasing knot sequence with INCREASINGOPENKNOTSUBSEQUENCE type constructor', () => {
                const maxMultiplicityOrder = 3;
                const knots: number [] = [0, 0, -0.5, 2, 3, 4, 5, 5, 5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSUBSEQUENCE, knots: knots})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots1: number [] = [-2, -2.5, 0, 1, 2, 3, 4]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSUBSEQUENCE, knots: knots1})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
                const knots2: number [] = [0, 0, 1, 2, 3, 4, 4, 3.5]
                expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSUBSEQUENCE, knots: knots2})).to.throw(EM_NON_INCREASING_KNOT_VALUES)
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

    });

    describe('Methods', () => {
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

        it('can clone the knot sequence', () => {
            const maxMultiplicityOrder = 4
            const knots = [0, 0, 0, 0, 1, 1, 1.5, 2, 2, 2, 2]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const seq1 = seq.clone()
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
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
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

        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of non uniform knot sequence', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 0, 0, 0, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const increasingSeq = seq.toStrictlyIncreasingKnotSequence();
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissa: number[] = []
            const multiplicity: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    abscissa.push(knot.abscissa)
                    multiplicity.push(knot.multiplicity)
                }
            }
            expect(abscissa).to.eql([0, 1])
            expect(multiplicity).to.eql([4, 4])
        });
    
        it('can convert an increasing sequence to a strictly increasing knot sequence. Case of arbitrary knot sequence', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [-2, -1, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const increasingSeq = seq.toStrictlyIncreasingKnotSequence();
            expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            const abscissa: number[] = []
            const multiplicity: number[] = []
            for(const knot of increasingSeq) {
                if(knot !== undefined) {
                    abscissa.push(knot.abscissa)
                    multiplicity.push(knot.multiplicity)
                }
            }
            expect(abscissa).to.eql([-2, -1, 0, 0.5, 0.6, 0.7, 1])
            expect(multiplicity).to.eql([1, 1, 2, 1, 1, 2, 4])
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

        it('cannot insert a new knot in the knot sequence if the new knot abscissa is identical to an existing one', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.insertKnot(0.5, 3)).to.eql(false)
        });
    
        it('cannot insert a new knot in the knot sequence if the new knot multiplicity is greater than maxMultiplicityOrder', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(() => seq.insertKnot(0.3, 5)).to.throw()
        });

        it('can insert a new knot in the knot sequence if the new knot abscissa is distinct from the existing ones', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.insertKnot(0.3, 3)).to.eql(true)
            expect(seq.distinctAbscissae()).to.eql([0, 0.3, 0.5, 0.6, 0.7, 1])
            expect(seq.multiplicities()).to.eql([4, 3, 1, 1, 2, 4])
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq1.insertKnot(-0.1, 1)).to.eql(true)
            expect(seq1.distinctAbscissae()).to.eql([-0.1, 0, 0.5, 0.6, 0.7, 1])
            expect(seq1.multiplicities()).to.eql([1, 4, 1, 1, 2, 4])
            const seq2 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq2.insertKnot(1.2, 2)).to.eql(true)
            expect(seq2.distinctAbscissae()).to.eql([0, 0.5, 0.6, 0.7, 1, 1.2])
            expect(seq2.multiplicities()).to.eql([4, 1, 1, 2, 4, 2])
        });

        it('can get the knot abscissa from a sequence index', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            let index = new KnotIndexIncreasingSequence(0);
            let abscissa = seq.abscissaAtIndex(index)
            expect(abscissa).to.eql(0.0)
            index = new KnotIndexIncreasingSequence(3);
            abscissa = seq.abscissaAtIndex(index)
            expect(abscissa).to.eql(0.0)
            index = new KnotIndexIncreasingSequence(4);
            abscissa = seq.abscissaAtIndex(index)
            expect(abscissa).to.eql(0.5)
            index = new KnotIndexIncreasingSequence(11);
            abscissa = seq.abscissaAtIndex(index)
            expect(abscissa).to.eql(1.0)
        });

        it('can get the knot multiplicity from a sequence index', () => {
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const knots = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
            let index = new KnotIndexIncreasingSequence(0);
            let indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            let multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
            expect(multiplicity).to.eql(4)
            index = new KnotIndexIncreasingSequence(3);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
            expect(multiplicity).to.eql(4)
            index = new KnotIndexIncreasingSequence(4);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
            expect(multiplicity).to.eql(1)
            index = new KnotIndexIncreasingSequence(11);
            indexStrictlyIncSeq = seq.toKnotIndexStrictlyIncreasingSequence(index);
            multiplicity = seq.knotMultiplicity(indexStrictlyIncSeq)
            expect(multiplicity).to.eql(4)
        });
    
        it('cannot extract a subset of an increasing knot sequence when indices are out of range', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.uMax).to.eql(0.5)
            let Istart = 0
            let Iend = Istart
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.not.throw()
            Istart = 6
            Iend = 5
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw()
            Iend = seq.distinctAbscissae().length
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw()
            Istart = -1
            Iend = seq.distinctAbscissae().length - 1
            expect(() => seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(Istart), new KnotIndexIncreasingSequence(Iend))).to.throw()
        });
        
        it('can extract a subset of an increasing knot sequence of a uniform B-spline', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.uMax).to.eql(0.5)
            const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(6))
            expect(subseq).to.eql([0, 0.1, 0.2, 0.3])
            const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(5), new KnotIndexIncreasingSequence(8))
            expect(subseq1).to.eql([0.2, 0.3, 0.4, 0.5])
            const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(8), new KnotIndexIncreasingSequence(11))
            expect(subseq2).to.eql([0.5, 0.6, 0.7, 0.8])
        });
    
        it('can extract a subset of an increasing knot sequence of a non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 1, 1, 1, 1]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const subseq = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(1), new KnotIndexIncreasingSequence(3))
            expect(subseq).to.eql([0, 0, 0])
            const subseq1 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(2), new KnotIndexIncreasingSequence(4))
            expect(subseq1).to.eql([0, 0, 1])
            const subseq2 = seq.extractSubsetOfAbscissae(new KnotIndexIncreasingSequence(3), new KnotIndexIncreasingSequence(5))
            expect(subseq2).to.eql([0, 1, 1])
        });

        it('cannot raise the multiplicity of an existing knot to more than (maxMultiplicityOrder - 1)', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const index = seq.findSpan(0.2)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            const mult = 3
            // to be added if maxMultiplicityOrder is checked at intermediate knots
            // expect(() => seq.raiseKnotMultiplicity(indexStrictInc, mult)).to.throw()
        });
    
        it('can raise the multiplicity of an existing knot', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const index = seq.findSpan(0.2)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            seq.raiseKnotMultiplicity(indexStrictInc, 1)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            // to be added if maxMultiplicityOrder is checked at intermediate knots
            // expect(() => seq.raiseKnotMultiplicity(indexStrictInc, 2)).to.throw()
        });

        it('cannot decrement the multiplicity of a knot when the knot index is out of range', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const seqStrInc = seq.toStrictlyIncreasingKnotSequence()
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(-1))).to.throw(EM_KNOT_INDEX_VALUE)
            expect(() => seq.decrementKnotMultiplicity(new KnotIndexStrictlyIncreasingSequence(seqStrInc.length()))).to.throw(EM_KNOTINDEX_STRICTLY_INCREASING_SEQ_OUT_RANGE)
        });

        it('cannot decrement the multiplicity of an existing knot when the knot multiplicity is one and the knot removed is the origin of the knot sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const indexKnotOrigin = seq.indexKnotOrigin;
            expect(() => seq.decrementKnotMultiplicity(indexKnotOrigin)).to.throw(EM_SEQUENCE_ORIGIN_REMOVAL)
        });

        it('can decrement the multiplicity of an existing knot when its multiplicity is greater than one', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const abscissa = 0.2
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            seq.decrementKnotMultiplicity(indexStrictInc)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
            expect(seq.length()).to.eql(12)
        });

        it('can decrement the multiplicity of an existing knot and remove it when its multiplicity equals one', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const abscissa = 0.3
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(seq.length()).to.eql(13)
            seq.decrementKnotMultiplicity(indexStrictInc)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1])
            expect(seq.distinctAbscissae()).to.eql([-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8])
            expect(seq.length()).to.eql(12)
            expect(seq.isKnotlMultiplicityZero(abscissa)).to.eql(true)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot spacing property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const abscissa = 0.3
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(seq.isKnotSpacingUniform).to.eql(true)
            seq.decrementKnotMultiplicity(indexStrictInc)
            expect(seq.isKnotSpacingUniform).to.eql(false)
        });

        it('can decrement the multiplicity of an existing knot and get updated knot multiplicity uniformity property of the sequence', () => {
            const knots: number [] = [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const abscissa = 0.2
            const index = seq.findSpan(abscissa)
            const indexStrictInc = seq.toKnotIndexStrictlyIncreasingSequence(index)
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1])
            expect(seq.isKnotMultiplicityUniform).to.eql(false)
            seq.decrementKnotMultiplicity(indexStrictInc)
            expect(seq.isKnotSpacingUniform).to.eql(true)
        });

        it('can decrement the multiplicity of an existing knot and get updated non uniform knot multiplicity property of the sequence', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.2, 0.3, 0.4, 0.8, 0.8, 0.8, 0.8]
            const maxMultiplicityOrder = 4
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const seqStrInc = seq.toStrictlyIncreasingKnotSequence()
            const indexStrictInc = new KnotIndexStrictlyIncreasingSequence(seqStrInc.length() - 1)
            expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 4])
            expect(seq.isKnotMultiplicityNonUniform).to.eql(true)
            seq.decrementKnotMultiplicity(indexStrictInc)
            expect(seq.isKnotSpacingUniform).to.eql(false)
            expect(seq.multiplicities()).to.eql([4, 1, 2, 1, 1, 3])
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
                expect(seq.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
            
            const knots1: number [] = [-0.3, -0.2, -0.1, 0, 0.05, 0.2, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            const knots2 = [-0.3, -0.2, -0.1, 0, 0.1, 0.15, 0.3, 0.45, 0.5, 0.6, 0.7, 0.8]
            const seqRef1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})
            seq1.revertKnotSequence();
            let i = 0;
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqRef1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE);
            }
            expect(seq1.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        });
    
        it('can revert the knot sequence for a non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0.3, 0.4, 0.5, 0.8, 0.8, 0.8]
            const maxMultiplicityOrder = 3
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            const seqRef = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            seq.revertKnotSequence();
            for(let i = 0; i < seq.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqRef.abscissaAtIndex(index)).to.be.closeTo(seq.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq.multiplicities()).to.eql([3, 1, 1, 1, 3])
            const knots1: number [] = [0, 0, 0, 0.2, 0.5, 0.5, 0.8, 0.8, 0.8]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            const knots2 = [0, 0, 0, 0.3, 0.3, 0.6, 0.8, 0.8, 0.8]
            const seqRef1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots2})
            seq1.revertKnotSequence();
            for(let i = 0; i < seq1.length(); i++) {
                const index = new KnotIndexIncreasingSequence(i);
                expect(seqRef1.abscissaAtIndex(index)).to.be.closeTo(seq1.abscissaAtIndex(index), KNOT_COINCIDENCE_TOLERANCE)
            }
            expect(seq1.multiplicities()).to.eql([3, 2, 1, 3])
        });

        it('can get the order of multiplicity of a knot from its abscissa', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.knotMultiplicityAtAbscissa(0)).to.eql(4)
            expect(seq.knotMultiplicityAtAbscissa(0.5)).to.eql(1)
            expect(seq.knotMultiplicityAtAbscissa(0.7)).to.eql(2)
            expect(seq.knotMultiplicityAtAbscissa(1)).to.eql(4)
            expect(seq.knotMultiplicityAtAbscissa(0.1)).to.eql(0)
        });

        it('can find the span index in the knot sequence from an abscissa for a non uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            let index = seq.findSpan(0.0)
            expect(index.knotIndex).to.eql(3)
            index = seq.findSpan(0.1)
            expect(index.knotIndex).to.eql(3)
            index = seq.findSpan(0.5)
            expect(index.knotIndex).to.eql(4)
            index = seq.findSpan(0.55)
            expect(index.knotIndex).to.eql(4)
            index = seq.findSpan(0.6)
            expect(index.knotIndex).to.eql(5)
            index = seq.findSpan(0.65)
            expect(index.knotIndex).to.eql(5)
            index = seq.findSpan(0.7)
            expect(index.knotIndex).to.eql(7)
            index = seq.findSpan(0.9)
            expect(index.knotIndex).to.eql(7)
            index = seq.findSpan(1.0)
            expect(index.knotIndex).to.eql(7)
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
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.uMax).to.eql(1)
            let index = seq.findSpan(0.0)
            expect(index.knotIndex).to.eql(3)
            index = seq.findSpan(1.0)
            expect(index.knotIndex).to.eql(6)
            const knots1: number [] = [-0.5, -0.5, -0.5, 0.0, 0.6, 0.7, 0.7, 1, 2.0 ]
            const seq1 = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots1})
            expect(seq1.uMax).to.eql(0.7)
            let index1 = seq1.findSpan(0.0)
            expect(index1.knotIndex).to.eql(3)
            index1 = seq1.findSpan(0.7)
            expect(index1.knotIndex).to.eql(6)
        });

        it('can find the span index in the knot sequence from an abscissa for a uniform B-spline', () => {
            const knots: number [] = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
            const curveDegree = 3;
            const maxMultiplicityOrder = curveDegree + 1
            const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
            expect(seq.uMax).to.eql(0.5)
            let index = seq.findSpan(0.0)
            expect(index.knotIndex).to.eql(3)
            index = seq.findSpan(0.05)
            expect(index.knotIndex).to.eql(3)
            index = seq.findSpan(0.1)
            expect(index.knotIndex).to.eql(4)
            index = seq.findSpan(0.4)
            expect(index.knotIndex).to.eql(7)
            index = seq.findSpan(0.45)
            expect(index.knotIndex).to.eql(7)
            index = seq.findSpan(0.5)
            expect(index.knotIndex).to.eql(8)
        });
    });


    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at the first knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
    });

    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at the last knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
    });

    it('cannot be initialized with a knot sequence containing a multiplicity greater than degree + 1 at an intermediate knot', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        expect(() => new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})).to.throw()
    });


    it('can get the maximal multiplicity order associated with a knot sequence', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        const curveDegree = 3;
        const maxMultiplicityOrder = curveDegree + 1
        const seq = new IncreasingOpenKnotSequenceOpenCurve(maxMultiplicityOrder, {type: INCREASINGOPENKNOTSEQUENCE, knots: knots})
        expect(seq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder)
    });

});