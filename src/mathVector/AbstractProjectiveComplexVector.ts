import { AbstractVector } from "./AbstractVector";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { IComplexVector, IProjectiveComplexVector, IRealVector, VectorFactory } from "./Vector";
import { Complex, ComplexWeight, ProjectiveComplexVector, Vector } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

/**
 * Abstract base for projective complex vectors
 */
export abstract class AbstractProjectiveComplexVector extends AbstractVector implements IProjectiveComplexVector {

    // constructor(vectorSpace?: ProjectiveComplexVectorSpace<any>) {
    //     super(vectorSpace);
    // }

    get vectorSpace(): ProjectiveComplexVectorSpace<any> { return this._vectorSpace as ProjectiveComplexVectorSpace<any>; }

    abstract get weight(): Weight | ComplexWeight;
    abstract get homogeneousCoordinates(): (number | Complex)[];
    abstract normalize(): IProjectiveComplexVector;
    abstract toCartesian(): IRealVector | IComplexVector;
    
    add(other: IProjectiveComplexVector): IProjectiveComplexVector {
        return super.add(other) as IProjectiveComplexVector;
    }

    subtract(other: IProjectiveComplexVector): IProjectiveComplexVector {
        return super.subtract(other) as IProjectiveComplexVector;
    }

    scale(scalar: number): IProjectiveComplexVector {
        return super.scale(scalar) as IProjectiveComplexVector;
    }

    toArray(): number[] {
        return this.homogeneousCoordinates.map(coord => 
            typeof coord === 'number' ? coord : coord.real
        );
    }

    protected createVectorFromRaw(raw: Vector): IProjectiveComplexVector {
        return VectorFactory.createProjectiveComplexVectorFromRaw(raw as ProjectiveComplexVector, this.vectorSpace);
    }
}