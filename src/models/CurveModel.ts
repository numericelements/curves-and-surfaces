import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from "../mathematics/BSpline_R1_to_R2";
import { IObserver, IObservable } from "../designPatterns/Observer";
import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import { Vector_2d } from "../mathematics/Vector_2d";

export class CurveModel implements IObservable<BSpline_R1_to_R2_interface> {

    public spline: BSpline_R1_to_R2
    //private target: PeriodicBSpline_R1_to_R2
    private observers: IObserver<BSpline_R1_to_R2_interface>[] = []

    constructor() {
        

        //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        const deltay = -0.3
        const cp = [ [-0.5, 0.2+deltay], [-0.25, 0+deltay], [0.25, 0.1+deltay], [0.5, 0.6+deltay] ]

        const knots = [0, 0, 0, 0, 1, 1, 1, 1]
        this.spline = create_BSpline_R1_to_R2(cp, knots)
        //this.spline.insertKnot(0.1)
        //this.spline.insertKnot(0.2)
        //this.spline.insertKnot(1/3)
        //this.spline.insertKnot(0.4)
        //this.spline.insertKnot(0.5)
        //this.spline.insertKnot(2/3)
        //this.spline.insertKnot(0.7)
        //this.spline.insertKnot(0.8)
        //this.spline.insertKnot(0.9)


        


/*
       const cp = [ [-0.5, 0.5], [-0.35, 0.4], [-0.2, 0], [0.2, 0], [0.35, 0.4], [0.5, 0.5] ]
       const knots = [0, 0, 0, 0, 0, 0,  1, 1, 1, 1, 1, 1]
       this.spline = create_BSpline_R1_to_R2(cp, knots)
*/


/*
       const cp = [ [-0.5, 0.5], [-0.35, 0.4], [0, 0], [0.35, 0.4], [0.5, 0.5] ]
       const knots = [0, 0, 0, 0, 0,  1, 1, 1, 1, 1]
       this.spline = create_BSpline_R1_to_R2(cp, knots)
*/



       //this.spline.insertKnot(0.1)
       //this.spline.insertKnot(0.2)
       //this.spline.insertKnot(0.3)
       //this.spline.insertKnot(0.4)
       //this.spline.insertKnot(0.5)
       //this.spline.insertKnot(0.6)
       //this.spline.insertKnot(0.7)
       //this.spline.insertKnot(0.8)
       //this.spline.insertKnot(0.9)
    
    
/*
       
       const cp = [ [-0.5, 0.5], [-0.35, 0.4], [-0.2, 0], [0.2, 0], [0.35, 0.4] ]
       const knots = [0, 0, 0, 0, 0,  1, 1, 1, 1, 1]
       this.spline = create_BSpline_R1_to_R2(cp, knots)
*/     

        
        /*
        let knots = [0, 0, 0, 0]
        const n = 20
        for (let i = 1; i < n; i += 1) {
            knots.push(i/n)
        }
        knots.push(1)
        knots.push(1)
        knots.push(1)
        knots.push(1)        
        const cp = [ [0.975, 0.248], [0.902, 0.294], [0.876, 0.397], [0.773, 0.466], [0.775, 0.486], [0.822, 0.517], [0.819, 0.535], [0.795, 0.543], [0.788, 0.559], [0.846, 0.572], [0.793, 0.589], [0.792, 0.603], [0.807, 0.613], [0.831, 0.626], [0.801, 0.660], [0.800, 0.699], [0.819, 0.724], [0.863, 0.736], [0.917, 0.720], [0.958, 0.753], [0.943, 0.814], [0.988, 0.873], [0.995, 0.943] ]

        for (let i = 0; i < cp.length; i += 1) {
            cp[i][0] -= 0.9
            cp[i][1] -= 0.6
        }

        for (let i = 0; i < cp.length; i += 1) {
            cp[i][0] = cp[i][0] * 2.5
            cp[i][1] = -cp[i][1] * 2.5
        }

        this.spline = create_BSpline_R1_to_R2(cp, knots)
        */
        
        
               

    }


    registerObserver(observer: IObserver<BSpline_R1_to_R2_interface>) {
        this.observers.push(observer)
    }

    removeObserver(observer: IObserver<BSpline_R1_to_R2_interface>) {
        this.observers.splice(this.observers.indexOf(observer), 1)
    }

    notifyObservers() {
        for (let i = 0; i < this.observers.length; i += 1) {
            this.observers[i].update(this.spline)
        }
    }

    moveControlPoint(controlPointIndex: number, deltaX: number, deltaY: number) {
        this.spline.moveControlPoint(controlPointIndex, deltaX, deltaY)
        if (deltaX*deltaX + deltaY*deltaY > 0) {
            this.notifyObservers()
        }
    }

    
    setControlPoint(controlPointIndex: number, x: number, y: number) {
        this.spline.setControlPoint(controlPointIndex, new Vector_2d(x, y))
        //this.notifyObservers()
    }

    setControlPoints(controlPoints: Vector_2d[]) {
        this.spline.setControlPoints(controlPoints)
        //this.notifyObservers()
    }

    setSpline(spline: BSpline_R1_to_R2) {
        this.spline = spline
        this.notifyObservers()
    }
    




}