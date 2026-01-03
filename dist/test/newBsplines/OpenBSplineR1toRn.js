"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const OpenBSplineR1toRn_1 = require("../../src/newBsplines/OpenBSplineR1toRn");
const RealVectorSpace_1 = require("../../src/mathVector/RealVectorSpace");
const BSplineR1toRnConstructorInterface_1 = require("../../src/newBsplines/BSplineR1toRnConstructorInterface");
const KnotSequences_1 = require("../../src/namedConstants/KnotSequences");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const ControlPolygon_1 = require("../../src/newBsplines/ControlPolygon");
describe('OpenBSplineR1toRn', () => {
    it('can be initialized without an initializer', () => {
        const realVectorSpace2D = new RealVectorSpace_1.RealVectorSpace(2);
        const s0 = realVectorSpace2D.createVector([0, 0]);
        const s1 = realVectorSpace2D.createVector([1, 0]);
        const controlPolygon = new ControlPolygon_1.ControlPolygon([s0, s1]);
        const curve2D = new OpenBSplineR1toRn_1.OpenBSplineR1toRn({ type: BSplineR1toRnConstructorInterface_1.BSPL_CP_NO_KNOT, controlPoints: controlPolygon.vectorCollection });
        (0, chai_1.expect)(curve2D.vectorSpace).to.eql(BSplineR1toRn_1.VectorSpaceType.REAL);
        (0, chai_1.expect)(curve2D.curveOrigin).to.eql(KnotSequences_1.KNOT_SEQUENCE_ORIGIN);
        (0, chai_1.expect)(curve2D.spaceDimension).to.eql(2);
    });
});
