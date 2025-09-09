import { expect } from "chai";
import { createCommonRealVectorTests } from "./RealVectorTestFactory";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../../src/namedConstants/RealVectorSpace";

describe('RealVector', () => {

        describe('Methods', () => {

            for(let dim = MIN_DIMENSION_REALVECTORSPACE; dim <= MAX_DIMENSION_REALVECTORSPACE; dim++) {
                // dim D RealVector Space Tests
                describe(`${dim}D Vector Space`, () => {
                    createCommonRealVectorTests(dim);
                });
            }

        });
});