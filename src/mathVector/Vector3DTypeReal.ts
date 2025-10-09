import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace, resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { REALVECTOR3D, RealVector3D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

const SPACE_DIMENSION = 3;

export class Vector3DTypeReal extends AbstractRealVector {
    private data: RealVector3D;
    protected _vectorSpace: RealVectorSpace<3>;
    
    constructor();
    constructor(x: number, y: number, z: number,vectorSpace?: RealVectorSpace<3>);
    constructor(vectorSpace: RealVectorSpace<3>);
    constructor(xOrVectorSpace?: number | RealVectorSpace<3>, y?: number, z?: number, vectorSpace?: RealVectorSpace<3>) {
        super();
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.data = { type: REALVECTOR3D, coordinates: [0, 0, 0] };
        } else {
            const x = xOrVectorSpace ?? 0;
            this.data = { type: REALVECTOR3D, coordinates: [x, y ?? 0, z ?? 0] };
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<3>;
            }
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return REALVECTOR3D; }
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get descriptor(): RealVector3D { return { ...this.data }; }
    get y(): number { return this.getCoordinate(1); }
    get z(): number { return this.getCoordinate(SPACE_DIMENSION - 1); }
    
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