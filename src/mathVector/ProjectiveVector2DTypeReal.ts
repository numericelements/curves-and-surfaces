import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { PROJECTIVEVECTOR2D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { WEIGHT } from "../namedConstants/WeightTypeTags";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { ProjectiveVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 3;

export class ProjectiveVector2DTypeReal extends AbstractProjectiveVector {
    private data: ProjectiveVector2D;
    protected _vectorSpace: ProjectiveVectorSpace<3>;
    
    constructor();
    constructor(x: number, y: number);
    constructor(x: number, y: number, weight: Weight, vectorSpace?: ProjectiveVectorSpace<3>);
    constructor(x: number, y: number, vectorSpace?: ProjectiveVectorSpace<3>);
    constructor(vectorSpace: ProjectiveVectorSpace<3>);
    constructor(xOrVectorSpace?: number | ProjectiveVectorSpace<3>, y?: number, weightOrVSpace?: Weight | ProjectiveVectorSpace<3>, vectorSpace?: ProjectiveVectorSpace<3>) {
        super();
        let strictlyPosWeight = true;
        if(xOrVectorSpace instanceof ProjectiveVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            this.data = { type: PROJECTIVEVECTOR2D, coordinates: [0, 0, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] };
            return;
        } else if (weightOrVSpace instanceof ProjectiveVectorSpace) {
            this._vectorSpace = weightOrVSpace;
            if(this._vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) strictlyPosWeight = false;
            const x = xOrVectorSpace ?? 0;
            this.data = { 
                type: PROJECTIVEVECTOR2D, 
                coordinates: [x, y ?? 0, { type: WEIGHT, weight: new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] 
            };
            return;
        } else {
            strictlyPosWeight = this.checkValidityWeightStatus(weightOrVSpace as Weight, vectorSpace as ProjectiveVectorSpace<3>);
            const x = xOrVectorSpace ?? 0;
            this.data = { 
                type: PROJECTIVEVECTOR2D, 
                coordinates: [x, y ?? 0, { type: WEIGHT, weight: weightOrVSpace ?? new Weight(DEFAULT_WEIGHT_VALUE, strictlyPosWeight) }] 
            };
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveVectorSpace<3>;
            }
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }

    get vectorType(): string { return PROJECTIVEVECTOR2D; }

    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVE; }

    get coordinates(): number[] { return this.homogeneousCoordinates; }

    get descriptor(): ProjectiveVector2D { return { ...this.data }; }

    get weight(): Weight {
        return this.data.coordinates[2].weight;
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0], this.data.coordinates[1], this.weight.value];
    }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        if (index === SPACE_DIMENSION - 1) return this.data.coordinates[2].weight.value;
        return this.data.coordinates[index] as number;
    }

    add(other: ProjectiveVector2DTypeReal): ProjectiveVector2DTypeReal {
        // return super.add(other) as ProjectiveVector2DTypeReal;
        const result = super.add(other) as ProjectiveVector2DTypeReal;
        const weight = result.descriptor.coordinates[2].weight;
        return new ProjectiveVector2DTypeReal(result.coordinates[0], result.coordinates[1], weight, this._vectorSpace) as ProjectiveVector2DTypeReal;
    }

    subtract(other: ProjectiveVector2DTypeReal): ProjectiveVector2DTypeReal {
        // return super.subtract(other) as ProjectiveVector2DTypeReal;
        return new ProjectiveVector2DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).weight, this._vectorSpace) as ProjectiveVector2DTypeReal;
    }

    scale(factor: number): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(super.scale(factor).coordinates[0], super.scale(factor).coordinates[1], super.scale(factor).weight, this._vectorSpace) as ProjectiveVector2DTypeReal;
    }

    toString(): string {
        return this.vectorType + `(${this.data.coordinates[0]}, ${this.data.coordinates[1]}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
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
            this.data.coordinates[0],
            this.data.coordinates[1],
            new Weight(this.weight.value, strictlyPosWeight),
            this._vectorSpace
        );
    }

    // static fromRaw(raw: ProjectiveVector2D): ProjectiveVector2DTypeReal {
    //     return new ProjectiveVector2DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2].weight);
    // }
}