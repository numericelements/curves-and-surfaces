export const MIN_DIMENSION_PROJECTIVEVECTORSPACE = 3;
export const MAX_DIMENSION_PROJECTIVEVECTORSPACE = 4;
export const NULL_WEIGHT_TOLERANCE = 1e-10;

export enum WeightManagement {
    /**
     * All vectors in the projective vector space must have strictly positive weights.
     */
    AllStrictlyPositiveWeights = 'AllStrictlyPositiveWeights', 
    /**
     * Some vectors in the projective vector space can have null weights, either user-defined or as a result of some computation.
     */
    SomeNullWeights = 'SomeNullWeights',
    /**
     * All vectors in the projective vector space must have positive weights.
     */
    AllPositiveWeights = 'AllPositiveWeights'
};