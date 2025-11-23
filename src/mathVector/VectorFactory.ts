import type { RealVectorSpace } from './RealVectorSpace';
import type { ComplexVectorSpace } from './ComplexVectorSpace';
import { VectorSpaceType } from '../namedConstants/BSplineR1toRn';
import { IComplex } from './VectorSpaceConstructorInterface';
import { Vector1DTypeReal } from './Vector1DTypeReal';
import { Vector2DTypeReal } from './Vector2DTypeReal';
import { Vector3DTypeReal } from './Vector3DTypeReal';
import { Vector4DTypeReal } from './Vector4DTypeReal';
import { Vector1DTypeComplex } from './Vector1DTypeComplex';
import { Vector2DTypeComplex } from './Vector2DTypeComplex';

/**
 * Factory functions for creating vectors with clean API
 */

// Real vectors
export function realVector1D(x: number = 0, vectorSpace?: RealVectorSpace<1>) {
    return new Vector1DTypeReal( x, vectorSpace);
}

export function realVector2D(x: number = 0, y: number = 0, vectorSpace?: RealVectorSpace<2>) {
    return new Vector2DTypeReal(x, y, vectorSpace);
}

export function realVector3D(x: number = 0, y: number = 0, z: number = 0, vectorSpace?: RealVectorSpace<3>) {
    return new Vector3DTypeReal(x, y, z, vectorSpace);
}

export function realVector4D(x: number = 0, y: number = 0, z: number = 0, w: number = 0, vectorSpace?: RealVectorSpace<4>) {
    return new Vector4DTypeReal(x, y, z, w, vectorSpace);
}

// Complex vectors
export function complexVector1D(z: IComplex, vectorSpace?: ComplexVectorSpace<1>) {
    return new Vector1DTypeComplex(z.real, z.imaginary, vectorSpace);
}

export function complexVector2D(z1: IComplex, z2: IComplex, vectorSpace?: ComplexVectorSpace<2>) {
    return new Vector2DTypeComplex(z1.real, z1.imaginary, z2.real, z2.imaginary, vectorSpace);
}

// Generic factory
export function createVector<VS extends VectorSpaceType, D extends number>(
    spaceType: VS,
    dimension: D,
    coordinates?: (number | IComplex)[],
    vectorSpace?: any
) {
    const x = 0;
    const y = 0;
    return new Vector2DTypeReal(x, y, vectorSpace);
}
