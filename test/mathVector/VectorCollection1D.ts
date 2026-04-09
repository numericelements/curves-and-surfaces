import { expect } from "chai";
import { VectorCollection1D } from "../../src/mathVector/VectorCollection1D";
import { Vector2DReal } from "../../src/mathVector/Vector2DReal";
import { ComplexVector, ProjectiveComplexVector, ProjectiveRealVector, RealVector } from "../../src/mathVector/interfaces/VectorInterfaces";
import { Vector3DReal } from "../../src/mathVector/Vector3DReal";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { Vector4DReal } from "../../src/mathVector/Vector4DReal";
import { COMPLEXVECTOR1D, COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEREALVECTOR2D, PROJECTIVEREALVECTOR3D, REALVECTOR1D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { Vector1DReal } from "../../src/mathVector/Vector1DReal";
import { ProjectiveVector2DReal } from "../../src/mathVector/ProjectiveVector2DReal";
import { Weight } from "../../src/mathVector/Weight";
import { ProjectiveVector3DReal } from "../../src/mathVector/ProjectiveVector3DReal";
import { Vector1DComplex } from "../../src/mathVector/Vector1DComplex";
import { Vector2DComplex } from "../../src/mathVector/Vector2DComplex";
import { ProjectiveVector1DComplex } from "../../src/mathVector/ProjectiveVector1DComplex";
import { EM_VECTOR_SPACE_DIMENSION_DIFFER, EM_VECTOR_SPACE_IDENTIFIER_DIFFER, EM_VECTOR_SPACE_TYPE_DIFFER } from "../../src/ErrorMessages/VectorCollection1D";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";

describe('Collections of vectors of same type and dimension organized as 1D with an iterator', () => {
    describe('Constructor', () => {
        
        it(`can generate a vector collection with only one vector`, () => {
            const realV2D = new Vector2DReal(1, 2);
            const collection = new VectorCollection1D(realV2D);
            expect(collection.length).to.eql(1);
            expect(collection.vectorSpace).to.eql(realV2D.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV2D.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${REALVECTOR1D}`, () => {
            const realV1D1 = new Vector1DReal(1);
            const realV1D2 = new Vector1DReal(-1);
            const realV1D = [realV1D1, realV1D2]
            const collection = new VectorCollection1D(realV1D);
            expect(collection.length).to.eql(realV1D.length);
            expect(collection.vectorSpace).to.eql(realV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV1D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection using genrics parameters with only one vector`, () => {
            const realV2D = new Vector2DReal(1, 2);
            const collection = new VectorCollection1D<RealVector<2>>(realV2D);
            expect(collection.length).to.eql(1);
            expect(collection.vectorSpace).to.eql(realV2D.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV2D.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${REALVECTOR2D}`, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const realV2D2 = new Vector2DReal(-1, 0);
            const realV2D = [realV2D1, realV2D2];
            const collection = new VectorCollection1D(realV2D);
            expect(collection.length).to.eql(realV2D.length);
            expect(collection.vectorSpace).to.eql(realV2D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV2D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${REALVECTOR3D}`, () => {
            const realV3D1 = new Vector3DReal(1, 2, 3);
            const realV3D2 = new Vector3DReal(-1, 0, -4);
            const realV3D = [realV3D1, realV3D2]
            const collection = new VectorCollection1D(realV3D);
            expect(collection.length).to.eql(realV3D.length);
            expect(collection.vectorSpace).to.eql(realV3D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV3D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${REALVECTOR4D}`, () => {
            const realV4D1 = new Vector4DReal(1, 2, 3, 4);
            const realV4D2 = new Vector4DReal(-1, 0, -4, 1);
            const realV4D = [realV4D1, realV4D2]
            const collection = new VectorCollection1D(realV4D);
            expect(collection.length).to.eql(realV4D.length);
            expect(collection.vectorSpace).to.eql(realV4D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV4D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${PROJECTIVEREALVECTOR2D}`, () => {
            const projectiveV3D1 = new ProjectiveVector2DReal(1, 2, new Weight(3));
            const projectiveV3D2 = new ProjectiveVector2DReal(-1, 0, new Weight(4));
            const projectiveV3D = [projectiveV3D1, projectiveV3D2]
            const collection = new VectorCollection1D(projectiveV3D);
            expect(collection.length).to.eql(projectiveV3D.length);
            expect(collection.vectorSpace).to.eql(projectiveV3D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(projectiveV3D1.dimension);
            expect(collection.weightManagement).to.eql(projectiveV3D1.vectorSpace.weightManagement);
        });

        it(`can generate a vector collection using genrics parameters with an array of vectors belonging to the same vector space with vectors ${PROJECTIVEREALVECTOR2D}`, () => {
            const projectiveV3D1 = new ProjectiveVector2DReal(1, 2, new Weight(3));
            const projectiveV3D2 = new ProjectiveVector2DReal(-1, 0, new Weight(4));
            const projectiveV3D = [projectiveV3D1, projectiveV3D2]
            const collection = new VectorCollection1D<ProjectiveRealVector<3>>(projectiveV3D);
            expect(collection.length).to.eql(projectiveV3D.length);
            expect(collection.vectorSpace).to.eql(projectiveV3D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(projectiveV3D1.dimension);
            expect(collection.weightManagement).to.eql(projectiveV3D1.vectorSpace.weightManagement);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${PROJECTIVEREALVECTOR3D}`, () => {
            const projectiveV4D1 = new ProjectiveVector3DReal(1, 2, 4, new Weight(3));
            const projectiveV4D2 = new ProjectiveVector3DReal(-1, 0, -2, new Weight(4));
            const projectiveV4D = [projectiveV4D1, projectiveV4D2]
            const collection = new VectorCollection1D(projectiveV4D);
            expect(collection.length).to.eql(projectiveV4D.length);
            expect(collection.vectorSpace).to.eql(projectiveV4D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(projectiveV4D1.dimension);
            expect(collection.weightManagement).to.eql(projectiveV4D1.vectorSpace.weightManagement);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${COMPLEXVECTOR1D}`, () => {
            const complexV1D1 = new Vector1DComplex(1, 2);
            const complexV1D2 = new Vector1DComplex(-1, 0);
            const complexV1D = [complexV1D1, complexV1D2]
            const collection = new VectorCollection1D(complexV1D);
            expect(collection.length).to.eql(complexV1D.length);
            expect(collection.vectorSpace).to.eql(complexV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(complexV1D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection using generics parameters with an array of vectors belonging to the same vector space with vectors ${COMPLEXVECTOR1D}`, () => {
            const complexV1D1 = new Vector1DComplex(1, 2);
            const complexV1D2 = new Vector1DComplex(-1, 0);
            const complexV1D = [complexV1D1, complexV1D2]
            const collection = new VectorCollection1D<ComplexVector<1>>(complexV1D);
            expect(collection.length).to.eql(complexV1D.length);
            expect(collection.vectorSpace).to.eql(complexV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(complexV1D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${COMPLEXVECTOR2D}`, () => {
            const complexV2D1 = new Vector2DComplex(1, 2, 0, 3);
            const complexV2D2 = new Vector2DComplex(-1, 0, 1, 5);
            const complexV2D = [complexV2D1, complexV2D2]
            const collection = new VectorCollection1D(complexV2D);
            expect(collection.length).to.eql(complexV2D.length);
            expect(collection.vectorSpace).to.eql(complexV2D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(complexV2D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
        });

        it(`can generate a vector collection with an array of vectors belonging to the same vector space with vectors ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
            const projectiveComplexV1D1 = new ProjectiveVector1DComplex(1, 2, new Weight(1), new Weight(3));
            const projectiveComplexV1D2 = new ProjectiveVector1DComplex(-1, 0, new Weight(2), new Weight(5));
            const projectiveComplexV1D = [projectiveComplexV1D1, projectiveComplexV1D2]
            const collection = new VectorCollection1D(projectiveComplexV1D);
            expect(collection.length).to.eql(projectiveComplexV1D.length);
            expect(collection.vectorSpace).to.eql(projectiveComplexV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(projectiveComplexV1D1.dimension);
            expect(collection.weightManagement).to.eql(projectiveComplexV1D1.vectorSpace.weightManagement);
        });

        it(`can generate a vector collection using generics parameters with an array of vectors belonging to the same vector space with vectors ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
            const projectiveComplexV1D1 = new ProjectiveVector1DComplex(1, 2, new Weight(1), new Weight(3));
            const projectiveComplexV1D2 = new ProjectiveVector1DComplex(-1, 0, new Weight(2), new Weight(5));
            const projectiveComplexV1D = [projectiveComplexV1D1, projectiveComplexV1D2]
            const collection = new VectorCollection1D<ProjectiveComplexVector<2>>(projectiveComplexV1D);
            expect(collection.length).to.eql(projectiveComplexV1D.length);
            expect(collection.vectorSpace).to.eql(projectiveComplexV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(projectiveComplexV1D1.dimension);
            expect(collection.weightManagement).to.eql(projectiveComplexV1D1.vectorSpace.weightManagement);
        });

        it(`cannot generate a vector collection with an array of vectors conataining vectors belonging to different types of vector spaces `, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const complexV1D2 = new Vector1DComplex(-1, 0);
            const realV2D = [realV2D1, complexV1D2];
            expect(() => new VectorCollection1D(realV2D)).to.throw(EM_VECTOR_SPACE_TYPE_DIFFER);
        });

        it(`cannot generate a vector collection with an array of vectors conataining vectors belonging to different types of vector spaces `, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const projectiveV4D2 = new ProjectiveVector3DReal(-1, 0, -2, new Weight(4));
            const realV2D = [realV2D1, projectiveV4D2];
            expect(() => new VectorCollection1D(realV2D)).to.throw(EM_VECTOR_SPACE_TYPE_DIFFER);
        });

        it(`cannot generate a vector collection with an array of vectors conataining vectors having different dimensions `, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const realV3D2 = new Vector3DReal(-1, 0, -4);
            const realV2D = [realV2D1, realV3D2];
            expect(() => new VectorCollection1D(realV2D)).to.throw(EM_VECTOR_SPACE_DIMENSION_DIFFER);
        });

        it(`cannot generate a vector collection with an array of vectors belonging to different vector spaces `, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const vSpace = new RealVectorSpace(2);
            const realV2D2 = new Vector2DReal(-1, 0, vSpace);
            const realV2D = [realV2D1, realV2D2]
            expect(() => new VectorCollection1D(realV2D)).to.throw(EM_VECTOR_SPACE_IDENTIFIER_DIFFER);
        });
    });

    describe('Accessors', () => {

        it(`can get the length of a vector collection with an arbitrary number of vectors`, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const realV2D2 = new Vector2DReal(-1, 0);
            const realV2D = [realV2D1, realV2D2]
            const collection = new VectorCollection1D(realV2D);
            expect(collection.length).to.eql(realV2D.length);
        });

        it(`can get the common vector space of a vector collection with a non null length`, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const realV2D2 = new Vector2DReal(-1, 0);
            const realV2D = [realV2D1, realV2D2];
            const collection = new VectorCollection1D(realV2D);
            expect(collection.length).to.be.greaterThan(0);
            expect(collection.vectorSpace).to.eql(realV2D1.vectorSpace);
        });

        it(`can get the common vector dimension of a vector collection with a non null length`, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const realV2D2 = new Vector2DReal(-1, 0);
            const realV2D = [realV2D1, realV2D2];
            const collection = new VectorCollection1D(realV2D);
            expect(collection.length).to.be.greaterThan(0);
            expect(collection.spaceDimension).to.eql(realV2D1.vectorSpace.dimension());
        });

        it(`can get the weight management type of a vector collection with a non null length and a vector space type supporting the weight management concept`, () => {
            const projectiveV3D1 = new ProjectiveVector2DReal(1, 2, new Weight(3));
            const projectiveV3D2 = new ProjectiveVector2DReal(-1, 0, new Weight(4));
            const projectiveV3D = [projectiveV3D1, projectiveV3D2]
            const collection = new VectorCollection1D(projectiveV3D);
            expect(collection.length).to.be.greaterThan(0);
            expect(collection.vectorSpace).to.eql(projectiveV3D1.vectorSpace);
            expect(collection.weightManagement).to.eql(projectiveV3D1.vectorSpace.weightManagement);
        });

        it(`can get the vectors of the collection as a not empty array of vectors when the collection length is greater than zero`, () => {
            const projectiveComplexV1D1 = new ProjectiveVector1DComplex(1, 2, new Weight(1), new Weight(3));
            const projectiveComplexV1D2 = new ProjectiveVector1DComplex(-1, 0, new Weight(2), new Weight(5));
            const projectiveComplexV1D = [projectiveComplexV1D1, projectiveComplexV1D2]
            const collection = new VectorCollection1D(projectiveComplexV1D);
            expect(collection.length).to.be.greaterThan(0);
            expect(collection.vectorCollection).to.eql(projectiveComplexV1D);
        });

    });

    describe('Methods', () => {
        it(`can push a vector into a collection of real vectors of type ${REALVECTOR1D}`, () => {
            const realV1D1 = new Vector1DReal(1);
            const realV1D2 = new Vector1DReal(-1);
            const realV1D = [realV1D1, realV1D2]
            const collection = new VectorCollection1D(realV1D);
            expect(collection.length).to.eql(realV1D.length);
            expect(collection.vectorSpace).to.eql(realV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV1D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
            const realV1D3 = new Vector1DReal(0);
            const newCollection = collection.withPushed(realV1D3);
            expect(newCollection.length).to.eql(realV1D.length + 1);
            realV1D.push(realV1D3);
            expect(newCollection.vectorCollection).to.eql(realV1D);
        });

        it(`can push a vector into a collection of real vectors of type ${REALVECTOR2D}`, () => {
            const realV2D1 = new Vector2DReal(1, 2);
            const realV2D2 = new Vector2DReal(-1, 0);
            const realV2D = [realV2D1, realV2D2];
            const collection = new VectorCollection1D(realV2D);
            expect(collection.length).to.eql(realV2D.length);
            expect(collection.vectorSpace).to.eql(realV2D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV2D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
            const realV2D3 = new Vector2DReal();
            const newCollection = collection.withPushed(realV2D3);
            expect(newCollection.length).to.eql(realV2D.length + 1);
            realV2D.push(realV2D3);
            expect(newCollection.vectorCollection).to.eql(realV2D);
        });

        it(`can push a vector inot a collection of real vectors of type ${REALVECTOR3D}`, () => {
            const realV3D1 = new Vector3DReal(1, 2, 3);
            const realV3D2 = new Vector3DReal(-1, 0, -4);
            const realV3D = [realV3D1, realV3D2]
            const collection = new VectorCollection1D(realV3D);
            expect(collection.length).to.eql(realV3D.length);
            expect(collection.vectorSpace).to.eql(realV3D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV3D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
            const realV3D3 = new Vector3DReal(5, 4, 1);
            const newCollection = collection.withPushed(realV3D3);
            expect(newCollection.length).to.eql(realV3D.length + 1);
            realV3D.push(realV3D3);
            expect(newCollection.vectorCollection).to.eql(realV3D);
        });

        it(`can push a vector into a collection of real vectors of type ${REALVECTOR4D}`, () => {
            const realV4D1 = new Vector4DReal(1, 2, 3, 4);
            const realV4D2 = new Vector4DReal(-1, 0, -4, 1);
            const realV4D = [realV4D1, realV4D2]
            const collection = new VectorCollection1D(realV4D);
            expect(collection.length).to.eql(realV4D.length);
            expect(collection.vectorSpace).to.eql(realV4D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV4D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
            const realV4D3 = new Vector4DReal(5, 4, 1, -2);
            const newCollection = collection.withPushed(realV4D3);
            expect(newCollection.length).to.eql(realV4D.length + 1);
            realV4D.push(realV4D3);
            expect(newCollection.vectorCollection).to.eql(realV4D);
        });

        it(`can push a vector into a collection of projective vectors of type ${PROJECTIVEREALVECTOR2D}`, () => {
            const projectiveV3D1 = new ProjectiveVector2DReal(1, 2, new Weight(3));
            const projectiveV3D2 = new ProjectiveVector2DReal(-1, 0, new Weight(4));
            const projectiveV3D = [projectiveV3D1, projectiveV3D2]
            const collection = new VectorCollection1D(projectiveV3D);
            expect(collection.length).to.eql(projectiveV3D.length);
            expect(collection.vectorSpace).to.eql(projectiveV3D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(projectiveV3D1.dimension);
            expect(collection.weightManagement).to.eql(projectiveV3D1.vectorSpace.weightManagement);
            const projectiveV3D3 = new ProjectiveVector2DReal(5, 4, new Weight());
            const newCollection = collection.withPushed(projectiveV3D3);
            expect(newCollection.length).to.eql(projectiveV3D.length + 1);
            projectiveV3D.push(projectiveV3D3);
            expect(newCollection.vectorCollection).to.eql(projectiveV3D);
        });

        it(`can push a vector inito a collection of projective vectors of type ${PROJECTIVEREALVECTOR3D}`, () => {
            const projectiveV4D1 = new ProjectiveVector3DReal(1, 2, 4, new Weight(3));
            const projectiveV4D2 = new ProjectiveVector3DReal(-1, 0, -2, new Weight(4));
            const projectiveV4D = [projectiveV4D1, projectiveV4D2]
            const collection = new VectorCollection1D(projectiveV4D);
            expect(collection.length).to.eql(projectiveV4D.length);
            expect(collection.vectorSpace).to.eql(projectiveV4D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(projectiveV4D1.dimension);
            expect(collection.weightManagement).to.eql(projectiveV4D1.vectorSpace.weightManagement);
            const projectiveV4D3 = new ProjectiveVector3DReal(5, 4, 0, new Weight());
            const newCollection = collection.withPushed(projectiveV4D3);
            expect(newCollection.length).to.eql(projectiveV4D.length + 1);
            projectiveV4D.push(projectiveV4D3);
            expect(newCollection.vectorCollection).to.eql(projectiveV4D);
        });

        it(`can push a vector into a collection of complex vectors of type ${COMPLEXVECTOR1D}`, () => {
            const complexV1D1 = new Vector1DComplex(1, 2);
            const complexV1D2 = new Vector1DComplex(-1, 0);
            const complexV1D = [complexV1D1, complexV1D2]
            const collection = new VectorCollection1D(complexV1D);
            expect(collection.length).to.eql(complexV1D.length);
            expect(collection.vectorSpace).to.eql(complexV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(complexV1D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
            const complexV1D3 = new Vector1DComplex(5, 4);
            const newCollection = collection.withPushed(complexV1D3);
            expect(newCollection.length).to.eql(complexV1D.length + 1);
            complexV1D.push(complexV1D3);
            expect(newCollection.vectorCollection).to.eql(complexV1D);
        });

        it(`can push a vector into a collection of complex vectors of type ${COMPLEXVECTOR2D}`, () => {
            const complexV2D1 = new Vector2DComplex(1, 2, 0, 3);
            const complexV2D2 = new Vector2DComplex(-1, 0, 1, 5);
            const complexV2D = [complexV2D1, complexV2D2]
            const collection = new VectorCollection1D(complexV2D);
            expect(collection.length).to.eql(complexV2D.length);
            expect(collection.vectorSpace).to.eql(complexV2D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(complexV2D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
            const complexV2D3 = new Vector2DComplex();
            const newCollection = collection.withPushed(complexV2D3);
            expect(newCollection.length).to.eql(complexV2D.length + 1);
            complexV2D.push(complexV2D3);
            expect(newCollection.vectorCollection).to.eql(complexV2D);
        });

        it(`can push a vector into a collection of complex vectors of type ${PROJECTIVECOMPLEXVECTOR1D}`, () => {
            const projectiveComplexV1D1 = new ProjectiveVector1DComplex(1, 2, new Weight(1), new Weight(3));
            const projectiveComplexV1D2 = new ProjectiveVector1DComplex(-1, 0, new Weight(2), new Weight(5));
            const projectiveComplexV1D = [projectiveComplexV1D1, projectiveComplexV1D2]
            const collection = new VectorCollection1D(projectiveComplexV1D);
            expect(collection.length).to.eql(projectiveComplexV1D.length);
            expect(collection.vectorSpace).to.eql(projectiveComplexV1D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(projectiveComplexV1D1.dimension);
            expect(collection.weightManagement).to.eql(projectiveComplexV1D1.vectorSpace.weightManagement);
            const projectiveComplexV1D3 = new ProjectiveVector1DComplex();
            const newCollection = collection.withPushed(projectiveComplexV1D3);
            expect(newCollection.length).to.eql(projectiveComplexV1D.length + 1);
            projectiveComplexV1D.push(projectiveComplexV1D3);
            expect(newCollection.vectorCollection).to.eql(projectiveComplexV1D);
        });

        it(`cannot push a vector into a collection of real vectors of type ${REALVECTOR3D} when its vector space differs from the reference vector space of the collection`, () => {
            const realV3D1 = new Vector3DReal(1, 2, 3);
            const realV3D2 = new Vector3DReal(-1, 0, -4);
            const realV3D = [realV3D1, realV3D2]
            const collection = new VectorCollection1D(realV3D);
            expect(collection.length).to.eql(realV3D.length);
            expect(collection.vectorSpace).to.eql(realV3D1.vectorSpace);
            expect(collection.spaceDimension).to.eql(realV3D1.dimension);
            expect(collection.weightManagement).to.eql(undefined);
            const vSpace = new RealVectorSpace(3);
            const realV3D3 = new Vector3DReal(5, 4, 1, vSpace);
            expect(() => collection.withPushed(realV3D3)).to.throw(EM_VECTOR_SPACE_IDENTIFIER_DIFFER);
        });

    });
});