// import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
// import { OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints } from "../bsplineOptimizationProblems/OptProblemBSplineR1toR2";
// import { Optimizer } from "../mathematics/Optimizer";
// import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
// import { CurveModel } from "../newModels/CurveModel";
// import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";

// enum ActiveControl {curvatureExtrema, inflections, both, none}

// export class DummyStrategy implements CurveControlStrategyInterface {
    
//     private _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints
//     private _optimizer: Optimizer
//     private activeOptimizer: boolean = true

//     private curveModel: ClosedCurveModel
//     private dummyCurveModel: CurveModel

//     private activeControl: ActiveControl;

//     constructor(curveModel: ClosedCurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean,
//         curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
//         this.activeControl = ActiveControl.both

//         if (!controlOfCurvatureExtrema) {
//             this.activeControl = ActiveControl.inflections
//         }
//         else if (!controlOfInflection) {
//             this.activeControl = ActiveControl.curvatureExtrema
//         }

//         if (!controlOfInflection && !controlOfCurvatureExtrema) {
//             this.activeOptimizer = false
//             //console.log("activeOptimizer in NoSlidingStrategy: " + this.activeOptimizer)
//         }

//         this.curveModel = curveModel
//         this.dummyCurveModel = new CurveModel()
//         this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.dummyCurveModel.spline.clone(), curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure);
//         this._optimizer = this.newOptimizer(this._optimizationProblem)
//     }

//     get optimizer(): Optimizer {
//         return this._optimizer;
//     }

//     get optimizationProblem(): OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints {
//         return this._optimizationProblem;
//     }

//     setWeightingFactor(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints) {
//         optimizationProblem.weigthingFactors[0] = 10
//         optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10
//         optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length-1] = 10
//         optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length*2-1] = 10
//     }

//     newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints) {
//         this.setWeightingFactor(optimizationProblem)
//         return new Optimizer(optimizationProblem)
//     }

//     resetCurve(curveModel: ClosedCurveModel) {
//         this.curveModel = curveModel
//         // this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), this.activeControl)
//         this._optimizer = this.newOptimizer(this.optimizationProblem)
//     }

//     toggleControlOfCurvatureExtrema(): void {
//         if (this.activeOptimizer === false) {
//             this.activeOptimizer = true
//             // this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.curvatureExtrema)
//             this._optimizer = this.newOptimizer(this.optimizationProblem)
//         } else if(this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
//             this.activeOptimizer = false
//         } else if (this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema && this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlInflections) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.both) {
//             // this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.inflections)
//             this._optimizer = this.newOptimizer(this.optimizationProblem)
//         } else if(this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlInflections) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.inflections ) {
//             // this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.both)
//             this._optimizer = this.newOptimizer(this.optimizationProblem)
//         } else {
//             console.log("Error in logic of toggle control over curvature extrema")
//         }
//     }

//     toggleControlOfInflections(): void {
//         if (this.activeOptimizer === false) {
//             this.activeOptimizer = true
//             // this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.inflections)
//             this._optimizer = this.newOptimizer(this.optimizationProblem)
//         } else if(this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlInflections) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.inflections) {
//             this.activeOptimizer = false
//         } else if (this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema && this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlInflections) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.both) {
//             // this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.curvatureExtrema)
//             this._optimizer = this.newOptimizer(this.optimizationProblem)
//         } else if(this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
//             // this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsNoInactiveConstraints(this.dummyCurveModel.spline.clone(), this.dummyCurveModel.spline.clone(), ActiveControl.both)
//             this._optimizer = this.newOptimizer(this.optimizationProblem)
//         } else {
//             console.log("Error in logic of toggle control over inflections")
//         }
//     }
    
//     toggleSliding(): void {
//         throw new Error("Method not implemented.");
//     }


//     optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {

//         if (this.activeOptimizer === false) return
        
//         const p = this.curveModel.spline.controlPoints[selectedControlPoint]
//         this.curveModel.setControlPointPosition(selectedControlPoint, ndcX, ndcY)
//         this.optimizationProblem.setTargetSpline(this.dummyCurveModel.spline)

//         try {
//             this.curveModel.setSpline(this.curveModel.spline)
//         }
//         catch(e) {
//             this.curveModel.setControlPointPosition(selectedControlPoint, p.x, p.y)
//             console.log(e)
//         }

//     }
// }