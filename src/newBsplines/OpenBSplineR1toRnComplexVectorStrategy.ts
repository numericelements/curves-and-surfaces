import { ComplexVectorSpace } from "../mathVector/ComplexVectorSpace";
import { ComplexVector, RealVector } from "../mathVector/VectorSpaceConstructorInterface";
import { AbstractOPenBSplineR1toRnStrategy } from "./AbstractOPenBSplineR1toRnStrategy";
import { BSpline_type } from "./BSplineR1toRnConstructorInterface";
import { BSplineEvaluator, CoxDeBoorProjectiveEvaluator, OpenBSplineR1toRn, OpenBSplineR1toRnStrategy } from "./OpenBSplineR1toRn";

export class OpenBSplineR1toRnComplexVectorStrategy extends AbstractOPenBSplineR1toRnStrategy implements OpenBSplineR1toRnStrategy {

    protected vectorSpace: ComplexVectorSpace;

    constructor(curveParameters: BSpline_type, openSBplineR1toRn: OpenBSplineR1toRn) {
        super(curveParameters, openSBplineR1toRn);
        this.vectorSpace = new ComplexVectorSpace(openSBplineR1toRn.spaceDimension);
    }

    protected createEvaluator(algorithmName: string): BSplineEvaluator {
        switch (algorithmName) {
            case 'coxdeboor':
                return new CoxDeBoorProjectiveEvaluator(
                    this.openBSplineR1toRn.controlPolygon,
                    this.openBSplineR1toRn.knotSequence,
                    this.openBSplineR1toRn.degree
                );
            default:
                return new CoxDeBoorProjectiveEvaluator(
                    this.openBSplineR1toRn.controlPolygon,
                    this.openBSplineR1toRn.knotSequence,
                    this.openBSplineR1toRn.degree
                );
        }
    }

    euclideanDistances(): number[] {
        const distances: number[] = [];
        for (let i = 0; i < this.openBSplineR1toRn.controlPolygon.length - 1; i += 1) {
            distances.push(this.vectorSpace.norm(this.vectorSpace.subtract(this.openBSplineR1toRn.controlPolygon.getVector(i + 1) as ComplexVector, this.openBSplineR1toRn.controlPolygon.getVector(i) as ComplexVector)));
        }
        return distances;
    }

    evaluate(u: number, ): RealVector {
        const complexVector = this.vectorSpace.createVector([]);
        return this.vectorSpace.fromComplexVectorSpaceToRealVectorSpace(complexVector);
    }

    derivative(): OpenBSplineR1toRn {
        return this.openBSplineR1toRn;
    }

    bernsteinDecomposition(): OpenBSplineR1toRn {
        return this.openBSplineR1toRn;
    }
}