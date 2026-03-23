import { WarningLog } from "../errorProcessing/ErrorLoging";
import { EM_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_DIM, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR, WM_VECTOR_NORM_TOO_SMALL } from "../namedConstants/Vectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import type { IVector } from "./Vector";
import type { Vector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import type { Complex } from "./Complex";
import type { IdentifiableVectorSpace } from "./IVectorSpace";
import { EM_DOT_PRODUCT_NOT_AVAILABLE } from "../ErrorMessages/ProjectiveVectors";

/**
 * Base abstract class implementing common IVector functionality
 */

export abstract class AbstractVector <
        D extends number = number,
        V extends Vector = Vector,
        VS extends IdentifiableVectorSpace<V> = IdentifiableVectorSpace<V>
    > implements IVector<D, V> {
    
    protected abstract readonly _vectorSpace: VS;

    abstract get dimension(): number;
    abstract get vectorType(): string;
    abstract get vectorSpace(): VS;
    abstract get spaceType(): VectorSpaceType;
    abstract get descriptor(): V;
    abstract get coordinates(): (number | Complex)[];

    abstract getCoordinate(index: number): number | Complex;
    abstract clone(): this;

    add(other: IVector<D, V>): this {
        this.validateCompatibility(other);
        const result = this._vectorSpace.addDescriptors(this.descriptor, other.descriptor);
        return this.createVectorFromDescriptor(result);
    }

    subtract(other: IVector<D, V>): this {
        this.validateCompatibility(other);
        const result = this._vectorSpace.subtractDescriptors(this.descriptor, other.descriptor);
        return this.createVectorFromDescriptor(result);
    }

    abstract scale(scalar: number | Complex): this;

    revert(): this {
        const scale = -1;
        const result = this._vectorSpace.scaleDescriptor(scale, this.descriptor);
        return this.createVectorFromDescriptor(result);
    }

    norm(tolerance?: number): number {
        if(tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        const norm = this._vectorSpace.normDescriptor(this.descriptor);
        if(norm < tolerance) {
            const warning = new WarningLog(this.constructor.name, "norm", WM_VECTOR_NORM_TOO_SMALL);
            warning.logMessage();
        }
        return norm;
    }

    normalize(tolerance?: number): this {
        if(tolerance === undefined) tolerance = LINEAR_TOL_VECTOR;
        const currentNorm = this.norm(tolerance);
        if (currentNorm < tolerance) {
            const error = sendRangeErrorMessage(this.constructor.name, 'normalize', EM_NORM_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        return this.scale(1 / currentNorm);
    }

    /**
     * Euclidean distance between points
     * 
     * For projective spaces: computed after projection into the affine space
     * For complex spaces: uses the Hermitian norm (equivalent to Euclidean in ℝ²ⁿ)
     * 
     * @returns Distance in the user geometric space (2D/3D)
     */
    abstract distanceTo(other: IVector<D, V>): number;

    abstract affineDistance(other: IVector<D, V>): number;

    dot(other: IVector<D, V>): number {
        this.validateCompatibility(other);
        if ('dotDescriptors' in this._vectorSpace && typeof this._vectorSpace.dotDescriptors === 'function') {
            return this._vectorSpace.dotDescriptors(this.descriptor, other.descriptor);
        }
        const error = sendRangeErrorMessage(this.constructor.name, 'dot', EM_DOT_PRODUCT_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

    equals(other: IVector<D, V>, tolerance?: number): boolean {
        if(this._vectorSpace !== other.vectorSpace) {
            const error = sendRangeErrorMessage(this.constructor.name, 'equals', EM_VECTORS_DIFFERENT_VECTOR_SPACES);
            throw new RangeError(error.generateMessageString());
        }
        const currentVector = this.toArray();
        const otherVector = other.toArray();
        const tol = tolerance ?? LINEAR_TOL_VECTOR;
        for (let i = 0; i < currentVector.length; i++) {
            if (Math.abs(currentVector[i] - otherVector[i]) > tol) {
                return false;
            }
        }
        return true;
    }

    // Common implementations
    // abstract distanceToPoint(point: Point): number;
    // abstract angleTo(other: IVector): number;
    // abstract isColinear(other: IVector, tolerance?: number): boolean;
    abstract isOrthogonal(other: IVector<D, V>, tolerance?: number): boolean;
    abstract isParallel(other: IVector<D, V>, tolerance?: number): boolean;
    
    abstract toArray(): number[];
    
    abstract toString(): string;

    // Enhanced validation that checks space identity
    protected validateCompatibility(other: IVector<D, V>): void {
        if (this.dimension !== other.dimension) {
            const error = sendRangeErrorMessage(this.constructor.name, 'validateCompatibility', EM_VECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
        // Check if vectors belong to the same vector space instance
        if (!this._vectorSpace.isSameSpace(other.vectorSpace)) {
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

    protected abstract createVectorFromDescriptor(descriptor: V): this;
}
