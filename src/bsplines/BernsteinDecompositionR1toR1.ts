import {binomialCoefficient, memoizedBinomialCoefficient} from "./BinomialCoefficient"
import { BSplineR1toR1 } from "./BSplineR1toR1"

/**
* A Bernstein decomposition of a B-Spline function from a one dimensional real space to a one dimensional real space
*/

export class BernsteinDecompositionR1toR1 {


    static binomial = memoizedBinomialCoefficient()
    static flopsCounter = 0
    
    /**
     * 
     * @param controlPointsArray An array of array of control points
     */
    constructor(private controlPointsArray: number[][] = []) {}

    add(bd: BernsteinDecompositionR1toR1) {
        let result: number[][] = []
        for (let i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = []
            for (let j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] + bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecompositionR1toR1(result)
    }

    subtract(bd: BernsteinDecompositionR1toR1) {
        let result: number[][] = []
        for (let i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = []
            for (let j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] - bd.controlPointsArray[i][j]
            }
        }
        return new BernsteinDecompositionR1toR1(result)
    }


    multiply(bd: BernsteinDecompositionR1toR1) {
        return new BernsteinDecompositionR1toR1(this.bernsteinMultiplicationArray(this.controlPointsArray, bd.controlPointsArray))
    }


    multiplyRange(bd: BernsteinDecompositionR1toR1, start: number, lessThan: number) {
        let result: number[][] = []
        for (let i = start; i < lessThan; i += 1) {
            result[i-start] = this.bernsteinMultiplication(this.controlPointsArray[i], bd.controlPointsArray[i])
        }
        return new BernsteinDecompositionR1toR1(result)
    }

    multiplyRange2(bd: BernsteinDecompositionR1toR1, start: number, lessThan: number) {
        let result: number[][] = []
        for (let i = start; i < lessThan; i += 1) {
            result[i-start] = this.bernsteinMultiplication(this.controlPointsArray[i-start], bd.controlPointsArray[i])
        }
        return new BernsteinDecompositionR1toR1(result)
    }



    bernsteinMultiplicationArray(f: number[][], g: number[][]) {
        let result: number[][] = []
        for (let i = 0; i < f.length; i += 1) {
            result[i] = this.bernsteinMultiplication(f[i], g[i])
        }
        return result
    }

    bernsteinMultiplication(f: number[], g: number[]) {
        const f_degree = f.length - 1
        const g_degree = g.length - 1
        let result: number[] = []


        for (let k = 0; k < f_degree + g_degree + 1; k += 1) {
            let cp = 0
            for (let i = Math.max(0, k - g_degree); i < Math.min(f_degree, k) + 1; i += 1) {
                let bfu = BernsteinDecompositionR1toR1.binomial(f_degree, i)
                let bgu = BernsteinDecompositionR1toR1.binomial(g_degree, k - i)
                let bfugu = BernsteinDecompositionR1toR1.binomial(f_degree + g_degree, k)
                cp += bfu * bgu / bfugu * f[i] * g[k - i]
            }
            result[k] = cp
        }




        return result
    }

    multiplyByScalar(value: number) {
        let result: number[][] = []
        for (let i = 0; i < this.controlPointsArray.length; i += 1) {
            result[i] = []
            for (let j = 0; j < this.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] * value
            }
        }
        return new BernsteinDecompositionR1toR1(result)
    }

    addScalar(value: number) {
        let result: number[][] = []
        for (let i = 0; i < this.controlPointsArray.length; i += 1) {
            result[i] = []
            for (let j = 0; j < this.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] + value
            }
        }
        return new BernsteinDecompositionR1toR1(result)
    }

    flattenControlPointsArray() {
        return this.controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val)
        }, [])
    }

    subset(start: number, lessThan: number) {
        return new BernsteinDecompositionR1toR1(this.controlPointsArray.slice(start, lessThan))

    }

    elevateDegree(times: number = 1) {
        let newControlPointsArray: number[][] = []

        for (let i = 0; i < this.controlPointsArray.length; i += 1) {
            newControlPointsArray.push(this.elevateDegreeB( this.controlPointsArray[i], times))
        }
        this.controlPointsArray = newControlPointsArray
        
    }

    elevateDegreeB(controlPoints: number[], times: number = 1) {
        const degree = controlPoints.length - 1
        let result: number[] = []
        for (let i = 0; i < controlPoints.length + times; i += 1) {
            let cp = 0
            for (let j = Math.max(0, i - times); j <= Math.min(degree, i); j += 1){
                const bc0 = binomialCoefficient(times, i-j)
                const bc1 = binomialCoefficient(degree, j)
                const bc2 = binomialCoefficient(degree+times, i)
                cp += bc0 * bc1 / bc2 * controlPoints[j]
            }
            result.push(cp)
        }
        return result
    }

    
    
    splineRecomposition(distinctKnots: number[]) {
        const cp = this.flattenControlPointsArray()
        const degree = this.getDegree()
        let knots: number[] = []

        for (let i = 0; i < distinctKnots.length; i += 1) {
            for (let j = 0; j < degree + 1; j += 1) {
                knots.push(distinctKnots[i])
            }
        }

        return new BSplineR1toR1(cp, knots)
    }
    
    

    getDegree() {
        return this.controlPointsArray[0].length - 1
    }

}

export function splineRecomposition(bernsteinDecomposiiton: BernsteinDecompositionR1toR1, distinctKnots: number[]) {
    const cp = bernsteinDecomposiiton.flattenControlPointsArray()
    const degree = bernsteinDecomposiiton.getDegree()
    let knots: number[] = []

    for (let distinctKnot of distinctKnots) {
        for (let j = 0; j < degree + 1; j += 1) {
            knots.push(distinctKnot)
        }
    }
    return new BSplineR1toR1(cp, knots)
}

export function determinant2by2(ax: BernsteinDecompositionR1toR1, ay: BernsteinDecompositionR1toR1, bx: BernsteinDecompositionR1toR1, by: BernsteinDecompositionR1toR1) {
    return (ax.multiply(by)).subtract(bx.multiply(ay))
}