"use strict";
/**
 * Core types and interfaces for vector space operations
 * Implements mathematical vector space axioms for real and complex numbers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VECTOR_TYPE_INFO = void 0;
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
// never;
exports.VECTOR_TYPE_INFO = {
    UndefinedVectorType: {
        typeString: VectorTypeTags_1.UNDEFINED_VECTORTYPE,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.UNKNOWN_VECTORSPACE,
        spaceDimension: 0,
        isBasicType: false
    },
    RealVector1D: {
        typeString: VectorTypeTags_1.REALVECTOR1D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
        spaceDimension: 1,
        isBasicType: true
    },
    RealVector2D: {
        typeString: VectorTypeTags_1.REALVECTOR2D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
        spaceDimension: 2,
        isBasicType: false
    },
    RealVector3D: {
        typeString: VectorTypeTags_1.REALVECTOR3D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
        spaceDimension: 3,
        isBasicType: false
    },
    RealVector4D: {
        typeString: VectorTypeTags_1.REALVECTOR4D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.REAL,
        spaceDimension: 4,
        isBasicType: false
    },
    Complex: {
        typeString: ComplexTypeTag_1.COMPLEX,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.COMPLEX,
        spaceDimension: 1,
        isBasicType: false
    },
    ComplexVector1D: {
        typeString: VectorTypeTags_1.COMPLEXVECTOR1D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.COMPLEX,
        spaceDimension: 1,
        isBasicType: false
    },
    ComplexVector2D: {
        typeString: VectorTypeTags_1.COMPLEXVECTOR2D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.COMPLEX,
        spaceDimension: 2,
        isBasicType: false
    },
    ProjectiveVector2D: {
        typeString: VectorTypeTags_1.PROJECTIVEVECTOR2D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVE,
        spaceDimension: 3,
        isBasicType: false
    },
    ProjectiveVector3D: {
        typeString: VectorTypeTags_1.PROJECTIVEVECTOR3D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVE,
        spaceDimension: 4,
        isBasicType: false
    },
    ProjectiveComplexVector1D: {
        typeString: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D,
        vectorSpaceType: BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX,
        spaceDimension: 2,
        isBasicType: false
    }
};
