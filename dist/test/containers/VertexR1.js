"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var VertexR1_1 = require("../../src/containers/VertexR1");
var ComparatorOfSequencesDiffEvents_1 = require("../../src/sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
describe('VertexR1', function () {
    it('has an index and a value', function () {
        var index = 0;
        var value = 1.0;
        var vertex = new VertexR1_1.VertexR1(index, value);
        chai_1.expect(vertex.index).to.equal(0);
        chai_1.expect(vertex.value).to.equal(1.0);
    });
    it('has an index out of range', function () {
        var index = -1;
        var value = 1.0;
        var vertex = new VertexR1_1.VertexR1(index, value);
        chai_1.expect(vertex.index).to.equal(-1);
        chai_1.expect(vertex.checkIndex()).to.equal(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE);
    });
});
