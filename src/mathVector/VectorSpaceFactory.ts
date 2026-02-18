import { EM_REALVECTORSPACE_DIMENSION_OUT_RANGE } from "../ErrorMessages/RealVectorSpace";
import { MAX_DIMENSION_REALVECTORSPACE, MIN_DIMENSION_REALVECTORSPACE } from "../namedConstants/RealVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";


export function createRealVectorSpace(dimension: 1): RealVectorSpace<1>;
export function createRealVectorSpace(dimension: 2): RealVectorSpace<2>;
export function createRealVectorSpace(dimension: 3): RealVectorSpace<3>;
export function createRealVectorSpace(dimension: 4): RealVectorSpace<4>;
export function createRealVectorSpace(dimension: number): RealVectorSpace<number>;
export function createRealVectorSpace(dimension: number): RealVectorSpace<any> {
    if(dimension < MIN_DIMENSION_REALVECTORSPACE || dimension > MAX_DIMENSION_REALVECTORSPACE) {
        const error = sendRangeErrorMessage("createRealVectorSpace", 'createRealVectorSpace', EM_REALVECTORSPACE_DIMENSION_OUT_RANGE);
        throw new RangeError(error.generateMessageString());
    }
    return new RealVectorSpace(dimension);
}