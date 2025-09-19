export const MIN_DIMENSION_PROJECTIVEVECTORSPACE = 3;
export const MAX_DIMENSION_PROJECTIVEVECTORSPACE = 4;
export const NULL_WEIGHT_TOLERANCE = 1e-10;

export enum WeightManagement {
    /**
     * All vectors in the projective vector space must have strictly positive weights.
     */
    AllStrictlyPositiveWeights = 'AllStrictlyPositiveWeights', 
    /**
     * Some vectors in the projective vector space can have null weights.
     * The user can prescribe a null weight when creating a vector to assign explicitly a non strictly positive weight specifically for the corresponding vector.
     * Other null weight derive from the results of some computation using the null weight tolerance.
     * In this case, user-presccribed null weights are considered as a positive weight with strictlyPositive set to false.
     * Other strictly positive weights are considered as strictly positive weights with strictlyPositive set to true.
     * As a result of some computations, some vectors can have strictly positive weights (with strictlyPositive set to true) 
     * and other vectors can have null weights (with strictlyPositive set to false).
     * This weight management option enables the user to precisely control the status of the weights of a set of clearly identified vectors
     * while others must conform to the strictly positive constraint.
     */
    SomeNullWeights = 'SomeNullWeights',
    /**
     * All vectors in the projective vector space must have positive weights.
     * Some vectors can have a null weight either as the result of some computation using the null weight tolerance
     * or when the user prescribes a null weight when creating a vector.
     * In this case, all the weights processed by the weight manager are considered as a positive weight with strictlyPositive set to false.
     */
    AllPositiveWeights = 'AllPositiveWeights'
};