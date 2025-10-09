import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace, resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { REALVECTOR4D, RealVector4D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

const SPACE_DIMENSION = 4;

export class Vector4DTypeReal extends AbstractRealVector {
    private data: RealVector4D;
    protected _vectorSpace: RealVectorSpace<4>;
    
    constructor();
    constructor(x: number, y: number, z: number, t: number, vectorSpace?: RealVectorSpace<4>);
    constructor(vectorSpace: RealVectorSpace<4>);
    constructor(xOrVectorSpace?: number | RealVectorSpace<4>, y?: number, z?: number, t?: number, vectorSpace?: RealVectorSpace<4>) {
        super();
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.data = { type: REALVECTOR4D, coordinates: [0, 0, 0, 0] };
        } else {
            const x = xOrVectorSpace ?? 0;
            this.data = { type: REALVECTOR4D, coordinates: [x, y ?? 0, z ?? 0, t ?? 0] };
                        if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<4>;
            }
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return REALVECTOR4D; }
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get descriptor(): RealVector4D { return { ...this.data }; }
    get y(): number { return this.getCoordinate(1); }
    get z(): number { return this.getCoordinate(2); }
    get t(): number { return this.getCoordinate(SPACE_DIMENSION - 1); }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.data.coordinates[index];
    }
    
    // setCoordinate(index: number, value: number): void {
    //     if (index < 0 || index >= SPACE_DIMENSION) {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'setCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
    //         throw new RangeError(error.generateMessageString());
    //     }
    //     this.data.coordinates[index] = value;
    // }
    
    clone(): Vector4DTypeReal {
        return new Vector4DTypeReal(this.x!, this.y!, this.z!, this.t!, this.vectorSpace);
    }
    
    static fromRaw(raw: RealVector4D): Vector4DTypeReal {
        return new Vector4DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3]);
    }
    
    static fromCoordinates(coords: number[]): Vector4DTypeReal {
        if (coords.length !== 4) throw new RangeError('4D vector requires exactly 4 coordinates');
        return new Vector4DTypeReal(coords[0], coords[1], coords[2], coords[3]);
    }
}
