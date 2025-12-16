import { EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT } from "../ErrorMessages/ComplexWeight";
import { EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT } from "../ErrorMessages/ProjectiveComplexVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
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
import { ProjectiveComplexVector } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 2;

export class ProjectiveVector1DTypeComplex  extends AbstractProjectiveComplexVector {
    private data: ProjectiveComplexVector;
    protected _vectorSpace: ProjectiveComplexVectorSpace<2>;
    
    constructor();
    constructor(real: number, imaginary: number, realWeight?: Weight, imaginaryWeight?: Weight, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(real: number, imaginary: number, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(complex: Complex, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(complex: Complex, complexWeight: ComplexWeight, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(vectorSpace: ProjectiveComplexVectorSpace<2>);
    constructor(realOrComplexOrVectorSpace?: number | Complex | ProjectiveComplexVectorSpace<2>, imaginaryOrComplexWeightOrVectorSpace?: number | ComplexWeight | ProjectiveComplexVectorSpace<2>, realWeightOrVectorSpace?: Weight | ProjectiveComplexVectorSpace<2>, imaginaryWeight?: Weight, vectorSpace?: ProjectiveComplexVectorSpace<2>) {
        super();
        this._vectorSpace = vectorSpace ?? getDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: 0, imaginary: 0},
            { type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight()}] 
        };
        if (realOrComplexOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
            this.initFromVectorSpace(realOrComplexOrVectorSpace);
            return;
        } else if (realOrComplexOrVectorSpace instanceof Complex) {
            const complex = realOrComplexOrVectorSpace;
            let realWeight = new Weight();
            let imaginaryWeight = new Weight();
            if (imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight) {
                if(realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
                    this.initFromComplexParams(realOrComplexOrVectorSpace, imaginaryOrComplexWeightOrVectorSpace, realWeightOrVectorSpace);
                } else if(realWeightOrVectorSpace === undefined) {
                    this.initFromComplexParams(realOrComplexOrVectorSpace, imaginaryOrComplexWeightOrVectorSpace);
                }
                return;
            } else if (imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
                this.initFromComplexParams(realOrComplexOrVectorSpace, imaginaryOrComplexWeightOrVectorSpace);
                return;
            }
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                realWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
                imaginaryWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            }
            this.data = { 
                type: PROJECTIVECOMPLEXVECTOR1D, 
                coordinates: [{ type: COMPLEX, real: complex.real, imaginary: complex.imaginary },
                { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight}]
            };
            return;
        }
        const real = realOrComplexOrVectorSpace ?? 0;
        if(typeof imaginaryOrComplexWeightOrVectorSpace === 'number') {
            const imaginary = imaginaryOrComplexWeightOrVectorSpace;
            if(realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
                this.initFromRealParams(real, imaginary, realWeightOrVectorSpace);
                return;
            }
            let realWeight = new Weight();
            if(realWeightOrVectorSpace !== undefined) {
                this.checkWeightsConsistency(realWeightOrVectorSpace, imaginaryWeight);
                realWeight = realWeightOrVectorSpace;
            }
            this.initFromRealParams(real, imaginary, realWeight, imaginaryWeight, this._vectorSpace);
            return;
        } else if (imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight) {
            if(realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
                this._vectorSpace = realWeightOrVectorSpace;
            }
            const complexWeight = imaginaryOrComplexWeightOrVectorSpace;
            if(complexWeight.real.strictlyPositive && this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`)
                throw new RangeError(error.generateMessageString());
            }
            this.data = { 
                type: PROJECTIVECOMPLEXVECTOR1D, 
                coordinates: [{ type: COMPLEX, real: real, imaginary: 0 },
                { type: COMPLEXWEIGHT, real: complexWeight.real, imaginary: complexWeight.imaginary}] 
            };
            return;
        } else if(imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
            this.initFromComplexParams(new Complex(real, 0), imaginaryOrComplexWeightOrVectorSpace);
            return;
        }
        this.initFromRealParams(real, 0, realWeightOrVectorSpace, imaginaryWeight, this._vectorSpace);
    }
    
    get dimension(): number { return SPACE_DIMENSION; } // Homogeneous coordinates
    get vectorType(): string { return PROJECTIVECOMPLEXVECTOR1D; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVECOMPLEX; }
    get coordinates(): Complex[] { return [new Complex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary), new Complex(this.data.coordinates[1].real.value, this.data.coordinates[1].imaginary.value)]; }
    get descriptor(): ProjectiveComplexVector { return { ...this.data }; }
    
    get weight(): ComplexWeight {
        return new ComplexWeight(this.data.coordinates[1].real, this.data.coordinates[1].imaginary);
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0].real, this.data.coordinates[0].imaginary, this.weight.real.value];
    }

    private initFromVectorSpace(vectorSpace: ProjectiveComplexVectorSpace<2>): void {
        this._vectorSpace = vectorSpace;
        const real = 0;
        const imaginary = 0;
        const complexW = this.initializeAndValidateWeights(this._vectorSpace);
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
            { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] 
        };
    }

    private initFromComplexParams(complexCoord: Complex, complexWeight?: ComplexWeight | ProjectiveComplexVectorSpace<2>, complexProjVS?: ProjectiveComplexVectorSpace<2>): void {
        const complex = complexCoord ?? new Complex(0, 0);
        const vectorSpace = complexProjVS ?? getDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
        let complexW = new ComplexWeight();
        if(complexWeight instanceof ProjectiveComplexVectorSpace) {
            this._vectorSpace = complexWeight;
            complexW = this.initializeAndValidateWeights(vectorSpace);
        } else {
            this._vectorSpace = vectorSpace;
            complexW = this.initializeAndValidateWeights(vectorSpace, complexWeight?.real, complexWeight?.imaginary);
        }
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: complex.real, imaginary: complex.imaginary },
            { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] 
        };
    }

    private checkWeightsConsistency(realWeight: Weight, imaginaryWeight?: Weight): void {
        switch(this._vectorSpace.weightManagement) {
            case WeightManagement.AllStrictlyPositiveWeights:
                if(!realWeight.strictlyPositive && (imaginaryWeight !== undefined && !imaginaryWeight.strictlyPositive)) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                    throw new RangeError(error.generateMessageString());
                } else if(!realWeight.strictlyPositive || (imaginaryWeight !== undefined && !imaginaryWeight.strictlyPositive)) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                    throw new RangeError(error.generateMessageString());
                }
                break;
            case WeightManagement.AllPositiveWeights:
                if(realWeight.strictlyPositive && (imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive)) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                    throw new RangeError(error.generateMessageString());
                } else if(realWeight.strictlyPositive || (imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive)) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                    throw new RangeError(error.generateMessageString());
                }
                break;
            default:
                if(imaginaryWeight !== undefined && (realWeight.strictlyPositive !== imaginaryWeight.strictlyPositive)) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                    throw new RangeError(error.generateMessageString());
                }
        }
    }

    private initFromRealParams(realCoord?: number, imaginaryCoord?: number, realW?: Weight | ProjectiveComplexVectorSpace<2>, imaginaryW?: Weight, vectorSp?: ProjectiveComplexVectorSpace<2>): void {
        const real = realCoord ?? 0;
        const imaginary = imaginaryCoord ?? 0;
        const vectorSpace = vectorSp ?? getDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
        let complexW = new ComplexWeight();
        if(realW instanceof ProjectiveComplexVectorSpace) {
            this._vectorSpace = realW;
            complexW = this.initializeAndValidateWeights(vectorSpace);
        } else {
            this._vectorSpace = vectorSpace;
            complexW = this.initializeAndValidateWeights(vectorSpace, realW, imaginaryW);
        }
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
            { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] 
        };
    }

    protected initializeAndValidateWeights(vectorSpace: ProjectiveComplexVectorSpace<2>, realWeight?: Weight, imaginaryWeight?: Weight): ComplexWeight {
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
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`)
                        throw new RangeError(error.generateMessageString());
                    }
                }
                if(imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    realW = new Weight(DEFAULT_WEIGHT_VALUE, imaginaryWeight.strictlyPositive);
                    if(realWeight !== undefined && realWeight.strictlyPositive === imaginaryWeight.strictlyPositive) {
                        realW = realWeight;
                    } else {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`)
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
        return new Complex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary) as Complex;
    }
    
    
    normalize(): ProjectiveVector1DTypeComplex {
        const w = this.weight.real.value;
        if (w === 0) return this.clone() as ProjectiveVector1DTypeComplex;
        const complex = new Complex(this.data.coordinates[0].real / w, this.data.coordinates[0].imaginary / w);
        return new ProjectiveVector1DTypeComplex(complex, new ComplexWeight());
    }

    add(other: ProjectiveVector1DTypeComplex): ProjectiveVector1DTypeComplex {
        return super.add(other) as ProjectiveVector1DTypeComplex;
    }

    subtract(other: ProjectiveVector1DTypeComplex): ProjectiveVector1DTypeComplex {
        return super.subtract(other) as ProjectiveVector1DTypeComplex;
    }

    equals(other: ProjectiveVector1DTypeComplex, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }
    
    toComplexVector(): Vector1DTypeComplex {
        const normalized = this.normalize();
        const realWeight = this.weight.real.value
        return new Vector1DTypeComplex(
            normalized.data.coordinates[0].real,
            normalized.data.coordinates[0].imaginary
        );
    }

    toString(): string {
        return this.vectorType + `(${this.getCoordinate(0).toString()}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }
    
    clone(): ProjectiveVector1DTypeComplex {
        return new ProjectiveVector1DTypeComplex(
            this.data.coordinates[0].real,
            this.data.coordinates[0].imaginary,
            new Weight(this.weight.real.value, this.weight.real.strictlyPositive),
            new Weight(this.weight.imaginary.value, this.weight.imaginary.strictlyPositive),
            this._vectorSpace
        );
    }

    static fromRaw(raw: ProjectiveComplexVector): ProjectiveVector1DTypeComplex {
        return new ProjectiveVector1DTypeComplex(raw.coordinates[0].real, raw.coordinates[0].imaginary, raw.coordinates[1].real, raw.coordinates[1].imaginary);
    }
}