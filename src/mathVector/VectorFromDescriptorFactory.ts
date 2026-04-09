import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEREALVECTOR2D, PROJECTIVEREALVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { Vector1DReal } from "./Vector1DReal";
import { Vector2DReal } from "./Vector2DReal";
import { Vector3DReal } from "./Vector3DReal";
import { Vector4DReal } from "./Vector4DReal";
import { RealVectorSpace } from "./RealVectorSpace";
import type { ComplexVector, ProjectiveComplexVector, ProjectiveRealVector, RealVector, Vector } from "./interfaces/VectorInterfaces";
import type { ComplexVector2D, ProjectiveComplexVector1D, ProjectiveRealVector2D, ProjectiveRealVector3D, RealVector2D, RealVector3D, RealVector4D } from "./VectorDescriptorConstructorInterface";
import { isComplexVectorSpace, isProjectiveComplexVectorSpace, isProjectiveRealVectorSpace, isRealVectorSpace } from "./VectorSpaceFactory";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { Vector1DComplex } from "./Vector1DComplex";
import { Vector2DComplex } from "./Vector2DComplex";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import { ProjectiveVector2DReal } from "./ProjectiveVector2DReal";
import { ProjectiveVector3DReal } from "./ProjectiveVector3DReal";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DComplex } from "./ProjectiveVector1DComplex";
import { EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT, EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT, EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE } from "../ErrorMessages/VectorFromDescriptorFactory";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import type { ComplexVector1D, ComplexVectorDesc, ProjectiveComplexVectorDesc, ProjectiveRealVectorDesc, RealVector1D, RealVectorDesc, VectorDesc } from "./utilityTypes/VectorDescriptorTypes";

/**
 * Helpers for the creation of vectors from vector descriptors
 */

export function createVector1DRealFromDescriptor(descriptor: RealVector1D, vectorSpace?: RealVectorSpace<1>): RealVector<1> {
    if (vectorSpace !== undefined && !isRealVectorSpace(vectorSpace, 1)) {
        const error = sendRangeErrorMessage('function', 'createVector1DRealFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector1DReal(descriptor, vectorSpace);
}

export function createVector2DRealFromDescriptor(descriptor: RealVector2D, vectorSpace?: RealVectorSpace<2>): Vector2DReal {
    if (vectorSpace !== undefined && !isRealVectorSpace(vectorSpace, 2)) {
        const error = sendRangeErrorMessage('function', 'createVector2DRealFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector2DReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            vectorSpace);
}

export function createVector3DRealFromDescriptor(descriptor: RealVector3D, vectorSpace?: RealVectorSpace<3>): Vector3DReal {
    if (vectorSpace !== undefined && !isRealVectorSpace(vectorSpace, 3)) {
        const error = sendRangeErrorMessage('function', 'createVector3DRealFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector3DReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            descriptor.coordinates[2],
            vectorSpace);
}

export function createVector4DRealFromDescriptor(descriptor: RealVector4D, vectorSpace?: RealVectorSpace<4>): RealVector<4> {
    if (vectorSpace !== undefined && !isRealVectorSpace(vectorSpace, 4)) {
        const error = sendRangeErrorMessage('function', 'createVector4DRealFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector4DReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            descriptor.coordinates[2],
            descriptor.coordinates[3],
            vectorSpace);
}

export function createRealVectorFromDescriptor(descriptor: RealVector1D, vectorSpace?: RealVectorSpace<1>): RealVector<1>;
export function createRealVectorFromDescriptor(descriptor: RealVector2D, vectorSpace?: RealVectorSpace<2>): RealVector<2>;
export function createRealVectorFromDescriptor(descriptor: RealVector3D, vectorSpace?: RealVectorSpace<3>): RealVector<3>;
export function createRealVectorFromDescriptor(descriptor: RealVector4D, vectorSpace?: RealVectorSpace<4>): RealVector<4>;

export function createRealVectorFromDescriptor(descriptor: RealVectorDesc,
    vectorSpace?: RealVectorSpace<1> | RealVectorSpace<2> | RealVectorSpace<3> | RealVectorSpace<4>
    ): RealVector<1> | RealVector<2> | RealVector<3> | RealVector<4> {
    // Handle the case where descriptor is a number for 1D vector currently typed as RealVector1D
    if (typeof descriptor === 'number') {
        if (isRealVectorSpace(vectorSpace, 1)) {
            return createVector1DRealFromDescriptor(descriptor, vectorSpace);
        }
        return createVector1DRealFromDescriptor(descriptor);
    }
    if (descriptor === null || typeof descriptor !== 'object' || !('type' in descriptor)) {
        const error = sendRangeErrorMessage('function', 'createRealVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    switch (descriptor.type) {
        case REALVECTOR2D:
            if (isRealVectorSpace(vectorSpace, 2)) {
                return createVector2DRealFromDescriptor(descriptor, vectorSpace);
            }
            return createVector2DRealFromDescriptor(descriptor);
        case REALVECTOR3D:
            if (isRealVectorSpace(vectorSpace, 3)) {
                return createVector3DRealFromDescriptor(descriptor, vectorSpace);
            }
            return createVector3DRealFromDescriptor(descriptor);
        case REALVECTOR4D:
            if (isRealVectorSpace(vectorSpace, 4)) {
                return createVector4DRealFromDescriptor(descriptor, vectorSpace);
            }
            return createVector4DRealFromDescriptor(descriptor);
        default:
    }
    const error = sendRangeErrorMessage('function', 'createRealVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
    throw new RangeError(error.generateMessageString());
}



export function createVector1DComlplexFromDescriptor(descriptor: ComplexVector1D, vectorSpace?: ComplexVectorSpace<1>): ComplexVector<1> {
    if (vectorSpace !== undefined && !isComplexVectorSpace(vectorSpace, 1)) {
        const error = sendRangeErrorMessage('function', 'createVector1DComlplexFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector1DComplex(
            descriptor.real,
            descriptor.imaginary,
            vectorSpace);
}

export function createVector2DComplexFromDescriptor(descriptor: ComplexVector2D, vectorSpace?: ComplexVectorSpace<2>): ComplexVector<2> {
    if (vectorSpace !== undefined && !isComplexVectorSpace(vectorSpace, 2)) {
        const error = sendRangeErrorMessage('function', 'createVector2DComplexFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new Vector2DComplex(
            descriptor.coordinates[0].real,
            descriptor.coordinates[0].imaginary,
            descriptor.coordinates[1].real,
            descriptor.coordinates[1].imaginary,
            vectorSpace);
}

export function createComplexVectorFromDescriptor(descriptor: ComplexVector1D, vectorSpace?: ComplexVectorSpace<1>): ComplexVector<1>;
export function createComplexVectorFromDescriptor(descriptor: ComplexVector2D, vectorSpace?: ComplexVectorSpace<2>): ComplexVector<2>;
export function createComplexVectorFromDescriptor(descriptor: ComplexVectorDesc,
    vectorSpace?: ComplexVectorSpace<1> | ComplexVectorSpace<2>
    ): ComplexVector<1> | ComplexVector<2> {
    if (descriptor === null || typeof descriptor !== 'object' || !('type' in descriptor)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveComplexVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    switch (descriptor.type) {
        case COMPLEX:
            // Handle the case where descriptor is a complex number for 1D vector currently typed as Complex
            if (isComplexVectorSpace(vectorSpace, 1)) {
                return createVector1DComlplexFromDescriptor(descriptor, vectorSpace);
            }
            return createVector1DComlplexFromDescriptor(descriptor);
        case COMPLEXVECTOR2D:
            if (isComplexVectorSpace(vectorSpace, 2)) {
                return createVector2DComplexFromDescriptor(descriptor, vectorSpace);
            }
            return createVector2DComplexFromDescriptor(descriptor);
        default:
    }
    const error = sendRangeErrorMessage('function', 'createComplexVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
    throw new RangeError(error.generateMessageString());
}


export function createProjectiveRealVector2DFromDescriptor(descriptor: ProjectiveRealVector2D, vectorSpace?: ProjectiveRealVectorSpace<3>): ProjectiveVector2DReal {
    if (vectorSpace !== undefined && !isProjectiveRealVectorSpace(vectorSpace, 3)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveRealVector2DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new ProjectiveVector2DReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            descriptor.coordinates[2].weight,
            vectorSpace);
}

export function createProjectiveRealVector3DFromDescriptor(descriptor: ProjectiveRealVector3D, vectorSpace?: ProjectiveRealVectorSpace<4>): ProjectiveVector3DReal {
    if (vectorSpace !== undefined && !isProjectiveRealVectorSpace(vectorSpace, 4)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveRealVector3DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new ProjectiveVector3DReal(
            descriptor.coordinates[0],
            descriptor.coordinates[1],
            descriptor.coordinates[2],
            descriptor.coordinates[3].weight,
            vectorSpace);
}

export function createProjectiveRealVectorFromDescriptor(descriptor: ProjectiveRealVector2D, vectorSpace?: ProjectiveRealVectorSpace<3>): ProjectiveRealVector<3>;
export function createProjectiveRealVectorFromDescriptor(descriptor: ProjectiveRealVector3D, vectorSpace?: ProjectiveRealVectorSpace<4>): ProjectiveRealVector<4>;
export function createProjectiveRealVectorFromDescriptor(descriptor: ProjectiveRealVectorDesc,
    vectorSpace?: ProjectiveRealVectorSpace<3> | ProjectiveRealVectorSpace<4>
    ): ProjectiveRealVector<3> | ProjectiveRealVector<4> {
    if (descriptor === null || typeof descriptor !== 'object' || !('type' in descriptor)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveRealVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    switch (descriptor.type) {
        case PROJECTIVEREALVECTOR2D:
            if (isProjectiveRealVectorSpace(vectorSpace, 3)) {
                return createProjectiveRealVector2DFromDescriptor(descriptor, vectorSpace);
            }
            return createProjectiveRealVector2DFromDescriptor(descriptor);
        case PROJECTIVEREALVECTOR3D:
            if (isProjectiveRealVectorSpace(vectorSpace, 4)) {
                return createProjectiveRealVector3DFromDescriptor(descriptor, vectorSpace);
            }
            return createProjectiveRealVector3DFromDescriptor(descriptor);
        default:
    }
    const error = sendRangeErrorMessage('function', 'createProjectiveRealVectorFromDescriptor', EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
    throw new RangeError(error.generateMessageString());
}


export function createProjectiveComplexVector1DFromDescriptor(descriptor: ProjectiveComplexVector1D, vectorSpace?: ProjectiveComplexVectorSpace<2>): ProjectiveComplexVector<2> {
    if (vectorSpace !== undefined && !isProjectiveComplexVectorSpace(vectorSpace, 2)) {
        const error = sendRangeErrorMessage('function', 'createProjectiveComplexVector1DFromDescriptor', EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        throw new RangeError(error.generateMessageString());
    }
    return new ProjectiveVector1DComplex(
            descriptor.coordinates[0].real,
            descriptor.coordinates[0].imaginary,
            descriptor.coordinates[1].real,
            descriptor.coordinates[1].imaginary,
            vectorSpace);
}

export function createProjectiveComplexVectorFromDescriptor(descriptor: ProjectiveComplexVector1D, vectorSpace?: ProjectiveComplexVectorSpace<2>): ProjectiveComplexVector<2>;
export function createProjectiveComplexVectorFromDescriptor(descriptor: ProjectiveComplexVectorDesc,
    vectorSpace?: ProjectiveComplexVectorSpace<2>
    ): ProjectiveComplexVector<2> {
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

export function createVectorFromAnyDescriptor(descriptor: VectorDesc,
    vectorSpace: RealVectorSpace<number> | ProjectiveRealVectorSpace<number> | ComplexVectorSpace<number> | ProjectiveComplexVectorSpace<number>): Vector<number, any>
{
    if (vectorSpace instanceof RealVectorSpace) {
        if (typeof descriptor === "number") {
            return createRealVectorFromDescriptor(descriptor as RealVector1D, vectorSpace as RealVectorSpace<1>);
        }
        if (typeof descriptor === "object" && "type" in descriptor) {
            if (descriptor.type === REALVECTOR2D) {
                return createRealVectorFromDescriptor(descriptor as RealVector2D, vectorSpace as RealVectorSpace<2>);
            }
            if (descriptor.type === REALVECTOR3D) {
                return createRealVectorFromDescriptor(descriptor as RealVector3D, vectorSpace as RealVectorSpace<3>);
            }
            if (descriptor.type === REALVECTOR4D) {
                return createRealVectorFromDescriptor(descriptor as RealVector4D, vectorSpace as RealVectorSpace<4>);
            }
        }
    } else if (vectorSpace instanceof ProjectiveRealVectorSpace) {
        if (typeof descriptor === "object" && "type" in descriptor) {
            if (descriptor.type === PROJECTIVEREALVECTOR2D) {
                return createProjectiveRealVectorFromDescriptor(descriptor as ProjectiveRealVector2D, vectorSpace as ProjectiveRealVectorSpace<3>);
            }
            if (descriptor.type === PROJECTIVEREALVECTOR3D) {
                return createProjectiveRealVectorFromDescriptor(descriptor as ProjectiveRealVector3D, vectorSpace as ProjectiveRealVectorSpace<4>);
            }
        }
    } else if (vectorSpace instanceof ComplexVectorSpace) {
        if (typeof descriptor === "object" && "type" in descriptor) {
            if (descriptor.type === COMPLEX) {
                return createComplexVectorFromDescriptor(descriptor as ComplexVector1D, vectorSpace as ComplexVectorSpace<1>);
            }
            if (descriptor.type === COMPLEXVECTOR2D) {
                return createComplexVectorFromDescriptor(descriptor as ComplexVector2D, vectorSpace as ComplexVectorSpace<2>);
            }
        }
    } else if (vectorSpace instanceof ProjectiveComplexVectorSpace) {
        if (typeof descriptor === "object" && "type" in descriptor) {
            if (descriptor.type === PROJECTIVECOMPLEXVECTOR1D) {
                return createProjectiveComplexVectorFromDescriptor(descriptor as ProjectiveComplexVector1D, vectorSpace as ProjectiveComplexVectorSpace<2>);
            }
        }
    }
    throw new RangeError(`createVectorFromAnyDescriptor: descriptor type incompatible with vector space`);
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
