import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { PROJECTIVEVECTOR3D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { WEIGHT } from "../namedConstants/WeightTypeTags";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import type { ProjectiveVector3D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 4;

export class ProjectiveVector3DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector3D;
    protected _vectorSpace: ProjectiveVectorSpace<4>;
    
    constructor();
    constructor(x: number, y: number, z: number);
    constructor(x: number, y: number, z: number, weight: Weight, vectorSpace?: ProjectiveVectorSpace<4>);
    constructor(x: number, y: number, z: number, vectorSpace?: ProjectiveVectorSpace<4>);
    constructor(vectorSpace: ProjectiveVectorSpace<4>);
    constructor(xOrVectorSpace?: number | ProjectiveVectorSpace<4>, y?: number, z?: number, weightOrVSpace?: Weight | ProjectiveVectorSpace<4>, vectorSpace?: ProjectiveVectorSpace<4>) {
        super();
        let strictlyPosWeight = true;
        if(xOrVectorSpace instanceof ProjectiveVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this.data = { type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, { type: WEIGHT, weight: new Weight(1, strictlyPosWeight) }] };
            return;
        } else if (weightOrVSpace instanceof ProjectiveVectorSpace) {
            this._vectorSpace = weightOrVSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            const x = xOrVectorSpace ?? 0;
            this.data = { 
                type: PROJECTIVEVECTOR3D, 
                coordinates: [x, y ?? 0, z ?? 0, { type: WEIGHT, weight: new Weight(1, strictlyPosWeight) }] 
            };
            return;
        } else {
            strictlyPosWeight = this.checkValidityWeightStatus(weightOrVSpace as Weight, vectorSpace as ProjectiveVectorSpace<4>);
            const x = xOrVectorSpace ?? 0;
            this.data = { 
                type: PROJECTIVEVECTOR3D, 
                coordinates: [x, y ?? 0, z ?? 0, { type: WEIGHT, weight: weightOrVSpace ?? new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] 
            };
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                try {
                    this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveVectorSpace<4>;
                } catch(error) {
                    this._vectorSpace = new ProjectiveVectorSpace(this.dimension, true) as ProjectiveVectorSpace<4>;
                }
            }
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }

    get vectorType(): string { return PROJECTIVEVECTOR3D; }

    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }

    get coordinates(): number[] { return this.homogeneousCoordinates; }

    get descriptor(): ProjectiveVector3D { return { ...this.data }; }

    get z(): number { return this.getCoordinate(2) };
    
    get weight(): Weight {
        return this.data.coordinates[3].weight;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0], this.data.coordinates[1], this.data.coordinates[2], this.weight.value];
    }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        if (index === SPACE_DIMENSION - 1) return this.data.coordinates[3].weight.value;
        return this.data.coordinates[index] as number;
    }

    add(other: ProjectiveVector3DTypeReal): ProjectiveVector3DTypeReal {
        // return super.add(other) as ProjectiveVector3DTypeReal;
        return new ProjectiveVector3DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], super.add(other).coordinates[2], super.add(other).weight, this._vectorSpace) as ProjectiveVector3DTypeReal;
    }

    subtract(other: ProjectiveVector3DTypeReal): ProjectiveVector3DTypeReal {
        // return super.subtract(other) as ProjectiveVector3DTypeReal;
        return new ProjectiveVector3DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).coordinates[2], super.subtract(other).weight, this._vectorSpace) as ProjectiveVector3DTypeReal;
    }

    scale(factor: number): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(super.scale(factor).coordinates[0], super.scale(factor).coordinates[1], super.scale(factor).coordinates[2], super.scale(factor).weight, this._vectorSpace) as ProjectiveVector3DTypeReal;
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
        return this.vectorType + `(${this.data.coordinates[0]}, ${this.data.coordinates[1]}, ${this.data.coordinates[2]}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }
    
    clone(): ProjectiveVector3DTypeReal {
        let strictlyPosWeight = true;
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
        if(this._vectorSpace.weightManagement === WeightManagement.SomeNullWeights) strictlyPosWeight = this.weight.strictlyPositive;
        return new ProjectiveVector3DTypeReal(
            this.data.coordinates[0],
            this.data.coordinates[1],
            this.data.coordinates[2],
            new Weight(this.weight.value, strictlyPosWeight),
            this._vectorSpace
        );
    }

    createVectorFromRaw(raw: ProjectiveVector3D): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3].weight, this.vectorSpace);
    }
    
    // static fromRaw(raw: ProjectiveVector3D): ProjectiveVector3DTypeReal {
    //     return new ProjectiveVector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3].weight);
    // }
}