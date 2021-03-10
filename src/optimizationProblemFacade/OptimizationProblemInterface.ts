
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
     * The number of constraints (f.length)
     */
    numberOfConstraints: number

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
     * Update all instance properties 
     * @param deltaX Vector
     */
    step(deltaX: number[]): void


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
