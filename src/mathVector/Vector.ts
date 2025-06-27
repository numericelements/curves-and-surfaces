
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { COMPLEX, Complex, ComplexVector, ComplexVector1D, COMPLEXVECTOR2D, ComplexVector2D, COMPLEXWEIGHT, ComplexWeight, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, ProjectiveVector2D, PROJECTIVEVECTOR3D, ProjectiveVector3D, RealVector, RealVector1D, REALVECTOR2D, RealVector2D, REALVECTOR3D, RealVector3D, REALVECTOR4D, RealVector4D, Vector, WEIGHT } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

/**
 * Core vector interface - all vector classes implement this
 */
export interface IVector {
    readonly dimension: number;
    readonly vectorType: string; // e.g., 'Real1D', 'Complex2D', 'ProjectiveReal3D'
    readonly spaceType: VectorSpaceType; // REAL, COMPLEX, PROJECTIVE, PROJECTIVECOMPLEX
    
    // Coordinate access
    getCoordinate(index: number): number | Complex;
    setCoordinate(index: number, value: number | Complex): void;
    readonly coordinates: (number | Complex)[];
    
    // Raw data access for interoperability
    readonly raw: Vector;
    
    // Basic operations
    clone(): IVector;
    equals(other: IVector): boolean;
    
    // Conversion utilities
    toArray(): number[];
    toString(): string;
}

/**
 * Real vector specific interface
 */
export interface IRealVector extends IVector {
    getCoordinate(index: number): number;
    setCoordinate(index: number, value: number): void;
    readonly coordinates: number[];
    readonly raw: RealVector;
    
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
    getCoordinate(index: number): Complex;
    setCoordinate(index: number, value: Complex): void;
    readonly coordinates: Complex[];
    readonly raw: ComplexVector;
    
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
    readonly weight: Weight | ComplexWeight;
    readonly homogeneousCoordinates: (number | Complex)[];
    
    // Projective-specific methods
    normalize(): IProjectiveVector;
    toCartesian(): IRealVector | IComplexVector;
}


/**
 * Base abstract class implementing common IVector functionality
 */
export abstract class AbstractVector implements IVector {
    abstract get dimension(): number;
    abstract get vectorType(): string;
    abstract get spaceType(): VectorSpaceType;
    abstract get raw(): Vector;
    abstract getCoordinate(index: number): number | Complex;
    abstract setCoordinate(index: number, value: number | Complex): void;
    abstract get coordinates(): (number | Complex)[];
    abstract clone(): IVector;
    
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
}

/**
 * Abstract base for real vectors
 */
export abstract class AbstractRealVector extends AbstractVector implements IRealVector {
    get spaceType(): VectorSpaceType { return VectorSpaceType.REAL; }
    
    abstract get raw(): RealVector;
    abstract getCoordinate(index: number): number;
    abstract setCoordinate(index: number, value: number): void;
    abstract get coordinates(): number[];
    abstract clone(): IRealVector;
    
    // Default implementations for coordinate accessors
    get x(): number | undefined { return this.dimension >= 1 ? this.getCoordinate(0) : undefined; }
    get y(): number | undefined { return this.dimension >= 2 ? this.getCoordinate(1) : undefined; }
    get z(): number | undefined { return this.dimension >= 3 ? this.getCoordinate(2) : undefined; }
    get w(): number | undefined { return this.dimension >= 4 ? this.getCoordinate(3) : undefined; }
    
    toArray(): number[] {
        return this.coordinates;
    }
}

/**
 * Abstract base for complex vectors
 */
export abstract class AbstractComplexVector extends AbstractVector implements IComplexVector {
    get spaceType(): VectorSpaceType { return VectorSpaceType.COMPLEX; }
    
    abstract get raw(): ComplexVector;
    abstract getCoordinate(index: number): Complex;
    abstract setCoordinate(index: number, value: Complex): void;
    abstract get coordinates(): Complex[];
    abstract clone(): IComplexVector;
    
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
}

/**
 * Abstract base for projective vectors
 */
export abstract class AbstractProjectiveVector extends AbstractVector implements IProjectiveVector {
    abstract get weight(): Weight | ComplexWeight;
    abstract get homogeneousCoordinates(): (number | Complex)[];
    abstract normalize(): IProjectiveVector;
    abstract toCartesian(): IRealVector | IComplexVector;
    
    toArray(): number[] {
        return this.homogeneousCoordinates.map(coord => 
            typeof coord === 'number' ? coord : coord.real
        );
    }
}


/**
 * Concrete Real Vector implementations
 */
export class Vector1DTypeReal extends AbstractRealVector {
    constructor(private value: number = 0) {
        super();
    }

    get dimension(): number { return 1; }
    get vectorType(): string { return 'Real1D'; }
    
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
        return new Vector1DTypeReal(this.value);
    }
    
    // Factory methods
    static fromRaw(raw: RealVector1D): Vector1DTypeReal {
        return new Vector1DTypeReal(raw);
    }
    
    static fromCoordinates(coords: number[]): Vector1DTypeReal {
        if (coords.length !== 1) throw new RangeError('1D vector requires exactly 1 coordinate');
        return new Vector1DTypeReal(coords[0]);
    }
}

export class Vector2DTypeReal extends AbstractRealVector {
    private data: RealVector2D;
    
    constructor(x: number = 0, y: number = 0) {
        super();
        this.data = { type: REALVECTOR2D, coordinates: [x, y] };
    }
    
    get dimension(): number { return 2; }
    get vectorType(): string { return 'Real2D'; }
    
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
        return new Vector2DTypeReal(this.x!, this.y!);
    }
    
    static fromRaw(raw: RealVector2D): Vector2DTypeReal {
        return new Vector2DTypeReal(raw.coordinates[0], raw.coordinates[1]);
    }
    
    static fromCoordinates(coords: number[]): Vector2DTypeReal {
        if (coords.length !== 2) throw new RangeError('2D vector requires exactly 2 coordinates');
        return new Vector2DTypeReal(coords[0], coords[1]);
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
export class Vector1DTypeComplex extends AbstractComplexVector {
    private data: Complex;
    
    constructor(real: number = 0, imaginary: number = 0) {
        super();
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
        return new Vector1DTypeComplex(this.data.real, this.data.imaginary);
    }
    
    static fromRaw(raw: ComplexVector1D): Vector1DTypeComplex {
        return new Vector1DTypeComplex(raw.real, raw.imaginary);
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
export class ProjectiveVector2DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector2D;
    
    constructor(x: number = 0, y: number = 0, weight: Weight = new Weight()) {
        super();
        this.data = { 
            type: PROJECTIVEVECTOR2D, 
            coordinates: [x, y, { type: WEIGHT, value: weight }] 
        };
    }
    
    get dimension(): number { return 3; } // Homogeneous coordinates
    get vectorType(): string { return 'ProjectiveReal2D'; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }
    
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

export class ProjectiveVector3DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector3D;
    
    constructor(x: number = 0, y: number = 0,  z: number = 0, weight: Weight = new Weight()) {
        super();
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
export class ProjectiveVector1DTypeComplex extends AbstractProjectiveVector {
    private data: ProjectiveComplexVector;
    
    constructor(real: number = 0, imaginary: number = 0, realWeight: Weight = new Weight(), imaginaryWeight: Weight = new Weight()) {
        super();
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


