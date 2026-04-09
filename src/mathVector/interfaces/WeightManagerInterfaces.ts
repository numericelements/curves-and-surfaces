import { ComplexWeight } from "../ComplexWeight";
import { Real } from "../utilityTypes/VectorDescriptorTypes";
import { Weight } from "../Weight";

/**
 * Contract implemented by all {@link WeightManager} strategy classes.
 *
 * Each strategy encodes the arithmetic rules for one {@link WeightManagement} policy
 * (`AllStrictlyPositiveWeights`, `AllPositiveWeights`, or `SomeNullWeights`).
 */
export interface WeightManagerStrategy {
    /** Returns the sum of two real weights, respecting the active policy. */
    addWeights(weightV1: Weight, weightV2: Weight): Weight;
    /** Returns the difference of two real weights, respecting the active policy. */
    subtractWeights(weightV1: Weight, weightV2: Weight): Weight;
    /** Scales a real weight by `scalar`, respecting the active policy. */
    scaleWeight(weight: Weight, scalar: Real): Weight;
    /** Creates a {@link Weight} from a bare numeric value, setting the `strictlyPositive` flag per the policy. */
    createWeightFromValueOnly(value: number): Weight;
    /** Forces `weight` to the null-weight value (0) if permitted by the policy. */
    forcesNullWeight(weight: Weight): Weight;
    /** Transitions `weight` to null-weight status if permitted by the policy. */
    setWeightStatusToNullWeightStatus(weight: Weight): Weight;
    /** Returns the component-wise sum of two complex weights, respecting the active policy. */
    addComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight;
    /** Returns the component-wise difference of two complex weights, respecting the active policy. */
    subtractComplexWeights(weightV1: ComplexWeight, weightV2: ComplexWeight): ComplexWeight;
}