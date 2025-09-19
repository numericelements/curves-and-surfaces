import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { getDefaultVectorSpace, resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { PROJECTIVEVECTOR2D, ProjectiveVector2D, WEIGHT } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 3;

export class ProjectiveVector2DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector2D;
    protected _vectorSpace: ProjectiveVectorSpace<3>;
    
    constructor();
    constructor(x: number, y: number, weight: Weight, vectorSpace?: ProjectiveVectorSpace<3>);
    constructor(x: number, y: number, vectorSpace?: ProjectiveVectorSpace<3>);
    constructor(vectorSpace: ProjectiveVectorSpace<3>);
    constructor(xOrVectorSpace?: number | ProjectiveVectorSpace<3>, y?: number, weightOrVSpace?: Weight | ProjectiveVectorSpace<3>, vectorSpace?: ProjectiveVectorSpace<3>) {
        super();
        let strictlyPosWeight = true;
        if(xOrVectorSpace instanceof ProjectiveVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            if(this._vectorSpace.weightManagement !== WeightManagement.AllStrictlyPositiveWeights) strictlyPosWeight = false;
            this.data = { type: PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WEIGHT, value: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] };
            return;
        } else if (weightOrVSpace instanceof ProjectiveVectorSpace) {
            this._vectorSpace = weightOrVSpace;
            if(this._vectorSpace.weightManagement !== WeightManagement.AllStrictlyPositiveWeights) strictlyPosWeight = false;
            const x = xOrVectorSpace ?? 0;
            this.data = { 
                type: PROJECTIVEVECTOR2D, 
                coordinates: [x, y ?? 0, { type: WEIGHT, value: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] 
            };
            return;
        } else {
            if(vectorSpace !== undefined && vectorSpace.weightManagement !== WeightManagement.AllStrictlyPositiveWeights) strictlyPosWeight = false;
            const x = xOrVectorSpace ?? 0;
            this.data = { 
                type: PROJECTIVEVECTOR2D, 
                coordinates: [x, y ?? 0, { type: WEIGHT, value: weightOrVSpace ?? new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] 
            };
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveVectorSpace<3>;
            }
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; } // Homogeneous coordinates
    get vectorType(): string { return PROJECTIVEVECTOR2D; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }
    get coordinates(): number[] { return this.homogeneousCoordinates; }
    get raw(): ProjectiveVector2D { return { ...this.data }; }

    get weight(): Weight {
        return this.data.coordinates[2].value;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0], this.data.coordinates[1], this.weight.weight];
    }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
        if (index === 2) return this.weight.weight;
        return this.data.coordinates[index] as number;
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
        if (index === 2) {
            this.data.coordinates[2].value = new Weight(value);
        } else {
            this.data.coordinates[index] = value;
        }
    }
    
    normalize(): ProjectiveVector2DTypeReal {
        const w = this.weight.weight;
        if (w === 0) return this.clone() as ProjectiveVector2DTypeReal;
        
        return new ProjectiveVector2DTypeReal(
            this.data.coordinates[0] / w,
            this.data.coordinates[1] / w,
            new Weight(1)
        );
    }
    
    toCartesian(): Vector2DTypeReal {
        const normalized = this.normalize();
        return new Vector2DTypeReal(
            normalized.data.coordinates[0],
            normalized.data.coordinates[1]
        );
    }
    
    clone(): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(
            this.data.coordinates[0],
            this.data.coordinates[1],
            new Weight(this.weight.weight)
        );
    }

    static fromRaw(raw: ProjectiveVector2D): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2].value);
    }
}