import { BSplineR1toR2Interface } from "../bsplines/BSplineR1toR2Interface";
import { SymmetricMatrixInterface, MatrixInterface } from "../linearAlgebra/MatrixInterfaces";
import { OptimizationProblemBSplineR1toR2Interface } from "./OptimizationProblemBSplineR1toR2Interface";


export enum ActiveControl {curvatureExtrema, inflections, both}
export abstract class AbstractOptimizationProblemBSplineR1toR2 implements OptimizationProblemBSplineR1toR2Interface {
    
    abstract spline: BSplineR1toR2Interface
    abstract numberOfIndependentVariables: number
    abstract f0: number
    abstract gradient_f0: number[]
    abstract hessian_f0: SymmetricMatrixInterface
    abstract numberOfConstraints: number
    abstract f: number[]
    abstract gradient_f: MatrixInterface
    abstract hessian_f?: SymmetricMatrixInterface[] | undefined
    
    abstract step(deltaX: number[]): void 
    abstract fStep(deltaX: number[]): number[] 
    abstract f0Step(deltaX: number[]): number 
    abstract setTargetSpline(spline: BSplineR1toR2Interface): void

}