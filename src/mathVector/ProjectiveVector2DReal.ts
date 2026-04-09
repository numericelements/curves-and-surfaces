import { EM_INCOMPATIBLE_WEIGHT_MANAGEMENT, EM_WEIGHT_TOO_SMALL } from "../ErrorMessages/ProjectiveVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { PROJECTIVEREALVECTOR2D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractProjectiveRealVector } from "./AbstractProjectiveRealVector";
import { Complex } from "./Complex";
import { ComplexWeight } from "./ComplexWeight";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import type { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DComplex } from "./ProjectiveVector1DComplex";
import { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { Vector } from "./interfaces/VectorInterfaces";
import { Vector2DReal } from "./Vector2DReal";
import { cloneDescriptorProjectiveRealVector2D, createProjectiveRealVector2DDescriptor } from "./VectorDescriptorFactory";
import type { ProjectiveRealVector2D } from "./VectorDescriptorConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class ProjectiveVector2DReal extends AbstractProjectiveRealVector<3, ProjectiveRealVector2D> 
     implements Vector<3, ProjectiveRealVector2D>
{

    private static readonly DIMENSION = 3 as const;
    private static readonly _vectorType = PROJECTIVEREALVECTOR2D;
    private readonly _descriptor: ProjectiveRealVector2D;
    protected readonly _vectorSpace: ProjectiveRealVectorSpace<3, ProjectiveRealVector2D>;
    
    constructor();
    constructor(vectorSpace: ProjectiveRealVectorSpace<3>);
    constructor(x: number, y: number, weight: Weight, vectorSpace?: ProjectiveRealVectorSpace<3>);
    constructor(x: number, y: number, vectorSpace?: ProjectiveRealVectorSpace<3>);

    constructor(xOrVectorSpace?: number | ProjectiveRealVectorSpace<3>, y?: number, weightOrVSpace?: Weight | ProjectiveRealVectorSpace<3>, vectorSpace?: ProjectiveRealVectorSpace<3>) {
        super();
        let strictlyPosWeight = true;
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this._descriptor = createProjectiveRealVector2DDescriptor(0, 0, new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight));
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof ProjectiveRealVectorSpace && y === undefined) {
            super.checkVectorSpaceDimensionConsistency(ProjectiveVector2DReal.DIMENSION, xOrVectorSpace);
            this._vectorSpace = xOrVectorSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this._descriptor = createProjectiveRealVector2DDescriptor(0, 0, new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight));
            return;
        }

        // Case 3: all coordinates and weight with optional vectorSpace
        if (typeof xOrVectorSpace === 'number' && typeof y === 'number' && weightOrVSpace instanceof Weight) {
            super.checkVectorSpaceConsistency(ProjectiveVector2DReal.DIMENSION, vectorSpace);
            strictlyPosWeight = this.checkValidityWeightStatus(weightOrVSpace, vectorSpace as ProjectiveRealVectorSpace<3>);
            this._descriptor = createProjectiveRealVector2DDescriptor(xOrVectorSpace, y!, weightOrVSpace);
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
            return;
        }
        
        // Case 4: all coordinates with default Weight and with optional vectorSpace
        if((typeof xOrVectorSpace !== 'number' || typeof y !== 'number')) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        if (!(weightOrVSpace instanceof Weight) && vectorSpace === undefined) {
            super.checkVectorSpaceConsistency(ProjectiveVector2DReal.DIMENSION, weightOrVSpace);
            this._vectorSpace = weightOrVSpace ?? this.getDefaultVectorSpace();
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this._descriptor = createProjectiveRealVector2DDescriptor(xOrVectorSpace, y!, new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight));
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    private getDefaultVectorSpace(): ProjectiveRealVectorSpace<3> {
        try{
            return getDefaultVectorSpace(this.spaceType, ProjectiveVector2DReal.DIMENSION);
        } catch(error) {
            return new ProjectiveRealVectorSpace(ProjectiveVector2DReal.DIMENSION, true);
        }
    }

    get dimension(): 3 { return ProjectiveVector2DReal.DIMENSION; }
    get vectorType(): string { return ProjectiveVector2DReal._vectorType; }
    get vectorSpace(): ProjectiveRealVectorSpace<3, ProjectiveRealVector2D> { return this._vectorSpace; }
    get coordinates(): readonly number[] { return this.homogeneousCoordinates; }
    get descriptor(): ProjectiveRealVector2D { return cloneDescriptorProjectiveRealVector2D(this._descriptor); }

    get weight(): Weight {
        return this._descriptor.coordinates[2].weight;
    }
    
    get homogeneousCoordinates(): readonly number[] {
        return [this._descriptor.coordinates[0], this._descriptor.coordinates[1], this.weight.value];
    }
    
    getCoordinate(index: number): number {
        if (index === ProjectiveVector2DReal.DIMENSION - 1) {
            return this._descriptor.coordinates[2].weight.value;
        } else if(index === 0 || index === 1) {
            return this._descriptor.coordinates[index];
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    homogeneousTransform(tolerance?: number): this {
        if(tolerance === undefined) tolerance = NULL_WEIGHT_TOLERANCE;
        if(this.weight.value < tolerance) {
            const error = sendRangeErrorMessage(this.constructor.name, 'homogeneousTransform', EM_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const normalizedCoord = this.applyHomogeneousTransformation(tolerance);
        const newDescriptor: ProjectiveRealVector2D = createProjectiveRealVector2DDescriptor(normalizedCoord[0], normalizedCoord[1], new Weight(DEFAULT_WEIGHT_VALUE, this.weight.strictlyPositive));
        return this.createVectorFromDescriptor(newDescriptor);
    }

    add(other: ProjectiveVector2DReal): this {
        const result = super.add(other);
        const weight = result.descriptor.coordinates[2].weight;
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: ProjectiveVector2DReal): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    scale(factor: number): this {
        const result = super.scale(factor);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    toString(): string {
        return this.vectorType + `(${this._descriptor.coordinates[0]}, ${this._descriptor.coordinates[1]}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }

    equals(other: ProjectiveVector2DReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: ProjectiveVector2DReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: ProjectiveVector2DReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }

    toRealVector(vectorSpace?: RealVectorSpace<2>): Vector2DReal {
        let vSpace = vectorSpace;
        if(vSpace === undefined) {
            try{
                vSpace = getDefaultVectorSpace(VectorSpaceType.REAL, 2);
            } catch(error) {
                vSpace = new RealVectorSpace(2, true);
            }
        }
        try {
            const normalized = this.homogeneousTransform();
            return new Vector2DReal(
                normalized._descriptor.coordinates[0],
                normalized._descriptor.coordinates[1],
                vSpace
            );
        } catch (error) {
            return new Vector2DReal(
                this._descriptor.coordinates[0],
                this._descriptor.coordinates[1],
                vSpace
            );
        }
    }


    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<2>): ProjectiveVector1DComplex {
        if( projectiveComplexVectorSpace !== undefined) {
            if(projectiveComplexVectorSpace.weightManagement === WeightManagement.AllPositiveWeights
                && this._vectorSpace.weightManagement === projectiveComplexVectorSpace.weightManagement) {
                return new ProjectiveVector1DComplex(new Complex(this._descriptor.coordinates[0], this._descriptor.coordinates[1]), new ComplexWeight( new Weight(this.weight.value, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
            } else if(this._vectorSpace.weightManagement === projectiveComplexVectorSpace.weightManagement ) {
                let realWeight = new Weight(this.weight.value, false);
                if(this._vectorSpace.weightManagement === WeightManagement.AllStrictlyPositiveWeights 
                    || this.weight.strictlyPositive) realWeight = new Weight(this.weight.value, true);
                return new ProjectiveVector1DComplex(new Complex(this._descriptor.coordinates[0], this._descriptor.coordinates[1]), new ComplexWeight( realWeight, new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveComplexVector', EM_INCOMPATIBLE_WEIGHT_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
            return new ProjectiveVector1DComplex(new Complex(this._descriptor.coordinates[0], this._descriptor.coordinates[1]), new ComplexWeight( new Weight(this.weight.value, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
        }
        return new ProjectiveVector1DComplex(new Complex(this._descriptor.coordinates[0], this._descriptor.coordinates[1]), new ComplexWeight( new Weight(this.weight.value, true), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
    }
    
    clone(): this {
        let strictlyPosWeight = true;
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
        if(this._vectorSpace.weightManagement === WeightManagement.SomeNullWeights) strictlyPosWeight = this.weight.strictlyPositive;
        return new ProjectiveVector2DReal(
            this._descriptor.coordinates[0],
            this._descriptor.coordinates[1],
            new Weight(this.weight.value, strictlyPosWeight),
            this._vectorSpace
        ) as this;
    }

    createVectorFromDescriptor(descriptor: ProjectiveRealVector2D): this {
        return new ProjectiveVector2DReal(descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2].weight, this.vectorSpace) as this;
    }
}