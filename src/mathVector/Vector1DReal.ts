import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { REALVECTOR1D } from "../namedConstants/VectorTypeTags";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import type { RealVector1D } from "./utilityTypes/VectorDescriptorTypes";
import type { Vector } from "./interfaces/VectorInterfaces";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";


export class Vector1DReal extends AbstractRealVector<1, RealVector1D> 
    implements Vector<1, RealVector1D>
{

    private static readonly DIMENSION = 1 as const;
    private static readonly _vectorType = REALVECTOR1D;
    private readonly value: number;
    protected readonly _vectorSpace: RealVectorSpace<1, RealVector1D>;

    constructor();
    constructor(vectorSpace: RealVectorSpace<1>); 
    constructor(value: number, vectorSpace?: RealVectorSpace<1>);

    constructor(xOrVectorSpace?: number | RealVectorSpace<1>, vectorSpace?: RealVectorSpace<1>) {
        super();
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this.value = 0;
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof RealVectorSpace && vectorSpace === undefined) {
            super.checkVectorSpaceDimensionConsistency(Vector1DReal.DIMENSION, xOrVectorSpace);
            this.value = 0;
            this._vectorSpace = xOrVectorSpace;
            return;
        }
        
        // Case 3: value with optional vectorSpace
        super.checkVectorSpaceConsistency(Vector1DReal.DIMENSION, vectorSpace);
        if(typeof xOrVectorSpace !== 'number') {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        this.value = xOrVectorSpace;
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }
    
    private getDefaultVectorSpace(): RealVectorSpace<1> {
        try{
            return getDefaultVectorSpace(this.spaceType, Vector1DReal.DIMENSION);
        } catch(error) {
            return new RealVectorSpace(Vector1DReal.DIMENSION, true);
        }
    }

    get dimension(): 1 { return Vector1DReal.DIMENSION; }
    get vectorType(): string { return Vector1DReal._vectorType; }
    get vectorSpace(): RealVectorSpace<1, RealVector1D> { return this._vectorSpace; }
    get coordinates(): readonly number[] { return [this.value]; }
    get descriptor(): RealVector1D { return this.value; }
    
    getCoordinate(index: number): number {
        if (index !== 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.value;
    }
    
    clone(): this {
        return this.createVectorFromDescriptor(this.descriptor);
    }

    add(other: Vector1DReal): this {
        const result = super.add(other);
        return this.createVectorFromDescriptor(result.coordinates[0]);
   }

    subtract(other: Vector1DReal): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.coordinates[0]);
    }

    scale(factor: number): this {
        const result = super.scale(factor);
        return this.createVectorFromDescriptor(result.coordinates[0]);
    }

    dot(other: Vector1DReal): number {
        return super.dot(other);
    }

    equals(other: Vector1DReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector1DReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector1DReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }

    createVectorFromDescriptor(value: number): this {
        return new Vector1DReal(value, this.vectorSpace) as this;
    }
}