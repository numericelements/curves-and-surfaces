import { EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveVectorSpace";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { ProjectiveVectorSpaceStrategy } from "./ProjectiveVectorSpace";
import { ProjectiveVector, PROJECTIVEVECTOR3D, ProjectiveVector3D, Real, RealVector, REALVECTOR3D, WEIGHT, IWeight } from "./VectorSpaceConstructorInterface";
import { isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";

export class ProjectiveVectorSpace4DStrategy implements ProjectiveVectorSpaceStrategy<4> {
    // Implementation for 4D vectors

    getWeight(v: ProjectiveVector3D): Real {
        if(this.isInVectorSpace(v)) {
            return v.coordinates[3].weight.value;
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'getWeight', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
            throw new RangeError(error.generateMessageString());
        }
    }

    shareSameWeightManagement(v1: ProjectiveVector3D, v2: ProjectiveVector3D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[3].weight;
            const weight2 = v2.coordinates[3].weight;
            return weightManager.haveSameWeightManagement(weight1, weight2);
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

    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveVector3D {
        if(weightManager.weightManagement === WeightManagement.AllPositiveWeights || (weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[3] === 0)) {
            let vector: ProjectiveVector = {type: PROJECTIVEVECTOR3D, coordinates: [coordinates[0], coordinates[1], coordinates[2], {type: WEIGHT, weight: weightManager.createWeightFromValueOnly(coordinates[3])}]};
            return vector;
        } else {
            let vector: ProjectiveVector = {type: PROJECTIVEVECTOR3D, coordinates: [coordinates[0], coordinates[1], coordinates[2], {type: WEIGHT, weight: weightManager.createWeightFromValueOnly(coordinates[3])}]};
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveVector3D {
        let vector: ProjectiveVector = {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, weight: weightManager.createWeightFromValueOnly(DEFAULT_WEIGHT_VALUE)}]};
        return vector;
    }

    add(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector3D {
        if(isVector4D(a) && isVector4D(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[3].weight, b.coordinates[3].weight);
            return {type: PROJECTIVEVECTOR3D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2], {type: WEIGHT, weight: sumWeights}]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector3D {
        if(isVector4D(a) && isVector4D(b)) {
            try {
                const diffWeights = weightManager.subtractWeights(a.coordinates[3].weight, b.coordinates[3].weight);
                return {type: PROJECTIVEVECTOR3D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2], {type: WEIGHT, weight: diffWeights}]};
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    norm(v: ProjectiveVector): number {
        if(isVector4D(v)) {
            let result = 0;
            for(let i = 0; i < v.coordinates.length; i++) {
                let component = 0;
                if(i === v.coordinates.length - 1) {
                    const weight = v.coordinates[i] as IWeight;
                    component = weight.weight.value;
                } else {
                    component = v.coordinates[i] as number;
                }
                result += Math.pow(component, 2);
            }
            result = Math.sqrt(result);
            return result;
        } else {
            throw new RangeError();
        }
    }

    scale(scalar: Real, v: ProjectiveVector, weightManager: WeightManager): ProjectiveVector3D {
        if(isVector4D(v)) {
            try{
                const scaledWeight = weightManager.scaleWeight(v.coordinates[3].weight, scalar);
                return {type: PROJECTIVEVECTOR3D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], {type: WEIGHT, weight: scaledWeight}]};
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    clone(v: ProjectiveVector): ProjectiveVector3D {
        if(isVector4D(v)) {
            const cloneWeight = v.coordinates[3].weight.clone();
            return {type: PROJECTIVEVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2], {type: WEIGHT, weight: cloneWeight}]};
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
        if(isVector4D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[3].weight.value;
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
