import { findSpan, basisFunctions } from "../Piegl_Tiller_NURBS_Book";
import { BSplineR1toR1 } from "../R1toR1/BSplineR1toR1";

/**
 * A B-Spline function from a two dimensional real space to a one dimensional real space
 */
export class BSpline_R2_to_R1  {

    
    //controlPoints[i][j]
    private _controlPoints: number[][] = []
    //knots[0] =  knots_i
    //knots[1] =  knots_j
    private _knots: number[][] = []
    //degree[0] = degree_i
    //degree[1] = degree_j
    private _degree: number[] = [0, 0]

    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    constructor(controlPoints: number[][] = [[0]], knots: number[][] = [[0, 1],[0, 1]]) {
        this._controlPoints = controlPoints
        this._knots = knots
        this._degree[0] = this._knots[0].length - this._controlPoints.length - 1;
        this._degree[1] = this._knots[1].length - this._controlPoints[0].length - 1;
        if (this._degree[0] < 0 || this._degree[1] < 0) {
            throw new Error("Negative degree BSpline_R2_to_R2 are not supported")
        }
    }

    get controlPoints() : number[][] {
        //return this._controlPoints
        return this.cloneControlPoints()
    }

    visibleControlPoints() {
        return this.controlPoints
    }

    get knots() : number[][] {
        //return this._knots
        return this.cloneKnots()
    }

    get degree() : number[] {
        return this._degree
    }



        /**
     * B-Spline evaluation
     * @param u The parameter u
     * @param v The parameter v
     * @returns the value of the B-Spline at (u, v)
     */
    evaluate(u: number, v: number) {
        
        const uSpan = findSpan(u, this._knots[0], this._degree[0])
        const uBasis = basisFunctions(uSpan, u, this._knots[0], this._degree[0])
        const vSpan = findSpan(v, this._knots[1], this._degree[1])
        const vBasis = basisFunctions(vSpan, v, this._knots[1], this._degree[1])

        const uInd = uSpan - this._degree[0]
        const vInd = vSpan - this._degree[1]
        
        let result = 0
        
        for (let j = 0; j <= this._degree[1]; j += 1) {
            let temp = 0
            for (let i = 0; i <= this._degree[0]; i += 1) {
                temp += (this._controlPoints[uInd+i][vInd+j] * (uBasis[i]))
            }
            result = result + (temp * (vBasis[j]))
        }
        
        return result

    }

    moveControlPoint(indices: {i: number, j: number}, delta: number) {
        this._controlPoints[indices.i][indices.j] += delta
    }

    uGrevilleAbscissae() {
        let result = []
        for (let i = 0; i < this._controlPoints.length; i += 1) {
            let sum = 0
            for (let j = i + 1; j < i + this._degree[0] + 1; j += 1) {
                sum += this._knots[0][j]
            }
            result.push(sum / this._degree[0])
        }
        return result
    }

    vGrevilleAbscissae() {
        let result = []
        for (let i = 0; i < this._controlPoints[0].length; i += 1) {
            let sum = 0
            for (let j = i + 1; j < i + this._degree[1] + 1; j += 1) {
                sum += this._knots[1][j]
            }
            result.push(sum / this._degree[1])
        }
        return result
    }


    insertKnotU(u: number, times: number = 1) {

        if (times <= 0) {
            return
        }

        const index = findSpan(u, this._knots[0], this._degree[0])
        let multiplicity = 0
        if (u === this._knots[0][index]) {
            multiplicity = this.knotMultiplicityU(index)
        }

        for (let t = 0; t < times; t += 1) {

            const m = this._controlPoints.length
            const n = this._controlPoints[0].length

            let newControlPoints: number[][] = []
            for (let i = 0; i < m + 1; i += 1) {
                newControlPoints.push([])
            }

            for (let j = 0; j < n; j+= 1) {
                for (let i = 0; i < index - this._degree[0] + 1; i += 1) {
                    newControlPoints[i][j] = this._controlPoints[i][j]
                }
                for (let i = index - this._degree[0] + 1; i <= index - multiplicity; i += 1){
                    let alpha = (u - this._knots[0][i]) / (this._knots[0][i + this._degree[0]] - this._knots[0][i])
                    newControlPoints[i][j] = this._controlPoints[i - 1][j] * (1 - alpha) + (this._controlPoints[i][j] * (alpha))
                }
                for (let i = index - multiplicity; i < m; i += 1) {
                    newControlPoints[i + 1][j] = this._controlPoints[i][j]
                }
            }

            //update knots
            this._knots[0].splice(index + 1, 0, u)
            this._controlPoints = newControlPoints
        }

    }

    insertKnotV(v: number, times: number = 1) {

        if (times <= 0) {
            return
        }

        const index = findSpan(v, this._knots[1], this._degree[1])
        let multiplicity = 0
        if (v === this._knots[1][index]) {
            multiplicity = this.knotMultiplicityU(index)
        }

        for (let t = 0; t < times; t += 1) {

            const m = this._controlPoints.length
            const n = this._controlPoints[0].length

            let newControlPoints: number[][] = []
            for (let i = 0; i < m; i += 1) {
                newControlPoints.push([])
            }

            for (let i = 0; i < m; i+= 1) {
                for (let j = 0; j < index - this._degree[1] + 1; j += 1) {
                    newControlPoints[i][j] = this._controlPoints[i][j]
                }
                for (let j = index - this._degree[1] + 1; j <= index - multiplicity; j += 1){
                    let alpha = (v - this._knots[1][j]) / (this._knots[1][j + this._degree[1]] - this._knots[1][j])
                    newControlPoints[i][j] = this._controlPoints[i][j - 1] * (1 - alpha) + (this._controlPoints[i][j] * (alpha))
                }
                for (let j = index - multiplicity; j < n; j += 1) {
                    newControlPoints[i][j + 1] = this._controlPoints[i][j]
                }
            }

            //update knots
            this._knots[1].splice(index + 1, 0, v)
            this._controlPoints = newControlPoints
        }

    }

    knotMultiplicityU(indexFromFindSpan: number) {
        let result = 0,
            i = 0;
        while (this._knots[0][indexFromFindSpan + i] === this._knots[0][indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }

    knotMultiplicityV(indexFromFindSpan: number) {
        let result = 0,
            i = 0;
        while (this._knots[1][indexFromFindSpan + i] === this._knots[1][indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    }

    elevateDegreeU() {
        
        const m = this._controlPoints.length
        const n = this._controlPoints[0].length
        let splines: BSplineR1toR1[] = []
        for (let j = 0; j < n; j += 1) {
            let cp: number[] = []
            for (let i = 0; i < m; i += 1) {
                cp.push(this._controlPoints[i][j])
            }
            splines.push(new BSplineR1toR1(cp, this._knots[0]))
        }

        

        for (let i = 0; i < splines.length; i += 1) {
            splines[i].elevateDegree()
        }

        
        
        this._knots[0] = splines[0].knots
        this._degree[0] = splines[0].degree
        

        let newControlPoints: number[][] = []

        for (let i = 0; i < splines[0].controlPoints.length; i += 1 ) {
            newControlPoints.push([])
            for (let j = 0; j < splines.length; j += 1) {
                newControlPoints[i].push(splines[j].controlPoints[i])
            }
        }



        this._controlPoints = newControlPoints
        
    }

    elevateDegreeV() {
        const m = this._controlPoints.length
        const n = this._controlPoints[0].length
        let splines: BSplineR1toR1[] = []
        for (let i = 0; i < m; i += 1) {
            let cp: number[] = []
            for (let j = 0; j < n; j += 1) {
                cp.push(this._controlPoints[i][j])
            }
            splines.push(new BSplineR1toR1(cp, this._knots[1]))
        }

        for (let i = 0; i < splines.length; i += 1) {
            splines[i].elevateDegree()
        }

        this._knots[1] = splines[0].knots
        this._degree[1] = splines[0].degree

        let newControlPoints: number[][] = []

        for (let i = 0; i < this._controlPoints.length; i += 1 ) {
            newControlPoints.push([])
            for (let j = 0; j < splines[0].controlPoints.length; j += 1) {
                newControlPoints[i].push(splines[i].controlPoints[j])
            }
        }

        this._controlPoints = newControlPoints
        
    }

    /**
     * Return a deep copy of this b-spline
     */
    clone() {
        let cloneControlPoints: number[][] = []

        for (let i = 0; i < this._controlPoints.length; i += 1) {
            cloneControlPoints.push([])
            for (let j = 0; j < this._controlPoints[0].length; j += 1) {
                cloneControlPoints[i].push(this._controlPoints[i][j])
            }
        }

        let cloneKnots: number[][] = [ [], []]
        cloneKnots[0] = this._knots[0].slice()
        cloneKnots[1] = this._knots[1].slice()

        //const cloneKnots = [this._knots[0].slice(), this._knots[1].slice]

        return new BSpline_R2_to_R1(cloneControlPoints, cloneKnots);
    }

    cloneKnots() {
        let result: number[][] = [ [], []]
        result[0] = this._knots[0].slice()
        result[1] = this._knots[1].slice()
        return result

    }

    cloneControlPoints() {
        let result: number[][] = []

        for (let i = 0; i < this._controlPoints.length; i += 1) {
            result.push([])
            for (let j = 0; j < this._controlPoints[0].length; j += 1) {
                result[i].push(this._controlPoints[i][j])
            }
        }
        return result

    }



    integralU() {

        // See : Carl de Boor, A Practical Guide to Splines p. 128

        let newControlPoints: number[][] = []

        for (let i = 0; i < this._controlPoints.length + 1; i += 1) {
            newControlPoints.push([])
        }
        for (let j = 0; j < this._controlPoints[0].length; j += 1) {
            newControlPoints[0].push(0)
        }

        for (let k = 0; k < this._controlPoints[0].length; k += 1 ) {
            for (let i = 0; i < this._controlPoints.length; i += 1 ) {
                let temp = 0
                for ( let j = 0; j <= i; j += 1) {
                    temp += (this._knots[0][j + this.degree[0] + 1] - this._knots[0][j] ) * this._controlPoints[j][k]
                }
                newControlPoints[i + 1][k] = temp / (this.degree[0] + 1)
            }
        }

        // The knot set matches the original curve except for one extra knot at either end due to the increased in degree

        let newKnots: number[][] = [[], []]
        newKnots[0].push(this._knots[0][0])
        for (let i = 0; i < this._knots[0].length; i += 1) {
            newKnots[0].push(this._knots[0][i])
        }
        newKnots[0].push(this._knots[0][this._knots[0].length - 1])
        newKnots[1] = this._knots[1].slice()


        return new BSpline_R2_to_R1(newControlPoints, newKnots)


    }

}

export function create_BSpline_R2_to_R1(controlPoints: number[][], knots: number[][]){
    let newControlPoints: number[][] = []
    const n = controlPoints.length
    const m = controlPoints[0].length
    for (let i = 0; i < n; i += 1) {
        newControlPoints.push([])
        for (let j = 0; j < m; j += 1) {
            newControlPoints[i].push(controlPoints[i][j] )
        }
    }
    return new BSpline_R2_to_R1(newControlPoints, knots)
}