import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { OptimizationProblem_BSpline_R1_to_R2, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation, ActiveControl } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { Optimizer } from "../mathematics/Optimizer";
import { CurveModel } from "../newModels/CurveModel";
import { Vector2d } from "../mathVector/Vector2d";
import { CurveSceneController } from "./CurveSceneController"
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { findSpan } from "../newBsplines/Piegl_Tiller_NURBS_Book"
import { type } from "os";
import { ActiveExtremaLocationControl, ActiveInflectionLocationControl, CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ActiveLocationControl, ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";




export enum NeighboringEventsType {neighboringCurExtremumLeftBoundary, neighboringInflectionLeftBoundary, 
                                neighboringCurExtremumRightBoundary, neighboringInflectionRightBoundary,
                                neighboringCurvatureExtrema, neighboringInflectionsCurvatureExtremum, none,
                                neighboringCurvatureExtremaAppear, neighboringCurvatureExtremaDisappear,
                                neighboringInflectionsCurvatureExtremumAppear, neighboringInflectionsCurvatureExtremumDisappear,
                                neighboringCurExtremumLeftBoundaryAppear, neighboringCurExtremumLeftBoundaryDisappear,
                                neighboringCurExtremumRightBoundaryAppear, neighboringCurExtremumRightBoundaryDisappear}
export interface NeighboringEvents {event: NeighboringEventsType; index: number; value?: number; valueOptim?: number; locExt?: number; locExtOptim?: number; variation?: number[];
    span?: number; range?: number; knotIndex?: number}
export enum DiffEventType {inflection, curvatExtremum, unDefined}
export interface DifferentialEvent {event: DiffEventType; loc: number}
enum Direction {Forward, Reverse}

interface modifiedEvents {inter: number, nbE: number}
interface intervalsCurvatureExt {span: number, sequence: number[]}
interface intermediateKnotWithNeighborhood {knot: number, left: number, right: number, index: number}
interface extremaNearKnot {kIndex: number, extrema: Array<number>}

const DEVIATION_FROM_KNOT = 0.25

export class SlidingStrategyStrictlyInsideShapeSpace implements CurveControlStrategyInterface {
    
    private _optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation
    //private optimizer: Optimizer
    public optimizer: Optimizer
    private activeOptimizer: boolean = true

    private curveModel: CurveModel
    /* JCL 2020/09/23 Add management of the curve location */
    // private curveSceneController: CurveSceneController
    private curveSceneController?: CurveSceneController
    public lastDiffEvent: NeighboringEventsType

    // constructor(curveModel: CurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean, curveSceneController: CurveSceneController ) {
    constructor(curveModel: CurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean,
        // curveSceneController: CurveSceneController ) {
        curveShapeSpaceNavigator: CurveShapeSpaceNavigator ) {
        this.curveModel = curveModel
        //enum ActiveControl {curvatureExtrema, inflections, both}
        let activeControl : ActiveControl = ActiveControl.both

        /* JCL 2020/09/23 Update the curve location control in accordance with the status of the clamping button and the status of curveSceneController.activeLocationControl */
        // if(curveShapeSpaceNavigator.curveSceneController !== undefined) {
            this.curveSceneController = curveShapeSpaceNavigator.curveSceneController
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "constructor", "curveShapeSpaceNavigator undefined")
        //     error.logMessageToConsole()
        // }


        if (!controlOfCurvatureExtrema) {
            activeControl = ActiveControl.inflections
        } else if (!controlOfInflection) {
            activeControl = ActiveControl.curvatureExtrema
        } else if (!controlOfInflection && !controlOfCurvatureExtrema) {
            activeControl = ActiveControl.none;
            this.activeOptimizer = false
            //console.log("activeOptimizer in SlidingStrategy: " + this.activeOptimizer)
            // this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.none
            // this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.none
        }

        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this._optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this.optimizer = this.newOptimizer(this._optimizationProblem)
        this.lastDiffEvent = NeighboringEventsType.none
    }

    get optimizationProblem(): OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation {
        return this._optimizationProblem;
    }

    set optimizationProblem(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation) {
        this._optimizationProblem = optimizationProblem;
    }

    setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation) {
        optimizationProblem.weigthingFactors[0] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length-1] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length*2-1] = 10
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation) {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curveModel: CurveModel) {
        this.curveModel = curveModel
        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
        //this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this.optimizer = this.newOptimizer(this.optimizationProblem)
    }

    toggleControlOfCurvatureExtrema(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            //this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema) */
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            //this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections) */
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections ){
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
            //this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both) */
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else {
            console.log("Error in logic of toggle control over curvature extrema")
        }
    }

    toggleControlOfInflections(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            //this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)*/
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            //this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema) */
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
            //this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both) */
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else {
            console.log("Error in logic of toggle control over inflections")
        }
    }
    
    toggleSliding(): void {
        throw new Error("Method not implemented.");
    }


    generateSequenceDifferentialEvents(curvatureExtrema: number[], inflections: number[]): Array<DifferentialEvent> {
        let result: Array<DifferentialEvent> =  []
        let j = 0
        //console.log("curvature " + curvatureExtrema.length + " inflection " + inflections.length)
        for(let i=0; i < curvatureExtrema.length; i += 1) {
            if(curvatureExtrema[i] > inflections[j]) {
                while(curvatureExtrema[i] > inflections[j]) {
                    result.push({event: DiffEventType.inflection, loc: inflections[j]})
                    j += 1
                }
            } 
            result.push({event: DiffEventType.curvatExtremum, loc: curvatureExtrema[i]})
        }
        if(j < inflections.length) {
            result.push({event: DiffEventType.inflection, loc: inflections[j]})
            j += 1
        }
        if(j < inflections.length) {
            throw new Error("Inconsistent sequence of differential events that terminates with multiple inflections")
        } else if(result.length !== curvatureExtrema.length + inflections.length) {
            // throw new Error("Inconsistent length of sequence of differential events")
            // JCL temporay modif
            const warning = new WarningLog(this.constructor.name, "generateSequenceDifferentialEvents", "Inconsistent length of sequence of differential events");
            warning.logMessageToConsole();
        }
        return result
    }

    computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents: Array<DifferentialEvent>, inflectionIndices: number[], lostEvents: Array<modifiedEvents>): intervalsCurvatureExt {
        let interval = 1.0
        let intervalExtrema: intervalsCurvatureExt = {span: interval, sequence: []}
        if(inflectionIndices.length === 0 && orderedDifferentialEvents.length === 0) {
            intervalExtrema.span = interval
            intervalExtrema.sequence.push(interval)
        } else if(inflectionIndices.length === 0 && orderedDifferentialEvents.length > 0) {
            intervalExtrema.span = interval
            intervalExtrema.sequence.push(orderedDifferentialEvents[0].loc)
            for(let k = 0; k < orderedDifferentialEvents.length - 1; k += 1) {
                intervalExtrema.sequence.push(orderedDifferentialEvents[k + 1].loc - orderedDifferentialEvents[k].loc)
            }
            intervalExtrema.sequence.push(1.0 - orderedDifferentialEvents[orderedDifferentialEvents.length - 1].loc)

        } else if(lostEvents[0].inter === inflectionIndices.length && inflectionIndices[length - 1] < (orderedDifferentialEvents.length - 1)) {
            intervalExtrema.span = 1.0 - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter - 1]].loc
            for(let k = inflectionIndices[inflectionIndices.length - 1]; k < orderedDifferentialEvents.length - 1; k += 1) {
                intervalExtrema.sequence.push(orderedDifferentialEvents[k + 1].loc - orderedDifferentialEvents[k].loc)
            }
            intervalExtrema.sequence.push(1.0 - orderedDifferentialEvents[orderedDifferentialEvents.length - 1].loc)

        } else if(lostEvents[0].inter === 0 && inflectionIndices[0] > 0) {
            intervalExtrema.span = orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter]].loc
            intervalExtrema.sequence.push(orderedDifferentialEvents[0].loc)
            for(let k = 1; k < inflectionIndices[lostEvents[0].inter]; k += 1) {
                intervalExtrema.sequence.push(orderedDifferentialEvents[k].loc - orderedDifferentialEvents[k - 1].loc)
            }

        } else if(inflectionIndices.length > 1 && lostEvents[0].inter < inflectionIndices.length) {
            intervalExtrema.span = orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter]].loc - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter - 1]].loc
            for(let k = inflectionIndices[lostEvents[0].inter - 1] + 1; k < inflectionIndices[lostEvents[0].inter]; k += 1) {
                intervalExtrema.sequence.push(orderedDifferentialEvents[k].loc - orderedDifferentialEvents[k - 1].loc)
            }
            intervalExtrema.sequence.push(orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter]].loc - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter] - 1].loc)
        } else if(inflectionIndices[lostEvents[0].inter] - inflectionIndices[lostEvents[0].inter - 1] < 4) {
            /* JCL A minimum of four intervals is required to obtain a meaningful loss of curvature extrema */
            console.log("Inconsistent number of curvature extrema in the current interval of inflections. Number too small.")
        }

        return intervalExtrema
    }

    indexSmallestInterval(intervalExtrema: intervalsCurvatureExt, nbEvents: number): number {
        let candidateEventIndex = -1
        let ratio: number[] = []
        if(nbEvents === 1 && intervalExtrema.sequence.length > 1) {
            /* JCL Look at first and last intervals only. Other intervals add noise to get a consistent candidate interval */
            ratio.push(intervalExtrema.sequence[0]/intervalExtrema.span)
            ratio.push(intervalExtrema.sequence[intervalExtrema.sequence.length - 1]/intervalExtrema.span)
            if(ratio[0] < ratio[1]) candidateEventIndex = 0
            else candidateEventIndex = intervalExtrema.sequence.length - 1

        } else if(nbEvents === 2 && intervalExtrema.sequence.length > 2) {
            for(let k = 0; k < intervalExtrema.sequence.length; k += 1) {
                ratio.push(intervalExtrema.sequence[k]/intervalExtrema.span)
            }
            let mappedRatio = ratio.map(function(location, i) {
                return { index: i, value: location };
              })
            mappedRatio.sort(function(a, b) {
                if (a.value > b.value) {
                  return 1;
                }
                if (a.value < b.value) {
                  return -1;
                }
                return 0;
            })
            candidateEventIndex = mappedRatio[0].index
            /* JCL Take into account the optional number of events  */
            /* if the number of events removed equals 2 smallest intervals at both extremities can be removed because */
            /* they are of different types of there no event if it is a free extremity of the curve */
            if(mappedRatio[0].index === 0 || mappedRatio[0].index === intervalExtrema.sequence.length - 1) {
                candidateEventIndex = mappedRatio[1].index
                if(mappedRatio[1].index === 0 || mappedRatio[1].index === intervalExtrema.sequence.length - 1) {
                    candidateEventIndex = mappedRatio[2].index
                }
            } 
        } else console.log("Inconsistent number of events (Must be a positive number not larger than two) or inconsistent number of intervals between curvature extrema.")

        return candidateEventIndex
    }

    indexIntervalMaximalVariation(intervalsExtrema: intervalsCurvatureExt, intervalsExtremaOptim: intervalsCurvatureExt, candidateEvent: number, nbEvents: number, scan: Direction): {index: number, value: number} {
        let intervalIndex = -1
        let maxRatio = {index: intervalIndex, value: 0}
        if(scan === Direction.Forward) {
            let upperBound = candidateEvent
            let lowerBound = 0
            /* JCL To process intervals that are uniquely bounded by events */
            if(Math.abs(nbEvents) === 2 && candidateEvent > 1) lowerBound = 1

            if(candidateEvent === 1) {
                if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
                    maxRatio.value = 1.0/(intervalsExtrema.sequence[0]/intervalsExtrema.span)
                } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
                    maxRatio.value = 1.0/(intervalsExtremaOptim.sequence[0]/intervalsExtrema.span)
                }
                maxRatio.index = 0
            }
            for(let k = lowerBound; k < upperBound; k += 1) {
                let currentRatio = 1.0
                if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
                    currentRatio = (intervalsExtremaOptim.sequence[k]/intervalsExtremaOptim.span)/(intervalsExtrema.sequence[k]/intervalsExtrema.span)
                } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
                    currentRatio = (intervalsExtrema.sequence[k]/intervalsExtrema.span)/(intervalsExtremaOptim.sequence[k]/intervalsExtremaOptim.span)
                }
                if(k === 0) {
                    maxRatio.value = currentRatio
                    maxRatio.index = k
                } else if(currentRatio > maxRatio.value) {
                    maxRatio.value = currentRatio
                    maxRatio.index = k
                }
            }

        } else if(scan === Direction.Reverse) {
            let upperBound = 0
            let lowerBound = 0
            if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
                lowerBound = candidateEvent - nbEvents
                upperBound = intervalsExtremaOptim.sequence.length - 1
                if(nbEvents === 2 && candidateEvent < intervalsExtremaOptim.sequence.length - 1) upperBound -= 1
            } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length){
                lowerBound = candidateEvent + nbEvents
                upperBound = intervalsExtrema.sequence.length - 1
                if(nbEvents === -2 && candidateEvent < intervalsExtrema.sequence.length - 1) upperBound -= 1
            }
            if(candidateEvent === 1) {
                if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
                    maxRatio.value = 1.0/(intervalsExtrema.sequence[intervalsExtrema.sequence.length - 1]/intervalsExtrema.span)
                } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
                    maxRatio.value = 1.0/(intervalsExtremaOptim.sequence[intervalsExtremaOptim.sequence.length - 1]/intervalsExtremaOptim.span)
                }
                maxRatio.index = upperBound
            }
            for(let k = upperBound; k > lowerBound; k -= 1) {
                let currentRatio = 1.0
                if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
                    currentRatio = (intervalsExtremaOptim.sequence[k]/intervalsExtremaOptim.span)/(intervalsExtrema.sequence[k + nbEvents]/intervalsExtrema.span)
                } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
                    currentRatio = (intervalsExtrema.sequence[k]/intervalsExtrema.span)/(intervalsExtremaOptim.sequence[k - nbEvents]/intervalsExtremaOptim.span)
                }
                if(k === intervalsExtremaOptim.sequence.length - 1) {
                    maxRatio.value = currentRatio
                    maxRatio.index = k
                } else if(currentRatio > maxRatio.value) {
                    maxRatio.value = currentRatio
                    maxRatio.index = k
                }
            }
        }

        return maxRatio
    }

    neighboringDifferentialEvents(orderedDifferentialEvents: Array<DifferentialEvent>, orderedDifferentialEventsOptim: Array<DifferentialEvent>): Array<NeighboringEvents> {
        let result: Array<NeighboringEvents> =  []

        //if(orderedDifferentialEvents.length > 0 && orderedDifferentialEventsOptim.length !== orderedDifferentialEvents.length){
        if(orderedDifferentialEventsOptim.length !== orderedDifferentialEvents.length){
            /* JCL Analyze the sequence of inflections */
            //interface modifiedEvents {inter: number, nbE: number}
            let inflectionIndices: number[] = []
            for(let i = 0; i < orderedDifferentialEvents.length; i += 1) {
                if(orderedDifferentialEvents[i].event === DiffEventType.inflection) inflectionIndices.push(i)
            }
            let inflectionIndicesOptim: number[] = []
            for(let i = 0; i < orderedDifferentialEventsOptim.length; i += 1) {
                if(orderedDifferentialEventsOptim[i].event === DiffEventType.inflection) inflectionIndicesOptim.push(i)
            }
            if(inflectionIndices.length === inflectionIndicesOptim.length) {
                /* JCL No change of number of oscillations -> look for curvature extrema events */
                let lostEvents: Array<modifiedEvents> = []
                let shift = 0
                for(let j = 0; j < inflectionIndices.length; j += 1) {
                    let delta = inflectionIndices[j] - inflectionIndicesOptim[j]
                    if(delta !== shift) {
                        lostEvents.push({inter: j, nbE: delta-shift})
                        shift = shift + delta
                    }
                }
                if(inflectionIndices.length > 0 && lostEvents.length === 0) lostEvents.push({inter: inflectionIndices.length, nbE: orderedDifferentialEvents.length - orderedDifferentialEventsOptim.length})
                if(inflectionIndices.length === 0) lostEvents.push({inter: 0, nbE: orderedDifferentialEvents.length - orderedDifferentialEventsOptim.length}) 

                if(lostEvents.length === 0) {
                    throw new Error("Inconsistent analysis of lost events in the sequence of differential events")
                } else if(lostEvents.length === 1){
                    /* JCL case of lost event at a knot related to a cubic curve not processed */
                    if(lostEvents[0].nbE === 1) {
                        if(lostEvents[0].inter === 0) {

                            let intervals: intervalsCurvatureExt
                            intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
                            let intervalsOptim: intervalsCurvatureExt
                            intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
                            let candidateEventIndex = this.indexSmallestInterval(intervals, lostEvents[0].nbE)
                            let ratioLeft = 0.0, ratioRight = 0.0, indexMaxIntverVar = -1
                            if(intervalsOptim.sequence.length > 0) {
                                ratioLeft = (intervalsOptim.sequence[0]/intervalsOptim.span)/(intervals.sequence[0]/intervals.span)
                                ratioRight = (intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)/(intervals.sequence[intervals.sequence.length - 1]/intervals.span)
                                if(ratioLeft > ratioRight) {
                                    indexMaxIntverVar = 0
                                    let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Reverse)
                                    if(maxRatioR.value > ratioLeft) {
                                        indexMaxIntverVar = maxRatioR.index
                                    }
                                } else {
                                    indexMaxIntverVar = intervals.sequence.length - 1
                                    let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Forward)
                                    if(maxRatioF.value > ratioRight) {
                                        indexMaxIntverVar = maxRatioF.index
                                    }
                                }
                            } else {
                                indexMaxIntverVar = candidateEventIndex
                            }
                            
                            if(candidateEventIndex !== -1) {
                                if(inflectionIndices.length === 0) {
                                    if(indexMaxIntverVar === candidateEventIndex) {
                                        console.log("Events are stable as well as the candidate event.")
                                    } else if(indexMaxIntverVar !== candidateEventIndex) {
                                        console.log("Other events variations may influence the decision about the candidate event.")
                                        if(!(ratioLeft > ratioRight && candidateEventIndex === 0)) {
                                            candidateEventIndex = 0
                                        } else if(!(ratioLeft < ratioRight && candidateEventIndex === intervals.sequence.length - 1))
                                            candidateEventIndex = intervals.sequence.length - 1
                                    }
                                } else {
                                    /* JCL The only other possibility is candidateEventIndex = 0 */
                                    candidateEventIndex = 0
                                }

                            } else throw new Error("Unable to generate the smallest interval of differential events for this curve.")

                            if(inflectionIndices.length === 0) {
                                if(candidateEventIndex === 0) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                                //} else if (maxRatio.index === intervalExtremaOptim.length - 1) {
                                } else if (candidateEventIndex === intervals.sequence.length - 1) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})
                                } else {
                                    console.log("Inconsistent identification of curvature extremum. Possibly extremum at a knot.")
                                    result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
                                }
                            } else {
                                if(candidateEventIndex === 0) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                                } else {
                                    console.log("Inconsistent identification of curvature extremum")
                                    result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
                                }
                            }

                        } else if(lostEvents[0].inter === inflectionIndices.length) {
                            let intervals: intervalsCurvatureExt
                            intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
                            let intervalsOptim: intervalsCurvatureExt
                            intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
                            let candidateEventIndex = this.indexSmallestInterval(intervals, lostEvents[0].nbE)
                            let ratioRight = 0.0, indexMaxIntverVar = -1
                            if(intervalsOptim.sequence.length > 0) {
                                ratioRight = (intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)/(intervals.sequence[intervals.sequence.length - 1]/intervals.span)
                                indexMaxIntverVar = intervals.sequence.length - 1
                                let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Forward)
                                if(maxRatioF.value > ratioRight) {
                                    indexMaxIntverVar = maxRatioF.index
                                }
                            } else {
                                indexMaxIntverVar = intervals.sequence.length - 1
                            }
                            if(candidateEventIndex !== -1 && (candidateEventIndex !== intervals.sequence.length - 1 || indexMaxIntverVar !== intervals.sequence.length - 1)) {
                                console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.")
                            }
                            result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})

                        } else throw new Error("Inconsistent content of events in this interval.")

                    } else if(lostEvents[0].nbE === 2) {
                        let intervals: intervalsCurvatureExt
                        intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
                        let intervalsOptim: intervalsCurvatureExt
                        intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
                        let candidateEventIndex = this.indexSmallestInterval(intervals, lostEvents[0].nbE)
                        let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, candidateEventIndex, lostEvents[0].nbE, Direction.Forward)
                        let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, candidateEventIndex, lostEvents[0].nbE, Direction.Reverse)
                        if(candidateEventIndex !== -1) {
                            if(intervalsOptim.sequence.length > 0) {
                                if(maxRatioF.index ===  maxRatioR.index && maxRatioR.index === (candidateEventIndex - 1)) {
                                    console.log("Events are stable as well as the candidate events.")
                                } else if(maxRatioF.index !== (candidateEventIndex - 1) || maxRatioR.index !== (candidateEventIndex - 1)) {
                                    console.log("The candidate events are not the ones removed.")
                                    /* Current assumption consists in considering an adjacent interval as candidate */
                                    if(maxRatioF.value > maxRatioR.value) {
                                        candidateEventIndex = maxRatioF.index - 1
                                    } else candidateEventIndex = maxRatioF.index + 1
                                } else {
                                    console.log("Events are not stable enough.")
                                }
                            } else {
                                /* JCL orderedDifferentialEvents contains two events only that have disappeared */
                                candidateEventIndex = 1
                            }
                        } else {
                            console.log("Error when computing smallest interval. Assign arbitrarilly interval to 0.")
                            if(inflectionIndices.length === 0 || lostEvents[0].inter === 0) {
                                candidateEventIndex = 1
                            } else if(lostEvents[0].inter === inflectionIndices.length) {
                                candidateEventIndex = orderedDifferentialEvents.length - inflectionIndices[inflectionIndices.length - 1] - 2
                            } else candidateEventIndex = 0
                        }

                        if(inflectionIndices.length === 0 || lostEvents[0].inter === 0) {
                            /* JCL To avoid use of incorrect indices */
                            if(candidateEventIndex === orderedDifferentialEvents.length) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 2})
                                console.log("Probably incorrect identification of events indices.")
                            } else if(candidateEventIndex === -1) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: 0})
                                console.log("Probably incorrect identification of events indices close to curve origin.")
                            } else {
                                /* JCL Set the effectively computed event index*/
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 1})
                            }
                        } else if(lostEvents[0].inter === inflectionIndices.length) {
                            /* JCL To avoid use of incorrect indices */
                            if(inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex === orderedDifferentialEvents.length - 1) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex - 1})
                                console.log("Probably incorrect identification of events indices.")
                            } else {
                                /* JCL Set the effectively computed event index*/
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex})
                            }
                        } else {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[lostEvents[0].inter - 1] + candidateEventIndex})
                        }
                    } else if (lostEvents[0].nbE === -2) {
                        let intervals: intervalsCurvatureExt
                        intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
                        let intervalsOptim: intervalsCurvatureExt
                        intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
                        let candidateEventIndex = this.indexSmallestInterval(intervalsOptim, -lostEvents[0].nbE)
                        let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, candidateEventIndex, lostEvents[0].nbE, Direction.Forward)
                        let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, candidateEventIndex, lostEvents[0].nbE, Direction.Reverse)
                        if(candidateEventIndex !== -1) {
                            if(intervals.sequence.length > 0) {
                                if(maxRatioF.index === maxRatioR.index && maxRatioF.index === (candidateEventIndex - 1)) {
                                    console.log("Events are stable as well as the candidate events.")
                                } else if(maxRatioF.index !== (candidateEventIndex - 1) || maxRatioR.index !== (candidateEventIndex - 1)) {
                                    console.log("The candidate events are not the ones added.")
                                    /* Current assumption consists in considering an adjacent interval as candidate */
                                    if(maxRatioF.value > maxRatioR.value) {
                                        candidateEventIndex = maxRatioF.index - 1
                                    } else candidateEventIndex = maxRatioF.index + 1
                                } else {
                                    console.log("Events are not stable enough.")
                                }
                            } else {
                                /* JCL orderedDifferentialEventsOptim contains two events only that may appear */
                                candidateEventIndex = 1
                            }
                        } else {
                            console.log("Error when computing smallest interval. Assign arbitrarilly interval to 0.")
                            if(inflectionIndices.length === 0) {
                                candidateEventIndex = 1
                            } else if(lostEvents[0].inter === inflectionIndicesOptim.length) {
                                candidateEventIndex = orderedDifferentialEventsOptim.length - inflectionIndicesOptim[inflectionIndicesOptim.length - 1] - 2
                            } else candidateEventIndex = 0
                        }

                        if(inflectionIndices.length === 0 || lostEvents[0].inter === 0) {
                            /* JCL To avoid use of incorrect indices */
                            if(candidateEventIndex === orderedDifferentialEventsOptim.length) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 2})
                                console.log("Probably incorrect identification of events indices close to curve extremity.")
                            } else if(candidateEventIndex === -1) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: 0})
                                console.log("Probably incorrect identification of events indices close to curve origin.")
                            } else {
                                /* JCL Set the effectively computed event index*/
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 1})
                            }
                        } else if(lostEvents[0].inter === inflectionIndicesOptim.length) {
                            /* JCL To avoid use of incorrect indices */
                            if(inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex === orderedDifferentialEventsOptim.length - 1) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex - 1})
                                console.log("Probably incorrect identification of events indices.")
                            } else {
                                /* JCL Set the effectively computed event index*/
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex})
                            }
                        } else {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[lostEvents[0].inter - 1] + candidateEventIndex})
                        }
                    } else if (lostEvents[0].nbE === -1) {
                        if(lostEvents[0].inter === 0) {

                            let intervals: intervalsCurvatureExt
                            intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
                            let intervalsOptim: intervalsCurvatureExt
                            intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
                            let candidateEventIndex = this.indexSmallestInterval(intervalsOptim, -lostEvents[0].nbE)
                            let ratioLeft = 0.0, ratioRight = 0.0, indexMaxIntverVar = -1
                            if(intervals.sequence.length > 0) {
                                ratioLeft = (intervals.sequence[0]/intervals.span)/(intervalsOptim.sequence[0]/intervalsOptim.span)
                                ratioRight = (intervals.sequence[intervals.sequence.length - 1]/intervals.span)/(intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)
                                if(ratioLeft > ratioRight) {
                                    indexMaxIntverVar = 0
                                    let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Reverse)
                                    if(maxRatioR.value > ratioLeft) {
                                        indexMaxIntverVar = maxRatioR.index
                                    }
                                } else {
                                    indexMaxIntverVar = intervalsOptim.sequence.length - 1
                                    let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Forward)
                                    if(maxRatioF.value > ratioRight) {
                                        indexMaxIntverVar = maxRatioF.index
                                    }
                                }
                            } else {
                                indexMaxIntverVar = 0
                            }
                            
                            if(candidateEventIndex !== -1) {
                                if(inflectionIndices.length === 0) {
                                    if(indexMaxIntverVar === candidateEventIndex) {
                                        console.log("Events are stable as well as the candidate event.")
                                    } else if(indexMaxIntverVar !== candidateEventIndex) {
                                        console.log("Other events variations may influence the decision about the candidate event.")
                                        if(!(ratioLeft > ratioRight && candidateEventIndex === 0)) {
                                            candidateEventIndex = 0
                                        } else if(!(ratioLeft < ratioRight && candidateEventIndex === intervalsOptim.sequence.length - 1))
                                            candidateEventIndex = intervalsOptim.sequence.length - 1
                                    }
                                } else {
                                    /* JCL The only other possibility is candidateEventIndex = 0 */
                                    candidateEventIndex = 0
                                }

                            } else throw new Error("Unable to generate the smallest interval of differential events for this curve.")

                            if(inflectionIndices.length === 0) {
                                if(candidateEventIndex === 0) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                                //} else if (maxRatio.index === intervalExtremaOptim.length - 1) {
                                } else if (candidateEventIndex === intervalsOptim.sequence.length - 1) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEventsOptim.length - 1})
                                } else {
                                    console.log("Inconsistent identification of curvature extremum. Possibly extremum at a knot.")
                                    result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
                                }
                            } else {
                                if(candidateEventIndex === 0) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                                } else {
                                    console.log("Inconsistent identification of curvature extremum")
                                    result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
                                }
                            }

                        } else if(lostEvents[0].inter === inflectionIndices.length) {
                            let intervals: intervalsCurvatureExt
                            intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
                            let intervalsOptim: intervalsCurvatureExt
                            intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
                            let candidateEventIndex = this.indexSmallestInterval(intervalsOptim, -lostEvents[0].nbE)
                            let ratioRight = 0.0, indexMaxIntverVar = -1
                            if(intervals.sequence.length > 0) {
                                ratioRight = (intervals.sequence[intervals.sequence.length - 1]/intervals.span)/(intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)
                                indexMaxIntverVar = intervalsOptim.sequence.length - 1
                                let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, indexMaxIntverVar, lostEvents[0].nbE, Direction.Forward)
                                if(maxRatioF.value > ratioRight) {
                                    indexMaxIntverVar = maxRatioF.index
                                }
                            } else {
                                indexMaxIntverVar = intervalsOptim.sequence.length - 1
                            }
                            if(candidateEventIndex !== -1 && (candidateEventIndex !== intervalsOptim.sequence.length - 1 || indexMaxIntverVar !== intervalsOptim.sequence.length - 1)) {
                                console.log("A first evaluation of intervals between events shows that the event identified may be inconsistent.")
                            }
                            result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})

                        } else throw new Error("Inconsistent content of events in this interval.")

                    } else {
                        throw new Error("Inconsistent content of the intervals of lost events or more than one elementary event into a single interval between inflections.")
                    }
                }
                else if(lostEvents.length === 2) {
                    console.log("Number of reference events lost greater than one in distinct inflection intervals.")
                }
            } else if(inflectionIndices.length - inflectionIndicesOptim.length === 1) {
                /* JCL One inflection has been lost -> case of inflection gone outside the curve through one extremity */
                if(orderedDifferentialEvents[0].event === DiffEventType.inflection && orderedDifferentialEventsOptim.length === 0) {
                    let intervalExtrema = []
                    intervalExtrema.push(orderedDifferentialEvents[0].loc)
                    if(orderedDifferentialEvents.length === 1) {
                        intervalExtrema.push(1.0 - orderedDifferentialEvents[0].loc)
                    } else throw new Error("Inconsistent content of the sequence of events to identify the curve extremity where the inflection is lost.")

                    if(intervalExtrema[0] > intervalExtrema[intervalExtrema.length - 1]) {
                        result.push({event: NeighboringEventsType.neighboringInflectionRightBoundary, index: 0})
                    } else
                        result.push({event: NeighboringEventsType.neighboringInflectionLeftBoundary, index: 0})

                } else if(orderedDifferentialEvents[0].event === DiffEventType.inflection && orderedDifferentialEventsOptim[0].event !== DiffEventType.inflection) {
                    result.push({event: NeighboringEventsType.neighboringInflectionLeftBoundary, index: 0})
                } else if(orderedDifferentialEvents[orderedDifferentialEvents.length - 1].event === DiffEventType.inflection && orderedDifferentialEventsOptim[orderedDifferentialEventsOptim.length - 1].event !== DiffEventType.inflection) {
                    result.push({event: NeighboringEventsType.neighboringInflectionRightBoundary, index: orderedDifferentialEvents.length - 1})
                } else {
                    throw new Error("Inconsistent content of the sequence of events to identify the loss of an inflection at a curve extremity.")
                }
            } else if(orderedDifferentialEvents.length - orderedDifferentialEventsOptim.length === 2 && inflectionIndices.length - inflectionIndicesOptim.length === 2) {
                /* JCL Two inflections meet at one curvature extremum and these two are lost -> case of oscillation removal */
                /* JCL Locate candidate reference events */
                let refEventLocation: Array<number> = []
                for(let i = 0; i < orderedDifferentialEvents.length - 2; i += 1) {
                    if(orderedDifferentialEvents[i].event === DiffEventType.inflection &&
                        orderedDifferentialEvents[i + 1].event === DiffEventType.curvatExtremum &&
                        orderedDifferentialEvents[i + 2].event === DiffEventType.inflection) {
                            refEventLocation.push(i)
                    }
                }
                let refEventLocationOptim: Array<number> = []
                for(let i = 0; i < orderedDifferentialEventsOptim.length - 2; i += 1) {
                    if(orderedDifferentialEventsOptim[i].event === DiffEventType.inflection &&
                        orderedDifferentialEventsOptim[i + 1].event === DiffEventType.curvatExtremum &&
                        orderedDifferentialEventsOptim[i + 2].event === DiffEventType.inflection) {
                            refEventLocationOptim.push(i)
                    }
                }
                if(inflectionIndicesOptim.length !== inflectionIndices.length - 2 &&
                    ((refEventLocationOptim.length !== refEventLocation.length - 1 && refEventLocation.length === 1) ||
                    (refEventLocationOptim.length !== refEventLocation.length - 2 && refEventLocation.length > 1) ||
                    (refEventLocationOptim.length !== refEventLocation.length - 3 && refEventLocation.length > 2) )) {
                    throw new Error("Inconsistency of reference type event that does not coincide with oscillation removal.")
                } else {
                    let intervalEvent: Array<number> = []
                    if(refEventLocation[0] !== 0) intervalEvent.push(refEventLocation[0] + 1)
                    for(let j = 0; j < refEventLocation.length - 1; j += 1) {
                        intervalEvent.push(refEventLocation[j + 1] - refEventLocation[j])
                    }
                    let intervalEventOptim: Array<number> = []
                    if(refEventLocationOptim.length > 0) {
                        if(refEventLocationOptim[0] !== 0) intervalEventOptim.push(refEventLocationOptim[0] + 1)
                        for(let j = 0; j < refEventLocationOptim.length - 1; j += 1) {
                            intervalEventOptim.push(refEventLocationOptim[j + 1] - refEventLocationOptim[j])
                        }
                    } else {
                        if(refEventLocation.length === 1) result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[0]})
                        if(refEventLocation.length === 2) {
                            if(orderedDifferentialEventsOptim[refEventLocation[0]].event === DiffEventType.inflection) result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[1]})
                            else result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[0]})
                        }
                        if(refEventLocation.length === 3) {
                            if(orderedDifferentialEventsOptim[refEventLocation[0]].event === DiffEventType.inflection && orderedDifferentialEventsOptim[refEventLocation[1]].event !== DiffEventType.inflection) 
                                result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[1]})
                        }
                    }

                    for(let k = 0; k < intervalEventOptim.length; k += 1) {
                        if(intervalEvent[k] !== intervalEventOptim[k]) {
                            result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[k]})
                        }
                    }
                    if(refEventLocation.length - refEventLocationOptim.length === 2 && result.length === 0) {
                        result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[refEventLocation.length - 1]})
                    }
                }
            } else if(orderedDifferentialEvents.length - orderedDifferentialEventsOptim.length === -2 && inflectionIndices.length - inflectionIndicesOptim.length === -2) {
                /* JCL Two inflections are about to appear at one curvature extremum -> case of oscillation creation */
                /* JCL Locate candidate reference events */
                let refEventLocation: Array<number> = []
                for(let i = 0; i < orderedDifferentialEvents.length - 2; i += 1) {
                    if(orderedDifferentialEvents[i].event === DiffEventType.inflection &&
                        orderedDifferentialEvents[i + 1].event === DiffEventType.curvatExtremum &&
                        orderedDifferentialEvents[i + 2].event === DiffEventType.inflection) {
                            refEventLocation.push(i)
                    }
                }
                let refEventLocationOptim: Array<number> = []
                for(let i = 0; i < orderedDifferentialEventsOptim.length - 2; i += 1) {
                    if(orderedDifferentialEventsOptim[i].event === DiffEventType.inflection &&
                        orderedDifferentialEventsOptim[i + 1].event === DiffEventType.curvatExtremum &&
                        orderedDifferentialEventsOptim[i + 2].event === DiffEventType.inflection) {
                            refEventLocationOptim.push(i)
                    }
                }
                if(inflectionIndicesOptim.length - 2 !== inflectionIndices.length &&
                    ((refEventLocationOptim.length - 1 !== refEventLocation.length && refEventLocationOptim.length === 1) ||
                    (refEventLocationOptim.length - 2 !== refEventLocation.length && refEventLocationOptim.length > 1) ||
                    (refEventLocationOptim.length - 3 !== refEventLocation.length && refEventLocationOptim.length > 2) )) {
                    throw new Error("Inconsistency of reference type event that does not coincide with oscillation removal.")
                } else {
                    let intervalEvent: Array<number> = []
                    let intervalEventOptim: Array<number> = []
                    if(refEventLocationOptim[0] !== 0) intervalEventOptim.push(refEventLocationOptim[0] + 1)
                    for(let j = 0; j < refEventLocationOptim.length - 1; j += 1) {
                        intervalEventOptim.push(refEventLocationOptim[j + 1] - refEventLocationOptim[j])
                    }

                    if(refEventLocation.length > 0) {
                        if(refEventLocation[0] !== 0) intervalEvent.push(refEventLocation[0] + 1)
                        for(let j = 0; j < refEventLocation.length - 1; j += 1) {
                            intervalEvent.push(refEventLocation[j + 1] - refEventLocation[j])
                        }
                    } else {
                        if(refEventLocationOptim.length === 1) result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[0]})
                        if(refEventLocationOptim.length === 2) {
                            if(orderedDifferentialEvents[refEventLocationOptim[0]].event === DiffEventType.inflection) result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[1]})
                            else result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[0]})
                        }
                        if(refEventLocationOptim.length === 3) {
                            if(orderedDifferentialEvents[refEventLocationOptim[0]].event === DiffEventType.inflection && orderedDifferentialEvents[refEventLocationOptim[1]].event !== DiffEventType.inflection) 
                                result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[1]})
                        }
                    }

                    for(let k = 0; k < intervalEvent.length; k += 1) {
                        if(intervalEvent[k] !== intervalEventOptim[k]) {
                            result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[k]})
                        }
                    }
                    if(refEventLocation.length - refEventLocationOptim.length === -2 && result.length === 0) {
                        result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocationOptim[refEventLocationOptim.length - 1]})
                    }
                }
            } else {
                throw new Error("Changes in the differential events sequence don't match single elementary transformations.")
            }
        }

        return  result
    }

    optimize(selectedControlPoint: number, ndcX: number, ndcY: number) {

        /* JCL 2020/11/16 this test is no longer needed -> see leftMouseDragged_event where optimize is called */
        if (this.activeOptimizer === false) return

        const p = this.curveModel.spline.controlPoints[selectedControlPoint]
        const controlPointsInit = this.curveModel.spline.controlPoints.slice()
        const splineInit = this.curveModel.spline.clone()
        //console.log("CP before: ", JSON.parse(JSON.stringify(controlPointsInit)))

        /* JCL 2020/11/06 Set up the sequence of differential events along the current curve*/
        const splineDP = new BSplineR1toR2DifferentialProperties(this.curveModel.spline)
        const functionB = splineDP.curvatureDerivativeNumerator()
        const curvatureExtremaLocations = functionB.zeros()
        const inflectionLocations = splineDP.curvatureNumerator().zeros()
        let sequenceDiffEventsInit: Array<DifferentialEvent> = this.generateSequenceDifferentialEvents(curvatureExtremaLocations, inflectionLocations)
        //console.log(" init CP " + JSON.parse(JSON.stringify(this.curveModel.spline.controlPoints)))
        //console.log("Event(s): ", JSON.parse(JSON.stringify(sequenceDiffEventsInit)))

        /*console.log("optimize: inits0X " + this.curveModel.spline.controlPoints[0].x + " inits0Y " + this.curveModel.spline.controlPoints[0].y + " ndcX " + ndcX + " ndcY " + ndcY )*/
        this.curveModel.setControlPointPosition(selectedControlPoint, ndcX, ndcY)
        this.optimizationProblem.setTargetSpline(this.curveModel.spline)
        console.log("zeros " + curvatureExtremaLocations + " CP delta X " + (p.x - this.curveModel.spline.controlPoints[selectedControlPoint].x) + " delta Y " + (p.y - this.curveModel.spline.controlPoints[selectedControlPoint].y) + " signs " 
            + this.optimizationProblem.curvatureExtremaConstraintsSign + " inactive " + this.optimizationProblem.curvatureExtremaInactiveConstraints + " revert " + this.optimizationProblem.revertConstraints)
        this.optimizationProblem.updateConstraintBound = true
        //this.optimizationProblem.previousSequenceCurvatureExtrema = curvatureExtremaLocations
        //this.optimizationProblem.previousCurvatureExtremaControlPoints = functionB.controlPoints
        
        try {
            this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
            /*console.log("inactive constraints: " + this.optimizationProblem.curvatureExtremaConstraintsFreeIndices)*/
            /* JCL 2020/09/18 relocate the curve after the optimization process to clamp its first control point */
            //console.log("optimize : " + this.curveSceneController.activeLocationControl)
            let delta: Vector2d[] = []
            for(let i = 0; i < this.curveModel.spline.controlPoints.length; i += 1) {
                let inc = this.optimizationProblem.spline.controlPoints[i].substract(this.curveModel.spline.controlPoints[i])
                delta.push(inc)
            }

            /* JCL 2020/11/06 Set up the sequence of differential events along the current curve*/
            const splineDPoptim = new BSplineR1toR2DifferentialProperties(this.optimizationProblem.spline)
            const functionBOptim = splineDPoptim.curvatureDerivativeNumerator()
            //console.log("cDeriv ", functionBOptim.controlPoints[0] + " CP loc X " + ndcX + " Y " + ndcY)
            const curvatureExtremaLocationsOptim = functionBOptim.zeros()
            console.log("cDeriv [Ø] " + functionBOptim.controlPoints[0] + " [last] " + functionBOptim.controlPoints[functionBOptim.controlPoints.length - 1] + " zeros " + curvatureExtremaLocationsOptim)
            const inflectionLocationsOptim = splineDPoptim.curvatureNumerator().zeros()
            let sequenceDiffEventsOptim: Array<DifferentialEvent> = this.generateSequenceDifferentialEvents(curvatureExtremaLocationsOptim, inflectionLocationsOptim)
            this.optimizationProblem.previousSequenceCurvatureExtrema = curvatureExtremaLocations
            this.optimizationProblem.previousCurvatureExtremaControlPoints = functionB.controlPoints
            this.optimizationProblem.currentSequenceCurvatureExtrema = curvatureExtremaLocationsOptim
            this.optimizationProblem.currentCurvatureExtremaControPoints = functionBOptim.controlPoints

            /*let intermediateKnots: Array<intermediateKnotWithNeighborhood> = []
            let extremaNearKnot: Array<extremaNearKnot> = []
            if(this.optimizationProblem.spline.degree === 3 && this.optimizationProblem.spline.knots.length > 8) { */
                /* JCL 04/01/2021 Look for the location of intermediate knots of multiplicity one wrt curvature extrema */
                /*let knots = this.optimizationProblem.spline.knots
                for(let i = 4; i < (knots.length - 4); i += 1) {
                    if(this.optimizationProblem.spline.knotMultiplicity(knots[i]) === 1) intermediateKnots.push({knot: knots[i], left: knots[i - 1], right: knots[i + 1]})
                }
                for(let i = 0; i < intermediateKnots.length; i += 1) {
                    for(let j = 0; j < curvatureExtremaLocationsOptim.length; j += 1) {
                        if(curvatureExtremaLocationsOptim[j] > (intermediateKnots[i].knot - DEVIATION_FROM_KNOT*(intermediateKnots[i].knot - intermediateKnots[i].left)) &&
                        curvatureExtremaLocationsOptim[j] < (intermediateKnots[i].knot + DEVIATION_FROM_KNOT*(intermediateKnots[i].right - intermediateKnots[i].knot))) {
                            if(extremaNearKnot.length > 0 && extremaNearKnot[extremaNearKnot.length - 1].kIndex === i) extremaNearKnot[extremaNearKnot.length - 1].extrema.push(j)
                            else extremaNearKnot.push({kIndex: i, extrema: [j]})
                            console.log("add an event near an intermediate knot")
                        }
                    }
                }
            }*/
            //console.log("Event(s) optim: ", JSON.parse(JSON.stringify(sequenceDiffEventsOptim)))
            let neighboringEvents: Array<NeighboringEvents> = []
            if(this.curveSceneController?.controlOfCurvatureExtrema && this.curveSceneController?.controlOfInflection) {
                neighboringEvents = this.neighboringDifferentialEvents(sequenceDiffEventsInit, sequenceDiffEventsOptim)
                if(sequenceDiffEventsInit.length === sequenceDiffEventsOptim.length) {
                    this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.none
                }
                if(sequenceDiffEventsInit.length >= sequenceDiffEventsOptim.length) {
                    if(neighboringEvents.length > 0) {
                        if(this.curveSceneController?.counterLostEvent === 0) {
                            this.curveSceneController.lastLostEvent = neighboringEvents[0]
                            this.curveSceneController.counterLostEvent += 1
                        } else if(this.curveSceneController?.lastLostEvent.event === neighboringEvents[0].event && this.curveSceneController?.lastLostEvent.index === neighboringEvents[0].index) {
                            this.curveSceneController.counterLostEvent += 1
                        } else if(this.curveSceneController?.lastLostEvent.event !== neighboringEvents[0].event || 
                            (this.curveSceneController.lastLostEvent.event === neighboringEvents[0].event && this.curveSceneController?.lastLostEvent.index === neighboringEvents[0].index)) {
                            this.curveSceneController.counterLostEvent = 0
                            this.curveSceneController.lastLostEvent = {event: NeighboringEventsType.none, index: 0}
                        }
                        //console.log("lostEvent counter: " + this.curveSceneController.counterLostEvent)
                    }
                } else {
                    console.log("sequence init " + sequenceDiffEventsInit.length + " optim " + sequenceDiffEventsOptim.length + " controls: extrema " + this.curveSceneController?.controlOfCurvatureExtrema + " inflection " + this.curveSceneController?.controlOfInflection)
                    //console.log("Possibly an inconsistency between sequences of differential events at the transision between statuses of inflection and curvature controls")
                }
            }

            if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.firstControlPoint) {
                /*console.log("optimize : s[0] " + delta[0].norm() + " s[n] " + delta[delta.length - 1].norm())*/
                this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
            } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.both) {
                if(Math.abs(delta[delta.length - 1].substract(delta[0]).norm()) < 1.0E-6) {
                    /*console.log("optimize: s0sn constant")*/
                    /* JCL 2020/09/27 the last control vertex moves like the first one and can be clamped -> pas d'efffet significatif sur l'accumulation d'erreurs*/
                    delta[delta.length - 1] = delta[0]
                    this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                    this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                } else {
                    /*console.log("optimize: s0sn variable -> stop evolving")*/
                    this.curveSceneController.activeLocationControl = ActiveLocationControl.stopDeforming
                    this.curveModel.setControlPoints(controlPointsInit)
                }
            } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
            //}
            } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.none) {
                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
            }
            //this.curveModel.setSpline(this.optimizationProblem.spline.clone())
            /*if(sequenceDiffEventsOptim.length > 0 && sequenceDiffEventsInit.length >= sequenceDiffEventsOptim.length
                && this.curveSceneController.controlOfCurvatureExtrema && this.curveSceneController.controlOfInflection) {
                const controlPointsReloc = this.optimizationProblem.spline.clone().controlPoints
                const knotVector = this.optimizationProblem.spline.clone().knots
                let spline = new BSpline_R1_to_R2(controlPointsReloc, knotVector)
                let locFirstEvent = spline.evaluate(sequenceDiffEventsOptim[0].loc)
                let locLastEvent = spline.evaluate(sequenceDiffEventsOptim[sequenceDiffEventsOptim.length - 1].loc)
                if(Math.abs(controlPointsReloc[controlPointsReloc.length - 1].substract(locLastEvent).norm()) < 0.03 &&
                sequenceDiffEventsOptim[sequenceDiffEventsOptim.length - 1].loc - sequenceDiffEventsInit[sequenceDiffEventsInit.length - 1].loc > 0) {
                    if(sequenceDiffEventsInit[sequenceDiffEventsInit.length - 1].event === DiffEventType.curvatExtremum) 
                        neighboringEvents.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: sequenceDiffEventsInit.length - 1})
                    if(sequenceDiffEventsInit[sequenceDiffEventsInit.length - 1].event === DiffEventType.inflection) 
                        neighboringEvents.push({event: NeighboringEventsType.neighboringInflectionRightBoundary, index: sequenceDiffEventsInit.length - 1})
                    //this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.stopDeforming
                    //this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.stopDeforming
                    console.log("Event going out through curve extremity")
                } else if(Math.abs(controlPointsReloc[0].substract(locFirstEvent).norm()) < 0.03 &&
                sequenceDiffEventsOptim[0].loc - sequenceDiffEventsInit[0].loc < 0) {
                    if(sequenceDiffEventsInit[0].event === DiffEventType.curvatExtremum) neighboringEvents.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                    if(sequenceDiffEventsInit[0].event === DiffEventType.inflection) neighboringEvents.push({event: NeighboringEventsType.neighboringInflectionLeftBoundary, index: 0})
                    //this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.stopDeforming
                    //this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.stopDeforming
                    console.log("Event going out through curve origin")
                }
            }*/

            if(neighboringEvents.length === 0 && this.curveSceneController !== undefined) {
                if(sequenceDiffEventsOptim.length > 0) {
                    if(this.curveSceneController.sizeStackControlPolygons < this.curveSceneController.MAX_NB_CONFIGS_CP) {
                        this.curveSceneController?.stackControlPolygons.push(this.optimizationProblem.spline.clone().controlPoints)
                        this.curveSceneController.sizeStackControlPolygons += 1
                    } else if(this.curveSceneController?.sizeStackControlPolygons === this.curveSceneController?.MAX_NB_CONFIGS_CP) {
                        this.curveSceneController?.stackControlPolygons.push(this.optimizationProblem.spline.clone().controlPoints)
                        this.curveSceneController?.stackControlPolygons.shift()
                    }
                    //console.log("stack CP: ", this.curveSceneController.sizeStackControlPolygons)
                }

            } else if(!this.curveSceneController?.allowShapeSpaceChange && neighboringEvents.length > 0) {
                //this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.stopDeforming
                //this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.stopDeforming
                let curvatureExtrema: number[] = []
                let inflections: number[] = []
                let activeControl = this.optimizationProblem.activeControl
                for(let i = 0; i < neighboringEvents.length; i += 1) {
                    if(neighboringEvents[i].event === NeighboringEventsType.neighboringCurExtremumLeftBoundary ||
                        neighboringEvents[i].event === NeighboringEventsType.neighboringCurExtremumRightBoundary) {
                        if(sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) {
                            curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                        } else {
                            curvatureExtrema.push(sequenceDiffEventsOptim[neighboringEvents[i].index].loc)
                        }
                        let constraintID = this.optimizationProblem.spline.controlPoints.length - 1
                        if(neighboringEvents[i].event === NeighboringEventsType.neighboringCurExtremumLeftBoundary) constraintID = 0

                        if(constraintID === 0 && sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) neighboringEvents[i].event = NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
                        else if(constraintID === 0 && sequenceDiffEventsInit.length < sequenceDiffEventsOptim.length) neighboringEvents[i].event = NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
                        else if(constraintID === this.optimizationProblem.spline.controlPoints.length - 1 && sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) 
                            neighboringEvents[i].event = NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
                        else if(constraintID === this.optimizationProblem.spline.controlPoints.length - 1 && sequenceDiffEventsInit.length < sequenceDiffEventsOptim.length)
                            neighboringEvents[i].event = NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear
                        /* JCL Taking into account the extrema values and other value is not required */
                        neighboringEvents[i].value = 0.0
                        neighboringEvents[i].valueOptim = 0.0
                        neighboringEvents[i].locExt = 0.0
                        neighboringEvents[i].locExtOptim = 0.0
                        neighboringEvents[i].variation = []
                        neighboringEvents[i].variation?.push(0.0)
                        neighboringEvents[i].span = 0
                        neighboringEvents[i].range = 0
                        let shapeSpaceBoundaryConstraintsCurvExtrema = this.optimizationProblem.shapeSpaceBoundaryConstraintsCurvExtrema
                        if(this.optimizationProblem.shapeSpaceBoundaryConstraintsCurvExtrema.indexOf(constraintID) === -1) {
                            shapeSpaceBoundaryConstraintsCurvExtrema.push(constraintID)
                            /* JCL To be used for interaction when the user removes one event to monitor the removal (or the addition) of this event 
                            To be distinguished between the insertion of an extremum when removing the curvature extrema from the case where only one
                            extremum appears on the curve because the other one should appear outside (case where a couple of extrema appear simultaneously) */
                            this.lastDiffEvent = neighboringEvents[i].event
                        }

                        this.curveModel.setControlPoints(controlPointsInit)
                        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), 
                            activeControl, neighboringEvents[i], shapeSpaceBoundaryConstraintsCurvExtrema)
                        this.optimizer = this.newOptimizer(this.optimizationProblem)
                        if(constraintID === 0 && sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length
                            && this.curveSceneController !== undefined) {
                            this.optimizationProblem.neighboringEvent.event = NeighboringEventsType.neighboringCurExtremumLeftBoundaryDisappear
                            this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.extremumLeaving
                        } else if(constraintID === 0 && sequenceDiffEventsInit.length < sequenceDiffEventsOptim.length
                            && this.curveSceneController !== undefined) {
                            this.optimizationProblem.neighboringEvent.event = NeighboringEventsType.neighboringCurExtremumLeftBoundaryAppear
                            this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.extremumEntering
                        } else if(constraintID === this.optimizationProblem.spline.controlPoints.length - 1 && sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length
                            && this.curveSceneController !== undefined) {
                            this.optimizationProblem.neighboringEvent.event = NeighboringEventsType.neighboringCurExtremumRightBoundaryDisappear
                            this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.extremumLeaving
                        } else if(constraintID === this.optimizationProblem.spline.controlPoints.length - 1 && sequenceDiffEventsInit.length < sequenceDiffEventsOptim.length
                            && this.curveSceneController !== undefined) {
                            this.optimizationProblem.neighboringEvent.event = NeighboringEventsType.neighboringCurExtremumRightBoundaryAppear
                            this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.extremumEntering
                        }

                        this.curveModel.setControlPointPosition(selectedControlPoint, ndcX, ndcY)
                        this.optimizationProblem.setTargetSpline(this.curveModel.spline)
                        this.optimizationProblem.updateConstraintBound = true
                        console.log("start optimize" + " inactive " + this.optimizationProblem.curvatureExtremaInactiveConstraints)
                        try {
                            this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
                            delta = []
                            for(let i2 = 0; i2 < this.curveModel.spline.controlPoints.length; i2 += 1) {
                                let inc = this.optimizationProblem.spline.controlPoints[i2].substract(this.curveModel.spline.controlPoints[i2])
                                delta.push(inc)
                            }
                            const splineDPoptim1 = new BSplineR1toR2DifferentialProperties(this.optimizationProblem.spline)
                            const functionBOptim1 = splineDPoptim1.curvatureDerivativeNumerator()
                            const curvatureExtremaLocationsOptim1 = functionBOptim1.zeros()
                            console.log("cDeriv1 ", functionBOptim1.controlPoints + " zeros " + curvatureExtremaLocationsOptim1)

                            if(curvatureExtremaLocationsOptim1.length === curvatureExtremaLocations.length) {
                                //neighboringEvents[i].event = NeighboringEventsType.none
                                this.optimizationProblem.cancelEvent()
                                console.log("corrected curve at boundary is inside the shape space.")
                            } else {
                                console.log("corrected curve has crossed the boundary of shape space.")
                                const curvatureDerivativeOptim1 = functionBOptim1.derivative().zeros()
                                const curvatureDerivative = functionB.derivative().zeros()
                                if((curvatureExtremaLocationsOptim1.length - curvatureExtremaLocations.length) % 2 === 0) {
                                    /* JCL 06/03/2021 Connfiguration where one or more couples of extrema appeared */
                                    let curvatureExtremumInterval: number[] = []
                                    let variations1: number[] = []
                                    let variationsOptim1_2: number[] = []
                                    for(let iOptim = 0; iOptim < curvatureDerivativeOptim1.length; iOptim +=1) {
                                        let functionBExtremum =  functionBOptim1.evaluate(curvatureDerivativeOptim1[iOptim])
                                        let currentNbExtremumLocations = curvatureExtremumInterval.length
                                        for(let j = 0; j < curvatureExtremaLocationsOptim1.length - 1; j+=1) {
                                            if(curvatureDerivativeOptim1[iOptim] > curvatureExtremaLocationsOptim1[j] && curvatureDerivativeOptim1[iOptim] < curvatureExtremaLocationsOptim1[j + 1]) {
                                                curvatureExtremumInterval.push(j)
                                                if(curvatureDerivative.length === curvatureDerivativeOptim1.length) {
                                                    neighboringEvents[i].value = functionB.evaluate(curvatureDerivative[iOptim])
                                                    neighboringEvents[i].locExt = curvatureDerivative[iOptim]
                                                } else {
                                                    let minDist = Math.abs(curvatureDerivative[0] - curvatureDerivativeOptim1[iOptim])
                                                    let indexMin = 0
                                                    for(let k1 = 1; k1 < curvatureDerivative.length; k1 +=1) {
                                                        if(Math.abs(curvatureDerivative[k1] - curvatureDerivativeOptim1[iOptim]) < minDist) {
                                                            minDist = Math.abs(curvatureDerivative[k1] - curvatureDerivativeOptim1[iOptim])
                                                            indexMin = k1
                                                        }
                                                    }
                                                    neighboringEvents[i].value = functionB.evaluate(curvatureDerivative[indexMin])
                                                    neighboringEvents[i].locExt = curvatureDerivative[indexMin]
                                                }
                                                neighboringEvents[i].valueOptim = functionBExtremum
                                                neighboringEvents[i].locExtOptim = curvatureDerivativeOptim1[iOptim]
                                                /* JCL 1/03/2021 Add the location of the curvature extrema about to enter the shape space for display purposes */
                                                curvatureExtrema.push(curvatureExtremaLocationsOptim1[j])
                                                curvatureExtrema.push(curvatureExtremaLocationsOptim1[j + 1])
                                            }
                                        }
                                        if(currentNbExtremumLocations === curvatureExtremumInterval.length) console.log("Problem to locate a curvature derivative extremum. ")
                                        if(functionBExtremum > 0.0) {
                                            for(let j = 0; j < functionBOptim1.controlPoints.length; j +=1) {
                                                //if(functionBOptim1.controlPoints[j] > 0.0) variations1.push(functionBOptim1.controlPoints[j] - functionBOptim.controlPoints[j])
                                                variationsOptim1_2.push(functionBOptim1.controlPoints[j] - functionBOptim.controlPoints[j])
                                                variations1.push(functionBOptim.controlPoints[j] - functionB.controlPoints[j])
                                            }
                                            console.log("variations1_2: " + variationsOptim1_2)
                                        }
                                    }
                                    /* set constraints on some vertices of B(u) using the initial location of these vertices et re run the optimization */
                                    neighboringEvents[i].variation = variations1
                                    neighboringEvents[i].span = 0
                                    neighboringEvents[i].range = 0
                                    this.curveModel.setSpline(splineInit)
                                    //const splineDP2 = new BSpline_R1_to_R2_DifferentialProperties(splineInit)
                                    //const testfunctionB = splineDP2.curvatureDerivativeNumerator()
                                    this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), 
                                        activeControl, neighboringEvents[i], shapeSpaceBoundaryConstraintsCurvExtrema)
                                    this.optimizer = this.newOptimizer(this.optimizationProblem)
                                    this.curveModel.setControlPointPosition(selectedControlPoint, ndcX, ndcY)
                                    this.optimizationProblem.setTargetSpline(this.curveModel.spline)
                                    this.optimizationProblem.updateConstraintBound = true
                                    console.log("start optimize with removal curvature extrema" + " inactive " + this.optimizationProblem.curvatureExtremaInactiveConstraints)
                                    this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
                                    delta = []
                                    for(let i6 = 0; i6 < this.curveModel.spline.controlPoints.length; i6 += 1) {
                                        let inc = this.optimizationProblem.spline.controlPoints[i6].substract(this.curveModel.spline.controlPoints[i6])
                                        delta.push(inc)
                                    }
                                    this.optimizationProblem.cancelEvent()
                                    const splineDPoptim2 = new BSplineR1toR2DifferentialProperties(this.optimizationProblem.spline)
                                    const functionBOptim2 = splineDPoptim2.curvatureDerivativeNumerator()
                                    const curvatureExtremaLocationsOptim2 = functionBOptim2.zeros()
                                    console.log("cDeriv2 ", functionBOptim2.controlPoints + " zeros " + curvatureExtremaLocationsOptim2)
                                } else {
                                    console.log("inconsistent configuration where an odd number of curvature extrema appear")
                                }
                            }
                            /* JCL Add the curve relocation process */
                            if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.firstControlPoint) {
                                /*console.log("optimize : s[0] " + delta[0].norm() + " s[n] " + delta[delta.length - 1].norm())*/
                                this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                            } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.both) {
                                if(Math.abs(delta[delta.length - 1].substract(delta[0]).norm()) < 1.0E-6) {
                                    /*console.log("optimize: s0sn constant")*/
                                    /* JCL 2020/09/27 the last control vertex moves like the first one and can be clamped -> pas d'efffet significatif sur l'accumulation d'erreurs*/
                                    delta[delta.length - 1] = delta[0]
                                    this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                                    this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                                } else {
                                    /*console.log("optimize: s0sn variable -> stop evolving")*/
                                    this.curveSceneController.activeLocationControl = ActiveLocationControl.stopDeforming
                                    this.curveModel.setControlPoints(controlPointsInit)
                                }
                            } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                                this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                            //}
                            } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.none) {
                                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                            }
                        }
                        catch(e) {
                            this.curveModel.setControlPoints(controlPointsInit)
                            console.log(e)
                        }
                        //this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
                        //this.optimizer = this.newOptimizer(this.optimizationProblem)

                    } else if(neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionLeftBoundary ||
                        neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionRightBoundary) {
                        if(sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) {
                            inflections.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                            let constraintID = this.optimizationProblem.inflectionTotalNumberOfConstraints - 1
                            if(neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionLeftBoundary) constraintID = 0
                            if(this.optimizationProblem.shapeSpaceBoundaryConstraintsInflection.indexOf(constraintID) === -1) this.optimizationProblem.shapeSpaceBoundaryConstraintsInflection.push(constraintID)
                            this.curveModel.setControlPoints(controlPointsInit)
                            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
                            this.optimizer = this.newOptimizer(this.optimizationProblem)

                        } else {
                            inflections.push(sequenceDiffEventsOptim[neighboringEvents[i].index].loc)
                            console.log("Processing of a possible insertion of an inflection at an extremity must be added. Probably similar to the insertion of a curvature extremum.")
                        }

                    } else if(neighboringEvents[i].event === NeighboringEventsType.neighboringCurvatureExtrema) {
                        let extremaCurvatureDerivativeNumerator = functionB.derivative().zeros();
                        //let zeros = functionB.zeros()
                        let extremaCurvatureDerivativeNumeratorOptim = functionBOptim.derivative().zeros();
                        //let zerosOptim = functionBOptim.zeros()
                        let functionBExtremum = 0.0
                        let functionBOptimExtremum = 0.0
                        if(sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) {
                            curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                            curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index + 1].loc)
                            let indexExtremum = -1
                            for( let j = 0; j < extremaCurvatureDerivativeNumerator.length; j += 1) {
                                if(extremaCurvatureDerivativeNumerator[j] > sequenceDiffEventsInit[neighboringEvents[i].index].loc && extremaCurvatureDerivativeNumerator[j] < sequenceDiffEventsInit[neighboringEvents[i].index + 1].loc) indexExtremum = j
                            }
                            if(indexExtremum !== -1 && extremaCurvatureDerivativeNumeratorOptim.length > 0) {
                                functionBExtremum = functionB.evaluate(extremaCurvatureDerivativeNumerator[indexExtremum])
                                let indexExtremumOptim = 0
                                let minDist = Math.abs(extremaCurvatureDerivativeNumeratorOptim[0] - extremaCurvatureDerivativeNumerator[indexExtremum])
                                for(let j = 1; j < extremaCurvatureDerivativeNumeratorOptim.length; j += 1) {
                                    let dist = Math.abs(extremaCurvatureDerivativeNumeratorOptim[j] - extremaCurvatureDerivativeNumerator[indexExtremum])
                                    if( dist < minDist) {
                                        indexExtremumOptim = j
                                        minDist = dist
                                    }
                                }
                                /*if(extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim] > sequenceDiffEventsInit[neighboringEvents[i].index].loc && extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim] < sequenceDiffEventsInit[neighboringEvents[i].index + 1].loc) {
                                    console.log("Stable location of function B(u) extremum")
                                }*/
                                functionBOptimExtremum = functionBOptim.evaluate(extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim])
                                if((functionBExtremum * functionBOptimExtremum) > 0) {
                                    console.log("Inconsistency of function B(u) extrema values functionBExtremum: " + functionBExtremum + " functionBOptimExtremum" + functionBOptimExtremum)
                                }
                                neighboringEvents[i].event = NeighboringEventsType.neighboringCurvatureExtremaDisappear
                                neighboringEvents[i].value = functionBExtremum
                                neighboringEvents[i].valueOptim = functionBOptimExtremum
                                neighboringEvents[i].locExt = extremaCurvatureDerivativeNumerator[indexExtremum]
                                neighboringEvents[i].locExtOptim = extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim]
                                let variations: number[] =[]
                                for(let j = 0; j < functionB.controlPoints.length; j += 1) {
                                    variations.push(functionBOptim.controlPoints[j] - functionB.controlPoints[j])
                                }
                                neighboringEvents[i].variation = variations
                                const span = findSpan(extremaCurvatureDerivativeNumerator[indexExtremum], functionB.knots, functionB.degree)
                                const spanOptim = findSpan(extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim], functionBOptim.knots, functionBOptim.degree)
                                if(span === spanOptim) {
                                    neighboringEvents[i].span = span
                                    neighboringEvents[i].range = functionB.degree
                                } else {
                                    if( span < spanOptim) {
                                        neighboringEvents[i].span = span
                                        neighboringEvents[i].range = functionB.degree + spanOptim - span
                                    } else {
                                        neighboringEvents[i].span = spanOptim
                                        neighboringEvents[i].range = functionB.degree + span - spanOptim
                                    }
                                }
                                this.curveModel.setControlPoints(controlPointsInit)
                                this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl, neighboringEvents[i])
                                this.optimizer = this.newOptimizer(this.optimizationProblem)
                                let ratio = Math.abs(functionBExtremum/(functionBOptimExtremum - functionBExtremum))
                                let modifiedndcX = controlPointsInit[selectedControlPoint].x + (ndcX - controlPointsInit[selectedControlPoint].x) * ratio
                                let modifiedndcY = controlPointsInit[selectedControlPoint].y + (ndcY - controlPointsInit[selectedControlPoint].y) * ratio
                                this.curveModel.setControlPointPosition(selectedControlPoint, modifiedndcX, modifiedndcY)
                                this.optimizationProblem.setTargetSpline(this.curveModel.spline)
                                this.optimizationProblem.previousSequenceCurvatureExtrema = curvatureExtremaLocations
                                this.optimizationProblem.previousCurvatureExtremaControlPoints = functionB.controlPoints
                                this.optimizationProblem.updateConstraintBound = true
                                try {
                                    this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
                                    delta = []
                                    for(let i6 = 0; i6 < this.curveModel.spline.controlPoints.length; i6 += 1) {
                                        let inc = this.optimizationProblem.spline.controlPoints[i6].substract(this.curveModel.spline.controlPoints[i6])
                                        delta.push(inc)
                                    }
                                    const splineDPoptim1 = new BSplineR1toR2DifferentialProperties(this.optimizationProblem.spline)
                                    const functionBOptim1 = splineDPoptim1.curvatureDerivativeNumerator()
                                    const curvatureExtremaLocationsOptim1 = functionBOptim1.zeros()
                                    this.optimizationProblem.currentSequenceCurvatureExtrema = curvatureExtremaLocationsOptim1
                                    this.optimizationProblem.currentCurvatureExtremaControPoints = functionBOptim1.controlPoints
                                    if(curvatureExtremaLocationsOptim1.length === curvatureExtremaLocations.length) {
                                        console.log("set a control point displacement")
                                        //this.curveModel.setControlPoint(selectedControlPoint, modifiedndcX, modifiedndcY)
                                        //this.optimizationProblem.setTargetSpline(this.curveModel.spline)
                                        //this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
                                        neighboringEvents[i].event = NeighboringEventsType.none
                                        this.optimizationProblem.cancelEvent()
                                        console.log("corrected curve at boundary is inside the shape space.")
                                    } else {
                                        console.log("corrected curve has crossed the boundary of shape space.")
                                    }
                                    if(this.curveSceneController !== undefined) {
                                        this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.mergeExtremaAndInflection
                                        this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.mergeExtrema
                                    }
                                    this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
                                    this.optimizer = this.newOptimizer(this.optimizationProblem)
                                }
                                catch(e) {
                                    this.curveModel.setControlPoints(controlPointsInit)
                                    console.log(e)
                                }
                            } else if(extremaCurvatureDerivativeNumeratorOptim.length === 0) {
                                console.log("Must find the corresponding curve extremity")
                                neighboringEvents[i].event = NeighboringEventsType.neighboringCurvatureExtremaDisappear
                                if(extremaCurvatureDerivativeNumerator.length === 1) {
                                    functionBExtremum = functionB.evaluate(extremaCurvatureDerivativeNumerator[0])
                                    neighboringEvents[i].value = functionBExtremum
                                    let locExtOptim = 0.0
                                    if(extremaCurvatureDerivativeNumerator[0] < (1.0 - extremaCurvatureDerivativeNumerator[0])) {
                                        functionBOptimExtremum = functionBOptim.evaluate(0.0)
                                    } else {
                                        functionBOptimExtremum = functionBOptim.evaluate(1.0)
                                        locExtOptim = 1.0
                                    }
                                    neighboringEvents[i].locExtOptim = locExtOptim
                                    neighboringEvents[i].valueOptim = functionBOptimExtremum
                                    neighboringEvents[i].locExt = extremaCurvatureDerivativeNumerator[0]
                                    let variations: number[] =[]
                                    for(let j = 0; j < functionB.controlPoints.length; j += 1) {
                                        variations.push(functionBOptim.controlPoints[j] - functionB.controlPoints[j])
                                    }
                                    neighboringEvents[i].variation = variations
                                    const span = findSpan(extremaCurvatureDerivativeNumerator[0], functionB.knots, functionB.degree)
                                    const spanOptim = findSpan(locExtOptim, functionBOptim.knots, functionBOptim.degree)
                                    if(span === spanOptim) {
                                        neighboringEvents[i].span = span
                                        neighboringEvents[i].range = functionB.degree
                                    } else {
                                        if( span < spanOptim) {
                                            neighboringEvents[i].span = span
                                            neighboringEvents[i].range = functionB.degree + spanOptim - span
                                        } else {
                                            neighboringEvents[i].span = spanOptim
                                            neighboringEvents[i].range = functionB.degree + span - spanOptim
                                        }
                                    }
                                    this.curveModel.setControlPoints(controlPointsInit)
                                    this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl, neighboringEvents[i])
                                    this.optimizer = this.newOptimizer(this.optimizationProblem)
                                    this.optimizationProblem.setTargetSpline(this.curveModel.spline)
                                    this.optimizationProblem.updateConstraintBound = true
                                    try {
                                        this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
                                        delta = []
                                        for(let i3 = 0; i3 < this.curveModel.spline.controlPoints.length; i3 += 1) {
                                            let inc = this.optimizationProblem.spline.controlPoints[i3].substract(this.curveModel.spline.controlPoints[i3])
                                            delta.push(inc)
                                        }
                                        const splineDPoptimCE = new BSplineR1toR2DifferentialProperties(this.optimizationProblem.spline)
                                        const functionBOptimCE = splineDPoptimCE.curvatureDerivativeNumerator()
                                        const curvatureExtremaLocationsOptimCE = functionBOptimCE.zeros()
                                        if(curvatureExtremaLocationsOptimCE.length === curvatureExtremaLocations.length) {
                                            neighboringEvents[i].event = NeighboringEventsType.none
                                            this.optimizationProblem.cancelEvent()
                                            console.log("One extremum: corrected curve at boundary is inside the shape space.")
                                        } else {
                                            console.log("One extremum: corrected curve has crossed the boundary of shape space.")
                                        }
                                        /* JCL Missing the curve relocation process -> to add */
                                        if(this.curveSceneController !== undefined) {
                                            this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.mergeExtremaAndInflection
                                            this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.mergeExtrema
                                        }
                                        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
                                        this.optimizer = this.newOptimizer(this.optimizationProblem)
                                    }
                                    catch(e) {
                                        this.curveModel.setControlPoints(controlPointsInit)
                                        console.log(e)
                                    }
                                } else {
                                    console.log("Further processing needed to locate the correct extremum of CurvatureDerivativeNumerator")
                                }
                            }
                        } else {
                            curvatureExtrema.push(sequenceDiffEventsOptim[neighboringEvents[i].index].loc)
                            curvatureExtrema.push(sequenceDiffEventsOptim[neighboringEvents[i].index + 1].loc)
                            let knotIndex = 0
                            if(this.curveModel.spline.degree === 3) {
                                for( let k = 4; k < this.curveModel.spline.knots.length - 4; k += 1) {
                                    if(curvatureExtrema[curvatureExtrema.length -1] === this.curveModel.spline.knots[k] || curvatureExtrema[curvatureExtrema.length -2] === this.curveModel.spline.knots[k]) {
                                        console.log("extremum at intermediate knot " + curvatureExtrema[curvatureExtrema.length -1])
                                        knotIndex = k
                                    }
                                }
                            }
                            let indexExtremumOptim = -1
                            for( let j = 0; j < extremaCurvatureDerivativeNumeratorOptim.length; j += 1) {
                                if(extremaCurvatureDerivativeNumeratorOptim[j] >= sequenceDiffEventsOptim[neighboringEvents[i].index].loc && extremaCurvatureDerivativeNumeratorOptim[j] <= sequenceDiffEventsOptim[neighboringEvents[i].index + 1].loc) indexExtremumOptim = j
                            }
                            if(indexExtremumOptim !== -1 && extremaCurvatureDerivativeNumerator.length > 0) {
                                //console.log("Process configuration with pre-existing extrema.")
                                let functionBOptimExtremum1 = 0.0
                                let functionBOptimExtremum2 = 0.0
                                if(knotIndex === 0) {
                                    functionBOptimExtremum = functionBOptim.evaluate(extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim])
                                } else {
                                    functionBOptimExtremum1 = functionBOptim.controlPoints[(knotIndex - 3) * 6]
                                    functionBOptimExtremum2 = functionBOptim.controlPoints[(knotIndex - 3) * 6 + 1]
                                }
                                let indexExtremum = 0
                                let minDist = Math.abs(extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim] - extremaCurvatureDerivativeNumerator[0])
                                for(let j = 1; j < extremaCurvatureDerivativeNumerator.length; j += 1) {
                                    let dist = Math.abs(extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim] - extremaCurvatureDerivativeNumerator[j])
                                    if( dist < minDist) {
                                        indexExtremum = j
                                        minDist = dist
                                    }
                                }
                                /*if(extremaCurvatureDerivativeNumerator[indexExtremum] > sequenceDiffEventsOptim[neighboringEvents[i].index].loc && extremaCurvatureDerivativeNumerator[indexExtremum] < sequenceDiffEventsOptim[neighboringEvents[i].index + 1].loc) {
                                    console.log("Stable location of function B(u) extremum")
                                }*/
                                let functionBExtremum1 = 0.0
                                let functionBExtremum2 = 0.0
                                if(knotIndex === 0) {
                                    functionBExtremum = functionB.evaluate(extremaCurvatureDerivativeNumerator[indexExtremum])
                                } else {
                                    functionBExtremum1 = functionB.controlPoints[(knotIndex - 3) * 6]
                                    functionBExtremum2 = functionB.controlPoints[(knotIndex - 3) * 6 + 1]
                                    if((functionBExtremum1 < functionBExtremum2 && functionBExtremum1 > 0) || (functionBExtremum1 > functionBExtremum2 && functionBExtremum1 < 0)) {
                                        functionBExtremum = functionBExtremum1
                                        functionBOptimExtremum = functionBOptimExtremum1
                                    } else if((functionBExtremum2 < functionBExtremum1 && functionBExtremum2 > 0) || (functionBExtremum2 > functionBExtremum1 && functionBExtremum2 < 0)) {
                                        functionBExtremum = functionBExtremum2
                                        functionBOptimExtremum = functionBOptimExtremum2
                                    } else console.log("Inconsistent setting to define functionB extremum with degree 3 curve at an intermediate knot.")
                                    neighboringEvents[i].span = (knotIndex - 3) * 6
                                    neighboringEvents[i].range = functionB.degree
                                }
                                if((functionBExtremum * functionBOptimExtremum) > 0) {
                                    console.log("Inconsistency of function B(u) extrema values functionBExtremum: "+functionBExtremum+" functionBOptimExtremum"+functionBOptimExtremum)
                                }
                                neighboringEvents[i].event = NeighboringEventsType.neighboringCurvatureExtremaAppear
                                neighboringEvents[i].value = functionBExtremum
                                neighboringEvents[i].valueOptim = functionBOptimExtremum
                                neighboringEvents[i].locExt = extremaCurvatureDerivativeNumerator[indexExtremum]
                                neighboringEvents[i].locExtOptim = extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim]
                                let variations: number[] =[]
                                for(let j = 0; j < functionB.controlPoints.length; j += 1) {
                                    variations.push(functionBOptim.controlPoints[j] - functionB.controlPoints[j])
                                }
                                neighboringEvents[i].variation = variations

                                if(knotIndex === 0) {
                                    const span = findSpan(extremaCurvatureDerivativeNumerator[indexExtremum], functionB.knots, functionB.degree)
                                    const spanOptim = findSpan(extremaCurvatureDerivativeNumeratorOptim[indexExtremumOptim], functionBOptim.knots, functionBOptim.degree)
                                    if(span === spanOptim) {
                                        neighboringEvents[i].span = span
                                        neighboringEvents[i].range = functionB.degree
                                    } else {
                                        if( span < spanOptim) {
                                            neighboringEvents[i].span = span
                                            neighboringEvents[i].range = functionB.degree + spanOptim - span
                                        } else {
                                            neighboringEvents[i].span = spanOptim
                                            neighboringEvents[i].range = functionB.degree + span - spanOptim
                                        }
                                    }
                                }
                                neighboringEvents[i].knotIndex = knotIndex
                                this.curveModel.setControlPoints(controlPointsInit)
                                this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl, neighboringEvents[i])
                                this.optimizer = this.newOptimizer(this.optimizationProblem)
                                this.curveModel.setControlPointPosition(selectedControlPoint, ndcX, ndcY)
                                this.optimizationProblem.setTargetSpline(this.curveModel.spline)
                                this.optimizationProblem.updateConstraintBound = true
                                console.log("start optimize 2 extrema appear" + " inactive " + this.optimizationProblem.curvatureExtremaInactiveConstraints)
                                try {
                                    this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
                                    delta = []
                                    for(let i5 = 0; i5 < this.curveModel.spline.controlPoints.length; i5 += 1) {
                                        let inc = this.optimizationProblem.spline.controlPoints[i5].substract(this.curveModel.spline.controlPoints[i5])
                                        delta.push(inc)
                                    }
                                    const splineDPoptimCEA = new BSplineR1toR2DifferentialProperties(this.optimizationProblem.spline)
                                    const functionBOptimCEA = splineDPoptimCEA.curvatureDerivativeNumerator()
                                    const curvatureExtremaLocationsOptimCEA = functionBOptimCEA.zeros()
                                    if(curvatureExtremaLocationsOptimCEA.length === curvatureExtremaLocations.length) {
                                        neighboringEvents[i].event = NeighboringEventsType.none
                                        this.optimizationProblem.cancelEvent()
                                        console.log("corrected curve at boundary is inside the shape space.")
                                    } else {
                                        this.optimizationProblem.cancelEvent()
                                        console.log("corrected curve has crossed the boundary of shape space.")
                                    }
                                    if(this.curveSceneController !== undefined) {
                                        this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.mergeExtremaAndInflection
                                        this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.extremumEntering
                                    }

                                    /* JCL Add the curve relocation process */
                                    if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.firstControlPoint) {
                                        /*console.log("optimize : s[0] " + delta[0].norm() + " s[n] " + delta[delta.length - 1].norm())*/
                                        this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                                        this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                                    } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.both) {
                                        if(Math.abs(delta[delta.length - 1].substract(delta[0]).norm()) < 1.0E-6) {
                                            /*console.log("optimize: s0sn constant")*/
                                            /* JCL 2020/09/27 the last control vertex moves like the first one and can be clamped -> pas d'efffet significatif sur l'accumulation d'erreurs*/
                                            delta[delta.length - 1] = delta[0]
                                            this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                                            this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                                        } else {
                                            /*console.log("optimize: s0sn variable -> stop evolving")*/
                                            this.curveSceneController.activeLocationControl = ActiveLocationControl.stopDeforming
                                            this.curveModel.setControlPoints(controlPointsInit)
                                        }
                                    } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                                        this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController?.activeLocationControl)
                                        this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                                    //}
                                    } else if(this.curveSceneController?.activeLocationControl === ActiveLocationControl.none) {
                                        this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                                    }

                                }
                                catch(e) {
                                    this.curveModel.setControlPoints(controlPointsInit)
                                    console.log(e)
                                }
                            } else if(extremaCurvatureDerivativeNumerator.length === 0) {
                                neighboringEvents[i].event = NeighboringEventsType.neighboringCurvatureExtremaAppear
                                if(extremaCurvatureDerivativeNumeratorOptim.length === 1) {
                                    functionBOptimExtremum = functionBOptim.evaluate(extremaCurvatureDerivativeNumeratorOptim[0])
                                    neighboringEvents[i].valueOptim = functionBOptimExtremum
                                    let locExt = 0.0
                                    if(extremaCurvatureDerivativeNumeratorOptim[0] < (1.0 - extremaCurvatureDerivativeNumeratorOptim[0])) {
                                        functionBExtremum = functionB.evaluate(0.0)
                                    } else {
                                        functionBExtremum = functionB.evaluate(1.0)
                                        locExt = 1.0
                                    }
                                    neighboringEvents[i].locExt = locExt
                                    neighboringEvents[i].value = functionBExtremum
                                    neighboringEvents[i].locExtOptim = extremaCurvatureDerivativeNumeratorOptim[0]
                                    let variations: number[] =[]
                                    for(let j = 0; j < functionB.controlPoints.length; j += 1) {
                                        variations.push(functionBOptim.controlPoints[j] - functionB.controlPoints[j])
                                    }
                                    neighboringEvents[i].variation = variations
                                    const span = findSpan(locExt, functionB.knots, functionB.degree)
                                    const spanOptim = findSpan(extremaCurvatureDerivativeNumeratorOptim[0], functionBOptim.knots, functionBOptim.degree)
                                    if(span === spanOptim) {
                                        neighboringEvents[i].span = span
                                        neighboringEvents[i].range = functionB.degree
                                    } else {
                                        if( span < spanOptim) {
                                            neighboringEvents[i].span = span
                                            neighboringEvents[i].range = functionB.degree + spanOptim - span
                                        } else {
                                            neighboringEvents[i].span = spanOptim
                                            neighboringEvents[i].range = functionB.degree + span - spanOptim
                                        }
                                    }
                                    this.curveModel.setControlPoints(controlPointsInit)
                                    this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl, neighboringEvents[i])
                                    this.optimizer = this.newOptimizer(this.optimizationProblem)
                                    this.optimizationProblem.setTargetSpline(this.curveModel.spline)
                                    this.optimizationProblem.updateConstraintBound = true
                                    try {
                                        this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
                                        delta = []
                                        for(let i4 = 0; i4 < this.curveModel.spline.controlPoints.length; i4 += 1) {
                                            let inc = this.optimizationProblem.spline.controlPoints[i4].substract(this.curveModel.spline.controlPoints[i4])
                                            delta.push(inc)
                                        }
                                        const splineDPoptimCE2 = new BSplineR1toR2DifferentialProperties(this.optimizationProblem.spline)
                                        const functionBOptimCE2 = splineDPoptimCE2.curvatureDerivativeNumerator()
                                        const curvatureExtremaLocationsOptimCE2 = functionBOptimCE2.zeros()
                                        if(curvatureExtremaLocationsOptimCE2.length === curvatureExtremaLocations.length) {
                                            neighboringEvents[i].event = NeighboringEventsType.none
                                            this.optimizationProblem.cancelEvent()
                                            console.log("One extremum appear: corrected curve at boundary is inside the shape space.")
                                        } else {
                                            console.log("One extremum appear: corrected curve has crossed the boundary of shape space.")
                                        }
                                        if(this.curveSceneController !== undefined) {
                                            this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.mergeExtremaAndInflection
                                            this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.mergeExtrema
                                        }
                                        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_general_navigation(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
                                        this.optimizer = this.newOptimizer(this.optimizationProblem)
                                    }
                                    catch(e) {
                                        this.curveModel.setControlPoints(controlPointsInit)
                                        console.log(e)
                                    }
                                }
                            }
                        }
                    } else if(neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionsCurvatureExtremum) {
                        if(sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) {
                            inflections.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                            inflections.push(sequenceDiffEventsInit[neighboringEvents[i].index + 2].loc)
                        } else {
                            inflections.push(sequenceDiffEventsOptim[neighboringEvents[i].index].loc)
                            inflections.push(sequenceDiffEventsOptim[neighboringEvents[i].index + 2].loc)
                        }
                    }
                }
                if(this.curveSceneController !== undefined) {
                    this.curveSceneController.selectedCurvatureExtrema = curvatureExtrema.slice()
                    this.curveSceneController.selectedInflection = inflections.slice()
                }

                //if(neighboringEvents[0].event !== NeighboringEventsType.none) this.curveModel.setControlPoints(controlPointsInit)

                if(neighboringEvents[0].event !== NeighboringEventsType.none) console.log("Neighboring event(s): " + neighboringEvents[0].event + " location: " + neighboringEvents[0].index + " CP stopDef")
                if(neighboringEvents[0].event !== NeighboringEventsType.none) console.log("CP stopDef: ", JSON.parse(JSON.stringify(this.curveModel.spline.controlPoints)))
            } else if(this.curveSceneController?.allowShapeSpaceChange) {
                this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.none
                this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.none
            }
            //console.log("CP Optim: ", JSON.parse(JSON.stringify(this.curveModel.spline.controlPoints)))
        }
            catch(e) {
            /* JCL 2020/11/12 Replace the setControlPoint by setControlPoints to stay consistent with all the 
            possible configurations of modifications of the curve if a failure does not come from the optimization*/
            //this.curveModel.setControlPoint(selectedControlPoint, p.x, p.y)
            this.curveModel.setControlPoints(controlPointsInit)
            console.log(e)
        }


    }
}