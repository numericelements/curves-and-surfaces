import { PeriodicBSplineR1toR2 } from "../bsplines/PeriodicBSplineR1toR2"
import { dotProduct, norm, removeElements, zeroVector} from "../linearAlgebra/MathVectorBasicOperations"
import { PeriodicBSplineR1toR1 } from "../bsplines/PeriodicBSplineR1toR1"
import { DenseMatrix } from "../linearAlgebra/DenseMatrix"
import { AbstractOptimizationProblemBSplineR1toR2, ActiveControl, ExpensiveComputationResults } from "./AbstractOptimizationProblemBSplineR1toR2"
import { BernsteinDecompositionR1toR1 } from "../bsplines/BernsteinDecompositionR1toR1"
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix"
import { MatrixInterface } from "../linearAlgebra/MatrixInterfaces"



export class OptimizationProblemPeriodicBSplineR1toR2QuasiNewton extends AbstractOptimizationProblemBSplineR1toR2 {

    private barrierHessianApproximation: SymmetricMatrix[] = []
    //private previousGradient_f: MatrixInterface
    private previousCurvatureExtremaConstraintsGradient: DenseMatrix
    private currentCurvatureExtremaConstraintsGradient: DenseMatrix
    private previousInflectionConstraintsGradient: DenseMatrix
    private currentInflectionConstraintsGradient: DenseMatrix
    private curvatureExtremaConstraintsHessians: SymmetricMatrix[] = []
    private inflectionConstraintsHessians: SymmetricMatrix[] = []
    
    constructor(target: PeriodicBSplineR1toR2, initial: PeriodicBSplineR1toR2, public activeControl: ActiveControl = ActiveControl.curvatureExtrema) {
        super(target, initial, activeControl)
        const totalNumberOfCurvatureExtremaConstraints = this.curvatureExtremaConstraintsSign.length
        const totalNumberOfInflectionConstraints = this.inflectionConstraintsSign.length
        const totalPossibleNumberOfConstraints = this.curvatureExtremaConstraintsSign.length + this.inflectionConstraintsSign.length
        const totalNumberOfActiveConstraints = totalPossibleNumberOfConstraints - this._inflectionInactiveConstraints.length - this._curvatureExtremaInactiveConstraints.length
        //this.previousGradient_f = new DenseMatrix(totalPossibleNumberOfConstraints, this.numberOfIndependentVariables)
        this.previousCurvatureExtremaConstraintsGradient = new DenseMatrix(this.curvatureExtremaConstraintsSign.length, this.numberOfIndependentVariables)
        this.currentCurvatureExtremaConstraintsGradient = this.previousCurvatureExtremaConstraintsGradient
        this.previousInflectionConstraintsGradient = new DenseMatrix(this.inflectionConstraintsSign.length, this.numberOfIndependentVariables)
        this.currentInflectionConstraintsGradient = this.previousInflectionConstraintsGradient
        for (let i = 0; i < totalNumberOfActiveConstraints; i += 1) {
            this.barrierHessianApproximation.push(new SymmetricMatrix(this.gradient_f.shape[1]))
        }
        for (let i = 0; i < totalNumberOfCurvatureExtremaConstraints; i += 1) {
            this.curvatureExtremaConstraintsHessians.push(new SymmetricMatrix(this.gradient_f.shape[1]))
        }
        for (let i = 0; i < totalNumberOfInflectionConstraints; i += 1) {
            this.inflectionConstraintsHessians.push(new SymmetricMatrix(this.gradient_f.shape[1]))
        }
    }

    get spline(): PeriodicBSplineR1toR2 {
        return this._spline as PeriodicBSplineR1toR2
    }

    get hessian_f(): SymmetricMatrix[] | undefined {
        //return undefined
        return this.barrierHessianApproximation.slice(0, this._f.length)
    }

    bSplineR1toR1Factory(controlPoints: number[], knots: number[]): PeriodicBSplineR1toR1 {
        return new PeriodicBSplineR1toR1(controlPoints, knots)
    }

    setTargetSpline(spline: PeriodicBSplineR1toR2) {
        this._target = spline.clone()
        this._gradient_f0 = this.compute_gradient_f0(this.spline)
        this._f0 = this.compute_f0(this._gradient_f0) 
    }

    /**
     * Some contraints are set inactive to allowed the point of inflection or curvature extrema 
     * to slide along the curve. 
     **/ 
     computeInactiveConstraints(controlPoints: number[]) { 
        //return [] 
        let controlPointsSequences = this.extractChangingSignControlPointsSequences(controlPoints)
        let result = this.extractControlPointsClosestToZero(controlPointsSequences)
        const firstCP = controlPoints[0]
        const lastCP = controlPoints[controlPoints.length -1]
        if (firstCP * lastCP <= 0) {
            if (Math.pow(firstCP,2) <= Math.pow(lastCP,2)) {
                if (result[0] != 0) {
                    result = [0].concat(result)
                }
            }
            else {
                if (result[result.length -1] != controlPoints.length -1) {
                    result.push(controlPoints.length -1)
                }
            }
        }
        return result
    }

    extractChangingSignControlPointsSequences(controlPoints: number[]) {
        let result: {index: number, value: number}[][] = []
        let successiveControlPoints: {index: number, value: number}[] = []
        let i = 1
        while (i < controlPoints.length) {
            successiveControlPoints = []
            if (controlPoints[i - 1] * controlPoints[i] <= 0) {
                successiveControlPoints.push({index: i-1, value: controlPoints[i-1]})
                successiveControlPoints.push({index: i, value: controlPoints[i]})
                i += 1
                while (controlPoints[i - 1] * controlPoints[i] <= 0) {
                    successiveControlPoints.push({index: i, value: controlPoints[i]})
                    i += 1
                }
                result.push(successiveControlPoints)
            }
            i += 1  
        }
        return result
    }

    extractControlPointsClosestToZero(polygonSegments: {index: number, value: number}[][]) {
        let result: number[] = []
        for (let polygonSegment of polygonSegments) {
            let s = this.removeBiggest(polygonSegment)
            for (let iv of s) {
                result.push(iv.index)
            }
        }
        return result
    }

    removeBiggest(controlPointsSequence: {index: number, value: number}[]) {
        let result = controlPointsSequence.slice()
        let maxIndex = 0
        for (let i = 1; i < controlPointsSequence.length; i += 1) {
            if (Math.pow(controlPointsSequence[i].value, 2) > Math.pow(controlPointsSequence[maxIndex].value, 2)) {
                maxIndex = i
            }
        }
        result.splice(maxIndex, 1)
        return result
    }

    compute_curvatureExtremaConstraints_gradient_full( e: ExpensiveComputationResults,
        constraintsSign: number[]) {
        const sxu = e.bdsxu
        const sxuu = e.bdsxuu
        const sxuuu = e.bdsxuuu
        const syu = e.bdsyu
        const syuu = e.bdsyuu
        const syuuu = e.bdsyuuu
        const h1 = e.h1
        const h2 = e.h2
        const h3 = e.h3
        const h4 = e.h4


        let dgx: BernsteinDecompositionR1toR1[] = []
        let dgy: BernsteinDecompositionR1toR1[] = []
        const periodicControlPointsLength = this.spline.freeControlPoints.length
        const totalNumberOfConstraints = constraintsSign.length
        const degree = this.spline.degree


        for (let i = 0; i < periodicControlPointsLength; i += 1) {

            // moved control point : i
            // periodicControlPointsLength = n - degree (it is necessery to add degree cyclic control points, if we do not count them we have n - degree control points)
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]

            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan)
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan)
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1)
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        let result = new DenseMatrix(totalNumberOfConstraints, 2 * periodicControlPointsLength)


        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let cpx = dgx[i].flattenControlPointsArray();
            let cpy = dgy[i].flattenControlPointsArray();

            let start = Math.max(0, i - degree) * (4 * degree - 5)
            let lessThan = Math.min(periodicControlPointsLength, i + 1) * (4 * degree - 5)

            for (let j = start; j < lessThan; j += 1) {
                result.set(j, i, cpx[j - start] * constraintsSign[j])
                result.set(j, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j])              
            }
        }
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (let i = 0; i < degree; i += 1) {

            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]

            let start =  i - degree + periodicControlPointsLength 
            let lessThan = periodicControlPointsLength
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(sxu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(syuuu, start, lessThan)
            let h7 = syu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan).multiplyByScalar(-1)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan)
            let h9 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        for (let i = 0; i < degree; i += 1) {
            let start = i - degree + periodicControlPointsLength
            let lessThan = periodicControlPointsLength
            let h1_subset = h1.subset(start, lessThan)
            let h2_subset = h2.subset(start, lessThan)
            let h3_subset = h3.subset(start, lessThan)
            let h4_subset = h4.subset(start, lessThan)
            let h5 = this.dBasisFunctions_du[i].multiplyRange(syu, start, lessThan)
            let h6 = this.dBasisFunctions_du[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1)
            let h7 = sxu.multiplyRange(this.d3BasisFunctions_du3[i], start, lessThan)
            let h8 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h9 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add((((h8.add(h9)).multiply(h4_subset)).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)))
        }


        
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray()
            let cpy = dgy[i].flattenControlPointsArray()

            let start = (i - degree) * (4 * degree - 5)
            let lessThan = (periodicControlPointsLength) * (4 * degree - 5)
            for (let j = start; j < lessThan; j += 1) {
                result.set(j, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j])
                result.set(j,  i, cpy[j - start] * constraintsSign[j])
            }
        }
        return result       
    }

    compute_curvatureExtremaConstraints_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {
        let result = this.compute_curvatureExtremaConstraints_gradient_full(e, constraintsSign)
        this.currentCurvatureExtremaConstraintsGradient = result
        return result.removeRows(inactiveConstraints)
    }
    
    compute_inflectionConstraints_gradient_full( e: ExpensiveComputationResults,
        constraintsSign: number[]) {
        const sxu = e.bdsxu
        const sxuu = e.bdsxuu
        const syu = e.bdsyu
        const syuu = e.bdsyuu

        let dgx: BernsteinDecompositionR1toR1[] = []
        let dgy: BernsteinDecompositionR1toR1[] = []
        const periodicControlPointsLength = this.spline.freeControlPoints.length
        const degree = this.spline.degree    

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan);
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }

        for (let i = 0; i < periodicControlPointsLength; i += 1) {
            let start = Math.max(0, i - degree)
            let lessThan = Math.min(periodicControlPointsLength, i + 1)
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan);
            dgy.push(h10.add(h11));
        }

       const totalNumberOfConstraints = this.inflectionConstraintsSign.length

       let result = new DenseMatrix(totalNumberOfConstraints, 2 * periodicControlPointsLength)


       for (let i = 0; i < periodicControlPointsLength; i += 1) {
           let cpx = dgx[i].flattenControlPointsArray();
           let cpy = dgy[i].flattenControlPointsArray();

           let start = Math.max(0, i - degree) * (2 * degree - 2)
           let lessThan = Math.min(periodicControlPointsLength, i + 1) * (2 * degree - 2)
           for (let j = start; j < lessThan; j += 1) {
                   result.set(j, i, cpx[j - start] * constraintsSign[j])
                   result.set(j, periodicControlPointsLength + i, cpy[j - start] * constraintsSign[j])
           }
        }

       
        //Adding periodic term inside the Matrix
        // The effect of the first control points over the constraints at the end
        for (let i = 0; i < degree; i += 1) {

            // moved control point : i
            // Bernstein Decomposition index : [max(0, i - degree), min(n - degree, i + 1)]
            // N_{j, d} is zero outside [u_{j}, u_{j + d + 1} )
            // Dsu[j] = (N_{j, d})_u
            // in terms of the set of Bernstein Decomposition N_{j, d} = 0 outside [max(0, i - d), min(n - d, i + 1)]


            let start =  i - degree + periodicControlPointsLength 
            let lessThan = periodicControlPointsLength

            let h10 = this.dBasisFunctions_du[i].multiplyRange(syuu, start, lessThan)
            let h11 = syu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan).multiplyByScalar(-1)
            dgx.push((h10.add(h11)))
        }


        for (let i = 0; i < degree; i += 1) {
            let start =  i - degree + periodicControlPointsLength 
            let lessThan = periodicControlPointsLength
            
            let h10 = this.dBasisFunctions_du[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1)
            let h11 = sxu.multiplyRange(this.d2BasisFunctions_du2[i], start, lessThan)
            dgy.push(h10.add(h11))
        }


        
        for (let i = periodicControlPointsLength; i < periodicControlPointsLength + degree; i += 1) {
            // index i : moved control point + periodicControlPointsLength
            let cpx = dgx[i].flattenControlPointsArray()
            let cpy = dgy[i].flattenControlPointsArray()

            let start = Math.max(0, i - degree) * (2 * degree - 2)
            let lessThan = (periodicControlPointsLength) * (2 * degree - 2)

            for (let j = start; j < lessThan; j += 1) {
                result.set(j, i - periodicControlPointsLength, cpx[j - start] * constraintsSign[j])
                result.set(j,  i, cpy[j - start] * constraintsSign[j])
            }
        }
       return result
    }

    compute_inflectionConstraints_gradient( e: ExpensiveComputationResults,
        constraintsSign: number[], 
        inactiveConstraints: number[]) {
        let result = this.compute_inflectionConstraints_gradient_full(e, constraintsSign)
        this.currentInflectionConstraintsGradient = result
        return result.removeRows(inactiveConstraints)
    }

    computeBasisFunctionsDerivatives() {
        const n = this._spline.controlPoints.length
        const m = this._spline.freeControlPoints.length
        this._numberOfIndependentVariables = m * 2
        let diracControlPoints = zeroVector(n)
        this.dBasisFunctions_du = []
        this.d2BasisFunctions_du2 = []
        this.d3BasisFunctions_du3 = []
        for (let i = 0; i < m; i += 1) {
            diracControlPoints[i] = 1
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 1
            }
            let basisFunction = this.bSplineR1toR1Factory(diracControlPoints.slice(), this.spline.knots.slice())
            let dBasisFunction_du = basisFunction.derivative()
            let d2BasisFunction_du2 = dBasisFunction_du.derivative()
            let d3BasisFunction_du3 = d2BasisFunction_du2.derivative()
            this.dBasisFunctions_du.push(dBasisFunction_du.bernsteinDecomposition())
            this.d2BasisFunctions_du2.push(d2BasisFunction_du2.bernsteinDecomposition())
            this.d3BasisFunctions_du3.push(d3BasisFunction_du3.bernsteinDecomposition())
            diracControlPoints[i] = 0
            if (i < this.spline.degree) {
                diracControlPoints[m + i] = 0
            }
        }

    }

    step(deltaX: number[]) {
        this.spline.optimizerStep(deltaX)
        this._gradient_f0 = this.compute_gradient_f0(this._spline)
        this._f0 = this.compute_f0(this._gradient_f0)
        const e = this.expensiveComputation(this._spline)  
        const g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4)
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g)
        this._curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(g)
        const curvatureNumerator = this.curvatureNumerator(e.h4)
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator)
        this._inflectionInactiveConstraints = this.computeInactiveConstraints(curvatureNumerator)
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this._inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this._curvatureExtremaInactiveConstraints)
        this.curvatureExtremaConstraintsHessians = this.computeSymmetricRank1Update(deltaX, this.currentCurvatureExtremaConstraintsGradient, this.previousCurvatureExtremaConstraintsGradient, this.curvatureExtremaConstraintsHessians)
        this.previousCurvatureExtremaConstraintsGradient = this.currentCurvatureExtremaConstraintsGradient
        this.inflectionConstraintsHessians = this.computeSymmetricRank1Update(deltaX, this.currentInflectionConstraintsGradient, this.previousInflectionConstraintsGradient, this.inflectionConstraintsHessians)
        this.previousInflectionConstraintsGradient = this.currentInflectionConstraintsGradient
        //this.updateSymmetricRank1(deltaX, this._gradient_f)
        this.barrierHessianApproximation = removeElements(this.inflectionConstraintsHessians, this.inflectionInactiveConstraints).concat(removeElements(this.curvatureExtremaConstraintsHessians, this.curvatureExtremaInactiveConstraints))
       }

    /**
     * Update the symmetric matrix hessian with an improvement of rank 1
     * See: Jorge Nocedal and Stephen J. Wright, 
     * Numerical Optimization, Second Edition, p. 144 (The SR1 Method)
     */
    /*
     updateSymmetricRank1(step: number[], f: number[], gradient_f: MatrixInterface) {
        let m = gradient_f.shape[0] // number of constraints
        let n = gradient_f.shape[1] // number of free variables
        let deltaGradient: number[][] = []
        for (let i = 0; i < m; i += 1) {
            deltaGradient.push([])
            for (let j = 0; j < n; j += 1) {
                deltaGradient[i].push(gradient_f.get(i, j) - this.previousGradient_f.get(i, j))
            }
        }
        for (let i = 0; i < m ; i += 1) {
            const hessian = this.computeSR1(step, deltaGradient[i], this.barrierHessianApproximation[i])
            if (hessian) {
                this.barrierHessianApproximation[i] = hessian
            }
            else {
                //console.log("approximation hessian not defined")
                this.barrierHessianApproximation[i] = new SymmetricMatrix(n)
            }
        }
        for (let i = 0; i < gradient_f.shape[0]; i += 1) {
            for (let j = 0; j< gradient_f.shape[1]; j += 1) {
                this.previousGradient_f.set(i, j, gradient_f.get(i, j))
            }
        }
    }
    */

    computeSymmetricRank1Update(step: number[], gradients: MatrixInterface, previousGradients: MatrixInterface, previousHessians: SymmetricMatrix[]) {
        let m = gradients.shape[0] // number of constraints
        let n = gradients.shape[1] // number of free variables
        let deltaGradient: number[][] = []
        let result: SymmetricMatrix[] = []
        for (let i = 0; i < m; i += 1) {
            deltaGradient.push([])
            for (let j = 0; j < n; j += 1) {
                deltaGradient[i].push(gradients.get(i, j) - previousGradients.get(i, j))
            }
        }
        for (let i = 0; i < m ; i += 1) {
            const hessian = this.computeSR1(step, deltaGradient[i], previousHessians[i])
            if (hessian) {
                result.push(hessian)
            }
            else {
                //console.log("approximation hessian not defined")
                result.push(new SymmetricMatrix(n))
            }
        }
        return result
    }

    computeSR1(step: number[], deltaGradient: number[], previousHessian: SymmetricMatrix, r = 10e-8 ) {
        let m = step.length
        let result: SymmetricMatrix = new SymmetricMatrix(m)
        let v: number[] = []
        for (let i = 0; i < m; i += 1) {
            let c = 0
            for (let j = 0; j < m; j += 1 ) {
                c += previousHessian.get(i, j) * step[j]
            }
            v.push(deltaGradient[i] - c)
        }
        const vTs =  dotProduct(step, v)
        if ( vTs <= r * norm(step) * norm(v)) {
            //console.log(vTs)
            return undefined
        }
        for (let i = 0; i < m; i += 1) {
            for (let j = 0; j <= i; j += 1 ) {
                let h = previousHessian.get(i, j)
                let vvT = v[i] * v[j]
                result.set(i, j, h + vvT/vTs)
                //result.set(i, j, 0)
            }
        }
        return result
    }


}