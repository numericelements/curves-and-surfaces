import { EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT } from "../ErrorMessages/ComplexWeight";
import { EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT } from "../ErrorMessages/ProjectiveComplexVectors";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { PROJECTIVECOMPLEXVECTOR1D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { COMPLEXWEIGHT } from "../namedConstants/WeightTypeTags";
import { AbstractProjectiveComplexVector } from "./AbstractProjectiveComplexVector";
import { Complex } from "./Complex";
import { ComplexWeight } from "./ComplexWeight";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { Vector1DTypeComplex } from "./Vector1DTypeComplex";
import { IComplex, ProjectiveComplexVector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 2;

export class ProjectiveVector1DTypeComplex extends AbstractProjectiveComplexVector<2> {
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
        const defaultComplexWeight = { type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight() };
        // Case 1: no arguments
        if(realOrComplexOrVectorSpace === undefined) {
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [nullComplex, defaultComplexWeight] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if (realOrComplexOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
            this._vectorSpace = realOrComplexOrVectorSpace;
            const complexW = this.initializeAndValidateWeights(this._vectorSpace);
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D,
                coordinates: [nullComplex, { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] };
            return;
        } 

        // Case 3: coordinates as complex and complex weight with optional vectorSpace
        if (realOrComplexOrVectorSpace instanceof Complex && imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight) {
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
            const complex = realOrComplexOrVectorSpace.toDescriptor();
            this._vectorSpace = (imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace)
                ? imaginaryOrComplexWeightOrVectorSpace
                : this.getDefaultVectorSpace();
            const complexW = this.initializeAndValidateWeights(this._vectorSpace);
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D,
                coordinates: [complex, { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] };
            return;
        }

        // Case 5: coordinates as sequence of real and imaginary parts  and complex weight as sequence of real and imaginary weights with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number and imaginaryOrComplexWeightOrVectorSpace is number too (guaranteed by overload)
        if(realWeightOrVectorSpace instanceof Weight)  {
            if(imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace
                || imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight) {
                // cannot be reached with overloads, but added for type safety -> not covered by istanbul ignore
                throw new RangeError();
            }
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
            // At this point: imaginaryWeight is Weight (quaranteed by overload)
            const complexW = this.initializeAndValidateWeights(this._vectorSpace, realWeightOrVectorSpace, imaginaryWeight);
            this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
                { type: COMPLEX, real: realOrComplexOrVectorSpace, imaginary: imaginaryOrComplexWeightOrVectorSpace! },
                complexW
            ]};
            return;
        }

        // Case 6: coordinates as sequence of real and imaginary parts with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number and imaginaryOrComplexWeightOrVectorSpace is number too (guaranteed by overload)
        this._vectorSpace = (realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace)
            ? realWeightOrVectorSpace
            : this.getDefaultVectorSpace();
        const complexW = this.initializeAndValidateWeights(this._vectorSpace);
        if(imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace
            || imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight) {
            // cannot be reached with overloads, but added for type safety -> not covered by istanbul ignore
            throw new RangeError();
        }
        this._descriptor = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [
            { type: COMPLEX, real: realOrComplexOrVectorSpace, imaginary: imaginaryOrComplexWeightOrVectorSpace! },
            complexW
        ]}; 
    }
    
    private getDefaultVectorSpace(): ProjectiveComplexVectorSpace<2> {
        try{
            return getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveComplexVectorSpace<2>;
        } catch(error) {
            return new ProjectiveComplexVectorSpace(this.dimension, true) as ProjectiveComplexVectorSpace<2>;
        }
    }

    get dimension(): number { return SPACE_DIMENSION; } // Homogeneous coordinates
    get vectorType(): string { return PROJECTIVECOMPLEXVECTOR1D; }
    get vectorSpace(): ProjectiveComplexVectorSpace<2> { return this._vectorSpace; }
    get coordinates(): Complex[] { return [new Complex(this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary), new Complex(this._descriptor.coordinates[1].real.value, this._descriptor.coordinates[1].imaginary.value)]; }
    get descriptor(): ProjectiveComplexVector { return { ...this._descriptor }; }
    
    get weight(): ComplexWeight {
        return new ComplexWeight(this._descriptor.coordinates[1].real, this._descriptor.coordinates[1].imaginary);
    }
    
    get homogeneousCoordinates(): number[] {
        return [this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary, this.weight.real.value];
    }

    private initializeAndValidateWeights(vectorSpace: ProjectiveComplexVectorSpace<2>, realWeight?: Weight, imaginaryWeight?: Weight): ComplexWeight {
        const weightManagement = vectorSpace.weightManagement;
        let realW = new Weight();
        let imaginaryW = new Weight();
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
                    if(!imaginaryWeight.strictlyPositive) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
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
                    if(imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive === realWeight.strictlyPositive) {
                        imaginaryW = imaginaryWeight;
                    } else {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
                }
                if(imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    realW = new Weight(DEFAULT_WEIGHT_VALUE, imaginaryWeight.strictlyPositive);
                    if(realWeight !== undefined && realWeight.strictlyPositive === imaginaryWeight.strictlyPositive) {
                        realW = realWeight;
                    } else {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
                }
                break;
        }
        return new ComplexWeight(realW, imaginaryW);
    }
    
    getCoordinate(index: number): Complex {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        if (index === 1) {
            const real = this.weight.real.value;
            const imaginary = this.weight.imaginary.value;
            return new Complex(real, imaginary);
        }
        return new Complex(this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary);
    }
    
    normalize(): ProjectiveVector1DTypeComplex {
        const w = this.weight.real.value;
        if (w === 0) return this.clone();
        const complex = new Complex(this._descriptor.coordinates[0].real / w, this._descriptor.coordinates[0].imaginary / w);
        return new ProjectiveVector1DTypeComplex(complex, new ComplexWeight());
    }

    add(other: ProjectiveVector1DTypeComplex): ProjectiveVector1DTypeComplex {
        const result = super.add(other) as ProjectiveVector1DTypeComplex;
        return new ProjectiveVector1DTypeComplex(result.coordinates[0], super.add(other).weight, this._vectorSpace);
    }

    subtract(other: ProjectiveVector1DTypeComplex): ProjectiveVector1DTypeComplex {
        const result = super.subtract(other) as ProjectiveVector1DTypeComplex;
        return new ProjectiveVector1DTypeComplex(result.coordinates[0], super.subtract(other).weight, this._vectorSpace);
    }

    equals(other: ProjectiveVector1DTypeComplex, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }
    
    toComplexVector(): Vector1DTypeComplex {
        const normalized = this.normalize();
        const realWeight = this.weight.real.value
        return new Vector1DTypeComplex(
            normalized._descriptor.coordinates[0].real,
            normalized._descriptor.coordinates[0].imaginary
        );
    }

    toString(): string {
        return this.vectorType + `(${this.getCoordinate(0).toString()}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }
    
    clone(): ProjectiveVector1DTypeComplex {
        return new ProjectiveVector1DTypeComplex(
            this._descriptor.coordinates[0].real,
            this._descriptor.coordinates[0].imaginary,
            new Weight(this.weight.real.value, this.weight.real.strictlyPositive),
            new Weight(this.weight.imaginary.value, this.weight.imaginary.strictlyPositive),
            this._vectorSpace
        );
    }

    createVectorFromDescriptor(descriptor: ProjectiveComplexVector): ProjectiveVector1DTypeComplex {
        return new ProjectiveVector1DTypeComplex(descriptor.coordinates[0].real, descriptor.coordinates[0].imaginary, descriptor.coordinates[1].real, descriptor.coordinates[1].imaginary, this.vectorSpace);
    }
}