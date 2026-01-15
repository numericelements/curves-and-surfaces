import { RealVectorSpace } from './RealVectorSpace';
import { ComplexVectorSpace } from './ComplexVectorSpace';
import { VectorSpaceType } from '../namedConstants/BSplineR1toRn';
import type { IComplex } from './VectorSpaceConstructorInterface';
import { Vector1DTypeReal } from './Vector1DTypeReal';
import { Vector2DTypeReal } from './Vector2DTypeReal';
import { Vector3DTypeReal } from './Vector3DTypeReal';
import { Vector4DTypeReal } from './Vector4DTypeReal';
import { Vector1DTypeComplex } from './Vector1DTypeComplex';
import { Vector2DTypeComplex } from './Vector2DTypeComplex';
import { Complex } from './Complex';
import { ProjectiveVector2DTypeReal } from './ProjectiveVector2DTypeReal';
import { ProjectiveVectorSpace } from './ProjectiveVectorSpace';
import { Weight } from './Weight';
import { EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE } from '../namedConstants/Vectors';
import { sendRangeErrorMessage } from './VectorSpaceUtilities';

/**
 * Factory functions for creating vectors with clean API
 */

// Real vectors
export function realVector1D(): Vector1DTypeReal;
export function realVector1D(vectorSpace: RealVectorSpace<1>): Vector1DTypeReal;
export function realVector1D(x: number, vectorSpace?: RealVectorSpace<1>): Vector1DTypeReal;

export function realVector1D(xOrVectorSpace?: number | RealVectorSpace<1>, vectorSpace?: RealVectorSpace<1>): Vector1DTypeReal {
    if(xOrVectorSpace === undefined) {
        // Case 1: no arguments
        return new Vector1DTypeReal();
    } else if(xOrVectorSpace instanceof RealVectorSpace) {
        // Case 2: vectorSpace only
        return new Vector1DTypeReal(xOrVectorSpace);
    } else {
        // Case 3: coordinate and optional vectorSpace
        return new Vector1DTypeReal(xOrVectorSpace, vectorSpace);
    }
}

export function realVector2D(): Vector2DTypeReal;
export function realVector2D(vectorSpace: RealVectorSpace<2>): Vector2DTypeReal;
export function realVector2D(x: number, y: number, vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal;

export function realVector2D(xOrVectorSpace?: number | RealVectorSpace<2>, y?: number, vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal {
    if(xOrVectorSpace === undefined) {
        // Case 1: no arguments
        return new Vector2DTypeReal();
    } else if(xOrVectorSpace instanceof RealVectorSpace) {
        // Case 2: vectorSpace only
        return new Vector2DTypeReal(xOrVectorSpace);
    } else {
        // Case 3: all coordinates and optional vectorSpace
        return new Vector2DTypeReal(xOrVectorSpace, y!, vectorSpace);
    }
}

export function realVector3D(): Vector3DTypeReal;
export function realVector3D(vectorSpace: RealVectorSpace<3>): Vector3DTypeReal;
export function realVector3D(x: number, y: number, z: number, vectorSpace?: RealVectorSpace<3>): Vector3DTypeReal;

export function realVector3D(xOrVectorSpace?: number | RealVectorSpace<3>, y?: number, z?: number, vectorSpace?: RealVectorSpace<3>): Vector3DTypeReal {
    if(xOrVectorSpace === undefined) {
        // Case 1: no arguments
        return new Vector3DTypeReal();
    } else if(xOrVectorSpace instanceof RealVectorSpace) {
        // Case 2: vectorSpace only
        return new Vector3DTypeReal(xOrVectorSpace);
    } else {
        // Case 3: all coordinates and optional vectorSpace
        return new Vector3DTypeReal(xOrVectorSpace, y!, z!, vectorSpace);
    }
}

export function realVector4D(): Vector4DTypeReal;
export function realVector4D(vectorSpace: RealVectorSpace<4>): Vector4DTypeReal;
export function realVector4D(x: number, y: number, z: number, w: number, vectorSpace?: RealVectorSpace<4>): Vector4DTypeReal;

export function realVector4D(xOrVectorSpace?: number | RealVectorSpace<4>, y: number = 0, z: number = 0, w: number = 0, vectorSpace?: RealVectorSpace<4>): Vector4DTypeReal {
    if(xOrVectorSpace === undefined) {
        // Case 1: no arguments
        return new Vector4DTypeReal();
    } else if(xOrVectorSpace instanceof RealVectorSpace) {
        // Case 2: vectorSpace only
        return new Vector4DTypeReal(xOrVectorSpace);
    } else {
        // Case 3: all coordinates and optional vectorSpace
        return new Vector4DTypeReal(xOrVectorSpace, y, z, w, vectorSpace);
    }
}

// Complex vectors
export function complexVector1D(): Vector1DTypeComplex;
export function complexVector1D(vectorSpace: ComplexVectorSpace<1>): Vector1DTypeComplex;
export function complexVector1D(complex: Complex, vectorSpace?: ComplexVectorSpace<1>): Vector1DTypeComplex;
export function complexVector1D(real: number, imaginary: number, vectorSpace?: ComplexVectorSpace<1>): Vector1DTypeComplex;

export function complexVector1D(realOrComplexOrVectorSpace?: number | Complex | ComplexVectorSpace<1>, imaginaryOrVectorSpace?: number | ComplexVectorSpace<1>, vectorSpace?: ComplexVectorSpace<1>): Vector1DTypeComplex {
    if(realOrComplexOrVectorSpace === undefined) {
        // Case 1: no arguments
        return new Vector1DTypeComplex();
    } else if(realOrComplexOrVectorSpace instanceof ComplexVectorSpace) {
        // Case 2: vectorSpace only
        return new Vector1DTypeComplex(realOrComplexOrVectorSpace);
    } else if(realOrComplexOrVectorSpace instanceof Complex) {
        // Case 3: coordinates as complex number with optional vectorSpace
        return (imaginaryOrVectorSpace instanceof ComplexVectorSpace) 
            ? new Vector1DTypeComplex(realOrComplexOrVectorSpace, imaginaryOrVectorSpace) 
            : new Vector1DTypeComplex(realOrComplexOrVectorSpace);
    } else {
        // Case 4: coordinates as real and imaginary parts with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number (guaranteed by overload)
        // imaginaryOrVectorSpace is number (guaranteed by overload)
        return (typeof imaginaryOrVectorSpace === 'number')
        ? new Vector1DTypeComplex(realOrComplexOrVectorSpace, imaginaryOrVectorSpace, vectorSpace)
        : // this branch cannot be reached with overloads but added for type safety
        (() => {throw new RangeError();})();
    }
}

export function complexVector2D(): Vector2DTypeComplex;
export function complexVector2D(vectorSpace: ComplexVectorSpace<2>): Vector2DTypeComplex;
export function complexVector2D(complex1: Complex, complex2: Complex, vectorSpace?: ComplexVectorSpace<2>): Vector2DTypeComplex;
export function complexVector2D(real1: number, imaginary1: number, real2: number, imaginary2: number, vectorSpace?: ComplexVectorSpace<2>): Vector2DTypeComplex;

export function complexVector2D(realOrComplexOrVectorSpace?: Complex | number | ComplexVectorSpace<2>, imaginaryOrComplex?: number | Complex, real2OrVectorSpace?: number | ComplexVectorSpace<2>, imaginary2?: number, vectorSpace?: ComplexVectorSpace<2>): Vector2DTypeComplex {
    if(realOrComplexOrVectorSpace === undefined) {
        // Case 1: no arguments
        return new Vector2DTypeComplex();
    } else if(realOrComplexOrVectorSpace instanceof ComplexVectorSpace) {
        // Case 2: vectorSpace only
        return new Vector2DTypeComplex(realOrComplexOrVectorSpace);
    } else if(realOrComplexOrVectorSpace instanceof Complex) {
        // Case 3: coordinates as complex numbers with optional vectorSpace
        return (imaginaryOrComplex instanceof Complex 
            && (real2OrVectorSpace instanceof ComplexVectorSpace || real2OrVectorSpace === undefined))
            ? new Vector2DTypeComplex(realOrComplexOrVectorSpace, imaginaryOrComplex!, real2OrVectorSpace)
            : // this branch cannot be reached with overloads but added for type safety
            (() => {throw new RangeError();})();
    } else {
        // Case 4: coordinates as sequence of real and imaginary parts with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number (guaranteed by overload)
        return (typeof imaginaryOrComplex === 'number' && typeof real2OrVectorSpace === 'number' )
        ? new Vector2DTypeComplex(realOrComplexOrVectorSpace, imaginaryOrComplex, real2OrVectorSpace!, imaginary2!, vectorSpace)
        : // this branch cannot be reached with overloads but added for type safety
        (() => {throw new RangeError();})();
    }
}

// Projective real vectors
export function projectiveRealVector3D(): ProjectiveVector2DTypeReal;
export function projectiveRealVector3D(vectorSpace: ProjectiveVectorSpace<3>): ProjectiveVector2DTypeReal;
export function projectiveRealVector3D(x: number, y: number, weight: Weight, vectorSpace?: ProjectiveVectorSpace<3>): ProjectiveVector2DTypeReal;
export function projectiveRealVector3D(x: number, y: number, vectorSpace?: ProjectiveVectorSpace<3>): ProjectiveVector2DTypeReal;

export function projectiveRealVector3D(xOrVectorSpace?: number | ProjectiveVectorSpace<3>, y?: number, weightOrVSpace?: Weight | ProjectiveVectorSpace<3>, vectorSpace?: ProjectiveVectorSpace<3>): ProjectiveVector2DTypeReal {
    try {
        if(xOrVectorSpace === undefined) {
            // Case 1: no arguments
            return new ProjectiveVector2DTypeReal();
        } else if(xOrVectorSpace instanceof ProjectiveVectorSpace) {
            // Case 2: vectorSpace only
            return new ProjectiveVector2DTypeReal(xOrVectorSpace);
        } else if (weightOrVSpace instanceof Weight) {
            // Case 3: all coordinates and weight with optional vectorSpace
            return new ProjectiveVector2DTypeReal(xOrVectorSpace, y!, weightOrVSpace, vectorSpace);
        } else {
            // Case 4: all coordinates with optional vectorSpace
            return new ProjectiveVector2DTypeReal(xOrVectorSpace, y!, weightOrVSpace);
        }
    } catch (error) {
        if(error instanceof RangeError && error.message.includes(EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE)) {
            const error = sendRangeErrorMessage('function', 'projectiveRealVector3D', EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        throw error;
    }
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
