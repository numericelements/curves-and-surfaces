import { expect } from "chai";
import { OpenBSplineR1toRn } from "../../src/newBsplines/OpenBSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { BSPL_CP_NO_KNOT, ControlPoints } from "../../src/newBsplines/BSplineR1toRnConstructorInterface";
import { KNOT_SEQUENCE_ORIGIN } from "../../src/namedConstants/KnotSequences";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ControlPolygon } from "../../src/newBsplines/ControlPolygon";

describe('OpenBSplineR1toRn', () => {
    
    it('can be initialized without an initializer', () => {
        const realVectorSpace2D = new RealVectorSpace(2);
        const s0 = realVectorSpace2D.createVector([0, 0]);
        const s1 = realVectorSpace2D.createVector([1, 0]);
        const controlPolygon = new ControlPolygon([s0, s1]);
        const curve2D = new OpenBSplineR1toRn({type: BSPL_CP_NO_KNOT, controlPoints: controlPolygon.vectorCollection});
        expect(curve2D.vectorSpace).to.eql(VectorSpaceType.REAL)
        expect(curve2D.curveOrigin).to.eql(KNOT_SEQUENCE_ORIGIN)
        expect(curve2D.spaceDimension).to.eql(2)
    });
});