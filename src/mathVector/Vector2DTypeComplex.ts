import { EM_UNSUPPORTED_API_WITH_COMPLEX_AND_REAL_COORDINATES, EM_VECTOR_COORDINATE_TYPE_INCONSISTENT } from "../ErrorMessages/ComplexVectors";
import { EM_TRANSFORMATION_NOT_AVAILABLE } from "../ErrorMessages/ComplexVectorSpace";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE } from "../namedConstants/Vectors";
import { COMPLEXVECTOR2D } from "../namedConstants/VectorTypeTags";
import { AbstractComplexVector } from "./AbstractComplexVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import type { IComplex, ComplexVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

const SPACE_DIMENSION = 2;

export class Vector2DTypeComplex extends AbstractComplexVector {
    private readonly data: ComplexVector2D;
    protected readonly _vectorSpace: ComplexVectorSpace<2>;

    constructor();
    constructor(real: number, imaginary: number, real2: number, imaginary2: number, vectorSpace?: ComplexVectorSpace<2>);
    constructor(complex1: Complex, complex2: Complex, vectorSpace?: ComplexVectorSpace<2>);
    constructor(vectorSpace: ComplexVectorSpace<2>);

    // Constructor overloads for complex number and number not supported by the API
    constructor(complex1: Complex, complex2: Complex, _unsupported1?: number, _unsupported2?: number, vectorSpace?: ComplexVectorSpace<2>);
    constructor(complex1: Complex, _unsupported1?: number, _unsupported2?: number, _unsupported3?: number, vectorSpace?: ComplexVectorSpace<2>);
    constructor(realOrComplexOrVectorSpace: number, complex2: Complex, _unsupported1?: number, _unsupported2?: number,vectorSpace?: ComplexVectorSpace<2>);
    constructor(realOrComplexOrVectorSpace: number, imaginaryOrComplex: number, _unsupported1?: ComplexVectorSpace<2>, _unsupported2?: number,vectorSpace?: ComplexVectorSpace<2>);

    constructor(realOrComplexOrVectorSpace?: number | Complex | ComplexVectorSpace<2>, imaginaryOrComplex?: number | Complex, real2OrVectorSpace?: number | ComplexVectorSpace<2>, imaginary2?: number, vectorSpace?: ComplexVectorSpace<2>) {
        super();
        const nullComplex: IComplex = { type: COMPLEX, real: 0, imaginary: 0 };
        if (realOrComplexOrVectorSpace instanceof ComplexVectorSpace) {
            this._vectorSpace = realOrComplexOrVectorSpace;
            // const nullComplex: IComplex = { type: COMPLEX, real: 0, imaginary: 0 };
            this.data = { type: COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex] };
            return;
        } else if (realOrComplexOrVectorSpace instanceof Complex) {
            const complex1 = realOrComplexOrVectorSpace;
            if(imaginaryOrComplex instanceof Complex) {
                // const complex1 = realOrComplexOrVectorSpace;
                const complex2 = imaginaryOrComplex;
                this.data = { type: COMPLEXVECTOR2D, coordinates: [
                    { type: COMPLEX, real: complex1.real, imaginary: complex1.imaginary },
                    { type: COMPLEX, real: complex2.real, imaginary: complex2.imaginary }
                ]};
                if (real2OrVectorSpace instanceof ComplexVectorSpace) {
                    this._vectorSpace = real2OrVectorSpace;
                } else if (vectorSpace !== undefined) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_UNSUPPORTED_API_WITH_COMPLEX_AND_REAL_COORDINATES);
                    throw new RangeError(error.generateMessageString());
                } else if (typeof real2OrVectorSpace === 'number' || typeof imaginary2 === 'number') {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_UNSUPPORTED_API_WITH_COMPLEX_AND_REAL_COORDINATES);
                    throw new RangeError(error.generateMessageString());
                } else {
                    try {
                        this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<2>;
                    } catch(error) {
                        this._vectorSpace = new ComplexVectorSpace(this.dimension, true) as ComplexVectorSpace<2>;
                    }
                }
                return;
            } else if (typeof imaginaryOrComplex === 'number') {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
                throw new RangeError(error.generateMessageString());
            } else {
                this.data = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: complex1.real, imaginary: complex1.imaginary }, nullComplex] };
                try {
                    this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<2>;
                } catch(error) {
                    this._vectorSpace = new ComplexVectorSpace(this.dimension, true) as ComplexVectorSpace<2>;
                }
                return;
            }
        } else if (realOrComplexOrVectorSpace === undefined) {
            // const nullComplex: IComplex = { type: COMPLEX, real: 0, imaginary: 0 };
            this.data = { type: COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex] };
            try {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<2>;
            } catch(error) {
                this._vectorSpace = new ComplexVectorSpace(this.dimension, true) as ComplexVectorSpace<2>;
            }
            return;
        } else {
            const real = realOrComplexOrVectorSpace ?? 0;
            if (typeof imaginaryOrComplex === 'number') { 
                real2OrVectorSpace = real2OrVectorSpace ?? 0;
                imaginary2 = imaginary2 ?? 0;
            } else if (imaginaryOrComplex instanceof Complex) {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
                throw new RangeError(error.generateMessageString());
            }
            const imaginary = imaginaryOrComplex ?? 0;
            if(typeof real2OrVectorSpace !== 'number') {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTOR_COORDINATE_TYPE_INCONSISTENT);
                throw new RangeError(error.generateMessageString());
            }
            real2OrVectorSpace = real2OrVectorSpace ?? 0;
            imaginary2 = imaginary2 ?? 0;
            this.data = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary}, { type: COMPLEX, real: real2OrVectorSpace, imaginary: imaginary2}] };
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                try {
                    this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<2>;
                } catch(error) {
                    this._vectorSpace = new ComplexVectorSpace(this.dimension, true) as ComplexVectorSpace<2>;
                }
            }
        }

    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    
    get vectorType(): string { return COMPLEXVECTOR2D; }
    
    getCoordinate(index: number): Complex {
        if (index < 0 || index >= 2) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return new Complex(this.data.coordinates[index].real, this.data.coordinates[index].imaginary);
    }
    
    get coordinates(): Complex[] { 
        let result: Complex[] = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(new Complex(this.data.coordinates[i].real, this.data.coordinates[i].imaginary));
        }
        return result;
    }; 
    get descriptor(): ComplexVector2D { return this.data; }
    
    add(other: Vector2DTypeComplex): Vector2DTypeComplex {
        return super.add(other) as Vector2DTypeComplex;
    }

    subtract(other: Vector2DTypeComplex): Vector2DTypeComplex {
        return super.subtract(other) as Vector2DTypeComplex;
    }

    dot(other: Vector2DTypeComplex): number {
        const error = sendRangeErrorMessage(this.constructor.name, 'dot', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    equals(other: Vector2DTypeComplex, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector2DTypeComplex, angularTolerance?: number): boolean {
        const error = sendRangeErrorMessage(this.constructor.name, 'isParallel', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

    isOrthogonal(other: Vector2DTypeComplex, angularTolerance?: number): boolean {
        const error = sendRangeErrorMessage(this.constructor.name, 'isOrthogonal', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }
    
    toString(): string {
        return this.vectorType + `(${this.coordinates[0].toString()}, ${this.coordinates[1].toString()})` + ` ` + this._vectorSpace.toString();
    }

    clone(): Vector2DTypeComplex {
        return new Vector2DTypeComplex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary, this.data.coordinates[1].real, this.data.coordinates[1].imaginary, this.vectorSpace);
    }

    createVectorFromDescriptor(vectorDescriptor: ComplexVector2D): Vector2DTypeComplex {
        return new Vector2DTypeComplex(vectorDescriptor.coordinates[0].real, vectorDescriptor.coordinates[0].imaginary, vectorDescriptor.coordinates[1].real, vectorDescriptor.coordinates[1].imaginary, this.vectorSpace);
    }
}