import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { REALVECTOR2D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractRealVector } from "./AbstractRealVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ComplexWeight } from "./ComplexWeight";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DTypeComplex } from "./ProjectiveVector1DTypeComplex";
import { ProjectiveVector2DTypeReal } from "./ProjectiveVector2DTypeReal";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { Vector1DTypeComplex } from "./Vector1DTypeComplex";
import type { RealVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class Vector2DTypeReal extends AbstractRealVector<2> {

    private static readonly DIMENSION = 2 as const;
    private static readonly _vectorType = REALVECTOR2D;
    private readonly _descriptor: RealVector2D;
    protected readonly _vectorSpace: RealVectorSpace<2>;
    
    constructor();
    constructor(vectorSpace: RealVectorSpace<2>);
    constructor(x: number, y: number, vectorSpace?: RealVectorSpace<2>);

    constructor(xOrVectorSpace?: number | RealVectorSpace<2>, y?: number, vectorSpace?: RealVectorSpace<2>){
        super();
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this._descriptor = { type: REALVECTOR2D, coordinates: [0, 0] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof RealVectorSpace && y === undefined) {
            super.checkVectorSpaceDimensionConsistency(Vector2DTypeReal.DIMENSION, xOrVectorSpace);
            this._vectorSpace = xOrVectorSpace;
            this._descriptor = { type: REALVECTOR2D, coordinates: [0, 0] };
            return;
        }

        // Case 3: all coordinates with optional vectorSpace
        super.checkVectorSpaceConsistency(Vector2DTypeReal.DIMENSION, vectorSpace);
        if(typeof xOrVectorSpace !== 'number' || typeof y !== 'number') {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        this._descriptor = { type: REALVECTOR2D, coordinates: [xOrVectorSpace, y!] };
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }

    private getDefaultVectorSpace(): RealVectorSpace<2> {
        try{
            return getDefaultVectorSpace(this.spaceType, Vector2DTypeReal.DIMENSION);
        } catch(error) {
            return new RealVectorSpace(Vector2DTypeReal.DIMENSION, true);
        }
    }
    
    get dimension(): number { return Vector2DTypeReal.DIMENSION; }
    get vectorType(): string { return Vector2DTypeReal._vectorType; }
    get vectorSpace(): RealVectorSpace<2> { return this._vectorSpace; }
    get coordinates(): number[] { return [...this._descriptor.coordinates]; }
    get descriptor(): RealVector2D { return { ...this._descriptor }; }
    get y(): number { return this.getCoordinate(Vector2DTypeReal.DIMENSION - 1); }

    getCoordinate(index: number): number {
        if (index < 0 || index >= Vector2DTypeReal.DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this._descriptor.coordinates[index];
    }

    add(other: Vector2DTypeReal): Vector2DTypeReal {
        return new Vector2DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], this.vectorSpace);
    }

    subtract(other: Vector2DTypeReal): Vector2DTypeReal {
        return new Vector2DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], this.vectorSpace);
    }

    scale(scalar: number): Vector2DTypeReal {
        return new Vector2DTypeReal(super.scale(scalar).coordinates[0], super.scale(scalar).coordinates[1], this.vectorSpace);
    }

    dot(other: Vector2DTypeReal): number {
        return super.dot(other);
    }

    equals(other: Vector2DTypeReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector2DTypeReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector2DTypeReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }
    
    toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<3>): ProjectiveVector2DTypeReal {
        if (projectiveRealVectorSpace !== undefined) {
            if(projectiveRealVectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector2DTypeReal(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE, false), projectiveRealVectorSpace);
            }
            return new ProjectiveVector2DTypeReal(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE), projectiveRealVectorSpace);
        }
        return new ProjectiveVector2DTypeReal(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE));
    }

    toComplexVector(complexVectorSpace?: ComplexVectorSpace<1>): Vector1DTypeComplex {
        if (complexVectorSpace !== undefined) {
            return new Vector1DTypeComplex(this.x, this.y, complexVectorSpace);
        }
        return new Vector1DTypeComplex(this.x, this.y);
    }

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<2>): ProjectiveVector1DTypeComplex {
        if (projectiveComplexVectorSpace !== undefined) {
            if(projectiveComplexVectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector1DTypeComplex(new Complex(this.x, this.y), new ComplexWeight(new Weight(DEFAULT_WEIGHT_VALUE, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
            }
            return new ProjectiveVector1DTypeComplex(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false), projectiveComplexVectorSpace);
        }
        return new ProjectiveVector1DTypeComplex(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE), new  Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false));
    }
    
    clone(): Vector2DTypeReal {
        return new Vector2DTypeReal(this.x!, this.y!, this.vectorSpace);
    }

    createVectorFromDescriptor(descriptor: RealVector2D): Vector2DTypeReal {
        return new Vector2DTypeReal(descriptor.coordinates[0], descriptor.coordinates[1], this.vectorSpace);
    }
}