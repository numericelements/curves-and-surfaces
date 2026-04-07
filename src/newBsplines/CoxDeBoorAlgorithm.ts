import { IVector } from "../mathVector/Vector";
import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { IncreasingOpenKnotSequenceOpenCurve } from "./IncreasingOpenKnotSequenceOpenCurve";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";


/**
 * Pure algorithm implementation - no caching, no performance optimizations
 * Just the mathematical algorithm
 */
export class CoxDeBoorAlgorithm<IV extends IVector<any, Vector>> {
    constructor(
        private controlPolygon: ControlPolygon<IV>,
        private knotSequence: IncreasingOpenKnotSequenceOpenCurve,
        private degree: number
    ) {}

    /**
     * Pure Cox-de Boor algorithm implementation
     * @param parameter - Parameter value
     * @param flatCoordinates - Flattened control point coordinates
     * @returns Computed coordinates
     */
    compute(parameter: number, flatCoordinates: Float64Array): number[] {
        const n = this.controlPolygon.length - 1;
        const p = this.degree;
        const knots = this.knotSequence.allAbscissae; // Assuming this method exists
        
        // Find the knot span
        const span = this.findSpan(parameter, knots, p);
        
        // Compute basis functions
        const basisFunctions = this.computeBasisFunctions(span, parameter, p, knots);
        
        // Compute curve point
        const dimension = this.controlPolygon.spaceDimension;
        const result = new Array(dimension).fill(0);
        
        for (let i = 0; i <= p; i++) {
            const cpIndex = span - p + i;
            for (let d = 0; d < dimension; d++) {
                result[d] += basisFunctions[i] * flatCoordinates[cpIndex * dimension + d];
            }
        }
        
        return result;
    }

    private findSpan(u: number, knots: readonly number[], degree: number): number {
        // Standard span finding algorithm
        const n = knots.length - degree - 2;
        
        if (u >= knots[n + 1]) return n;
        if (u <= knots[degree]) return degree;
        
        let low = degree;
        let high = n + 1;
        let mid = Math.floor((low + high) / 2);
        
        while (u < knots[mid] || u >= knots[mid + 1]) {
            if (u < knots[mid]) {
                high = mid;
            } else {
                low = mid;
            }
            mid = Math.floor((low + high) / 2);
        }
        
        return mid;
    }

    private computeBasisFunctions(span: number, u: number, degree: number, knots: readonly number[]): number[] {
        const basis = new Array(degree + 1);
        const left = new Array(degree + 1);
        const right = new Array(degree + 1);
        
        basis[0] = 1.0;
        
        for (let j = 1; j <= degree; j++) {
            left[j] = u - knots[span + 1 - j];
            right[j] = knots[span + j] - u;
            let saved = 0.0;
            
            for (let r = 0; r < j; r++) {
                const temp = basis[r] / (right[r + 1] + left[j - r]);
                basis[r] = saved + right[r + 1] * temp;
                saved = left[j - r] * temp;
            }
            basis[j] = saved;
        }
        
        return basis;
    }
}