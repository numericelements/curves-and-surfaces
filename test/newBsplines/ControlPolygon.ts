import { expect } from "chai";
import { ControlPolygon } from "../../src/newBsplines/ControlPolygon";
import { Vector2DTypeReal } from "../../src/mathVector/Vector2DTypeReal";
import { REALVECTOR1D } from "../../src/namedConstants/VectorTypeTags";
import { Vector1DTypeReal } from "../../src/mathVector/Vector1DTypeReal";
import { IRealVector } from "../../src/mathVector/Vector";

describe('Control polygon of vectors of same type and dimension', () => {
    describe('Constructor', () => {

        it(`can generate a control polygon with only one vector`, () => {
            const realV2D = new Vector2DTypeReal(1, 2);
            const cPolygon = new ControlPolygon(realV2D);
            expect(cPolygon.length).to.eql(1);
            expect(cPolygon.vectorSpace).to.eql(realV2D.vectorSpace);
            expect(cPolygon.spaceDimension).to.eql(realV2D.dimension);
            expect(cPolygon.weightManagement).to.eql(undefined);
        });

        it(`can generate a control polygon with an array of vectors belonging to the same vector space with vectors ${REALVECTOR1D}`, () => {
            const realV1D1 = new Vector1DTypeReal(1);
            const realV1D2 = new Vector1DTypeReal(-1);
            const realV1D = [realV1D1, realV1D2]
            const collection = new ControlPolygon(realV1D);
            expect(collection.length).to.eql(realV1D.length);
            expect(collection.vectorSpace).to.eql(realV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV1D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a control polygon using genrics parameters with only one vector`, () => {
            const realV2D = new Vector2DTypeReal(1, 2);
            const collection = new ControlPolygon<IRealVector<2>>(realV2D);
            expect(collection.length).to.eql(1);
            expect(collection.vectorSpace).to.eql(realV2D.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV2D.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });
        
    });

    describe('Methods', () => {
        it(`can push a vector into a control polygon of real vectors of type ${REALVECTOR1D}`, () => {
            const realV1D1 = new Vector1DTypeReal(1);
            const realV1D2 = new Vector1DTypeReal(-1);
            const realV1D = [realV1D1, realV1D2]
            const cPolygon = new ControlPolygon(realV1D);
            expect(cPolygon.length).to.eql(realV1D.length);
            expect(cPolygon.vectorSpace).to.eql(realV1D1.vectorSpace);
            expect(cPolygon.spaceDimension).to.eql(realV1D1.dimension);
            expect(cPolygon.weightManagement).to.eql(undefined);
            const realV1D3 = new Vector1DTypeReal(0);
            const newCPolygon = cPolygon.withPushed(realV1D3);
            expect(newCPolygon.length).to.eql(realV1D.length + 1);
            realV1D.push(realV1D3);
            expect(newCPolygon.vectorCollection).to.eql(realV1D);
        });

        it(`can move a control point of a control polygon of real vectors of type ${REALVECTOR1D}`, () => {
            const initCoord = 1;
            const realV1D1 = new Vector1DTypeReal(initCoord);
            const realV1D2 = new Vector1DTypeReal(-1);
            const realV1D3 = new Vector1DTypeReal(0);
            const realV1D = [realV1D1, realV1D2, realV1D3]
            const cPolygon = new ControlPolygon(realV1D);
            expect(cPolygon.length).to.eql(realV1D.length);
            expect(cPolygon.vectorSpace).to.eql(realV1D1.vectorSpace);
            expect(cPolygon.spaceDimension).to.eql(realV1D1.dimension);
            expect(cPolygon.weightManagement).to.eql(undefined);
            const displacement = 2
            const dVector = new Vector1DTypeReal(displacement);
            const newCPolygon = cPolygon.withMovedControlPoint(0, dVector);
            expect(newCPolygon.get(0)).to.eql(new Vector1DTypeReal(initCoord + displacement));
        });
    });
});