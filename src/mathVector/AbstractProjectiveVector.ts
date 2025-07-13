import { AbstractVector } from "./AbstractVector";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { IComplexVector, IProjectiveVector, IRealVector, VectorFactory } from "./Vector";
import { Complex, ComplexWeight, ProjectiveVector, Vector } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

/**
 * Abstract base for projective vectors
 */
export abstract class AbstractProjectiveVector extends AbstractVector implements IProjectiveVector {

    get vectorSpace(): ProjectiveVectorSpace<any> { return this._vectorSpace as ProjectiveVectorSpace<any>; }

    abstract get weight(): Weight | ComplexWeight;
    abstract get homogeneousCoordinates(): (number | Complex)[];
    abstract normalize(): IProjectiveVector;
    abstract toCartesian(): IRealVector | IComplexVector;
    
    add(other: IProjectiveVector): IProjectiveVector {
        return super.add(other) as IProjectiveVector;
    }

    subtract(other: IProjectiveVector): IProjectiveVector {
        return super.subtract(other) as IProjectiveVector;
    }

    scale(scalar: number): IProjectiveVector {
        return super.scale(scalar) as IProjectiveVector;
    }

    toArray(): number[] {
        return this.homogeneousCoordinates.map(coord => 
            typeof coord === 'number' ? coord : coord.real
        );
    }

    protected createVectorFromRaw(raw: Vector): IProjectiveVector {
        return VectorFactory.createProjectiveVectorFromRaw(raw as ProjectiveVector, this.vectorSpace);
    }
}