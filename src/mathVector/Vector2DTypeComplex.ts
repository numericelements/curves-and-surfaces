import { AbstractComplexVector } from "./AbstractComplexVector";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { IComplex, COMPLEX, COMPLEXVECTOR2D, ComplexVector2D } from "./VectorSpaceConstructorInterface";

export class Vector2DTypeComplex extends AbstractComplexVector {
    private data: ComplexVector2D;
    protected _vectorSpace: ComplexVectorSpace<2>;
    
    constructor(real: number = 0, imaginary: number = 0, real2: number = 0, imaginary2: number = 0, vectorSpace?: ComplexVectorSpace<2>) {
        super();
        this.data = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary}, { type: COMPLEX, real: real2, imaginary: imaginary2}] };
        if(vectorSpace !== undefined) {
            this._vectorSpace = vectorSpace;
        } else {
            this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<2>;
        }
    }
    
    get dimension(): number { return 2; }
    
    get vectorType(): string { return 'Complex2D'; }
    
    getCoordinate(index: number): IComplex {
        if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
        return this.data.coordinates[index];
    }
    
    setCoordinate(index: number, value: IComplex): void {
        if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
        this.data.coordinates[index] = value;
    }
    
    // get coordinates(): Complex[] { return [...this.data.coordinates]; }
    get coordinates(): number[] { 
        let result: number[] = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(this.data.coordinates[i].real);
            result.push(this.data.coordinates[i].imaginary);
        }
        return result;
    }; 
    get descriptor(): ComplexVector2D { return this.data; }
    
    clone(): Vector2DTypeComplex {
        return new Vector2DTypeComplex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary, this.data.coordinates[1].real, this.data.coordinates[1].imaginary);
    }
    
    static fromRaw(raw: ComplexVector2D): Vector2DTypeComplex {
        return new Vector2DTypeComplex(raw.coordinates[0].real, raw.coordinates[0].imaginary, raw.coordinates[1].real, raw.coordinates[1].imaginary);
    }
}