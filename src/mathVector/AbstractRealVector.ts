import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractVector } from "./AbstractVector";
import { RealVectorSpace } from "./RealVectorSpace";
import { IRealVector, VectorFactory } from "./Vector";
import { RealVector, Vector } from "./VectorSpaceConstructorInterface";

/**
 * Abstract base for real vectors
 */

export abstract class AbstractRealVector extends AbstractVector implements IRealVector {
    

    get spaceType(): VectorSpaceType { return VectorSpaceType.REAL; }
    get vectorSpace(): RealVectorSpace<any> { return this._vectorSpace as RealVectorSpace<any>; }
    // Default implementations for coordinate accessors
    get x(): number | undefined { return this.dimension >= 1 ? this.getCoordinate(0) : undefined; }
    get y(): number | undefined { return this.dimension >= 2 ? this.getCoordinate(1) : undefined; }
    get z(): number | undefined { return this.dimension >= 3 ? this.getCoordinate(2) : undefined; }
    get w(): number | undefined { return this.dimension >= 4 ? this.getCoordinate(3) : undefined; }

    abstract get raw(): RealVector;
    abstract get coordinates(): number[];

    abstract getCoordinate(index: number): number;
    abstract setCoordinate(index: number, value: number): void;
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

    toArray(): number[] {
        return this.coordinates;
    }

    protected createVectorFromRaw(raw: Vector): IRealVector {
        return VectorFactory.createRealVectorFromRaw(raw as RealVector, this.vectorSpace);
    }
}
