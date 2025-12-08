import { EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT } from "../ErrorMessages/ComplexWeight";
import { EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT } from "../ErrorMessages/ProjectiveComplexVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractProjectiveComplexVector } from "./AbstractProjectiveComplexVector";
import { Complex } from "./Complex";
import { ComplexWeight } from "./ComplexWeight";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { IComplex, COMPLEX, IComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 2;

export interface ProjectiveVector1DTypeComplexParamsReal {
    real?: number;
    imaginary?: number;
    realWeight?: Weight;
    imaginaryWeight?: Weight;
    vectorSpace?: ProjectiveComplexVectorSpace<2>;
}

export interface ProjectiveVector1DTypeComplexParamsComplex {
    complex?: Complex;
    complexWeight?: ComplexWeight;
    vectorSpace?: ProjectiveComplexVectorSpace<2>;
}

export class ProjectiveVector1DTypeComplex  extends AbstractProjectiveComplexVector {
    private data: ProjectiveComplexVector;
    protected _vectorSpace: ProjectiveComplexVectorSpace<2>;
    

    // constructor(arg?: ProjectiveComplexVectorSpace<2> | ProjectiveVector1DTypeComplexParamsComplex | ProjectiveVector1DTypeComplexParamsReal) {
    //     super();
    //     this._vectorSpace = getDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
    //     this.data = { 
    //         type: PROJECTIVECOMPLEXVECTOR1D, 
    //         coordinates: [{ type: COMPLEX, real: 0, imaginary: 0},
    //         { type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight()}] 
    //     };
    //     if(arg instanceof ProjectiveComplexVectorSpace) {
    //         this.initFromVectorSpace(arg);
    //         return;
    //     } else if(typeof arg === 'object' && 'complex' in arg) {
    //         this.initFromComplexParams(arg);
    //         return;
    //     }
    //     const options = (arg || {}) as ProjectiveVector1DTypeComplexParamsReal;
    //     this.initFromRealParams(options);
    // }
    constructor();
    constructor(real: number, imaginary: number, realWeight?: Weight, imaginaryWeight?: Weight, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(real: number, imaginary: number, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(complex: Complex, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(complex: Complex, complexWeight: ComplexWeight, vectorSpace?: ProjectiveComplexVectorSpace<2>);
    constructor(vectorSpace: ProjectiveComplexVectorSpace<2>);
    constructor(realOrComplexOrVectorSpace?: number | Complex | ProjectiveComplexVectorSpace<2>, imaginaryOrComplexWeightOrVectorSpace?: number | ComplexWeight | ProjectiveComplexVectorSpace<2>, realWeightOrVectorSpace?: Weight | ProjectiveComplexVectorSpace<2>, imaginaryWeight?: Weight, vectorSpace?: ProjectiveComplexVectorSpace<2>) {
        super();
        if (realOrComplexOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
            this._vectorSpace = realOrComplexOrVectorSpace;
            const nullComplex: IComplex = { type: COMPLEX, real: 0, imaginary: 0 };
            let nullComplexWeight: IComplexWeight = { type: COMPLEXWEIGHT, real: new Weight(), imaginary: new Weight() };
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) 
                nullComplexWeight = { type: COMPLEXWEIGHT, real: new Weight(DEFAULT_WEIGHT_VALUE, false), imaginary: new Weight(DEFAULT_WEIGHT_VALUE, false) };
            this.data = { type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [nullComplex, nullComplexWeight] };
            return;
        } else if (realOrComplexOrVectorSpace instanceof Complex) {
            const complex = realOrComplexOrVectorSpace;
            let realWeight = new Weight();
            let imaginaryWeight = new Weight();
            if (imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight) {
                realWeight = imaginaryOrComplexWeightOrVectorSpace.real;
                imaginaryWeight = imaginaryOrComplexWeightOrVectorSpace.imaginary;
                if(realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
                    this._vectorSpace = realWeightOrVectorSpace;
                } else {
                    this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveComplexVectorSpace<2>;
                }
                if((this._vectorSpace.weightManagement === WeightManagement.AllStrictlyPositiveWeights && (!realWeight.strictlyPositive || !imaginaryWeight.strictlyPositive)) ||
                    (this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights && (realWeight.strictlyPositive || imaginaryWeight.strictlyPositive))) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
                        throw new RangeError(error.generateMessageString());
                    }
                this.data = { 
                    type: PROJECTIVECOMPLEXVECTOR1D, 
                    coordinates: [
                        { type: COMPLEX, real: complex.real, imaginary: complex.imaginary },
                        { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight}
                    ]
                };
                return;
            } else if (imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
                this._vectorSpace = imaginaryOrComplexWeightOrVectorSpace;
                let realWeight = new Weight();
                let imaginaryWeight = new Weight();
                if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                    realWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
                    imaginaryWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
                }
                this.data = { 
                    type: PROJECTIVECOMPLEXVECTOR1D, 
                    coordinates: [
                        { type: COMPLEX, real: complex.real, imaginary: complex.imaginary },
                        { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight}
                    ]
                };
                return;
            }
            if (vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveComplexVectorSpace<2>;
            }
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                realWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
                imaginaryWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            }
            this.data = { 
                type: PROJECTIVECOMPLEXVECTOR1D, 
                coordinates: [
                    { type: COMPLEX, real: complex.real, imaginary: complex.imaginary },
                    { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight}
                ] 
            };
            return;
        }
        const real = realOrComplexOrVectorSpace ?? 0;
        if(typeof imaginaryOrComplexWeightOrVectorSpace === 'number') {
            const imaginary = imaginaryOrComplexWeightOrVectorSpace;
            if(realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
                this._vectorSpace = realWeightOrVectorSpace;
                let realWeight = new Weight();
                let imaginaryWeight1 = new Weight();
                if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                    realWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
                    imaginaryWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
                }
                this.data = { 
                    type: PROJECTIVECOMPLEXVECTOR1D, 
                    coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
                                { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight1}] 
                };
                return;
            }
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveComplexVectorSpace<2>;
            }
            let realWeight = new Weight();
            if(realWeightOrVectorSpace !== undefined) {
                if(this._vectorSpace.weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                    if(!realWeightOrVectorSpace.strictlyPositive && (imaginaryWeight !== undefined && !imaginaryWeight.strictlyPositive)) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    } else if(!realWeightOrVectorSpace.strictlyPositive || (imaginaryWeight !== undefined && !imaginaryWeight.strictlyPositive)) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
                } else if (this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                    if(realWeightOrVectorSpace.strictlyPositive && (imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive)) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    } else if(realWeightOrVectorSpace.strictlyPositive || (imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive)) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
                } else {
                    if(imaginaryWeight !== undefined && (realWeightOrVectorSpace.strictlyPositive !== imaginaryWeight.strictlyPositive)) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT)
                        throw new RangeError(error.generateMessageString());
                    }
                }
                realWeight = realWeightOrVectorSpace;
            }
            let imaginaryWeight1 = (imaginaryWeight instanceof Weight) ? imaginaryWeight : new Weight();
            if(realWeightOrVectorSpace === undefined && this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                realWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
                imaginaryWeight1 = new Weight(DEFAULT_WEIGHT_VALUE, false);
            }
            this.data = { 
                type: PROJECTIVECOMPLEXVECTOR1D, 
                coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
                            { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight1}] 
            };
            return;
        } else if (imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight) {
            if(realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace) {
                this._vectorSpace = realWeightOrVectorSpace;
            } else if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveComplexVectorSpace<2>;
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
            let realWeight = new Weight();
            let imaginaryWeight = new Weight();
            const imaginary = 0;
            this._vectorSpace = imaginaryOrComplexWeightOrVectorSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                realWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
                imaginaryWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
            }
            this.data = { 
                type: PROJECTIVECOMPLEXVECTOR1D, 
                coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
                { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight}] 
            };
            return;
        }
        if(vectorSpace !== undefined) {
            this._vectorSpace = vectorSpace;
        } else {
            this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveComplexVectorSpace<2>;
        }
        const imaginary = imaginaryOrComplexWeightOrVectorSpace ?? 0;
        if(!(realWeightOrVectorSpace instanceof Weight)) {
            realWeightOrVectorSpace = new Weight();
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights)
                realWeightOrVectorSpace = new Weight(DEFAULT_WEIGHT_VALUE, false);
        }
        const realWeight = realWeightOrVectorSpace;
        if(!(imaginaryWeight instanceof Weight)) {
            imaginaryWeight = new Weight();
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights)
                imaginaryWeight = new Weight(DEFAULT_WEIGHT_VALUE, false);
        }
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
            { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight}] 
        };
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
        const complexW = this.normalizeAndValidateWeights(this._vectorSpace);
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
            { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] 
        };
    }

    private initFromComplexParams(params: ProjectiveVector1DTypeComplexParamsComplex): void {
        const complex = params.complex ?? new Complex(0, 0);
        const vectorSpace = params.vectorSpace ?? getDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
        const complexW = this.normalizeAndValidateWeights(vectorSpace, params.complexWeight?.real, params.complexWeight?.imaginary);
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: complex.real, imaginary: complex.imaginary },
            { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] 
        };
    }

    private initFromRealParams(params: ProjectiveVector1DTypeComplexParamsReal): void {
        const real = params.real ?? 0;
        const imaginary = params.imaginary ?? 0;
        const vectorSpace = params.vectorSpace ?? getDefaultVectorSpace(VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
        const complexW = this.normalizeAndValidateWeights(vectorSpace, params.realWeight, params.imaginaryWeight);
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
            { type: COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary}] 
        };
    }

    protected normalizeAndValidateWeights(vectorSpace: ProjectiveComplexVectorSpace<2>, realWeight?: Weight, imaginaryWeight?: Weight): ComplexWeight {
        const weightManagement = vectorSpace.weightManagement;
        let realW = new Weight();
        let imaginaryW = new Weight();
        switch(weightManagement) {
            case WeightManagement.AllStrictlyPositiveWeights:
                if(realWeight !== undefined) {
                    realW = realWeight;
                    if(!realWeight.strictlyPositive) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`)
                        throw new RangeError(error.generateMessageString());
                    }
                }
                if(imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    if(!imaginaryWeight.strictlyPositive) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`)
                        throw new RangeError(error.generateMessageString());
                    }
                }
                break;
            case WeightManagement.AllPositiveWeights:
                if(realWeight !== undefined) {
                    realW = realWeight;
                    if(realWeight.strictlyPositive) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`)
                        throw new RangeError(error.generateMessageString());
                    }
                } else realW = new Weight(DEFAULT_WEIGHT_VALUE, false);
                if(imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    if(imaginaryWeight.strictlyPositive) {
                        const error = sendRangeErrorMessage(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`)
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
                    realW = imaginaryW = new Weight(DEFAULT_WEIGHT_VALUE, imaginaryWeight.strictlyPositive);
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
    
    // setCoordinate(index: number, value: Complex): void {
    //     if (index < 0 || index >= 1) throw new RangeError('Coordinate index out of bounds');
    //     if (index === 1) {
    //         this.data.coordinates[1].real = new Weight(value.real);
    //         this.data.coordinates[1].imaginary = new Weight(value.imaginary);
    //     } else {
    //         this.data.coordinates[index].real = value.real;
    //         this.data.coordinates[index].imaginary = value.imaginary;
    //     }
    // }
    
    normalize(): ProjectiveVector1DTypeComplex {
        const w = this.weight.real.value;
        if (w === 0) return this.clone() as ProjectiveVector1DTypeComplex;
        const complex = new Complex(this.data.coordinates[0].real / w, this.data.coordinates[0].imaginary / w);
        const complexArgs: ProjectiveVector1DTypeComplexParamsComplex = {complex: complex, complexWeight: new ComplexWeight()}
        // return new ProjectiveVector1DTypeComplex(complexArgs);
        return new ProjectiveVector1DTypeComplex(complex, new ComplexWeight());
    }

    // add(other: ProjectiveVector1DTypeComplex): ProjectiveVector1DTypeComplex {
    //     // this.validateCompatibility(other);
    //     const result = this.vectorSpace.add(this.raw, other.raw);
    //     return this.createVectorFromRaw(result);
    // }
    
    toCartesian(): Vector2DTypeReal {
        const normalized = this.normalize();
        return new Vector2DTypeReal(
            normalized.data.coordinates[0].real,
            normalized.data.coordinates[0].imaginary
        );
    }

    toString(): string {
        return this.vectorType + `(${this.getCoordinate(0).toString()}, ${this.weight.toString()})`;
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