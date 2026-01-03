"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const AlgorithmBootstrap_1 = require("../../src/newBsplines/AlgorithmBootstrap");
const BSplineR1toRnConstructorInterface_1 = require("../../src/newBsplines/BSplineR1toRnConstructorInterface");
const OpenBSplineR1toRn_1 = require("../../src/newBsplines/OpenBSplineR1toRn");
const BSplineR1toRn_1 = require("../../src/namedConstants/BSplineR1toRn");
const RealVectorSpace_1 = require("../../src/mathVector/RealVectorSpace");
const VectorSpaceUtilities_1 = require("../../src/mathVector/VectorSpaceUtilities");
describe('Algorithm Library', () => {
    before(() => {
        AlgorithmBootstrap_1.AlgorithmBootstrap.initialize();
    });
    it('should register algorithms correctly', () => {
        const realAlgorithms = OpenBSplineR1toRn_1.AlgorithmRegistry.getAvailableAlgorithms(BSplineR1toRn_1.VectorSpaceType.REAL);
        (0, chai_1.expect)(realAlgorithms).to.include('coxdeboor');
        (0, chai_1.expect)(realAlgorithms).to.include('boehm');
        (0, chai_1.expect)(realAlgorithms).to.include('simd-optimized');
    });
    it('should create curve with different algorithms', () => {
        const dimension = 2;
        const vectorSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
        const controlPoints = [
            vectorSpace.createVector([0, 0]),
            vectorSpace.createVector([1, 1]),
            vectorSpace.createVector([2, 0]),
            vectorSpace.createVector([3, 1])
        ];
        const curve = new OpenBSplineR1toRn_1.OpenBSplineR1toRn({
            type: BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM,
            controlPoints,
            degree: 2
        });
        // Test default algorithm
        const point1 = curve.evaluate(0.5);
        (0, chai_1.expect)((0, VectorSpaceUtilities_1.isVector2D)(point1)).to.eql(true);
        // Test specific algorithm
        const point2 = curve.evaluateWithAlgorithm(0.5, 'boehm');
        (0, chai_1.expect)((0, VectorSpaceUtilities_1.isVector2D)(point2)).to.eql(true);
        // Results should be very close (within numerical precision)
        (0, chai_1.expect)(Math.abs(point1.coordinates[0] - point2.coordinates[0])).to.be.lessThan(1e-10);
        (0, chai_1.expect)(Math.abs(point1.coordinates[1] - point2.coordinates[1])).to.be.lessThan(1e-10);
    });
    it('should switch algorithms dynamically', () => {
        const dimension = 2;
        const vectorSpace = new RealVectorSpace_1.RealVectorSpace(dimension);
        const curve = new OpenBSplineR1toRn_1.OpenBSplineR1toRn({
            type: BSplineR1toRnConstructorInterface_1.BSPL_CP_DEG_UNIFORM,
            controlPoints: [vectorSpace.createVector([0, 0]), vectorSpace.createVector([1, 1])],
            degree: 1
        });
        // Switch to performance algorithm
        curve.setDefaultAlgorithm('simd-optimized');
        const point = curve.evaluate(0.5);
        (0, chai_1.expect)((0, VectorSpaceUtilities_1.isVector2D)(point)).to.eql(true);
    });
    it('should handle algorithm recommendations', () => {
        const performanceAlg = AlgorithmBootstrap_1.AlgorithmBootstrap.getRecommendedAlgorithm(BSplineR1toRn_1.VectorSpaceType.REAL, 'performance');
        (0, chai_1.expect)(performanceAlg).to.equal('simd-optimized');
        const subdivisionAlg = AlgorithmBootstrap_1.AlgorithmBootstrap.getRecommendedAlgorithm(BSplineR1toRn_1.VectorSpaceType.REAL, 'subdivision');
        (0, chai_1.expect)(subdivisionAlg).to.equal('boehm');
    });
});
