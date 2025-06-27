import { IVector } from "./Vector";
import { Complex, COMPLEX, ProjectiveVector2D, PROJECTIVEVECTOR2D, ProjectiveVector3D, PROJECTIVEVECTOR3D, RealVector2D, REALVECTOR2D, RealVector3D, REALVECTOR3D, RealVector4D, REALVECTOR4D, Scalar, Vector, VectorSpace } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

/**
 * VectorInVectorSpace now uses the interface, making it much cleaner
 */
export class VectorInVectorSpace<K extends Scalar, V extends Vector, VS extends VectorSpace<K, V>> {
    constructor(
        private vectorInstance: IVector,
        private _space: VS
    ) {}

    get vector(): IVector {
        return this.vectorInstance;
    }

    get space(): VS {
        return this._space;
    }

    // Delegate coordinate access to the vector instance
    get x(): number | Complex | undefined { 
        return this.vectorInstance.dimension >= 1 ? this.vectorInstance.getCoordinate(0) : undefined; 
    }

    // Bound operations - return new bound vectors
    add(other: VectorInVectorSpace<K, V, VS> | IVector): VectorInVectorSpace<K, V, VS> {
        const otherVector = other instanceof VectorInVectorSpace ? other.vector : other;
        const result = this._space.addVectors(this.vectorInstance, otherVector);
        return new VectorInVectorSpace(result, this._space);
    }

//     subtract(other: V | VectorInVectorSpace<K, V, VS>): VectorInVectorSpace<K, V, VS> {
//         const otherVector = other instanceof VectorInVectorSpace ? other.raw : other;
//         const result = this._space.subtract(this._vector, otherVector);
//         return new VectorInVectorSpace(result, this._space);
//     }

//     scale(scalar: K): VectorInVectorSpace<K, V, VS> {
//         const result = this._space.scale(scalar, this._vector);
//         return new VectorInVectorSpace(result, this._space);
//     }

//     clone(): VectorInVectorSpace<K, V, VS> {
//         const result = this._space.clone(this._vector);
//         return new VectorInVectorSpace(result, this._space);
//     }

//     // Additional operations for real vectors
//     norm(): number {
//         if ('norm' in this._space && typeof this._space.norm === 'function') {
//             return (this._space as any).norm(this._vector);
//         }
//         throw new Error('Norm operation not available for this vector space');
//     }

//     normalize(): VectorInVectorSpace<K, V, VS> {
//         if ('normalize' in this._space && typeof this._space.normalize === 'function') {
//             const result = (this._space as any).normalize(this._vector);
//             return new VectorInVectorSpace(result, this._space);
//         }
//         throw new Error('Normalize operation not available for this vector space');
//     }

//     dot(other: V | VectorInVectorSpace<K, V, VS>): number {
//         if ('dot' in this._space && typeof this._space.dot === 'function') {
//             const otherVector = other instanceof VectorInVectorSpace ? other.raw : other;
//             return (this._space as any).dot(this._vector, otherVector);
//         }
//         throw new Error('Dot product not available for this vector space');
//     }

//     crossProduct(other: V | VectorInVectorSpace<K, V, VS>): VectorInVectorSpace<K, V, VS> {
//         if ('crossProduct' in this._space && typeof this._space.crossProduct === 'function') {
//             const otherVector = other instanceof VectorInVectorSpace ? other.raw : other;
//             const result = (this._space as any).crossProduct(this._vector, otherVector);
//             return new VectorInVectorSpace(result, this._space);
//         }
//         throw new Error('Cross product not available for this vector space');
//     
}

// /**
//  * Generic vector wrapper providing intuitive access to vector operations
//  * Represents a vector bound to its vector space for enhanced usability
//  */
// export class VectorInVectorSpace<K extends Scalar, V extends Vector | number, VS extends VectorSpace<K, any>> {
// // export class VectorInVectorSpace<K extends Scalar, V extends Vector, VS extends VectorSpace<K, V>> {
//     constructor(
//         private _vector: V,
//         private _space: VS
//     ) {}

//     // Raw vector access for interoperability
//     get raw(): V {
//         return this._vector;
//     }

//     // Vector space access
//     get space(): VS {
//         return this._space;
//     }

//     // Special handling for coordinate access
//     getCoordinate(index: number): number {
//         // Handle RealVector1D (which is just a number)
//         if (typeof this._vector === 'number') {
//             if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
//             return this._vector;
//         }
//         // Handle structured vectors
//         if (typeof this._vector === 'object' && 'coordinates' in this._vector) {
//             const coords = (this._vector as any).coordinates;
//             if (index < 0 || index >= coords.length) {
//                 throw new RangeError('Coordinate index out of bounds');
//             }
//             return coords[index];
//         }
        
//         throw new Error('Coordinate access not supported for this vector type');
//     }

//     // Generic coordinate access
//     // getCoordinate(index: number): number {
//     //     if (typeof this._vector !== "number") {
//     //         if (this._vector.type === REALVECTOR2D) {
//     //             const v = this._vector as RealVector2D;
//     //             if (index < 0 || index >= v.coordinates.length) throw new RangeError('Coordinate index out of bounds');
//     //             return v.coordinates[index];
//     //         }
//     //         if (this._vector.type === REALVECTOR3D) {
//     //             const v = this._vector as RealVector3D;
//     //             if (index < 0 || index >= v.coordinates.length) throw new RangeError('Coordinate index out of bounds');
//     //             return v.coordinates[index];
//     //         }
//     //         if (this._vector.type === REALVECTOR4D) {
//     //             const v = this._vector as RealVector4D;
//     //             if (index < 0 || index >= v.coordinates.length) throw new RangeError('Coordinate index out of bounds');
//     //             return v.coordinates[index];
//     //         }
//     //         throw new Error('Coordinate access not supported for this vector type');
//     //     }
//     //     throw new Error('Coordinate access not supported for this vector type');
//     // }

//     // Intuitive coordinate accessors
//     get x(): number { return this.getCoordinate(0); }
//     get y(): number { return this.getCoordinate(1); }
//     get z(): number { return this.getCoordinate(2); }
//     get w(): number { return this.getCoordinate(3); }

//     // Weight access for projective vectors
//     get weight(): Weight | undefined {
//         if (typeof this._vector !== "number" && this._vector.type === PROJECTIVEVECTOR2D) {
//             return (this._vector as ProjectiveVector2D).coordinates[2].value;
//         }
//         if (typeof this._vector !== "number" && this._vector.type === PROJECTIVEVECTOR3D) {
//             return (this._vector as ProjectiveVector3D).coordinates[3].value;
//         }
//         return undefined;
//     }

//     // Complex component access
//     get real(): number | undefined {
//         if (typeof this._vector !== "number" && this._vector.type === COMPLEX) {
//             return (this._vector as Complex).real;
//         }
//         return undefined;
//     }

//     get imaginary(): number | undefined {
//         if (typeof this._vector !== "number" && this._vector.type === COMPLEX) {
//             return (this._vector as Complex).imaginary;
//         }
//         return undefined;
//     }

//     // Bound operations - return new bound vectors
//     add(other: V | VectorInVectorSpace<K, V, VS>): VectorInVectorSpace<K, V, VS> {
//         const otherVector = other instanceof VectorInVectorSpace ? other.raw : other;
//         const result = this._space.add(this._vector, otherVector);
//         return new VectorInVectorSpace(result, this._space);
//     }

//     subtract(other: V | VectorInVectorSpace<K, V, VS>): VectorInVectorSpace<K, V, VS> {
//         const otherVector = other instanceof VectorInVectorSpace ? other.raw : other;
//         const result = this._space.subtract(this._vector, otherVector);
//         return new VectorInVectorSpace(result, this._space);
//     }

//     scale(scalar: K): VectorInVectorSpace<K, V, VS> {
//         const result = this._space.scale(scalar, this._vector);
//         return new VectorInVectorSpace(result, this._space);
//     }

//     clone(): VectorInVectorSpace<K, V, VS> {
//         const result = this._space.clone(this._vector);
//         return new VectorInVectorSpace(result, this._space);
//     }

//     // Additional operations for real vectors
//     norm(): number {
//         if ('norm' in this._space && typeof this._space.norm === 'function') {
//             return (this._space as any).norm(this._vector);
//         }
//         throw new Error('Norm operation not available for this vector space');
//     }

//     normalize(): VectorInVectorSpace<K, V, VS> {
//         if ('normalize' in this._space && typeof this._space.normalize === 'function') {
//             const result = (this._space as any).normalize(this._vector);
//             return new VectorInVectorSpace(result, this._space);
//         }
//         throw new Error('Normalize operation not available for this vector space');
//     }

//     dot(other: V | VectorInVectorSpace<K, V, VS>): number {
//         if ('dot' in this._space && typeof this._space.dot === 'function') {
//             const otherVector = other instanceof VectorInVectorSpace ? other.raw : other;
//             return (this._space as any).dot(this._vector, otherVector);
//         }
//         throw new Error('Dot product not available for this vector space');
//     }

//     crossProduct(other: V | VectorInVectorSpace<K, V, VS>): VectorInVectorSpace<K, V, VS> {
//         if ('crossProduct' in this._space && typeof this._space.crossProduct === 'function') {
//             const otherVector = other instanceof VectorInVectorSpace ? other.raw : other;
//             const result = (this._space as any).crossProduct(this._vector, otherVector);
//             return new VectorInVectorSpace(result, this._space);
//         }
//         throw new Error('Cross product not available for this vector space');
//     }
// }