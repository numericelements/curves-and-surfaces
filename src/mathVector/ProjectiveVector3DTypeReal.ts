import { EM_WEIGHT_TOO_SMALL } from "../ErrorMessages/ProjectiveVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { PROJECTIVEVECTOR3D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { IVector } from "./Vector";
import { Vector3DTypeReal } from "./Vector3DTypeReal";
import { cloneDescriptorProjectiveRealVector3D, createProjectiveVector3DDescriptor } from "./VectorDescriptorFactory";
import type { ProjectiveVector3D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class ProjectiveVector3DTypeReal extends AbstractProjectiveVector<4> 
    implements IVector<4, ProjectiveVector3D>
{

    private static readonly DIMENSION = 4 as const;
    private static readonly _vectorType = PROJECTIVEVECTOR3D;
    private readonly _descriptor: ProjectiveVector3D;
    protected readonly _vectorSpace: ProjectiveVectorSpace<4>;
    
    constructor();
    constructor(vectorSpace: ProjectiveVectorSpace<4>);
    constructor(x: number, y: number, z: number, weight: Weight, vectorSpace?: ProjectiveVectorSpace<4>);
    constructor(x: number, y: number, z: number, vectorSpace?: ProjectiveVectorSpace<4>);

    constructor(xOrVectorSpace?: number | ProjectiveVectorSpace<4>, y?: number, z?: number, weightOrVSpace?: Weight | ProjectiveVectorSpace<4>, vectorSpace?: ProjectiveVectorSpace<4>) {
        super();
        let strictlyPosWeight = true;
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this._descriptor = createProjectiveVector3DDescriptor(0, 0, 0, new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight));
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof ProjectiveVectorSpace && y === undefined) {
            super.checkVectorSpaceDimensionConsistency(ProjectiveVector3DTypeReal.DIMENSION, xOrVectorSpace);
            this._vectorSpace = xOrVectorSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this._descriptor = createProjectiveVector3DDescriptor(0, 0, 0, new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight));
            return;
        }

        // Case 3: all coordinates and weight with optional vectorSpace
        if (typeof xOrVectorSpace === 'number' && typeof y === 'number' && typeof z === 'number' && weightOrVSpace instanceof Weight) {
            super.checkVectorSpaceConsistency(ProjectiveVector3DTypeReal.DIMENSION, vectorSpace);
            strictlyPosWeight = this.checkValidityWeightStatus(weightOrVSpace, vectorSpace as ProjectiveVectorSpace<4>);
            this._descriptor = createProjectiveVector3DDescriptor(xOrVectorSpace, y!, z!, weightOrVSpace);
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
            return;
        }

        // Case 4: all coordinates with optional vectorSpace
        if(typeof xOrVectorSpace !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        if (!(weightOrVSpace instanceof Weight) && vectorSpace === undefined) {
            super.checkVectorSpaceConsistency(ProjectiveVector3DTypeReal.DIMENSION, weightOrVSpace);
            this._vectorSpace = weightOrVSpace ?? this.getDefaultVectorSpace();;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this._descriptor = createProjectiveVector3DDescriptor(xOrVectorSpace, y!, z!, new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight));
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    private getDefaultVectorSpace(): ProjectiveVectorSpace<4> {
        try{
            return getDefaultVectorSpace(this.spaceType, ProjectiveVector3DTypeReal.DIMENSION);
        } catch(error) {
            return new ProjectiveVectorSpace(ProjectiveVector3DTypeReal.DIMENSION, true);
        }
    }
    
    get dimension(): number { return ProjectiveVector3DTypeReal.DIMENSION; }
    get vectorType(): string { return ProjectiveVector3DTypeReal._vectorType; }
    get vectorSpace(): ProjectiveVectorSpace<4> { return this._vectorSpace; }
    get coordinates(): number[] { return this.homogeneousCoordinates; }
    get descriptor(): ProjectiveVector3D { return cloneDescriptorProjectiveRealVector3D(this._descriptor); }

    get z(): number { return this.getCoordinate(2) };
    
    get weight(): Weight {
        return this._descriptor.coordinates[3].weight;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this._descriptor.coordinates[0], this._descriptor.coordinates[1], this._descriptor.coordinates[2], this.weight.value];
    }
    
    getCoordinate(index: number): number {
        if (index === ProjectiveVector3DTypeReal.DIMENSION - 1) {
            return this._descriptor.coordinates[3].weight.value;
        } else if(index === 0 || index === 1 || index === 2) {
            return this._descriptor.coordinates[index];
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    homogeneousTransform(tolerance?: number): this {
        if(tolerance === undefined) tolerance = NULL_WEIGHT_TOLERANCE;
        if(this.weight.value < tolerance) {
            const error = sendRangeErrorMessage(this.constructor.name, 'homogeneousTransform', EM_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const normalizedCoord = this.applyHomogeneousTransformation(tolerance);
        const newDescriptor: ProjectiveVector3D = createProjectiveVector3DDescriptor(normalizedCoord[0], normalizedCoord[1], normalizedCoord[2],
            new Weight(DEFAULT_WEIGHT_VALUE, this.weight.strictlyPositive));
        return this.createVectorFromDescriptor(newDescriptor);
    }

    add(other: ProjectiveVector3DTypeReal): this {
        const result = super.add(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: ProjectiveVector3DTypeReal): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    scale(factor: number): this {
        const result = super.scale(factor);
        return this.createVectorFromDescriptor(result.descriptor);
    }
    
    equals(other: ProjectiveVector3DTypeReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: ProjectiveVector3DTypeReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: ProjectiveVector3DTypeReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }
    
    toRealVector(vectorSpace?: RealVectorSpace<3>): Vector3DTypeReal {
        let vSpace = vectorSpace;
        if(vSpace === undefined) {
             try{
                vSpace = getDefaultVectorSpace(VectorSpaceType.REAL, 3);
            } catch(error) {
                vSpace = new RealVectorSpace(3, true);
            }
        }
        try {
            const normalized = this.homogeneousTransform();
            return new Vector3DTypeReal(
                normalized._descriptor.coordinates[0],
                normalized._descriptor.coordinates[1],
                normalized._descriptor.coordinates[2],
                vSpace
            );
        } catch (error) {
            return new Vector3DTypeReal(
                this._descriptor.coordinates[0],
                this._descriptor.coordinates[1],
                this._descriptor.coordinates[2],
                vSpace
            );
         }
     }

    toString(): string {
        return this.vectorType + `(${this._descriptor.coordinates[0]}, ${this._descriptor.coordinates[1]}, ${this._descriptor.coordinates[2]}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }
    
    clone(): this {
        let strictlyPosWeight = true;
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
        if(this._vectorSpace.weightManagement === WeightManagement.SomeNullWeights) strictlyPosWeight = this.weight.strictlyPositive;
        return new ProjectiveVector3DTypeReal(
            this._descriptor.coordinates[0],
            this._descriptor.coordinates[1],
            this._descriptor.coordinates[2],
            new Weight(this.weight.value, strictlyPosWeight),
            this._vectorSpace
        ) as this;
    }

    createVectorFromDescriptor(descriptor: ProjectiveVector3D): this {
        return new ProjectiveVector3DTypeReal(descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2], descriptor.coordinates[3].weight, this.vectorSpace) as this;
    }
}