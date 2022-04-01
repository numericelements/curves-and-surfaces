import { CylindricalCoordinates } from "../mathVector/CylindricalCoordinates";
import { findSpan, basisFunctions } from "./Piegl_Tiller_NURBS_Book";
import { Vector3d } from "../mathVector/Vector3d";

/**
 * A B-Spline function from a two dimensional real space to a three dimensional real space
 */
export class BSplineR2toCylCoord {

    //controlPoints[i][j]
    private _controlPoints: CylindricalCoordinates[][] = []
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
    constructor(controlPoints: CylindricalCoordinates[][] = [[new CylindricalCoordinates(0, 0, 0)]], knots: number[][] = [[0, 1],[0, 1]]) {
        this._controlPoints = controlPoints
        this._knots = knots
        this._degree[0] = this._knots[0].length - this._controlPoints.length - 1;
        this._degree[1] = this._knots[1].length - this._controlPoints[0].length - 1;
        if (this._degree[0] < 0 || this._degree[1] < 0) {
            throw new Error("Negative degree BSpline_R2_to_R2 are not supported")
        }
    }

    get controlPoints() : CylindricalCoordinates[][] {
        return this._controlPoints
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
        let result = new CylindricalCoordinates(0, 0, 0)

        for (let j = 0; j <= this._degree[1]; j += 1) {
            let temp = new CylindricalCoordinates(0, 0, 0)
            for (let i = 0; i <= this._degree[0]; i += 1) {
                temp = temp.add(this._controlPoints[uInd+i][vInd+j].multiply(uBasis[i]))
            }
            result = result.add(temp.multiply(vBasis[j]))
        }
        return result
    }

    evaluateInCartesianCoordinates(u: number, v: number) {
        const cc = this.evaluate(u, v)
        return new Vector3d(cc.r * Math.cos(cc.theta), cc.r * Math.sin(cc.theta), cc.z)
    }

    normalInCartesianCoordinates(u: number, v: number) {
        const epsilon = 10e-7
        const cartCoord = this.evaluateInCartesianCoordinates(u, v)
        let su: Vector3d
        let sv: Vector3d
        if (u + epsilon < this._knots[0][this._knots[0].length - 1 - this._degree[0]]) {
            su = this.evaluateInCartesianCoordinates(u+epsilon, v).substract(cartCoord)
        } else {
            su = cartCoord.substract(this.evaluateInCartesianCoordinates(u-epsilon, v))
        }

        if (v + epsilon < this._knots[1][this._knots[1].length - 1 - this._degree[1]]) {
            sv = this.evaluateInCartesianCoordinates(u, v+epsilon).substract(cartCoord)
        } else {
            sv = cartCoord.substract(this.evaluateInCartesianCoordinates(u, v-epsilon))
        }

        return su.crossPoduct(sv).normalize()


    }
}




