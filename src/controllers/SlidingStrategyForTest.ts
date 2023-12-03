// import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
// import { OptProblemBSplineR1toR2, OptProblemBSplineR1toR2WithWeigthingFactors, OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics, OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation } from "../bsplineOptimizationProblems/OptProblemBSplineR1toR2";
// import { Optimizer } from "../mathematics/Optimizer";
// import { CurveModel } from "../newModels/CurveModel";
// import { type } from "os";
// import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
// import { OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";

// enum ActiveControl {curvatureExtrema, inflections, both, none}

// export enum NeighboringEventsType {neighboringCurExtremumLeftBoundary, neighboringInflectionLeftBoundary, 
//                                 neighboringCurExtremumRightBoundary, neighboringInflectionRightBoundary,
//                                 neighboringCurvatureExtrema, neighboringInflectionsCurvatureExtremum, none,
//                                 neighboringCurvatureExtremaAppear, neighboringCurvatureExtremaDisappear,
//                                 neighboringInflectionsCurvatureExtremumAppear, neighboringInflectionsCurvatureExtremumDisappear,
//                                 neighboringCurExtremumLeftBoundaryAppear, neighboringCurExtremumLeftBoundaryDisappear,
//                                 neighboringCurExtremumRightBoundaryAppear, neighboringCurExtremumRightBoundaryDisappear}
// export interface NeighboringEvents {event: NeighboringEventsType; index: number; value?: number; valueOptim?: number; locExt?: number; locExtOptim?: number; variation?: number[];
//     span?: number; range?: number; knotIndex?: number}
// export enum DiffEventType {inflection, curvatExtremum, unDefined}
// export interface DifferentialEvent {event: DiffEventType; loc: number}
// enum Direction {Forward, Reverse}

// interface modifiedEvents {inter: number, nbE: number}
// export interface intervalsCurvatureExt {span: number, sequence: number[]}
// interface intermediateKnotWithNeighborhood {knot: number, left: number, right: number, index: number}
// interface extremaNearKnot {kIndex: number, extrema: Array<number>}

// const DEVIATION_FROM_KNOT = 0.25

// export class SlidingStrategyForTest implements CurveControlStrategyInterface {

    
//     //private optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors
//     private _optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation
//     //private optimizer: Optimizer
//     public optimizer: Optimizer
//     private activeOptimizer: boolean = true

//     private curveModel: CurveModel
//     public lastDiffEvent: NeighboringEventsType

//     constructor(curveModel: CurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean,
//         curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
//         this.curveModel = curveModel
//         let activeControl : ActiveControl = ActiveControl.both

//         if (!controlOfCurvatureExtrema) {
//             activeControl = ActiveControl.inflections
//         }
//         else if (!controlOfInflection) {
//             activeControl = ActiveControl.curvatureExtrema
//         } 

//         if (!controlOfInflection && !controlOfCurvatureExtrema) {
//             this.activeOptimizer = false
//             //console.log("activeOptimizer in SlidingStrategy: " + this.activeOptimizer)
//         }

//         /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
//         if(curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
//             this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure,
//             curveShapeSpaceNavigator.navigationCurveModel);
//         } else {
//             const navigationCurveModel = new OpenCurveShapeSpaceNavigator(curveShapeSpaceNavigator);
//             this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure,
//             navigationCurveModel)
//         }
//         //this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
//         /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
//         this.optimizer = this.newOptimizer(this._optimizationProblem)
//         this.lastDiffEvent = NeighboringEventsType.none
//     }

//     get optimizationProblem(): OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation {
//         return this._optimizationProblem;
//     }

//     setWeightingFactor(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
//     //setWeightingFactor(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors) {
//         optimizationProblem.weigthingFactors[0] = 10
//         optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10
//         optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length-1] = 10
//         optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length*2-1] = 10
//     }

//     newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation) {
//     //newOptimizer(optimizationProblem: OptProblemBSplineR1toR2WithWeigthingFactors) {
//         this.setWeightingFactor(optimizationProblem)
//         return new Optimizer(optimizationProblem)
//     }

//     resetCurve(curveModel: CurveModel) {
//         this.curveModel = curveModel
//         // this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
//         //this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone())
//         /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
//         this.optimizer = this.newOptimizer(this.optimizationProblem)
//     }

//     toggleControlOfCurvatureExtrema(): void {
//         if (this.activeOptimizer === false) {
//             this.activeOptimizer = true
//             // this._optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
//             //this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
//             /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema) */
//             this.optimizer = this.newOptimizer(this.optimizationProblem)
//         } else if(this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
//             this.activeOptimizer = false
//         } else if (this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema && this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlInflections) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.both) {
//             // this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
//             //this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
//             /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections) */
//             this.optimizer = this.newOptimizer(this.optimizationProblem)
//         } else if(this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlInflections) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.inflections ){
//             // this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
//             //this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
//             /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both) */
//             this.optimizer = this.newOptimizer(this.optimizationProblem)
//         } else {
//             console.log("Error in logic of toggle control over curvature extrema")
//         }
//     }

//     toggleControlOfInflections(): void {
//         if (this.activeOptimizer === false) {
//             this.activeOptimizer = true
//             // this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
//             //this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
//             /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)*/
//             this.optimizer = this.newOptimizer(this.optimizationProblem)
//         } else if(this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlInflections) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.inflections) {
//             this.activeOptimizer = false
//         } else if (this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema && this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlInflections) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.both) {
//             // this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
//             //this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
//             /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema) */
//             this.optimizer = this.newOptimizer(this.optimizationProblem)
//         } else if(this.optimizationProblem.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema) {
//         // } else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
//             // this._optimizationProblem = new OptProblemBSplineR1toR2WithWeigthingFactorsGeneralNavigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
//             //this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
//             /*this.optimizationProblem = new  OptProblemBSplineR1toR2WithWeigthingFactorsDedicatedToCubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both) */
//             this.optimizer = this.newOptimizer(this.optimizationProblem)
//         }
//         else {
//             console.log("Error in logic of toggle control over inflections")
//         }
//     }
    
//     toggleSliding(): void {
//         throw new Error("Method not implemented.");
//     }


//     generateSequenceDifferentialEvents(curvatureExtrema: number[], inflections: number[]): Array<DifferentialEvent> {
//         let result: Array<DifferentialEvent> =  []
//         let j = 0
//         //console.log("curvature " + curvatureExtrema.length + " inflection " + inflections.length)
//         for(let i=0; i < curvatureExtrema.length; i += 1) {
//             if(curvatureExtrema[i] > inflections[j]) {
//                 while(curvatureExtrema[i] > inflections[j]) {
//                     result.push({event: DiffEventType.inflection, loc: inflections[j]})
//                     j += 1
//                 }
//             } 
//             result.push({event: DiffEventType.curvatExtremum, loc: curvatureExtrema[i]})
//         }
//         if(j < inflections.length) {
//             result.push({event: DiffEventType.inflection, loc: inflections[j]})
//             j += 1
//         }
//         if(j < inflections.length) {
//             throw new Error("Inconsistent sequence of differential events that terminates with multiple inflections")
//         } else if(result.length !== curvatureExtrema.length + inflections.length) {
//             throw new Error("Inconsistent length of sequence of differential events")
//         }
//         return result
//     }

//     computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents: Array<DifferentialEvent>, inflectionIndices: number[], lostEvents: Array<modifiedEvents>): intervalsCurvatureExt {
//         let interval = 1.0
//         let intervalExtrema: intervalsCurvatureExt = {span: interval, sequence: []}
//         if(inflectionIndices.length === 0 && orderedDifferentialEvents.length === 0) {
//             intervalExtrema.span = interval
//             intervalExtrema.sequence.push(interval)
//         } else if(inflectionIndices.length === 0 && orderedDifferentialEvents.length > 0) {
//             intervalExtrema.span = interval
//             intervalExtrema.sequence.push(orderedDifferentialEvents[0].loc)
//             for(let k = 0; k < orderedDifferentialEvents.length - 1; k += 1) {
//                 intervalExtrema.sequence.push(orderedDifferentialEvents[k + 1].loc - orderedDifferentialEvents[k].loc)
//             }
//             intervalExtrema.sequence.push(1.0 - orderedDifferentialEvents[orderedDifferentialEvents.length - 1].loc)

//         } else if(lostEvents[0].inter === inflectionIndices.length && inflectionIndices[length - 1] < (orderedDifferentialEvents.length - 1)) {
//             intervalExtrema.span = 1.0 - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter - 1]].loc
//             for(let k = inflectionIndices[inflectionIndices.length - 1]; k < orderedDifferentialEvents.length - 1; k += 1) {
//                 intervalExtrema.sequence.push(orderedDifferentialEvents[k + 1].loc - orderedDifferentialEvents[k].loc)
//             }
//             intervalExtrema.sequence.push(1.0 - orderedDifferentialEvents[orderedDifferentialEvents.length - 1].loc)

//         } else if(lostEvents[0].inter === 0 && inflectionIndices[0] > 0) {
//             intervalExtrema.span = orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter]].loc
//             intervalExtrema.sequence.push(orderedDifferentialEvents[0].loc)
//             for(let k = 1; k < inflectionIndices[lostEvents[0].inter]; k += 1) {
//                 intervalExtrema.sequence.push(orderedDifferentialEvents[k].loc - orderedDifferentialEvents[k - 1].loc)
//             }
//             intervalExtrema.sequence.push(intervalExtrema.span - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter] - 1].loc);

//         } else if(lostEvents[0].inter === 0 && inflectionIndices[0] === 0) {
//             intervalExtrema.span = orderedDifferentialEvents[0].loc;
//             intervalExtrema.sequence.push(intervalExtrema.span);

//         } else if(inflectionIndices.length > 1 && lostEvents[0].inter < inflectionIndices.length) {
//             intervalExtrema.span = orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter]].loc - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter - 1]].loc
//             for(let k = inflectionIndices[lostEvents[0].inter - 1] + 1; k < inflectionIndices[lostEvents[0].inter]; k += 1) {
//                 intervalExtrema.sequence.push(orderedDifferentialEvents[k].loc - orderedDifferentialEvents[k - 1].loc)
//             }
//             intervalExtrema.sequence.push(orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter]].loc - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter] - 1].loc)
//         } else if(inflectionIndices[lostEvents[0].inter] - inflectionIndices[lostEvents[0].inter - 1] < 4) {
//             /* JCL A minimum of four intervals is required to obtain a meaningful loss of curvature extrema */
//             console.log("Inconsistent number of curvature extrema in the current interval of inflections. Number too small.")
//         }

//         return intervalExtrema
//     }

//     indexSmallestInterval(intervalExtrema: intervalsCurvatureExt, nbEvents: number): number {
//         let candidateEventIndex = -1
//         let ratio: number[] = []
//         if(nbEvents === 1 && intervalExtrema.sequence.length > 1) {
//             /* JCL Look at first and last intervals only. Other intervals add noise to get a consistent candidate interval */
//             ratio.push(intervalExtrema.sequence[0]/intervalExtrema.span)
//             ratio.push(intervalExtrema.sequence[intervalExtrema.sequence.length - 1]/intervalExtrema.span)
//             if(ratio[0] < ratio[1]) candidateEventIndex = 0
//             else candidateEventIndex = intervalExtrema.sequence.length - 1

//         } else if(nbEvents === 2 && intervalExtrema.sequence.length > 2) {
//             for(let k = 0; k < intervalExtrema.sequence.length; k += 1) {
//                 ratio.push(intervalExtrema.sequence[k]/intervalExtrema.span)
//             }
//             let mappedRatio = ratio.map(function(location, i) {
//                 return { index: i, value: location };
//               })
//             mappedRatio.sort(function(a, b) {
//                 if (a.value > b.value) {
//                   return 1;
//                 }
//                 if (a.value < b.value) {
//                   return -1;
//                 }
//                 return 0;
//             })
//             candidateEventIndex = mappedRatio[0].index
//             /* JCL Take into account the optional number of events  */
//             /* if the number of events removed equals 2 smallest intervals at both extremities can be removed because */
//             /* they are of different types of there no event if it is a free extremity of the curve */
//             if(mappedRatio[0].index === 0 || mappedRatio[0].index === intervalExtrema.sequence.length - 1) {
//                 candidateEventIndex = mappedRatio[1].index
//                 if(mappedRatio[1].index === 0 || mappedRatio[1].index === intervalExtrema.sequence.length - 1) {
//                     candidateEventIndex = mappedRatio[2].index
//                 }
//             } 
//         } else console.log("Inconsistent number of events (Must be a positive number not larger than two) or inconsistent number of intervals between curvature extrema.")

//         return candidateEventIndex
//     }

//     indexIntervalMaximalVariation(intervalsExtrema: intervalsCurvatureExt, intervalsExtremaOptim: intervalsCurvatureExt, candidateEvent: number, nbEvents: number, scan: Direction): {index: number, value: number} {
//         let intervalIndex = -1
//         let maxRatio = {index: intervalIndex, value: 0}
//         if(scan === Direction.Forward) {
//             let upperBound = candidateEvent
//             let lowerBound = 0
//             /* JCL To process intervals that are uniquely bounded by events */
//             if(Math.abs(nbEvents) === 2 && candidateEvent > 1) lowerBound = 1

//             if(candidateEvent === 1) {
//                 if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
//                     maxRatio.value = 1.0/(intervalsExtrema.sequence[0]/intervalsExtrema.span)
//                 } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
//                     maxRatio.value = 1.0/(intervalsExtremaOptim.sequence[0]/intervalsExtrema.span)
//                 }
//                 maxRatio.index = 0
//             }
//             for(let k = lowerBound; k < upperBound; k += 1) {
//                 let currentRatio = 1.0
//                 if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
//                     currentRatio = (intervalsExtremaOptim.sequence[k]/intervalsExtremaOptim.span)/(intervalsExtrema.sequence[k]/intervalsExtrema.span)
//                 } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
//                     currentRatio = (intervalsExtrema.sequence[k]/intervalsExtrema.span)/(intervalsExtremaOptim.sequence[k]/intervalsExtremaOptim.span)
//                 }
//                 if(k === 0) {
//                     maxRatio.value = currentRatio
//                     maxRatio.index = k
//                 } else if(currentRatio > maxRatio.value) {
//                     maxRatio.value = currentRatio
//                     maxRatio.index = k
//                 }
//             }

//         } else if(scan === Direction.Reverse) {
//             let upperBound = 0
//             let lowerBound = 0
//             if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
//                 lowerBound = candidateEvent - nbEvents
//                 upperBound = intervalsExtremaOptim.sequence.length - 1
//                 if(nbEvents === 2 && candidateEvent < intervalsExtremaOptim.sequence.length - 1) upperBound -= 1
//             } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length){
//                 lowerBound = candidateEvent + nbEvents
//                 upperBound = intervalsExtrema.sequence.length - 1
//                 if(nbEvents === -2 && candidateEvent < intervalsExtrema.sequence.length - 1) upperBound -= 1
//             }
//             if(candidateEvent === 1) {
//                 if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
//                     maxRatio.value = 1.0/(intervalsExtrema.sequence[intervalsExtrema.sequence.length - 1]/intervalsExtrema.span)
//                 } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
//                     maxRatio.value = 1.0/(intervalsExtremaOptim.sequence[intervalsExtremaOptim.sequence.length - 1]/intervalsExtremaOptim.span)
//                 }
//                 maxRatio.index = upperBound
//             }
//             for(let k = upperBound; k > lowerBound; k -= 1) {
//                 let currentRatio = 1.0
//                 if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
//                     currentRatio = (intervalsExtremaOptim.sequence[k]/intervalsExtremaOptim.span)/(intervalsExtrema.sequence[k + nbEvents]/intervalsExtrema.span)
//                 } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
//                     currentRatio = (intervalsExtrema.sequence[k]/intervalsExtrema.span)/(intervalsExtremaOptim.sequence[k - nbEvents]/intervalsExtremaOptim.span)
//                 }
//                 if(k === intervalsExtremaOptim.sequence.length - 1) {
//                     maxRatio.value = currentRatio
//                     maxRatio.index = k
//                 } else if(currentRatio > maxRatio.value) {
//                     maxRatio.value = currentRatio
//                     maxRatio.index = k
//                 }
//             }
//         }

//         return maxRatio
//     }

//     neighboringDifferentialEvents(orderedDifferentialEvents: Array<DifferentialEvent>, orderedDifferentialEventsOptim: Array<DifferentialEvent>): Array<NeighboringEvents> {
//         let result: Array<NeighboringEvents> =  []

//         //if(orderedDifferentialEvents.length > 0 && orderedDifferentialEventsOptim.length !== orderedDifferentialEvents.length){
//         if(orderedDifferentialEventsOptim.length !== orderedDifferentialEvents.length){
//             /* JCL Analyze the sequence of inflections */
//             //interface modifiedEvents {inter: number, nbE: number}
//             let inflectionIndices: number[] = []
//             for(let i = 0; i < orderedDifferentialEvents.length; i += 1) {
//                 if(orderedDifferentialEvents[i].event === DiffEventType.inflection) inflectionIndices.push(i)
//             }
//             let inflectionIndicesOptim: number[] = []
//             for(let i = 0; i < orderedDifferentialEventsOptim.length; i += 1) {
//                 if(orderedDifferentialEventsOptim[i].event === DiffEventType.inflection) inflectionIndicesOptim.push(i)
//             }
//             if(inflectionIndices.length === inflectionIndicesOptim.length) {
//                 /* JCL No change of number of oscillations -> look for curvature extrema events */
//                 let lostEvents: Array<modifiedEvents> = []
//                 let shift = 0
//                 for(let j = 0; j < inflectionIndices.length; j += 1) {
//                     let delta = inflectionIndices[j] - inflectionIndicesOptim[j]
//                     if(delta !== shift) {
//                         lostEvents.push({inter: j, nbE: delta-shift})
//                         shift = shift + delta
//                     }
//                 }
//                 if(inflectionIndices.length > 0 && lostEvents.length === 0) lostEvents.push({inter: inflectionIndices.length, nbE: orderedDifferentialEvents.length - orderedDifferentialEventsOptim.length})
//                 if(inflectionIndices.length === 0) lostEvents.push({inter: 0, nbE: orderedDifferentialEvents.length - orderedDifferentialEventsOptim.length}) 

//                 if(lostEvents.length === 0) {
//                     throw new Error("Inconsistent analysis of lost events in the sequence of differential events")
//                 } else if(lostEvents.length === 1){
//                     /* JCL case of lost event at a knot related to a cubic curve not processed */
//                     if(lostEvents[0].nbE === 1) {
//                         if(lostEvents[0].inter === 0) {

//                             let intervals: intervalsCurvatureExt
//                             intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
//                             let intervalsOptim: intervalsCurvatureExt
//                             intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
//                             let candidateEventIndex = this.indexSmallestInterval(intervals, lostEvents[0].nbE)
//                             let ratioLeft = 0.0, ratioRight = 0.0, indexMaxIntverVar = -1
//                             if(intervalsOptim.sequence.length > 0) {
//                                 ratioLeft = (intervalsOptim.sequence[0]/intervalsOptim.span)/(intervals.sequence[0]/intervals.span)
//                                 ratioRight = (intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)/(intervals.sequence[intervals.sequence.length - 1]/intervals.span)
//                                 if(ratioLeft > ratioRight) {
//                                     indexMaxIntverVar = 0
//                                     let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Reverse)
//                                     if(maxRatioR.value > ratioLeft) {
//                                         indexMaxIntverVar = maxRatioR.index
//                                     }
//                                 } else {
//                                     indexMaxIntverVar = intervals.sequence.length - 1
//                                     let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Forward)
//                                     if(maxRatioF.value > ratioRight) {
//                                         indexMaxIntverVar = maxRatioF.index
//                                     }
//                                 }
//                             } else {
//                                 indexMaxIntverVar = candidateEventIndex
//                             }
                            
//                             if(candidateEventIndex !== -1) {
//                                 if(inflectionIndices.length === 0) {
//                                     if(indexMaxIntverVar === candidateEventIndex) {
//                                         console.log("Events are stable as well as the candidate event.")
//                                     } else if(indexMaxIntverVar !== candidateEventIndex) {
//                                         console.log("Other events variations may influence the decision about the candidate event.")
//                                         if(!(ratioLeft > ratioRight && candidateEventIndex === 0)) {
//                                             candidateEventIndex = 0
//                                         } else if(!(ratioLeft < ratioRight && candidateEventIndex === intervals.sequence.length - 1))
//                                             candidateEventIndex = intervals.sequence.length - 1
//                                     }
//                                 } else {
//                                     /* JCL The only other possibility is candidateEventIndex = 0 */
//                                     candidateEventIndex = 0
//                                 }

//                             } else throw new Error("Unable to generate the smallest interval of differential events for this curve.")

//                             if(inflectionIndices.length === 0) {
//                                 if(candidateEventIndex === 0) {
//                                     result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
//                                 //} else if (maxRatio.index === intervalExtremaOptim.length - 1) {
//                                 } else if (candidateEventIndex === intervals.sequence.length - 1) {
//                                     result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})
//                                 } else {
//                                     console.log("Inconsistent identification of curvature extremum. Possibly extremum at a knot.")
//                                     result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
//                                 }
//                             } else {
//                                 if(candidateEventIndex === 0) {
//                                     result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
//                                 } else {
//                                     console.log("Inconsistent identification of curvature extremum")
//                                     result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
//                                 }
//                             }

//                         } else if(lostEvents[0].inter === inflectionIndices.length) {
//                             let intervals: intervalsCurvatureExt
//                             intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
//                             let intervalsOptim: intervalsCurvatureExt
//                             intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
//                             let candidateEventIndex = this.indexSmallestInterval(intervals, lostEvents[0].nbE)
//                             let ratioRight = 0.0, indexMaxIntverVar = -1
//                             if(intervalsOptim.sequence.length > 0) {
//                                 ratioRight = (intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)/(intervals.sequence[intervals.sequence.length - 1]/intervals.span)
//                                 indexMaxIntverVar = intervals.sequence.length - 1
//                                 let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Forward)
//                                 if(maxRatioF.value > ratioRight) {
//                                     indexMaxIntverVar = maxRatioF.index
//                                 }
//                             } else {
//                                 indexMaxIntverVar = intervals.sequence.length - 1
//                             }
//                             if(candidateEventIndex !== -1 && (candidateEventIndex !== intervals.sequence.length - 1 || indexMaxIntverVar !== intervals.sequence.length - 1)) {
//                                 console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.")
//                             }
//                             result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})

//                         } else throw new Error("Inconsistent content of events in this interval.")

//                     } else if(lostEvents[0].nbE === 2) {
//                         let intervals: intervalsCurvatureExt
//                         intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
//                         let intervalsOptim: intervalsCurvatureExt
//                         intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
//                         let candidateEventIndex = this.indexSmallestInterval(intervals, lostEvents[0].nbE)
//                         let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, candidateEventIndex, lostEvents[0].nbE, Direction.Forward)
//                         let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, candidateEventIndex, lostEvents[0].nbE, Direction.Reverse)
//                         if(candidateEventIndex !== -1) {
//                             if(intervalsOptim.sequence.length > 0) {
//                                 if(maxRatioF.index ===  maxRatioR.index && maxRatioR.index === (candidateEventIndex - 1)) {
//                                     console.log("Events are stable as well as the candidate events.")
//                                 } else if(maxRatioF.index !== (candidateEventIndex - 1) || maxRatioR.index !== (candidateEventIndex - 1)) {
//                                     console.log("The candidate events are not the ones removed.")
//                                     /* Current assumption consists in considering an adjacent interval as candidate */
//                                     if(maxRatioF.value > maxRatioR.value) {
//                                         candidateEventIndex = maxRatioF.index - 1
//                                     } else candidateEventIndex = maxRatioF.index + 1
//                                 } else {
//                                     console.log("Events are not stable enough.")
//                                 }
//                             } else {
//                                 /* JCL orderedDifferentialEvents contains two events only that have disappeared */
//                                 candidateEventIndex = 1
//                             }
//                         } else {
//                             console.log("Error when computing smallest interval. Assign arbitrarilly interval to 0.")
//                             if(inflectionIndices.length === 0 || lostEvents[0].inter === 0) {
//                                 candidateEventIndex = 1
//                             } else if(lostEvents[0].inter === inflectionIndices.length) {
//                                 candidateEventIndex = orderedDifferentialEvents.length - inflectionIndices[inflectionIndices.length - 1] - 2
//                             } else candidateEventIndex = 0
//                         }

//                         if(inflectionIndices.length === 0 || lostEvents[0].inter === 0) {
//                             /* JCL To avoid use of incorrect indices */
//                             if(candidateEventIndex === orderedDifferentialEvents.length) {
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 2})
//                                 console.log("Probably incorrect identification of events indices.")
//                             } else if(candidateEventIndex === -1) {
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: 0})
//                                 console.log("Probably incorrect identification of events indices close to curve origin.")
//                             } else {
//                                 /* JCL Set the effectively computed event index*/
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 1})
//                             }
//                         } else if(lostEvents[0].inter === inflectionIndices.length) {
//                             /* JCL To avoid use of incorrect indices */
//                             if(inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex === orderedDifferentialEvents.length - 1) {
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex - 1})
//                                 console.log("Probably incorrect identification of events indices.")
//                             } else {
//                                 /* JCL Set the effectively computed event index*/
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex})
//                             }
//                         } else {
//                             result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[lostEvents[0].inter - 1] + candidateEventIndex})
//                         }
//                     } else if (lostEvents[0].nbE === -2) {
//                         let intervals: intervalsCurvatureExt
//                         intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
//                         let intervalsOptim: intervalsCurvatureExt
//                         intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
//                         let candidateEventIndex = this.indexSmallestInterval(intervalsOptim, -lostEvents[0].nbE)
//                         let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, candidateEventIndex, lostEvents[0].nbE, Direction.Forward)
//                         let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, candidateEventIndex, lostEvents[0].nbE, Direction.Reverse)
//                         if(candidateEventIndex !== -1) {
//                             if(intervals.sequence.length > 0) {
//                                 if(maxRatioF.index === maxRatioR.index && maxRatioF.index === (candidateEventIndex - 1)) {
//                                     console.log("Events are stable as well as the candidate events.")
//                                 } else if(maxRatioF.index !== (candidateEventIndex - 1) || maxRatioR.index !== (candidateEventIndex - 1)) {
//                                     console.log("The candidate events are not the ones added.")
//                                     /* Current assumption consists in considering an adjacent interval as candidate */
//                                     if(maxRatioF.value > maxRatioR.value) {
//                                         candidateEventIndex = maxRatioF.index - 1
//                                     } else candidateEventIndex = maxRatioF.index + 1
//                                 } else {
//                                     console.log("Events are not stable enough.")
//                                 }
//                             } else {
//                                 /* JCL orderedDifferentialEventsOptim contains two events only that may appear */
//                                 candidateEventIndex = 1
//                             }
//                         } else {
//                             console.log("Error when computing smallest interval. Assign arbitrarilly interval to 0.")
//                             if(inflectionIndices.length === 0) {
//                                 candidateEventIndex = 1
//                             } else if(lostEvents[0].inter === inflectionIndicesOptim.length) {
//                                 candidateEventIndex = orderedDifferentialEventsOptim.length - inflectionIndicesOptim[inflectionIndicesOptim.length - 1] - 2
//                             } else candidateEventIndex = 0
//                         }

//                         if(inflectionIndices.length === 0 || lostEvents[0].inter === 0) {
//                             /* JCL To avoid use of incorrect indices */
//                             if(candidateEventIndex === orderedDifferentialEventsOptim.length) {
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 2})
//                                 console.log("Probably incorrect identification of events indices close to curve extremity.")
//                             } else if(candidateEventIndex === -1) {
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: 0})
//                                 console.log("Probably incorrect identification of events indices close to curve origin.")
//                             } else {
//                                 /* JCL Set the effectively computed event index*/
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 1})
//                             }
//                         } else if(lostEvents[0].inter === inflectionIndicesOptim.length) {
//                             /* JCL To avoid use of incorrect indices */
//                             if(inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex === orderedDifferentialEventsOptim.length - 1) {
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex - 1})
//                                 console.log("Probably incorrect identification of events indices.")
//                             } else {
//                                 /* JCL Set the effectively computed event index*/
//                                 result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex})
//                             }
//                         } else {
//                             result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[lostEvents[0].inter - 1] + candidateEventIndex})
//                         }
//                     } else if (lostEvents[0].nbE === -1) {
//                         if(lostEvents[0].inter === 0) {

//                             let intervals: intervalsCurvatureExt
//                             intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
//                             let intervalsOptim: intervalsCurvatureExt
//                             intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
//                             let candidateEventIndex = this.indexSmallestInterval(intervalsOptim, -lostEvents[0].nbE)
//                             let ratioLeft = 0.0, ratioRight = 0.0, indexMaxIntverVar = -1
//                             if(intervals.sequence.length > 0) {
//                                 ratioLeft = (intervals.sequence[0]/intervals.span)/(intervalsOptim.sequence[0]/intervalsOptim.span)
//                                 ratioRight = (intervals.sequence[intervals.sequence.length - 1]/intervals.span)/(intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)
//                                 if(ratioLeft > ratioRight) {
//                                     indexMaxIntverVar = 0
//                                     let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Reverse)
//                                     if(maxRatioR.value > ratioLeft) {
//                                         indexMaxIntverVar = maxRatioR.index
//                                     }
//                                 } else {
//                                     indexMaxIntverVar = intervalsOptim.sequence.length - 1
//                                     let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Forward)
//                                     if(maxRatioF.value > ratioRight) {
//                                         indexMaxIntverVar = maxRatioF.index
//                                     }
//                                 }
//                             } else {
//                                 indexMaxIntverVar = 0
//                             }
                            
//                             if(candidateEventIndex !== -1) {
//                                 if(inflectionIndices.length === 0) {
//                                     if(indexMaxIntverVar === candidateEventIndex) {
//                                         console.log("Events are stable as well as the candidate event.")
//                                     } else if(indexMaxIntverVar !== candidateEventIndex) {
//                                         console.log("Other events variations may influence the decision about the candidate event.")
//                                         if(!(ratioLeft > ratioRight && candidateEventIndex === 0)) {
//                                             candidateEventIndex = 0
//                                         } else if(!(ratioLeft < ratioRight && candidateEventIndex === intervalsOptim.sequence.length - 1))
//                                             candidateEventIndex = intervalsOptim.sequence.length - 1
//                                     }
//                                 } else {
//                                     /* JCL The only other possibility is candidateEventIndex = 0 */
//                                     candidateEventIndex = 0
//                                 }

//                             } else throw new Error("Unable to generate the smallest interval of differential events for this curve.")

//                             if(inflectionIndices.length === 0) {
//                                 if(candidateEventIndex === 0) {
//                                     result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
//                                 //} else if (maxRatio.index === intervalExtremaOptim.length - 1) {
//                                 } else if (candidateEventIndex === intervalsOptim.sequence.length - 1) {
//                                     result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEventsOptim.length - 1})
//                                 } else {
//                                     console.log("Inconsistent identification of curvature extremum. Possibly extremum at a knot.")
//                                     result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
//                                 }
//                             } else {
//                                 if(candidateEventIndex === 0) {
//                                     result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
//                                 } else {
//                                     console.log("Inconsistent identification of curvature extremum")
//                                     result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
//                                 }
//                             }

//                         } else if(lostEvents[0].inter === inflectionIndices.length) {
//                             let intervals: intervalsCurvatureExt
//                             intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
//                             let intervalsOptim: intervalsCurvatureExt
//                             intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
//                             let candidateEventIndex = this.indexSmallestInterval(intervalsOptim, -lostEvents[0].nbE)
//                             let ratioRight = 0.0, indexMaxIntverVar = -1
//                             if(intervals.sequence.length > 0) {
//                                 ratioRight = (intervals.sequence[intervals.sequence.length - 1]/intervals.span)/(intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)
//                                 indexMaxIntverVar = intervalsOptim.sequence.length - 1
//                                 let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Forward)
//                                 if(maxRatioF.value > ratioRight) {
//                                     indexMaxIntverVar = maxRatioF.index
//                                 }
//                             } else {
//                                 indexMaxIntverVar = intervalsOptim.sequence.length - 1
//                             }
//                             if(candidateEventIndex !== -1 && (candidateEventIndex !== intervalsOptim.sequence.length - 1 || indexMaxIntverVar !== intervalsOptim.sequence.length - 1)) {
//                                 console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.")
//                             }
//                             result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})

//                         } else throw new Error("Inconsistent content of events in this interval.")

//                     } else {
//                         throw new Error("Inconsistent content of the intervals of lost events or more than one elementary event into a single interval between inflections.")
//                     }
//                 }
//                 else if(lostEvents.length === 2) {
//                     console.log("Number of reference events lost greater than one in distinct inflection intervals.")
//                 }
//             } else if(inflectionIndices.length - inflectionIndicesOptim.length === 1) {
//                 /* JCL One inflection has been lost -> case of inflection gone outside the curve through one extremity */
//                 if(orderedDifferentialEvents[0].event === DiffEventType.inflection && orderedDifferentialEventsOptim.length === 0) {
//                     let intervalExtrema = []
//                     intervalExtrema.push(orderedDifferentialEvents[0].loc)
//                     if(orderedDifferentialEvents.length === 1) {
//                         intervalExtrema.push(1.0 - orderedDifferentialEvents[0].loc)
//                     } else throw new Error("Inconsistent content of the sequence of events to identify the curve extremity where the inflection is lost.")

//                     if(intervalExtrema[0] > intervalExtrema[intervalExtrema.length - 1]) {
//                         result.push({event: NeighboringEventsType.neighboringInflectionRightBoundary, index: 0})
//                     } else
//                         result.push({event: NeighboringEventsType.neighboringInflectionLeftBoundary, index: 0})

//                 } else if(orderedDifferentialEvents[0].event === DiffEventType.inflection && orderedDifferentialEventsOptim[0].event !== DiffEventType.inflection) {
//                     result.push({event: NeighboringEventsType.neighboringInflectionLeftBoundary, index: 0})
//                 } else if(orderedDifferentialEvents[orderedDifferentialEvents.length - 1].event === DiffEventType.inflection && orderedDifferentialEventsOptim[orderedDifferentialEventsOptim.length - 1].event !== DiffEventType.inflection) {
//                     result.push({event: NeighboringEventsType.neighboringInflectionRightBoundary, index: orderedDifferentialEvents.length - 1})
//                 } else {
//                     throw new Error("Inconsistent content of the sequence of events to identify the loss of an inflection at a curve extremity.")
//                 }
//             } else if(orderedDifferentialEvents.length - orderedDifferentialEventsOptim.length === 2 && inflectionIndices.length - inflectionIndicesOptim.length === 2) {
//                 /* JCL Two inflections meet at one curvature extremum and these two are lost -> case of oscillation removal */
//                 /* JCL Locate candidate reference events */
//                 let refEventLocation: Array<number> = []
//                 for(let i = 0; i < orderedDifferentialEvents.length - 2; i += 1) {
//                     if(orderedDifferentialEvents[i].event === DiffEventType.inflection &&
//                         orderedDifferentialEvents[i + 1].event === DiffEventType.curvatExtremum &&
//                         orderedDifferentialEvents[i + 2].event === DiffEventType.inflection) {
//                             refEventLocation.push(i)
//                     }
//                 }
//                 let refEventLocationOptim: Array<number> = []
//                 for(let i = 0; i < orderedDifferentialEventsOptim.length - 2; i += 1) {
//                     if(orderedDifferentialEventsOptim[i].event === DiffEventType.inflection &&
//                         orderedDifferentialEventsOptim[i + 1].event === DiffEventType.curvatExtremum &&
//                         orderedDifferentialEventsOptim[i + 2].event === DiffEventType.inflection) {
//                             refEventLocationOptim.push(i)
//                     }
//                 }
//                 if(inflectionIndicesOptim.length !== inflectionIndices.length - 2 &&
//                     ((refEventLocationOptim.length !== refEventLocation.length - 1 && refEventLocation.length === 1) ||
//                     (refEventLocationOptim.length !== refEventLocation.length - 2 && refEventLocation.length > 1) ||
//                     (refEventLocationOptim.length !== refEventLocation.length - 3 && refEventLocation.length > 2) )) {
//                     throw new Error("Inconsistency of reference type event that does not coincide with oscillation removal.")
//                 } else {
//                     let intervalEvent: Array<number> = []
//                     if(refEventLocation[0] !== 0) intervalEvent.push(refEventLocation[0] + 1)
//                     for(let j = 0; j < refEventLocation.length - 1; j += 1) {
//                         intervalEvent.push(refEventLocation[j + 1] - refEventLocation[j])
//                     }
//                     let intervalEventOptim: Array<number> = []
//                     if(refEventLocationOptim.length > 0) {
//                         if(refEventLocationOptim[0] !== 0) intervalEventOptim.push(refEventLocationOptim[0] + 1)
//                         for(let j = 0; j < refEventLocationOptim.length - 1; j += 1) {
//                             intervalEventOptim.push(refEventLocationOptim[j + 1] - refEventLocationOptim[j])
//                         }
//                     } else {
//                         if(refEventLocation.length === 1) result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[0]})
//                         if(refEventLocation.length === 2) {
//                             if(orderedDifferentialEventsOptim[refEventLocation[0]].event === DiffEventType.inflection) result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[1]})
//                             else result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[0]})
//                         }
//                         if(refEventLocation.length === 3) {
//                             if(orderedDifferentialEventsOptim[refEventLocation[0]].event === DiffEventType.inflection && orderedDifferentialEventsOptim[refEventLocation[1]].event !== DiffEventType.inflection) 
//                                 result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[1]})
//                         }
//                     }

//                     for(let k = 0; k < intervalEventOptim.length; k += 1) {
//                         if(intervalEvent[k] !== intervalEventOptim[k]) {
//                             result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[k]})
//                         }
//                     }
//                     if(refEventLocation.length - refEventLocationOptim.length === 2 && result.length === 0) {
//                         result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[refEventLocation.length - 1]})
//                     }
//                 }
//             } else if(orderedDifferentialEvents.length - orderedDifferentialEventsOptim.length === -2 && inflectionIndices.length - inflectionIndicesOptim.length === -2) {
//                 /* JCL Two inflections are about to appear at one curvature extremum -> case of oscillation creation */
//                 /* JCL Locate candidate reference events */
//                 let refEventLocation: Array<number> = []
//                 for(let i = 0; i < orderedDifferentialEvents.length - 2; i += 1) {
//                     if(orderedDifferentialEvents[i].event === DiffEventType.inflection &&
//                         orderedDifferentialEvents[i + 1].event === DiffEventType.curvatExtremum &&
//                         orderedDifferentialEvents[i + 2].event === DiffEventType.inflection) {
//                             refEventLocation.push(i)
//                     }
//                 }
//                 let refEventLocationOptim: Array<number> = []
//                 for(let i = 0; i < orderedDifferentialEventsOptim.length - 2; i += 1) {
//                     if(orderedDifferentialEventsOptim[i].event === DiffEventType.inflection &&
//                         orderedDifferentialEventsOptim[i + 1].event === DiffEventType.curvatExtremum &&
//                         orderedDifferentialEventsOptim[i + 2].event === DiffEventType.inflection) {
//                             refEventLocationOptim.push(i)
//                     }
//                 }
//                 if(inflectionIndicesOptim.length - 2 !== inflectionIndices.length &&
//                     ((refEventLocationOptim.length - 1 !== refEventLocation.length && refEventLocationOptim.length === 1) ||
//                     (refEventLocationOptim.length - 2 !== refEventLocation.length && refEventLocationOptim.length > 1) ||
//                     (refEventLocationOptim.length - 3 !== refEventLocation.length && refEventLocationOptim.length > 2) )) {
//                     throw new Error("Inconsistency of reference type event that does not coincide with oscillation removal.")
//                 } else {
//                     let intervalEvent: Array<number> = []
//                     let intervalEventOptim: Array<number> = []
//                     if(refEventLocationOptim[0] !== 0) intervalEventOptim.push(refEventLocationOptim[0] + 1)
//                     for(let j = 0; j < refEventLocationOptim.length - 1; j += 1) {
//                         intervalEventOptim.push(refEventLocationOptim[j + 1] - refEventLocationOptim[j])
//                     }

//                     if(refEventLocation.length > 0) {
//                         if(refEventLocation[0] !== 0) intervalEvent.push(refEventLocation[0] + 1)
//                         for(let j = 0; j < refEventLocation.length - 1; j += 1) {
//                             intervalEvent.push(refEventLocation[j + 1] - refEventLocation[j])
//                         }
//                     } else {
//                         if(refEventLocationOptim.length === 1) result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[0]})
//                         if(refEventLocationOptim.length === 2) {
//                             if(orderedDifferentialEvents[refEventLocationOptim[0]].event === DiffEventType.inflection) result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[1]})
//                             else result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[0]})
//                         }
//                         if(refEventLocationOptim.length === 3) {
//                             if(orderedDifferentialEvents[refEventLocationOptim[0]].event === DiffEventType.inflection && orderedDifferentialEvents[refEventLocationOptim[1]].event !== DiffEventType.inflection) 
//                                 result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[1]})
//                         }
//                     }

//                     for(let k = 0; k < intervalEvent.length; k += 1) {
//                         if(intervalEvent[k] !== intervalEventOptim[k]) {
//                             result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[k]})
//                         }
//                     }
//                     if(refEventLocation.length - refEventLocationOptim.length === -2 && result.length === 0) {
//                         result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[refEventLocationOptim.length - 1]})
//                     }
//                 }
//             } else {
//                 throw new Error("Changes in the differential events sequence don't match single elementary transformations.")
//             }
//         }

//         return  result
//     }

//     optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {

//     }
// }