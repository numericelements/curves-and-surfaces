import { WarningLog } from "../errorProcessing/ErrorLoging";
import { EM_NORM_TOO_SMALL, EM_VECTOR_NOT_APPLICABLE_TO_NORM, EM_VECTORS_DIFFERENT_DIM, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR, WM_VECTOR_NORM_TOO_SMALL } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { IVector } from "./Vector";
import { IComplex, IdentifiableVectorSpace, Scalar, Vector, VectorSpace } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

/**
 * Base abstract class implementing common IVector functionality
 */

export abstract class AbstractVector<VS extends IdentifiableVectorSpace<any, any> = IdentifiableVectorSpace<any, any>, V extends Vector = Vector, S extends Scalar = Scalar> implements IVector {
    
    protected abstract _vectorSpace: VS;

    abstract get dimension(): number;
    abstract get vectorType(): string;
    abstract get spaceType(): VectorSpaceType;
    abstract get descriptor(): V;
    abstract get coordinates(): (number | IComplex)[];

    abstract getCoordinate(index: number): number | IComplex;
    // abstract setCoordinate(index: number, value: number | Complex): void;
    abstract clone(): IVector;
    

    get vectorSpace(): VS {
        return this._vectorSpace;
    }

    // Vector operations using the vector space
    add(other: IVector): IVector {
        this.validateCompatibility(other);
        const result = this._vectorSpace.addRaw(this.descriptor, other.descriptor as V);
        return this.createVectorFromRaw(result);
    }

    subtract(other: IVector): IVector {
        this.validateCompatibility(other);
        const result = this._vectorSpace.subtractRaw(this.descriptor, other.descriptor as V);
        return this.createVectorFromRaw(result);
    }

    scale(scalar: S): IVector {
        const result = this._vectorSpace.scaleRaw(scalar, this.descriptor);
        return this.createVectorFromRaw(result);
    }

    revert(): IVector {
        const result = this._vectorSpace.scaleRaw(-1, this.descriptor);
        return this.createVectorFromRaw(result);
    }

    norm(tolerance?: number): number {
        if(tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        if ('normRaw' in this._vectorSpace && typeof this._vectorSpace.normRaw === 'function') {
            const norm = (this._vectorSpace as any).normRaw(this.descriptor);
            if(norm < tolerance) {
                const warning = new WarningLog(this.constructor.name, "norm", WM_VECTOR_NORM_TOO_SMALL);
                warning.logMessage();
            }
            return norm;
        }
        const error = sendRangeErrorMessage(this.constructor.name, 'norm', EM_VECTOR_NOT_APPLICABLE_TO_NORM);
        throw new RangeError(error.generateMessageString());
    }

    normalize(tolerance?: number): IVector {
        if(tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        const currentNorm = this.norm(tolerance);
        if (currentNorm < tolerance) {
            const error = sendRangeErrorMessage(this.constructor.name, 'normalize', EM_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        return this.scale((1 / currentNorm) as S);
    }

    dot(other: IVector): number | IComplex {
        this.validateCompatibility(other);
        if ('dotRaw' in this._vectorSpace && typeof this._vectorSpace.dotRaw === 'function') {
            return (this._vectorSpace as any).dotRaw(this.descriptor, other.descriptor);
        }
        throw new Error('Dot product not available for this vector space');
    }

    // Common implementations
    abstract equals(other: IVector, tolerance?: number): boolean;

    // abstract distanceToPoint(point: Point): number;
    // abstract angleTo(other: IVector): number;
    // abstract isColinear(other: IVector, tolerance?: number): boolean;
    abstract isOrthogonal(other: IVector, tolerance?: number): boolean;
    abstract isParallel(other: IVector, tolerance?: number): boolean;
    
    abstract toArray(): number[];
    
    toString(): string {
        return `${this.vectorType}(${this.toArray().join(', ')})`;
    }

    // Enhanced validation that checks space identity
    protected validateCompatibility(other: IVector): void {
        if (this.dimension !== other.dimension) {
            const error = sendRangeErrorMessage(this.constructor.name, 'validateCompatibility', EM_VECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
        // Check if vectors belong to the same vector space instance
        if (!this._vectorSpace.isSameSpace(other.vectorSpace as IdentifiableVectorSpace<any, any>)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'validateCompatibility', EM_VECTORS_NOT_IN_SAME_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    // Allow operations between vectors from isomorphic spaces
    // protected validateIsomorphicCompatibility(other: IVector): void {
    //     if (this.dimension !== other.dimension) {
    //         throw new Error(`Vector dimensions do not match: ${this.dimension} vs ${other.dimension}`);
    //     }
    //     if (this.spaceType !== other.spaceType) {
    //         throw new Error(`Vector space types do not match: ${this.spaceType} vs ${other.spaceType}`);
    //     }
    //     // Only check isomorphism, not exact space identity
    //     if (!this._vectorSpace.isIsomorphicTo(other.vectorSpace as IdentifiableVectorSpace<any, any>)) {
    //         throw new Error(`Vector spaces are not isomorphic`);
    //     }
    // }

    protected abstract createVectorFromRaw(raw: Vector): IVector;
}
