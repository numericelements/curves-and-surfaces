import { AbstractRealVector } from "./AbstractRealVector";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { REALVECTOR4D, RealVector4D } from "./VectorSpaceConstructorInterface";

const SPACE_DIMENSION = 4;

export class Vector4DTypeReal extends AbstractRealVector {
    private data: RealVector4D;
    protected _vectorSpace: RealVectorSpace<4>;
    
    constructor(x: number = 0, y: number = 0, z: number = 0, t: number = 0, vectorSpace?: RealVectorSpace<4>) {
        super();
        this.data = { type: REALVECTOR4D, coordinates: [x, y, z, t] };
        this._vectorSpace = vectorSpace || resolveDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<4>;
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return 'Real4D'; }
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get raw(): RealVector4D { return { ...this.data }; }
    get y(): number { return this.getCoordinate(1); }
    get z(): number { return this.getCoordinate(2); }
    get w(): number { return this.getCoordinate(SPACE_DIMENSION - 1); }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) throw new RangeError('Coordinate index out of bounds');
        return this.data.coordinates[index];
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 4) throw new RangeError('Coordinate index out of bounds');
        this.data.coordinates[index] = value;
    }
    
    clone(): Vector4DTypeReal {
        return new Vector4DTypeReal(this.x!, this.y!, this.z!, this.w!);
    }
    
    static fromRaw(raw: RealVector4D): Vector4DTypeReal {
        return new Vector4DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3]);
    }
    
    static fromCoordinates(coords: number[]): Vector4DTypeReal {
        if (coords.length !== 4) throw new RangeError('4D vector requires exactly 4 coordinates');
        return new Vector4DTypeReal(coords[0], coords[1], coords[2], coords[3]);
    }
}
