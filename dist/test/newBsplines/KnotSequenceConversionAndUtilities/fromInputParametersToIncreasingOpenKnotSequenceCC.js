"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var fromInputParametersToIncreasingOpenKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromInputParametersToIncreasingOpenKnotSequenceCC");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
var KnotSequences_1 = require("../../../src/ErrorMessages/KnotSequences");
describe('Generation of an increasing open knot sequence of a closed curve from input parameters describing the periodic knots of the sequence', function () {
    it('Can create an increasing open knot sequence of closed curves from input parameters. Case of uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1, 2, 3, 4, 5];
        var increasingSeq = fromInputParametersToIncreasingOpenKnotSequenceCC_1.fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(increasingSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
        chai_1.expect(increasingSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
    it('Can create an increasing open knot sequence of closed curves from input parameters. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 0, 0, 0, 1, 1, 1, 1];
        var increasingSeq = fromInputParametersToIncreasingOpenKnotSequenceCC_1.fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        chai_1.expect(increasingSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(increasingSeq.distinctAbscissae()).to.eql([0, 1]);
        chai_1.expect(increasingSeq.multiplicities()).to.eql([4, 4]);
    });
    it('Cannot create an increasing open knot sequence of closed curves from input parameters with an intermediate knot having maxMultiplicityOrder with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 0, 0, 0.5, 0.5, 0.5, 0.5, 1, 1, 1];
        chai_1.expect(function () { return fromInputParametersToIncreasingOpenKnotSequenceCC_1.fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
    });
    it('generates an increasing knot sequence without C0 discontinuity property', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1];
        var seq = fromInputParametersToIncreasingOpenKnotSequenceCC_1.fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('generates an increasing knot sequence considering property about uniform knot spacing.', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1];
        var seq = fromInputParametersToIncreasingOpenKnotSequenceCC_1.fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
    });
    it('generates an increasing knot sequence considering property about non uniform knot multiplicity of closed curves that is always set to false.', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 0, 0, 1, 1, 1];
        var seq = fromInputParametersToIncreasingOpenKnotSequenceCC_1.fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('generates an increasing knot sequence considering property about uniform knot multiplicity of closed curves.', function () {
        var maxMultiplicityOrder = 2;
        var periodicKnots = [0, 1, 2, 3, 4, 5, 6];
        var seq = fromInputParametersToIncreasingOpenKnotSequenceCC_1.fromInputParametersToIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots });
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
    });
});
