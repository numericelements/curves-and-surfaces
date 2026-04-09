import { VectorSpaceType } from "./BSplineR1toRn";
import { COMPLEX } from "./ComplexTypeTag";

export const REALVECTOR1D = 'RealVector1D' as const;
export const REALVECTOR2D = 'RealVector2D' as const;
export const REALVECTOR3D = 'RealVector3D' as const;
export const REALVECTOR4D = 'RealVector4D' as const;
export const COMPLEXVECTOR1D = 'ComplexVector1D' as const;
export const COMPLEXVECTOR2D = 'ComplexVector2D' as const;
export const PROJECTIVEREALVECTOR2D = 'ProjectiveRealVector2D' as const;
export const PROJECTIVEREALVECTOR3D = 'ProjectiveRealVector3D' as const;
export const PROJECTIVECOMPLEXVECTOR1D = 'ProjectiveComplexVector1D' as const;
export const UNDEFINED_VECTORDESCRIPTOR = 'UndefinedVectorDescriptor' as const;

export const VECTOR_DESCRIPTOR_INFO = {
    UndefinedVectorType: {
        typeString: UNDEFINED_VECTORDESCRIPTOR,
        vectorSpaceType: VectorSpaceType.UNKNOWN_VECTORSPACE,
        spaceDimension: 0,
        isBasicType: false
    },
    RealVector1D: {
        typeString: REALVECTOR1D,
        vectorSpaceType: VectorSpaceType.REAL,
        spaceDimension: 1,
        isBasicType: true
    },
    RealVector2D: {
        typeString: REALVECTOR2D,
        vectorSpaceType: VectorSpaceType.REAL,
        spaceDimension: 2,
        isBasicType: false
    },
    RealVector3D: {
        typeString: REALVECTOR3D,
        vectorSpaceType: VectorSpaceType.REAL,
        spaceDimension: 3,
        isBasicType: false
    },
    RealVector4D: {
        typeString: REALVECTOR4D,
        vectorSpaceType: VectorSpaceType.REAL,
        spaceDimension: 4,
        isBasicType: false
    },
    Complex: {
        typeString: COMPLEX,
        vectorSpaceType: VectorSpaceType.COMPLEX,
        spaceDimension: 1,
        isBasicType: false
    },
    ComplexVector1D: {
        typeString: COMPLEXVECTOR1D,
        vectorSpaceType: VectorSpaceType.COMPLEX,
        spaceDimension: 1,
        isBasicType: false
    },
    ComplexVector2D: {
        typeString: COMPLEXVECTOR2D,
        vectorSpaceType: VectorSpaceType.COMPLEX,
        spaceDimension: 2,
        isBasicType: false
    },
    ProjectiveRealVector2D: {
        typeString: PROJECTIVEREALVECTOR2D,
        vectorSpaceType: VectorSpaceType.PROJECTIVEREAL,
        spaceDimension: 3,
        isBasicType: false
    },
    ProjectiveRealVector3D: {
        typeString: PROJECTIVEREALVECTOR3D,
        vectorSpaceType: VectorSpaceType.PROJECTIVEREAL,
        spaceDimension: 4,
        isBasicType: false
    },
    ProjectiveComplexVector1D: {
        typeString: PROJECTIVECOMPLEXVECTOR1D,
        vectorSpaceType: VectorSpaceType.PROJECTIVECOMPLEX,
        spaceDimension: 2,
        isBasicType: false
    }
} as const;

// export type VectorTypeTag =
//   | typeof REALVECTOR1D
//   | typeof REALVECTOR2D
//   | typeof REALVECTOR3D
//   | typeof REALVECTOR4D
//   | typeof COMPLEXVECTOR1D
//   | typeof COMPLEXVECTOR2D
//   | typeof PROJECTIVEVECTOR2D
//   | typeof PROJECTIVEVECTOR3D
//   | typeof PROJECTIVECOMPLEXVECTOR1D
//   | typeof UNDEFINED_VECTORTYPE;