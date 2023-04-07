import { expect } from 'chai';
import { PolygonWithVerticesR1 } from '../../src/containers/PolygonWithVerticesR1';
import { OscillatingPolygonWithVerticesR1, extractAdjacentOscillatingPolygons } from '../../src/containers/OscillatingPolygonWithVerticesR1';
import { VertexR1 } from '../../src/containers/VertexR1';
import { RETURN_ERROR_CODE } from '../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents';
import { AdjacentOscillatingPolygons } from '../../src/containers/AdjacentOscillatingPolygons';

describe('OscillatingPolygonWithVerticesR1', () => {

    it('can create an oscillating polygon from a polygon with verticesR1 with an index starting at 0.', () => {
        const vertices = [-1, 1.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        expect(oscillatingPolygon.vertices[0]).to.eql(new VertexR1(0, -1));
        expect(oscillatingPolygon.vertices[1]).to.eql(new VertexR1(1, 1.1));
        expect(oscillatingPolygon.vertices[2]).to.eql(new VertexR1(2, -2));
        expect(oscillatingPolygon.getValues()).to.eql([-1, 1.1, -2]);
    });

    it('can create an oscillating polygon from a polygon with verticesR1 with an index starting at 2.', () => {
        const vertices = [-1, 1.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 2);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        expect(oscillatingPolygon.vertices[0]).to.eql(new VertexR1(2, -1));
        expect(oscillatingPolygon.vertices[1]).to.eql(new VertexR1(3, 1.1));
        expect(oscillatingPolygon.vertices[2]).to.eql(new VertexR1(4, -2));
        expect(oscillatingPolygon.getValues()).to.eql([-1, 1.1, -2]);
    });

    it('cannot create an oscillating polygon from a polygon with verticesR1 if has only one vertex.', () => {
        const vertices = [-1];
        const polygon = new PolygonWithVerticesR1(vertices, 2);
        expect(polygon.length()).to.equal(1);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.vertices.length).to.eql(1);
        expect(oscillatingPolygon.checkConsistency()).to.eql(RETURN_ERROR_CODE);
    });

    it('can create an oscillating polygon from a polygon that has not an oscillatory sequence of vertices.', () => {
        const vertices = [-1, 1.1, 2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        expect(oscillatingPolygon.vertices[0]).to.eql(new VertexR1(1, -1));
        expect(oscillatingPolygon.vertices[1]).to.eql(new VertexR1(2, 1.1));
        expect(oscillatingPolygon.vertices[2]).to.eql(new VertexR1(3, 2));
        expect(oscillatingPolygon.checkConsistency()).to.eql(RETURN_ERROR_CODE);
    });

    it('can extract vertex closest to zero at the beginning of the polygon when the vertex is the first one.', () => {
        const vertices = [-1, 1.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        const firstIndex = oscillatingPolygon.getFirstIndex();
        expect(oscillatingPolygon.extractControlPtClosestToZeroAtExtremity(firstIndex)).to.eql(new VertexR1(1, -1));
    });

    it('can extract vertex closest to zero at the beginning of the polygon when the vertex is the second one.', () => {
        const vertices = [-1, 0.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        const firstIndex = oscillatingPolygon.getFirstIndex();
        expect(oscillatingPolygon.extractControlPtClosestToZeroAtExtremity(firstIndex)).to.eql(new VertexR1(2, 0.1));

        const vertices1 = [-1, 0.9, -2, 0.5, -0.1];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 1);
        expect(polygon1.length()).to.equal(5);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(5);
        const firstIndex1 = oscillatingPolygon1.getFirstIndex();
        expect(oscillatingPolygon1.extractControlPtClosestToZeroAtExtremity(firstIndex1)).to.eql(new VertexR1(2, 0.9));
    });

    it('can extract vertex closest to zero at the end of the polygon when the vertex is the last one.', () => {
        const vertices = [-1, 1.1, -0.5];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        const firstIndex = oscillatingPolygon.getFirstIndex();
        const lastIndex = firstIndex + oscillatingPolygon.length() - 1;
        expect(oscillatingPolygon.extractControlPtClosestToZeroAtExtremity(lastIndex)).to.eql(new VertexR1(3, -0.5));
    });

    it('can extract vertex closest to zero at the beginning of the polygon when the vertex is the one before the last one.', () => {
        const vertices = [-1, 0.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        const firstIndex = oscillatingPolygon.getFirstIndex();
        const lastIndex = firstIndex + oscillatingPolygon.length() - 1;
        expect(oscillatingPolygon.extractControlPtClosestToZeroAtExtremity(lastIndex)).to.eql(new VertexR1(2, 0.1));

        const vertices1 = [-1, 0.9, -2, 0.5, -1];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 1);
        expect(polygon1.length()).to.equal(5);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(5);
        const firstIndex1 = oscillatingPolygon1.getFirstIndex();
        const lastIndex1 = firstIndex1 + oscillatingPolygon1.length() - 1;
        expect(oscillatingPolygon1.extractControlPtClosestToZeroAtExtremity(lastIndex1)).to.eql(new VertexR1(4, 0.5));
    });

    it('can extract vertices closest to zero at the extremities of an oscillating polygon. Polygon with one edge only', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        oscillatingPolygon.extractControlPtsClosestToZeroAtExtremities();
        expect(oscillatingPolygon.closestVertexAtBeginning).to.eql(new VertexR1(1, -1));
        expect(oscillatingPolygon.closestVertexAtEnd).to.eql(new VertexR1(1, -1));
    });

    it('can extract vertices closest to zero at the extremities of an oscillating polygon. Polygon with two edges. First and second selected.', () => {
        const vertices = [-1, 1.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        oscillatingPolygon.extractControlPtsClosestToZeroAtExtremities();
        expect(oscillatingPolygon.closestVertexAtBeginning).to.eql(new VertexR1(1, -1));
        expect(oscillatingPolygon.closestVertexAtEnd).to.eql(new VertexR1(2, 1.1));
    });

    it('can extract vertices closest to zero at the extremities of an oscillating polygon. Polygon with two edges. Second selected only', () => {
        const vertices = [-1, 0.9, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        oscillatingPolygon.extractControlPtsClosestToZeroAtExtremities();
        expect(oscillatingPolygon.closestVertexAtBeginning).to.eql(new VertexR1(2, 0.9));
        expect(oscillatingPolygon.closestVertexAtEnd).to.eql(new VertexR1(2, 0.9));
    });

    it('can extract vertices closest to zero at the extremities of an oscillating polygon. Polygon with two edges. First and third selected.', () => {
        const vertices = [-1, 3, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(3);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(3);
        oscillatingPolygon.extractControlPtsClosestToZeroAtExtremities();
        expect(oscillatingPolygon.closestVertexAtBeginning).to.eql(new VertexR1(1, -1));
        expect(oscillatingPolygon.closestVertexAtEnd).to.eql(new VertexR1(3, -2));
    });

    it('can extract vertices closest to zero at the extremities of an oscillating polygon. Arbitrary number of vertices. First and before last selected.', () => {
        const vertices = [-1, 3, -0.5, 1, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        oscillatingPolygon.extractControlPtsClosestToZeroAtExtremities();
        expect(oscillatingPolygon.closestVertexAtBeginning).to.eql(new VertexR1(1, -1));
        expect(oscillatingPolygon.closestVertexAtEnd).to.eql(new VertexR1(4, 1));
    });

    it('can extract vertices closest to zero at the extremities of an oscillating polygon. Arbitrary number of vertices. First and last selected.', () => {
        const vertices = [-1, 3, -0.5, 2, -1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        oscillatingPolygon.extractControlPtsClosestToZeroAtExtremities();
        expect(oscillatingPolygon.closestVertexAtBeginning).to.eql(new VertexR1(1, -1));
        expect(oscillatingPolygon.closestVertexAtEnd).to.eql(new VertexR1(5, -1));
    });

    it('can extract vertices closest to zero at the extremities of an oscillating polygon. Arbitrary number of vertices. Second and last selected.', () => {
        const vertices = [-2, 1, -0.5, 2, -1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        oscillatingPolygon.extractControlPtsClosestToZeroAtExtremities();
        expect(oscillatingPolygon.closestVertexAtBeginning).to.eql(new VertexR1(2, 1));
        expect(oscillatingPolygon.closestVertexAtEnd).to.eql(new VertexR1(5, -1));
    });

    it('can extract vertices closest to zero at the extremities of an oscillating polygon. Arbitrary number of vertices. Second and before last selected.', () => {
        const vertices = [-2, 1, -0.5, 1, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(5);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(5);
        oscillatingPolygon.extractControlPtsClosestToZeroAtExtremities();
        expect(oscillatingPolygon.closestVertexAtBeginning).to.eql(new VertexR1(2, 1));
        expect(oscillatingPolygon.closestVertexAtEnd).to.eql(new VertexR1(4, 1));
    });

});

describe('extractAdjacentOscillatingPolygons', () => {

    it('can extract adjacent oscillating polygons from two oscillating polygons of size 2', () => {
        const vertices = [-1, 1.1];
        const polygon = new PolygonWithVerticesR1(vertices, 1);
        expect(polygon.length()).to.equal(2);
        const oscillatingPolygon = new OscillatingPolygonWithVerticesR1(polygon);
        expect(oscillatingPolygon.length()).to.equal(2);
        const vertices1 = [2, -1];
        const polygon1 = new PolygonWithVerticesR1(vertices1, 3);
        expect(polygon1.length()).to.equal(2);
        const oscillatingPolygon1 = new OscillatingPolygonWithVerticesR1(polygon1);
        expect(oscillatingPolygon1.length()).to.equal(2);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        const adjacentPolygons = extractAdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.length).to.equal(1);
        expect(adjacentPolygons[0].oscillatingPolygons.length).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[0].length()).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[0].getValues()).to.eql([-1, 1.1]);
        expect(adjacentPolygons[0].oscillatingPolygons[1].length()).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[1].getValues()).to.eql([2, -1]);
    });

    it('can extract adjacent oscillating polygons from two oscillating polygons of sizes 2 and 3', () => {
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
        const adjacentPolygons = extractAdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.length).to.equal(1);
        expect(adjacentPolygons[0].oscillatingPolygons.length).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[0].length()).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[0].getValues()).to.eql([-1, 1.1]);
        expect(adjacentPolygons[0].oscillatingPolygons[1].length()).to.eql(3);
        expect(adjacentPolygons[0].oscillatingPolygons[1].getValues()).to.eql([2, -1, 1]);
    });

    it('can extract several adjacent oscillating polygons from multiple oscillating polygons. Last one is the last oscillating polygon', () => {
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
        const vertices2 = [-2, 1];
        const polygon2 = new PolygonWithVerticesR1(vertices2, 7);
        expect(polygon2.length()).to.equal(2);
        const oscillatingPolygon2 = new OscillatingPolygonWithVerticesR1(polygon2);
        expect(oscillatingPolygon2.length()).to.equal(2);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        allPolygons.push(oscillatingPolygon2);
        const adjacentPolygons = extractAdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.length).to.equal(2);
        expect(adjacentPolygons[0].oscillatingPolygons.length).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[0].length()).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[0].getValues()).to.eql([-1, 1.1]);
        expect(adjacentPolygons[0].oscillatingPolygons[1].length()).to.eql(3);
        expect(adjacentPolygons[0].oscillatingPolygons[1].getValues()).to.eql([2, -1, 1]);
        expect(adjacentPolygons[1].oscillatingPolygons.length).to.eql(1);
        expect(adjacentPolygons[1].oscillatingPolygons[0].length()).to.eql(2);
        expect(adjacentPolygons[1].oscillatingPolygons[0].getValues()).to.eql([-2, 1]);
    });

    it('can extract several adjacent oscillating polygons from multiple oscillating polygons. Each containing multiple oscillating polygons', () => {
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
        const vertices2 = [-2, 1];
        const polygon2 = new PolygonWithVerticesR1(vertices2, 7);
        expect(polygon2.length()).to.equal(2);
        const oscillatingPolygon2 = new OscillatingPolygonWithVerticesR1(polygon2);
        expect(oscillatingPolygon2.length()).to.equal(2);
        const vertices3 = [2, -1, 3];
        const polygon3 = new PolygonWithVerticesR1(vertices3, 9);
        expect(polygon3.length()).to.equal(3);
        const oscillatingPolygon3 = new OscillatingPolygonWithVerticesR1(polygon3);
        expect(oscillatingPolygon3.length()).to.equal(3);
        const allPolygons: OscillatingPolygonWithVerticesR1[] = [];
        allPolygons.push(oscillatingPolygon);
        allPolygons.push(oscillatingPolygon1);
        allPolygons.push(oscillatingPolygon2);
        allPolygons.push(oscillatingPolygon3);
        const adjacentPolygons = extractAdjacentOscillatingPolygons(allPolygons);
        expect(adjacentPolygons.length).to.equal(2);
        expect(adjacentPolygons[0].oscillatingPolygons.length).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[0].length()).to.eql(2);
        expect(adjacentPolygons[0].oscillatingPolygons[0].getValues()).to.eql([-1, 1.1]);
        expect(adjacentPolygons[0].oscillatingPolygons[1].length()).to.eql(3);
        expect(adjacentPolygons[0].oscillatingPolygons[1].getValues()).to.eql([2, -1, 1]);
        expect(adjacentPolygons[1].oscillatingPolygons.length).to.eql(2);
        expect(adjacentPolygons[1].oscillatingPolygons[0].length()).to.eql(2);
        expect(adjacentPolygons[1].oscillatingPolygons[0].getValues()).to.eql([-2, 1]);
        expect(adjacentPolygons[1].oscillatingPolygons[1].length()).to.eql(3);
        expect(adjacentPolygons[1].oscillatingPolygons[1].getValues()).to.eql([2, -1, 3]);
    });
});