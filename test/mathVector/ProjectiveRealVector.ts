import { expect } from "chai";
import { createCommonProjectiveRealVectorTests } from "./ProjectiveRealVectorTestFactory";
import { MAX_DIMENSION_PROJECTIVEREALVECTORSPACE, MIN_DIMENSION_PROJECTIVEREALVECTORSPACE } from "../../src/namedConstants/ProjectiveRealVectorSpace";

describe('ProjectiveRealVector', () => {

        describe('Methods', () => {

            for(let dim = MIN_DIMENSION_PROJECTIVEREALVECTORSPACE; dim <= MAX_DIMENSION_PROJECTIVEREALVECTORSPACE; dim++) {
                // dim D RealVector Space Tests
                describe(`${dim}D Vector Space`, () => {
                    createCommonProjectiveRealVectorTests(dim as 3 | 4);
                });
            }

        });
});