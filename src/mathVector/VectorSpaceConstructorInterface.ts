/**
 * Core types and interfaces for vector space operations
 * Implements mathematical vector space axioms for real and complex numbers
 */

import { isVector1D, isVector2D, isVector3D } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

// ------------ Type Definitions ------------

export const COMPLEX = 'Complex';
export const WEIGHT = 'Weight';
export const REALVECTOR2D = 'RealVector2D';
export const COMPLEXVECTOR2D = 'ComplexVector2D';
export const PROJECTIVEVECTOR2D = 'ProjectiveVector2D';
export const REALVECTOR3D = 'RealVector3D';
export const COMPLEXVECTOR3D = 'ComplexVector3D';
export const PROJECTIVEVECTOR3D = 'ProjectiveVector3D';
export const REALVECTOR4D = 'RealVector4D';

/** Real numbers (ℝ) */
export type Real = number;

/** Complex numbers (ℂ) represented as [real, imaginary] */
// export type Complex = [number, number];
export interface Complex {
    type: typeof COMPLEX;
    real: number;
    imaginery: number;
}

export interface Weight_Interface {
    type: typeof WEIGHT;
    value: Weight;
}


/** Scalar types supported in calculations */
export type Scalar = Real | Complex;

/** Generic vector type for n-dimensional space */
export type RealVector = RealVector1D | RealVector2D | RealVector3D | RealVector4D;
export type ComplexVector = ComplexVector1D | ComplexVector2D | ComplexVector3D;
export type ProjectiveVector = ProjectiveVector2D | ProjectiveVector3D;
export type Vector = RealVector | ComplexVector | ProjectiveVector;

/** Specific vector type */
export type Vector1D = Scalar;

export type RealVector1D = Real;

export type Vector2D = RealVector2D | ComplexVector2D;
// export interface Vector2D {
//     type: typeof VECTOR2D;
//     coordinates: [Scalar, Scalar];
// }

export interface RealVector2D {
    type: typeof REALVECTOR2D;
    coordinates: [Real, Real];
}

export interface ProjectiveVector2D {
    type: typeof PROJECTIVEVECTOR2D;
    coordinates: [Real, Real, Weight_Interface];
}

export type Vector3D = RealVector3D | ComplexVector3D | ProjectiveVector2D;

// export type Vector3D = [number, number, number]
export interface RealVector3D {
    type: typeof REALVECTOR3D;
    coordinates: [Real, Real, Real];
}

export interface ProjectiveVector3D {
    type: typeof PROJECTIVEVECTOR3D;
    coordinates: [Real, Real, Real, Weight_Interface];
}

export interface RealVector4D {
    type: typeof REALVECTOR4D;
    coordinates: [Real, Real, Real, Real];
}

export type Vector4D = RealVector4D | ProjectiveVector3D;

export type ComplexVector1D = Complex;

export interface ComplexVector2D {
    type: typeof COMPLEXVECTOR2D;
    coordinates: [Complex, Complex];
}

export interface ComplexVector3D {
    type: typeof COMPLEXVECTOR3D;
    coordinates: [Complex, Complex, Complex];
}


// ------------ Complex Number Operations ------------

/**
 * Complex number operations helper class
 */
export class ComplexOps {
    /**
     * Adds two complex numbers
     */
    static add(a: Complex, b: Complex): Complex {
        return {type: COMPLEX, real: a.real + b.real, imaginery: a.imaginery + b.imaginery};
    }

    /**
     * Multiplies two complex numbers
     */
    static multiply(a: Complex, b: Complex): Complex {
        return {type: COMPLEX, 
            real: a.real * b.real - a.imaginery * b.imaginery,
            imaginery: a.real * b.imaginery + a.imaginery * b.real
        };
    }

    /**
     * Subtracts two complex numbers
     */
    static subtract(a: Complex, b: Complex): Complex {
        return {type: COMPLEX, real: a.real - b.real, imaginery: a.imaginery - b.imaginery};
    }

    /**
     * Returns the complex conjugate
     */
    static conjugate(a: Complex): Complex {
        return {type: COMPLEX, real: a.real, imaginery: -a.imaginery};
    }
}

// ------------ Vector Space Interface ------------

/**
 * Vector Space interface following mathematical axioms
 * V is a vector space over field K if it satisfies the vector space axioms
 */
export interface VectorSpace<K extends Scalar, V extends Vector> {
    /** Additive identity element (zero vector) */
    zero(): V;
    
    /** Vector addition (commutative group operation) */
    add(a: V, b: V): V;
    
    /** Scalar multiplication */
    scale(scalar: K, v: V): V;
    
    // /** Vector subtraction (derived operation) */
    // subtract(a: V, b: V): V;
    
    /** Dimension of the vector space */
    dimension(): number;
}

// ------------ Vector Space Implementations ------------

/**
 * Implementation of a real vector space
 */
export class RealVectorSpace implements VectorSpace<Real, RealVector> {
    private readonly dim: number;

    constructor(dimension: number) {
        if (dimension < 1) {
            throw new Error('Dimension must be positive');
        }
        this.dim = dimension;
    }

    zero(): RealVector {
        if(this.dim === 1) {
            return 0;
        } else if (this.dim === 2) {
            return {type: REALVECTOR2D, coordinates: [0, 0]};
        } else if (this.dim === 3) {
            return {type: REALVECTOR3D, coordinates: [0, 0, 0]};
        } else if (this.dim === 4) {
            return {type: REALVECTOR4D, coordinates: [0, 0, 0, 0]};
        } else {
            throw new Error('Dimension not supported');
        }
    }

    add(a: RealVector, b: RealVector): RealVector {
        if (typeof a === 'number' && typeof b === 'number') {
            return a + b;
        } else if ((isVector2D(a) && isVector2D(b)) || (isVector3D(a) && isVector3D(b))) {
            const result = [];
            for(let i = 0; i < a.coordinates.length; i++) {
                result.push(a.coordinates[i] + b.coordinates[i]);
            }
            if(isVector2D(a)) {
                return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
            } else if(isVector3D(a)) {
                return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
            } else {
            throw new Error('Vectors are out of the list of RealVector types.');
            }
        } else {
            throw new Error('Vectors must have the same dimension');
        }
    }

    scale(scalar: Real, v: RealVector): RealVector {
        if (typeof v === 'number') {
            return scalar * v;
        } else if (isVector2D(v)) {
            return {type: REALVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1]]};
        } else if (isVector3D(v)) {
            return {type: REALVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2]]};
        } else {
            throw new Error('Vector is out of the list of RealVector types.');
        }
    }

    // subtract(a: RealVector, b: RealVector): RealVector {
    //     if (typeof a === 'number' && typeof b === 'number') {
    //         return a - b;
    //     }
    //     return (a as number[]).map((val, i) => val - (b as number[])[i]);
    // }

    dimension(): number {
        return this.dim;
    }
}

export class ComplexVectorSpace implements VectorSpace<Complex, ComplexVector> {
    private readonly dim: number;

    constructor(dimension: number) {
        if (dimension < 1) {
            throw new Error('Dimension must be positive');
        }
        this.dim = dimension;
    }

    zero(): ComplexVector {
        const nullComplex: Complex = {type: COMPLEX, real: 0, imaginery: 0};
        if(this.dim === 1) {
            return nullComplex;
        } else if (this.dim === 2) {
            return {type: COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex]};
        } else if (this.dim === 3) {
            return {type: COMPLEXVECTOR3D, coordinates: [nullComplex, nullComplex, nullComplex]};
        } else {
            throw new Error('Dimension not supported');
        }
    }

    add(a: ComplexVector, b: ComplexVector): ComplexVector {
        if (isVector1D(a) && isVector1D(b)) {
            return ComplexOps.add(a as Complex, b as Complex);
        } else if(isVector2D(a) && isVector2D(b)) {
            return {type: COMPLEXVECTOR2D, coordinates: [
                ComplexOps.add(a.coordinates[0], b.coordinates[0]),
                ComplexOps.add(a.coordinates[1], b.coordinates[1])
            ]};
        } else if(isVector3D(a) && isVector3D(b)) {
            return {type: COMPLEXVECTOR3D, coordinates: [
                ComplexOps.add(a.coordinates[0], b.coordinates[0]),
                ComplexOps.add(a.coordinates[1], b.coordinates[1]),
                ComplexOps.add(a.coordinates[2], b.coordinates[2])
            ]};
        } else {
            throw new Error('Vectors must have the same dimension');
        }
    }

    // Overloaded scale method
    scale(scalar: Complex, vector: ComplexVector): ComplexVector;
    scale(scalar: number, vector: ComplexVector): ComplexVector;
    // Implementation of the scale method
    scale(scalar: Complex | number, vector: ComplexVector): ComplexVector {
        if (typeof scalar === 'number') {
            if(isVector1D(vector)) {
                return {type: COMPLEX, real: scalar * vector.real, imaginery: scalar * vector.imaginery};
            } else if(isVector2D(vector)) {
                // Directly scale the real part of the complex vector
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: vector.coordinates[0].real * scalar, imaginery: vector.coordinates[0].imaginery * scalar},
                    {type: COMPLEX, real: vector.coordinates[1].real * scalar, imaginery: vector.coordinates[1].imaginery * scalar}
                ]};
            } else if(isVector3D(vector)) {
                return {type: vector.type, coordinates: [
                    {type: COMPLEX, real: vector.coordinates[0].real * scalar, imaginery: vector.coordinates[0].imaginery * scalar},
                    {type: COMPLEX, real: vector.coordinates[1].real * scalar, imaginery: vector.coordinates[1].imaginery * scalar},
                    {type: COMPLEX, real: vector.coordinates[2].real * scalar, imaginery: vector.coordinates[2].imaginery * scalar}
                ]};
            } else {
                throw new Error('Vector is out of the list of ComplexVector types.');
            }
        } else if(scalar.type === COMPLEX) {
            if(isVector1D(vector)) {
                return {type: COMPLEX,
                    real: vector.real * scalar.real - vector.imaginery * scalar.imaginery,
                    imaginery: vector.real * scalar.imaginery + vector.imaginery * scalar.real}
            } else {
                throw new Error('Scalar is out of the list of Complex types.');
            }
        } else {
            throw new Error('Scalar is out of the list of Complex types.');
        }
    }



    // subtract(a: ComplexVector, b: ComplexVector): ComplexVector {
    //     if (isVector1D(a) && isVector1D(b)) {
    //         return ComplexOps.subtract(a as Complex, b as Complex);
    //     }
    //     return (a as Complex[]).map((val, i) => 
    //         ComplexOps.subtract(val, (b as Complex[])[i])
    //     );
    // }

    dimension() {
        return this.dim;
    }
}