import { expect } from "chai";
import { copyDescriptorComplexVector1D, copyDescriptorRealVector1D, copyDescriptorComplexVector2D, cloneDescriptorProjectiveComplexVector1D, cloneDescriptorProjectiveRealVector2D, copyDescriptorRealVector3D, cloneDescriptorProjectiveRealVector3D, copyDescriptorRealVector4D, createComplexVector1DDescriptor, createRealVector1DDescriptor, createComplexVector2DDescriptor, createProjectiveComplexVector1DDescriptor, createRealVector2DDescriptor, createProjectiveRealVector2DDescriptor, createRealVector3DDescriptor, createProjectiveRealVector3DDescriptor, createRealVector4DDescriptor, copyDescriptorRealVector2D, createComplexWeightDescriptor } from "../../src/mathVector/VectorDescriptorFactory";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEREALVECTOR2D, PROJECTIVEREALVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { EM_WEIGHT_VALUE_POSITIVE } from "../../src/ErrorMessages/Weight";
import { Complex } from "../../src/mathVector/Complex";
import { ComplexWeight } from "../../src/mathVector/ComplexWeight";
import { Weight } from "../../src/mathVector/Weight";
import { COMPLEXWEIGHT, WEIGHT } from "../../src/namedConstants/WeightTypeTags";

describe('Vector descriptor factory for all vector spaces and all valid space dimensions', () => {
    describe('Real vector descriptors', () => {
        it(`can generate the descriptor of a real vector with a user prescribed value into a 1D vector space`, () => {
            const value = 2;
            const descriptor = createRealVector1DDescriptor(value);
            expect(descriptor).to.eql(value);
        });

        it(`can generate the descriptor of a real vector with a default value into a 1D vector space`, () => {
            const descriptor = createRealVector1DDescriptor();
            expect(descriptor).to.eql(0);
        });

        it(`can copy the descriptor of a real vector with a user prescribed value into a 1D vector space`, () => {
            const value = 2;
            let descriptor = copyDescriptorRealVector1D(value);
            expect(descriptor).to.eql(value);
            descriptor = 0;
            expect(descriptor).to.not.eql(value);
        });

        it(`can generate the descriptor of a real vector with a user prescribed value into a 2D vector space`, () => {
            const coordinates = [-1, 3];
            const dimension = 2;
            const descriptor = createRealVector2DDescriptor(coordinates[0], coordinates[1]);
            expect(descriptor.type).to.eql(REALVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a default value into a 2D vector space`, () => {
            const descriptor = createRealVector2DDescriptor();
            expect(descriptor.type).to.eql(REALVECTOR2D);
            descriptor.coordinates.forEach( element => {
                expect(element).to.eql(0);
            });
        });

        it(`can copy the descriptor of a real vector with a user prescribed value into a 2D vector space`, () => {
            const coordinates = [-1, 3];
            const dimension = 2;
            const descriptor = createRealVector2DDescriptor(coordinates[0], coordinates[1]);
            let descriptor1 = copyDescriptorRealVector2D(descriptor);
            expect(descriptor1.type).to.eql(REALVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            descriptor1 = createRealVector2DDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a user prescribed value into a 3D vector space`, () => {
            const coordinates = [-1, 3, 2];
            const dimension = 3;
            const descriptor = createRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            expect(descriptor.type).to.eql(REALVECTOR3D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a default value into a 3D vector space`, () => {
            const descriptor = createRealVector3DDescriptor();
            expect(descriptor.type).to.eql(REALVECTOR3D);
            descriptor.coordinates.forEach( element => {
                expect(element).to.eql(0);
            });
        });

        it(`can copy the descriptor of a real vector with a user prescribed value into a 3D vector space`, () => {
            const coordinates = [-1, 3, 4];
            const dimension = 3;
            const descriptor = createRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            let descriptor1 = copyDescriptorRealVector3D(descriptor);
            expect(descriptor1.type).to.eql(REALVECTOR3D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            descriptor1 = createRealVector3DDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a user prescribed value into a 4D vector space`, () => {
            const coordinates = [-1, 3, 2, -4];
            const dimension = 4;
            const descriptor = createRealVector4DDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(REALVECTOR4D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a default value into a 4D vector space`, () => {
            const descriptor = createRealVector4DDescriptor();
            expect(descriptor.type).to.eql(REALVECTOR4D);
            descriptor.coordinates.forEach( element => {
                expect(element).to.eql(0);
            });
        });

        it(`can copy the descriptor of a real vector with a user prescribed value into a 4D vector space`, () => {
            const coordinates = [-1, 3, 4, -2];
            const dimension = 4;
            const descriptor = createRealVector4DDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            let descriptor1 = copyDescriptorRealVector4D(descriptor);
            expect(descriptor1.type).to.eql(REALVECTOR4D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            descriptor1 = createRealVector4DDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
        });
    });

    describe('Projective Real vector descriptors', () => {

        it(`can generate the descriptor of a projective real vector with user prescribed value and weight into a 3D vector space`, () => {
            const coordinates = [-1, 3, 2];
            const dimension = 3;
            const descriptor = createProjectiveRealVector2DDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            expect(descriptor.type).to.eql(PROJECTIVEREALVECTOR2D);   
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(coordinates[2]);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed value and null weight into a 3D vector space`, () => {
            const coordinates = [-1, 3, 0];
            const dimension = 3;
            const descriptor = createProjectiveRealVector2DDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            expect(descriptor.type).to.eql(PROJECTIVEREALVECTOR2D);   
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(coordinates[2]);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(false);
        });

        it(`can generate the descriptor of a projective real vector with a default value into a 3D vector space`, () => {
            const descriptor = createProjectiveRealVector2DDescriptor();
            const dimension = 3;
            expect(descriptor.type).to.eql(PROJECTIVEREALVECTOR2D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(0);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed coordinates and default weight into a 3D vector space`, () => {
            const coordinates = [-1, 3];
            const descriptor = createProjectiveRealVector2DDescriptor(coordinates[0], coordinates[1]);
            const dimension = 3;
            expect(descriptor.type).to.eql(PROJECTIVEREALVECTOR2D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(true);
        });

        it(`can copy the descriptor of a projective real vector into a 3D vector space`, () => {
            const coordinates = [-1, 3, 4];
            const dimension = 3;
            const descriptor = createProjectiveRealVector2DDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            let descriptor1 = cloneDescriptorProjectiveRealVector2D(descriptor);
            expect(descriptor1.type).to.eql(PROJECTIVEREALVECTOR2D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(coordinates[2]);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(true);
            descriptor1 = createProjectiveRealVector2DDescriptor();
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
            expect(descriptor1.coordinates[2].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor1.coordinates[2].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed value and weight into a 4D vector space`, () => {
            const coordinates = [-1, 3, 2, 4];
            const dimension = 4;
            const descriptor = createProjectiveRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(PROJECTIVEREALVECTOR3D);   
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(coordinates[3]);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed value and null weight into a 4D vector space`, () => {
            const coordinates = [-1, 3, 4, 0];
            const dimension = 4;
            const descriptor = createProjectiveRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(PROJECTIVEREALVECTOR3D);   
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(coordinates[3]);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(false);
        });

        it(`can generate the descriptor of a projective real vector with a default value into a 4D vector space`, () => {
            const descriptor = createProjectiveRealVector3DDescriptor();
            const dimension = 4;
            expect(descriptor.type).to.eql(PROJECTIVEREALVECTOR3D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(0);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed coordinates and default weight into a 4D vector space`, () => {
            const coordinates = [-1, 3, 5];
            const descriptor = createProjectiveRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            const dimension = 4;
            expect(descriptor.type).to.eql(PROJECTIVEREALVECTOR3D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(true);
        });

        it(`can copy the descriptor of a projective real vector into a 4D vector space`, () => {
            const coordinates = [-1, 3, 4, 2];
            const dimension = 4;
            const descriptor = createProjectiveRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            let descriptor1 = cloneDescriptorProjectiveRealVector3D(descriptor);
            expect(descriptor1.type).to.eql(PROJECTIVEREALVECTOR3D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(coordinates[3]);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(true);
            descriptor1 = createProjectiveRealVector3DDescriptor();
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
            expect(descriptor1.coordinates[3].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor1.coordinates[3].weight.strictlyPositive).to.eql(true);
        });

        it(`cannot generate the descriptor of a 3D projective real vector with a negative weight value`, () => {
            const coordinates = [-1, 3, -4];
            expect(() => createProjectiveRealVector2DDescriptor(coordinates[0], coordinates[1], coordinates[2])).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });

        it(`cannot generate the descriptor of a 4D projective real vector with a negative weight value`, () => {
            const coordinates = [-1, 3, 4, -1];
            expect(() => createProjectiveRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3])).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });
    });

    describe('Complex vector descriptors', () => {

        it(`can generate the descriptor of a complex vector with a user prescribed value into a 1D complex vector space`, () => {
            const coordinates = [-1, 3];
            const dimension = 1;
            const descriptor = createComplexVector1DDescriptor(coordinates[0], coordinates[1]);
            expect(descriptor.type).to.eql(COMPLEX);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.real).to.eql(coordinates[i]);
                expect(descriptor.imaginary).to.eql(coordinates[i + 1]);
            }
        });

        it(`can generate the descriptor of a complex vector with a default value into a 1D complex vector space`, () => {
            const dimension = 1;
            const descriptor = createComplexVector1DDescriptor();
            expect(descriptor.type).to.eql(COMPLEX);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.real).to.eql(0);
                expect(descriptor.imaginary).to.eql(0);
            }
        });

        it(`can copy the descriptor of a complex vector with a user prescribed value into a 1D complex vector space`, () => {
            const coordinates = [-1, 3];
            const dimension = 1;
            const descriptor = createComplexVector1DDescriptor(coordinates[0], coordinates[1]);
            let descriptor1 = copyDescriptorComplexVector1D(descriptor);
            expect(descriptor1.type).to.eql(COMPLEX);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.real).to.eql(descriptor1.real);
                expect(descriptor.imaginary).to.eql(descriptor1.imaginary);
            }
            descriptor1 = createComplexVector1DDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.real).to.not.eql(descriptor1.real);
                expect(descriptor.imaginary).to.not.eql(descriptor1.imaginary);
            }
        });

        it(`can generate the descriptor of a complex vector with a user prescribed value into a 2D complex vector space`, () => {
            const coordinates = [-1, 3, 0, -2];
            const dimension = 2;
            const descriptor = createComplexVector2DDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(COMPLEXVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i].real).to.eql(coordinates[i * dimension]);
                expect(descriptor.coordinates[i].imaginary).to.eql(coordinates[i * dimension + 1]);
            }
        });

        it(`can generate the descriptor of a complex vector with a default value into a 2D complex vector space`, () => {
            const dimension = 2;
            const descriptor = createComplexVector2DDescriptor();
            expect(descriptor.type).to.eql(COMPLEXVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i].real).to.eql(0);
                expect(descriptor.coordinates[i].imaginary).to.eql(0);
            }
        });

        it(`can copy the descriptor of a complex vector with a user prescribed value into a 2D complex vector space`, () => {
            const coordinates = [-1, 3, 4, -2];
            const dimension = 2;
            const descriptor = createComplexVector2DDescriptor(coordinates[0], coordinates[1],coordinates[2], coordinates[3]);
            let descriptor1 = copyDescriptorComplexVector2D(descriptor);
            expect(descriptor1.type).to.eql(COMPLEXVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i].real).to.eql(descriptor1.coordinates[i].real);
                expect(descriptor.coordinates[i].imaginary).to.eql(descriptor1.coordinates[i].imaginary);
            }
            descriptor1 = createComplexVector2DDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i].real).to.not.eql(descriptor1.coordinates[i].real);
                expect(descriptor.coordinates[i].imaginary).to.not.eql(descriptor1.coordinates[i].imaginary);
            }
        });

    });

    describe('Projective Complex vector descriptors', () => {
    
        it(`can generate the descriptor of a projective complex vector with user prescribed coordinates and weight into a 2D complex vector space`, () => {
            const cCoordinates = new Complex(-1, 3);
            const cWeight = new ComplexWeight(new Weight(2), new Weight(4));
            const descriptor = createProjectiveComplexVector1DDescriptor(cCoordinates, cWeight);
            expect(descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(descriptor.coordinates[0].real).to.eql(cCoordinates.real);
            expect(descriptor.coordinates[0].imaginary).to.eql(cCoordinates.imaginary);
            expect(descriptor.coordinates[1].real.value).to.eql(cWeight.real.value);
            expect(descriptor.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(descriptor.coordinates[1].imaginary.value).to.eql(cWeight.imaginary.value);
            expect(descriptor.coordinates[1].imaginary.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective complex vector with user prescribed coordinates and null real weight into a 2D complex vector space`, () => {
            const cCoordinates = new Complex(-1, 3);
            const cWeight = new ComplexWeight(new Weight(0, false), new Weight(4));
            const descriptor = createProjectiveComplexVector1DDescriptor(cCoordinates, cWeight);
            expect(descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(descriptor.coordinates[0].real).to.eql(cCoordinates.real);
            expect(descriptor.coordinates[0].imaginary).to.eql(cCoordinates.imaginary);
            expect(descriptor.coordinates[1].real.value).to.eql(cWeight.real.value);
            expect(descriptor.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(descriptor.coordinates[1].imaginary.value).to.eql(cWeight.imaginary.value);
            expect(descriptor.coordinates[1].imaginary.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective complex vector with user prescribed coordinates and default weights into a 2D complex vector space`, () => {
            const coordinates = createComplexVector1DDescriptor(-1, 3);
            const descriptor = createProjectiveComplexVector1DDescriptor(coordinates);
            expect(descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);   
            expect(descriptor.coordinates[0].real).to.eql(coordinates.real);
            expect(descriptor.coordinates[0].imaginary).to.eql(coordinates.imaginary);
            expect(descriptor.coordinates[1].real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(descriptor.coordinates[1].imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(descriptor.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can generate the descriptor of a projective complex vector with default values into a 2D complex vector space`, () => {
            const descriptor = createProjectiveComplexVector1DDescriptor();
            expect(descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(descriptor.coordinates[0].real).to.eql(0);
            expect(descriptor.coordinates[0].imaginary).to.eql(0);
            expect(descriptor.coordinates[1].real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(descriptor.coordinates[1].imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(descriptor.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can copy the descriptor of a projective complex vector into a 2D complex vector space`, () => {
            const coordinates = createComplexVector1DDescriptor(-1, 3);
            const complexWeight = createComplexWeightDescriptor(new Weight(4), new Weight(2));
            const descriptor = createProjectiveComplexVector1DDescriptor(coordinates, complexWeight);
            let descriptor1 = cloneDescriptorProjectiveComplexVector1D(descriptor);
            expect(descriptor1.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            for(let i = 0; i < 2; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            descriptor1 = createProjectiveComplexVector1DDescriptor();
            for(let i = 0; i < 2; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
        });

        it(`cannot generate the descriptor of a 2D projective complex vector with a negative real weight value`, () => {
            const coordinates = createComplexVector1DDescriptor(-1, 3);
            const complexWeight = {
                type: COMPLEXWEIGHT,
                real: { type: WEIGHT, weight: { value: -4, strictlyPositive: true } },
                imaginary: { type: WEIGHT, weight: { value: 2, strictlyPositive: true } }
            } as any;
            expect(() => createProjectiveComplexVector1DDescriptor(coordinates, complexWeight)).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });

        it(`cannot generate the descriptor of a 2D projective complex vector with a negative imaginary weight value`, () => {
            const coordinates = createComplexVector1DDescriptor(-1, 3);
            const complexWeight = {
                type: COMPLEXWEIGHT,
                real: { type: WEIGHT, weight: { value: 4, strictlyPositive: true } },
                imaginary: { type: WEIGHT, weight: { value: -2, strictlyPositive: true } }
            } as any;
            expect(() => createProjectiveComplexVector1DDescriptor(coordinates, complexWeight)).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });
    });
});