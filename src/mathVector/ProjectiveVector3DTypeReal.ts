import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { PROJECTIVEVECTOR3D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { WEIGHT } from "../namedConstants/WeightTypeTags";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import type { ProjectiveVector3D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class ProjectiveVector3DTypeReal extends AbstractProjectiveVector<4> {

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
            this._descriptor = { type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof ProjectiveVectorSpace && y === undefined) {
            super.checkVectorSpaceDimensionConsistency(ProjectiveVector3DTypeReal.DIMENSION, xOrVectorSpace);
            this._vectorSpace = xOrVectorSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this._descriptor = { type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] };
            return;
        }

        // Case 3: all coordinates and weight with optional vectorSpace
        if (typeof xOrVectorSpace === 'number' && typeof y === 'number' && typeof z === 'number' && weightOrVSpace instanceof Weight) {
            super.checkVectorSpaceConsistency(ProjectiveVector3DTypeReal.DIMENSION, vectorSpace);
            strictlyPosWeight = this.checkValidityWeightStatus(weightOrVSpace, vectorSpace as ProjectiveVectorSpace<4>);
            this._descriptor = { 
                type: PROJECTIVEVECTOR3D, 
                coordinates: [xOrVectorSpace, y!, z!, { type: WEIGHT, weight: weightOrVSpace }] 
            };
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
            this._descriptor = { 
                type: PROJECTIVEVECTOR3D, 
                coordinates: [xOrVectorSpace, y!, z!, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] 
            };
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

    get descriptor(): ProjectiveVector3D { return { ...this._descriptor }; }

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

    add(other: ProjectiveVector3DTypeReal): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], super.add(other).coordinates[2], super.add(other).weight, this._vectorSpace);
    }

    subtract(other: ProjectiveVector3DTypeReal): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).coordinates[2], super.subtract(other).weight, this._vectorSpace);
    }

    scale(factor: number): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(super.scale(factor).coordinates[0], super.scale(factor).coordinates[1], super.scale(factor).coordinates[2], super.scale(factor).weight, this._vectorSpace);
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
    
    // toRealVector(realVSpace?: RealVectorSpace<3>): Vector3DTypeReal {
    //     if(this.weight.value < NULL_WEIGHT_TOLERANCE) {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'toVector3DReal', EM_WEIGHT_TOO_SMALL);
    //         throw new RangeError(error.generateMessageString());
    //     }
    //     if(realVSpace !== undefined) {
    //         return new Vector3DTypeReal(
    //             this.coordinates[0] / this.coordinates[SPACE_DIMENSION - 1],
    //             this.coordinates[1] / this.coordinates[SPACE_DIMENSION - 1],
    //             this.coordinates[2] / this.coordinates[SPACE_DIMENSION - 1],
    //             realVSpace
    //         );
    //     }
    //     return new Vector3DTypeReal(
    //         this.coordinates[0] / this.coordinates[SPACE_DIMENSION - 1],
    //         this.coordinates[1] / this.coordinates[SPACE_DIMENSION - 1],
    //         this.coordinates[2] / this.coordinates[SPACE_DIMENSION - 1]
    //     );
    // }

    toString(): string {
        return this.vectorType + `(${this._descriptor.coordinates[0]}, ${this._descriptor.coordinates[1]}, ${this._descriptor.coordinates[2]}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }
    
    clone(): ProjectiveVector3DTypeReal {
        let strictlyPosWeight = true;
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
        if(this._vectorSpace.weightManagement === WeightManagement.SomeNullWeights) strictlyPosWeight = this.weight.strictlyPositive;
        return new ProjectiveVector3DTypeReal(
            this._descriptor.coordinates[0],
            this._descriptor.coordinates[1],
            this._descriptor.coordinates[2],
            new Weight(this.weight.value, strictlyPosWeight),
            this._vectorSpace
        );
    }

    createVectorFromDescriptor(descriptor: ProjectiveVector3D): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2], descriptor.coordinates[3].weight, this.vectorSpace);
    }
}