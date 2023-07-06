import { expect } from 'chai';
import { PolygonWithVerticesR1 } from '../../src/containers/PolygonWithVerticesR1';
import { OscillatingPolygonWithVerticesR1 } from '../../src/containers/OscillatingPolygonWithVerticesR1';
import { AdjacentOscillatingPolygons } from '../../src/containers/AdjacentOscillatingPolygons';
import { VertexR1 } from '../../src/containers/VertexR1';
import { RETURN_ERROR_CODE } from '../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents';

describe('AdjacentOscillatingPolygons', () => {

    it('can create an adjacent set of oscillating polygons from an array of oscillating polygons.', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [2, -1, 1];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(3);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(3);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.oscillatingPolygons[0].length()).to.eql(2);
        expect(adjacentPolygons.oscillatingPolygons[0].getValues()).to.eql([-1, 1.1]);
        expect(adjacentPolygons.oscillatingPolygons[1].length()).to.eql(3);
        expect(adjacentPolygons.oscillatingPolygons[1].getValues()).to.eql([2, -1, 1]);
    });

    it('cannot create an adjacent set of oscillating polygons from an array of oscillating polygons when they are not adjacent to each other.', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [2, -1, 1];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 4);
        expect(polygon1.length()).to.equal(3);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(3);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        const firstIndex1 = allPolygons[0].getFirstIndex();
        const lastVertex1 = allPolygons[0].getVertexAt(firstIndex1 + allPolygons[0].length() - 1);
        const firstIndex2 = allPolygons[1].getFirstIndex();
        const firstVertex2 = allPolygons[1].getVertexAt(firstIndex2);
        let error = false;
        if((lastVertex1.index + 1) !== firstVertex2.index) {
            error = true;
        }
        expect(error).to.equal(true);
    });

    it('cannot create an adjacent set of oscillating polygons from an array of oscillating polygons when extreme vertices are not of same sign', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [-2, 1, -1];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(3);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(3);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        const firstIndex1 = allPolygons[0].getFirstIndex();
        const lastVertex1 = allPolygons[0].getVertexAt(firstIndex1 + allPolygons[0].length() - 1);
        const firstIndex2 = allPolygons[1].getFirstIndex();
        const firstVertex2 = allPolygons[1].getVertexAt(firstIndex2);
        let error = false;
        if(lastVertex1.value * firstVertex2.value <= 0.0) {
            error = true;
        }
        expect(error).to.equal(true);
    });

    it('can extract the closest vertex to 0 from a set of adjacent oscillating polygons', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [2, -1.5, 1];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(3);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(3);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        adjacentPolygons.getClosestVertexToZero();
        expect(adjacentPolygons.closestVertex).to.eql(new VertexR1(4, -1.5));
        expect(adjacentPolygons.indexOscillatingPolygon).to.eql(1);
    });

    it('can extract the closest vertex to 0 from a set of adjacent oscillating polygons', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [2, -0.5];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(2);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(2);
        const vertices2 = [-2, 0.8, -3, 0.1];
        const polygon2 = new PolygonWithVerticesR1(vertices2, 5);
        expect(polygon2.length()).to.equal(4);
        const oscillatingPolygon2 = new OscillatingPolygonWithVerticesR1(polygon2);
        expect(oscillatingPolygon2.length()).to.equal(4);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        allPolygons.push(oscillatingPolygon2);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(3);
        adjacentPolygons.getClosestVertexToZero();
        expect(adjacentPolygons.closestVertex).to.eql(new VertexR1(4, -0.5));
        expect(adjacentPolygons.indexOscillatingPolygon).to.eql(1);
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with no relaxation incompatibility. Both extreme constraints maintained', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [2, -0.5];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(2);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(2);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(RETURN_ERROR_CODE, 0.0));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with no relaxation incompatibility. Left extreme constraint maintained', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [1, -1.5];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(2);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(2);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(3, 1));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with no relaxation incompatibility. Right extreme constraint maintained', () => {
        const vertices = [-1.5, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [1, -0.5];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(2);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(2);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(RETURN_ERROR_CODE, 0.0));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with relaxation incompatibility. Right extreme constraint is closest', () => {
        const vertices = [-1.5, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [1, -2.5];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(2);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(2);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(3, 1));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with relaxation incompatibility. Left extreme constraint is closest', () => {
        const vertices = [-1.5, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [1.5, -2.5];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(2);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(2);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(2, 1.1));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with no relaxation incompatibility. Left and right extreme constraints are maintained', () => {
        const vertices = [-2, 0.8, -3, 0.1, -1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        const vertices1 = [-2, 0.8, -3, 0.1, -2];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 6);
        expect(polygon1.length()).to.equal(5);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(5);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(RETURN_ERROR_CODE, 0.0));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with no relaxation incompatibility. Right extreme constraint is maintained', () => {
        const vertices = [-2, 0.8, -3, 1, -0.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        const vertices1 = [-2, 0.8, -3, 0.1, -2];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 6);
        expect(polygon1.length()).to.equal(5);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(5);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(RETURN_ERROR_CODE, 0.0));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with no relaxation incompatibility. Left extreme constraint is maintained', () => {
        const vertices = [-2, 0.8, -3, 0.1, -1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        const vertices1 = [-0.2, 0.8, -3, 0.1, -2];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 6);
        expect(polygon1.length()).to.equal(5);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(5);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(RETURN_ERROR_CODE, 0.0));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with relaxation incompatibility. Left extreme constraint is closest', () => {
        const vertices = [-2, 0.8, -3, 1, -0.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        const vertices1 = [-0.2, 0.8, -3, 0.1, -2];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 6);
        expect(polygon1.length()).to.equal(5);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(5);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(5, -0.1));
    });

    it('can extract the closest vertex to 0 at connection of adjacent oscillating polygons 0 and 1 with relaxation incompatibility. Right extreme constraint is closest', () => {
        const vertices = [-2, 0.8, -3, 1, -0.2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        const vertices1 = [-0.1, 0.8, -3, 0.1, -2];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 6);
        expect(polygon1.length()).to.equal(5);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(5);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = new AdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.oscillatingPolygons.length).to.equal(2);
        expect(adjacentPolygons.getClosestVertexToZeroAtConnection(0)).to.eql(new VertexR1(6, -0.1));
    });
});