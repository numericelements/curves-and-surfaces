import { expect } from "chai";
import { MAX_DIMENSION_COMPLEXVECTORSPACE, MIN_DIMENSION_COMPLEXVECTORSPACE } from "../../src/namedConstants/ComplexVectorSpace";
import { createCommonComplexVectorTests } from "./ComplexVectorTestFactory";

describe('ComplexVector', () => {

        describe('Methods', () => {

            for(let dim = MIN_DIMENSION_COMPLEXVECTORSPACE; dim <= MAX_DIMENSION_COMPLEXVECTORSPACE; dim++) {
                // dim D ComplexVector Space Tests
                describe(`${dim}D Complex Vector Space`, () => {
                    createCommonComplexVectorTests(dim);
                });
            }

        });
});