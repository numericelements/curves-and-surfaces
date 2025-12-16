
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ComplexWeight } from "./ComplexWeight";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DTypeComplex } from "./ProjectiveVector1DTypeComplex";
import { ProjectiveVector2DTypeReal } from "./ProjectiveVector2DTypeReal";
import { ProjectiveVector3DTypeReal } from "./ProjectiveVector3DTypeReal";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { Vector1DTypeComplex } from "./Vector1DTypeComplex";
import { Vector1DTypeReal } from "./Vector1DTypeReal";
import { Vector2DTypeComplex } from "./Vector2DTypeComplex";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { Vector3DTypeReal } from "./Vector3DTypeReal";
import { Vector4DTypeReal } from "./Vector4DTypeReal";
import { IComplex, ComplexVector, ProjectiveComplexVector, ProjectiveVector, RealVector, Scalar, Vector } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";


/**
 * Vector Space interface following mathematical axioms
 * V is a vector space over field K if it satisfies the vector space axioms
 */
export interface VectorSpace<K extends Scalar, V extends Vector> {
    /** Additive identity element (zero vector) */
    defaultVect(): V;
    
    /** Vector addition (commutative group operation) */
    addRaw(a: V, b: V): V;
    
    /** Scalar multiplication */
    scaleRaw(scalar: K, v: V): V;
    
    /** Vector subtraction (derived operation) */
    subtractRaw(a: V, b: V): V;
    
    /** Dimension of the vector space */
    dimension(): number;

    /** Duplicate vector */
    cloneRaw(v: V): V;

    addVectors(v1: IVector, v2: IVector): IVector;
}


/**
 * Enhanced Vector Space Interface with Identity
 */
export interface IdentifiableVectorSpace<K extends Scalar, V extends Vector> extends VectorSpace<K, V> {
    /** Unique identifier for this vector space instance */
    readonly id: string;
    
    /** Human-readable name for this vector space */
    readonly name: string;
    
    /** Whether this is a default vector space managed by singleton */
    readonly isDefault: boolean;
    
    /** Type of vector space (Real, Complex, etc.) */
    readonly spaceType: VectorSpaceType;
    
    /** Check if this vector space is the same as another */
    isSameSpace(other: IdentifiableVectorSpace<any, any>): boolean;
    
    /** Check if this vector space is isomorphic to another */
    isIsomorphicTo(other: IdentifiableVectorSpace<any, any>): boolean;
}

/**
 * Core vector interface - all vector classes implement this
 */

export interface IVector {
    readonly dimension: number;
    readonly vectorType: string;
    readonly spaceType: VectorSpaceType;
    readonly vectorSpace: IdentifiableVectorSpace<any, any>; // The vector space this vector belongs to
    
    // Coordinate access
    getCoordinate(index: number): number | Complex;
    // setCoordinate(index: number, value: number | Complex): void;
    readonly coordinates: (number | Complex)[];
    
    // Raw data access for interoperability
    readonly descriptor: Vector;
    
    // Basic operations - now can be performed directly on vectors
    clone(): IVector;
    equals(other: IVector): boolean;
    add(other: IVector): IVector;
    subtract(other: IVector): IVector;
    scale(scalar: Scalar | Complex): IVector;
    revert(): IVector;
    
    // Vector space operations
    norm(): number;
    normalize(tolerance?: number): IVector;
    dot(other: IVector): number | IComplex;
    isParallel(other: IVector, tolerance?: number): boolean;
    isOrthogonal(other: IVector, tolerance?: number): boolean;
    
    // Conversion utilities
    toArray(): number[];
    toString(): string;
}


/**
 * Real vector specific interface
 */

export interface IRealVector extends IVector {
    readonly vectorSpace: RealVectorSpace<any>;
    getCoordinate(index: number): number;
    // setCoordinate(index: number, value: number): void;
    readonly coordinates: number[];
    readonly descriptor: RealVector;
    
    add(other: IRealVector): IRealVector;
    subtract(other: IRealVector): IRealVector;
    scale(scalar: number): IRealVector;
    dot(other: IRealVector): number;
    
    // Real vector specific accessors
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly t?: number;
}

/**
 * Complex vector specific interface
 */

export interface IComplexVector extends IVector {
    readonly vectorSpace: ComplexVectorSpace<any>;
    getCoordinate(index: number): Complex;
    // setCoordinate(index: number, value: Complex): void;
    // readonly coordinates: Complex[];
    readonly coordinates: Complex[];
    readonly descriptor: ComplexVector;

    add(other: IComplexVector): IComplexVector;
    subtract(other: IComplexVector): IComplexVector;
    // scale(scalar: number): IComplexVector;
    // scale(scalar: Complex): IComplexVector;
    scale(scalar: number | Complex): IComplexVector;
    
    // Complex-specific methods
    getReal(index: number): number;
    getImaginary(index: number): number;
    // setReal(index: number, value: number): void;
    // setImaginary(index: number, value: number): void;
}

/**
 * Projective vector specific interface
 */

export interface IProjectiveVector extends IVector {
    readonly vectorSpace: ProjectiveVectorSpace<any>;
    readonly weight: Weight;
    readonly descriptor: ProjectiveVector;
    readonly coordinates: number[];
    readonly homogeneousCoordinates: (number | IComplex)[];
    getCoordinate(index: number): number;
    
    add(other: IProjectiveVector): IProjectiveVector;
    subtract(other: IProjectiveVector): IProjectiveVector;
    scale(scalar: number): IProjectiveVector;

    // Projective-specific methods
    clone(): IProjectiveVector;
    normalize(): IProjectiveVector;
    toRealVector(realVectorSpace?: RealVectorSpace<any>): IRealVector;
}

export interface IProjectiveComplexVector extends IVector {
    readonly vectorSpace: ProjectiveComplexVectorSpace<any>;
    readonly weight: ComplexWeight;
    readonly homogeneousCoordinates: (number | IComplex)[];
    getCoordinate(index: number): Complex;
    // setCoordinate(index: number, value: Complex): void;
    
    add(other: IProjectiveComplexVector): IProjectiveComplexVector;
    subtract(other: IProjectiveComplexVector): IProjectiveComplexVector;
    scale(scalar: number): IProjectiveComplexVector;

    // Projective-specific methods
    normalize(): IProjectiveComplexVector;
    toComplexVector(): IRealVector | IComplexVector;
}


/**
 * Enhanced factory that handles vector space assignment
 */
export class VectorFactory {
    static createRealVectorFromRaw(raw: RealVector, vectorSpace?: RealVectorSpace<any>): IRealVector {
        if (typeof raw === 'number') {
            return new Vector1DTypeReal(raw, vectorSpace as RealVectorSpace<1>);
        }
        
        if (typeof raw === 'object' && 'type' in raw) {
            const string = raw.type;
            switch (raw.type) {
                case REALVECTOR2D:
                    return new Vector2DTypeReal(
                        raw.coordinates[0], 
                        raw.coordinates[1], 
                        vectorSpace as RealVectorSpace<2>
                    );
                case REALVECTOR3D:
                    return new Vector3DTypeReal(
                        raw.coordinates[0], 
                        raw.coordinates[1], 
                        raw.coordinates[2], 
                        vectorSpace as RealVectorSpace<3>
                    );
                case REALVECTOR4D:
                    return new Vector4DTypeReal(
                        raw.coordinates[0], 
                        raw.coordinates[1], 
                        raw.coordinates[2], 
                        raw.coordinates[3], 
                        vectorSpace as RealVectorSpace<4>
                    );
                default:
                    throw new Error(`Unsupported real vector type: ${string}`);
            }
        }
        
        throw new Error('Cannot create real vector from raw data');
    }

    static createComplexVectorFromRaw(raw: ComplexVector, vectorSpace?: ComplexVectorSpace<any>): IComplexVector {
        if (typeof raw === 'object' && 'type' in raw) {
            const string = raw.type;
            switch (raw.type) {
                case COMPLEX:
                    return new Vector1DTypeComplex(
                        raw.real, 
                        raw.imaginary, 
                        vectorSpace as ComplexVectorSpace<1>
                    );
                case COMPLEXVECTOR2D:
                    return new Vector2DTypeComplex(
                        raw.coordinates[0].real, 
                        raw.coordinates[0].imaginary,
                        raw.coordinates[1].real, 
                        raw.coordinates[1].imaginary,
                        vectorSpace as ComplexVectorSpace<2>
                    );
                default:
                    throw new Error(`Unsupported complex vector type: ${string}`);
            }
        }
        
        throw new Error('Cannot create complex vector from raw data');
    }

    static createProjectiveVectorFromRaw(raw: ProjectiveVector, vectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector {
        if (typeof raw === 'object' && 'type' in raw) {
            switch (raw.type) {
                case PROJECTIVEVECTOR2D:
                    return new ProjectiveVector2DTypeReal(
                        raw.coordinates[0], 
                        raw.coordinates[1], 
                        raw.coordinates[2].weight, 
                        vectorSpace as ProjectiveVectorSpace<3>
                    );
                case PROJECTIVEVECTOR3D:
                    return new ProjectiveVector3DTypeReal(
                        raw.coordinates[0], 
                        raw.coordinates[1], 
                        raw.coordinates[2], 
                        raw.coordinates[3].weight, 
                        vectorSpace as ProjectiveVectorSpace<4>
                    );
                default:
                    throw new Error(`Unsupported projective real vector type: raw.type`);
            }
        }
        
        throw new Error('Cannot create projective real vector from raw data');
    }

    static createProjectiveComplexVectorFromRaw(raw: ProjectiveComplexVector, vectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector {
        if (typeof raw === 'object' && 'type' in raw) {
            switch (raw.type) {
                case PROJECTIVECOMPLEXVECTOR1D:
                    return new ProjectiveVector1DTypeComplex(
                        raw.coordinates[0].real,
                        raw.coordinates[0].imaginary, 
                        raw.coordinates[1].real,
                        raw.coordinates[1].imaginary, 
                        vectorSpace as ProjectiveComplexVectorSpace<2>
                    );
                default:
                    throw new Error(`Unsupported projective complex vector type: ${raw.type}`);
            }
        }
        
        throw new Error('Cannot create projective complex vector from raw data');
    }
}