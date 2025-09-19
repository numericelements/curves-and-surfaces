import { AbstractComplexVector } from "./AbstractComplexVector";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { getDefaultVectorSpace, resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { COMPLEX, Complex, ComplexVector1D } from "./VectorSpaceConstructorInterface";

export class Vector1DTypeComplex extends AbstractComplexVector {
    private data: Complex;
    protected _vectorSpace: ComplexVectorSpace<1>;
    
    constructor(real: number = 0, imaginary: number = 0, vectorSpace?: ComplexVectorSpace<1>) {
        super();
        this.data = { type: COMPLEX, real, imaginary };
        if(vectorSpace !== undefined) {
            this._vectorSpace = vectorSpace;
        } else {
            this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<1>;
        }
    }
    
    get dimension(): number { return 1; }
    get vectorType(): string { return 'Complex1D'; }
    
    getCoordinate(index: number): Complex {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        return this.data;
    }
    
    setCoordinate(index: number, value: Complex): void {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        this.data = value;
    }
    
    get coordinates(): Complex[] { return [this.data]; }
    get raw(): ComplexVector1D { return this.data; }
    
    clone(): Vector1DTypeComplex {
        return new Vector1DTypeComplex(this.data.real, this.data.imaginary, this.vectorSpace);
    }
    
    static fromRaw(raw: ComplexVector1D, vectorSpace?: ComplexVectorSpace<1>): Vector1DTypeComplex {
        return new Vector1DTypeComplex(raw.real, raw.imaginary, vectorSpace);
    }
}