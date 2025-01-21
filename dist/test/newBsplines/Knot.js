"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Knot_1 = require("../../src/newBsplines/Knot");
var Knots_1 = require("../../src/ErrorMessages/Knots");
var Knots_2 = require("../../src/namedConstants/Knots");
describe('Knots', function () {
    describe('Knot constructor', function () {
        it('cannot be initialized with a multiplicity value smaller than one', function () {
            var abscissa = 0;
            var multiplicity = 0;
            chai_1.expect(function () { return new Knot_1.Knot(abscissa, multiplicity); }).to.throw(Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
        });
        it('cannot be initialized with an abscissa value equal to the default value', function () {
            var abscissa = Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE;
            var multiplicity = 0;
            chai_1.expect(function () { return new Knot_1.Knot(abscissa, multiplicity); }).to.throw(Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
        });
        it('can be initialized with a multiplicity value greater or equal to one', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(knot.multiplicity).to.eql(multiplicity);
        });
        it('can be initialized without prescribing a multiplicity value to a multiplicity of one', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa);
            chai_1.expect(knot.multiplicity).to.eql(multiplicity);
        });
        it('can be initialized with an abscissa with a value differing from the default one', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(knot.abscissa).to.eql(abscissa);
        });
        it('can be initialized without presciption of an abscissa and multiplicity', function () {
            var knot = new Knot_1.Knot();
            chai_1.expect(knot.abscissa).to.eql(Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE);
            chai_1.expect(knot.multiplicity).to.eql(Knots_2.DEFAULT_MULTIPLICITY_VALUE);
        });
    });
    describe('Accessors', function () {
        it('cannot set a knot abscissa value to the default value', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(function () { return knot.abscissa = Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE; }).to.throw(Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
        });
        it('cannot set a knot multiplicity value smaller than one', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(function () { return knot.multiplicity = 0; }).to.throw(Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
        });
        it('can set a knot abscissa value to a value distinct from the default value', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(knot.abscissa = 1).to.eql(knot.abscissa);
        });
        it('can set a knot multiplicity value to a value greater or equal to one', function () {
            var abscissa = 0;
            var multiplicity = 2;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(knot.multiplicity = 1).to.eql(knot.multiplicity);
        });
    });
    describe('Methods', function () {
        it('can increment the knot multiplicity by one as default', function () {
            var abscissa = 1;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            knot.incrementMultiplicity();
            chai_1.expect(knot.multiplicity).to.eql(2);
        });
        it('can increment the knot multiplicity with a value greater than one', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            knot.incrementMultiplicity(3);
            chai_1.expect(knot.multiplicity).to.eql(multiplicity + 3);
        });
        it('cannot increment the knot multiplicity with a value smaller than one', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(function () { return knot.incrementMultiplicity(0); }).to.throw(Knots_1.EM_KNOT_INCREMENT_DECREMENT);
        });
        it('cannot decrement the multiplicity of a knot if its multiplicity becomes smaller than one', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(function () { return knot.decrementMultiplicity(); }).to.throw(Knots_1.EM_KNOT_DECREMENT_KNOT_MULTIPLICITY);
        });
        it('can decrement the knot multiplicity by one as default', function () {
            var abscissa = 1;
            var multiplicity = 2;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            knot.decrementMultiplicity();
            chai_1.expect(knot.multiplicity).to.eql(1);
        });
        it('cannot decrement the knot multiplicity with a value smaller than one', function () {
            var abscissa = 0;
            var multiplicity = 1;
            var knot = new Knot_1.Knot(abscissa, multiplicity);
            chai_1.expect(function () { return knot.decrementMultiplicity(0); }).to.throw(Knots_1.EM_KNOT_INCREMENT_DECREMENT);
        });
    });
});
