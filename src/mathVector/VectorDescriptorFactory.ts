import { EM_WEIGHT_VALUE_POSITIVE } from "../ErrorMessages/Weight";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { Complex } from "./Complex";
import { ComplexWeight } from "./ComplexWeight";
import { ComplexVector1D, ComplexVector2D, ProjectiveComplexVector1D, ProjectiveVector2D, ProjectiveVector3D, RealVector1D, RealVector2D, RealVector3D, RealVector4D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export function createVector1DRealDescriptor(x: number): RealVector1D {
    const result = x;
    return result;
}

export function copyDescriptorVector1DReal(descriptor: RealVector1D): RealVector1D {
    const result = descriptor;
    return result;
}

export function createVector2DRealDescriptor(): RealVector2D;
export function createVector2DRealDescriptor(x?: number, y?: number): RealVector2D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    return {type: REALVECTOR2D, coordinates: [x1, y1]};
}

export function copyDescriptorVector2DReal(descriptor: RealVector2D): RealVector2D {
    return {type: REALVECTOR2D, coordinates: [descriptor.coordinates[0], descriptor.coordinates[1]]};
}

export function createVector3DRealDescriptor(): RealVector3D;
export function createVector3DRealDescriptor(x?: number, y?: number, z?: number): RealVector3D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    const z1 = z ?? 0;
    return {type: REALVECTOR3D, coordinates: [x1, y1, z1]};
}

export function copyDescriptorVector3DReal(descriptor: RealVector3D): RealVector3D {
    return {type: REALVECTOR3D, coordinates: [descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2]]};
}


export function createVector4DRealDescriptor(): RealVector4D;
export function createVector4DRealDescriptor(x?: number, y?: number, z?: number, t?: number): RealVector4D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    const z1 = z ?? 0;
    const t1 = t ?? 0;
    return {type: REALVECTOR4D, coordinates: [x1, y1, z1, t1]};
}

export function copyDescriptorVector4DReal(descriptor: RealVector4D): RealVector4D {
    return {type: REALVECTOR4D, coordinates: [descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2], descriptor.coordinates[3]]};
}

export function createVector3DProjectiveRealDescriptor(): ProjectiveVector2D;
export function createVector3DProjectiveRealDescriptor(x: number, y: number): ProjectiveVector2D;
export function createVector3DProjectiveRealDescriptor(x?: number, y?: number, w?: number): ProjectiveVector2D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    const w1 = w ?? DEFAULT_WEIGHT_VALUE;
    let weight = new Weight(w1);
    if(w1 === 0) weight = new Weight(w1, false);
    if(w1 < 0) {
        const error = sendRangeErrorMessage(('function'), 'createVector3DProjectiveRealDescriptor', EM_WEIGHT_VALUE_POSITIVE);
        throw new RangeError(error.generateMessageString());
    }
    return {type: PROJECTIVEVECTOR2D, coordinates: [x1, y1, weight.toDescriptor()]};
}

export function copyDescriptorVector3DProjectiveReal(descriptor: ProjectiveVector2D): ProjectiveVector2D {
    return {type: PROJECTIVEVECTOR2D, coordinates: [descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2]]};
}

export function createVector4DProjectiveRealDescriptor(): ProjectiveVector3D;
export function createVector4DProjectiveRealDescriptor(x: number, y: number, z: number): ProjectiveVector3D;
export function createVector4DProjectiveRealDescriptor(x?: number, y?: number, z?: number, w?: number): ProjectiveVector3D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    const z1 = z ?? 0;
    const w1 = w ?? DEFAULT_WEIGHT_VALUE;
    let weight = new Weight(w1);
    if(w1 === 0) weight = new Weight(w1, false);
    if(w1 < 0) {
        const error = sendRangeErrorMessage(('function'), 'createVector4DProjectiveRealDescriptor', EM_WEIGHT_VALUE_POSITIVE);
        throw new RangeError(error.generateMessageString());
    }
    return {type: PROJECTIVEVECTOR3D, coordinates: [x1, y1, z1, weight.toDescriptor()]};
}

export function copyDescriptorVector4DProjectiveReal(descriptor: ProjectiveVector3D): ProjectiveVector3D {
    return {type: PROJECTIVEVECTOR3D, coordinates: [descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2], descriptor.coordinates[3]]};
}

export function createVector1DComplexDescriptor(): ComplexVector1D;
export function createVector1DComplexDescriptor(x?: number, y?: number): ComplexVector1D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    return {type: COMPLEX, real: x1, imaginary: y1};
}

export function copyDescriptorVector1DComplex(descriptor: ComplexVector1D): ComplexVector1D {
    return {type: COMPLEX, real: descriptor.real, imaginary: descriptor.imaginary};
}

export function createVector2DComplexDescriptor(): ComplexVector2D;
export function createVector2DComplexDescriptor(x1?: number, y1?: number, x2?: number, y2?: number): ComplexVector2D {
    const c1Real = x1 ?? 0;
    const c1Imaginary = y1 ?? 0;
    const c2Real = x2 ?? 0;
    const c2Imaginary = y2 ?? 0;
    return {type: COMPLEXVECTOR2D, coordinates: [new Complex(c1Real, c1Imaginary).toDescriptor(), new Complex(c2Real, c2Imaginary).toDescriptor()]};
}

export function copyDescriptorVector2DComplex(descriptor: ComplexVector2D): ComplexVector2D {
    return {type: COMPLEXVECTOR2D, coordinates: [descriptor.coordinates[0], descriptor.coordinates[1]]};
}


export function createVector2DProjectiveComplexDescriptor(): ProjectiveComplexVector1D;
export function createVector2DProjectiveComplexDescriptor(real: number, imaginary: number): ProjectiveComplexVector1D;
export function createVector2DProjectiveComplexDescriptor(real: number, imaginary: number, realW: number, imaginaryW: number): ProjectiveComplexVector1D;
export function createVector2DProjectiveComplexDescriptor(real?: number, imaginary?: number, realW?: number, imaginaryW?: number): ProjectiveComplexVector1D {
    const cReal = real ?? 0;
    const cImaginary = imaginary ?? 0;
    const wReal = realW ?? DEFAULT_WEIGHT_VALUE;
    const wImaginary = imaginaryW ?? DEFAULT_IMAGINARY_WEIGHT_VALUE;
    let weightReal = new Weight(wReal);
    if(wReal === 0) weightReal = new Weight(wReal, false);
    if(wReal < 0) {
        const error = sendRangeErrorMessage(('function'), 'createVector2DProjectiveComplexDescriptor', EM_WEIGHT_VALUE_POSITIVE);
        throw new RangeError(error.generateMessageString());
    }
    let weightImaginary = new Weight(wImaginary);
    if(wImaginary === 0) weightImaginary = new Weight(wImaginary, false);
    if(wImaginary < 0) {
        const error = sendRangeErrorMessage(('function'), 'createVector2DProjectiveComplexDescriptor', EM_WEIGHT_VALUE_POSITIVE);
        throw new RangeError(error.generateMessageString());
    }
    return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [new Complex(cReal, cImaginary).toDescriptor(), new ComplexWeight(weightReal, weightImaginary).toDescriptor()]};
}

export function copyDescriptorVector2DProjectiveComplex(descriptor: ProjectiveComplexVector1D): ProjectiveComplexVector1D {
    return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [descriptor.coordinates[0], descriptor.coordinates[1]]};
}
