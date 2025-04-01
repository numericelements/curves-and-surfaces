import { EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveVectorSpace";
import { EM_NULL_WEIGHT_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS } from "../ErrorMessages/WeightManager";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { ProjectiveVectorSpaceStrategy } from "./ProjectiveVectorSpace";
import { ProjectiveVector, PROJECTIVEVECTOR3D, ProjectiveVector3D, Real, RealVector, REALVECTOR3D, WEIGHT } from "./VectorSpaceConstructorInterface";
import { isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";

export class ProjectiveVectorSpace4DStrategy implements ProjectiveVectorSpaceStrategy {
    // Implementation for 4D vectors

    shareSameWeightManagement(v1: ProjectiveVector3D, v2: ProjectiveVector3D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[3].value;
            const weight2 = v2.coordinates[3].value;
            return weightManager.isSameWeightManagement(weight1, weight2);
        } else {
            if(!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }

    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean {
        if(isVector4D(v1) && isVector4D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector {
        if(isVector4D(v)) return true;
        return false;
    }

    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveVector {
        if(weightManager.weightManagement === WeightManagement.AllPositiveWeights || (weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[3] === 0)) {
            let vector: ProjectiveVector = {type: PROJECTIVEVECTOR3D, coordinates: [coordinates[0], coordinates[1], coordinates[2], {type: WEIGHT, value: weightManager.setWeightStatus(new Weight(coordinates[3], false))}]};
            return vector;
        } else {
            let vector: ProjectiveVector = {type: PROJECTIVEVECTOR3D, coordinates: [coordinates[0], coordinates[1], coordinates[2], {type: WEIGHT, value: weightManager.setWeightStatus(new Weight(coordinates[3]))}]};
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveVector {
        let vector: ProjectiveVector = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, value: weightManager.setWeightStatus(new Weight(DEFAULT_WEIGHT_VALUE))}]};
        return vector;
    }

    add(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector {
        if(isVector4D(a) && isVector4D(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[3].value, b.coordinates[3].value);
            return {type: PROJECTIVEVECTOR3D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2], {type: WEIGHT, value: sumWeights}]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector {
        if(isVector4D(a) && isVector4D(b)) {
            try {
                const diffWeights = weightManager.subtractWeights(a.coordinates[3].value, b.coordinates[3].value);
                return {type: PROJECTIVEVECTOR3D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2], {type: WEIGHT, value: diffWeights}]};
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Real, v: ProjectiveVector, weightManager: WeightManager): ProjectiveVector {
        if(isVector4D(v)) {
            try{
                const scaledWeight = weightManager.scaleWeight(v.coordinates[3].value, scalar);
                return {type: PROJECTIVEVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], {type: WEIGHT, value: scaledWeight}]};
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    clone(v: ProjectiveVector, weightManager: WeightManager): ProjectiveVector {
        if(isVector4D(v)) {
            const cloneWeight = weightManager.cloneWeight(v.coordinates[3].value);
            return {type: PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], {type: WEIGHT, value: cloneWeight}]};
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
        if(isVector4D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[3].value.weight;
            if(weight === 0) {
                return {type: REALVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2]]};
            } else {
                for( let i = 0; i < v.coordinates.length - 1; i++) {
                    result.push(v.coordinates[i] as number / weight) ;
                }
                return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
            }
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }
}
