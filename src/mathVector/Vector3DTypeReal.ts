import { AbstractRealVector } from "./AbstractRealVector";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { REALVECTOR3D, RealVector3D } from "./VectorSpaceConstructorInterface";

const SPACE_DIMENSION = 3;

export class Vector3DTypeReal extends AbstractRealVector {
    private data: RealVector3D;
    protected _vectorSpace: RealVectorSpace<3>;
    
    constructor(x: number = 0, y: number = 0, z: number = 0, vectorSpace?: RealVectorSpace<3>) {
        super();
        this.data = { type: REALVECTOR3D, coordinates: [x, y, z] };
        this._vectorSpace = vectorSpace || resolveDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<3>;
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return 'Real3D'; }
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get raw(): RealVector3D { return { ...this.data }; }
    get y(): number { return this.getCoordinate(1); }
    get z(): number { return this.getCoordinate(SPACE_DIMENSION - 1); }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) throw new RangeError('Coordinate index out of bounds');
        return this.data.coordinates[index];
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
        this.data.coordinates[index] = value;
    }

    
    clone(): Vector3DTypeReal {
        return new Vector3DTypeReal(this.x!, this.y!, this.z!, this.vectorSpace);
    }
    
    static fromRaw(raw: RealVector3D): Vector3DTypeReal {
        return new Vector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2]);
    }
    
    static fromCoordinates(coords: number[]): Vector3DTypeReal {
        if (coords.length !== 3) throw new RangeError('3D vector requires exactly 3 coordinates');
        return new Vector3DTypeReal(coords[0], coords[1], coords[2]);
    }
}