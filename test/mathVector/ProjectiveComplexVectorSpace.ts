import { expect } from "chai";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../../src/namedConstants/ProjectiveComplexVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../../src/namedConstants/ProjectiveVectorSpace";
import { EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE, EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE, EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER } from "../../src/ErrorMessages/ProjectiveComplexVectorSpace";
import { Complex, COMPLEX, ComplexVector2D, COMPLEXVECTOR2D, ComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, ProjectiveComplexVector1D, PROJECTIVECOMPLEXVECTOR1D, REALVECTOR2D, WEIGHT, Weight_Interface } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { Weight } from "../../src/mathVector/Weight";
import { EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY } from "../../src/ErrorMessages/ComplexOperators";
import { TOLERANCE_FLOAT } from "../namedConstants/GeneralPurpose";

describe('ProjectiveComplexVectorSpace', () => {
    
    describe('Constructor', () => {
        it('can generate a valid ProjectiveComplexVectorSpace dimension between ' + MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + ' and ' + MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, () => {
            expect(() => new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)).to.not.throw()
            expect(() => new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)).to.not.throw()
        });

        it('cannot generate a ProjectiveComplexVectorSpace outside dimension range', () => {
            expect(() => new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE - 1)).to.throw(EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE)
            expect(() => new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE + 1)).to.throw(EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE)
        });

        it('can generate a valid ProjectiveComplexVectorSpace and get its dimension', () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            expect(realVectorSpace.dimension()).to.eql(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)
        });

        it('can generate a valid ProjectiveComplexVectorSpace with a weight management ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
        });

        it('can generate a valid ProjectiveComplexVectorSpace with a weight management ' + WeightManagement.SomeNullWeights, () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.SomeNullWeights);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights);
        });

        it('can generate a valid ProjectiveComplexVectorSpace with a weight management ' + WeightManagement.AllPositiveWeights, () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
        });
    });

    describe('Accesssors', () => {
        it('can get the weight management type of a ProjectiveComplexVectorSpace', () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
        });

        it('can set the weight management type of a ProjectiveComplexVectorSpace to ' + WeightManagement.AllPositiveWeights, () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
            realVectorSpace.weightManagement = WeightManagement.AllPositiveWeights;
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights)
        });

        it('can set the weight management type of a ProjectiveComplexVectorSpace to ' + WeightManagement.SomeNullWeights, () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            realVectorSpace.weightManagement = WeightManagement.SomeNullWeights;
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights)
        });

        it('can set the weight management type of a ProjectiveComplexVectorSpace to ' + WeightManagement.AllStrictlyPositiveWeights, () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.SomeNullWeights);
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.SomeNullWeights)
            realVectorSpace.weightManagement = WeightManagement.AllStrictlyPositiveWeights;
            expect(realVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights)
        });
    });

    describe('Methods', () => {
        it('can get the dimension of a ProjectiveComplexVectorSpace', () => {
            const realVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            expect(realVectorSpace.dimension()).to.eql(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE)
        });

        it(`cannot check that two vectors share the same weight management status if one of the vectors has not the same weight management for its real and imaginary weights`, () => {
            let projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);

            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5)}]};
            let vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5, false)}]};
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[1].real;
            let weight2 = vec2.coordinates[1].real;
            expect(weight1.strictlyPositive).to.eql(true);
            expect(weight2.strictlyPositive).to.eql(true);
            expect(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER)
            vec2 = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(1.5)}]};
            expect(() => projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.throw(EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER)
        });

        it(`can check that two vectors share the same weight management status if both vectors are in the vector space with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            let projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);

            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(1.5)}]};
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllStrictlyPositiveWeights);
            let weight1 = vec1.coordinates[1].real;
            let weight2 = vec2.coordinates[1].real;
            expect(weight1.strictlyPositive).to.eql(true);
            expect(weight2.strictlyPositive).to.eql(true);
            expect(projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        });

        it(`can check that two vectors share the same weight management status if both vectors are in the vector space with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            let projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);

            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(1.5, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(1, false), imaginary: new Weight(1.5, false)}]};
            expect(projectiveVectorSpace.weightManagement).to.eql(WeightManagement.AllPositiveWeights);
            let weight1 = vec1.coordinates[1].real;
            let weight2 = vec2.coordinates[1].real;
            expect(weight1.strictlyPositive).to.eql(false);
            expect(weight2.strictlyPositive).to.eql(false);
            expect(projectiveVectorSpace.shareSameWeightManagement(vec1, vec2)).to.eql(true)
        });

        it(`can generate a default ProjectiveComplexVector`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const res = projectiveVectorSpace.defaultVect();
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(0);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight());
            expect(res.coordinates[1].imaginary).to.eql(new Weight());
        });

        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(1.5)}]};
            const res = projectiveVectorSpace.addRaw(vec1, vec2);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(3);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(3));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(3));
        });

        it(`cannot add two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllStrictlyPositiveWeights} when one vector has a complex weight with positive weight management`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(1, false), imaginary: new Weight(1.5, false)}]};
            expect(() => projectiveVectorSpace.addRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
        });

        it(`cannot add two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllStrictlyPositiveWeights} when both vectors have a complex weight with positive weight management`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(1.5, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(1, false), imaginary: new Weight(1.5, false)}]};
            expect(() => projectiveVectorSpace.addRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
        });

        it('cannot add two ProjectiveComplexVectors of same dimension if one vector has not the same weight positivity management for real and imaginary weights', () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(1.5)}]};
            expect(() => projectiveVectorSpace.addRaw(vec1, vec2)).to.throw(EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER)
        });

        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(1, false), imaginary: new Weight(0, false)}]};
            const res = projectiveVectorSpace.addRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(3);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(3, false));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(0, false));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights} and one complex real weight smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(NULL_WEIGHT_TOLERANCE / 2), imaginary: new Weight(2)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(2, false)}]};
            const res = projectiveVectorSpace.addRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(3);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(0, false));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(4, false));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights} and one complex imaginary weight smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(NULL_WEIGHT_TOLERANCE / 2)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0, false)}]};
            const res = projectiveVectorSpace.addRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(3);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(4, false));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(0, false));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights} and one null complex weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(2)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)}]};
            const res = projectiveVectorSpace.addRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(3);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(2));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(2));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(true);
        });

        it(`can add two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights} and one null real weight and one null imaginary weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(2, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0, false)}]};
            const res = projectiveVectorSpace.addRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(3);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(2));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(2));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(true);
        });

        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 2, imaginary: 3}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(0.5)}]};
            const res = projectiveVectorSpace.subtractRaw(vec1, vec2);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(1);
            expect(res.coordinates[0].imaginary).to.eql(2);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight());
            expect(res.coordinates[1].imaginary).to.eql(new Weight(0.5));
        });

        it(`cannot subtract two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllStrictlyPositiveWeights} when one vector has a complex weight with positive weight management`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(1, false), imaginary: new Weight(1.5, false)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
        });

        it(`cannot subtract two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllStrictlyPositiveWeights} when both vectors have a complex weight with positive weight management`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(1.5, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(1, false), imaginary: new Weight(1.5, false)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
        });

        it('cannot subtract two ProjectiveComplexVectors of same dimension if one vector has not the same weight positivity management for real and imaginary weights', () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(1.5)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER)
        });

        it(`cannot subtract two ProjectiveVectors of same dimension producing a negative real weight with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(1.5)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0.5)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL)
        });

        it(`cannot subtract two ProjectiveComplexVectors of same dimension producing a negative imaginary weight with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight()}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(1.5)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY)
        });

        it(`cannot subtract two ProjectiveComplexVectors of same dimension producing a negative real weight with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight()}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0.5, false)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL)
        });

        it(`cannot subtract two ProjectiveComplexVectors of same dimension producing a negative imaginary weight with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(1.5)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY)
        });

        it(`cannot subtract two ProjectiveComplexVectors of same dimension producing negative real and imaginary weights with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(3), imaginary: new Weight(1.5)}]};
            expect(() => projectiveVectorSpace.subtractRaw(vec1, vec2)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY)
        });

        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(1, false), imaginary: new Weight(0, false)}]};
            const res = projectiveVectorSpace.subtractRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(-1);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(1, false));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(0, false));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights} and one complex real weight smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(NULL_WEIGHT_TOLERANCE / 2), imaginary: new Weight(2)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0.5, false)}]};
            const res = projectiveVectorSpace.subtractRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(1);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(0, false));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(1.5, false));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights} and one complex imaginary weight smaller than ${NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(NULL_WEIGHT_TOLERANCE / 2)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(1, false), imaginary: new Weight(0, false)}]};
            const res = projectiveVectorSpace.subtractRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(1);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(1, false));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(0, false));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights} and one null complex weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(2)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)}]};
            const res = projectiveVectorSpace.subtractRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(1);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(2));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(2));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(true);
        });

        it(`can subtract two ProjectiveComplexVectors of same dimension with weight management ${WeightManagement.AllPositiveWeights} and one null real weight and one null imaginary weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(2, false)}]};
            const vec2: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 1}, {type: COMPLEXWEIGHT, real: new Weight(NULL_WEIGHT_TOLERANCE / 2, false), imaginary: new Weight(0, false)}]};
            const res = projectiveVectorSpace.subtractRaw(vec1, vec2);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(1);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(0, false));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(2, false));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can scale a ProjectiveComplexVector with a scalar with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5)}]};
            const scaleFactor = 2;
            const res = projectiveVectorSpace.scaleRaw(scaleFactor, vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(4);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(4));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(3));
        });

        it(`can scale a ProjectiveComplexVector with a scalar with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5)}]};
            const scaleFactor = 2;
            const res = projectiveVectorSpace.scaleRaw(scaleFactor, vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(4);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(4));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(3));
        });

        it(`can scale a ProjectiveComplexVector with a scalar with weight management ${WeightManagement.AllPositiveWeights} and a positive weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(1.5, false)}]};
            const scaleFactor = 2;
            const res = projectiveVectorSpace.scaleRaw(scaleFactor, vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(2);
            expect(res.coordinates[0].imaginary).to.eql(4);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(0, false));
            expect(res.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(res.coordinates[1].imaginary).to.eql(new Weight(3, false));
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can scale a ProjectiveComplexVector with a complex with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(1.5)}]};
            const scaleFactor: Complex = {type: COMPLEX, real: 2, imaginary: 1};
            const res = projectiveVectorSpace.scaleRaw(scaleFactor, vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(5);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(2.5));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(5));
        });

        it(`can scale a ProjectiveComplexVector with a complex with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(1.5, false), imaginary: new Weight(0, false)}]};
            const scaleFactor: Complex = {type: COMPLEX, real: 2, imaginary: 1};
            const res = projectiveVectorSpace.scaleRaw(scaleFactor, vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(5);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(3, true));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(1.5, true));
        });

        it(`can scale a ProjectiveComplexVector with a complex with weight management ${WeightManagement.AllPositiveWeights} producing some null real weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(3)}]};
            const scaleFactor: Complex = {type: COMPLEX, real: 2, imaginary: 1};
            const res = projectiveVectorSpace.scaleRaw(scaleFactor, vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(5);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(0, false));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(7.5, false));
        });

        it(`cannot scale a ProjectiveComplexVector with a complex with weight management ${WeightManagement.AllStrictlyPositiveWeights} producing some null imaginery weight when the scale factor is a null complex`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllStrictlyPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(1.5), imaginary: new Weight(3)}]};
            const scaleFactor: Complex = {type: COMPLEX, real: 0, imaginary: 0};
            expect(() => projectiveVectorSpace.scaleRaw(scaleFactor, vec1)).to.throw(EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
        });

        it(`can scale a ProjectiveComplexVector with a complex with weight management ${WeightManagement.AllPositiveWeights} producing some null weight based on ${NULL_WEIGHT_TOLERANCE}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(1.5 + NULL_WEIGHT_TOLERANCE / 3), imaginary: new Weight(3)}]};
            const scaleFactor: Complex = {type: COMPLEX, real: 2, imaginary: 1};
            const res = projectiveVectorSpace.scaleRaw(scaleFactor, vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(0);
            expect(res.coordinates[0].imaginary).to.eql(5);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(0, false));
            expect(res.coordinates[1].imaginary.weight).to.be.closeTo(7.5, TOLERANCE_FLOAT);
            expect(res.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`cannot scale a ProjectiveComplexVector with a complex with weight management ${WeightManagement.AllPositiveWeights} if the resulting weight is negative`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(1.5, false)}]};
            const scaleFactor: Complex = {type: COMPLEX, real: 2, imaginary: 1};
            expect(() => projectiveVectorSpace.scaleRaw(scaleFactor, vec1)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        });

        it(`cannot scale a ProjectiveComplexVector with a complex with weight management ${WeightManagement.AllStrictlyPositiveWeights} if the resulting weight is negative`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0.5), imaginary: new Weight(1.5)}]};
            const scaleFactor: Complex = {type: COMPLEX, real: 2, imaginary: 1};
            expect(() => projectiveVectorSpace.scaleRaw(scaleFactor, vec1)).to.throw(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
        });

        it(`cannot scale a ProjectiveComplexVector if its real and imaginary weights don't conform to the same positivity constraint`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false)}]};
            const scaleFactor = 2;
            expect(() => projectiveVectorSpace.scaleRaw(scaleFactor, vec1)).to.throw(EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });

        it(`cannot scale a ProjectiveComplexVector if its complex weight doesn't conform to the weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0, false)}]};
            const scaleFactor = 2;
            expect(() => projectiveVectorSpace.scaleRaw(scaleFactor, vec1)).to.throw(EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
        });

        it(`can clone a ProjectiveComplexVector with weight management ${WeightManagement.AllStrictlyPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            let vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)}]};
            const res = projectiveVectorSpace.cloneRaw(vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(1);
            expect(res.coordinates[0].imaginary).to.eql(2);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(2));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(3));
            vec1 = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 5, imaginary: 3}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(2)}]};
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(1);
            expect(res.coordinates[0].imaginary).to.eql(2);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(2));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(3));
        });

        it(`can clone a ProjectiveComplexVector with weight management ${WeightManagement.AllPositiveWeights}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            let vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3, false)}]};
            const res = projectiveVectorSpace.cloneRaw(vec1);
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(1);
            expect(res.coordinates[0].imaginary).to.eql(2);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(0, false));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(3, false));
            vec1 = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 5, imaginary: 3}, {type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(2)}]};
            expect(res.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(res.coordinates[0].type).to.eql(COMPLEX);
            expect(res.coordinates[0].real).to.eql(1);
            expect(res.coordinates[0].imaginary).to.eql(2);
            expect(res.coordinates[1].type).to.eql(COMPLEXWEIGHT);
            expect(res.coordinates[1].real).to.eql(new Weight(0, false));
            expect(res.coordinates[1].imaginary).to.eql(new Weight(3, false));
        });

        it(`cannot clone a ProjectiveComplexVector with different weight positivity conditions`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            let vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3)}]};
            expect(() => projectiveVectorSpace.cloneRaw(vec1)).to.throw(EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });

        it(`can generate the image of ${PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${COMPLEX}`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            const vec1 : ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3)}]};
            const result = projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1);
            expect(result.type).to.eql(COMPLEX);
            expect(result.real).to.eql(0.5);
            expect(result.imaginary).to.eql(2/3);
        });

        it(`cannot generate the image of ${PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${COMPLEX} with different weight positivity conditions`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            let vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3)}]};
            expect(() => projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1)).to.throw(EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
        });

        it(`can generate the image of ${PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${COMPLEX} when the real weight is null`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1 : ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3, false)}]};
            const result = projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1);
            expect(result.type).to.eql(COMPLEX);
            expect(result.real).to.eql(1);
            expect(result.imaginary).to.eql(2/3);
        });

        it(`can generate the image of ${PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${COMPLEX} when the imaginary weight is null`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, WeightManagement.AllPositiveWeights);
            const vec1 : ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(2, false), imaginary: new Weight(0, false)}]};
            const result = projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1);
            expect(result.type).to.eql(COMPLEX);
            expect(result.real).to.eql(0.5);
            expect(result.imaginary).to.eql(2);
        });

        it(`cannot generate the image of ${PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${COMPLEX} with weight management ${WeightManagement.AllStrictlyPositiveWeights} if positivity condition exists for real weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            let vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(3, false)}]};
            expect(() => projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1)).to.throw(EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
        });

        it(`cannot generate the image of ${PROJECTIVECOMPLEXVECTOR1D} vector into the Complex vector space ${COMPLEX} with weight management ${WeightManagement.AllStrictlyPositiveWeights} if positivity condition exists for imaginary weight`, () => {
            const projectiveVectorSpace = new ProjectiveComplexVectorSpace(MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE);
            let vec1: ProjectiveComplexVector1D = {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: 1, imaginary: 2}, {type: COMPLEXWEIGHT, real: new Weight(3, false), imaginary: new Weight(0, false)}]};
            expect(() => projectiveVectorSpace.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vec1)).to.throw(EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE);
        });

        // const PROJECTIVECOMPLEXVECTOR2D = 'ProjectiveComplexVector2D';
        // interface ProjectiveComplexVector2D {
        //     type: typeof PROJECTIVECOMPLEXVECTOR2D;
        //     coordinates: [Complex, Complex, ComplexWeight];
        // }

        // type ProjectiveComplexVector = ProjectiveComplexVector1D | ProjectiveComplexVector2D;

        // let ExtendedProjectiveComplexVectorSpace: {
        //     new (dim: number, weightManagement: WeightManagement): ProjectiveComplexVectorSpace & {
        //         areSameDimensionTest(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean;

        //     }
        // };

        // beforeEach(() => {
        //     ExtendedProjectiveComplexVectorSpace = class extends ProjectiveComplexVectorSpace {

        //         constructor(dim: number, weightManagement: WeightManagement) {
        //             super(dim, weightManagement);
        //         }

        //         areSameDimensionTest(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean {
        //             return this.areSameDimension(v1, v2);
        //         }
        //     }
        // });
    });
});