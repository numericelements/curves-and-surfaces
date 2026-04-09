import { ControlPolygon } from "./newBsplines/ControlPolygon";
import { Vector1DComplex } from "./mathVector/Vector1DComplex";
import type { Vector } from "./mathVector/interfaces/VectorInterfaces";
import { VectorDesc } from "./mathVector/utilityTypes/VectorDescriptorTypes";

// Different approach: use property access directly
// T['descriptor'] uses the CONCRETE return type from the class, not the interface generic
type DescriptorTypeOf<T extends Vector<any, VectorDesc>> = T['descriptor'];
type DimensionTypeOf<T extends Vector<any, VectorDesc>> = T['dimension'];

type TestV = DescriptorTypeOf<Vector1DComplex>;  // Should be ComplexVector1D
type TestD = DimensionTypeOf<Vector1DComplex>;   // Should be 1

// Force compile errors if wrong:
const v1 = new Vector1DComplex(0, 0);
const v2 = new Vector1DComplex(1, 1);

// Single-generic ControlPolygon — inference works directly from the array element type
const cp = new ControlPolygon([v1, v2]);
// cp should be ControlPolygon<Vector1DTypeComplex>
const _test: ControlPolygon<Vector1DComplex> = cp;
