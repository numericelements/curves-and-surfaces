import { EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveVectorSpace";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import type { IProjectiveVectorSpaceStrategy } from "./strategies/interfaces/IProjectiveVectorSpaceStrategy";
import type { ProjectiveVector, ProjectiveVector3D, Real, IWeight, RealVector3D } from "./VectorSpaceConstructorInterface";
import { isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import type { WeightManager } from "./WeightManager";
import { createProjectiveVector3DDescriptor, createRealVector3DDescriptor } from "./VectorDescriptorFactory";


export class ProjectiveVectorSpace4DStrategy implements IProjectiveVectorSpaceStrategy<4> {
    // Implementation for 4D vectors

    // getWeight(v: ProjectiveVector3D): Real {
    //     if(this.isInVectorSpace(v)) {
    //         return v.coordinates[3].weight.value;
    //     } else {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'getWeight', EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE);
    //         throw new RangeError(error.generateMessageString());
    //     }
    // }

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
            let vector: ProjectiveVector = createProjectiveVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2], weightManager.createWeightFromValueOnly(coordinates[3]).toDescriptor());
            return vector;
        } else {
            let vector: ProjectiveVector = createProjectiveVector3DDescriptor(coordinates[0], coordinates[1], coordinates[2], weightManager.createWeightFromValueOnly(coordinates[3]).toDescriptor());
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveVector3D {
        let vector: ProjectiveVector = createProjectiveVector3DDescriptor(0, 0, 0, weightManager.createWeightFromValueOnly(DEFAULT_WEIGHT_VALUE).toDescriptor());
        return vector;
    }

    addDescriptors(a: ProjectiveVector3D, b: ProjectiveVector3D, weightManager: WeightManager): ProjectiveVector3D {
        if(isVector4D(a) && isVector4D(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[3].weight, b.coordinates[3].weight);
            return createProjectiveVector3DDescriptor(a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], a.coordinates[2] + b.coordinates[2], sumWeights.toDescriptor());
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: ProjectiveVector3D, b: ProjectiveVector3D, weightManager: WeightManager): ProjectiveVector3D {
        if(isVector4D(a) && isVector4D(b)) {
            try {
                const diffWeights = weightManager.subtractWeights(a.coordinates[3].weight, b.coordinates[3].weight);
                return createProjectiveVector3DDescriptor(a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], a.coordinates[2] - b.coordinates[2], diffWeights.toDescriptor());
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: ProjectiveVector3D): number {
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

    scaleDescriptor(scalar: Real, v: ProjectiveVector3D, weightManager: WeightManager): ProjectiveVector3D {
        if(isVector4D(v)) {
            try{
                const scaledWeight = weightManager.scaleWeight(v.coordinates[3].weight, scalar);
                return createProjectiveVector3DDescriptor(scalar * v.coordinates[0], scalar * v.coordinates[1], scalar * v.coordinates[2], scaledWeight.toDescriptor());
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: ProjectiveVector3D): ProjectiveVector3D {
        if(isVector4D(v)) {
            const cloneWeight = v.coordinates[3].weight.clone();
            return createProjectiveVector3DDescriptor(v.coordinates[0], v.coordinates[1], v.coordinates[2], cloneWeight.toDescriptor());
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector3D): RealVector3D {
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

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector3D): never {
        const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }
}
