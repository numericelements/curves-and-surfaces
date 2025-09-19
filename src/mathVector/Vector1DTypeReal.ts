import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace, resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { REALVECTOR1D, RealVector1D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

const SPACE_DIMENSION = 1;

export class Vector1DTypeReal extends AbstractRealVector {

    private value: number;
    protected _vectorSpace: RealVectorSpace<1>;

    constructor();
    constructor(value: number, vectorSpace?: RealVectorSpace<1>);
    constructor(vectorSpace: RealVectorSpace<1>); 
    constructor(xOrVectorSpace?: number | RealVectorSpace<1>, vectorSpace?: RealVectorSpace<1>) {
        super();
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.value = 0;
        } else {
            this.value = xOrVectorSpace ?? 0;
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<1>;
            }
        }
    }

    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return REALVECTOR1D; }
    get coordinates(): number[] { return [this.value]; }
    get raw(): RealVector1D { return this.value; }
    
    getCoordinate(index: number): number {
        if (index !== 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.value;
    }
    
    setCoordinate(index: number, value: number): void {
        if (index !== 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'setCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        this.value = value;
    }

    
    clone(): Vector1DTypeReal {
        return new Vector1DTypeReal(this.value, this.vectorSpace);
    }
    
    // Factory methods
    static fromRaw(raw: RealVector1D, vectorSpace?: RealVectorSpace<1>): Vector1DTypeReal {
        return new Vector1DTypeReal(raw, vectorSpace);
    }
    
    static fromCoordinates(coords: number[], vectorSpace?: RealVectorSpace<1>): Vector1DTypeReal {
        if (coords.length !== 1) throw new RangeError('1D vector requires exactly 1 coordinate');
        return new Vector1DTypeReal(coords[0], vectorSpace);
    }

    // Static method to create with default vector space
    static create(value: number = 0): Vector1DTypeReal {
        return new Vector1DTypeReal(value);
    }
}