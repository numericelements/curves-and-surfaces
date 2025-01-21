"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
var fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC");
var KnotSequences_1 = require("../../../src/ErrorMessages/KnotSequences");
describe('Generation of a strictly increasing open knot sequence of a closed curve from input parameters describing the periodic knots of the sequence', function () {
    it('Can create a strictly increasing open knot sequence of closed curve from input parameters. Case of uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1, 2, 3, 4, 5];
        var multiplicities = [1, 1, 1, 1, 1, 1];
        var strIncSeq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(strIncSeq.distinctAbscissae()).to.eql([-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]);
        chai_1.expect(strIncSeq.multiplicities()).to.eql([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
    });
    it('Can create a strictly increasing open knot sequence of closed curve from input parameters. Case of non uniform knot sequence with constructor type ' + KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 1];
        var multiplicities = [4, 4];
        var strIncSeq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(strIncSeq.maxMultiplicityOrder).to.eql(maxMultiplicityOrder);
        chai_1.expect(strIncSeq.distinctAbscissae()).to.eql([0, 1]);
        chai_1.expect(strIncSeq.multiplicities()).to.eql([4, 4]);
    });
    it('Cannot create an increasing open knot sequence of closed curves from input parameters with an intermediate knot having maxMultiplicityOrder with constructor type ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVE, function () {
        var maxMultiplicityOrder = 4;
        var periodicKnots = [0, 0.5, 1];
        var multiplicities = [3, 4, 3];
        chai_1.expect(function () { return fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities }); }).to.throw(KnotSequences_1.EM_MAXMULTIPLICITY_ORDER_KNOT);
    });
    it('generates an increasing knot sequence without C0 discontinuity property', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
        var multiplicities = [2, 1, 1, 2, 2];
        var seq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
    });
    it('generates an increasing knot sequence considering property about uniform knot spacing.', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 0.5, 0.6, 0.7, 1];
        var multiplicities = [2, 1, 1, 2, 2];
        var seq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(false);
    });
    it('generates an increasing knot sequence considering property about non uniform knot multiplicity of closed curves that is always set to false.', function () {
        var maxMultiplicityOrder = 3;
        var periodicKnots = [0, 1];
        var multiplicities = [3, 3];
        var seq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
    });
    it('generates an increasing knot sequence considering property about uniform knot multiplicity of closed curves.', function () {
        var maxMultiplicityOrder = 2;
        var periodicKnots = [0, 1, 2, 3, 4, 5, 6];
        var multiplicities = [1, 1, 1, 1, 1, 1, 1];
        var seq = fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC_1.fromInputParametersToStrictlyIncreasingOpenKnotSequenceCC(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.STRICTLYINCREASINGOPENKNOTSEQUENCECLOSEDCURVE, periodicKnots: periodicKnots, multiplicities: multiplicities });
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
    });
});
