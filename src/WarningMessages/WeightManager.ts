import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveRealVectorSpace";

export const WM_WEIGHT_SMALLER_THAN_NULL_WEIGHT_TOLERANCE = `Weights have a value smaller than ${NULL_WEIGHT_TOLERANCE} whereas weight management is set to strictly positive weights.`;
export const WM_WEIGHT_COULD_BE_ASSIGNED_NULL_VALUE = `Weights may have either null values or values smaller than ${NULL_WEIGHT_TOLERANCE}, please consider the assignment of a null value as result.`;