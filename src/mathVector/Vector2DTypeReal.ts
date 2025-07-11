import { AbstractRealVector } from "./AbstractRealVector";
import { DefaultVectorSpaces } from "./DefaultVectorSpaces";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { REALVECTOR2D, RealVector2D } from "./VectorSpaceConstructorInterface";
import { RealVectorSpaceOfDimension } from "./VectorSpaceTypes";


export class Vector2DTypeReal extends AbstractRealVector {
    private data: RealVector2D;
    protected _vectorSpace: RealVectorSpace<2>;
    
    constructor(x: number = 0, y: number = 0, vectorSpace?: RealVectorSpace<2>) {
        super();
        this.data = { type: REALVECTOR2D, coordinates: [x, y] };
        this._vectorSpace = vectorSpace || resolveDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<2>;
    }
    
    get dimension(): number { return 2; }
    get vectorType(): string { return 'Real2D'; }
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get raw(): RealVector2D { return { ...this.data }; }
    
    // getDefaultVectorSpace(): RealVectorSpace<2> {
    //     // return DefaultVectorSpaces.getInstance().getRealVectorSpace(2);
    //     return resolveDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpaceOfDimension<2>;
    // }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
        return this.data.coordinates[index];
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
        this.data.coordinates[index] = value;
    }
    
    clone(): Vector2DTypeReal {
        return new Vector2DTypeReal(this.x!, this.y!, this.vectorSpace);
    }
    
    static fromRaw(raw: RealVector2D, vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal {
        return new Vector2DTypeReal(raw.coordinates[0], raw.coordinates[1], vectorSpace);
    }
    
    static fromCoordinates(coords: number[], vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal {
        if (coords.length !== 2) throw new RangeError('2D vector requires exactly 2 coordinates');
        return new Vector2DTypeReal(coords[0], coords[1], vectorSpace);
    }

    static create(x: number = 0, y: number = 0): Vector2DTypeReal {
        return new Vector2DTypeReal(x, y);
    }
}