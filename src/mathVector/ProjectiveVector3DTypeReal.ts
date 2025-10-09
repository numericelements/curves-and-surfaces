import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { getDefaultVectorSpace, resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { Vector3DTypeReal } from "./Vector3DTypeReal";
import { PROJECTIVEVECTOR3D, ProjectiveVector3D, WEIGHT } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 4;

export class ProjectiveVector3DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector3D;
    protected _vectorSpace: ProjectiveVectorSpace<4>;
    
    constructor(x: number = 0, y: number = 0,  z: number = 0, weight: Weight = new Weight(), vectorSpace?: ProjectiveVectorSpace<4>) {
        super();
        this.data = { 
            type: PROJECTIVEVECTOR3D, 
            coordinates: [x, y, z, { type: WEIGHT, value: weight }] 
        };
        if(vectorSpace !== undefined) {
            this._vectorSpace = vectorSpace;
        } else {
            this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveVectorSpace<4>;
        }

    }
    
    get dimension(): number { return SPACE_DIMENSION; }

    get vectorType(): string { return PROJECTIVEVECTOR3D; }

    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }

    get coordinates(): number[] { return this.homogeneousCoordinates; }

    get descriptor(): ProjectiveVector3D { return { ...this.data }; }
    
    get weight(): Weight {
        return this.data.coordinates[3].value;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0], this.data.coordinates[1], this.data.coordinates[2], this.weight.weight];
    }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        if (index === SPACE_DIMENSION - 1) return this.data.coordinates[3].value.weight;
        return this.data.coordinates[index] as number;
    }
    
    // setCoordinate(index: number, value: number): void {
    //     if (index < 0 || index >= 4) throw new RangeError('Coordinate index out of bounds');
    //     if (index === 3) {
    //         this.data.coordinates[3].value = new Weight(value);
    //     } else {
    //         this.data.coordinates[index] = value;
    //     }
    // }
    
    normalize(): ProjectiveVector3DTypeReal {
        const w = this.weight.weight;
        if (w === 0) return this.clone() as ProjectiveVector3DTypeReal;
        
        return new ProjectiveVector3DTypeReal(
            this.data.coordinates[0] / w,
            this.data.coordinates[1] / w,
            this.data.coordinates[2] / w,
            new Weight(1)
        );
    }
    
    toCartesian(): Vector3DTypeReal {
        const normalized = this.normalize();
        return new Vector3DTypeReal(
            normalized.data.coordinates[0],
            normalized.data.coordinates[1],
            normalized.data.coordinates[2]
        );
    }
    
    clone(): ProjectiveVector3DTypeReal {
        let strictlyPosWeight = true;
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
        if(this._vectorSpace.weightManagement === WeightManagement.SomeNullWeights) strictlyPosWeight = this.weight.strictlyPositive;
        return new ProjectiveVector3DTypeReal(
            this.data.coordinates[0],
            this.data.coordinates[1],
            this.data.coordinates[2],
            new Weight(this.weight.weight, strictlyPosWeight),
            this._vectorSpace
        );
    }

    static fromRaw(raw: ProjectiveVector3D): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3].value);
    }
}