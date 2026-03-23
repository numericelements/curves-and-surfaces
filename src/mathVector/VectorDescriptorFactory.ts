import { EM_WEIGHT_VALUE_POSITIVE } from "../ErrorMessages/Weight";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEXWEIGHT, WEIGHT } from "../namedConstants/WeightTypeTags";
import { hasType } from "../newBsplines/AbstractBSplineR1toRn";
import { Complex } from "./Complex";
import { ComplexWeight } from "./ComplexWeight";
import { ComplexVector1D, ComplexVector2D, IComplex, IComplexWeight, IWeight, ProjectiveComplexVector1D, ProjectiveVector2D, ProjectiveVector3D, RealVector1D, RealVector2D, RealVector3D, RealVector4D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

export function createWeightDescriptor(value?: number, strictlyPositive?: boolean): IWeight {
    if(value !== undefined && value < 0) {
        const error = sendRangeErrorMessage(('function'), 'createWeightDescriptor', EM_WEIGHT_VALUE_POSITIVE);
        throw new RangeError(error.generateMessageString());
    }
    let strPositive = strictlyPositive ?? true;
    if(value !== undefined && value === 0) {
        strPositive = false;
    }
    const weight = new Weight(value, strPositive);
    return { type: WEIGHT, weight: weight };
}

export function cloneDescriptorWeight(descriptor: IWeight): IWeight {
    const weightCopy = descriptor.weight.clone();
    return createWeightDescriptor(weightCopy.value, weightCopy.strictlyPositive);
}

export function createComplexWeightDescriptor(): IComplexWeight;
export function createComplexWeightDescriptor(realWeight: Weight, imaginaryWeight?: Weight): IComplexWeight;
export function createComplexWeightDescriptor(realWeight: IWeight, imaginaryWeight: IWeight): IComplexWeight;
export function createComplexWeightDescriptor(realWeight?: Weight | IWeight, imaginaryWeight?: Weight | IWeight): IComplexWeight {
    if (!(realWeight instanceof Weight) && hasType(realWeight, WEIGHT)) {
        return { type: COMPLEXWEIGHT, real: realWeight.weight, imaginary: (imaginaryWeight as IWeight)?.weight ?? new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, true)};
    }
    if (realWeight === undefined) {
        realWeight = new Weight(DEFAULT_WEIGHT_VALUE, true);
        imaginaryWeight = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
    } else if (realWeight instanceof Weight && (imaginaryWeight === undefined || imaginaryWeight instanceof Weight)) {
        if (imaginaryWeight === undefined) 
            imaginaryWeight = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
    } else {
        throw new RangeError('Invalid parameters for createComplexWeightDescriptor');
    }
    return { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight};
}

export function cloneDescriptorComplexWeight(descriptor: IComplexWeight): IComplexWeight {
    const realWeightCopy = descriptor.real.clone();
    const imaginaryWeightCopy = descriptor.imaginary.clone();
    return createComplexWeightDescriptor(realWeightCopy, imaginaryWeightCopy);
}


export function createRealVector1DDescriptor(x?: number): RealVector1D {
    const result = x ?? 0;
    return result;
}

export function copyDescriptorRealVector1D(descriptor: RealVector1D): RealVector1D {
    const result = descriptor;
    return result;
}

export function createRealVector2DDescriptor(): RealVector2D;
export function createRealVector2DDescriptor(x: number, y: number): RealVector2D;
export function createRealVector2DDescriptor(x?: number, y?: number): RealVector2D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    return {type: REALVECTOR2D, coordinates: [x1, y1]};
}

export function copyDescriptorRealVector2D(descriptor: RealVector2D): RealVector2D {
    return {type: REALVECTOR2D, coordinates: [
        Number(descriptor.coordinates[0]), Number(descriptor.coordinates[1])
    ]};
}

export function createRealVector3DDescriptor(): RealVector3D;
export function createRealVector3DDescriptor(x: number, y: number, z: number): RealVector3D;
export function createRealVector3DDescriptor(x?: number, y?: number, z?: number): RealVector3D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    const z1 = z ?? 0;
    return {type: REALVECTOR3D, coordinates: [x1, y1, z1]};
}

export function copyDescriptorRealVector3D(descriptor: RealVector3D): RealVector3D {
    return {type: REALVECTOR3D, coordinates: [
        Number(descriptor.coordinates[0]), Number(descriptor.coordinates[1]), Number(descriptor.coordinates[2])
    ]};
}


export function createRealVector4DDescriptor(): RealVector4D;
export function createRealVector4DDescriptor(x: number, y: number, z: number, t: number): RealVector4D;
export function createRealVector4DDescriptor(x?: number, y?: number, z?: number, t?: number): RealVector4D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    const z1 = z ?? 0;
    const t1 = t ?? 0;
    return {type: REALVECTOR4D, coordinates: [x1, y1, z1, t1]};
}

export function copyDescriptorRealVector4D(descriptor: RealVector4D): RealVector4D {
    return {type: REALVECTOR4D, coordinates: [
        Number(descriptor.coordinates[0]), Number(descriptor.coordinates[1]), Number(descriptor.coordinates[2]), Number(descriptor.coordinates[3])
    ]};
}

export function createProjectiveVector2DDescriptor(): ProjectiveVector2D;
export function createProjectiveVector2DDescriptor(x: number, y: number): ProjectiveVector2D;
export function createProjectiveVector2DDescriptor(x: number, y: number, weight: Weight): ProjectiveVector2D;
export function createProjectiveVector2DDescriptor(x: number, y: number, weight: IWeight): ProjectiveVector2D;
export function createProjectiveVector2DDescriptor(x: number, y: number, weightValue: number, strictlyPositive?: boolean): ProjectiveVector2D;
export function createProjectiveVector2DDescriptor(x?: number, y?: number, weightValOrWeightOrWeightDscr?: number | Weight | IWeight, strictlyPositive?: boolean): ProjectiveVector2D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    let weightDescriptor: IWeight;
    if (weightValOrWeightOrWeightDscr === undefined) {
        // no weight provided: default
        weightDescriptor = createWeightDescriptor(DEFAULT_WEIGHT_VALUE, true);

    } else if (typeof weightValOrWeightOrWeightDscr === 'number') {
        // overload: (x, y, weightValue, strictlyPositive?)
        const wVal = weightValOrWeightOrWeightDscr;
        if (wVal < 0) {
            const error = sendRangeErrorMessage('function', 'createProjectiveVector2DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
            throw new RangeError(error.generateMessageString());
        }
        const sp = (wVal === 0) ? false : (strictlyPositive ?? true);
        weightDescriptor = createWeightDescriptor(wVal, sp);

    } else if (weightValOrWeightOrWeightDscr instanceof Weight) {
        // overload: (x, y, weight: Weight)  ← instanceof distinguishes Weight from IWeight
        if (weightValOrWeightOrWeightDscr.value < 0) {
            const error = sendRangeErrorMessage('function', 'createProjectiveVector2DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
            throw new RangeError(error.generateMessageString());
        }
        weightDescriptor = weightValOrWeightOrWeightDscr.toDescriptor();

    } else if (hasType(weightValOrWeightOrWeightDscr, WEIGHT)) {
        // overload: (x, y, weight: IWeight)  ← structural descriptor { type: WEIGHT, weight: Weight }
        if (weightValOrWeightOrWeightDscr.weight.value < 0) {
            const error = sendRangeErrorMessage('function', 'createProjectiveVector2DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
            throw new RangeError(error.generateMessageString());
        }
        weightDescriptor = cloneDescriptorWeight(weightValOrWeightOrWeightDscr);
    } else {
        const error = sendRangeErrorMessage('function', 'createProjectiveVector2DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
        throw new RangeError(error.generateMessageString());
    }
    return { type: PROJECTIVEVECTOR2D, coordinates: [x1, y1, weightDescriptor]};
}

export function cloneDescriptorProjectiveRealVector2D(descriptor: ProjectiveVector2D): ProjectiveVector2D {
    return {type: PROJECTIVEVECTOR2D, coordinates: [
        Number(descriptor.coordinates[0]), Number(descriptor.coordinates[1]),
        cloneDescriptorWeight(descriptor.coordinates[2])
    ]};
}


export function createProjectiveVector3DDescriptor(): ProjectiveVector3D;
export function createProjectiveVector3DDescriptor(x: number, y: number, z: number): ProjectiveVector3D;
export function createProjectiveVector3DDescriptor(x: number, y: number, z: number, weight: Weight): ProjectiveVector3D;
export function createProjectiveVector3DDescriptor(x: number, y: number, z: number, weight: IWeight): ProjectiveVector3D;
export function createProjectiveVector3DDescriptor(x: number, y: number, z: number, weightValue: number, strictlyPositive?: boolean): ProjectiveVector3D;
export function createProjectiveVector3DDescriptor(x?: number, y?: number, z?: number, weightValOrWeightOrWeightDscr?: number | Weight | IWeight, strictlyPositive?: boolean): ProjectiveVector3D {
    const x1 = x ?? 0;
    const y1 = y ?? 0;
    const z1 = z ?? 0;
    let weightDescriptor: IWeight;
    if (weightValOrWeightOrWeightDscr === undefined) {
        // no weight provided: default
        weightDescriptor = createWeightDescriptor(DEFAULT_WEIGHT_VALUE, true);

    } else if (typeof weightValOrWeightOrWeightDscr === 'number') {
        // overload: (x, y, weightValue, strictlyPositive?)
        const wVal = weightValOrWeightOrWeightDscr;
        if (wVal < 0) {
            const error = sendRangeErrorMessage('function', 'createProjectiveVector3DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
            throw new RangeError(error.generateMessageString());
        }
        const sp = (wVal === 0) ? false : (strictlyPositive ?? true);
        weightDescriptor = createWeightDescriptor(wVal, sp);

    } else if (weightValOrWeightOrWeightDscr instanceof Weight) {
        // overload: (x, y, weight: Weight)  ← instanceof distinguishes Weight from IWeight
        if (weightValOrWeightOrWeightDscr.value < 0) {
            const error = sendRangeErrorMessage('function', 'createProjectiveVector3DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
            throw new RangeError(error.generateMessageString());
        }
        weightDescriptor = weightValOrWeightOrWeightDscr.toDescriptor();

    } else if (hasType(weightValOrWeightOrWeightDscr, WEIGHT)) {
        // overload: (x, y, weight: IWeight)  ← structural descriptor { type: WEIGHT, weight: Weight }
        if (weightValOrWeightOrWeightDscr.weight.value < 0) {
            const error = sendRangeErrorMessage('function', 'createProjectiveVector3DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
            throw new RangeError(error.generateMessageString());
        }
        weightDescriptor = cloneDescriptorWeight(weightValOrWeightOrWeightDscr);
    } else {
        const error = sendRangeErrorMessage('function', 'createProjectiveVector3DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
        throw new RangeError(error.generateMessageString());
    }
    return { type: PROJECTIVEVECTOR3D, coordinates: [x1, y1, z1, weightDescriptor]};
}

export function cloneDescriptorProjectiveRealVector3D(descriptor: ProjectiveVector3D): ProjectiveVector3D {
    return {type: PROJECTIVEVECTOR3D, coordinates: [
        Number(descriptor.coordinates[0]), Number(descriptor.coordinates[1]), Number(descriptor.coordinates[2]),
        cloneDescriptorWeight(descriptor.coordinates[3])
    ]};
}

export function createComplexVector1DDescriptor(): ComplexVector1D;
export function createComplexVector1DDescriptor(complex: Complex): ComplexVector1D;
export function createComplexVector1DDescriptor(real: number, imaginary: number): ComplexVector1D;
export function createComplexVector1DDescriptor(realOrComplex?: number | Complex, imaginary?: number): ComplexVector1D {
    if (typeof realOrComplex === 'object') {
        return { type: COMPLEX, real: realOrComplex.real, imaginary: realOrComplex.imaginary } as ComplexVector1D;
    }
    const x1 = realOrComplex ?? 0;
    const y1 = imaginary ?? 0;
    return { type: COMPLEX, real: x1, imaginary: y1 } as ComplexVector1D;
}

export function copyDescriptorComplexVector1D(descriptor: ComplexVector1D): ComplexVector1D {
    return {type: COMPLEX, real: Number(descriptor.real), imaginary: Number(descriptor.imaginary)};
}

export function createComplexVector2DDescriptor(): ComplexVector2D;
export function createComplexVector2DDescriptor(complex1: Complex, complex2: Complex): ComplexVector2D;
export function createComplexVector2DDescriptor(Icomplex1: IComplex, Icomplex2: IComplex): ComplexVector2D;
export function createComplexVector2DDescriptor(real1: number, imaginary1: number, real2: number, imaginary2: number): ComplexVector2D;
export function createComplexVector2DDescriptor(realOrComplex1OrIComplex1?: number | Complex | IComplex, imaginaryOrComplex1OrIComplex1?: number | Complex | IComplex, realOrComplex2?: number, imaginary2?: number): ComplexVector2D {
    if (typeof realOrComplex1OrIComplex1 === 'object' && typeof imaginaryOrComplex1OrIComplex1 === 'object') {
        if('type' in realOrComplex1OrIComplex1 && 'type' in imaginaryOrComplex1OrIComplex1
            && realOrComplex1OrIComplex1.type === COMPLEX && imaginaryOrComplex1OrIComplex1.type === COMPLEX) {
            return { type: COMPLEXVECTOR2D, coordinates: [realOrComplex1OrIComplex1, imaginaryOrComplex1OrIComplex1] } as ComplexVector2D;
        }
        return { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: realOrComplex1OrIComplex1.real, imaginary: realOrComplex1OrIComplex1.imaginary }, { type: COMPLEX, real: imaginaryOrComplex1OrIComplex1.real, imaginary: imaginaryOrComplex1OrIComplex1.imaginary }] } as ComplexVector2D;
    }
    const c1Real = realOrComplex1OrIComplex1 ?? 0;
    const c1Imaginary = imaginaryOrComplex1OrIComplex1 ?? 0;
    const c2Real = realOrComplex2 ?? 0;
    const c2Imaginary = imaginary2 ?? 0;
    return { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: c1Real, imaginary: c1Imaginary }, { type: COMPLEX, real: c2Real, imaginary: c2Imaginary }] } as ComplexVector2D;
}

export function copyDescriptorComplexVector2D(descriptor: ComplexVector2D): ComplexVector2D {
    return {type: COMPLEXVECTOR2D, coordinates: [
        copyDescriptorComplexVector1D(descriptor.coordinates[0]),
        copyDescriptorComplexVector1D(descriptor.coordinates[1])
    ]};
}


export function createProjectiveComplexVector1DDescriptor(): ProjectiveComplexVector1D;
export function createProjectiveComplexVector1DDescriptor(coordinates: Complex, complexW?: ComplexWeight): ProjectiveComplexVector1D;
export function createProjectiveComplexVector1DDescriptor(coordinates: IComplex, complexW?: IComplexWeight): ProjectiveComplexVector1D;
export function createProjectiveComplexVector1DDescriptor(coordinates?: Complex | IComplex, complexW?: ComplexWeight | IComplexWeight): ProjectiveComplexVector1D {
    let coordinatesDescriptor: IComplex;
    let complexWeightDescriptor: IComplexWeight;
    if(coordinates === undefined) {
        coordinatesDescriptor = createComplexVector1DDescriptor();
    } else if (typeof coordinates === 'object' && !('type' in coordinates)) {
        coordinatesDescriptor = createComplexVector1DDescriptor(coordinates.real, coordinates.imaginary);
    } else {
        coordinatesDescriptor = coordinates;
    }
    if(complexW === undefined) {
        complexWeightDescriptor = createComplexWeightDescriptor();
    } else if (complexW instanceof ComplexWeight) {
        complexWeightDescriptor = complexW.toDescriptor();
    } else {
        if (complexW.real.value < 0 || complexW.imaginary.value < 0 || complexW.real.value === undefined || complexW.imaginary.value === undefined) {
            const error = sendRangeErrorMessage('function', 'createProjectiveComplexVector1DDescriptor', EM_WEIGHT_VALUE_POSITIVE);
            throw new RangeError(error.generateMessageString());
        }
        complexWeightDescriptor = cloneDescriptorComplexWeight(complexW);
    }
    return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [coordinatesDescriptor, complexWeightDescriptor]};
}

export function cloneDescriptorProjectiveComplexVector1D(descriptor: ProjectiveComplexVector1D): ProjectiveComplexVector1D {
    return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
        copyDescriptorComplexVector1D(descriptor.coordinates[0]),
        cloneDescriptorComplexWeight(descriptor.coordinates[1])]};
}
