import { ProjectiveVectorSpace } from "../mathVector/ProjectiveVectorSpace";
import { ProjectiveVector, RealVector } from "../mathVector/VectorSpaceConstructorInterface";
import { AbstractOPenBSplineR1toRnStrategy } from "./AbstractOPenBSplineR1toRnStrategy";
import { BSpline_type } from "./BSplineR1toRnConstructorInterface";
import { BSplineEvaluator, CoxDeBoorProjectiveEvaluator, OpenBSplineR1toRn, OpenBSplineR1toRnStrategy } from "./OpenBSplineR1toRn";


export class OpenBSplineR1toRnRealProjectiveVectorStrategy extends AbstractOPenBSplineR1toRnStrategy implements OpenBSplineR1toRnStrategy {

    protected vectorSpace: ProjectiveVectorSpace;

    constructor(curveParameters: BSpline_type, openSBplineR1toRn: OpenBSplineR1toRn) {
        super(curveParameters, openSBplineR1toRn);
        this.vectorSpace = new ProjectiveVectorSpace(openSBplineR1toRn.spaceDimension);
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
            distances.push(this.vectorSpace.norm(this.vectorSpace.subtractRaw(this.openBSplineR1toRn.controlPolygon.getVector(i + 1) as ProjectiveVector, this.openBSplineR1toRn.controlPolygon.getVector(i) as ProjectiveVector)));
        }
        return distances;
    }

    evaluate(u: number, ): RealVector {
        const evaluator = this.getEvaluatorView<CoxDeBoorProjectiveEvaluator>('coxdeboor');
        // const projVector = this.vectorSpace.createVector([]);
        return evaluator.evaluate(u);
    }

    derivative(): OpenBSplineR1toRn {
        return this.openBSplineR1toRn;
    }

    bernsteinDecomposition(): OpenBSplineR1toRn {
        return this.openBSplineR1toRn;
    }
}