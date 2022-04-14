import { DenseMatrix } from "../linearAlgebra/DenseMatrix";
import { SymmetricMatrix } from "../linearAlgebra/SymmetricMatrix";
import { IOptimizationProblem } from "./IOptimizationProblem";

export class OptimizationProblemForTests implements IOptimizationProblem {



    constructor(private _x: number, private _y: number, private a: number, private b: number) {
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }


    get numberOfIndependentVariables() {
        // x and y
        return 2
    }

    get f0() {
        // (x + a)^2 + (y + b)^2 
        // minimum value at x = -a and y = -b
        return Math.pow(this._x + this.a, 2) + Math.pow(this._y + this.b, 2) 
    }

    get gradient_f0() {
        // df0/dx = 2 (x + a)
        // df0/dy = 2 (y + b)
        return [2 * (this._x + this.a), 2 * (this._y + this.b)]
    }

    get hessian_f0() {
        // d2f0/dx2 = 2
        // d2f0/dy2 = 2
        // d2f0/dxdy = 0
        return new SymmetricMatrix(2, [2, 0, 2])
    }
 
    get numberOfConstraints() {
        return 1
    }

    get f() {
        //https://en.wikipedia.org/wiki/Implicit_curve
        // Cassini ovals
        // (x^2 + y^2)^2 - 2(x^2 - y^2) - 0.5 = 0
        const x = this._x
        const y = this._y
        return [Math.pow((x*x + y*y), 2)-2*(x*x-y*y) - 0.5]
    }

    get gradient_f() {
        // f = x^4 + 2x^2y^2 + y^4 - 2x^2 + 2y^2 - 0.5
        // df/dx = 4 x^3 + 4 x y^2 - 4 x
        // df/dy = 4 x^2 y + 4 y^3 + 4 y
        const x = this._x
        const y = this._y
        return new DenseMatrix(1, 2, [4*x*x*x + 4*x*y*y - 4*x, 4*x*x*y + 4*y*y*y + 4*y])
    }
 
     get hessian_f() {
         // d2f/dx2 = 12 x^2 + 4 y^2 - 4
         // d2f/dy2 = 4 x^2 + 12 y^2 + 4
         // d2f/dxdy = 8xy 
         //return undefined
         
         const x = this._x
         const y = this._y
         return [new SymmetricMatrix(2, [12*x*x + 4*y*y - 4, 8*x*y, 4*x*x + 12*y*y + 4])]
         
     }
 
     /**
      * Update all instance properties 
      * @param deltaX Vector
      */
     step(deltaX: number[]) {
         this._x += deltaX[0]
         this._y += deltaX[1]
     }
 
 
     fStep(deltaX: number[]) {
        const x = this._x + deltaX[0]
        const y = this._y + deltaX[1]
        return [Math.pow((x*x + y*y), 2)-2*(x*x-y*y) - 0.5]
     }
 
     f0Step(deltaX: number[]) {
        const x = this._x + deltaX[0]
        const y = this._y + deltaX[1]
        return Math.pow(x + this.a, 2) + Math.pow(y + this.b, 2) 
     }
 

}

export class ConvexOptimizationProblemForTests implements IOptimizationProblem {


    constructor(private _x: number, private _y: number, private a: number, private b: number) {
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }


    get numberOfIndependentVariables() {
        // x and y
        return 2
    }

    get f0() {
        // (x + a)^2 + (y + b)^2 
        // minimum value at x = -a and y = -b
        return Math.pow(this._x + this.a, 2) + Math.pow(this._y + this.b, 2) 
    }

    get gradient_f0() {
        // df0/dx = 2 (x + a)
        // df0/dy = 2 (y + b)
        return [2 * (this._x + this.a), 2 * (this._y + this.b)]
    }

    get hessian_f0() {
        // d2f0/dx2 = 2
        // d2f0/dy2 = 2
        // d2f0/dxdy = 0
        return new SymmetricMatrix(2, [2, 0, 2])
    }
 
    get numberOfConstraints() {
        return 1
    }

    get f() {
        // Ellipse
        // 2x^2 + y^2 = 1
        const x = this._x
        const y = this._y
        return [2*x*x + y*y - 1]
    }

    get gradient_f() {
        // df/dx = 4x
        // df/dy = 2y
        const x = this._x
        const y = this._y
        return new DenseMatrix(1, 2, [4*x, 2*y])
    }
 
     get hessian_f() {
         // d2f/dx2 = 4
         // d2f/dy2 = 2
         // d2f/dxdy = 0 
         //return undefined
         return [new SymmetricMatrix(2, [4, 0, 2])]
     }
 
     /**
      * Update all instance properties 
      * @param deltaX Vector
      */
     step(deltaX: number[]) {
         this._x += deltaX[0]
         this._y += deltaX[1]
     }
 
 
     fStep(deltaX: number[]) {
        const x = this._x + deltaX[0]
        const y = this._y + deltaX[1]
        return [2*x*x + y*y - 1]

     }
 
     f0Step(deltaX: number[]) {
        const x = this._x + deltaX[0]
        const y = this._y + deltaX[1]
        return Math.pow(x + this.a, 2) + Math.pow(y + this.b, 2) 
     }
 

}

export class ConvexOptimizationProblemForTestsNoConstraintsHessians implements IOptimizationProblem {


    constructor(private _x: number, private _y: number, private a: number, private b: number) {
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }


    get numberOfIndependentVariables() {
        // x and y
        return 2
    }

    get f0() {
        // (x + a)^2 + (y + b)^2 
        // minimum value at x = -a and y = -b
        return Math.pow(this._x + this.a, 2) + Math.pow(this._y + this.b, 2) 
    }

    get gradient_f0() {
        // df0/dx = 2 (x + a)
        // df0/dy = 2 (y + b)
        return [2 * (this._x + this.a), 2 * (this._y + this.b)]
    }

    get hessian_f0() {
        // d2f0/dx2 = 2
        // d2f0/dy2 = 2
        // d2f0/dxdy = 0
        return new SymmetricMatrix(2, [2, 0, 2])
    }
 
    get numberOfConstraints() {
        return 1
    }

    get f() {
        // Ellipse
        // 2x^2 + y^2 = 1
        const x = this._x
        const y = this._y
        return [2*x*x + y*y - 1]
    }

    get gradient_f() {
        // df/dx = 4x
        // df/dy = 2y
        const x = this._x
        const y = this._y
        return new DenseMatrix(1, 2, [4*x, 2*y])
    }
 
     get hessian_f() {
         // d2f/dx2 = 4
         // d2f/dy2 = 2
         // d2f/dxdy = 0 
         return undefined
         //return [new SymmetricMatrix(2, [4, 0, 2])]
     }
 
     /**
      * Update all instance properties 
      * @param deltaX Vector
      */
     step(deltaX: number[]) {
         this._x += deltaX[0]
         this._y += deltaX[1]
     }
 
 
     fStep(deltaX: number[]) {
        const x = this._x + deltaX[0]
        const y = this._y + deltaX[1]
        return [2*x*x + y*y - 1]

     }
 
     f0Step(deltaX: number[]) {
        const x = this._x + deltaX[0]
        const y = this._y + deltaX[1]
        return Math.pow(x + this.a, 2) + Math.pow(y + this.b, 2) 
     }
 

}