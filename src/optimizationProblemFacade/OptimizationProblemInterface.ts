
import { SymmetricMatrixInterface } from "../linearAlgebra/MatrixInterfaces";
import { MatrixInterface } from "../linearAlgebra/MatrixInterfaces"


/**
 * The optimization quadratic model interface
 */
export interface OptimizationProblemInterface {

    /**
     * The number of independent variables (x.length)
     */
    numberOfIndependentVariables: number

    /**
     * The objective function value: f0(x).  
     * Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe p. 1
     */
    f0: number

    /**
     * The objective function gradient: gradient_f0(x)
     */
    gradient_f0: number[]

    /**
     * The objective function hessian: hessian_f0(x)
     */
    hessian_f0: SymmetricMatrixInterface

    /**
     * The vector of inequality constraint functions values: f_i(x) <= 0
     * Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe p. 1
     */
    f: number[]

    /**
     * The constraint functions gradients: gradient_f(x) 
     */
    gradient_f: MatrixInterface

    /**
     * The (optional) constraint functions hessians: hessian_f(x) 
     */
    hessian_f?: SymmetricMatrixInterface[]

    /**
     * The number of constraints (f.length)
     */
    numberOfConstraints: number

    /**
     * Update all instance properties 
     * @param deltaX Vector
     * JCL returns true if the curve is not analyzed or if the curve is analyzed but has no new differential event. If the number of differential has been modified by the update, returns false
     */
    step(deltaX: number[]): boolean


    /**
     * Returns the vector of constraint functions values: f(x + step)
     * without updating any instance properties
     */
    fStep(deltaX: number[]): number[]

    /**
     * Returns the cost function value: f0(x + step)
     * without updating any instance properties
     */
    f0Step(deltaX: number[]): number


}
