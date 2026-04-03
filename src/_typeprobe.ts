import { ControlPolygon } from "./newBsplines/ControlPolygon";
import { Vector1DTypeComplex } from "./mathVector/Vector1DTypeComplex";
import type { IVector } from "./mathVector/Vector";
import type { Vector, ComplexVector1D } from "./mathVector/VectorSpaceConstructorInterface";

// Different approach: use property access directly
// T['descriptor'] uses the CONCRETE return type from the class, not the interface generic
type DescriptorTypeOf<T extends IVector<any, Vector>> = T['descriptor'];
type DimensionTypeOf<T extends IVector<any, Vector>> = T['dimension'];

type TestV = DescriptorTypeOf<Vector1DTypeComplex>;  // Should be ComplexVector1D
type TestD = DimensionTypeOf<Vector1DTypeComplex>;   // Should be 1

// Force compile errors if wrong:
const v1 = new Vector1DTypeComplex(0, 0);
const v2 = new Vector1DTypeComplex(1, 1);

// Single-generic ControlPolygon — inference works directly from the array element type
const cp = new ControlPolygon([v1, v2]);
// cp should be ControlPolygon<Vector1DTypeComplex>
const _test: ControlPolygon<Vector1DTypeComplex> = cp;
