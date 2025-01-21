"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var IncreasingOpenKnotSequenceClosedCurve_1 = require("../../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve");
var fromIncreasingOpentoIncreasingPeriodicKnotSequence_1 = require("../../../src/newBsplines/KnotSequenceAndUtilities/fromIncreasingOpentoIncreasingPeriodicKnotSequence");
var KnotSequenceConstructorInterface_1 = require("../../../src/newBsplines/KnotSequenceConstructorInterface");
var KnotSequences_1 = require("../../../src/ErrorMessages/KnotSequences");
describe('Conversions from an increasing open knot sequence of a closed curve to an increasing periodic knot sequence of a closed curve', function () {
    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with maximal multiplicity at curve origin and type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var knots = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(pSeq.length()).to.eql(seq.periodicKnots.length);
        chai_1.expect(pSeq.allAbscissae).to.eql(seq.periodicKnots);
    });
    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with maximal multiplicity at curve origin and type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
        var knots = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        var pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(pSeq.length()).to.eql(seq.periodicKnots.length);
        chai_1.expect(pSeq.allAbscissae).to.eql(seq.periodicKnots);
    });
    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with uniform multiplicity one and type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        var pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(pSeq.length()).to.eql(seq.periodicKnots.length);
        chai_1.expect(pSeq.allAbscissae).to.eql(seq.periodicKnots);
    });
    it('can convert the knot sequence to a periodic knot sequence. Initial knot sequence with uniform multiplicity one and type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        var pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(pSeq.length()).to.eql(seq.periodicKnots.length);
        chai_1.expect(pSeq.allAbscissae).to.eql(seq.periodicKnots);
    });
    it('cannot convert the knot sequence to a periodic knot sequence if containing extreme knots with multiplicity maxMultiplicity with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
        var knots = [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 7];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        chai_1.expect(function () { return fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION);
    });
    it('cannot convert the knot sequence to a periodic knot sequence if it contains a knot with multiplicity maxMultiplicity with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, function () {
        var knots = [-2, -1, 0, 1, 2, 3, 3, 3, 4, 5, 6, 7, 8, 9];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCE_UPTOC0DISCONTINUITY_CLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(true);
        chai_1.expect(function () { return fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq); }).to.throw(KnotSequences_1.EM_KNOT_MULTIPLICITY_TOO_LARGE_FOR_CONVERSION);
    });
    it('preserves the uniform knot spacing of the knot sequence when converting to a periodic knot sequence with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var knots = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        chai_1.expect(seq.isKnotSpacingUniform).to.eql(true);
        var pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(pSeq.isKnotSpacingUniform).to.eql(true);
    });
    it('preserves the uniform knot multiplicity of the knot sequence when converting to a periodic knot sequence with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var knots = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        chai_1.expect(seq.isKnotMultiplicityUniform).to.eql(true);
        var pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(pSeq.isKnotMultiplicityUniform).to.eql(true);
    });
    it('cannot propagate the non uniform knot multiplicity of a knot sequence to a periodic knot sequence. Initial knot sequence cannot have non uniform multiplicity property with type constructor ' + KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, function () {
        var knots = [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
        var maxMultiplicityOrder = 3;
        var seq = new IncreasingOpenKnotSequenceClosedCurve_1.IncreasingOpenKnotSequenceClosedCurve(maxMultiplicityOrder, { type: KnotSequenceConstructorInterface_1.INCREASINGOPENKNOTSEQUENCECLOSEDCURVEALLKNOTS, knots: knots });
        chai_1.expect(seq.isSequenceUpToC0Discontinuity).to.eql(false);
        chai_1.expect(seq.isKnotMultiplicityNonUniform).to.eql(false);
        var pSeq = fromIncreasingOpentoIncreasingPeriodicKnotSequence_1.fromIncreasingOpentoIncreasingPeriodicKnotSequence(seq);
        chai_1.expect(pSeq.isKnotMultiplicityNonUniform).to.eql(false);
    });
});
