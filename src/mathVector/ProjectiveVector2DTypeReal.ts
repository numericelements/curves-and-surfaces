import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { PROJECTIVEVECTOR2D, ProjectiveVector2D, WEIGHT } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

export class ProjectiveVector2DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector2D;
    protected _vectorSpace: ProjectiveVectorSpace<3>;
    
    constructor(x: number = 0, y: number = 0, weight: Weight = new Weight(), vectorSpace?: ProjectiveVectorSpace<3>) {
        super();
        this.data = { 
            type: PROJECTIVEVECTOR2D, 
            coordinates: [x, y, { type: WEIGHT, value: weight }] 
        };
        this._vectorSpace = vectorSpace || resolveDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveVectorSpace<3>;
    }
    
    get dimension(): number { return 3; } // Homogeneous coordinates
    get vectorType(): string { return 'ProjectiveReal2D'; }
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