import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE, EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractProjectiveVector } from "./AbstractProjectiveVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { PROJECTIVEVECTOR2D, ProjectiveVector2D, WEIGHT } from "./VectorSpaceConstructorInterface";
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
            if(vectorSpace !== undefined && vectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                if(weightOrVSpace !== undefined && weightOrVSpace.strictlyPositive) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
                    throw new RangeError(error.generateMessageString());
                }
                strictlyPosWeight = false;
            }
            const x = xOrVectorSpace ?? 0;
            if(vectorSpace !== undefined) {
                // When the vector space is explicitly defined and its weight management restricted to stricly positive, the weight must be effectively strictly positive
                if(vectorSpace.weightManagement === WeightManagement.AllStrictlyPositiveWeights && weightOrVSpace !== undefined && !weightOrVSpace.strictlyPositive) {
                    const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
                    throw new RangeError(error.generateMessageString());
                }
            } else if(weightOrVSpace !== undefined && !weightOrVSpace.strictlyPositive) {
                // When the vector space is not explicitly defined and
                // the weight is explicitly defined as not strictly positive, the weight must be effectively strictly positive 
                // since the weight management is: AllStrictlyPositiveWeights
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVE_VECTOR_WEIGHT_STATUS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
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
    
    // setCoordinate(index: number, value: number): void {
    //     if (index < 0 || index >= SPACE_DIMENSION) throw new RangeError('Coordinate index out of bounds');
    //     if (index === 2) {
    //         this.data.coordinates[2].value = new Weight(value);
    //     } else {
    //         this.data.coordinates[index] = value;
    //     }
    // }
    
    normalize(): ProjectiveVector2DTypeReal {
        const w = this.weight.value;
        if (w === 0) return this.clone() as ProjectiveVector2DTypeReal;
        
        return new ProjectiveVector2DTypeReal(
            this.data.coordinates[0] / w,
            this.data.coordinates[1] / w,
            new Weight(1)
        );
    }
    
    toCartesian(): Vector2DTypeReal {
        const normalized = this.normalize();
        return new Vector2DTypeReal(
            normalized.data.coordinates[0],
            normalized.data.coordinates[1]
        );
    }
    
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

    static fromRaw(raw: ProjectiveVector2D): ProjectiveVector2DTypeReal {
        return new ProjectiveVector2DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2].weight);
    }
}