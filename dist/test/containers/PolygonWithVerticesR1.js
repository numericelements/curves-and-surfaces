"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var PolygonWithVerticesR1_1 = require("../../src/containers/PolygonWithVerticesR1");
var VertexR1_1 = require("../../src/containers/VertexR1");
var ComparatorOfSequencesDiffEvents_1 = require("../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
describe('PolygonWithVerticesR1', function () {
    it('can create a polygon with VertexR1', function () {
        var vertices = [0.0, 1.1, -2];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.equal(3);
        chai_1.expect(polygon.vertices[0]).to.eql(new VertexR1_1.VertexR1(0, 0.0));
        chai_1.expect(polygon.vertices[2]).to.eql(new VertexR1_1.VertexR1(2, -2));
        chai_1.expect(polygon.getValues()).to.eql([0.0, 1.1, -2]);
    });
    it('can create a polygon with non null start index', function () {
        var vertices = [0.0, 1.1, -2];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices, 2);
        chai_1.expect(polygon.length()).to.equal(3);
        chai_1.expect(polygon.vertices[0]).to.eql(new VertexR1_1.VertexR1(2, 0.0));
        chai_1.expect(polygon.vertices[2]).to.eql(new VertexR1_1.VertexR1(4, -2));
        chai_1.expect(polygon.getValues()).to.eql([0.0, 1.1, -2]);
    });
    it('check polygon indices consistency', function () {
        var vertices = [0.0, 1.1, -2];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.checkConsistency()).to.eql(0);
    });
    it('can get a vertex at a given polygon index', function () {
        var vertices = [0.0, 1.1, -2];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.getVertexAt(0)).to.eql(new VertexR1_1.VertexR1(0, 0.0));
    });
    it('polygon has no vertex as positive local minimum', function () {
        var vertices = [10, 11, 9];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(0);
    });
    it('polygon has no vertex as positive local minimum when successive vertices are aligned', function () {
        var vertices = [11, 9, 9];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(0);
    });
    it('polygon has a vertex as positive local minimum', function () {
        var vertices = [11, 10, 15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(1);
        chai_1.expect(polygon.localPositiveMinima[0]).to.eql(new VertexR1_1.VertexR1(1, 10));
    });
    it('polygon has two vertices as positive local minimum', function () {
        var vertices = [15, 11, 12, 10, 15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(2);
        chai_1.expect(polygon.localPositiveMinima[0]).to.eql(new VertexR1_1.VertexR1(1, 11));
        chai_1.expect(polygon.localPositiveMinima[1]).to.eql(new VertexR1_1.VertexR1(3, 10));
    });
    it('polygon has no vertex as negative local maximum', function () {
        var vertices = [-10, -11, -9];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(0);
    });
    it('polygon has no vertex as negative local maximum when successive vertices are aligned', function () {
        var vertices = [-11, -9, -9];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(0);
    });
    it('polygon has a vertex as negative local maximum', function () {
        var vertices = [-11, -10, -15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(1);
        chai_1.expect(polygon.localNegativeMaxima[0]).to.eql(new VertexR1_1.VertexR1(1, -10));
    });
    it('polygon has two vertices as negative local maxima', function () {
        var vertices = [-15, -11, -12, -10, -15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(2);
        chai_1.expect(polygon.localNegativeMaxima[0]).to.eql(new VertexR1_1.VertexR1(1, -11));
        chai_1.expect(polygon.localNegativeMaxima[1]).to.eql(new VertexR1_1.VertexR1(3, -10));
    });
    it('sort polygon positive local minima in increasing order', function () {
        var vertices = [15, 11, 12, 10, 15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(2);
        var listExtrema = polygon.sortLocalExtrema(polygon.localPositiveMinima);
        chai_1.expect(listExtrema.length).to.eql(2);
        chai_1.expect(listExtrema[0]).to.eql(new VertexR1_1.VertexR1(3, 10));
        chai_1.expect(listExtrema[1]).to.eql(new VertexR1_1.VertexR1(1, 11));
    });
    it('sort polygon negative local maxima in increasing order', function () {
        var vertices = [-15, -11, -12, -10, -15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(2);
        var listExtrema = polygon.sortLocalExtrema(polygon.localNegativeMaxima);
        chai_1.expect(listExtrema.length).to.eql(2);
        chai_1.expect(listExtrema[0]).to.eql(new VertexR1_1.VertexR1(1, -11));
        chai_1.expect(listExtrema[1]).to.eql(new VertexR1_1.VertexR1(3, -10));
    });
    it('extract polygon local extremum closest to the axis: case local negative maxima exist only', function () {
        var vertices = [-15, -11, -12, -10, -15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(2);
        var listExtrema = polygon.sortLocalExtrema(polygon.localNegativeMaxima);
        chai_1.expect(listExtrema.length).to.eql(2);
        chai_1.expect(listExtrema[0]).to.eql(new VertexR1_1.VertexR1(1, -11));
        chai_1.expect(listExtrema[1]).to.eql(new VertexR1_1.VertexR1(3, -10));
        chai_1.expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1_1.VertexR1(3, -10));
    });
    it('extract polygon local extremum closest to the axis: case local positive minima exist only', function () {
        var vertices = [15, 11, 12, 10, 15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(2);
        var listExtrema = polygon.sortLocalExtrema(polygon.localPositiveMinima);
        chai_1.expect(listExtrema.length).to.eql(2);
        chai_1.expect(listExtrema[0]).to.eql(new VertexR1_1.VertexR1(3, 10));
        chai_1.expect(listExtrema[1]).to.eql(new VertexR1_1.VertexR1(1, 11));
        chai_1.expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1_1.VertexR1(3, 10));
    });
    it('extract polygon local extremum closest to the axis: case no valid extremum', function () {
        var vertices = [-11, -9, -9];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(0);
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(0);
        chai_1.expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0));
    });
    it('extract polygon local extremum closest to the axis: case local positive minima and negative maxima exist. Solution is a positive minimum', function () {
        var vertices = [-15, -11, -12, -10, -15, 15, 11, 12, 9, 15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(2);
        var listMinima = polygon.sortLocalExtrema(polygon.localPositiveMinima);
        chai_1.expect(listMinima.length).to.eql(2);
        chai_1.expect(listMinima[0]).to.eql(new VertexR1_1.VertexR1(8, 9));
        chai_1.expect(listMinima[1]).to.eql(new VertexR1_1.VertexR1(6, 11));
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(2);
        var listMaxima = polygon.sortLocalExtrema(polygon.localNegativeMaxima);
        chai_1.expect(listMaxima.length).to.eql(2);
        chai_1.expect(listMaxima[0]).to.eql(new VertexR1_1.VertexR1(1, -11));
        chai_1.expect(listMaxima[1]).to.eql(new VertexR1_1.VertexR1(3, -10));
        chai_1.expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1_1.VertexR1(8, 9));
    });
    it('extract polygon local extremum closest to the axis: case local positive minima and negative maxima exist. Solution is a negative maximum', function () {
        var vertices = [-15, -11, -12, -9, -15, 15, 11, 12, 10, 15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.extractLocalPositiveMinima();
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(2);
        var listMinima = polygon.sortLocalExtrema(polygon.localPositiveMinima);
        chai_1.expect(listMinima.length).to.eql(2);
        chai_1.expect(listMinima[0]).to.eql(new VertexR1_1.VertexR1(8, 10));
        chai_1.expect(listMinima[1]).to.eql(new VertexR1_1.VertexR1(6, 11));
        polygon.extractLocalNegativeMaxima();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(2);
        var listMaxima = polygon.sortLocalExtrema(polygon.localNegativeMaxima);
        chai_1.expect(listMaxima.length).to.eql(2);
        chai_1.expect(listMaxima[0]).to.eql(new VertexR1_1.VertexR1(1, -11));
        chai_1.expect(listMaxima[1]).to.eql(new VertexR1_1.VertexR1(3, -9));
        chai_1.expect(polygon.extractClosestLocalExtremmumToAxis()).to.eql(new VertexR1_1.VertexR1(3, -9));
    });
    it('clear polygon content', function () {
        var vertices = [-15, -11, -12, -10, -15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        polygon.clear();
        chai_1.expect(polygon.localNegativeMaxima.length).to.eql(0);
        chai_1.expect(polygon.localPositiveMinima.length).to.eql(0);
        chai_1.expect(polygon.length()).to.eql(0);
    });
    it('can extend polygon with a new vertex at its end using the vertex value', function () {
        var vertices = [-15, -11, -12, -10, -15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(5);
        polygon.extendWithNewValue(1);
        chai_1.expect(polygon.length()).to.eql(6);
        chai_1.expect(polygon.getValues()).to.eql([-15, -11, -12, -10, -15, 1]);
    });
    it('can extend polygon with a new vertex at its end', function () {
        var vertices = [-15, -11, -12, -10, -15];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(5);
        polygon.extend(new VertexR1_1.VertexR1(5, 1));
        chai_1.expect(polygon.length()).to.eql(6);
        chai_1.expect(polygon.getValues()).to.eql([-15, -11, -12, -10, -15, 1]);
    });
    it('can extract first edge of polygon oscillating around the axis', function () {
        var vertices = [-10, 1];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(2);
        var oscillatingPolygons = polygon.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons.length).to.eql(1);
        chai_1.expect(oscillatingPolygons[0].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1]);
    });
    it('can extract first edge of polygon oscillating around the axis. Case first edge is not first polygon edge', function () {
        var vertices = [-5, -12, -10, 1];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(4);
        var oscillatingPolygons = polygon.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons.length).to.eql(1);
        chai_1.expect(oscillatingPolygons[0].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1]);
    });
    it('can extract polygon oscillating around the axis. Case first edge of oscillating polygon is first polygon edge', function () {
        var vertices = [-10, 1, -2, 0.5];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(4);
        var oscillatingPolygons = polygon.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons.length).to.eql(1);
        chai_1.expect(oscillatingPolygons[0].length()).to.eql(4);
        chai_1.expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2, 0.5]);
    });
    it('can extract polygon oscillating around the axis. Case first edge of oscillating polygon is not first polygon edge', function () {
        var vertices = [-5, -12, -10, 1, -2, 0.5];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(6);
        var oscillatingPolygons = polygon.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons.length).to.eql(1);
        chai_1.expect(oscillatingPolygons[0].length()).to.eql(4);
        chai_1.expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2, 0.5]);
    });
    it('can extract polygon oscillating around the axis. Case oscillating polygon entirely inside input polygon', function () {
        var vertices = [-5, -12, -10, 1, -2, 0.5, 1];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(7);
        var oscillatingPolygons = polygon.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons.length).to.eql(1);
        chai_1.expect(oscillatingPolygons[0].length()).to.eql(4);
        chai_1.expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2, 0.5]);
    });
    it('can extract first edges of polygons oscillating around the axis.', function () {
        var vertices = [-10, 1, 2, -0.5];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(4);
        var oscillatingPolygons = polygon.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons.length).to.eql(2);
        chai_1.expect(oscillatingPolygons[0].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1]);
        chai_1.expect(oscillatingPolygons[1].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons[1].getValues()).to.eql([2, -0.5]);
    });
    it('can extract multiple polygons oscillating around the axis.', function () {
        var vertices = [-5, -10, 1, -2, -1, 2, 1, -0.5];
        var polygon = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices);
        chai_1.expect(polygon.length()).to.eql(8);
        var oscillatingPolygons = polygon.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons.length).to.eql(3);
        chai_1.expect(oscillatingPolygons[0].length()).to.eql(3);
        chai_1.expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2]);
        chai_1.expect(oscillatingPolygons[1].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons[1].getValues()).to.eql([-1, 2]);
        chai_1.expect(oscillatingPolygons[2].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons[2].getValues()).to.eql([1, -0.5]);
    });
    it('for comparison with OptProblemBSplineR1toR2 class', function () {
        var vertices1 = [-5, -3, 5, 5];
        var polygon1 = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices1);
        var oscillatingPolygons1 = polygon1.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons1.length).to.eql(1);
        chai_1.expect(oscillatingPolygons1[0].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons1[0].getValues()).to.eql([-3, 5]);
        var vertices2 = [-5, -5, 3, 5];
        var polygon2 = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices2);
        var oscillatingPolygons2 = polygon2.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons2.length).to.eql(1);
        chai_1.expect(oscillatingPolygons2[0].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons2[0].getValues()).to.eql([-5, 3]);
        var vertices3 = [5, -3, -5, 5.1];
        var polygon3 = new PolygonWithVerticesR1_1.PolygonWithVerticesR1(vertices3);
        var oscillatingPolygons3 = polygon3.extractOscillatingPolygons();
        chai_1.expect(oscillatingPolygons3.length).to.eql(2);
        chai_1.expect(oscillatingPolygons3[0].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons3[0].getValues()).to.eql([5, -3]);
        chai_1.expect(oscillatingPolygons3[1].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons3[1].getValues()).to.eql([-5, 5.1]);
        // const oscillatingPolygons = polygon2.extractChangingSignVerticesSequences();
        // expect(oscillatingPolygons.length).to.eql(1);
        // expect(oscillatingPolygons[0].length()).to.eql(2);
        // expect(oscillatingPolygons[0].getValues()).to.eql([1, -0.5]);
    });
});
describe('function extractChangingSignControlPointsSequences', function () {
    it('can extract multiple polygons oscillating around the axis. Variant using a control point sequence as input', function () {
        var ctrlPtSequence = [-5, -10, 1, -2, -1, 2, 1, -0.5];
        var oscillatingPolygons = PolygonWithVerticesR1_1.extractOscillatingPolygons(ctrlPtSequence);
        chai_1.expect(oscillatingPolygons.length).to.eql(3);
        chai_1.expect(oscillatingPolygons[0].length()).to.eql(3);
        chai_1.expect(oscillatingPolygons[0].getValues()).to.eql([-10, 1, -2]);
        chai_1.expect(oscillatingPolygons[1].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons[1].getValues()).to.eql([-1, 2]);
        chai_1.expect(oscillatingPolygons[2].length()).to.eql(2);
        chai_1.expect(oscillatingPolygons[2].getValues()).to.eql([1, -0.5]);
    });
});
