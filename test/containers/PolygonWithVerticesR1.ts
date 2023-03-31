import { expect } from 'chai';
import { extractChangingSignControlPointsSequences, PolygonWithVerticesR1 } from '../../src/containers/PolygonWithVerticesR1';
import { VertexR1 } from '../../src/containers/VertexR1';
import { RETURN_ERROR_CODE } from '../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents';

describe('PolygonWithVerticesR1', () => {

    it('can create a polygon with VertexR1', () => {
        const vertices = [0.0, 1.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.equal(3);
        expect(polygon.vertices[0]).to.eql(new VertexR1(0, 0.0));
        expect(polygon.vertices[2]).to.eql(new VertexR1(2, -2));
        expect(polygon.getValues()).to.eql([0.0, 1.1, -2]);
    });

    it('can create a polygon with non null start index', () => {
        const vertices = [0.0, 1.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices, 2);
        expect(polygon.length()).to.equal(3);
        expect(polygon.vertices[0]).to.eql(new VertexR1(2, 0.0));
        expect(polygon.vertices[2]).to.eql(new VertexR1(4, -2));
        expect(polygon.getValues()).to.eql([0.0, 1.1, -2]);
    });

    it('check polygon indices consistency', () => {
        const vertices = [0.0, 1.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.checkConsistency()).to.eql(0);
    });

    it('can get a vertex at a given polygon index', () => {
        const vertices = [0.0, 1.1, -2];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.getVertexAt(0)).to.eql(new VertexR1(0, 0.0));
    });

    it('polygon has no vertex as positive local minimum', () => {
        const vertices = [10, 11, 9];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(0);
    });

    it('polygon has no vertex as positive local minimum when successive vertices are aligned', () => {
        const vertices = [11, 9, 9];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(0);
    });

    it('polygon has a vertex as positive local minimum', () => {
        const vertices = [11, 10, 15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(1);
        expect(polygon.localPositiveMinima[0]).to.eql(new VertexR1(1, 10));
    });

    it('polygon has two vertices as positive local minimum', () => {
        const vertices = [15, 11, 12, 10, 15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(2);
        expect(polygon.localPositiveMinima[0]).to.eql(new VertexR1(1, 11));
        expect(polygon.localPositiveMinima[1]).to.eql(new VertexR1(3, 10));
    });

    it('polygon has no vertex as negative local maximum', () => {
        const vertices = [-10, -11, -9];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(0);
    });

    it('polygon has no vertex as negative local maximum when successive vertices are aligned', () => {
        const vertices = [-11, -9, -9];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(0);
    });

    it('polygon has a vertex as negative local maximum', () => {
        const vertices = [-11, -10, -15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(1);
        expect(polygon.localNegativeMaxima[0]).to.eql(new VertexR1(1, -10));
    });

    it('polygon has two vertices as negative local maxima', () => {
        const vertices = [-15, -11, -12, -10, -15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(2);
        expect(polygon.localNegativeMaxima[0]).to.eql(new VertexR1(1, -11));
        expect(polygon.localNegativeMaxima[1]).to.eql(new VertexR1(3, -10));
    });

    it('sort polygon positive local minima in increasing order', () => {
        const vertices = [15, 11, 12, 10, 15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(2);
        const listExtrema = polygon.sortLocalExtrema(polygon.localPositiveMinima);
        expect(listExtrema.length).to.eql(2);
        expect(listExtrema[0]).to.eql(new VertexR1(3, 10));
        expect(listExtrema[1]).to.eql(new VertexR1(1, 11));
    });

    it('sort polygon negative local maxima in increasing order', () => {
        const vertices = [-15, -11, -12, -10, -15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(2);
        const listExtrema = polygon.sortLocalExtrema(polygon.localNegativeMaxima);
        expect(listExtrema.length).to.eql(2);
        expect(listExtrema[0]).to.eql(new VertexR1(1, -11));
        expect(listExtrema[1]).to.eql(new VertexR1(3, -10));
    });

    it('extract polygon local extremum closest to the axis: case local negative maxima exist only', () => {
        const vertices = [-15, -11, -12, -10, -15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(2);
        const listExtrema = polygon.sortLocalExtrema(polygon.localNegativeMaxima);
        expect(listExtrema.length).to.eql(2);
        expect(listExtrema[0]).to.eql(new VertexR1(1, -11));
        expect(listExtrema[1]).to.eql(new VertexR1(3, -10));
        expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1(3, -10));
    });

    it('extract polygon local extremum closest to the axis: case local positive minima exist only', () => {
        const vertices = [15, 11, 12, 10, 15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(2);
        const listExtrema = polygon.sortLocalExtrema(polygon.localPositiveMinima);
        expect(listExtrema.length).to.eql(2);
        expect(listExtrema[0]).to.eql(new VertexR1(3, 10));
        expect(listExtrema[1]).to.eql(new VertexR1(1, 11));
        expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1(3, 10));
    });

    it('extract polygon local extremum closest to the axis: case no valid extremum', () => {
        const vertices = [-11, -9, -9];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(0);
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(0);
        expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1(RETURN_ERROR_CODE, 0.0));
    });

    it('extract polygon local extremum closest to the axis: case local positive minima and negative maxima exist. Solution is a positive minimum', () => {
        const vertices = [-15, -11, -12, -10, -15, 15, 11, 12, 9, 15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(2);
        const listMinima = polygon.sortLocalExtrema(polygon.localPositiveMinima);
        expect(listMinima.length).to.eql(2);
        expect(listMinima[0]).to.eql(new VertexR1(8, 9));
        expect(listMinima[1]).to.eql(new VertexR1(6, 11));
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(2);
        const listMaxima = polygon.sortLocalExtrema(polygon.localNegativeMaxima);
        expect(listMaxima.length).to.eql(2);
        expect(listMaxima[0]).to.eql(new VertexR1(1, -11));
        expect(listMaxima[1]).to.eql(new VertexR1(3, -10));
        expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1(8, 9));
    });

    it('extract polygon local extremum closest to the axis: case local positive minima and negative maxima exist. Solution is a negative maximum', () => {
        const vertices = [-15, -11, -12, -9, -15, 15, 11, 12, 10, 15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        expect(polygon.localPositiveMinima.length).to.eql(2);
        const listMinima = polygon.sortLocalExtrema(polygon.localPositiveMinima);
        expect(listMinima.length).to.eql(2);
        expect(listMinima[0]).to.eql(new VertexR1(8, 10));
        expect(listMinima[1]).to.eql(new VertexR1(6, 11));
        polygon.extractLocalNegativeMaxima();
        expect(polygon.localNegativeMaxima.length).to.eql(2);
        const listMaxima = polygon.sortLocalExtrema(polygon.localNegativeMaxima);
        expect(listMaxima.length).to.eql(2);
        expect(listMaxima[0]).to.eql(new VertexR1(1, -11));
        expect(listMaxima[1]).to.eql(new VertexR1(3, -9));
        expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1(3, -9));
    });

    it('clear polygon content', () => {
        const vertices = [-15, -11, -12, -10, -15];
        const polygon = new PolygonWithVerticesR1(vertices);
        polygon.clear();
        expect(polygon.localNegativeMaxima.length).to.eql(0);
        expect(polygon.localPositiveMinima.length).to.eql(0);
        expect(polygon.length()).to.eql(0);
    });

    it('can extend polygon with a new vertex at its end using the vertex value', () => {
        const vertices = [-15, -11, -12, -10, -15];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(5);
        polygon.extendWithNewValue(1);
        expect(polygon.length()).to.eql(6);
        expect(polygon.getValues()).to.eql([-15, -11, -12, -10, -15, 1]);
    });

    it('can extend polygon with a new vertex at its end', () => {
        const vertices = [-15, -11, -12, -10, -15];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(5);
        polygon.extend(new VertexR1(5, 1));
        expect(polygon.length()).to.eql(6);
        expect(polygon.getValues()).to.eql([-15, -11, -12, -10, -15, 1]);
    });

    it('can extract first edge of polygon oscillating around the axis', () => {
        const vertices = [-10, 1];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(2);
        const oscillatingPolygons = polygon.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons.length).to.eql(1);
        expect(oscillatingPolygons[0].length()).to.eql(2);
        expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1]);
    });

    it('can extract first edge of polygon oscillating around the axis. Case first edge is not first polygon edge', () => {
        const vertices = [-5, -12, -10, 1];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(4);
        const oscillatingPolygons = polygon.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons.length).to.eql(1);
        expect(oscillatingPolygons[0].length()).to.eql(2);
        expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1]);
    });

    it('can extract polygon oscillating around the axis. Case first edge of oscillating polygon is first polygon edge', () => {
        const vertices = [-10, 1, -2, 0.5];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(4);
        const oscillatingPolygons = polygon.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons.length).to.eql(1);
        expect(oscillatingPolygons[0].length()).to.eql(4);
        expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2, 0.5]);
    });

    it('can extract polygon oscillating around the axis. Case first edge of oscillating polygon is not first polygon edge', () => {
        const vertices = [-5, -12, -10, 1, -2, 0.5];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(6);
        const oscillatingPolygons = polygon.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons.length).to.eql(1);
        expect(oscillatingPolygons[0].length()).to.eql(4);
        expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2, 0.5]);
    });

    it('can extract polygon oscillating around the axis. Case oscillating polygon entirely inside input polygon', () => {
        const vertices = [-5, -12, -10, 1, -2, 0.5, 1];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(7);
        const oscillatingPolygons = polygon.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons.length).to.eql(1);
        expect(oscillatingPolygons[0].length()).to.eql(4);
        expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2, 0.5]);
    });

    it('can extract first edges of polygons oscillating around the axis.', () => {
        const vertices = [-10, 1, 2, -0.5];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(4);
        const oscillatingPolygons = polygon.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons.length).to.eql(2);
        expect(oscillatingPolygons[0].length()).to.eql(2);
        expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1]);
        expect(oscillatingPolygons[1].length()).to.eql(2);
        expect(oscillatingPolygons[1].getValues()).to.eql([2, -0.5]);
    });

    it('can extract multiple polygons oscillating around the axis.', () => {
        const vertices = [-5, -10, 1, -2, -1, 2, 1, -0.5];
        const polygon = new PolygonWithVerticesR1(vertices);
        expect(polygon.length()).to.eql(8);
        const oscillatingPolygons = polygon.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons.length).to.eql(3);
        expect(oscillatingPolygons[0].length()).to.eql(3);
        expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2]);
        expect(oscillatingPolygons[1].length()).to.eql(2);
        expect(oscillatingPolygons[1].getValues()).to.eql([-1, 2]);
        expect(oscillatingPolygons[2].length()).to.eql(2);
        expect(oscillatingPolygons[2].getValues()).to.eql([1, -0.5]);
    });

    it('for comparison with OptimizationProblem_BSpline_R1_to_R2 class', () => {
        const vertices1 = [-5, -3, 5, 5];
        const polygon1 = new PolygonWithVerticesR1(vertices1);
        const oscillatingPolygons1 = polygon1.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons1.length).to.eql(1);
        expect(oscillatingPolygons1[0].length()).to.eql(2);
        expect(oscillatingPolygons1[0].getValues()).to.eql([-3, 5]);
        const vertices2 = [-5, -5, 3, 5];
        const polygon2 = new PolygonWithVerticesR1(vertices2);
        const oscillatingPolygons2 = polygon2.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons2.length).to.eql(1);
        expect(oscillatingPolygons2[0].length()).to.eql(2);
        expect(oscillatingPolygons2[0].getValues()).to.eql([-5, 3]);
        const vertices3 = [5, -3, -5, 5.1];
        const polygon3 = new PolygonWithVerticesR1(vertices3);
        const oscillatingPolygons3 = polygon3.extractChangingSignVerticesSequences();
        expect(oscillatingPolygons3.length).to.eql(2);
        expect(oscillatingPolygons3[0].length()).to.eql(2);
        expect(oscillatingPolygons3[0].getValues()).to.eql([5, -3]);
        expect(oscillatingPolygons3[1].length()).to.eql(2);
        expect(oscillatingPolygons3[1].getValues()).to.eql([-5, 5.1]);
        // const oscillatingPolygons = polygon2.extractChangingSignVerticesSequences();
        // expect(oscillatingPolygons.length).to.eql(1);
        // expect(oscillatingPolygons[0].length()).to.eql(2);
        // expect(oscillatingPolygons[0].getValues()).to.eql([1, -0.5]);
    });

});

describe('function extractChangingSignControlPointsSequences', () => {
    it('can extract multiple polygons oscillating around the axis. Variant using a control point sequence as input', () => {
        const ctrlPtSequence = [-5, -10, 1, -2, -1, 2, 1, -0.5];
        const oscillatingPolygons = extractChangingSignControlPointsSequences(ctrlPtSequence);
        expect(oscillatingPolygons.length).to.eql(3);
        expect(oscillatingPolygons[0].length()).to.eql(3);
        expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2]);
        expect(oscillatingPolygons[1].length()).to.eql(2);
        expect(oscillatingPolygons[1].getValues()).to.eql([-1, 2]);
        expect(oscillatingPolygons[2].length()).to.eql(2);
        expect(oscillatingPolygons[2].getValues()).to.eql([1, -0.5]);
    });

});