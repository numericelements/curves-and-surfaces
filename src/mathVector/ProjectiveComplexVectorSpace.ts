import { EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL, EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY } from "../ErrorMessages/ComplexOperators";
import { EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE } from "../ErrorMessages/ComplexVectorSpace";
import { EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS, EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVECOMPLEXVECTOR_WITH_NEGATIVE_WEIGHT, EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM, EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE, EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE, EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER as EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER, EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLPOS } from "../ErrorMessages/ProjectiveComplexVectorSpace";
import { EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS, EM_WEIGHT_SUBTRACTION_ERROR } from "../ErrorMessages/WeightManager";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE, MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE } from "../namedConstants/ProjectiveComplexVectorSpace";
import { WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { resolveVectorSpace } from "./internal/VectorSpaceResolvers";
import { ProjectiveComplexVectorSpace1DStrategy } from "./ProjectiveComplexVectorSpace1DStrategy";
import type { ComplexDesc, ComplexWeightDesc } from "./VectorDescriptorConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";
import { DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME } from "../namedConstants/DefaultVectorSpaces";
import { PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME } from "../namedConstants/VectorSpaceResolvers";
import { resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { INITIAL_VECTOR_SPACE_ID } from "../namedConstants/VectorSpaceIdentifierManager";
import { createComplexVector1DDescriptor, createComplexWeightDescriptor, createProjectiveComplexVector1DDescriptor } from "./VectorDescriptorFactory";
import type { ProjectiveComplexVectorSpaceStrategy } from "./interfaces/VectorSpaceStrategyInterfaces";
import type { IdentifiableVectorSpace, ProjectiveComplexVectorSpaceInterface } from "./interfaces/VectorSpaceInterfaces";
import type { ProjectiveComplexVectorOfDimension } from "./conditionalTypes/VectorDescriptorTypes";
import type { ComplexVector1D, ProjectiveComplexVectorDesc, VectorDesc } from "./utilityTypes/VectorDescriptorTypes";


export class ProjectiveComplexVectorSpace<D extends number = number, PCVD extends ProjectiveComplexVectorDesc = ProjectiveComplexVectorOfDimension<D>> implements ProjectiveComplexVectorSpaceInterface<D, PCVD> {

    private static readonly _spaceType = VectorSpaceType.PROJECTIVECOMPLEX as const;
    private readonly _id: string;
    private readonly _name: string;
    private readonly _isDefault: boolean;
    private readonly weightManager: WeightManager;
    private readonly dim: D;
    protected readonly strategy: ProjectiveComplexVectorSpaceStrategy<D, PCVD>;
    protected readonly _weightManagement: WeightManagement;

    constructor(dimension: D);
    constructor(dimension: D, isDefault: boolean);
    constructor(dimension: D, weightManagement: WeightManagement);
    constructor(dimension: D, weightManagement?: WeightManagement, isDefault?: boolean);
    constructor(dimension: D, weightManagement?: WeightManagement, isDefault?: boolean, name?: string);
    constructor(dimension: D, isDefltOrWeightMgmt?: boolean | WeightManagement, isDefault?: boolean, name?: string) {
        this.dim = dimension;
        if(typeof isDefltOrWeightMgmt === 'string') {
            this._weightManagement = isDefltOrWeightMgmt;
        } else if(typeof isDefltOrWeightMgmt === 'boolean') {
            isDefault = isDefltOrWeightMgmt;
            this._weightManagement = WeightManagement.AllStrictlyPositiveWeights;
        } else {
            this._weightManagement = WeightManagement.AllStrictlyPositiveWeights;
        }
        if(isDefault === undefined) isDefault = false;
        this.weightManager = new WeightManager(this._weightManagement);
        this._isDefault = isDefault;
        this._id = INITIAL_VECTOR_SPACE_ID;
        if(this._isDefault) {  
            this._id = resolveDefaultVectorSpace(this);
            this._name = DEFAULT_PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        } else {
            this._id = resolveVectorSpace(this);
            this._name = name || PROJECTIVE_COMPLEX_VECTOR_SPACE_NAME + dimension.toString();
        }
        switch (this.dim) {
            case MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE:
                this.strategy = new ProjectiveComplexVectorSpace1DStrategy() as unknown as ProjectiveComplexVectorSpaceStrategy<D, PCVD>;
                break;
            default:
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
        }
        if (dimension < MIN_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVECOMPLEXVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get isDefault(): boolean { return this._isDefault; }
    get spaceType(): VectorSpaceType.PROJECTIVECOMPLEX { return ProjectiveComplexVectorSpace._spaceType; }

    get weightManagement(): WeightManagement {
        return this._weightManagement;
    }

    // Identity methods
    isSameSpace(other: IdentifiableVectorSpace<VectorDesc>): boolean {
        return this._id === other.id;
    }

    isIsomorphicTo(other: IdentifiableVectorSpace<VectorDesc>): boolean {
        return this.spaceType === other.spaceType && 
               this.dimension() === other.dimension();
    }

    dimension() {
        return this.dim;
    }

    // There is currently only one vector space dimension, so these methods are not neccessary yet
    // areSameDimension(v1: ProjectiveComplexVector, v2: ProjectiveComplexVector): boolean {
    //     if(isVector2D(v1) && isVector2D(v2)) return true;
    //     return false;
    // }

    isInVectorSpace(v: ProjectiveComplexVectorDesc): v is ProjectiveComplexVectorDesc {
        return this.strategy.isInVectorSpace(v);
    }

    shareSameWeightManagement(v1: ProjectiveComplexVectorDesc, v2: ProjectiveComplexVectorDesc): boolean {
        // not required with only one dimension of projective complex vector space
        // if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
        if(this.hasSameRealImagineryWeightManagement(v1) && this.hasSameRealImagineryWeightManagement(v2)) {
            try {
                return this.strategy.shareSameWeightManagement(v1, v2, this.weightManager);
            } catch(error) {
                if(!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
                    throw new RangeError(error.generateMessageString());
                }
                const message = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
                throw new RangeError(message.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
        // } else {
        //     if(!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
        //         const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE);
        //         throw new RangeError(error.generateMessageString());
        //     }
        //     const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
        //     throw new RangeError(error.generateMessageString());
        // }
    }

    hasSameRealImagineryWeightManagement(v: ProjectiveComplexVectorDesc): boolean {
        const realWeight = v.coordinates[1].real;
        const imaginaryWeight = v.coordinates[1].imaginary;
        return realWeight.strictlyPositive === imaginaryWeight.strictlyPositive;
    }

    defaultVect(): PCVD {
        const nullComplex: ComplexDesc = createComplexVector1DDescriptor();
        const defaultComplexWeight: ComplexWeightDesc = createComplexWeightDescriptor(new Weight(), new Weight());
        return createProjectiveComplexVector1DDescriptor(nullComplex, defaultComplexWeight) as unknown as PCVD;
    }

    createVector(coordinates: readonly (readonly number[])[]): PCVD {
        const complex1: ComplexDesc = createComplexVector1DDescriptor(coordinates[0][0], coordinates[0][1]);
        if(coordinates.length !== this.dim) {
            const message = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message.generateMessageString());
        }
        if(this.weightManager.weightManagement === WeightManagement.AllPositiveWeights || (this.weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[1][0] === 0)) {
            const complexWeightDescriptor: ComplexWeightDesc = createComplexWeightDescriptor(this.weightManager.createWeightFromValueOnly(coordinates[1][0]), this.weightManager.createWeightFromValueOnly(coordinates[1][1]));
            const vector: ProjectiveComplexVectorDesc = createProjectiveComplexVector1DDescriptor(complex1, complexWeightDescriptor);
            return vector as unknown as PCVD;
        } else {
            const complexWeightDescriptor: ComplexWeightDesc = createComplexWeightDescriptor(this.weightManager.createWeightFromValueOnly(coordinates[1][0]), this.weightManager.createWeightFromValueOnly(coordinates[1][1]));
            const vector: ProjectiveComplexVectorDesc = createProjectiveComplexVector1DDescriptor(complex1, complexWeightDescriptor);
            return vector as unknown as PCVD;
        }
    }

    addDescriptors(a: PCVD, b: PCVD): PCVD {
        if(this.hasSameRealImagineryWeightManagement(a) && this.hasSameRealImagineryWeightManagement(b)) {
            try {
                return this.strategy.addDescriptors(a, b, this.weightManager);
            } catch (error) {
                if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && (!a.coordinates[1].real.strictlyPositive || !b.coordinates[1].real.strictlyPositive)) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'addDescriptors', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                    throw new RangeError(error.generateMessageString());
                }
                if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                    const message1 = sendRangeErrorMessage(this.constructor.name, 'addDescriptors', EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
                    throw new RangeError(message1.generateMessageString());
                }
                const message2 = sendRangeErrorMessage(this.constructor.name, 'addDescriptors', EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
                throw new RangeError(message2.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'addDescriptors', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    normDescriptor(v: PCVD): number {
        try { 
            return this.strategy.normDescriptor(v);
        } catch (error) {
            const message1 = sendRangeErrorMessage(this.constructor.name, 'normDescriptor', EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(message1.generateMessageString());
        }
    }

    scaleDescriptor(scaleFactor: ComplexDesc, vector: PCVD): PCVD;
    scaleDescriptor(scaleFactor: number, vector: PCVD): PCVD;
    scaleDescriptor(scaleFactor: ComplexDesc | number, vector: PCVD): PCVD {
        if(!this.hasSameRealImagineryWeightManagement(vector)) {
            const error = sendRangeErrorMessage(this.constructor.name, 'scaleDescriptor', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
        try {
            return this.strategy.scaleDescriptor(scaleFactor, vector, this.weightManager);
        } catch(error) {
            if(typeof scaleFactor === 'number') {
                const error = sendRangeErrorMessage(this.constructor.name, 'scaleDescriptor', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                throw new RangeError(error.generateMessageString());
            } else if(!this.isInVectorSpace(vector)) {
                const message = sendRangeErrorMessage(this.constructor.name, 'scaleDescriptor', EM_COMPLEXVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(message.generateMessageString());
            } else if(error instanceof RangeError && error.message.includes(EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL)) {
                const message = sendRangeErrorMessage(this.constructor.name, 'scaleDescriptor', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
                throw new RangeError(message.generateMessageString());
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'scaleDescriptor', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                throw new RangeError(error.generateMessageString());
            }
        }
    }

    subtractDescriptors(a: PCVD, b: PCVD): PCVD {
        if(this.hasSameRealImagineryWeightManagement(a) && this.hasSameRealImagineryWeightManagement(b)) {
            try {
                return this.strategy.subtractDescriptors(a, b, this.weightManager);
            } catch (error) {
                if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && 
                    ((!a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive) || 
                    (a.coordinates[1].real.strictlyPositive && !b.coordinates[1].real.strictlyPositive) ||
                    (!a.coordinates[1].real.strictlyPositive && !b.coordinates[1].real.strictlyPositive))) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                    throw new RangeError(error.generateMessageString());
                } else if(this._weightManagement === WeightManagement.AllPositiveWeights &&
                    ((!a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive) || 
                    (a.coordinates[1].real.strictlyPositive && !b.coordinates[1].real.strictlyPositive) ||
                    (a.coordinates[1].real.strictlyPositive && b.coordinates[1].real.strictlyPositive))) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLPOS);
                    throw new RangeError(error.generateMessageString());
                }
                if(error instanceof RangeError && error.message.includes(EM_WEIGHT_SUBTRACTION_ERROR) && a.coordinates[1].real.value < b.coordinates[1].real.value &&
                    a.coordinates[1].imaginary.value < b.coordinates[1].imaginary.value) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL_IMAGINERY);
                    throw new RangeError(error.generateMessageString());
                } else if(error instanceof RangeError && error.message.includes(EM_WEIGHT_SUBTRACTION_ERROR) && a.coordinates[1].real.value < b.coordinates[1].real.value) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_REAL);
                    throw new RangeError(error.generateMessageString());
                } else if(error instanceof RangeError && error.message.includes(EM_WEIGHT_SUBTRACTION_ERROR) && a.coordinates[1].imaginary.value < b.coordinates[1].imaginary.value) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_COMPLEXWEIGHT_SUBTRACT_NEGATIVE_IMAGINERY);
                    throw new RangeError(error.generateMessageString());
                }
                if(!this.isInVectorSpace(a) && !this.isInVectorSpace(b)) {
                    const message1 = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_PROJECTIVECOMPLEXVECTORS_NOT_IN_VECTORSPACE);
                    throw new RangeError(message1.generateMessageString());
                } else if(this._weightManagement === WeightManagement.AllStrictlyPositiveWeights && this.isInVectorSpace(a) && this.isInVectorSpace(b)
                    && error instanceof RangeError && error.message.includes(EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS)) {
                    const message3 = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS);
                    throw new RangeError(message3.generateMessageString());
                } else if(error instanceof RangeError && error.message.includes(EM_WEIGHT_SUBTRACTION_ERROR)) {
                    const message4 = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_PROJECTIVECOMPLEXVECTOR_WITH_NEGATIVE_WEIGHT);
                    throw new RangeError(message4.generateMessageString());
                }
                const message2 = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_PROJECTIVECOMPLEXVECTORS_DIFFERENT_DIM);
                throw new RangeError(message2.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'subtractDescriptors', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    cloneVector(vector: PCVD): PCVD {
        if(this.hasSameRealImagineryWeightManagement(vector)) {
            try {
                return this.strategy.cloneVector(vector, this.weightManager);
            } catch (error) {
                const message = sendRangeErrorMessage(this.constructor.name, 'cloneVector', EM_PROJECTIVECOMPLEXVECTORSPACE_DIMENSION_OUT_RANGE)
                throw new RangeError(message.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'cloneVector', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }

    toString(): string {
        return `${this._name} [ID: ${this._id}]`;
    }

    fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector: PCVD): ComplexVector1D {
        if(this.hasSameRealImagineryWeightManagement(vector)) {
            try {
                return this.strategy.fromProjectiveComplexVectorSpaceToComplexVectorSpace(vector, this.weightManager);
            } catch (error) {
                if(vector.coordinates[1].real.value === 0 && this.weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                    throw new RangeError(error.generateMessageString());
                } else if(vector.coordinates[1].imaginary.value === 0 && this.weightManagement === WeightManagement.AllStrictlyPositiveWeights) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_COMPLEXWEIGHT_MANAGEMENT_INCOMPATIBLE_ALLSTRICTPOS);
                    throw new RangeError(error.generateMessageString());
                }
                const message = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_PROJECTIVECOMPLEXVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(message.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveComplexVectorSpaceToComplexVectorSpace', EM_REAL_IMAGINARY_WEIGHT_MANAGEMENT_DIFFER);
            throw new RangeError(error.generateMessageString());
        }
    }
}