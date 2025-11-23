import { AbstractComplexVector } from "./AbstractComplexVector";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { COMPLEX, IComplex, COMPLEXVECTOR1D, ComplexVector1D } from "./VectorSpaceConstructorInterface";


const SPACE_DIMENSION = 1;

export class Vector1DTypeComplex extends AbstractComplexVector {
    private data: IComplex;
    protected _vectorSpace: ComplexVectorSpace<1>;
    
    constructor();
    constructor(real: number, imaginary: number, vectorSpace?: ComplexVectorSpace<1>);
    constructor(vectorSpace: ComplexVectorSpace<1>);
    constructor(realOrVcetorSpace?: number | ComplexVectorSpace<1>, imaginary?: number, vectorSpace?: ComplexVectorSpace<1>) {
        super();
        if (realOrVcetorSpace instanceof ComplexVectorSpace) {
            this._vectorSpace = realOrVcetorSpace;
            this.data = { type: COMPLEX, real: 0, imaginary: 0 };
            return;
        } else {
            const real = realOrVcetorSpace ?? 0;
            this.data = { type: COMPLEX, real: real, imaginary: imaginary ?? 0 };
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<1>;
            }
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return COMPLEXVECTOR1D; }
    get real(): number { return this.data.real; }
    get imaginary(): number { return this.data.imaginary; }
        
    get coordinates(): number[] { return [this.data.real, this.data.imaginary]; }
    get descriptor(): ComplexVector1D { return this.data; }
    
    getCoordinate(index: number): IComplex {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        return this.data;
    }
    
    // setCoordinate(index: number, value: IComplex): void {
    //     if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
    //     this.data = value;
    // }

    
    clone(): Vector1DTypeComplex {
        return new Vector1DTypeComplex(this.data.real, this.data.imaginary, this.vectorSpace);
    }
    
    static fromRaw(raw: ComplexVector1D, vectorSpace?: ComplexVectorSpace<1>): Vector1DTypeComplex {
        return new Vector1DTypeComplex(raw.real, raw.imaginary, vectorSpace);
    }
}