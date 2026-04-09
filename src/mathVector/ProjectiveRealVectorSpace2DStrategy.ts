import { EM_PROJECTIVEREALVECTORS_DIFFERENT_DIM, EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveRealVectorSpace";
import { EM_WEIGHT_VALUE_STRICTLY_POSITIVE } from "../ErrorMessages/Weight";
import { WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import type { ProjectiveRealVectorSpaceStrategy } from "./interfaces/VectorSpaceStrategyInterfaces";
import { createComplexVector1DDescriptor, createComplexWeightDescriptor, createProjectiveComplexVector1DDescriptor, createProjectiveRealVector2DDescriptor, createRealVector2DDescriptor, createWeightDescriptor } from "./VectorDescriptorFactory";
import type { ComplexWeightDesc, ProjectiveRealVector2D, WeightDesc, RealVector2D, ProjectiveComplexVector1D } from "./VectorDescriptorConstructorInterface";
import { isVector3D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import type { WeightManager } from "./WeightManager";
import type { ProjectiveRealVectorDesc, Real } from "./utilityTypes/VectorDescriptorTypes";


export class ProjectiveRealVectorSpace2DStrategy implements ProjectiveRealVectorSpaceStrategy<3, ProjectiveRealVector2D> {
    // Implementation for 2D real projective vectors

    // getWeight(v: ProjectiveRealVector2D): Real {
    //     if(this.isInVectorSpace(v)) {
    //         return v.coordinates[2].weight.value;
    //     } else {
    //         const error = sendRangeErrorMessage(this.constructor.name, 'getWeight', EM_PROJECTIVEREALVECTORS_NOT_IN_VECTORSPACE);
    //         throw new RangeError(error.generateMessageString());
    //     }
    // }

    shareSameWeightManagement(v1: ProjectiveRealVector2D, v2: ProjectiveRealVector2D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[2].weight;
            const weight2 = v2.coordinates[2].weight;
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
        if(isVector3D(v1) && isVector3D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ProjectiveRealVectorDesc): v is ProjectiveRealVectorDesc {
        if(isVector3D(v)) return true;
        return false;
    }

    createVector(coordinates: readonly Real[], weightManager: WeightManager): ProjectiveRealVector2D {
        if(weightManager.weightManagement === WeightManagement.AllPositiveWeights || (weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[2] === 0)) {
            const weightDescriptor = createWeightDescriptor(coordinates[2], false);
            const vector: ProjectiveRealVectorDesc = createProjectiveRealVector2DDescriptor(coordinates[0], coordinates[1], weightDescriptor);
            return vector;
        } else {
            if(weightManager.weightManagement === WeightManagement.AllStrictlyPositiveWeights && coordinates[2] === 0) {
                const error = sendRangeErrorMessage(this.constructor.name, 'createVector', EM_WEIGHT_VALUE_STRICTLY_POSITIVE);
                throw new RangeError(error.generateMessageString());
            }
            const weightDescriptor = createWeightDescriptor(coordinates[2]);
            const vector: ProjectiveRealVectorDesc = createProjectiveRealVector2DDescriptor(coordinates[0], coordinates[1], weightDescriptor);
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveRealVector2D {
        let vector: ProjectiveRealVectorDesc = createProjectiveRealVector2DDescriptor(0, 0, weightManager.createWeightFromValueOnly(DEFAULT_WEIGHT_VALUE));
        return vector;
    }

    addDescriptors(a: ProjectiveRealVector2D, b: ProjectiveRealVector2D, weightManager: WeightManager): ProjectiveRealVector2D {
        if(isVector3D(a) && isVector3D(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[2].weight, b.coordinates[2].weight);
            return createProjectiveRealVector2DDescriptor(a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], sumWeights);
        } else {
            throw new RangeError();
        }
    }

    subtractDescriptors(a: ProjectiveRealVector2D, b: ProjectiveRealVector2D, weightManager: WeightManager): ProjectiveRealVector2D {
        if(isVector3D(a) && isVector3D(b)) {
            try {
                const diffWeights = weightManager.subtractWeights(a.coordinates[2].weight, b.coordinates[2].weight);
                return createProjectiveRealVector2DDescriptor(a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], diffWeights);
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    normDescriptor(v: ProjectiveRealVector2D): number {
        if(isVector3D(v)) {
            let result = 0;
            for(let i = 0; i < v.coordinates.length; i++) {
                let component = 0;
                if(i === (v.coordinates.length - 1)) {
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

    scaleDescriptor(scalar: Real, v: ProjectiveRealVector2D, weightManager: WeightManager): ProjectiveRealVector2D {
        if(isVector3D(v)) {
            try{
                const scaledWeight = weightManager.scaleWeight(v.coordinates[2].weight, scalar);
                return createProjectiveRealVector2DDescriptor(scalar * v.coordinates[0], scalar * v.coordinates[1], scaledWeight);
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    cloneVector(v: ProjectiveRealVector2D): ProjectiveRealVector2D {
        if(isVector3D(v)) {
            const clonedWeight = v.coordinates[2].weight.clone();
            return createProjectiveRealVector2DDescriptor(v.coordinates[0], v.coordinates[1], clonedWeight);
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveRealVectorSpaceToRealVectorSpace(v: ProjectiveRealVector2D): RealVector2D {
        if(isVector3D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[2].weight.value;
            if(weight === 0) {
                return createRealVector2DDescriptor(v.coordinates[0], v.coordinates[1]);
            } else {
                for( let i = 0; i < v.coordinates.length - 1; i++) {
                    result.push(v.coordinates[i] as number / weight) ;
                }
                return createRealVector2DDescriptor(result[0], result[1]);
            }
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveRealVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveRealVector2D): ProjectiveComplexVector1D {
        if(isVector3D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[2].weight;
            if(weight.value === 0) {
                const cWeight: ComplexWeightDesc = createComplexWeightDescriptor(new Weight(0, false), new Weight(0, false));
                return createProjectiveComplexVector1DDescriptor(createComplexVector1DDescriptor(v.coordinates[0], v.coordinates[1]), cWeight);  
            } else {
                return createProjectiveComplexVector1DDescriptor(createComplexVector1DDescriptor(v.coordinates[0], v.coordinates[1]),
                createComplexWeightDescriptor(weight, weight));
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveRealVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEREALVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
}