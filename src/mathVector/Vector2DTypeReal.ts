import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { REALVECTOR2D, RealVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

const SPACE_DIMENSION = 2;

export class Vector2DTypeReal extends AbstractRealVector {
    private data: RealVector2D;
    protected _vectorSpace: RealVectorSpace<2>;
    
    constructor();
    constructor(x: number, y: number, vectorSpace?: RealVectorSpace<2>);
    constructor(vectorSpace: RealVectorSpace<2>);
    constructor(xOrVectorSpace?: number | RealVectorSpace<2>, y?: number, vectorSpace?: RealVectorSpace<2>){
        super();
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.data = { type: REALVECTOR2D, coordinates: [0, 0] };
        } else {
            const x = xOrVectorSpace ?? 0;
            this.data = { type: REALVECTOR2D, coordinates: [x, y ?? 0] };
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<2>;
            }
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
    
    // setCoordinate(index: number, value: number): void {
    //     if (index < 0 || index >= SPACE_DIMENSION) {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'setCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
    //         throw new RangeError(error.generateMessageString());
    //     }
    //     this.data.coordinates[index] = value;
    // }
    
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