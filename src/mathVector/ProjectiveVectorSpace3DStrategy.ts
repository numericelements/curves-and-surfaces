import { EM_PROJECTIVEVECTORS_DIFFERENT_DIM, EM_PROJECTIVEVECTORS_NOT_IN_VECTORSPACE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveVectorSpace";
import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { ProjectiveVectorSpaceStrategy } from "./ProjectiveVectorSpace";
import { COMPLEX, ComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveVector, PROJECTIVEVECTOR2D, ProjectiveVector2D, Real, RealVector, REALVECTOR2D, WEIGHT, Weight_Interface } from "./VectorSpaceConstructorInterface";
import { isVector3D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import { WeightManager } from "./WeightManager";


export class ProjectiveVectorSpace3DStrategy implements ProjectiveVectorSpaceStrategy<3> {
    // Implementation for 3D vectors

    shareSameWeightManagement(v1: ProjectiveVector2D, v2: ProjectiveVector2D, weightManager: WeightManager): boolean {
        if(this.areSameDimension(v1, v2) && this.isInVectorSpace(v1)) {
            const weight1 = v1.coordinates[2].value;
            const weight2 = v2.coordinates[2].value;
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
        if(isVector3D(v1) && isVector3D(v2)) return true;
        return false;
    }

    isInVectorSpace(v: ProjectiveVector): v is ProjectiveVector {
        if(isVector3D(v)) return true;
        return false;
    }

    createVector(coordinates: Real[], weightManager: WeightManager): ProjectiveVector2D {
        if(weightManager.weightManagement === WeightManagement.AllPositiveWeights || (weightManager.weightManagement === WeightManagement.SomeNullWeights && coordinates[2] === 0)) {
            let vector: ProjectiveVector = {type: PROJECTIVEVECTOR2D, coordinates: [coordinates[0], coordinates[1], {type: WEIGHT, value: weightManager.setWeightStatus(new Weight(coordinates[2], false))}]};
            return vector;
        } else {
            let vector: ProjectiveVector = {type: PROJECTIVEVECTOR2D, coordinates: [coordinates[0], coordinates[1], {type: WEIGHT, value: weightManager.setWeightStatus(new Weight(coordinates[2]))}]};
            return vector;
        }
    }

    defaultVect(weightManager: WeightManager): ProjectiveVector2D {
        let vector: ProjectiveVector = {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: weightManager.setWeightStatus(new Weight(DEFAULT_WEIGHT_VALUE))}]};
        return vector;
    }

    add(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector2D {
        if(isVector3D(a) && isVector3D(b)) {
            const sumWeights = weightManager.addWeights(a.coordinates[2].value, b.coordinates[2].value);
            return {type: PROJECTIVEVECTOR2D, coordinates: [a.coordinates[0] + b.coordinates[0], a.coordinates[1] + b.coordinates[1], {type: WEIGHT, value: sumWeights}]};
        } else {
            throw new RangeError();
        }
    }

    subtract(a: ProjectiveVector, b: ProjectiveVector, weightManager: WeightManager): ProjectiveVector2D {
        if(isVector3D(a) && isVector3D(b)) {
            try {
                const diffWeights = weightManager.subtractWeights(a.coordinates[2].value, b.coordinates[2].value);
                return {type: PROJECTIVEVECTOR2D, coordinates: [a.coordinates[0] - b.coordinates[0], a.coordinates[1] - b.coordinates[1], {type: WEIGHT, value: diffWeights}]};
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    norm(v: ProjectiveVector): number {
        if(isVector3D(v)) {
            let result = 0;
            for(let i = 0; i < v.coordinates.length - 2; i++) {
                let component = 0;
                if(v.coordinates[i] instanceof Weight) {
                    const weight = v.coordinates[i] as Weight_Interface;
                    component = weight.value.weight;
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

    scale(scalar: Real, v: ProjectiveVector, weightManager: WeightManager): ProjectiveVector2D {
        if(isVector3D(v)) {
            try{
                const scaledWeight = weightManager.scaleWeight(v.coordinates[2].value, scalar);
                return {type: PROJECTIVEVECTOR2D, coordinates: [scalar * v.coordinates[0], scalar * v.coordinates[1], {type: WEIGHT, value: scaledWeight}]};
            } catch(error) {
                throw error;
            }
        } else {
            throw new RangeError();
        }
    }

    clone(v: ProjectiveVector, weightManager: WeightManager): ProjectiveVector2D {
        if(isVector3D(v)) {
            const cloneWeight = weightManager.cloneWeight(v.coordinates[2].value);
            return {type: PROJECTIVEVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1], {type: WEIGHT, value: cloneWeight}]};
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
        if(isVector3D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[2].value.weight;
            if(weight === 0) {
                return {type: REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]]};
            } else {
                for( let i = 0; i < v.coordinates.length - 1; i++) {
                    result.push(v.coordinates[i] as number / weight) ;
                }
                return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
            }
        } else {
            throw new RangeError();
        }
    }

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector {
        if(isVector3D(v)) {
            const result: number[] = [];
            const weight = v.coordinates[2].value;
            if(weight.weight === 0) {
                const cWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginary: new Weight(0, false)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: v.coordinates[0], imaginary: v.coordinates[1]}, cWeight]};  
            } else {
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: v.coordinates[0], imaginary: v.coordinates[1]},
                {type: COMPLEXWEIGHT, real: weight, imaginary: weight}]};
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
}