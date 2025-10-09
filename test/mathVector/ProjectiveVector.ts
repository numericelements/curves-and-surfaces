import { expect } from "chai";
import { createCommonProjectiveVectorTests } from "./ProjectiveVectorTestFactory";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE } from "../../src/namedConstants/ProjectiveVectorSpace";

describe('ProjectiveRealVector', () => {

        describe('Methods', () => {

            for(let dim = MIN_DIMENSION_PROJECTIVEVECTORSPACE; dim <= MAX_DIMENSION_PROJECTIVEVECTORSPACE; dim++) {
                // dim D RealVector Space Tests
                describe(`${dim}D Vector Space`, () => {
                    createCommonProjectiveVectorTests(dim);
                });
            }

        });
});