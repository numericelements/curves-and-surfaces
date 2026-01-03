"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Knot_1 = require("../../src/newBsplines/Knot");
const Knots_1 = require("../../src/ErrorMessages/Knots");
const Knots_2 = require("../../src/namedConstants/Knots");
describe('Knots', () => {
    describe('Knot constructor', () => {
        it('cannot be initialized with a multiplicity value smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 0;
            (0, chai_1.expect)(() => new Knot_1.Knot(abscissa, multiplicity)).to.throw(Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
        });
        it('cannot be initialized with an abscissa value equal to the default value', () => {
            const abscissa = Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE;
            const multiplicity = 0;
            (0, chai_1.expect)(() => new Knot_1.Knot(abscissa, multiplicity)).to.throw(Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
        });
        it('can be initialized with a multiplicity value greater or equal to one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(knot.multiplicity).to.eql(multiplicity);
        });
        it('can be initialized without prescribing a multiplicity value to a multiplicity of one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa);
            (0, chai_1.expect)(knot.multiplicity).to.eql(multiplicity);
        });
        it('can be initialized with an abscissa with a value differing from the default one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(knot.abscissa).to.eql(abscissa);
        });
        it('can be initialized without presciption of an abscissa and multiplicity', () => {
            const knot = new Knot_1.Knot();
            (0, chai_1.expect)(knot.abscissa).to.eql(Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE);
            (0, chai_1.expect)(knot.multiplicity).to.eql(Knots_2.DEFAULT_MULTIPLICITY_VALUE);
        });
    });
    describe('Accessors', () => {
        it('cannot set a knot abscissa value to the default value', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(() => knot.abscissa = Knots_2.DEFAULT_KNOT_ABSCISSA_VALUE).to.throw(Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_ABSCISSA);
        });
        it('cannot set a knot multiplicity value smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(() => knot.multiplicity = 0).to.throw(Knots_1.EM_KNOT_CONSTRUCTOR_KNOT_MULTIPLICITY);
        });
        it('can set a knot abscissa value to a value distinct from the default value', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(knot.abscissa = 1).to.eql(knot.abscissa);
        });
        it('can set a knot multiplicity value to a value greater or equal to one', () => {
            const abscissa = 0;
            const multiplicity = 2;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(knot.multiplicity = 1).to.eql(knot.multiplicity);
        });
    });
    describe('Methods', () => {
        it('can increment the knot multiplicity by one as default', () => {
            const abscissa = 1;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            knot.incrementMultiplicity();
            (0, chai_1.expect)(knot.multiplicity).to.eql(2);
        });
        it('can increment the knot multiplicity with a value greater than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            knot.incrementMultiplicity(3);
            (0, chai_1.expect)(knot.multiplicity).to.eql(multiplicity + 3);
        });
        it('cannot increment the knot multiplicity with a value smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(() => knot.incrementMultiplicity(0)).to.throw(Knots_1.EM_KNOT_INCREMENT_DECREMENT);
        });
        it('cannot decrement the multiplicity of a knot if its multiplicity becomes smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(() => knot.decrementMultiplicity()).to.throw(Knots_1.EM_KNOT_DECREMENT_KNOT_MULTIPLICITY);
        });
        it('can decrement the knot multiplicity by one as default', () => {
            const abscissa = 1;
            const multiplicity = 2;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            knot.decrementMultiplicity();
            (0, chai_1.expect)(knot.multiplicity).to.eql(1);
        });
        it('cannot decrement the knot multiplicity with a value smaller than one', () => {
            const abscissa = 0;
            const multiplicity = 1;
            const knot = new Knot_1.Knot(abscissa, multiplicity);
            (0, chai_1.expect)(() => knot.decrementMultiplicity(0)).to.throw(Knots_1.EM_KNOT_INCREMENT_DECREMENT);
        });
    });
});
