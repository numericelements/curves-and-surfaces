import { expect } from "chai";
import { copyDescriptorVector1DComplex, copyDescriptorVector1DReal, copyDescriptorVector2DComplex, copyDescriptorVector2DProjectiveComplex, copyDescriptorVector2DReal, copyDescriptorVector3DProjectiveReal, copyDescriptorVector3DReal, copyDescriptorVector4DProjectiveReal, copyDescriptorVector4DReal, createVector1DComplexDescriptor, createVector1DRealDescriptor, createVector2DComplexDescriptor, createVector2DProjectiveComplexDescriptor, createVector2DRealDescriptor, createVector3DProjectiveRealDescriptor, createVector3DRealDescriptor, createVector4DProjectiveRealDescriptor, createVector4DRealDescriptor } from "../../src/mathVector/VectorDescriptorFactory";
import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../../src/namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../../src/namedConstants/Weight";
import { COMPLEX } from "../../src/namedConstants/ComplexTypeTag";
import { EM_WEIGHT_VALUE_POSITIVE } from "../../src/ErrorMessages/Weight";

describe('Vector descriptor factory for all vector spaces and all valid space dimensions', () => {
    describe('Real vector descriptors', () => {
        it(`can generate the descriptor of a real vector with a user prescribed value into a 1D vector space`, () => {
            const value = 2;
            const descriptor = createVector1DRealDescriptor(value);
            expect(descriptor).to.eql(value);
        });

        it(`can generate the descriptor of a real vector with a default value into a 1D vector space`, () => {
            const descriptor = createVector1DRealDescriptor();
            expect(descriptor).to.eql(0);
        });

        it(`can copy the descriptor of a real vector with a user prescribed value into a 1D vector space`, () => {
            const value = 2;
            let descriptor = copyDescriptorVector1DReal(value);
            expect(descriptor).to.eql(value);
            descriptor = 0;
            expect(descriptor).to.not.eql(value);
        });

        it(`can generate the descriptor of a real vector with a user prescribed value into a 2D vector space`, () => {
            const coordinates = [-1, 3];
            const dimension = 2;
            const descriptor = createVector2DRealDescriptor(coordinates[0], coordinates[1]);
            expect(descriptor.type).to.eql(REALVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a default value into a 2D vector space`, () => {
            const descriptor = createVector2DRealDescriptor();
            expect(descriptor.type).to.eql(REALVECTOR2D);
            descriptor.coordinates.forEach( element => {
                expect(element).to.eql(0);
            });
        });

        it(`can copy the descriptor of a real vector with a user prescribed value into a 2D vector space`, () => {
            const coordinates = [-1, 3];
            const dimension = 2;
            const descriptor = createVector2DRealDescriptor(coordinates[0], coordinates[1]);
            let descriptor1 = copyDescriptorVector2DReal(descriptor);
            expect(descriptor1.type).to.eql(REALVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            descriptor1 = createVector2DRealDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a user prescribed value into a 3D vector space`, () => {
            const coordinates = [-1, 3, 2];
            const dimension = 3;
            const descriptor = createVector3DRealDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            expect(descriptor.type).to.eql(REALVECTOR3D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a default value into a 3D vector space`, () => {
            const descriptor = createVector3DRealDescriptor();
            expect(descriptor.type).to.eql(REALVECTOR3D);
            descriptor.coordinates.forEach( element => {
                expect(element).to.eql(0);
            });
        });

        it(`can copy the descriptor of a real vector with a user prescribed value into a 3D vector space`, () => {
            const coordinates = [-1, 3, 4];
            const dimension = 3;
            const descriptor = createVector3DRealDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            let descriptor1 = copyDescriptorVector3DReal(descriptor);
            expect(descriptor1.type).to.eql(REALVECTOR3D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            descriptor1 = createVector3DRealDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a user prescribed value into a 4D vector space`, () => {
            const coordinates = [-1, 3, 2, -4];
            const dimension = 4;
            const descriptor = createVector4DRealDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(REALVECTOR4D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
        });

        it(`can generate the descriptor of a real vector with a default value into a 4D vector space`, () => {
            const descriptor = createVector4DRealDescriptor();
            expect(descriptor.type).to.eql(REALVECTOR4D);
            descriptor.coordinates.forEach( element => {
                expect(element).to.eql(0);
            });
        });

        it(`can copy the descriptor of a real vector with a user prescribed value into a 4D vector space`, () => {
            const coordinates = [-1, 3, 4, -2];
            const dimension = 4;
            const descriptor = createVector4DRealDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            let descriptor1 = copyDescriptorVector4DReal(descriptor);
            expect(descriptor1.type).to.eql(REALVECTOR4D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            descriptor1 = createVector4DRealDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
        });
    });

    describe('Projective Real vector descriptors', () => {

        it(`can generate the descriptor of a projective real vector with user prescribed value and weight into a 3D vector space`, () => {
            const coordinates = [-1, 3, 2];
            const dimension = 3;
            const descriptor = createVector3DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            expect(descriptor.type).to.eql(PROJECTIVEVECTOR2D);   
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(coordinates[2]);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed value and null weight into a 3D vector space`, () => {
            const coordinates = [-1, 3, 0];
            const dimension = 3;
            const descriptor = createVector3DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            expect(descriptor.type).to.eql(PROJECTIVEVECTOR2D);   
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(coordinates[2]);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(false);
        });

        it(`can generate the descriptor of a projective real vector with a default value into a 3D vector space`, () => {
            const descriptor = createVector3DProjectiveRealDescriptor();
            const dimension = 3;
            expect(descriptor.type).to.eql(PROJECTIVEVECTOR2D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(0);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed coordinates and default weight into a 3D vector space`, () => {
            const coordinates = [-1, 3];
            const descriptor = createVector3DProjectiveRealDescriptor(coordinates[0], coordinates[1]);
            const dimension = 3;
            expect(descriptor.type).to.eql(PROJECTIVEVECTOR2D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(true);
        });

        it(`can copy the descriptor of a projective real vector into a 3D vector space`, () => {
            const coordinates = [-1, 3, 4];
            const dimension = 3;
            const descriptor = createVector3DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            let descriptor1 = copyDescriptorVector3DProjectiveReal(descriptor);
            expect(descriptor1.type).to.eql(PROJECTIVEVECTOR2D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            expect(descriptor.coordinates[2].weight.value).to.eql(coordinates[2]);
            expect(descriptor.coordinates[2].weight.strictlyPositive).to.eql(true);
            descriptor1 = createVector3DProjectiveRealDescriptor();
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
            expect(descriptor1.coordinates[2].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor1.coordinates[2].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed value and weight into a 4D vector space`, () => {
            const coordinates = [-1, 3, 2, 4];
            const dimension = 4;
            const descriptor = createVector4DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(PROJECTIVEVECTOR3D);   
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(coordinates[3]);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed value and null weight into a 4D vector space`, () => {
            const coordinates = [-1, 3, 4, 0];
            const dimension = 4;
            const descriptor = createVector4DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(PROJECTIVEVECTOR3D);   
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(coordinates[3]);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(false);
        });

        it(`can generate the descriptor of a projective real vector with a default value into a 4D vector space`, () => {
            const descriptor = createVector4DProjectiveRealDescriptor();
            const dimension = 4;
            expect(descriptor.type).to.eql(PROJECTIVEVECTOR3D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(0);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective real vector with user prescribed coordinates and default weight into a 4D vector space`, () => {
            const coordinates = [-1, 3, 5];
            const descriptor = createVector4DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2]);
            const dimension = 4;
            expect(descriptor.type).to.eql(PROJECTIVEVECTOR3D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(coordinates[i]);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(true);
        });

        it(`can copy the descriptor of a projective real vector into a 4D vector space`, () => {
            const coordinates = [-1, 3, 4, 2];
            const dimension = 4;
            const descriptor = createVector4DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            let descriptor1 = copyDescriptorVector4DProjectiveReal(descriptor);
            expect(descriptor1.type).to.eql(PROJECTIVEVECTOR3D);
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            expect(descriptor.coordinates[3].weight.value).to.eql(coordinates[3]);
            expect(descriptor.coordinates[3].weight.strictlyPositive).to.eql(true);
            descriptor1 = createVector4DProjectiveRealDescriptor();
            for(let i = 0; i < dimension - 1; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
            expect(descriptor1.coordinates[3].weight.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor1.coordinates[3].weight.strictlyPositive).to.eql(true);
        });

        it(`cannot generate the descriptor of a 3D projective real vector with a negative weight value`, () => {
            const coordinates = [-1, 3, -4];
            expect(() => createVector3DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2])).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });

        it(`cannot generate the descriptor of a 4D projective real vector with a negative weight value`, () => {
            const coordinates = [-1, 3, 4, -1];
            expect(() => createVector4DProjectiveRealDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3])).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });
    });

    describe('Complex vector descriptors', () => {

        it(`can generate the descriptor of a complex vector with a user prescribed value into a 1D complex vector space`, () => {
            const coordinates = [-1, 3];
            const dimension = 1;
            const descriptor = createVector1DComplexDescriptor(coordinates[0], coordinates[1]);
            expect(descriptor.type).to.eql(COMPLEX);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.real).to.eql(coordinates[i]);
                expect(descriptor.imaginary).to.eql(coordinates[i + 1]);
            }
        });

        it(`can generate the descriptor of a complex vector with a default value into a 1D complex vector space`, () => {
            const dimension = 1;
            const descriptor = createVector1DComplexDescriptor();
            expect(descriptor.type).to.eql(COMPLEX);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.real).to.eql(0);
                expect(descriptor.imaginary).to.eql(0);
            }
        });

        it(`can copy the descriptor of a complex vector with a user prescribed value into a 1D complex vector space`, () => {
            const coordinates = [-1, 3];
            const dimension = 1;
            const descriptor = createVector1DComplexDescriptor(coordinates[0], coordinates[1]);
            let descriptor1 = copyDescriptorVector1DComplex(descriptor);
            expect(descriptor1.type).to.eql(COMPLEX);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.real).to.eql(descriptor1.real);
                expect(descriptor.imaginary).to.eql(descriptor1.imaginary);
            }
            descriptor1 = createVector1DComplexDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.real).to.not.eql(descriptor1.real);
                expect(descriptor.imaginary).to.not.eql(descriptor1.imaginary);
            }
        });

        it(`can generate the descriptor of a complex vector with a user prescribed value into a 2D complex vector space`, () => {
            const coordinates = [-1, 3, 0, -2];
            const dimension = 2;
            const descriptor = createVector2DComplexDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(COMPLEXVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i].real).to.eql(coordinates[i * dimension]);
                expect(descriptor.coordinates[i].imaginary).to.eql(coordinates[i * dimension + 1]);
            }
        });

        it(`can generate the descriptor of a complex vector with a default value into a 2D complex vector space`, () => {
            const dimension = 2;
            const descriptor = createVector2DComplexDescriptor();
            expect(descriptor.type).to.eql(COMPLEXVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i].real).to.eql(0);
                expect(descriptor.coordinates[i].imaginary).to.eql(0);
            }
        });

        it(`can copy the descriptor of a complex vector with a user prescribed value into a 2D complex vector space`, () => {
            const coordinates = [-1, 3, 4, -2];
            const dimension = 2;
            const descriptor = createVector2DComplexDescriptor(coordinates[0], coordinates[1],coordinates[2], coordinates[3]);
            let descriptor1 = copyDescriptorVector2DComplex(descriptor);
            expect(descriptor1.type).to.eql(COMPLEXVECTOR2D);
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i].real).to.eql(descriptor1.coordinates[i].real);
                expect(descriptor.coordinates[i].imaginary).to.eql(descriptor1.coordinates[i].imaginary);
            }
            descriptor1 = createVector2DComplexDescriptor();
            for(let i = 0; i < dimension; i++) {
                expect(descriptor.coordinates[i].real).to.not.eql(descriptor1.coordinates[i].real);
                expect(descriptor.coordinates[i].imaginary).to.not.eql(descriptor1.coordinates[i].imaginary);
            }
        });

    });

    describe('Projective Complex vector descriptors', () => {
    
        it(`can generate the descriptor of a projective complex vector with user prescribed coordinates and weight into a 2D complex vector space`, () => {
            const coordinates = [-1, 3, 2, 4];
            const descriptor = createVector2DProjectiveComplexDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(descriptor.coordinates[0].real).to.eql(coordinates[0]);
            expect(descriptor.coordinates[0].imaginary).to.eql(coordinates[1]);
            expect(descriptor.coordinates[1].real.value).to.eql(coordinates[2]);
            expect(descriptor.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(descriptor.coordinates[1].imaginary.value).to.eql(coordinates[3]);
            expect(descriptor.coordinates[1].imaginary.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective complex vector with user prescribed coordinates and null real weight into a 2D complex vector space`, () => {
            const coordinates = [-1, 3, 0, 4];
            const descriptor = createVector2DProjectiveComplexDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            expect(descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(descriptor.coordinates[0].real).to.eql(coordinates[0]);
            expect(descriptor.coordinates[0].imaginary).to.eql(coordinates[1]);
            expect(descriptor.coordinates[1].real.value).to.eql(coordinates[2]);
            expect(descriptor.coordinates[1].real.strictlyPositive).to.eql(false);
            expect(descriptor.coordinates[1].imaginary.value).to.eql(coordinates[3]);
            expect(descriptor.coordinates[1].imaginary.strictlyPositive).to.eql(true);
        });

        it(`can generate the descriptor of a projective complex vector with user prescribed coordinates and default weights into a 2D complex vector space`, () => {
            const coordinates = [-1, 3];
            const descriptor = createVector2DProjectiveComplexDescriptor(coordinates[0], coordinates[1]);
            expect(descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);   
            expect(descriptor.coordinates[0].real).to.eql(coordinates[0]);
            expect(descriptor.coordinates[0].imaginary).to.eql(coordinates[1]);
            expect(descriptor.coordinates[1].real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(descriptor.coordinates[1].imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(descriptor.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can generate the descriptor of a projective complex vector with default values into a 2D complex vector space`, () => {
            const descriptor = createVector2DProjectiveComplexDescriptor();
            const dimension = 4;
            expect(descriptor.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            expect(descriptor.coordinates[0].real).to.eql(0);
            expect(descriptor.coordinates[0].imaginary).to.eql(0);
            expect(descriptor.coordinates[1].real.value).to.eql(DEFAULT_WEIGHT_VALUE);
            expect(descriptor.coordinates[1].real.strictlyPositive).to.eql(true);
            expect(descriptor.coordinates[1].imaginary.value).to.eql(DEFAULT_IMAGINARY_WEIGHT_VALUE);
            expect(descriptor.coordinates[1].imaginary.strictlyPositive).to.eql(false);
        });

        it(`can copy the descriptor of a projective complex vector into a 2D complex vector space`, () => {
            const coordinates = [-1, 3, 4, 2];
            const descriptor = createVector2DProjectiveComplexDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3]);
            let descriptor1 = copyDescriptorVector2DProjectiveComplex(descriptor);
            expect(descriptor1.type).to.eql(PROJECTIVECOMPLEXVECTOR1D);
            for(let i = 0; i < 2; i++) {
                expect(descriptor.coordinates[i]).to.eql(descriptor1.coordinates[i]);
            }
            descriptor1 = createVector2DProjectiveComplexDescriptor();
            for(let i = 0; i < 2; i++) {
                expect(descriptor.coordinates[i]).to.not.eql(descriptor1.coordinates[i]);
            }
        });

        it(`cannot generate the descriptor of a 2D projective complex vector with a negative real weight value`, () => {
            const coordinates = [-1, 3, -4, 2];
            expect(() => createVector2DProjectiveComplexDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3])).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });

        it(`cannot generate the descriptor of a 2D projective complex vector with a negative imaginary weight value`, () => {
            const coordinates = [-1, 3, 4, -1];
            expect(() => createVector2DProjectiveComplexDescriptor(coordinates[0], coordinates[1], coordinates[2], coordinates[3])).to.throw(EM_WEIGHT_VALUE_POSITIVE);
        });
    });
});