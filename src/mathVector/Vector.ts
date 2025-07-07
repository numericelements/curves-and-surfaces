
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { VectorInVectorSpace } from "./VectorInVectorSpace";
import { COMPLEX, Complex, ComplexVector, ComplexVector1D, COMPLEXVECTOR2D, ComplexVector2D, COMPLEXWEIGHT, ComplexWeight, IdentifiableVectorSpace, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveVector, PROJECTIVEVECTOR2D, ProjectiveVector2D, PROJECTIVEVECTOR3D, ProjectiveVector3D, RealVector, RealVector1D, REALVECTOR2D, RealVector2D, REALVECTOR3D, RealVector3D, REALVECTOR4D, RealVector4D, Scalar, Vector, VectorSpace, WEIGHT } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

/**
 * Vector Space Identifier Manager - Singleton for generating unique IDs
 */
export class VectorSpaceIdentifierManager {
    private static instance: VectorSpaceIdentifierManager;
    private nextId: number = 1;
    private readonly defaultSpaceIds: Map<string, string> = new Map();

    private constructor() {}

    static getInstance(): VectorSpaceIdentifierManager {
        if (!VectorSpaceIdentifierManager.instance) {
            VectorSpaceIdentifierManager.instance = new VectorSpaceIdentifierManager();
        }
        return VectorSpaceIdentifierManager.instance;
    }

    /**
     * Generate a unique identifier for a vector space
     */
    generateId(): string {
        return `vs_${this.nextId++}_${Date.now()}`;
    }

    /**
     * Get or create default space identifier for a given type and dimension
     */
    getDefaultSpaceId(spaceType: VectorSpaceType, dimension: number): string {
        const key = `${spaceType}_${dimension}`;
        if (!this.defaultSpaceIds.has(key)) {
            this.defaultSpaceIds.set(key, `default_${key}_${this.generateId()}`);
        }
        return this.defaultSpaceIds.get(key)!;
    }

    /**
     * Check if an ID represents a default space
     */
    isDefaultSpace(id: string): boolean {
        return id.startsWith('default_');
    }
}

/**
 * Singleton manager for default vector spaces
 */
export class DefaultVectorSpaces {
    private static instance: DefaultVectorSpaces;
    private realSpaces: Map<number, RealVectorSpace<any>> = new Map();
    private complexSpaces: Map<number, ComplexVectorSpace<any>> = new Map();
    private projectiveRealSpaces: Map<number, ProjectiveVectorSpace<any>> = new Map();
    private projectiveComplexSpaces: Map<number, ProjectiveComplexVectorSpace> = new Map();

    private constructor() {}

    static getInstance(): DefaultVectorSpaces {
        if (!DefaultVectorSpaces.instance) {
            DefaultVectorSpaces.instance = new DefaultVectorSpaces();
        }
        return DefaultVectorSpaces.instance;
    }

    getRealVectorSpace<D extends number>(dimension: D): RealVectorSpace<D> {
        if (!this.realSpaces.has(dimension)) {
            // Create default space with special marking
            const defaultSpace = new RealVectorSpace<D>(dimension, `Default Real Vector Space R^${dimension}`, true);
            this.realSpaces.set(dimension, new RealVectorSpace<D>(dimension));
        }
        return this.realSpaces.get(dimension) as RealVectorSpace<D>;
    }

    getComplexVectorSpace<D extends number>(dimension: D): ComplexVectorSpace<D> {
        if (!this.complexSpaces.has(dimension)) {
            this.complexSpaces.set(dimension, new ComplexVectorSpace<D>(dimension));
        }
        return this.complexSpaces.get(dimension) as ComplexVectorSpace<D>;
    }

    getProjectiveVectorSpace<D extends number>(dimension: D): ProjectiveVectorSpace<D> {
        if (!this.projectiveRealSpaces.has(dimension)) {
            this.projectiveRealSpaces.set(dimension, new ProjectiveVectorSpace<D>(dimension));
        }
        return this.projectiveRealSpaces.get(dimension) as ProjectiveVectorSpace<D>;
    }

    getProjectiveComplexVectorSpace<D extends number>(dimension: D): ProjectiveComplexVectorSpace {
        if (!this.projectiveComplexSpaces.has(dimension)) {
            this.projectiveComplexSpaces.set(dimension, new ProjectiveComplexVectorSpace(dimension));
        }
        return this.projectiveComplexSpaces.get(dimension) as ProjectiveComplexVectorSpace;
    }

    /**
     * Get all default spaces (for debugging/testing)
     */
    getAllDefaultSpaces(): IdentifiableVectorSpace<any, any>[] {
        return [
            ...Array.from(this.realSpaces.values())
            // ...Array.from(this.complexSpaces.values()),
            // ...Array.from(this.projectiveRealSpaces.values()),
            // ...Array.from(this.projectiveComplexSpaces.values())
        ];
    }

    /**
     * Check if a space is managed by this singleton
     */
    isDefaultSpace(space: IdentifiableVectorSpace<any, any>): boolean {
        return space.isDefault && this.getAllDefaultSpaces().some(s => s.isSameSpace(space));
    }
}




/**
 * Core vector interface - all vector classes implement this
 */
// export interface IVector {
//     readonly dimension: number;
//     readonly vectorType: string; // e.g., 'Real1D', 'Complex2D', 'ProjectiveReal3D'
//     readonly spaceType: VectorSpaceType; // REAL, COMPLEX, PROJECTIVE, PROJECTIVECOMPLEX
    
//     // Coordinate access
//     getCoordinate(index: number): number | Complex;
//     setCoordinate(index: number, value: number | Complex): void;
//     readonly coordinates: (number | Complex)[];
    
//     // Raw data access for interoperability
//     readonly raw: Vector;
    
//     // Basic operations
//     clone(): IVector;
//     equals(other: IVector): boolean;
    
//     // Conversion utilities
//     toArray(): number[];
//     toString(): string;
// }


export interface IVector {
    readonly dimension: number;
    readonly vectorType: string;
    readonly spaceType: VectorSpaceType;
    // readonly vectorSpace: VectorSpace<any, any>; // The vector space this vector belongs to
    readonly vectorSpace: IdentifiableVectorSpace<any, any>;
    
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
    
    // Binding to different vector spaces
    bindTo<K extends Scalar, V extends Vector, VS extends VectorSpace<K, V>>(space: VS): VectorInVectorSpace<K, V, VS>;
    
    // Conversion utilities
    toArray(): number[];
    toString(): string;
}


/**
 * Real vector specific interface
 */
// export interface IRealVector extends IVector {
//     getCoordinate(index: number): number;
//     setCoordinate(index: number, value: number): void;
//     readonly coordinates: number[];
//     readonly raw: RealVector;
    
//     // Real vector specific accessors
//     readonly x?: number;
//     readonly y?: number;
//     readonly z?: number;
//     readonly w?: number;
// }

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
// export interface IComplexVector extends IVector {
//     getCoordinate(index: number): Complex;
//     setCoordinate(index: number, value: Complex): void;
//     readonly coordinates: Complex[];
//     readonly raw: ComplexVector;
    
//     // Complex-specific methods
//     getReal(index: number): number;
//     getImaginary(index: number): number;
//     setReal(index: number, value: number): void;
//     setImaginary(index: number, value: number): void;
// }

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
// export interface IProjectiveVector extends IVector {
//     readonly weight: Weight | ComplexWeight;
//     readonly homogeneousCoordinates: (number | Complex)[];
    
//     // Projective-specific methods
//     normalize(): IProjectiveVector;
//     toCartesian(): IRealVector | IComplexVector;
// }

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
 * Base abstract class implementing common IVector functionality
 */
// export abstract class AbstractVector implements IVector {
//     abstract get dimension(): number;
//     abstract get vectorType(): string;
//     abstract get spaceType(): VectorSpaceType;
//     abstract get raw(): Vector;
//     abstract getCoordinate(index: number): number | Complex;
//     abstract setCoordinate(index: number, value: number | Complex): void;
//     abstract get coordinates(): (number | Complex)[];
//     abstract clone(): IVector;
    
//     // Common implementations
//     equals(other: IVector): boolean {
//         if (this.dimension !== other.dimension || this.vectorType !== other.vectorType) {
//             return false;
//         }
        
//         for (let i = 0; i < this.dimension; i++) {
//             if (this.getCoordinate(i) !== other.getCoordinate(i)) {
//                 return false;
//             }
//         }
//         return true;
//     }
    
//     abstract toArray(): number[];
    
//     toString(): string {
//         return `${this.vectorType}(${this.toArray().join(', ')})`;
//     }
// }


// export abstract class AbstractVector implements IVector {
export abstract class AbstractVector<VS extends IdentifiableVectorSpace<any, any> = IdentifiableVectorSpace<any, any>> implements IVector {
    protected _vectorSpace: VS;

    constructor(vectorSpace?: VS) {
        this._vectorSpace = vectorSpace || this.getDefaultVectorSpace();
    }

    abstract get dimension(): number;
    abstract get vectorType(): string;
    abstract get spaceType(): VectorSpaceType;
    abstract get raw(): Vector;
    abstract getCoordinate(index: number): number | Complex;
    abstract setCoordinate(index: number, value: number | Complex): void;
    abstract get coordinates(): (number | Complex)[];
    abstract clone(): IVector;
    
    // Abstract method to get default vector space - implemented by concrete classes
    protected abstract getDefaultVectorSpace(): VS;

    get vectorSpace(): VS {
        return this._vectorSpace;
    }

    // Vector operations using the vector space
    add(other: IVector): IVector {
        this.validateCompatibility(other);
        const result = this._vectorSpace.add(this.raw, other.raw);
        return this.createVectorFromRaw(result);
    }

    subtract(other: IVector): IVector {
        this.validateCompatibility(other);
        const result = this._vectorSpace.subtract(this.raw, other.raw);
        return this.createVectorFromRaw(result);
    }

    scale(scalar: number | Complex): IVector {
        const result = this._vectorSpace.scale(scalar, this.raw);
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
        return this.scale(1 / currentNorm);
    }

    dot(other: IVector): number | Complex {
        this.validateCompatibility(other);
        if ('dot' in this._vectorSpace && typeof this._vectorSpace.dot === 'function') {
            return (this._vectorSpace as any).dot(this.raw, other.raw);
        }
        throw new Error('Dot product not available for this vector space');
    }

    bindTo<K extends Scalar, V extends Vector, VS extends VectorSpace<K, V>>(space: VS): VectorInVectorSpace<K, V, VS> {
        return new VectorInVectorSpace(this, space);
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

    // protected validateCompatibility(other: IVector): void {
    //     if (this.dimension !== other.dimension) {
    //         throw new Error(`Vector dimensions do not match: ${this.dimension} vs ${other.dimension}`);
    //     }
    //     if (this.spaceType !== other.spaceType) {
    //         throw new Error(`Vector space types do not match: ${this.spaceType} vs ${other.spaceType}`);
    //     }
    // }

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
        

/**
 * Abstract base for real vectors
 */
// export abstract class AbstractRealVector extends AbstractVector implements IRealVector {
//     get spaceType(): VectorSpaceType { return VectorSpaceType.REAL; }
    
//     abstract get raw(): RealVector;
//     abstract getCoordinate(index: number): number;
//     abstract setCoordinate(index: number, value: number): void;
//     abstract get coordinates(): number[];
//     abstract clone(): IRealVector;
    
//     // Default implementations for coordinate accessors
//     get x(): number | undefined { return this.dimension >= 1 ? this.getCoordinate(0) : undefined; }
//     get y(): number | undefined { return this.dimension >= 2 ? this.getCoordinate(1) : undefined; }
//     get z(): number | undefined { return this.dimension >= 3 ? this.getCoordinate(2) : undefined; }
//     get w(): number | undefined { return this.dimension >= 4 ? this.getCoordinate(3) : undefined; }
    
//     toArray(): number[] {
//         return this.coordinates;
//     }
// }


export abstract class AbstractRealVector extends AbstractVector implements IRealVector {
    constructor(vectorSpace?: RealVectorSpace<any>) {
        super(vectorSpace);
    }

    get spaceType(): VectorSpaceType { return VectorSpaceType.REAL; }
    get vectorSpace(): RealVectorSpace<any> { return this._vectorSpace as RealVectorSpace<any>; }
    
    protected getDefaultVectorSpace(): RealVectorSpace<any> {
        return DefaultVectorSpaces.getInstance().getRealVectorSpace(this.dimension);
    }

    abstract get raw(): RealVector;
    abstract getCoordinate(index: number): number;
    abstract setCoordinate(index: number, value: number): void;
    abstract get coordinates(): number[];
    abstract clone(): IRealVector;
    
    // Override with more specific types
    add(other: IRealVector): IRealVector {
        return super.add(other) as IRealVector;
    }

    subtract(other: IRealVector): IRealVector {
        return super.subtract(other) as IRealVector;
    }

    scale(scalar: number): IRealVector {
        return super.scale(scalar) as IRealVector;
    }

    dot(other: IRealVector): number {
        return super.dot(other) as number;
    }

    // Default implementations for coordinate accessors
    get x(): number | undefined { return this.dimension >= 1 ? this.getCoordinate(0) : undefined; }
    get y(): number | undefined { return this.dimension >= 2 ? this.getCoordinate(1) : undefined; }
    get z(): number | undefined { return this.dimension >= 3 ? this.getCoordinate(2) : undefined; }
    get w(): number | undefined { return this.dimension >= 4 ? this.getCoordinate(3) : undefined; }
    
    toArray(): number[] {
        return this.coordinates;
    }

    protected createVectorFromRaw(raw: Vector): IRealVector {
        return VectorFactory.createRealVectorFromRaw(raw as RealVector, this.vectorSpace);
    }
}


/**
 * Abstract base for complex vectors
 */
// export abstract class AbstractComplexVector extends AbstractVector implements IComplexVector {
//     get spaceType(): VectorSpaceType { return VectorSpaceType.COMPLEX; }
    
//     abstract get raw(): ComplexVector;
//     abstract getCoordinate(index: number): Complex;
//     abstract setCoordinate(index: number, value: Complex): void;
//     abstract get coordinates(): Complex[];
//     abstract clone(): IComplexVector;
    
//     // Complex-specific implementations
//     getReal(index: number): number {
//         const coord = this.getCoordinate(index);
//         return coord.real;
//     }
    
//     getImaginary(index: number): number {
//         const coord = this.getCoordinate(index);
//         return coord.imaginary;
//     }
    
//     setReal(index: number, value: number): void {
//         const coord = this.getCoordinate(index);
//         this.setCoordinate(index, { ...coord, real: value });
//     }
    
//     setImaginary(index: number, value: number): void {
//         const coord = this.getCoordinate(index);
//         this.setCoordinate(index, { ...coord, imaginary: value });
//     }
    
//     toArray(): number[] {
//         // Flatten complex coordinates to [real1, imag1, real2, imag2, ...]
//         // return this.coordinates.flatMap(c => [c.real, c.imaginary]);
//         return [this.coordinates[0].real, this.coordinates[0].imaginary]
//     }
// }

export abstract class AbstractComplexVector extends AbstractVector implements IComplexVector {

    constructor(vectorSpace?: ComplexVectorSpace<any>) {
        super(vectorSpace);
    }

    get spaceType(): VectorSpaceType { return VectorSpaceType.COMPLEX; }
    get vectorSpace(): ComplexVectorSpace<any> { return this._vectorSpace as ComplexVectorSpace<any>; }

    protected getDefaultVectorSpace(): ComplexVectorSpace<any> {
        return DefaultVectorSpaces.getInstance().getComplexVectorSpace(this.dimension);
    }
    
    abstract get raw(): ComplexVector;
    abstract getCoordinate(index: number): Complex;
    abstract setCoordinate(index: number, value: Complex): void;
    abstract get coordinates(): Complex[];
    abstract clone(): IComplexVector;
    
    add(other: IComplexVector): IComplexVector {
        return super.add(other) as IComplexVector;
    }

    subtract(other: IComplexVector): IComplexVector {
        return super.subtract(other) as IComplexVector;
    }

    scale(scalar: number): IComplexVector {
        return super.scale(scalar) as IComplexVector;
    }

    // Complex-specific implementations
    getReal(index: number): number {
        const coord = this.getCoordinate(index);
        return coord.real;
    }
    
    getImaginary(index: number): number {
        const coord = this.getCoordinate(index);
        return coord.imaginary;
    }
    
    setReal(index: number, value: number): void {
        const coord = this.getCoordinate(index);
        this.setCoordinate(index, { ...coord, real: value });
    }
    
    setImaginary(index: number, value: number): void {
        const coord = this.getCoordinate(index);
        this.setCoordinate(index, { ...coord, imaginary: value });
    }
    
    toArray(): number[] {
        // Flatten complex coordinates to [real1, imag1, real2, imag2, ...]
        // return this.coordinates.flatMap(c => [c.real, c.imaginary]);
        return [this.coordinates[0].real, this.coordinates[0].imaginary]
    }

    protected createVectorFromRaw(raw: Vector): IComplexVector {
        return VectorFactory.createComplexVectorFromRaw(raw as ComplexVector, this.vectorSpace);
    }
}

/**
 * Abstract base for projective vectors
 */
// export abstract class AbstractProjectiveVector extends AbstractVector implements IProjectiveVector {
//     abstract get weight(): Weight | ComplexWeight;
//     abstract get homogeneousCoordinates(): (number | Complex)[];
//     abstract normalize(): IProjectiveVector;
//     abstract toCartesian(): IRealVector | IComplexVector;
    
//     toArray(): number[] {
//         return this.homogeneousCoordinates.map(coord => 
//             typeof coord === 'number' ? coord : coord.real
//         );
//     }
// }

export abstract class AbstractProjectiveVector extends AbstractVector implements IProjectiveVector {

    constructor(vectorSpace?: ProjectiveVectorSpace<any>) {
        super(vectorSpace);
    }

    get vectorSpace(): ProjectiveVectorSpace<any> { return this._vectorSpace as ProjectiveVectorSpace<any>; }

    abstract get weight(): Weight | ComplexWeight;
    abstract get homogeneousCoordinates(): (number | Complex)[];
    abstract normalize(): IProjectiveVector;
    abstract toCartesian(): IRealVector | IComplexVector;
    
    add(other: IProjectiveVector): IProjectiveVector {
        return super.add(other) as IProjectiveVector;
    }

    subtract(other: IProjectiveVector): IProjectiveVector {
        return super.subtract(other) as IProjectiveVector;
    }

    scale(scalar: number): IProjectiveVector {
        return super.scale(scalar) as IProjectiveVector;
    }

    toArray(): number[] {
        return this.homogeneousCoordinates.map(coord => 
            typeof coord === 'number' ? coord : coord.real
        );
    }

    protected createVectorFromRaw(raw: Vector): IProjectiveVector {
        return VectorFactory.createProjectiveVectorFromRaw(raw as ProjectiveVector, this.vectorSpace);
    }
}

export abstract class AbstractProjectiveComplexVector extends AbstractVector implements IProjectiveComplexVector {

    constructor(vectorSpace?: ProjectiveComplexVectorSpace<any>) {
        super(vectorSpace);
    }

    get vectorSpace(): ProjectiveComplexVectorSpace<any> { return this._vectorSpace as ProjectiveComplexVectorSpace<any>; }

    abstract get weight(): Weight | ComplexWeight;
    abstract get homogeneousCoordinates(): (number | Complex)[];
    abstract normalize(): IProjectiveComplexVector;
    abstract toCartesian(): IRealVector | IComplexVector;
    
    add(other: IProjectiveComplexVector): IProjectiveComplexVector {
        return super.add(other) as IProjectiveComplexVector;
    }

    subtract(other: IProjectiveComplexVector): IProjectiveComplexVector {
        return super.subtract(other) as IProjectiveComplexVector;
    }

    scale(scalar: number): IProjectiveComplexVector {
        return super.scale(scalar) as IProjectiveComplexVector;
    }

    toArray(): number[] {
        return this.homogeneousCoordinates.map(coord => 
            typeof coord === 'number' ? coord : coord.real
        );
    }

    protected createVectorFromRaw(raw: Vector): IProjectiveComplexVector {
        return VectorFactory.createProjectiveComplexVectorFromRaw(raw as ProjectiveComplexVector, this.vectorSpace);
    }
}


/**
 * Concrete Real Vector implementations
 */
// export class Vector1DTypeReal extends AbstractRealVector {
//     constructor(private value: number = 0) {
//         super();
//     }

//     get dimension(): number { return 1; }
//     get vectorType(): string { return 'Real1D'; }
    
//     getCoordinate(index: number): number {
//         if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
//         return this.value;
//     }
    
//     setCoordinate(index: number, value: number): void {
//         if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
//         this.value = value;
//     }
    
//     get coordinates(): number[] { return [this.value]; }
//     get raw(): RealVector1D { return this.value; }
    
//     clone(): Vector1DTypeReal {
//         return new Vector1DTypeReal(this.value);
//     }
    
//     // Factory methods
//     static fromRaw(raw: RealVector1D): Vector1DTypeReal {
//         return new Vector1DTypeReal(raw);
//     }
    
//     static fromCoordinates(coords: number[]): Vector1DTypeReal {
//         if (coords.length !== 1) throw new RangeError('1D vector requires exactly 1 coordinate');
//         return new Vector1DTypeReal(coords[0]);
//     }
// }

export class Vector1DTypeReal extends AbstractRealVector {
    constructor(value: number = 0, vectorSpace?: RealVectorSpace<1>) {
        super(vectorSpace);
        this.value = value;
    }

    private value: number;

    get dimension(): number { return 1; }
    get vectorType(): string { return 'Real1D'; }
    
    protected getDefaultVectorSpace(): RealVectorSpace<1> {
        return DefaultVectorSpaces.getInstance().getRealVectorSpace(1);
    }
    
    getCoordinate(index: number): number {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        return this.value;
    }
    
    setCoordinate(index: number, value: number): void {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        this.value = value;
    }
    
    get coordinates(): number[] { return [this.value]; }
    get raw(): RealVector1D { return this.value; }
    
    clone(): Vector1DTypeReal {
        return new Vector1DTypeReal(this.value, this.vectorSpace);
    }
    
    // Factory methods
    static fromRaw(raw: RealVector1D, vectorSpace?: RealVectorSpace<1>): Vector1DTypeReal {
        return new Vector1DTypeReal(raw, vectorSpace);
    }
    
    static fromCoordinates(coords: number[], vectorSpace?: RealVectorSpace<1>): Vector1DTypeReal {
        if (coords.length !== 1) throw new RangeError('1D vector requires exactly 1 coordinate');
        return new Vector1DTypeReal(coords[0], vectorSpace);
    }

    // Static method to create with default vector space
    static create(value: number = 0): Vector1DTypeReal {
        return new Vector1DTypeReal(value);
    }
}



// export class Vector2DTypeReal extends AbstractRealVector {
//     private data: RealVector2D;
    
//     constructor(x: number = 0, y: number = 0) {
//         super();
//         this.data = { type: REALVECTOR2D, coordinates: [x, y] };
//     }
    
//     get dimension(): number { return 2; }
//     get vectorType(): string { return 'Real2D'; }
    
//     getCoordinate(index: number): number {
//         if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
//         return this.data.coordinates[index];
//     }
    
//     setCoordinate(index: number, value: number): void {
//         if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
//         this.data.coordinates[index] = value;
//     }
    
//     get coordinates(): number[] { return [...this.data.coordinates]; }
//     get raw(): RealVector2D { return { ...this.data }; }
    
//     clone(): Vector2DTypeReal {
//         return new Vector2DTypeReal(this.x!, this.y!);
//     }
    
//     static fromRaw(raw: RealVector2D): Vector2DTypeReal {
//         return new Vector2DTypeReal(raw.coordinates[0], raw.coordinates[1]);
//     }
    
//     static fromCoordinates(coords: number[]): Vector2DTypeReal {
//         if (coords.length !== 2) throw new RangeError('2D vector requires exactly 2 coordinates');
//         return new Vector2DTypeReal(coords[0], coords[1]);
//     }
// }


export class Vector2DTypeReal extends AbstractRealVector {
    private data: RealVector2D;
    
    constructor(x: number = 0, y: number = 0, vectorSpace?: RealVectorSpace<2>) {
        super(vectorSpace);
        this.data = { type: REALVECTOR2D, coordinates: [x, y] };
    }
    
    get dimension(): number { return 2; }
    get vectorType(): string { return 'Real2D'; }
    
    getDefaultVectorSpace(): RealVectorSpace<2> {
        return DefaultVectorSpaces.getInstance().getRealVectorSpace(2);
    }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
        return this.data.coordinates[index];
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
        this.data.coordinates[index] = value;
    }
    
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get raw(): RealVector2D { return { ...this.data }; }
    
    clone(): Vector2DTypeReal {
        return new Vector2DTypeReal(this.x!, this.y!, this.vectorSpace);
    }
    
    static fromRaw(raw: RealVector2D, vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal {
        return new Vector2DTypeReal(raw.coordinates[0], raw.coordinates[1], vectorSpace);
    }
    
    static fromCoordinates(coords: number[], vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal {
        if (coords.length !== 2) throw new RangeError('2D vector requires exactly 2 coordinates');
        return new Vector2DTypeReal(coords[0], coords[1], vectorSpace);
    }

    static create(x: number = 0, y: number = 0): Vector2DTypeReal {
        return new Vector2DTypeReal(x, y);
    }
}


export class Vector3DTypeReal extends AbstractRealVector {
    private data: RealVector3D;
    
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super();
        this.data = { type: REALVECTOR3D, coordinates: [x, y, z] };
    }
    
    get dimension(): number { return 3; }
    get vectorType(): string { return 'Real3D'; }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
        return this.data.coordinates[index];
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
        this.data.coordinates[index] = value;
    }
    
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get raw(): RealVector3D { return { ...this.data }; }
    
    clone(): Vector3DTypeReal {
        return new Vector3DTypeReal(this.x!, this.z!);
    }
    
    static fromRaw(raw: RealVector3D): Vector3DTypeReal {
        return new Vector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2]);
    }
    
    static fromCoordinates(coords: number[]): Vector3DTypeReal {
        if (coords.length !== 3) throw new RangeError('3D vector requires exactly 3 coordinates');
        return new Vector3DTypeReal(coords[0], coords[1], coords[2]);
    }
}

export class Vector4DTypeReal extends AbstractRealVector {
    private data: RealVector4D;
    
    constructor(x: number = 0, y: number = 0, z: number = 0, t: number = 0) {
        super();
        this.data = { type: REALVECTOR4D, coordinates: [x, y, z, t] };
    }
    
    get dimension(): number { return 4; }
    get vectorType(): string { return 'Real4D'; }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= 4) throw new RangeError('Coordinate index out of bounds');
        return this.data.coordinates[index];
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 4) throw new RangeError('Coordinate index out of bounds');
        this.data.coordinates[index] = value;
    }
    
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get raw(): RealVector4D { return { ...this.data }; }
    
    clone(): Vector4DTypeReal {
        return new Vector4DTypeReal(this.x!, this.z!);
    }
    
    static fromRaw(raw: RealVector4D): Vector4DTypeReal {
        return new Vector4DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3]);
    }
    
    static fromCoordinates(coords: number[]): Vector4DTypeReal {
        if (coords.length !== 4) throw new RangeError('4D vector requires exactly 4 coordinates');
        return new Vector4DTypeReal(coords[0], coords[1], coords[2], coords[3]);
    }
}

/**
 * Complex Vector implementations
 */
// export class Vector1DTypeComplex extends AbstractComplexVector {
//     private data: Complex;
    
//     constructor(real: number = 0, imaginary: number = 0) {
//         super();
//         this.data = { type: COMPLEX, real, imaginary };
//     }
    
//     get dimension(): number { return 1; }
//     get vectorType(): string { return 'Complex1D'; }
    
//     getCoordinate(index: number): Complex {
//         if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
//         return this.data;
//     }
    
//     setCoordinate(index: number, value: Complex): void {
//         if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
//         this.data = value;
//     }
    
//     get coordinates(): Complex[] { return [this.data]; }
//     get raw(): ComplexVector1D { return this.data; }
    
//     clone(): Vector1DTypeComplex {
//         return new Vector1DTypeComplex(this.data.real, this.data.imaginary);
//     }
    
//     static fromRaw(raw: ComplexVector1D): Vector1DTypeComplex {
//         return new Vector1DTypeComplex(raw.real, raw.imaginary);
//     }
// }

export class Vector1DTypeComplex extends AbstractComplexVector {
    private data: Complex;
    
    constructor(real: number = 0, imaginary: number = 0, vectorSpace?: ComplexVectorSpace<1>) {
        super(vectorSpace);
        this.data = { type: COMPLEX, real, imaginary };
    }
    
    get dimension(): number { return 1; }
    get vectorType(): string { return 'Complex1D'; }
    
    getCoordinate(index: number): Complex {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        return this.data;
    }
    
    setCoordinate(index: number, value: Complex): void {
        if (index !== 0) throw new RangeError('1D vector only has coordinate at index 0');
        this.data = value;
    }
    
    get coordinates(): Complex[] { return [this.data]; }
    get raw(): ComplexVector1D { return this.data; }
    
    clone(): Vector1DTypeComplex {
        return new Vector1DTypeComplex(this.data.real, this.data.imaginary, this.vectorSpace);
    }
    
    static fromRaw(raw: ComplexVector1D, vectorSpace?: ComplexVectorSpace<1>): Vector1DTypeComplex {
        return new Vector1DTypeComplex(raw.real, raw.imaginary, vectorSpace);
    }
}


export class Vector2DTypeComplex extends AbstractComplexVector {
    private data: ComplexVector2D;
    
    constructor(real: number = 0, imaginary: number = 0, real2: number = 0, imaginary2: number = 0) {
        super();
        this.data = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary}, { type: COMPLEX, real: real2, imaginary: imaginary2}] };
    }
    
    get dimension(): number { return 2; }
    get vectorType(): string { return 'Complex2D'; }
    
    getCoordinate(index: number): Complex {
        if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
        return this.data.coordinates[index];
    }
    
    setCoordinate(index: number, value: Complex): void {
        if (index < 0 || index >= 2) throw new RangeError('Coordinate index out of bounds');
        this.data.coordinates[index] = value;
    }
    
    get coordinates(): Complex[] { return [...this.data.coordinates]; }
    get raw(): ComplexVector2D { return this.data; }
    
    clone(): Vector2DTypeComplex {
        return new Vector2DTypeComplex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary, this.data.coordinates[1].real, this.data.coordinates[1].imaginary);
    }
    
    static fromRaw(raw: ComplexVector2D): Vector2DTypeComplex {
        return new Vector2DTypeComplex(raw.coordinates[0].real, raw.coordinates[0].imaginary, raw.coordinates[1].real, raw.coordinates[1].imaginary);
    }
}

/**
 * Projective Vector implementations
 */
// export class ProjectiveVector2DTypeReal extends AbstractProjectiveVector {
//     private data: ProjectiveVector2D;
    
//     constructor(x: number = 0, y: number = 0, weight: Weight = new Weight()) {
//         super();
//         this.data = { 
//             type: PROJECTIVEVECTOR2D, 
//             coordinates: [x, y, { type: WEIGHT, value: weight }] 
//         };
//     }
    
//     get dimension(): number { return 3; } // Homogeneous coordinates
//     get vectorType(): string { return 'ProjectiveReal2D'; }
//     get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }
    
//     get weight(): Weight {
//         return this.data.coordinates[2].value;
//     }
    
//     get homogeneousCoordinates(): number[] {
//         return [this.data.coordinates[0], this.data.coordinates[1], this.weight.weight];
//     }
    
//     getCoordinate(index: number): number {
//         if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
//         if (index === 2) return this.weight.weight;
//         return this.data.coordinates[index] as number;
//     }
    
//     setCoordinate(index: number, value: number): void {
//         if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
//         if (index === 2) {
//             this.data.coordinates[2].value = new Weight(value);
//         } else {
//             this.data.coordinates[index] = value;
//         }
//     }
    
//     get coordinates(): number[] { return this.homogeneousCoordinates; }
//     get raw(): ProjectiveVector2D { return { ...this.data }; }
    
//     normalize(): ProjectiveVector2DTypeReal {
//         const w = this.weight.weight;
//         if (w === 0) return this.clone() as ProjectiveVector2DTypeReal;
        
//         return new ProjectiveVector2DTypeReal(
//             this.data.coordinates[0] / w,
//             this.data.coordinates[1] / w,
//             new Weight(1)
//         );
//     }
    
//     toCartesian(): Vector2DTypeReal {
//         const normalized = this.normalize();
//         return new Vector2DTypeReal(
//             normalized.data.coordinates[0],
//             normalized.data.coordinates[1]
//         );
//     }
    
//     clone(): ProjectiveVector2DTypeReal {
//         return new ProjectiveVector2DTypeReal(
//             this.data.coordinates[0],
//             this.data.coordinates[1],
//             new Weight(this.weight.weight)
//         );
//     }

//     static fromRaw(raw: ProjectiveVector2D): ProjectiveVector2DTypeReal {
//         return new ProjectiveVector2DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2].value);
//     }
// }

export class ProjectiveVector2DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector2D;
    
    constructor(x: number = 0, y: number = 0, weight: Weight = new Weight(), vectorSpace?: ProjectiveVectorSpace<3>) {
        super(vectorSpace);
        this.data = { 
            type: PROJECTIVEVECTOR2D, 
            coordinates: [x, y, { type: WEIGHT, value: weight }] 
        };
    }
    
    get dimension(): number { return 3; } // Homogeneous coordinates
    get vectorType(): string { return 'ProjectiveReal2D'; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }

    protected getDefaultVectorSpace(): ProjectiveVectorSpace<3> {
        return DefaultVectorSpaces.getInstance().getProjectiveVectorSpace(3);
    }
    
    get weight(): Weight {
        return this.data.coordinates[2].value;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0], this.data.coordinates[1], this.weight.weight];
    }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
        if (index === 2) return this.weight.weight;
        return this.data.coordinates[index] as number;
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 3) throw new RangeError('Coordinate index out of bounds');
        if (index === 2) {
            this.data.coordinates[2].value = new Weight(value);
        } else {
            this.data.coordinates[index] = value;
        }
    }
    
    get coordinates(): number[] { return this.homogeneousCoordinates; }
    get raw(): ProjectiveVector2D { return { ...this.data }; }
    
    normalize(): ProjectiveVector2DTypeReal {
        const w = this.weight.weight;
        if (w === 0) return this.clone() as ProjectiveVector2DTypeReal;
        
        return new ProjectiveVector2DTypeReal(
            this.data.coordinates[0] / w,
            this.data.coordinates[1] / w,
            new Weight(1)
        );
    }
    
    toCartesian(): Vector2DTypeReal {
        const normalized = this.normalize();
        return new Vector2DTypeReal(
            normalized.data.coordinates[0],
            normalized.data.coordinates[1]
        );
    }
    
    clone(): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(
            this.data.coordinates[0],
            this.data.coordinates[1],
            new Weight(this.weight.weight)
        );
    }

    static fromRaw(raw: ProjectiveVector2D): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2].value);
    }
}

// export class ProjectiveVector3DTypeReal extends AbstractProjectiveVector {
//     private data: ProjectiveVector3D;
    
//     constructor(x: number = 0, y: number = 0,  z: number = 0, weight: Weight = new Weight()) {
//         super();
//         this.data = { 
//             type: PROJECTIVEVECTOR3D, 
//             coordinates: [x, y, z, { type: WEIGHT, value: weight }] 
//         };
//     }
    
//     get dimension(): number { return 4; } // Homogeneous coordinates
//     get vectorType(): string { return 'ProjectiveReal3D'; }
//     get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }
    
//     get weight(): Weight {
//         return this.data.coordinates[3].value;
//     }
    
//     get homogeneousCoordinates(): number[] {
//         return [this.data.coordinates[0], this.data.coordinates[1], this.data.coordinates[2], this.weight.weight];
//     }
    
//     getCoordinate(index: number): number {
//         if (index < 0 || index >= 4) throw new RangeError('Coordinate index out of bounds');
//         if (index === 2) return this.weight.weight;
//         return this.data.coordinates[index] as number;
//     }
    
//     setCoordinate(index: number, value: number): void {
//         if (index < 0 || index >= 4) throw new RangeError('Coordinate index out of bounds');
//         if (index === 3) {
//             this.data.coordinates[3].value = new Weight(value);
//         } else {
//             this.data.coordinates[index] = value;
//         }
//     }
    
//     get coordinates(): number[] { return this.homogeneousCoordinates; }
//     get raw(): ProjectiveVector3D { return { ...this.data }; }
    
//     normalize(): ProjectiveVector3DTypeReal {
//         const w = this.weight.weight;
//         if (w === 0) return this.clone() as ProjectiveVector3DTypeReal;
        
//         return new ProjectiveVector3DTypeReal(
//             this.data.coordinates[0] / w,
//             this.data.coordinates[1] / w,
//             this.data.coordinates[2] / w,
//             new Weight(1)
//         );
//     }
    
//     toCartesian(): Vector3DTypeReal {
//         const normalized = this.normalize();
//         return new Vector3DTypeReal(
//             normalized.data.coordinates[0],
//             normalized.data.coordinates[1],
//             normalized.data.coordinates[2]
//         );
//     }
    
//     clone(): ProjectiveVector3DTypeReal {
//         return new ProjectiveVector3DTypeReal(
//             this.data.coordinates[0],
//             this.data.coordinates[1],
//             this.data.coordinates[2],
//             new Weight(this.weight.weight)
//         );
//     }

//     static fromRaw(raw: ProjectiveVector3D): ProjectiveVector3DTypeReal {
//         return new ProjectiveVector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3].value);
//     }
// }


export class ProjectiveVector3DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector3D;
    
    constructor(x: number = 0, y: number = 0,  z: number = 0, weight: Weight = new Weight(), vectorSpace?: ProjectiveVectorSpace<4>) {
        super(vectorSpace);
        this.data = { 
            type: PROJECTIVEVECTOR3D, 
            coordinates: [x, y, z, { type: WEIGHT, value: weight }] 
        };
    }
    
    get dimension(): number { return 4; } // Homogeneous coordinates
    get vectorType(): string { return 'ProjectiveReal3D'; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }
    
    get weight(): Weight {
        return this.data.coordinates[3].value;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0], this.data.coordinates[1], this.data.coordinates[2], this.weight.weight];
    }

    protected getDefaultVectorSpace(): ProjectiveVectorSpace<4> {
        return DefaultVectorSpaces.getInstance().getProjectiveVectorSpace(4);
    }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= 4) throw new RangeError('Coordinate index out of bounds');
        if (index === 2) return this.weight.weight;
        return this.data.coordinates[index] as number;
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 4) throw new RangeError('Coordinate index out of bounds');
        if (index === 3) {
            this.data.coordinates[3].value = new Weight(value);
        } else {
            this.data.coordinates[index] = value;
        }
    }
    
    get coordinates(): number[] { return this.homogeneousCoordinates; }
    get raw(): ProjectiveVector3D { return { ...this.data }; }
    
    normalize(): ProjectiveVector3DTypeReal {
        const w = this.weight.weight;
        if (w === 0) return this.clone() as ProjectiveVector3DTypeReal;
        
        return new ProjectiveVector3DTypeReal(
            this.data.coordinates[0] / w,
            this.data.coordinates[1] / w,
            this.data.coordinates[2] / w,
            new Weight(1)
        );
    }
    
    toCartesian(): Vector3DTypeReal {
        const normalized = this.normalize();
        return new Vector3DTypeReal(
            normalized.data.coordinates[0],
            normalized.data.coordinates[1],
            normalized.data.coordinates[2]
        );
    }
    
    clone(): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(
            this.data.coordinates[0],
            this.data.coordinates[1],
            this.data.coordinates[2],
            new Weight(this.weight.weight)
        );
    }

    static fromRaw(raw: ProjectiveVector3D): ProjectiveVector3DTypeReal {
        return new ProjectiveVector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3].value);
    }
}

/**
 * Projective Complex Vector implementations
 */
// export class ProjectiveVector1DTypeComplex extends AbstractProjectiveVector {
export class ProjectiveVector1DTypeComplex  extends AbstractProjectiveComplexVector {
    private data: ProjectiveComplexVector;
    // protected vectorSpace: ProjectiveComplexVectorSpace;
    
    constructor(real: number = 0, imaginary: number = 0, realWeight: Weight = new Weight(), imaginaryWeight: Weight = new Weight(), vectorSpace?: ProjectiveComplexVectorSpace<2>) {
        super(vectorSpace);
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
                        { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight}] 
        };
    }
    
    get dimension(): number { return 2; } // Homogeneous coordinates
    get vectorType(): string { return 'ProjectiveComplexVector'; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVECOMPLEX; }
    
    get weight(): Weight {
        return this.data.coordinates[1].real;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0].real, this.data.coordinates[0].imaginary, this.weight.weight];
    }

    protected getDefaultVectorSpace(): ProjectiveComplexVectorSpace {
        return DefaultVectorSpaces.getInstance().getProjectiveComplexVectorSpace(this.dimension);
    }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= 1) throw new RangeError('Coordinate index out of bounds');
        if (index === 1) return this.weight.weight;
        return this.data.coordinates[index].real as number;
    }
    
    setCoordinate(index: number, value: number): void {
        if (index < 0 || index >= 1) throw new RangeError('Coordinate index out of bounds');
        if (index === 1) {
            this.data.coordinates[1].real = new Weight(value);
        } else {
            this.data.coordinates[index].real = value;
        }
    }
    
    get coordinates(): number[] { return this.homogeneousCoordinates; }
    get raw(): ProjectiveComplexVector { return { ...this.data }; }
    
    normalize(): ProjectiveVector1DTypeComplex {
        const w = this.weight.weight;
        if (w === 0) return this.clone() as ProjectiveVector1DTypeComplex;
        
        return new ProjectiveVector1DTypeComplex(
            this.data.coordinates[0].real / w,
            this.data.coordinates[0].imaginary / w,
            new Weight(1)
        );
    }

    // add(other: ProjectiveVector1DTypeComplex): ProjectiveVector1DTypeComplex {
    //     // this.validateCompatibility(other);
    //     const result = this.vectorSpace.add(this.raw, other.raw);
    //     return this.createVectorFromRaw(result);
    // }
    
    toCartesian(): Vector2DTypeReal {
        const normalized = this.normalize();
        return new Vector2DTypeReal(
            normalized.data.coordinates[0].real,
            normalized.data.coordinates[0].imaginary
        );
    }
    
    clone(): ProjectiveVector1DTypeComplex {
        return new ProjectiveVector1DTypeComplex(
            this.data.coordinates[0].real,
            this.data.coordinates[0].imaginary,
            new Weight(this.weight.weight),
            new Weight(this.weight.weight)
        );
    }

    static fromRaw(raw: ProjectiveComplexVector): ProjectiveVector1DTypeComplex {
        return new ProjectiveVector1DTypeComplex(raw.coordinates[0].real, raw.coordinates[0].imaginary, raw.coordinates[1].real, raw.coordinates[1].imaginary);
    }
}


