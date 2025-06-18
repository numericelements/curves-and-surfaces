import { expect } from 'chai';
import { AlgorithmBootstrap } from '../../src/newBsplines/AlgorithmBootstrap';
import { BSPL_CP_DEG_UNIFORM } from '../../src/newBsplines/BSplineR1toRnConstructorInterface';
import { AlgorithmRegistry, OpenBSplineR1toRn } from '../../src/newBsplines/OpenBSplineR1toRn';
import { VectorSpaceType } from '../../src/namedConstants/BSplineR1toRn';
import { RealVectorSpace } from '../../src/mathVector/RealVectorSpace';
import { isVector2D } from '../../src/mathVector/VectorSpaceUtilities';
import { RealVector2D } from '../../src/mathVector/VectorSpaceConstructorInterface';

describe('Algorithm Library', () => {
    before(() => {
        AlgorithmBootstrap.initialize();
    });

    it('should register algorithms correctly', () => {
        const realAlgorithms = AlgorithmRegistry.getAvailableAlgorithms(VectorSpaceType.REAL);
        expect(realAlgorithms).to.include('coxdeboor');
        expect(realAlgorithms).to.include('boehm');
        expect(realAlgorithms).to.include('simd-optimized');
    });

    it('should create curve with different algorithms', () => {
        const dimension = 2;
        const vectorSpace = new RealVectorSpace(dimension);
        const controlPoints = [
            vectorSpace.createVector([0, 0]),
            vectorSpace.createVector([1, 1]),
            vectorSpace.createVector([2, 0]),
            vectorSpace.createVector([3, 1])
        ];

        const curve = new OpenBSplineR1toRn({
            type: BSPL_CP_DEG_UNIFORM,
            controlPoints,
            degree: 2
        });

        // Test default algorithm
        const point1 = curve.evaluate(0.5) as RealVector2D;
        expect(isVector2D(point1)).to.eql(true);

        // Test specific algorithm
        const point2 = curve.evaluateWithAlgorithm(0.5, 'boehm') as RealVector2D;
        expect(isVector2D(point2)).to.eql(true);

        // Results should be very close (within numerical precision)
        expect(Math.abs(point1.coordinates[0] - point2.coordinates[0])).to.be.lessThan(1e-10);
        expect(Math.abs(point1.coordinates[1] - point2.coordinates[1])).to.be.lessThan(1e-10);
    });

    it('should switch algorithms dynamically', () => {
        const dimension = 2;
        const vectorSpace = new RealVectorSpace(dimension);
        const curve = new OpenBSplineR1toRn({
            type: BSPL_CP_DEG_UNIFORM,
            controlPoints: [vectorSpace.createVector([0, 0]), vectorSpace.createVector([1, 1])],
            degree: 1
        });

        // Switch to performance algorithm
        curve.setDefaultAlgorithm('simd-optimized');
        const point = curve.evaluate(0.5);
        expect(isVector2D(point)).to.eql(true);
    });

    it('should handle algorithm recommendations', () => {
        const performanceAlg = AlgorithmBootstrap.getRecommendedAlgorithm(
            VectorSpaceType.REAL, 
            'performance'
        );
        expect(performanceAlg).to.equal('simd-optimized');

        const subdivisionAlg = AlgorithmBootstrap.getRecommendedAlgorithm(
            VectorSpaceType.REAL, 
            'subdivision'
        );
        expect(subdivisionAlg).to.equal('boehm');
    });
});