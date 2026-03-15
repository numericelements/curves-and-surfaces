import { expect } from "chai";
import { createComplexVector1DFromDescriptor, createComplexVector2DFromDescriptor, createComplexVectorFromDescriptor, createProjectiveComplexVector1DFromDescriptor, createProjectiveComplexVectorFromDescriptor, createProjectiveVector2DFromDescriptor, createProjectiveVector3DFromDescriptor, createProjectiveVectorFromDescriptor, createRealVector1DFromDescriptor, createRealVector2DFromDescriptor, createRealVector3DFromDescriptor, createRealVector4DFromDescriptor, createRealVectorFromDescriptor } from "../../src/mathVector/VectorFromDescriptorFactory";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";
import { EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT, EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE, EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT } from "../../src/ErrorMessages/VectorFromDescriptorFactory";
import { ComplexVectorSpace } from "../../src/mathVector/ComplexVectorSpace";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { ComplexVector1D, ComplexVector2D, ProjectiveComplexVector1D, ProjectiveVector2D, ProjectiveVector3D, RealVector2D, RealVector3D, RealVector4D } from "../../src/mathVector/VectorSpaceConstructorInterface";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { Complex } from "../../src/mathVector/Complex";
import { Weight } from "../../src/mathVector/Weight";
import { COMPLEXWEIGHT, WEIGHT } from "../../src/namedConstants/WeightTypeTags";
import { ProjectiveVectorSpace } from "../../src/mathVector/ProjectiveVectorSpace";
import { ProjectiveComplexVectorSpace } from "../../src/mathVector/ProjectiveComplexVectorSpace";

describe('Creation of vectors immersed into vector spaces from their vector descriptor', () => {
    describe('Real vectors', () => {
        it(`can generate a real 1D vector from its descriptor into a default real vector space`, () => {
            const descriptor = 2;
            const vector = createRealVector1DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(1);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor);
        });

        it(`can generate a real 1D vector from its descriptor into a custom real vector space`, () => {
            const descriptor = 2;
            const vectorSpace = new RealVectorSpace(1);
            const vector = createRealVector1DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(1);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor);
        });

        it(`cannot generate a real 1D vector from its descriptor into a vector space distinct from RealVectorSpace of dimension 1`, () => {
            const descriptor = 2;
            const vectorSpace = new RealVectorSpace(2);
            expect(() => createRealVector1DFromDescriptor(descriptor, vectorSpace as unknown as RealVectorSpace<1>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
            const vectorSpace1 = new ComplexVectorSpace(1);
            expect(() => createRealVector1DFromDescriptor(descriptor, vectorSpace1 as unknown as RealVectorSpace<1>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a real 2D vector from its descriptor into a default real vector space`, () => {
            const descriptor: RealVector2D = { type: REALVECTOR2D, coordinates: [2, 3] };
            const vector = createRealVector2DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
        });

        it(`can generate a real 2D vector from its descriptor into a custom real vector space`, () => {
            const descriptor: RealVector2D = { type: REALVECTOR2D, coordinates: [2, 3] };
            const vectorSpace = new RealVectorSpace(2);
            const vector = createRealVector2DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
        });

        it(`cannot generate a real 2D vector from its descriptor into a vector space distinct from RealVectorSpace of dimension 2`, () => {
            const descriptor: RealVector2D = { type: REALVECTOR2D, coordinates: [2, 3] };
            const vectorSpace = new RealVectorSpace(3);
            expect(() => createRealVector2DFromDescriptor(descriptor, vectorSpace as unknown as RealVectorSpace<2>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
            const vectorSpace1 = new ComplexVectorSpace(2);
            expect(() => createRealVector2DFromDescriptor(descriptor, vectorSpace1 as unknown as RealVectorSpace<2>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a real 3D vector from its descriptor into a default real vector space`, () => {
            const descriptor: RealVector3D = { type: REALVECTOR3D, coordinates: [2, 3, 4] };
            const vector = createRealVector3DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(3);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
        });

        it(`can generate a real 3D vector from its descriptor into a custom real vector space`, () => {
            const descriptor: RealVector3D = { type: REALVECTOR3D, coordinates: [2, 3, 4] };
            const vectorSpace = new RealVectorSpace(3);
            const vector = createRealVector3DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(3);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
        });

        it(`cannot generate a real 3D vector from its descriptor into a vector space distinct from RealVectorSpace of dimension 3`, () => {
            const descriptor: RealVector3D = { type: REALVECTOR3D, coordinates: [2, 3, 4] };
            const vectorSpace = new RealVectorSpace(4);
            expect(() => createRealVector3DFromDescriptor(descriptor, vectorSpace as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
            const vectorSpace1 = new ComplexVectorSpace(1);
            expect(() => createRealVector3DFromDescriptor(descriptor, vectorSpace1 as unknown as RealVectorSpace<3>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a real 4D vector from its descriptor into a default real vector space`, () => {
            const descriptor: RealVector4D = { type: REALVECTOR4D, coordinates: [2, 3, 4, 5] };
            const vector = createRealVector4DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(4);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
            expect(vector.t).to.eql(descriptor.coordinates[3]);
        });

        it(`can generate a real 4D vector from its descriptor into a custom real vector space`, () => {
            const descriptor: RealVector4D = { type: REALVECTOR4D, coordinates: [2, 3, 4, 5] };
            const vectorSpace = new RealVectorSpace(4);
            const vector = createRealVector4DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(4);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
            expect(vector.t).to.eql(descriptor.coordinates[3]);
        });

        it(`cannot generate a real 4D vector from its descriptor into a vector space distinct from RealVectorSpace of dimension 4`, () => {
            const descriptor: RealVector4D = { type: REALVECTOR4D, coordinates: [2, 3, 4, 5] };
            const vectorSpace = new RealVectorSpace(3);
            expect(() => createRealVector4DFromDescriptor(descriptor, vectorSpace as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
            const vectorSpace1 = new ComplexVectorSpace(1);
            expect(() => createRealVector4DFromDescriptor(descriptor, vectorSpace1 as unknown as RealVectorSpace<4>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a real 1D vector from its descriptor into a default real vector space using the dispatcher`, () => {
            const descriptor = 2;
            const vector = createRealVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(1);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor);
        });

        it(`can generate a real 1D vector from its descriptor into a custom real vector space using the dispatcher`, () => {
            const descriptor = 2;
            const vectorSpace = new RealVectorSpace(1);
            const vector = createRealVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(1);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor);
        });

        it(`can generate a real 2D vector from its descriptor into a default real vector space using the dispatcher`, () => {
            const descriptor: RealVector2D = { type: REALVECTOR2D, coordinates: [2, 3] };
            const vector = createRealVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
        });

        it(`can generate a real 2D vector from its descriptor into a custom real vector space using the dispatcher`, () => {
            const descriptor: RealVector2D = { type: REALVECTOR2D, coordinates: [2, 3] };
            const vectorSpace = new RealVectorSpace(2);
            const vector = createRealVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
        });

        it(`can generate a real 3D vector from its descriptor into a default real vector space using the dispatcher`, () => {
            const descriptor: RealVector3D = { type: REALVECTOR3D, coordinates: [2, 3, 4] };
            const vector = createRealVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(3);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
        });

        it(`can generate a real 3D vector from its descriptor into a custom real vector space using the dispatcher`, () => {
            const descriptor: RealVector3D = { type: REALVECTOR3D, coordinates: [2, 3, 4] };
            const vectorSpace = new RealVectorSpace(3);
            const vector = createRealVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(3);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
        });

        it(`can generate a real 4D vector from its descriptor into a default real vector space using the dispatcher`, () => {
            const descriptor: RealVector4D = { type: REALVECTOR4D, coordinates: [2, 3, 4, 5] };
            const vector = createRealVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(4);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
            expect(vector.t).to.eql(descriptor.coordinates[3]);
        });

        it(`can generate a real 4D vector from its descriptor into a custom real vector space using the dispatcher`, () => {
            const descriptor: RealVector4D = { type: REALVECTOR4D, coordinates: [2, 3, 4, 5] };
            const vectorSpace = new RealVectorSpace(4);
            const vector = createRealVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(4);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.REAL);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
            expect(vector.t).to.eql(descriptor.coordinates[3]);
        });

        it(`cannot generate a real vector from its descriptor into a real vector space with an inconsistent descriptor using the dispatcher`, () => {
            const descriptor = { type: 'RealVector5D', coordinates: [2, 3] } as unknown as RealVector2D;
            const vectorSpace = new RealVectorSpace(2);
            expect(() => createRealVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
        });

        it(`cannot generate a real vector from its descriptor into a real vector space with an inconsistent descriptor using the dispatcher`, () => {
            const descriptor = { category: 'RealVector5D', coordinates: [2, 3] } as unknown as RealVector2D;
            const vectorSpace = new RealVectorSpace(2);
            expect(() => createRealVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        });
    });

    describe('Complex vectors', () => {
        it(`can generate a complex 1D vector from its descriptor into a default complex vector space`, () => {
            const descriptor: ComplexVector1D = { type: COMPLEX, real: 2, imaginary: 5 };
            const vector = createComplexVector1DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(1);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(vector.getReal(0)).to.eql(descriptor.real);
            expect(vector.getImaginary(0)).to.eql(descriptor.imaginary);
        });

        it(`can generate a complex 1D vector from its descriptor into a custom complex vector space`, () => {
            const descriptor: ComplexVector1D = { type: COMPLEX, real: 2, imaginary: 5 };
            const vectorSpace = new ComplexVectorSpace(1);
            const vector = createComplexVector1DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(1);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(vector.getReal(0)).to.eql(descriptor.real);
            expect(vector.getImaginary(0)).to.eql(descriptor.imaginary);
        });

        it(`cannot generate a complex 1D vector from its descriptor into a vector space distinct from ComplexVectorSpace of dimension 1`, () => {
            const descriptor: ComplexVector1D = { type: COMPLEX, real: 2, imaginary: 5 };
            const vectorSpace = new ComplexVectorSpace(2);
            expect(() => createComplexVector1DFromDescriptor(descriptor, vectorSpace as unknown as ComplexVectorSpace<1>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
            const vectorSpace1 = new RealVectorSpace(1);
            expect(() => createComplexVector1DFromDescriptor(descriptor, vectorSpace1 as unknown as ComplexVectorSpace<1>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a complex 2D vector from its descriptor into a default complex vector space`, () => {
            const descriptor: ComplexVector2D = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: 2, imaginary: 5}, { type: COMPLEX, real: 3, imaginary: 0}] };
            const vector = createComplexVector2DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(vector.getReal(0)).to.eql(descriptor.coordinates[0].real);
            expect(vector.getImaginary(0)).to.eql(descriptor.coordinates[0].imaginary);
            expect(vector.getReal(1)).to.eql(descriptor.coordinates[1].real);
            expect(vector.getImaginary(1)).to.eql(descriptor.coordinates[1].imaginary);
        });

        it(`can generate a complex 2D vector from its descriptor into a custom complex vector space`, () => {
            const descriptor: ComplexVector2D = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: 2, imaginary: 5}, { type: COMPLEX, real: 3, imaginary: 0}] };
            const vectorSpace = new ComplexVectorSpace(2);
            const vector = createComplexVector2DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(vector.getReal(0)).to.eql(descriptor.coordinates[0].real);
            expect(vector.getImaginary(0)).to.eql(descriptor.coordinates[0].imaginary);
            expect(vector.getReal(1)).to.eql(descriptor.coordinates[1].real);
            expect(vector.getImaginary(1)).to.eql(descriptor.coordinates[1].imaginary);
        });

        it(`cannot generate a complex 2D vector from its descriptor into a vector space distinct from ComplexVectorSpace of dimension 2`, () => {
            const descriptor: ComplexVector2D = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: 2, imaginary: 5}, { type: COMPLEX, real: 3, imaginary: 0}] };
            const vectorSpace = new ComplexVectorSpace(1);
            expect(() => createComplexVector2DFromDescriptor(descriptor, vectorSpace as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
            const vectorSpace1 = new RealVectorSpace(2);
            expect(() => createComplexVector2DFromDescriptor(descriptor, vectorSpace1 as unknown as ComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a complex 1D vector from its descriptor into a default complex vector space using the dispatcher`, () => {
            const descriptor: ComplexVector1D = { type: COMPLEX, real: 2, imaginary: 5 };
            const vector = createComplexVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(1);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(vector.getReal(0)).to.eql(descriptor.real);
            expect(vector.getImaginary(0)).to.eql(descriptor.imaginary);
        });

        it(`can generate a complex 1D vector from its descriptor into a custom complex vector space using the dispatcher`, () => {
            const descriptor: ComplexVector1D = { type: COMPLEX, real: 2, imaginary: 5 };
            const vectorSpace = new ComplexVectorSpace(1);
            const vector = createComplexVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(1);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(vector.getReal(0)).to.eql(descriptor.real);
            expect(vector.getImaginary(0)).to.eql(descriptor.imaginary);
        });

        it(`can generate a complex 2D vector from its descriptor into a default complex vector space using the dispatcher`, () => {
            const descriptor: ComplexVector2D = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: 2, imaginary: 5}, { type: COMPLEX, real: 3, imaginary: 0}] };
            const vector = createComplexVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(vector.getReal(0)).to.eql(descriptor.coordinates[0].real);
            expect(vector.getImaginary(0)).to.eql(descriptor.coordinates[0].imaginary);
            expect(vector.getReal(1)).to.eql(descriptor.coordinates[1].real);
            expect(vector.getImaginary(1)).to.eql(descriptor.coordinates[1].imaginary);
        });

        it(`can generate a complex 2D vector from its descriptor into a custom complex vector space using the dispatcher`, () => {
            const descriptor: ComplexVector2D = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: 2, imaginary: 5}, { type: COMPLEX, real: 3, imaginary: 0}] };
            const vectorSpace = new ComplexVectorSpace(2);
            const vector = createComplexVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.COMPLEX);
            expect(vector.getReal(0)).to.eql(descriptor.coordinates[0].real);
            expect(vector.getImaginary(0)).to.eql(descriptor.coordinates[0].imaginary);
            expect(vector.getReal(1)).to.eql(descriptor.coordinates[1].real);
            expect(vector.getImaginary(1)).to.eql(descriptor.coordinates[1].imaginary);
        });

        it(`cannot generate a complex vector from its descriptor into a complex vector space with an inconsistent descriptor using the dispatcher`, () => {
            const descriptor = { type: 'ComplexVector5D', real: 2, imaginary: 3 } as unknown as ComplexVector1D;
            const vectorSpace = new ComplexVectorSpace(1);
            expect(() => createComplexVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
        });

        it(`cannot generate a complex vector from its descriptor into a complex vector space with an inconsistent descriptor using the dispatcher`, () => {
            const descriptor = { category: 'ComplexVector5D', real: 2, imaginary: 3 } as unknown as ComplexVector1D;
            const vectorSpace = new ComplexVectorSpace(1);
            expect(() => createComplexVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        });
    });

    describe('Projective real vectors', () => {

        it(`can generate a projective real 2D vector from its descriptor into a default projective real vector space`, () => {
            const descriptor: ProjectiveVector2D = { type: PROJECTIVEVECTOR2D, coordinates: [2, 3, { type: WEIGHT, weight: new Weight(2) }] };
            const vector = createProjectiveVector2DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(3);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.weight.value).to.eql(descriptor.coordinates[2].weight.value);
        });

        it(`can generate a projective real 2D vector from its descriptor into a custom projective real vector space`, () => {
            const descriptor: ProjectiveVector2D = { type: PROJECTIVEVECTOR2D, coordinates: [2, 3, { type: WEIGHT, weight: new Weight(2) }] };
            const vectorSpace = new ProjectiveVectorSpace(3);
            const vector = createProjectiveVector2DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(3);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.weight.value).to.eql(descriptor.coordinates[2].weight.value);
        });

        it(`cannot generate a projective real 2D vector from its descriptor into a projective vector space distinct from ProjectiveVectorSpace of dimension 3`, () => {
            const descriptor: ProjectiveVector2D = { type: PROJECTIVEVECTOR2D, coordinates: [2, 3, { type: WEIGHT, weight: new Weight(3) }] };
            const vectorSpace = new ProjectiveVectorSpace(4);
            expect(() => createProjectiveVector2DFromDescriptor(descriptor, vectorSpace as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
            const vectorSpace1 = new RealVectorSpace(3);
            expect(() => createProjectiveVector2DFromDescriptor(descriptor, vectorSpace1 as unknown as ProjectiveVectorSpace<3>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a projective real 3D vector from its descriptor into a default projective real vector space`, () => {
            const descriptor: ProjectiveVector3D = { type: PROJECTIVEVECTOR3D, coordinates: [2, 3, -1, { type: WEIGHT, weight: new Weight(2) }] };
            const vector = createProjectiveVector3DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(4);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
            expect(vector.weight.value).to.eql(descriptor.coordinates[3].weight.value);
        });

        it(`can generate a projective real 3D vector from its descriptor into a custom projective real vector space`, () => {
            const descriptor: ProjectiveVector3D = { type: PROJECTIVEVECTOR3D, coordinates: [2, 3, -1, { type: WEIGHT, weight: new Weight(2) }] };
            const vectorSpace = new ProjectiveVectorSpace(4);
            const vector = createProjectiveVector3DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(4);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
            expect(vector.weight.value).to.eql(descriptor.coordinates[3].weight.value);
        });

        it(`cannot generate a projective real 3D vector from its descriptor into a projective vector space distinct from ProjectiveVectorSpace of dimension 4`, () => {
            const descriptor: ProjectiveVector3D = { type: PROJECTIVEVECTOR3D, coordinates: [2, 3, -1, { type: WEIGHT, weight: new Weight(2) }] };
            const vectorSpace = new ProjectiveVectorSpace(3);
            expect(() => createProjectiveVector3DFromDescriptor(descriptor, vectorSpace as unknown as ProjectiveVectorSpace<4>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
            const vectorSpace1 = new RealVectorSpace(4);
            expect(() => createProjectiveVector3DFromDescriptor(descriptor, vectorSpace1 as unknown as ProjectiveVectorSpace<4>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a projective real 2D vector from its descriptor into a default projective real vector space using the dispatcher`, () => {
            const descriptor: ProjectiveVector2D = { type: PROJECTIVEVECTOR2D, coordinates: [2, 3, { type: WEIGHT, weight: new Weight(2) }] };
            const vector = createProjectiveVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(3);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.weight.value).to.eql(descriptor.coordinates[2].weight.value);
        });

        it(`can generate a projective real 2D vector from its descriptor into a custom projective real vector space using the dispatcher`, () => {
            const descriptor: ProjectiveVector2D = { type: PROJECTIVEVECTOR2D, coordinates: [2, 3, { type: WEIGHT, weight: new Weight(2) }] };
            const vectorSpace = new ProjectiveVectorSpace(3);
            const vector = createProjectiveVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(3);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.weight.value).to.eql(descriptor.coordinates[2].weight.value);
        });

        it(`can generate a projective real 3D vector from its descriptor into a default projective real vector space using the dispatcher`, () => {
            const descriptor: ProjectiveVector3D = { type: PROJECTIVEVECTOR3D, coordinates: [2, 3, -1, { type: WEIGHT, weight: new Weight(2) }] };
            const vector = createProjectiveVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(4);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
            expect(vector.weight.value).to.eql(descriptor.coordinates[3].weight.value);
        });

        it(`can generate a projective real 3D vector from its descriptor into a custom projective real vector space using the dispatcher`, () => {
            const descriptor: ProjectiveVector3D = { type: PROJECTIVEVECTOR3D, coordinates: [2, 3, -1, { type: WEIGHT, weight: new Weight(2) }] };
            const vectorSpace = new ProjectiveVectorSpace(4);
            const vector = createProjectiveVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(4);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVE);
            expect(vector.x).to.eql(descriptor.coordinates[0]);
            expect(vector.y).to.eql(descriptor.coordinates[1]);
            expect(vector.z).to.eql(descriptor.coordinates[2]);
            expect(vector.weight.value).to.eql(descriptor.coordinates[3].weight.value);
        });

         it(`cannot generate a projective real vector from its descriptor into a projective vector space with an inconsistent descriptor using the dispatcher`, () => {
            const descriptor = { type: 'ProjectiveVector5D', coordinates: [2, 3, -1, { type: WEIGHT, weight: new Weight(2) }] } as unknown as ProjectiveVector3D;
            const vectorSpace = new ProjectiveVectorSpace(4);
            expect(() => createProjectiveVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
        });

        it(`cannot generate a projective real vector from its descriptor into a projective vector space with an inconsistent descriptor using the dispatcher`, () => {
            const descriptor = { category: 'ProjectiveVector5D', coordinates: [2, 3, -1, { type: WEIGHT, weight: new Weight(2) }] } as unknown as ProjectiveVector3D;
            const vectorSpace = new ProjectiveVectorSpace(4);
            expect(() => createProjectiveVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        });
    });

    describe('Projective complex vectors', () => {

        it(`can generate a projective complex 2D vector from its descriptor into a default projective complex vector space`, () => {
            const descriptor: ProjectiveComplexVector1D = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: COMPLEX, real:2, imaginary: 3 }, { type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false) }] };
            const vector = createProjectiveComplexVector1DFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(vector.coordinates[0].real).to.eql(descriptor.coordinates[0].real);
            expect(vector.coordinates[0].imaginary).to.eql(descriptor.coordinates[0].imaginary);
            expect(vector.weight.real.value).to.eql(descriptor.coordinates[1].real.value);
            expect(vector.weight.imaginary.value).to.eql(descriptor.coordinates[1].imaginary.value);
            expect(vector.weight.real.strictlyPositive).to.eql(true);
            expect(vector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can generate a projective complex 2D vector from its descriptor into a custom projective complex vector space`, () => {
            const descriptor: ProjectiveComplexVector1D = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: COMPLEX, real:2, imaginary: 3 }, { type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false) }] };
            const vectorSpace = new ProjectiveComplexVectorSpace(2);
            const vector = createProjectiveComplexVector1DFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(vector.coordinates[0].real).to.eql(descriptor.coordinates[0].real);
            expect(vector.coordinates[0].imaginary).to.eql(descriptor.coordinates[0].imaginary);
            expect(vector.weight.real.value).to.eql(descriptor.coordinates[1].real.value);
            expect(vector.weight.imaginary.value).to.eql(descriptor.coordinates[1].imaginary.value);
            expect(vector.weight.real.strictlyPositive).to.eql(true);
            expect(vector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`cannot generate a projective complex 2D vector from its descriptor into a projective complex vector space distinct from ProjectiveComplexVectorSpace of dimension 2`, () => {
            const descriptor: ProjectiveComplexVector1D = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: COMPLEX, real:-1, imaginary: 0 }, { type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3) }] };
            const vectorSpace1 = new RealVectorSpace(2);
            expect(() => createProjectiveComplexVector1DFromDescriptor(descriptor, vectorSpace1 as unknown as ProjectiveComplexVectorSpace<2>)).to.throw(EM_VECTORSPACE_TYPE_OR_DIMENSION_INCONSISTENT);
        });

        it(`can generate a projective complex 2D vector from its descriptor into a default projective complex vector space using the dispatcher`, () => {
            const descriptor: ProjectiveComplexVector1D = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: COMPLEX, real:2, imaginary: 3 }, { type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false) }] };
            const vector = createProjectiveComplexVectorFromDescriptor(descriptor);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(true);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(vector.coordinates[0].real).to.eql(descriptor.coordinates[0].real);
            expect(vector.coordinates[0].imaginary).to.eql(descriptor.coordinates[0].imaginary);
            expect(vector.weight.real.value).to.eql(descriptor.coordinates[1].real.value);
            expect(vector.weight.imaginary.value).to.eql(descriptor.coordinates[1].imaginary.value);
            expect(vector.weight.real.strictlyPositive).to.eql(true);
            expect(vector.weight.imaginary.strictlyPositive).to.eql(false);
        });

        it(`can generate a projective complex 2D vector from its descriptor into a custom projective complex vector space`, () => {
            const descriptor: ProjectiveComplexVector1D = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{ type: COMPLEX, real:2, imaginary: 3 }, { type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(0, false) }] };
            const vectorSpace = new ProjectiveComplexVectorSpace(2);
            const vector = createProjectiveComplexVectorFromDescriptor(descriptor, vectorSpace);
            expect(vector.dimension).to.eql(2);
            expect(vector.vectorSpace.isDefault).to.eql(false);
            expect(vector.vectorSpace.spaceType).to.eql(VectorSpaceType.PROJECTIVECOMPLEX);
            expect(vector.coordinates[0].real).to.eql(descriptor.coordinates[0].real);
            expect(vector.coordinates[0].imaginary).to.eql(descriptor.coordinates[0].imaginary);
            expect(vector.weight.real.value).to.eql(descriptor.coordinates[1].real.value);
            expect(vector.weight.imaginary.value).to.eql(descriptor.coordinates[1].imaginary.value);
            expect(vector.weight.real.strictlyPositive).to.eql(true);
            expect(vector.weight.imaginary.strictlyPositive).to.eql(false);
        });

         it(`cannot generate a projective complex vector from its descriptor into a projective complex vector space with an inconsistent descriptor using the dispatcher`, () => {
            const descriptor = { type: 'ProjectiveVector5D', coordinates: [{ type: COMPLEX, real:0, imaginary: -3 }, { type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3) }] } as unknown as ProjectiveComplexVector1D;
            const vectorSpace = new ProjectiveComplexVectorSpace(2);
            expect(() => createProjectiveComplexVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_INCOMPATIBLE_WITH_VECTORSPACE);
        });

        it(`cannot generate a projective complex vector from its descriptor into a projective complex vector space with an inconsistent descriptor using the dispatcher`, () => {
            const descriptor = { category: 'ProjectiveVector5D', coordinates: [{ type: COMPLEX, real:0, imaginary: -3 }, { type: COMPLEXWEIGHT, real: new Weight(2), imaginary: new Weight(3) }] } as unknown as ProjectiveComplexVector1D;
            const vectorSpace = new ProjectiveComplexVectorSpace(2);
            expect(() => createProjectiveComplexVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        });

        it(`cannot generate a projective complex vector from its descriptor into a projective complex vector space with a descriptor that is not an object using the dispatcher`, () => {
            const descriptor = 2 as unknown as ProjectiveComplexVector1D;
            const vectorSpace = new ProjectiveComplexVectorSpace(2);
            expect(() => createProjectiveComplexVectorFromDescriptor(descriptor, vectorSpace)).to.throw(EM_VECTOR_DESCRIPTOR_CONTENT_INCONSISTENT);
        });
    });
});