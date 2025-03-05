import { constants } from "crypto";
import { EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE, EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/ProjectiveVectorSpace";
import { MAX_DIMENSION_PROJECTIVEVECTORSPACE, MIN_DIMENSION_PROJECTIVEVECTORSPACE } from "../namedConstants/ProjectiveVectorSpace";
import { COMPLEX, ComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D, ProjectiveVector, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, Real, RealVector, REALVECTOR2D, REALVECTOR3D, VectorSpace, WEIGHT, Weight_Interface } from "./VectorSpaceConstructorInterface";
import { isVector3D, isVector4D, sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

/**
 * Implementation of a real vector space
 */
export class ProjectiveVectorSpace implements VectorSpace<Real, ProjectiveVector> {
    private readonly dim: number;

    constructor(dimension: number) {
        if (dimension < MIN_DIMENSION_PROJECTIVEVECTORSPACE || dimension > MAX_DIMENSION_PROJECTIVEVECTORSPACE) {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        this.dim = dimension;
    }

    areSameDimension(v1: ProjectiveVector, v2: ProjectiveVector): boolean {
        if((isVector3D(v1) && isVector3D(v2)) ||
            (isVector4D(v1) && isVector4D(v2))) {
            return true;
        } else return false;
    }

    zero(): ProjectiveVector {
        if (this.dim === 3) {
            return {type: PROJECTIVEVECTOR2D, coordinates: [0, 0, {type: WEIGHT, value: new Weight()}]};
        } else if (this.dim === 4) {
            return {type: PROJECTIVEVECTOR3D, coordinates: [0, 0, 0, {type: WEIGHT, value: new Weight()}]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    add(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector {
        if ((isVector3D(a) && isVector3D(b)) || (isVector4D(a) && isVector4D(b))) {
            const result = (a.coordinates as number[]).map((val, i) => val + (b.coordinates as number[])[i]);
            if(isVector3D(a)) {
                return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(result[2])}]};
            } else if(isVector4D(a)) {
                return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(result[3])}]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    scale(scalar: Real, v: ProjectiveVector): ProjectiveVector {
        const result = (v.coordinates as number[]).map((val) => (scalar * val));
        if (isVector3D(v)) {
            return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(result[2])}]};
        } else if (isVector4D(v)) {
            return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(result[3])}]};
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    subtract(a: ProjectiveVector, b: ProjectiveVector): ProjectiveVector {
        if ((isVector3D(a) && isVector3D(b)) ||
                (isVector4D(a) && isVector4D(b))) {
            const result = (a.coordinates as number[]).map((val, i) => val - (b.coordinates as number[])[i]);
            if(isVector3D(a)) {
                return {type: PROJECTIVEVECTOR2D, coordinates: [result[0], result[1], {type: WEIGHT, value: new Weight(result[2])}]};
            } else if(isVector4D(a)) {
                return {type: PROJECTIVEVECTOR3D, coordinates: [result[0], result[1], result[2], {type: WEIGHT, value: new Weight(result[3])}]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTOR_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'zero', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }

    dimension(): number {
        return this.dim;
    }

    fromProjectiveVectorSpaceToRealVectorSpace(v: ProjectiveVector): RealVector {
        const result: number[] = [];
        const weight = (v.coordinates[v.coordinates.length - 1] as Weight_Interface).value.weight
        if(weight === 0) {
            if(v.type === PROJECTIVEVECTOR3D) {
                return {type: REALVECTOR3D, coordinates: [v.coordinates[0], v.coordinates[1], v.coordinates[2]]};
            } else if(v.type === PROJECTIVEVECTOR2D) {
                return {type: REALVECTOR2D, coordinates: [v.coordinates[0], v.coordinates[1]]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToRealVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        } else {
            for( let i = 0; i < v.coordinates.length - 1; i++) {
                result.push(v.coordinates[i] as number / weight) ;
            }
            if(v.type === PROJECTIVEVECTOR3D) {
                return {type: REALVECTOR3D, coordinates: [result[0], result[1], result[2]]};
            } else if(v.type === PROJECTIVEVECTOR2D) {
                return {type: REALVECTOR2D, coordinates: [result[0], result[1]]};
            } else {
                const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToRealVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
                throw new RangeError(error.generateMessageString());
            }
        }
    }

    fromProjectiveVectorSpaceToProjectiveComplexVectorSpace(v: ProjectiveVector): ProjectiveComplexVector {
        const result: number[] = [];
        const weight = (v.coordinates[v.coordinates.length - 1] as Weight_Interface).value
        if(v.type === PROJECTIVEVECTOR2D) {
            if(weight.weight === 0) {
                const cWeight: ComplexWeight = {type: COMPLEXWEIGHT, real: new Weight(0, false), imaginery: new Weight(0, false)};
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]}, cWeight]};  
            } else {
                return {type: PROJECTIVECOMPLEXVECTOR1D, coordinates: [{type: COMPLEX, real: v.coordinates[0], imaginery: v.coordinates[1]},
                {type: COMPLEXWEIGHT, real: weight, imaginery: weight}]};
            }
        } else {
            const error = sendRangeErrorMessage(this.constructor.name, 'fromProjectiveVectorSpaceToProjectiveComplexVectorSpace', EM_PROJECTIVEVECTORSPACE_DIMENSION_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
    }
}