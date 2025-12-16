import { NULL_WEIGHT_TOLERANCE } from "../namedConstants/ProjectiveVectorSpace";

export const EM_WEIGHT_STATUS_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT = "Weight status is incompatible because it is assigned the possibility to be positive whereas the weight manager is set to strictly positive weight management.";
export const EM_WEIGHT_STATUS_INCOMPATIBLE_POSITIVE_MANAGEMENT = "The weight status is incompatible because it is assigned the possibility to be strictly positive whereas the weight manager is set to positive weight management.";
export const EM_WEIGHT_SUBTRACTION_ERROR = "Weight subtraction produces a negative weight. Cannot proceed.";
export const EM_NULL_WEIGHT_RESULTING_SUBTRACT_STRICTLY_POSITIVE_WEIGHTS = `Subtracting strictly positive weights produced a null weight or negative weight within the tolerance ${NULL_WEIGHT_TOLERANCE}. Cannot proceed.`;
export const EM_SCALE_FACTOR_STRICTLY_NEGATIVE = "Scale factor is strictly negative while weights must stay positive. Cannot proceed.";
export const EM_SCALE_FACTOR_NULL = "Scale factor is null and produces a null weight, while weights must be strictly positive. Cannot proceed.";
export const EM_FORCE_NULL_WEIGHT_INCOMPATIBLE_STRICTLY_POSITIVE_MANAGEMENT = "Forcing a null weight is incompatible with strictly positive weight management. Cannot proceed.";
export const EM_TOGGLE_STATUS_INCOMPATIBLE = "Changing the weight status is incompatible with the weight management. Cannot proceed.";
export const EM_WEIGHT_MANAGEMENT_UNKOWN = "The weight management type is unknown. Cannot proceed.";
