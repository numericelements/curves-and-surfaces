import { EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM, EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE } from "../../ErrorMessages/ProjectiveRealVectorSpace";
import { WeightManagement } from "../../namedConstants/ProjectiveRealVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../../namedConstants/Weight";
import type { ProjectiveRealVector3D, WeightDesc, RealVector3D } from "../VectorDescriptorConstructorInterface";
import { isVector4D, sendRangeErrorMessage } from "../VectorSpaceUtilities";
import type { WeightManager } from "../WeightManager";
import { createProjectiveRealVector3DDescriptor, createRealVector3DDescriptor } from "../VectorDescriptorFactory";
import type { ProjectiveRealVectorSpaceStrategy } from "../interfaces/VectorSpaceStrategyInterfaces";
import type { ProjectiveRealVectorDesc, Real } from "../utilityTypes/VectorDescriptorTypes";


export class ProjectiveRealVectorSpace3DStrategy implements ProjectiveRealVectorSpaceStrategy<4, ProjectiveRealVector3D> {
    // Implementation for 3D projective vectors

    // getWeight(v: ProjectiveRealVector3D): Real {
    //     if(this.isInVectorSpace(v)) {
    //         return v.coordinates[3].weight.value;
    //     } else {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'getWeight', EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
    //         throw new RangeError(error.generateMessageString());
    //     }
    // }

    shareSameWeightManagement(v1: ProjectiveRealVector3D, v2: ProjectiveRealVector3D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[3].weight;
            const weight2 = v2.coordinates[3].weight;
            return weightManager.haveSameWeightManagement(weight1, weight2);
        } else {
            if(!this.isInVectorSpace(v1) && !this.isInVectorSpace(v2)) {
                const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
                throw new RangeError(error.generateMessageString());
            }
            const error = sendRangeErrorMessage(this.constructor.name, 'shareSameWeightManagement', EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM);
            throw new RangeError(error.generateMessageString());
        }
    }

    areSameDimension(v1: ProjectiveRealVectorDesc, v2: ProjectiveRealVectorDesc): boolean {
        if(isVector4D(v1) && isVector4D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ProjectiveRealVectorDesc): v is ProjectiveRealVectorDesc {
        if(isVector4D(v)) return true;
        return false;
    }

    createVector(coordinates: readonly Real[], weightManager: WeightManager): ProjectiveRealVector3D {
        if(weightManager.weightManagement === WeightManagement.AllPositiveWeights || (weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[3] === 0)) {
            let vector: ProjectiveRealVectorDesc = createProjectiveRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2], weightManager.createWeightFromValueOnly(coordinates[3]).toDescriptor());
            return vector;
        } else {
            let vector: ProjectiveRealVectorDesc = createProjectiveRealVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2], weightManager.createWeightFromValueOnly(coordinates[3]).toDescriptor());
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveRealVector3D {
        let vector: ProjectiveRealVectorDesc = createProjectiveRealVector3DDescriptor(0, 0, 0, weightManager.createWeightFromValueOnly(DEFAULT_WEIGHT_VALUE).toDescriptor());
        return vector;
    }

    addDescriptors(a: ProjectiveRealVector3D, b: ProjectiveRealVector3D, weightManager: WeightManager): ProjectiveRealVector3D {
        if(isVector4D(a) && isVector4D(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[3].weight, b.coordinates[3].weight);
            return createProjectiveRealVector3DDescriptor(a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2], sumWeights.toDescriptor());
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: ProjectiveRealVector3D, b: ProjectiveRealVector3D, weightManager: WeightManager): ProjectiveRealVector3D {
        if(isVector4D(a) && isVector4D(b)) {
            try {
                const diffWeights = weightManager.subtractWeights(a.coordinates[3].weight, b.coordinates[3].weight);
                return createProjectiveRealVector3DDescriptor(a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2], diffWeights.toDescriptor());
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: ProjectiveRealVector3D): number {
        if(isVector4D(v)) {
            let result = 0;
            for(let i = 0; i < v.coordinates.length; i++) {
                let component = 0;
                if(i === v.coordinates.length - 1) {
                    const weight = v.coordinates[i] as WeightDesc;
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

    scaleDescriptor(scalar: Real, v: ProjectiveRealVector3D, weightManager: WeightManager): ProjectiveRealVector3D {
        if(isVector4D(v)) {
            try{
                const scaledWeight = weightManager.scaleWeight(v.coordinates[3].weight, scalar);
                return createProjectiveRealVector3DDescriptor(scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], scaledWeight.toDescriptor());
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: ProjectiveRealVector3D): ProjectiveRealVector3D {
        if(isVector4D(v)) {
            const cloneWeight = v.coordinates[3].weight.clone();
            return createProjectiveRealVector3DDescriptor(v.coordinates[0], v.coordinates[1], v.coordinates[2], cloneWeight.toDescriptor());
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveRealVectorSpaceToRealVectorSpace(v: ProjectiveRealVector3D): RealVector3D {
        if(isVector4D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[3].weight.value;
            if(weight === 0) {
                return createRealVector3DDescriptor(v.coordinates[0], v.coordinates[1], v.coordinates[2]);
            } else {
                for( let i = 0; i < v.coordinates.length - 1; i++) {
                    result.push(v.coordinates[i] as number / weight) ;
                }
                return createRealVector3DDescriptor(result[0], result[1], result[2]);
            }
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveRealVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveRealVector3D): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveRealVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }
}
