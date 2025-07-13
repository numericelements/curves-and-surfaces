import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { DefaultVectorSpaces } from "./DefaultVectorSpaces";
import { IComplexVector, VectorFactory } from "./Vector";
import { Complex, ComplexVector, Vector } from "./VectorSpaceConstructorInterface";

/**
 * Abstract base for complex vectors
 */

export abstract class AbstractComplexVector extends AbstractVector implements IComplexVector {

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