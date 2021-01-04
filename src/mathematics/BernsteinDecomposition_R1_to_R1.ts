import {binomialCoefficient, memorizedBinomialCoefficient} from "./BinomialCoefficient"

/**
* A Bernstein decomposition of a B-Spline function from a one dimensional real space to a one dimensional real space
*/

export class BernsteinDecomposition_R1_to_R1 {


    static binomial = memorizedBinomialCoefficient()
    static flopsCounter = 0
    
    /**
     * 
     * @param controlPointsArray An array of array of control points
     */
    constructor(private controlPointsArray: number[][]) {}

    add(bd: BernsteinDecomposition_R1_to_R1) {
        let result: number[][] = []
        for (let i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (let j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] + bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecomposition_R1_to_R1(result);
    }

    subtract(bd: BernsteinDecomposition_R1_to_R1) {
        let result: number[][] = []
        for (let i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (let j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] - bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecomposition_R1_to_R1(result);
    }


    multiply(bd: BernsteinDecomposition_R1_to_R1) {
        return new BernsteinDecomposition_R1_to_R1(this.bernsteinMultiplicationArray(this.controlPointsArray, bd.controlPointsArray));
    }

    /**
     * 
     * @param bd: BernsteinDecomposition_R1_to_R1
     * @param index: Index of the basis function
     */
    multiplyRange(bd: BernsteinDecomposition_R1_to_R1, start: number, lessThan: number) {
        let result: number[][] = []
        for (let i = start; i < lessThan; i += 1) {
            result[i-start] = this.bernsteinMultiplication(this.controlPointsArray[i], bd.controlPointsArray[i]);
        }
        return new BernsteinDecomposition_R1_to_R1(result)
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


        /*
        for (let k = 0; k < f_degree + g_degree + 1; k += 1) {
            let cp = 0;
            for (let i = Math.max(0, k - g_degree); i < Math.min(f_degree, k) + 1; i += 1) {
                let bfu = binomialCoefficient(f_degree, i);
                let bgu = binomialCoefficient(g_degree, k - i);
                let bfugu = binomialCoefficient(f_degree + g_degree, k);
                cp += bfu * bgu / bfugu * f[i] * g[k - i];
            }
            result[k] = cp;
        }
        */

       /*
       BernsteinDecomposition_R1_to_R1.flopsCounter += 1
       if (BernsteinDecomposition_R1_to_R1.flopsCounter % 1000 === 0) {
         //console.log("Bernstein Multiplication")
         //console.log(BernsteinDecomposition_R1_to_R1.flopsCounter)
       }
       */

        for (let k = 0; k < f_degree + g_degree + 1; k += 1) {
            let cp = 0;
            for (let i = Math.max(0, k - g_degree); i < Math.min(f_degree, k) + 1; i += 1) {
                let bfu = BernsteinDecomposition_R1_to_R1.binomial(f_degree, i);
                let bgu = BernsteinDecomposition_R1_to_R1.binomial(g_degree, k - i);
                let bfugu = BernsteinDecomposition_R1_to_R1.binomial(f_degree + g_degree, k);
                cp += bfu * bgu / bfugu * f[i] * g[k - i];
            }
            result[k] = cp;
        }




        return result;
    }

    multiplyByScalar(value: number) {
        let result: number[][] = []
        for (let i = 0; i < this.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (let j = 0; j < this.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] * value;
            }
        }
        return new BernsteinDecomposition_R1_to_R1(result);

    }

    flattenControlPointsArray() {
        //return this.controlPointsArray.flat();
        return this.controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    }

    subset(start: number, lessThan: number) {
        return new BernsteinDecomposition_R1_to_R1(this.controlPointsArray.slice(start, lessThan))

    }

}