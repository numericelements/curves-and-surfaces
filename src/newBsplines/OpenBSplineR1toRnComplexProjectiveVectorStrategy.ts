import { ComplexVectorSpace } from "../mathVector/ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../mathVector/ProjectiveComplexVectorSpace";
import { ProjectiveComplexVector, RealVector } from "../mathVector/VectorSpaceConstructorInterface";
import { WeightManager } from "../mathVector/WeightManager";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { AbstractOPenBSplineR1toRnStrategy } from "./AbstractOPenBSplineR1toRnStrategy";
import { BSpline_type } from "./BSplineR1toRnConstructorInterface";
import { BSplineEvaluator, CoxDeBoorProjectiveEvaluator, OpenBSplineR1toRn, OpenBSplineR1toRnStrategy } from "./OpenBSplineR1toRn";

export class OpenBSplineR1toRnComplexProjectiveVectorStrategy extends AbstractOPenBSplineR1toRnStrategy implements OpenBSplineR1toRnStrategy {

    protected vectorSpace: ProjectiveComplexVectorSpace;

    constructor(curveParameters: BSpline_type, openSBplineR1toRn: OpenBSplineR1toRn) {
        super(curveParameters, openSBplineR1toRn);
        this.vectorSpace = new ProjectiveComplexVectorSpace(openSBplineR1toRn.spaceDimension);
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

    evaluate(u: number): RealVector {
        const weightManager = new WeightManager(WeightManagement.AllStrictlyPositiveWeights);
        const projVector = this.vectorSpace.createVector([], weightManager);
        const complexVect = this.vectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(projVector);
        const complexVectorSpace =  new ComplexVectorSpace(this.openBSplineR1toRn.spaceDimension)
        return complexVectorSpace.fromComplexVectorSpaceToRealVectorSpace(complexVect);
    }

    euclideanDistances(): number[] {
        const distances: number[] = [];
        for (let i = 0; i < this.openBSplineR1toRn.controlPolygon.length - 1; i += 1) {
            distances.push(this.vectorSpace.norm(this.vectorSpace.subtract(this.openBSplineR1toRn.controlPolygon.getVector(i + 1) as ProjectiveComplexVector, this.openBSplineR1toRn.controlPolygon.getVector(i) as ProjectiveComplexVector)));
        }
        return distances;
    }

    derivative(): OpenBSplineR1toRn {
        return this.openBSplineR1toRn;
    }

    bernsteinDecomposition(): OpenBSplineR1toRn {
        return this.openBSplineR1toRn;
    }

}