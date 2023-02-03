// import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
// import { IObserver, IObservable } from "../designPatterns/Observer";
// import { BSpline_R1_to_R2_interface } from "../bsplines/BSplineInterfaces";
// import { Vector_2d } from "../mathematics/Vector_2d";
// import { WarningLog } from "../errorProcessing/ErrorLoging";

// export abstract class CurveModels2D implements IObservable<BSpline_R1_to_R2_interface> {

//     protected observers: IObserver<BSpline_R1_to_R2_interface>[] = [];

//     registerObserver(observer: IObserver<BSpline_R1_to_R2_interface>): void {
//         this.observers.push(observer)
//     }

//     removeObserver(observer: IObserver<BSpline_R1_to_R2_interface>): void {
//         this.observers.splice(this.observers.indexOf(observer), 1)
//     }

//     abstract notifyObservers(): void;

// }

// export class OpenCurveModel2D extends  CurveModels2D {

//     public spline: BSpline_R1_to_R2;

//     constructor(existingKnots?: number[], existingControlPoints?: Array<Vector_2d>) {
//         super();
//         // Set up a pre-defined control polygon to start the modelling process
//         const deltay = -0.3;
//         const cp = [ [-0.5, 0.2+deltay], [-0.25, 0+deltay], [0.25, 0.1+deltay], [0.5, 0.6+deltay] ];

//         let controlPolygon: Array<Vector_2d> = [];
//         for(let vertex of cp) {
//             let controlPoint = new Vector_2d;
//             controlPoint.x = vertex[0];
//             controlPoint.y = vertex[1];
//             controlPolygon.push(controlPoint);
//         }

//         const knots = [0, 0, 0, 0, 1, 1, 1, 1];
//         this.spline = create_BSpline_R1_to_R2(controlPolygon, knots);

//         if((!existingKnots && existingControlPoints) || (existingKnots && !existingControlPoints)) {
//             let warning = new WarningLog(this.constructor.name, "constructor", "Creation of B-Spline. The control polygon and/or knot vector input is inconsistent. Turned into a default curve creation.");
//             warning.logMessageToConsole();
//         } else if(!existingKnots && !existingControlPoints) {
//             let warning = new WarningLog(this.constructor.name, "constructor", "Creation of B-Spline. Use a default curve.");
//             warning.logMessageToConsole();
//         } else if(existingKnots && existingControlPoints) {
//             this.spline = create_BSpline_R1_to_R2(existingControlPoints, existingKnots);
//         }
//     }

//     notifyObservers() {
//         for(let anObserver of this.observers) {
//             anObserver.update(this.spline);
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

// export class ClosedCurveModel2D extends  CurveModels2D {

//     // public spline: PeriodicBSpline_R1_to_R2;
//     public spline: BSpline_R1_to_R2;

//     constructor(existingKnots?: number[], existingControlPoints?: Array<Vector_2d>) {
//         super();
//         // Set up a pre-defined control polygon to start the modelling process
//         const deltay = -0.3;
//         const cp = [ [-0.5, 0.2+deltay], [-0.25, 0+deltay], [0.25, 0.1+deltay], [0.5, 0.6+deltay] ];

//         let controlPolygon: Array<Vector_2d> = [];
//         for(let vertex of cp) {
//             let controlPoint = new Vector_2d;
//             controlPoint.x = vertex[0];
//             controlPoint.y = vertex[1];
//             controlPolygon.push(controlPoint);
//         }
//         const knots = [0, 0, 0, 0, 1, 1, 1, 1];
//         this.spline = create_BSpline_R1_to_R2(controlPolygon, knots);
//     }

//     notifyObservers() {
//         for(let anObserver of this.observers) {
//             anObserver.update(this.spline);
//         }
//     }

//     setSpline(spline: BSpline_R1_to_R2) {
//         this.spline = spline
//         this.notifyObservers()
//     }
// }