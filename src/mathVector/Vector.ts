
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DTypeComplex } from "./ProjectiveVector1DTypeComplex";
import { ProjectiveVector2DTypeReal } from "./ProjectiveVector2DTypeReal";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { Vector1DTypeComplex } from "./Vector1DTypeComplex";
import { Vector1DTypeReal } from "./Vector1DTypeReal";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { Vector3DTypeReal } from "./Vector3DTypeReal";
import { VectorInVectorSpace } from "./VectorInVectorSpace";
import { COMPLEX, Complex, ComplexVector, ComplexWeight, IdentifiableVectorSpace, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveVector, PROJECTIVEVECTOR2D, RealVector, REALVECTOR2D, Scalar, Vector, VectorSpace } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

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
    setCoordinate(index: number, value: number | Complex): void;
    readonly coordinates: (number | Complex)[];
    
    // Raw data access for interoperability
    readonly raw: Vector;
    
    // Basic operations - now can be performed directly on vectors
    clone(): IVector;
    equals(other: IVector): boolean;
    add(other: IVector): IVector;
    subtract(other: IVector): IVector;
    scale(scalar: number | Complex): IVector;
    
    // Vector space operations
    norm(): number;
    normalize(): IVector;
    dot(other: IVector): number | Complex;
    
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
    setCoordinate(index: number, value: number): void;
    readonly coordinates: number[];
    readonly raw: RealVector;
    
    add(other: IRealVector): IRealVector;
    subtract(other: IRealVector): IRealVector;
    scale(scalar: number): IRealVector;
    dot(other: IRealVector): number;
    
    // Real vector specific accessors
    readonly x?: number;
    readonly y?: number;
    readonly z?: number;
    readonly w?: number;
}

/**
 * Complex vector specific interface
 */

export interface IComplexVector extends IVector {
    readonly vectorSpace: ComplexVectorSpace<any>;
    getCoordinate(index: number): Complex;
    setCoordinate(index: number, value: Complex): void;
    readonly coordinates: Complex[];
    readonly raw: ComplexVector;

    add(other: IComplexVector): IComplexVector;
    subtract(other: IComplexVector): IComplexVector;
    scale(scalar: number): IComplexVector;
    
    // Complex-specific methods
    getReal(index: number): number;
    getImaginary(index: number): number;
    setReal(index: number, value: number): void;
    setImaginary(index: number, value: number): void;
}

/**
 * Projective vector specific interface
 */

export interface IProjectiveVector extends IVector {
    readonly vectorSpace: ProjectiveVectorSpace<any>;
    readonly weight: Weight | ComplexWeight;
    readonly homogeneousCoordinates: (number | Complex)[];
    
    add(other: IProjectiveVector): IProjectiveVector;
    subtract(other: IProjectiveVector): IProjectiveVector;
    scale(scalar: number): IProjectiveVector;

    // Projective-specific methods
    normalize(): IProjectiveVector;
    toCartesian(): IRealVector | IComplexVector;
}

export interface IProjectiveComplexVector extends IVector {
    readonly vectorSpace: ProjectiveComplexVectorSpace<any>;
    readonly weight: Weight | ComplexWeight;
    readonly homogeneousCoordinates: (number | Complex)[];
    
    add(other: IProjectiveComplexVector): IProjectiveComplexVector;
    subtract(other: IProjectiveComplexVector): IProjectiveComplexVector;
    scale(scalar: number): IProjectiveComplexVector;

    // Projective-specific methods
    normalize(): IProjectiveComplexVector;
    toCartesian(): IRealVector | IComplexVector;
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
                // case REALVECTOR3D:
                //     return new RealVector3D(
                //         raw.coordinates[0], 
                //         raw.coordinates[1], 
                //         raw.coordinates[2], 
                //         vectorSpace as RealVectorSpace<3>
                //     );
                // case REALVECTOR4D:
                //     return new RealVector4D(
                //         raw.coordinates[0], 
                //         raw.coordinates[1], 
                //         raw.coordinates[2], 
                //         raw.coordinates[3], 
                //         vectorSpace as RealVectorSpace<4>
                //     );
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
                // case COMPLEXVECTOR2D:
                //     return new ComplexVector2D(
                //         raw.coordinates[0], 
                //         raw.coordinates[1], 
                //         vectorSpace as ComplexVectorSpace<2>
                //     );
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
                        raw.coordinates[2].value, 
                        vectorSpace as ProjectiveVectorSpace<3>
                    );
                // case PROJECTIVEVECTOR3D:
                //     return new ProjectiveRealVector3D(
                //         raw.coordinates[0], 
                //         raw.coordinates[1], 
                //         raw.coordinates[2], 
                //         raw.coordinates[3].value, 
                //         vectorSpace as ProjectiveRealVectorSpace<4>
                //     );
                default:
                    throw new Error(`Unsupported projective real vector type: ${raw.type}`);
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