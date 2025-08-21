import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { IVector } from "./Vector";
import { Complex, IdentifiableVectorSpace, Scalar, Vector, VectorSpace } from "./VectorSpaceConstructorInterface";

/**
 * Base abstract class implementing common IVector functionality
 */

export abstract class AbstractVector<VS extends IdentifiableVectorSpace<any, any> = IdentifiableVectorSpace<any, any>, V extends Vector = Vector, S extends Scalar = Scalar> implements IVector {
    
    protected abstract _vectorSpace: VS;

    abstract get dimension(): number;
    abstract get vectorType(): string;
    abstract get spaceType(): VectorSpaceType;
    abstract get raw(): V;
    abstract get coordinates(): (number | Complex)[];

    abstract getCoordinate(index: number): number | Complex;
    abstract setCoordinate(index: number, value: number | Complex): void;
    abstract clone(): IVector;
    

    get vectorSpace(): VS {
        return this._vectorSpace;
    }

    // Vector operations using the vector space
    add(other: IVector): IVector {
        this.validateCompatibility(other);
        const result = this._vectorSpace.addRaw(this.raw, other.raw as V);
        return this.createVectorFromRaw(result);
    }

    subtract(other: IVector): IVector {
        this.validateCompatibility(other);
        const result = this._vectorSpace.subtractRaw(this.raw, other.raw as V);
        return this.createVectorFromRaw(result);
    }

    scale(scalar: S): IVector {
        const result = this._vectorSpace.scaleRaw(scalar, this.raw);
        return this.createVectorFromRaw(result);
    }

    norm(): number {
        if ('norm' in this._vectorSpace && typeof this._vectorSpace.norm === 'function') {
            return (this._vectorSpace as any).norm(this.raw);
        }
        throw new Error('Norm operation not available for this vector space');
    }

    normalize(): IVector {
        const currentNorm = this.norm();
        if (currentNorm === 0) {
            throw new Error('Cannot normalize zero vector');
        }
        return this.scale((1 / currentNorm) as S);
    }

    dot(other: IVector): number | Complex {
        this.validateCompatibility(other);
        if ('dot' in this._vectorSpace && typeof this._vectorSpace.dot === 'function') {
            return (this._vectorSpace as any).dot(this.raw, other.raw);
        }
        throw new Error('Dot product not available for this vector space');
    }

    // Common implementations
    equals(other: IVector): boolean {
        if (this.dimension !== other.dimension || this.vectorType !== other.vectorType) {
            return false;
        }
        
        for (let i = 0; i < this.dimension; i++) {
            if (this.getCoordinate(i) !== other.getCoordinate(i)) {
                return false;
            }
        }
        return true;
    }

    abstract toArray(): number[];
    
    toString(): string {
        return `${this.vectorType}(${this.toArray().join(', ')})`;
    }

    // Enhanced validation that checks space identity
    protected validateCompatibility(other: IVector): void {
        if (this.dimension !== other.dimension) {
            throw new Error(`Vector dimensions do not match: ${this.dimension} vs ${other.dimension}`);
        }
        if (this.spaceType !== other.spaceType) {
            throw new Error(`Vector space types do not match: ${this.spaceType} vs ${other.spaceType}`);
        }
        // Check if vectors belong to the same vector space instance
        if (!this._vectorSpace.isSameSpace(other.vectorSpace as IdentifiableVectorSpace<any, any>)) {
            throw new Error(`Vectors belong to different vector spaces: ${this._vectorSpace.id} vs ${other.vectorSpace.id}`);
        }
    }

    // Allow operations between vectors from isomorphic spaces
    protected validateIsomorphicCompatibility(other: IVector): void {
        if (this.dimension !== other.dimension) {
            throw new Error(`Vector dimensions do not match: ${this.dimension} vs ${other.dimension}`);
        }
        if (this.spaceType !== other.spaceType) {
            throw new Error(`Vector space types do not match: ${this.spaceType} vs ${other.spaceType}`);
        }
        // Only check isomorphism, not exact space identity
        if (!this._vectorSpace.isIsomorphicTo(other.vectorSpace as IdentifiableVectorSpace<any, any>)) {
            throw new Error(`Vector spaces are not isomorphic`);
        }
    }

    protected abstract createVectorFromRaw(raw: Vector): IVector;
}
