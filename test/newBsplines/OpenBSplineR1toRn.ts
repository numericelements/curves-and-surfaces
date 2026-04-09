import { expect } from "chai";
import { OpenBSplineR1toRn } from "../../src/newBsplines/OpenBSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { BSPL_CP_NO_KNOT, BSpline_CP, ControlPoints } from "../../src/newBsplines/BSplineR1toRnConstructorInterface";
import { KNOT_SEQUENCE_ORIGIN } from "../../src/namedConstants/KnotSequences";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ControlPolygonFromDescriptors } from "../../src/newBsplines/ControlPolygonFromDescriptors";
import { Vector2DReal } from "../../src/mathVector/Vector2DReal";
import { ControlPolygon, createControlPolygon } from "../../src/newBsplines/ControlPolygon";
import { createOpenBSplineFromParams } from "../../src/newBsplines/OpenBSplineFactory";
import { RealVector2D } from "../../src/mathVector/VectorDescriptorConstructorInterface";
import { Vector1DComplex } from "../../src/mathVector/Vector1DComplex";

describe('OpenBSplineR1toRn', () => {
    
    it('can be initialized without an initializer', () => {
        const vertex1 = new Vector2DReal(0, 0);
        const vertex2 = new Vector2DReal(1, 1);
        const controlPolygon = new ControlPolygon([vertex1, vertex2]);
        const params: BSpline_CP = {
            type: BSPL_CP_NO_KNOT,
            controlPoints: controlPolygon
        }
        const curve2D = createOpenBSplineFromParams(params);
        expect(curve2D.vectorSpace).to.eql(VectorSpaceType.REAL)
        expect(curve2D.curveOrigin).to.eql(KNOT_SEQUENCE_ORIGIN)
        expect(curve2D.spaceDimension).to.eql(2)
    });

    it('can evaluate a curve into a real vector space at a point', () => {
        const vertex1 = new Vector2DReal(0, 0);
        const vertex2 = new Vector2DReal(1, 1);
        const controlPolygon = new ControlPolygon([vertex1, vertex2]);
        const controlPolygon1 = createControlPolygon([vertex1, vertex2]);
        const params: BSpline_CP = {
            type: BSPL_CP_NO_KNOT,
            controlPoints: controlPolygon
        }
        const curve2D = createOpenBSplineFromParams(params);
        const point = curve2D.evaluate(0.5);
        expect(point.coordinates[0]).to.be.closeTo(0.5, 1e-10);
        expect(point.coordinates[1]).to.be.closeTo(0.5, 1e-10);
        const point1 = curve2D.evaluate(0.75);
    });

    it('can evaluate a curve into a complex vector space at a point', () => {
        const vertex1 = new Vector1DComplex(0, 0);
        const vertex2 = new Vector1DComplex(1, 1);
        const controlPolygon = createControlPolygon([vertex1, vertex2]);
        const params = {
            type: BSPL_CP_NO_KNOT,
            controlPoints: controlPolygon
        }
        const curve2D = createOpenBSplineFromParams(params);
        const point = curve2D.evaluate(0.5);
        const coord1 = point.getCoordinate(0);
        expect(coord1.real).to.be.closeTo(0.5, 1e-10);
        expect(coord1.imaginary).to.be.closeTo(0.5, 1e-10);
        const point1 = curve2D.evaluate(0.75);
    });

});