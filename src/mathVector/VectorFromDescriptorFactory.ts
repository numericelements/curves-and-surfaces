import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { Vector1DTypeReal } from "./Vector1DTypeReal";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { Vector3DTypeReal } from "./Vector3DTypeReal";
import { Vector4DTypeReal } from "./Vector4DTypeReal";
import { RealVectorSpace } from "./RealVectorSpace";
import { IComplexVector, IProjectiveComplexVector, IProjectiveVector, IRealVector } from "./Vector";
import { ComplexVector, ComplexVector1D, ComplexVector2D, ProjectiveComplexVector, ProjectiveComplexVector1D, ProjectiveVector, ProjectiveVector2D, ProjectiveVector3D, RealVector, RealVector1D, RealVector2D, RealVector3D, RealVector4D } from "./VectorSpaceConstructorInterface";
import { isComplexVectorSpace, isProjectiveComplexVectorSpace, isProjectiveVectorSpace, isRealVectorSpace } from "./VectorSpaceFactory";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { Vector1DTypeComplex } from "./Vector1DTypeComplex";
import { Vector2DTypeComplex } from "./Vector2DTypeComplex";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { ProjectiveVector2DTypeReal } from "./ProjectiveVector2DTypeReal";
import { ProjectiveVector3DTypeReal } from "./ProjectiveVector3DTypeReal";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DTypeComplex } from "./ProjectiveVector1DTypeComplex";
import { EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT, EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT, EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE } from "../ErrorMessages/VectorFromDescriptorFactory";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

/**
 * Helpers for the creation of vectors from vector descriptors
 */

export function createRealVector1DFromDescriptor(descriptor: RealVector1D, vectorSpace?: RealVectorSpace<1>): IRealVector<1> {
    if (vectorSpace !== undefined && !isRealVectorSpace(vectorSpace, 1)) {
        const error = sendRangeErrorMessage('function', 'createRealVector1DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector1DTypeReal(descriptor, vectorSpace);
}

export function createRealVector2DFromDescriptor(descriptor: RealVector2D, vectorSpace?: RealVectorSpace<2>): IRealVector<2> {
    if (vectorSpace !== undefined && !isRealVectorSpace(vectorSpace, 2)) {
        const error = sendRangeErrorMessage('function', 'createRealVector2DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector2DTypeReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            vectorSpace);
}

export function createRealVector3DFromDescriptor(descriptor: RealVector3D, vectorSpace?: RealVectorSpace<3>): IRealVector<3> {
    if (vectorSpace !== undefined && !isRealVectorSpace(vectorSpace, 3)) {
        const error = sendRangeErrorMessage('function', 'createRealVector3DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector3DTypeReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            descriptor.coordinates[2],
            vectorSpace);
}

export function createRealVector4DFromDescriptor(descriptor: RealVector4D, vectorSpace?: RealVectorSpace<4>): IRealVector<4> {
    if (vectorSpace !== undefined && !isRealVectorSpace(vectorSpace, 4)) {
        const error = sendRangeErrorMessage('function', 'createRealVector4DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector4DTypeReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            descriptor.coordinates[2],
            descriptor.coordinates[3],
            vectorSpace);
}

export function createRealVectorFromDescriptor(descriptor: RealVector1D, vectorSpace?: RealVectorSpace<1>): IRealVector<1>;
export function createRealVectorFromDescriptor(descriptor: RealVector2D, vectorSpace?: RealVectorSpace<2>): IRealVector<2>;
export function createRealVectorFromDescriptor(descriptor: RealVector3D, vectorSpace?: RealVectorSpace<3>): IRealVector<3>;
export function createRealVectorFromDescriptor(descriptor: RealVector4D, vectorSpace?: RealVectorSpace<4>): IRealVector<4>;

export function createRealVectorFromDescriptor(descriptor: RealVector,
    vectorSpace?: RealVectorSpace<1> | RealVectorSpace<2> | RealVectorSpace<3> | RealVectorSpace<4>
    ): IRealVector<1> | IRealVector<2> | IRealVector<3> | IRealVector<4> {
    // Handle the case where descriptor is a number for 1D vector currently typed as RealVector1D
    if (typeof descriptor === 'number') {
        if (isRealVectorSpace(vectorSpace, 1)) {
            return createRealVector1DFromDescriptor(descriptor, vectorSpace);
        }
        return createRealVector1DFromDescriptor(descriptor);
    }
    if (descriptor === null || typeof descriptor !== 'object' || !('type' in descriptor)) {
        const error = sendRangeErrorMessage('function', 'createRealVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    switch (descriptor.type) {
        case REALVECTOR2D:
            if (isRealVectorSpace(vectorSpace, 2)) {
                return createRealVector2DFromDescriptor(descriptor, vectorSpace);
            }
            return createRealVector2DFromDescriptor(descriptor);
        case REALVECTOR3D:
            if (isRealVectorSpace(vectorSpace, 3)) {
                return createRealVector3DFromDescriptor(descriptor, vectorSpace);
            }
            return createRealVector3DFromDescriptor(descriptor);
        case REALVECTOR4D:
            if (isRealVectorSpace(vectorSpace, 4)) {
                return createRealVector4DFromDescriptor(descriptor, vectorSpace);
            }
            return createRealVector4DFromDescriptor(descriptor);
        default:
    }
    const error = sendRangeErrorMessage('function', 'createRealVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
    throw new RangeError(error.generateMessageString());
}



export function createComplexVector1DFromDescriptor(descriptor: ComplexVector1D, vectorSpace?: ComplexVectorSpace<1>): IComplexVector<1> {
    if (vectorSpace !== undefined && !isComplexVectorSpace(vectorSpace, 1)) {
        const error = sendRangeErrorMessage('function', 'createComplexVector1DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector1DTypeComplex(
            descriptor.real,
            descriptor.imaginary,
            vectorSpace);
}

export function createComplexVector2DFromDescriptor(descriptor: ComplexVector2D, vectorSpace?: ComplexVectorSpace<2>): IComplexVector<2> {
    if (vectorSpace !== undefined && !isComplexVectorSpace(vectorSpace, 2)) {
        const error = sendRangeErrorMessage('function', 'createComplexVector2DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector2DTypeComplex(
            descriptor.coordinates[0].real,
            descriptor.coordinates[0].imaginary,
            descriptor.coordinates[1].real,
            descriptor.coordinates[1].imaginary,
            vectorSpace);
}

export function createComplexVectorFromDescriptor(descriptor: ComplexVector1D, vectorSpace?: ComplexVectorSpace<1>): IComplexVector<1>;
export function createComplexVectorFromDescriptor(descriptor: ComplexVector2D, vectorSpace?: ComplexVectorSpace<2>): IComplexVector<2>;
export function createComplexVectorFromDescriptor(descriptor: ComplexVector,
    vectorSpace?: ComplexVectorSpace<1> | ComplexVectorSpace<2>
    ): IComplexVector<1> | IComplexVector<2> {
    if (descriptor === null || typeof descriptor !== 'object' || !('type' in descriptor)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveComplexVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    switch (descriptor.type) {
        case COMPLEX:
            // Handle the case where descriptor is a complex number for 1D vector currently typed as Complex
            if (isComplexVectorSpace(vectorSpace, 1)) {
                return createComplexVector1DFromDescriptor(descriptor, vectorSpace);
            }
            return createComplexVector1DFromDescriptor(descriptor);
        case COMPLEXVECTOR2D:
            if (isComplexVectorSpace(vectorSpace, 2)) {
                return createComplexVector2DFromDescriptor(descriptor, vectorSpace);
            }
            return createComplexVector2DFromDescriptor(descriptor);
        default:
    }
    const error = sendRangeErrorMessage('function', 'createComplexVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
    throw new RangeError(error.generateMessageString());
}


export function createProjectiveVector2DFromDescriptor(descriptor: ProjectiveVector2D, vectorSpace?: ProjectiveVectorSpace<3>): ProjectiveVector2DTypeReal {
    if (vectorSpace !== undefined && !isProjectiveVectorSpace(vectorSpace, 3)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveVector2DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new ProjectiveVector2DTypeReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            descriptor.coordinates[2].weight,
            vectorSpace);
}

export function createProjectiveVector3DFromDescriptor(descriptor: ProjectiveVector3D, vectorSpace?: ProjectiveVectorSpace<4>): ProjectiveVector3DTypeReal {
    if (vectorSpace !== undefined && !isProjectiveVectorSpace(vectorSpace, 4)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveVector3DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new ProjectiveVector3DTypeReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            descriptor.coordinates[2],
            descriptor.coordinates[3].weight,
            vectorSpace);
}

export function createProjectiveVectorFromDescriptor(descriptor: ProjectiveVector2D, vectorSpace?: ProjectiveVectorSpace<3>): IProjectiveVector<3>;
export function createProjectiveVectorFromDescriptor(descriptor: ProjectiveVector3D, vectorSpace?: ProjectiveVectorSpace<4>): IProjectiveVector<4>;
export function createProjectiveVectorFromDescriptor(descriptor: ProjectiveVector,
    vectorSpace?: ProjectiveVectorSpace<3> | ProjectiveVectorSpace<4>
    ): IProjectiveVector<3> | IProjectiveVector<4> {
    if (descriptor === null || typeof descriptor !== 'object' || !('type' in descriptor)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveComplexVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    switch (descriptor.type) {
        case PROJECTIVEVECTOR2D:
            if (isProjectiveVectorSpace(vectorSpace, 3)) {
                return createProjectiveVector2DFromDescriptor(descriptor, vectorSpace);
            }
            return createProjectiveVector2DFromDescriptor(descriptor);
        case PROJECTIVEVECTOR3D:
            if (isProjectiveVectorSpace(vectorSpace, 4)) {
                return createProjectiveVector3DFromDescriptor(descriptor, vectorSpace);
            }
            return createProjectiveVector3DFromDescriptor(descriptor);
        default:
    }
    const error = sendRangeErrorMessage('function', 'createProjectiveVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
    throw new RangeError(error.generateMessageString());
}


export function createProjectiveComplexVector1DFromDescriptor(descriptor: ProjectiveComplexVector1D, vectorSpace?: ProjectiveComplexVectorSpace<2>): IProjectiveComplexVector<2> {
    if (vectorSpace !== undefined && !isProjectiveComplexVectorSpace(vectorSpace, 2)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveComplexVector1DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new ProjectiveVector1DTypeComplex(
            descriptor.coordinates[0].real,
            descriptor.coordinates[0].imaginary,
            descriptor.coordinates[1].real,
            descriptor.coordinates[1].imaginary,
            vectorSpace);
}

export function createProjectiveComplexVectorFromDescriptor(descriptor: ProjectiveComplexVector1D, vectorSpace?: ProjectiveComplexVectorSpace<2>): IProjectiveComplexVector<2>;
export function createProjectiveComplexVectorFromDescriptor(descriptor: ProjectiveComplexVector,
    vectorSpace?: ProjectiveComplexVectorSpace<2>
    ): IProjectiveComplexVector<2> {
    if (descriptor === null || typeof descriptor !== 'object' || !('type' in descriptor)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveComplexVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    switch (descriptor.type) {
        case PROJECTIVECOMPLEXVECTOR1D:
            if (isProjectiveComplexVectorSpace(vectorSpace, 2)) {
                return createProjectiveComplexVector1DFromDescriptor(descriptor, vectorSpace);
            }
            return createProjectiveComplexVector1DFromDescriptor(descriptor);
        default:
    }
    const error = sendRangeErrorMessage('function', 'createProjectiveComplexVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
    throw new RangeError(error.generateMessageString());
}

// methods from ProjectiveComplexVectorSpace  to be adapted
    // getWeight(v: ProjectiveComplexVector): IComplexWeight {
    //     if(this.isInVectorSpace(v)) {
    //         return this.strategy.getWeight(v);
    //     } else {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'getWeight', EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
    //         throw new RangeError(error.generateMessageString());
    //     }
    // }

    // getRealWeight(v: ProjectiveComplexVector): Real {
    //     if(this.isInVectorSpace(v)) {
    //         return this.strategy.getWeight(v).real.value;
    //     } else {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'getRealWeight', EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
    //         throw new RangeError(error.generateMessageString());
    //     }
    // }

    // getImagiinaryWeight(v: ProjectiveComplexVector): Real {
    //     if(this.isInVectorSpace(v)) {
    //         return this.strategy.getWeight(v).imaginary.value;
    //     } else {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'getImaginaryWeight', EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
    //         throw new RangeError(error.generateMessageString());
    //     }
    // }
