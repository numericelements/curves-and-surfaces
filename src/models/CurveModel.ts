// import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
// import { IObserver, IObservable } from "../designPatterns/Observer";
// import { BSpline_R1_to_R2_interface } from "../bsplines/BSplineInterfaces";
// import { Vector_2d } from "../mathematics/Vector_2d";

// export const DEFAULT_CURVE_DEGREE = 3;

// export class CurveModel implements IObservable<BSpline_R1_to_R2_interface> {

//     public spline: BSpline_R1_to_R2
//     //private target: PeriodicBSpline_R1_to_R2
//     private _observers: IObserver<BSpline_R1_to_R2_interface>[] = []

//     //constructor() {
//     constructor(existingKnots?: number[], existingControlPoints?: Array<Vector_2d>) {   
//         //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
//         const deltay = -0.3
//         const cp = [ [-0.5, 0.2+deltay], [-0.25, 0+deltay], [0.25, 0.1+deltay], [0.5, 0.6+deltay] ]

//         /* JCL 2020/10/19 Creation of control polygon as an Array<Vector_2d> */
//         let controlPolygon: Array<Vector_2d> = []
//         for(let i = 0; i < cp.length; i += 1) {
//             let controlPoint = new Vector_2d
//             controlPoint.x = cp[i][0]
//             controlPoint.y = cp[i][1]
//             controlPolygon.push(controlPoint)
//         }

//         const knots = [0, 0, 0, 0, 1, 1, 1, 1]
//         this.spline = create_BSpline_R1_to_R2(controlPolygon, knots)

//         if((!existingKnots && existingControlPoints) || (existingKnots && !existingControlPoints)) {
//             console.log("CurveModel: Creation of B-Spline. The control polygon and/or knot vector input is inconsistent. Turned into a default curve creation.")
//         } else if(!existingKnots && !existingControlPoints) {
//             console.log("CurveModel: Creation of B-Spline. Use a default curve.")
//         }
//          else if(existingKnots && existingControlPoints) {
//             this.spline = create_BSpline_R1_to_R2(existingControlPoints, existingKnots)
//         }
//         //this.spline.insertKnot(0.1)
//         //this.spline.insertKnot(0.2)
//         //this.spline.insertKnot(1/3)
//         //this.spline.insertKnot(0.4)
//         //this.spline.insertKnot(0.5)
//         //this.spline.insertKnot(2/3)
//         //this.spline.insertKnot(0.7)
//         //this.spline.insertKnot(0.8)
//         //this.spline.insertKnot(0.9)


        


// /*
//        const cp = [ [-0.5, 0.5], [-0.35, 0.4], [-0.2, 0], [0.2, 0], [0.35, 0.4], [0.5, 0.5] ]
//        const knots = [0, 0, 0, 0, 0, 0,  1, 1, 1, 1, 1, 1]
//        this.spline = create_BSpline_R1_to_R2(cp, knots)
// */



//        /*const cp = [ [-0.5, 0.5], [-0.35, 0.4], [0, 0], [0.35, 0.4], [0.5, 0.5] ]
//        const knots = [0, 0, 0, 0, 0,  1, 1, 1, 1, 1]
//        this.spline = create_BSpline_R1_to_R2(cp, knots)*/




//        //this.spline.insertKnot(0.1)
//        //this.spline.insertKnot(0.2)
//        //this.spline.insertKnot(0.3)
//        //this.spline.insertKnot(0.4)
//        //this.spline.insertKnot(0.5)
//        //this.spline.insertKnot(0.6)
//        //this.spline.insertKnot(0.7)
//        //this.spline.insertKnot(0.8)
//        //this.spline.insertKnot(0.9)
    
    

//        /*
//        const cp = [ [-0.5, 0.5], [-0.35, 0.4], [-0.2, 0], [0.2, 0], [0.35, 0.4] ]
//        const knots = [0, 0, 0, 0, 0,  1, 1, 1, 1, 1]
//        this.spline = create_BSpline_R1_to_R2(cp, knots)
//         */

        
//         /*
//         let knots = [0, 0, 0, 0]
//         const n = 20
//         for (let i = 1; i < n; i += 1) {
//             knots.push(i/n)
//         }
//         knots.push(1)
//         knots.push(1)
//         knots.push(1)
//         knots.push(1)        
//         const cp = [ [0.975, 0.248], [0.902, 0.294], [0.876, 0.397], [0.773, 0.466], [0.775, 0.486], [0.822, 0.517], [0.819, 0.535], [0.795, 0.543], [0.788, 0.559], [0.846, 0.572], [0.793, 0.589], [0.792, 0.603], [0.807, 0.613], [0.831, 0.626], [0.801, 0.660], [0.800, 0.699], [0.819, 0.724], [0.863, 0.736], [0.917, 0.720], [0.958, 0.753], [0.943, 0.814], [0.988, 0.873], [0.995, 0.943] ]

//         for (let i = 0; i < cp.length; i += 1) {
//             cp[i][0] -= 0.9
//             cp[i][1] -= 0.6
//         }

//         for (let i = 0; i < cp.length; i += 1) {
//             cp[i][0] = cp[i][0] * 2.5
//             cp[i][1] = -cp[i][1] * 2.5
//         }

//         this.spline = create_BSpline_R1_to_R2(cp, knots)
//         */
        
//     }

//     get observers() {
//         return this._observers;
//     }

//     registerObserver(observer: IObserver<BSpline_R1_to_R2_interface>) {
//         this._observers.push(observer)
//     }

//     removeObserver(observer: IObserver<BSpline_R1_to_R2_interface>) {
//         this._observers.splice(this.observers.indexOf(observer), 1)
//     }

//     notifyObservers() {
//         for (let observer of this.observers) {
//             observer.update(this.spline);
//         }
//     }

//     moveControlPoint(controlPointIndex: number, deltaX: number, deltaY: number) {
//         this.spline.moveControlPoint(controlPointIndex, deltaX, deltaY)
//         if (deltaX*deltaX + deltaY*deltaY > 0) {
//             this.notifyObservers()
//         }
//     }

//     setControlPoint(controlPointIndex: number, x: number, y: number) {
//         this.spline.setControlPoint(controlPointIndex, new Vector_2d(x, y))
//         //this.notifyObservers()
//     }

//     setControlPoints(controlPoints: Vector_2d[]) {
//         this.spline.setControlPoints(controlPoints)
//         //this.notifyObservers()
//     }

//     setSpline(spline: BSpline_R1_to_R2) {
//         this.spline = spline
//         this.notifyObservers()
//     }
// }