import { expect } from "chai";

import { IProjectiveVector } from "../../src/mathVector/Vector";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { ANGULAR_TOL_VECTOR, EM_NORM_TOO_SMALL, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTOR_NORM_TOO_SMALL, EM_VECTORS_DIFFERENT_VECTOR_SPACES, EM_VECTORS_NOT_IN_SAME_VECTORSPACE, LINEAR_TOL_VECTOR } from "../../src/namedConstants/Vectors";
import { COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF, TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { Weight } from "../../src/mathVector/Weight";
import { ProjectiveVector3DTypeReal } from "../../src/mathVector/ProjectiveVector3DTypeReal";
import { ProjectiveVector2DTypeReal } from "../../src/mathVector/ProjectiveVector2DTypeReal";


const defaultCoordinates = [1, 2];
const defaultWeight = new Weight(1);

export function createCommonRealVectorTests(
    dimension: number
) {
    describe('Common ProjectiveVector Tests', () => {

        describe('Accessors', () => {
            it(`can get the dimension of the space where a vector is defined`, () => {
                const vSpace = new ProjectiveVectorSpace(dimension);
                const realVector = createTestProjectiveVector(dimension, vSpace);
                expect(realVector.dimension).to.eql(dimension);
            });
        });
    });
}

// Helper function to create test vectors
export function createTestProjectiveVector(
    dimension: number, vectorSpace?: ProjectiveVectorSpace, coordinates?: number[], weight?: Weight
): IProjectiveVector {
    switch(dimension) {
        case 3:
            return new ProjectiveVector2DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1],
                                        weight ? weight : defaultWeight, vectorSpace ? vectorSpace as ProjectiveVectorSpace<3>: undefined);
        case 4:
            return new ProjectiveVector3DTypeReal(coordinates ? coordinates[0] : defaultCoordinates[0],
                                        coordinates ? coordinates[1] : defaultCoordinates[1],
                                        coordinates ? coordinates[2] : defaultCoordinates[2],
                                        weight ? weight : defaultWeight, vectorSpace ? vectorSpace as ProjectiveVectorSpace<4>: undefined);
        default:
            throw new Error(`createTestRealVector: Unsupported dimension: ${dimension}`);
    }
}