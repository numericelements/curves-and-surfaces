import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { REALVECTOR2D } from "../namedConstants/VectorTypeTags";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVector2DTypeReal } from "./ProjectiveVector2DTypeReal";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { IProjectiveVector } from "./Vector";
import type { RealVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 2;

export class Vector2DTypeReal extends AbstractRealVector {
    private readonly data: RealVector2D;
    protected readonly _vectorSpace: RealVectorSpace<2>;
    
    constructor();
    constructor(vectorSpace: RealVectorSpace<2>);
    constructor(x: number, y: number, vectorSpace?: RealVectorSpace<2>);

    constructor(xOrVectorSpace?: number | RealVectorSpace<2>, y?: number, vectorSpace?: RealVectorSpace<2>){
        super();
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this.data = { type: REALVECTOR2D, coordinates: [0, 0] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.data = { type: REALVECTOR2D, coordinates: [0, 0] };
            return;
        }

        // Case 3: all coordinates with optional vectorSpace
        this.data = { type: REALVECTOR2D, coordinates: [xOrVectorSpace, y!] };
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }

    private getDefaultVectorSpace(): RealVectorSpace<2> {
        try{
            return getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<2>;
        } catch(error) {
            return new RealVectorSpace(this.dimension, true) as RealVectorSpace<2>;
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return REALVECTOR2D; }
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get descriptor(): RealVector2D { return { ...this.data }; }
    get y(): number { return this.getCoordinate(SPACE_DIMENSION - 1); }

    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.data.coordinates[index];
    }

    add(other: Vector2DTypeReal): Vector2DTypeReal {
        // return super.add(other) as Vector2DTypeReal;
        return new Vector2DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], this.vectorSpace) as Vector2DTypeReal;
    }

    subtract(other: Vector2DTypeReal): Vector2DTypeReal {
        return new Vector2DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], this.vectorSpace) as Vector2DTypeReal;
    }

    scale(scalar: number): Vector2DTypeReal {
        return new Vector2DTypeReal(super.scale(scalar).coordinates[0], super.scale(scalar).coordinates[1], this.vectorSpace) as Vector2DTypeReal;
    }

    dot(other: Vector2DTypeReal): number {
        return super.dot(other);
    }

    equals(other: Vector2DTypeReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector2DTypeReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector2DTypeReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }
    
    toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<3>): IProjectiveVector {
        if (projectiveRealVectorSpace !== undefined) {
            if(projectiveRealVectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector2DTypeReal(this.x, this.y, new Weight(1, false), projectiveRealVectorSpace);
            }
            return new ProjectiveVector2DTypeReal(this.x, this.y, new Weight(), projectiveRealVectorSpace);
        }
        return new ProjectiveVector2DTypeReal(this.x, this.y, new Weight());
    }
    
    clone(): Vector2DTypeReal {
        return new Vector2DTypeReal(this.x!, this.y!, this.vectorSpace);
    }

    createVectorFromDescriptor(raw: RealVector2D): Vector2DTypeReal {
        return new Vector2DTypeReal(raw.coordinates[0], raw.coordinates[1], this.vectorSpace);
    }
    
    // static fromRaw(raw: RealVector2D, vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal {
    //     return new Vector2DTypeReal(raw.coordinates[0], raw.coordinates[1], vectorSpace);
    // }
    
    // static fromCoordinates(coords: number[], vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal {
    //     if (coords.length !== 2) throw new RangeError('2D vector requires exactly 2 coordinates');
    //     return new Vector2DTypeReal(coords[0], coords[1], vectorSpace);
    // }

    // static create(x: number = 0, y: number = 0): Vector2DTypeReal {
    //     return new Vector2DTypeReal(x, y);
    // }
}