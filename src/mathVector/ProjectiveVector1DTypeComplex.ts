import { EM_COMPLEX_WEIGHT_TOO_SMALL, EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT } from "../ErrorMessages/ProjectiveComplexVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { TOLERANCE_MIN_MAGNITUDE } from "../namedConstants/Complex";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { PROJECTIVECOMPLEXVECTOR1D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { AbstractProjectiveComplexVector } from "./AbstractProjectiveComplexVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ComplexWeight } from "./ComplexWeight";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector2DTypeReal } from "./ProjectiveVector2DTypeReal";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { IVector } from "./Vector";
import { Vector1DTypeComplex } from "./Vector1DTypeComplex";
import { IComplex, ProjectiveComplexVector, ProjectiveComplexVector1D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class ProjectiveVector1DTypeComplex extends AbstractProjectiveComplexVector<2> 
    implements IVector<2, ProjectiveComplexVector1D>
{

    private static readonly DIMENSION = 2 as const;
    private static readonly _vectorType = PROJECTIVECOMPLEXVECTOR1D;
    private readonly  _descriptor: ProjectiveComplexVector;
    protected  readonly _vectorSpace: ProjectiveComplexVectorSpace<2>;
    
    constructor();
    constructor(vectorSpace: ProjectiveComplexVectorSpace<2>);
    constructor(complex: Complex, complexWeight: ComplexWeight, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(complex: Complex, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(real: number, imaginary: number, realWeight?: Weight, imaginaryWeight?: Weight, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(real: number, imaginary: number, vectorSpace?: ProjectiveComplexVectorSpace<2>);

    constructor(realOrComplexOrVectorSpace?: number | Complex | ProjectiveComplexVectorSpace<2>, imaginaryOrComplexWeightOrVectorSpace?: number | ComplexWeight | ProjectiveComplexVectorSpace<2>, realWeightOrVectorSpace?: Weight | ProjectiveComplexVectorSpace<2>, imaginaryWeight?: Weight, vectorSpace?: ProjectiveComplexVectorSpace<2>) {
        super();
        const nullComplex: IComplex = { type: COMPLEX, real: 0, imaginary: 0 };
        const defaultComplexWeight = { type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false) };
        // Case 1: no arguments
        if(realOrComplexOrVectorSpace === undefined) {
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [nullComplex, defaultComplexWeight] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if (realOrComplexOrVectorSpace instanceof ProjectiveComplexVectorSpace && imaginaryOrComplexWeightOrVectorSpace === undefined) {
            super.checkVectorSpaceDimensionConsistency(ProjectiveVector1DTypeComplex.DIMENSION, realOrComplexOrVectorSpace);
            this._vectorSpace = realOrComplexOrVectorSpace;
            const complexW = this.initializeAndValidateWeights(this._vectorSpace);
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D,
                coordinates: [nullComplex, { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] };
            return;
        } 

        // Case 3: coordinates as complex and complex weight with optional vectorSpace
        if (realOrComplexOrVectorSpace instanceof Complex && imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight) {
            if (realWeightOrVectorSpace instanceof Weight || imaginaryWeight !== undefined) {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
            super.checkVectorSpaceConsistency(ProjectiveVector1DTypeComplex.DIMENSION, realWeightOrVectorSpace);
            const complex = realOrComplexOrVectorSpace.toDescriptor();
            this._vectorSpace = (realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace)
                ? realWeightOrVectorSpace
                : this.getDefaultVectorSpace();
            const complexW = this.initializeAndValidateWeights(this._vectorSpace, imaginaryOrComplexWeightOrVectorSpace.real, imaginaryOrComplexWeightOrVectorSpace.imaginary);
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [complex, complexW] };
            return;
        }

        // Case 4: coordinates as complex number with optional vectorSpace
        // At this point: imaginaryOrComplexWeightOrVectorSpace is ProjectiveComplexVectorSpace or undefined (guaranteed by overload)
        if (realOrComplexOrVectorSpace instanceof Complex) {
            if((!(imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) && imaginaryOrComplexWeightOrVectorSpace !== undefined)
            || realWeightOrVectorSpace !== undefined) {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
            super.checkVectorSpaceConsistency(ProjectiveVector1DTypeComplex.DIMENSION, imaginaryOrComplexWeightOrVectorSpace);
            const complex = realOrComplexOrVectorSpace.toDescriptor();
            this._vectorSpace = (imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace)
                ? imaginaryOrComplexWeightOrVectorSpace
                : this.getDefaultVectorSpace();
            const complexW = this.initializeAndValidateWeights(this._vectorSpace);
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D,
                coordinates: [complex, { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] };
            return;
        }

        // Case 5: coordinates as sequence of real and imaginary parts and complex weight as sequence of real and imaginary weights with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number and imaginaryOrComplexWeightOrVectorSpace is number too (guaranteed by overload)
        if(typeof realOrComplexOrVectorSpace === 'number' && typeof imaginaryOrComplexWeightOrVectorSpace === 'number'
            && realWeightOrVectorSpace instanceof Weight && imaginaryWeight instanceof Weight)  {
            super.checkVectorSpaceConsistency(ProjectiveVector1DTypeComplex.DIMENSION, vectorSpace);
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
            // At this point: realWeightOrVectorSpace and imaginaryWeight are Weight (quaranteed by overload)
            const complexW = this.initializeAndValidateWeights(this._vectorSpace, realWeightOrVectorSpace, imaginaryWeight);
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                { type: COMPLEX, real: realOrComplexOrVectorSpace, imaginary: imaginaryOrComplexWeightOrVectorSpace! },
                complexW
            ]};
            return;
        }

        // Case 6: coordinates as sequence of real and imaginary parts with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number and imaginaryOrComplexWeightOrVectorSpace is number too (guaranteed by overload)
        if(typeof realOrComplexOrVectorSpace !== 'number' || typeof imaginaryOrComplexWeightOrVectorSpace !== 'number'
            || imaginaryWeight !== undefined) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        if (realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace || realWeightOrVectorSpace === undefined) {
            super.checkVectorSpaceConsistency(ProjectiveVector1DTypeComplex.DIMENSION, realWeightOrVectorSpace);
            this._vectorSpace = (realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace)
                ? realWeightOrVectorSpace
                : this.getDefaultVectorSpace();
            const complexW = this.initializeAndValidateWeights(this._vectorSpace);
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                { type: COMPLEX, real: realOrComplexOrVectorSpace, imaginary: imaginaryOrComplexWeightOrVectorSpace! },
                complexW
            ]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }
    
    private getDefaultVectorSpace(): ProjectiveComplexVectorSpace<2> {
        try{
            return getDefaultVectorSpace(this.spaceType, ProjectiveVector1DTypeComplex.DIMENSION);
        } catch(error) {
            return new ProjectiveComplexVectorSpace(ProjectiveVector1DTypeComplex.DIMENSION, true);
        }
    }

    get dimension(): number { return ProjectiveVector1DTypeComplex.DIMENSION; } // Homogeneous coordinates
    get vectorType(): string { return ProjectiveVector1DTypeComplex._vectorType; }
    get vectorSpace(): ProjectiveComplexVectorSpace<2> { return this._vectorSpace; }
    get coordinates(): Complex[] { return [new Complex(this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary), new Complex(this._descriptor.coordinates[1].real.value, this._descriptor.coordinates[1].imaginary.value)]; }
    get descriptor(): ProjectiveComplexVector { return { ...this._descriptor }; }
    
    get weight(): ComplexWeight {
        return new ComplexWeight(this._descriptor.coordinates[1].real, this._descriptor.coordinates[1].imaginary);
    }

    get weightManagement(): WeightManagement {
        return this._vectorSpace.weightManagement;
    }
    
    get homogeneousComplexCoordinates(): Complex[] {
        return [new Complex(this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary), new Complex(this.weight.real.value, this.weight.imaginary.value)];
    }

    private initializeAndValidateWeights(vectorSpace: ProjectiveComplexVectorSpace<2>, realWeight?: Weight, imaginaryWeight?: Weight): ComplexWeight {
        const weightManagement = vectorSpace.weightManagement;
        let realW = new Weight();
        let imaginaryW = new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false);
        switch(weightManagement) {
            case WeightManagement.AllStrictlyPositiveWeights:
                if(realWeight !== undefined) {
                    realW = realWeight;
                    if(!realWeight.strictlyPositive) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
                }
                if(imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    // Removed because the imaginary weight management is set free to process the default
                    // imaginary weight value set to 0
                    // if(!imaginaryWeight.strictlyPositive) {
                    //     const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                    //     throw new RangeError(error.generateMessageString());
                    // }
                }
                break;
            case WeightManagement.AllPositiveWeights:
                if(realWeight !== undefined) {
                    realW = realWeight;
                    if(realWeight.strictlyPositive) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
                } else realW = new Weight(DEFAULT_WEIGHT_VALUE, false);
                if(imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    if(imaginaryWeight.strictlyPositive) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
                } else imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE, false);
                break;
            case WeightManagement.SomeNullWeights:
                if(realWeight !== undefined) {
                    realW = realWeight;
                    imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE, realWeight.strictlyPositive);
                    // Modified because the imaginary weight management is set free to process the default
                    // if(imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive === realWeight.strictlyPositive) {
                    if(imaginaryWeight !== undefined) {
                        imaginaryW = imaginaryWeight;
                    // } else {
                    //     const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                    //     throw new RangeError(error.generateMessageString());
                    }
                }
                if(imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    realW = new Weight(DEFAULT_WEIGHT_VALUE, imaginaryWeight.strictlyPositive);
                    if(realWeight !== undefined) {
                        realW = realWeight;
                    }
                }
                break;
        }
        return new ComplexWeight(realW, imaginaryW);
    }
    
    getCoordinate(index: number): Complex {
        if (index < 0 || index >= ProjectiveVector1DTypeComplex.DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        if (index === 1) {
            return this.weight.toComplex();
        }
        return new Complex(this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary);
    }
    
    homogeneousTransform(): ProjectiveVector1DTypeComplex {
        const complexW = this.weight.toComplex();
        if (complexW.magnitude() < TOLERANCE_MIN_MAGNITUDE) {
            // the magnitude of the complex weight is too small to perform a complex division
            const error = sendRangeErrorMessage(this.constructor.name, 'homogeneousTransform', EM_COMPLEX_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        let normalizedWeight = new ComplexWeight();
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) normalizedWeight = new ComplexWeight( new Weight(DEFAULT_WEIGHT_VALUE, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false));
        if(this._vectorSpace.weightManagement === WeightManagement.SomeNullWeights) normalizedWeight = new ComplexWeight( new Weight(), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false));
        return new ProjectiveVector1DTypeComplex(complexW.divide(this.coordinates[0]), normalizedWeight, this._vectorSpace);
    }

    normalize(tolerance?: number): this {
        const result = super.normalize(tolerance);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    add(other: ProjectiveVector1DTypeComplex): this {
        const result = super.add(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: ProjectiveVector1DTypeComplex): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    equals(other: ProjectiveVector1DTypeComplex, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }
    
    toComplexVector(vectorSpace?: ComplexVectorSpace<1>): Vector1DTypeComplex {
        let vSpace = vectorSpace;
        if(vSpace === undefined) {
            try{
                vSpace = getDefaultVectorSpace(VectorSpaceType.COMPLEX, 1);
            } catch(error) {
                vSpace = new ComplexVectorSpace(1, true);
            }
        }
        try {
            const normalized = this.homogeneousTransform();
            return new Vector1DTypeComplex(
                normalized._descriptor.coordinates[0].real,
                normalized._descriptor.coordinates[0].imaginary,
                vSpace
            );
        } catch (error) {
            return new Vector1DTypeComplex(
                this._descriptor.coordinates[0].real,
                this._descriptor.coordinates[0].imaginary,
                vSpace
            );
        }
    }

    toProjectiveVector(projectiveVectorSpace?: ProjectiveVectorSpace<3>): ProjectiveVector2DTypeReal {
        if(projectiveVectorSpace !== undefined) {
            const projVect =  new ProjectiveVector2DTypeReal(this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary, this.weight.real, projectiveVectorSpace);
            const weiht = projVect.weight;
            const weightManagement = projVect.weightManagement;
            return projVect;
        }
        return new ProjectiveVector2DTypeReal(this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary, this.weight.real, projectiveVectorSpace);
    }

    toString(): string {
        return this.vectorType + `(${this.getCoordinate(0).toString()}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }
    
    clone(): this {
        return new ProjectiveVector1DTypeComplex(
            this._descriptor.coordinates[0].real,
            this._descriptor.coordinates[0].imaginary,
            new Weight(this.weight.real.value, this.weight.real.strictlyPositive),
            new Weight(this.weight.imaginary.value, this.weight.imaginary.strictlyPositive),
            this._vectorSpace
        ) as this;
    }

    createVectorFromDescriptor(descriptor: ProjectiveComplexVector): this {
        return new ProjectiveVector1DTypeComplex(descriptor.coordinates[0].real, descriptor.coordinates[0].imaginary, descriptor.coordinates[1].real, descriptor.coordinates[1].imaginary, this.vectorSpace) as this;
    }
}