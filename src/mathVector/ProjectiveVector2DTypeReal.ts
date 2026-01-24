import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { PROJECTIVEVECTOR2D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { WEIGHT } from "../namedConstants/WeightTypeTags";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import type { ProjectiveVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 3;

export class ProjectiveVector2DTypeReal extends AbstractProjectiveVector<3> {
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
        if(xOrVectorSpace instanceof ProjectiveVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this._descriptor = { type: PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] };
            return;
        }

        // Case 3: all coordinates and weight with optional vectorSpace
        if (weightOrVSpace instanceof Weight) {
            strictlyPosWeight = this.checkValidityWeightStatus(weightOrVSpace as Weight, vectorSpace as ProjectiveVectorSpace<3>);
            this._descriptor = { 
                type: PROJECTIVEVECTOR2D, 
                coordinates: [xOrVectorSpace, y!, { type: WEIGHT, weight: weightOrVSpace }] 
            };
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
            return;
        }
        
        // Case 4: all coordinates with optional vectorSpace
        this._vectorSpace = weightOrVSpace ?? this.getDefaultVectorSpace();;
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
        this._descriptor = { 
            type: PROJECTIVEVECTOR2D, 
            coordinates: [xOrVectorSpace, y!, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] 
        };
    }

    private getDefaultVectorSpace(): ProjectiveVectorSpace<3> {
        try{
            return getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveVectorSpace<3>;
        } catch(error) {
            return new ProjectiveVectorSpace(this.dimension, true) as ProjectiveVectorSpace<3>;
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }

    get vectorSpace(): ProjectiveVectorSpace<3> { return this._vectorSpace; }

    get vectorType(): string { return PROJECTIVEVECTOR2D; }

    get coordinates(): number[] { return this.homogeneousCoordinates; }

    get descriptor(): ProjectiveVector2D { return { ...this._descriptor }; }

    get weight(): Weight {
        return this._descriptor.coordinates[2].weight;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this._descriptor.coordinates[0], this._descriptor.coordinates[1], this.weight.value];
    }
    
    getCoordinate(index: number): number {
        if (index === SPACE_DIMENSION - 1) {
            return this._descriptor.coordinates[2].weight.value;
        } else if(index === 0 || index === 1) {
            return this._descriptor.coordinates[index];
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    add(other: ProjectiveVector2DTypeReal): ProjectiveVector2DTypeReal {
        const result = super.add(other) as ProjectiveVector2DTypeReal;
        const weight = result.descriptor.coordinates[2].weight;
        return new ProjectiveVector2DTypeReal(result.coordinates[0], result.coordinates[1], weight, this._vectorSpace);
    }

    subtract(other: ProjectiveVector2DTypeReal): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).weight, this._vectorSpace);
    }

    scale(factor: number): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(super.scale(factor).coordinates[0], super.scale(factor).coordinates[1], super.scale(factor).weight, this._vectorSpace);
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
    
    // toRealVector(realVSpace?: RealVectorSpace<2>): Vector2DTypeReal {
    //     const realCoord = this.applyHomogeneousTransformation();
    //     if (realVSpace !== undefined) {
    //         return new Vector2DTypeReal(realCoord[0], realCoord[1], realVSpace);
    //     }
    //     return new Vector2DTypeReal(realCoord[0], realCoord[1]);
    // }
    
    clone(): ProjectiveVector2DTypeReal {
        let strictlyPosWeight = true;
        if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
        if(this._vectorSpace.weightManagement === WeightManagement.SomeNullWeights) strictlyPosWeight = this.weight.strictlyPositive;
        return new ProjectiveVector2DTypeReal(
            this._descriptor.coordinates[0],
            this._descriptor.coordinates[1],
            new Weight(this.weight.value, strictlyPosWeight),
            this._vectorSpace
        );
    }

    createVectorFromDescriptor(descriptor: ProjectiveVector2D): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2].weight, this.vectorSpace);
    }
}