import { EM_INCOMPATIBLE_WEIGHT_MANAGEMENT, EM_WEIGHT_TOO_SMALL } from "../ErrorMessages/ProjectiveVectors";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { NULL_WEIGHT_TOLERANCE, WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { PROJECTIVEVECTOR2D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { WEIGHT } from "../namedConstants/WeightTypeTags";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { Complex } from "./Complex";
import { ComplexWeight } from "./ComplexWeight";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DTypeComplex } from "./ProjectiveVector1DTypeComplex";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { IVector } from "./Vector";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import type { ProjectiveVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class ProjectiveVector2DTypeReal extends AbstractProjectiveVector<3> 
     implements IVector<3, ProjectiveVector2D>
{

    private static readonly DIMENSION = 3 as const;
    private static readonly _vectorType = PROJECTIVEVECTOR2D;
    private readonly _descriptor: ProjectiveVector2D;
    protected readonly _vectorSpace: ProjectiveVectorSpace<3>;
    
    constructor();
    constructor(vectorSpace: ProjectiveVectorSpace<3>);
    constructor(x: number, y: number, weight: Weight, vectorSpace?: ProjectiveVectorSpace<3>);
    constructor(x: number, y: number, vectorSpace?: ProjectiveVectorSpace<3>);

    constructor(xOrVectorSpace?: number | ProjectiveVectorSpace<3>, y?: number, weightOrVSpace?: Weight | ProjectiveVectorSpace<3>, vectorSpace?: ProjectiveVectorSpace<3>) {
        super();
        let strictlyPosWeight = true;
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this._descriptor = { type: PROJECTIVEVECTOR2D, coordinates: [0, 0,  { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof ProjectiveVectorSpace && y === undefined) {
            super.checkVectorSpaceDimensionConsistency(ProjectiveVector2DTypeReal.DIMENSION, xOrVectorSpace);
            this._vectorSpace = xOrVectorSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this._descriptor = { type: PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] };
            return;
        }

        // Case 3: all coordinates and weight with optional vectorSpace
        if (typeof xOrVectorSpace === 'number' && typeof y === 'number' && weightOrVSpace instanceof Weight) {
            super.checkVectorSpaceConsistency(ProjectiveVector2DTypeReal.DIMENSION, vectorSpace);
            strictlyPosWeight = this.checkValidityWeightStatus(weightOrVSpace, vectorSpace as ProjectiveVectorSpace<3>);
            this._descriptor = { 
                type: PROJECTIVEVECTOR2D, 
                coordinates: [xOrVectorSpace, y!, { type: WEIGHT, weight: weightOrVSpace }] 
            };
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
            return;
        }
        
        // Case 4: all coordinates with default Weight and with optional vectorSpace
        if((typeof xOrVectorSpace !== 'number' || typeof y !== 'number')) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        if (!(weightOrVSpace instanceof Weight) && vectorSpace === undefined) {
            super.checkVectorSpaceConsistency(ProjectiveVector2DTypeReal.DIMENSION, weightOrVSpace);
            this._vectorSpace = weightOrVSpace ?? this.getDefaultVectorSpace();
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this._descriptor = { 
                type: PROJECTIVEVECTOR2D, 
                coordinates: [xOrVectorSpace, y!, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] 
            };
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
    }

    private getDefaultVectorSpace(): ProjectiveVectorSpace<3> {
        try{
            return getDefaultVectorSpace(this.spaceType, ProjectiveVector2DTypeReal.DIMENSION);
        } catch(error) {
            return new ProjectiveVectorSpace(ProjectiveVector2DTypeReal.DIMENSION, true);
        }
    }

    get dimension(): number { return ProjectiveVector2DTypeReal.DIMENSION; }
    get vectorType(): string { return ProjectiveVector2DTypeReal._vectorType; }
    get vectorSpace(): ProjectiveVectorSpace<3> { return this._vectorSpace; }
    get coordinates(): number[] { return this.homogeneousCoordinates; }
    get descriptor(): ProjectiveVector2D { return { ...this._descriptor }; }

    get weight(): Weight {
        return this._descriptor.coordinates[2].weight;
        // return this._descriptor.coordinates[2] instanceof Weight 
        //     ? this._descriptor.coordinates[2]
        //     : this._weight;
    }

    // get weightManagement(): WeightManagement {
    //     return this._vectorSpace.weightManagement;
    // }
    
    get homogeneousCoordinates(): number[] {
        return [this._descriptor.coordinates[0], this._descriptor.coordinates[1], this.weight.value];
    }
    
    getCoordinate(index: number): number {
        if (index === ProjectiveVector2DTypeReal.DIMENSION - 1) {
            return this._descriptor.coordinates[2].weight.value;
        } else if(index === 0 || index === 1) {
            return this._descriptor.coordinates[index];
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    homogeneousTransform(tolerance?: number): ProjectiveVector2DTypeReal {
        if(tolerance === undefined) tolerance = NULL_WEIGHT_TOLERANCE;
        if(this.weight.value < tolerance) {
            const error = sendRangeErrorMessage(this.constructor.name, 'homogeneousTransform', EM_WEIGHT_TOO_SMALL);
            throw new RangeError(error.generateMessageString());
        }
        const normalizedCoord = this.applyHomogeneousTransformation(tolerance);
        return new ProjectiveVector2DTypeReal(normalizedCoord[0], normalizedCoord[1], this._vectorSpace);
    }

    add(other: ProjectiveVector2DTypeReal): this {
        const result = super.add(other);
        const weight = result.descriptor.coordinates[2].weight;
        // return new ProjectiveVector2DTypeReal(result.coordinates[0], result.coordinates[1], weight, this._vectorSpace);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: ProjectiveVector2DTypeReal): this {
        const result = super.subtract(other);
        // return new ProjectiveVector2DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).weight, this._vectorSpace);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    scale(factor: number): this {
        // return new ProjectiveVector2DTypeReal(super.scale(factor).coordinates[0], super.scale(factor).coordinates[1], super.scale(factor).weight, this._vectorSpace);
        const result = super.scale(factor);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    toString(): string {
        return this.vectorType + `(${this._descriptor.coordinates[0]}, ${this._descriptor.coordinates[1]}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }

    equals(other: ProjectiveVector2DTypeReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: ProjectiveVector2DTypeReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: ProjectiveVector2DTypeReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }

    toRealVector(vectorSpace?: RealVectorSpace<2>): Vector2DTypeReal {
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
            return new Vector2DTypeReal(
                normalized._descriptor.coordinates[0],
                normalized._descriptor.coordinates[1],
                vSpace
            );
        } catch (error) {
            return new Vector2DTypeReal(
                this._descriptor.coordinates[0],
                this._descriptor.coordinates[1],
                vSpace
            );
        }
    }


    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<2>): ProjectiveVector1DTypeComplex {
        if( projectiveComplexVectorSpace !== undefined) {
            if(projectiveComplexVectorSpace.weightManagement === WeightManagement.AllPositiveWeights
                && this._vectorSpace.weightManagement === projectiveComplexVectorSpace.weightManagement) {
                return new ProjectiveVector1DTypeComplex(new Complex(this._descriptor.coordinates[0], this._descriptor.coordinates[1]), new ComplexWeight( new Weight(this.weight.value, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
            } else if(this._vectorSpace.weightManagement === projectiveComplexVectorSpace.weightManagement ) {
                let realWeight = new Weight(this.weight.value, false);
                if(this._vectorSpace.weightManagement === WeightManagement.AllStrictlyPositiveWeights 
                    || this.weight.strictlyPositive) realWeight = new Weight(this.weight.value, true);
                return new ProjectiveVector1DTypeComplex(new Complex(this._descriptor.coordinates[0], this._descriptor.coordinates[1]), new ComplexWeight( realWeight, new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveComplexVector', EM_INCOMPATIBLE_WEIGHT_MANAGEMENT);
            throw new RangeError(error.generateMessageString());
        }
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
            return new ProjectiveVector1DTypeComplex(new Complex(this._descriptor.coordinates[0], this._descriptor.coordinates[1]), new ComplexWeight( new Weight(this.weight.value, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
        }
        return new ProjectiveVector1DTypeComplex(new Complex(this._descriptor.coordinates[0], this._descriptor.coordinates[1]), new ComplexWeight( new Weight(this.weight.value, true), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
    }
    
    clone(): this {
        let strictlyPosWeight = true;
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
        if(this._vectorSpace.weightManagement === WeightManagement.SomeNullWeights) strictlyPosWeight = this.weight.strictlyPositive;
        return new ProjectiveVector2DTypeReal(
            this._descriptor.coordinates[0],
            this._descriptor.coordinates[1],
            new Weight(this.weight.value, strictlyPosWeight),
            this._vectorSpace
        ) as this;
    }

    createVectorFromDescriptor(descriptor: ProjectiveVector2D): this {
        return new ProjectiveVector2DTypeReal(descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2].weight, this.vectorSpace) as this;
    }
}