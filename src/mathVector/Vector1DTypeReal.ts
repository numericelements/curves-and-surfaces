import { AbstractRealVector } from "./AbstractRealVector";
import { DefaultVectorSpaces } from "./DefaultVectorSpaces";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { RealVector1D } from "./VectorSpaceConstructorInterface";


export class Vector1DTypeReal extends AbstractRealVector {
    protected _vectorSpace: RealVectorSpace<1>;

    constructor(value: number = 0, vectorSpace?: RealVectorSpace<1>) {
        super();
        this.value = value;
        this._vectorSpace = vectorSpace || resolveDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<1>;
    }

    private value: number;

    get dimension(): number { return 1; }
    get vectorType(): string { return 'Real1D'; }
    
    // protected getDefaultVectorSpace(): RealVectorSpace<1> {
    //     return DefaultVectorSpaces.getInstance().getRealVectorSpace(1);
    // }
    
    getCoordinate(index: number): number {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        return this.value;
    }
    
    setCoordinate(index: number, value: number): void {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        this.value = value;
    }
    
    get coordinates(): number[] { return [this.value]; }
    get raw(): RealVector1D { return this.value; }
    
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