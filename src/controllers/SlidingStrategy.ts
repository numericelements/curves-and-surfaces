import { CurveControlStrategyInterface } from "./CurveControlStrategyInterface";
import { OptimizationProblem_BSpline_R1_to_R2, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors, OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics, ActiveControl } from "../mathematics/OptimizationProblem_BSpline_R1_to_R2";
import { Optimizer } from "../mathematics/Optimizer";
import { CurveModel } from "../models/CurveModel";
import { Vector_2d } from "../mathematics/Vector_2d";
import { CurveSceneController, ActiveLocationControl, ActiveInflectionLocationControl, ActiveExtremaLocationControl } from "./CurveSceneController"
import { BSpline_R1_to_R2_DifferentialProperties } from "../mathematics/BSpline_R1_to_R2_DifferentialProperties";
import { BSpline_R1_to_R2 } from "../mathematics/BSpline_R1_to_R2"
import { type } from "os";


export enum NeighboringEventsType {neighboringCurExtremumLeftBoundary, neighboringInflectionLeftBoundary, 
                                neighboringCurExtremumRightBoundary, neighboringInflectionRightBoundary,
                                neighboringCurvatureExtrema, neighboringInflectionsCurvatureExtremum, none}
export interface NeighboringEvents {event: NeighboringEventsType; index: number}
export enum DiffEventType {inflection, curvatExtremum, unDefined}
export interface DifferentialEvent {event: DiffEventType; loc: number}
enum Direction {Forward, Reverse}

interface modifiedEvents {inter: number, nbE: number}
interface intervalsCurvatureExt {span: number, sequence: number[]}

export class SlidingStrategy implements CurveControlStrategyInterface {
    
    private optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors
    private optimizer: Optimizer
    private activeOptimizer: boolean = true

    private curveModel: CurveModel
    /* JCL 2020/09/23 Add management of the curve location */
    private curveSceneController: CurveSceneController

    constructor(curveModel: CurveModel, controlOfInflection: boolean, controlOfCurvatureExtrema: boolean, curveSceneController: CurveSceneController ) {
        this.curveModel = curveModel
        //enum ActiveControl {curvatureExtrema, inflections, both}
        let activeControl : ActiveControl = ActiveControl.both

        /* JCL 2020/09/23 Update the curve location control in accordance with the status of the clamping button and the status of curveSceneController.activeLocationControl */
        this.curveSceneController = curveSceneController

        if (!controlOfCurvatureExtrema) {
            activeControl = ActiveControl.inflections
        }
        else if (!controlOfInflection) {
            activeControl = ActiveControl.curvatureExtrema
        } 

        if (!controlOfInflection && !controlOfCurvatureExtrema) {
            this.activeOptimizer = false
            //console.log("activeOptimizer in SlidingStrategy: " + this.activeOptimizer)
            this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.none
            this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.none
        }

        /* JCL 2020/10/06 use optimization with inactive constraints dedicated to cubics */
        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl)
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl) */
        this.optimizer = this.newOptimizer(this.optimizationProblem)
    }

    setWeightingFactor(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        optimizationProblem.weigthingFactors[0] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length-1] = 10
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length*2-1] = 10
    }

    newOptimizer(optimizationProblem: OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors) {
        this.setWeightingFactor(optimizationProblem)
        return new Optimizer(optimizationProblem)
    }

    resetCurve(curveModel: CurveModel) {
        this.curveModel = curveModel
        this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone())
        /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone()) */
        this.optimizer = this.newOptimizer(this.optimizationProblem)
    }

    toggleControlOfCurvatureExtrema(): void {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema) */
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections) */
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections ){
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
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
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.inflections)*/
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.inflections) {
            this.activeOptimizer = false
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.both) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema)
            /*this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_dedicated_cubics(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.curvatureExtrema) */
            this.optimizer = this.newOptimizer(this.optimizationProblem)
        }
        else if (this.optimizationProblem.activeControl === ActiveControl.curvatureExtrema) {
            this.optimizationProblem = new  OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), ActiveControl.both)
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
            throw new Error("Inconsistent length of sequence of differential events")
        }
        return result
    }

    computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents: Array<DifferentialEvent>, inflectionIndices: number[], lostEvents: Array<modifiedEvents>): intervalsCurvatureExt {
        let interval = 1.0
        let intervalExtrema: intervalsCurvatureExt = {span: interval, sequence: []}
        if(inflectionIndices.length === 0 && orderedDifferentialEvents.length > 0) {
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

    indexSmallestInterval(intervalExtrema: intervalsCurvatureExt, nbEvents?: number): number {
        let candidateEventIndex = -1
        let ratio: number[] = []
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
        if(intervalExtrema.sequence.length > 0) {
            candidateEventIndex = mappedRatio[0].index
            /* JCL Take into account the optional number of events  */
            /* if the number of events removed equals 2 smallest intervals at both extremities can be removed because */
            /* they are of different types of there no event if it is a free extremity of the curve */
            if(nbEvents === 2) {
                if(mappedRatio[0].index === 0 || mappedRatio[0].index === intervalExtrema.sequence.length - 1) {
                    candidateEventIndex = mappedRatio[1].index
                    if(mappedRatio[1].index === 0 || mappedRatio[1].index === intervalExtrema.sequence.length - 1) {
                        candidateEventIndex = mappedRatio[2].index
                    }
                } 
            } else if(nbEvents === 1) {
                if(mappedRatio[0].index === 0 || mappedRatio[0].index === intervalExtrema.sequence.length - 1) {
                    candidateEventIndex = mappedRatio[1].index
                }
            }
        } 
        return candidateEventIndex
    }

    indexIntervalMaximalVariation(intervalsExtrema: intervalsCurvatureExt, intervalsExtremaOptim: intervalsCurvatureExt, scan: Direction): {index: number, value: number} {
        let intervalIndex: number = -1
        let maxRatio = {index: intervalIndex, value: 0}
        if(scan === Direction.Forward) {
            let upperBound: number = 0
            if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
                upperBound = intervalsExtremaOptim.sequence.length
            } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
                upperBound = intervalsExtrema.sequence.length
            }
            for(let k = 0; k < upperBound; k += 1) {
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
            let lowerBound: number = 0
            if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
                lowerBound = intervalsExtremaOptim.sequence.length
            } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length){
                lowerBound = intervalsExtrema.sequence.length
            }
            for(let k = lowerBound - 1; k > -1; k -= 1) {
                let currentRatio = 1.0
                if(intervalsExtrema.sequence.length > intervalsExtremaOptim.sequence.length) {
                    currentRatio = (intervalsExtremaOptim.sequence[k]/intervalsExtremaOptim.span)/(intervalsExtrema.sequence[k]/intervalsExtrema.span)
                } else if(intervalsExtrema.sequence.length < intervalsExtremaOptim.sequence.length) {
                    currentRatio = (intervalsExtrema.sequence[k]/intervalsExtrema.span)/(intervalsExtremaOptim.sequence[k]/intervalsExtremaOptim.span)
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
                            let intervalExtrema = []
                            let intervalExtremaOptim = []

                            let intervals: intervalsCurvatureExt
                            intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
                            let intervalsOptim: intervalsCurvatureExt
                            intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
                            let candidateEventIndex = this.indexSmallestInterval(intervals)
                            let ratioLeft = 0.0, ratioRight = 0.0, indexMaxIntverVar = -1
                            if(intervalsOptim.sequence.length > 0) {
                                ratioLeft = (intervalsOptim.sequence[0]/intervalsOptim.span)/(intervals.sequence[0]/intervals.span)
                                ratioRight = (intervalsOptim.sequence[intervalsOptim.sequence.length - 1]/intervalsOptim.span)/(intervals.sequence[intervals.sequence.length - 1]/intervals.span)
                            } else {
                                ratioLeft = 1.0/(intervals.sequence[0]/intervals.span)
                                ratioRight = 1.0/(intervals.sequence[intervals.sequence.length - 1]/intervals.span)
                            }
                            if(ratioLeft > ratioRight) {
                                indexMaxIntverVar = 0
                                if(intervalsOptim.sequence.length > 0) {
                                    let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, Direction.Reverse)
                                    if(maxRatioR.value > ratioLeft) {
                                        indexMaxIntverVar = maxRatioR.index
                                    }
                                }
                            } else {
                                indexMaxIntverVar = intervals.sequence.length - 1
                                if(intervalsOptim.sequence.length > 0) {
                                    let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, Direction.Forward)
                                    if(maxRatioF.value > ratioRight) {
                                        indexMaxIntverVar = maxRatioF.index
                                    }
                                }
                            }
                            
                            if(candidateEventIndex !== -1) {
                                if(indexMaxIntverVar === candidateEventIndex) {
                                    console.log("Events are stable as well as the candidate event.")
                                } else if(indexMaxIntverVar !== candidateEventIndex) {
                                    console.log("Events are stable but differ from the candidate event.")
                                    /* set up stuff to process configurations with event located near a knot */
                                    candidateEventIndex = indexMaxIntverVar
                                }
                            }

                            if(inflectionIndices.length === 0) {
                                if(candidateEventIndex === 0) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                                //} else if (maxRatio.index === intervalExtremaOptim.length - 1) {
                                } else if (candidateEventIndex === intervals.sequence.length - 1) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})
                                } else {
                                    console.log("Inconsistent identification of curvature extremum")
                                    result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
                                }
                            } else {
                                if(candidateEventIndex === 0) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                                } else if(candidateEventIndex === intervals.sequence.length - 1) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})
                                } else {
                                    console.log("Inconsistent identification of curvature extremum")
                                    result.push({event: NeighboringEventsType.none, index: candidateEventIndex})
                                }
                            }

                        } else if(lostEvents[0].inter === inflectionIndices.length) {
                            result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEvents.length - 1})
                        }
                    } else if(lostEvents[0].nbE === 2) {
                        let intervals: intervalsCurvatureExt
                        intervals = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEvents, inflectionIndices, lostEvents)
                        let intervalsOptim: intervalsCurvatureExt
                        intervalsOptim = this.computeIntervalsBetweenCurvatureExtrema(orderedDifferentialEventsOptim, inflectionIndicesOptim, lostEvents)
                        let candidateEventIndex = this.indexSmallestInterval(intervals, lostEvents[0].nbE)
                        let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, Direction.Forward)
                        let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, Direction.Reverse)
                        if(candidateEventIndex !== -1) {
                            if(intervalsOptim.sequence.length > 0) {
                                if(maxRatioF.index === maxRatioR.index && maxRatioF.index === (candidateEventIndex - 1)) {
                                    console.log("Events are stable as well as the candidate events.")
                                } else if(maxRatioF.index === maxRatioR.index && (maxRatioF.index !== (candidateEventIndex - 1))) {
                                    console.log("Events are stable but differ from the candidate events.")
                                    candidateEventIndex = maxRatioF.index + 1
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
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 1})
                            /* JCL To avoid use of incorrect indices */
                            if(candidateEventIndex === orderedDifferentialEvents.length) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 2})
                                console.log("Probably incorrect identification of events indices.")
                            }
                        } else if(lostEvents[0].inter === inflectionIndices.length) {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex})
                            /* JCL To avoid use of incorrect indices */
                            if(inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex === orderedDifferentialEvents.length - 1) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[inflectionIndices.length - 1] + candidateEventIndex - 1})
                                console.log("Probably incorrect identification of events indices.")
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
                        let maxRatioF = this.indexIntervalMaximalVariation(intervals, intervalsOptim, Direction.Forward)
                        let maxRatioR = this.indexIntervalMaximalVariation(intervals, intervalsOptim, Direction.Reverse)
                        if(candidateEventIndex !== -1) {
                            if(intervals.sequence.length > 0) {
                                if(maxRatioF.index === maxRatioR.index && maxRatioF.index === (candidateEventIndex - 1)) {
                                    console.log("Events are stable as well as the candidate events.")
                                } else if(maxRatioF.index === maxRatioR.index && (maxRatioF.index !== (candidateEventIndex - 1))) {
                                    console.log("Events are stable but differ from the candidate events.")
                                    candidateEventIndex = maxRatioF.index + 1
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

                        if(inflectionIndices.length === 0) {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 1})
                            /* JCL To avoid use of incorrect indices */
                            if(candidateEventIndex === orderedDifferentialEventsOptim.length) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: candidateEventIndex - 2})
                                console.log("Probably incorrect identification of events indices.")
                            }
                        } else if(lostEvents[0].inter === inflectionIndicesOptim.length) {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex})
                            /* JCL To avoid use of incorrect indices */
                            if(inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex === orderedDifferentialEventsOptim.length - 1) {
                                result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[inflectionIndicesOptim.length - 1] + candidateEventIndex - 1})
                                console.log("Probably incorrect identification of events indices.")
                            }
                        } else {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndicesOptim[lostEvents[0].inter - 1] + candidateEventIndex})
                        }

                    } else {
                        throw new Error("Inconsistent content of the intervals of lost curvature extrema or more than one reference event occured.")
                    }
                }
                else if(lostEvents.length === 2) {
                    console.log("Number of reference events lost greater than one in distinct inflection intervals")
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
                /* JCL Two inflections meet at one curvature extrema and these two are lost -> case of oscillation removal */
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
                    if(refEventLocation.length - refEventLocationOptim.length === 2 && result.length === 0)
                    result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[refEventLocation.length - 1]})
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
        //console.log("CP before: ", JSON.parse(JSON.stringify(controlPointsInit)))

        /* JCL 2020/11/06 Set up the sequence of differential events along the current curve*/
        const splineDP = new BSpline_R1_to_R2_DifferentialProperties(this.curveModel.spline)
        const curvatureExtremaLocations = splineDP.curvatureDerivativeNumerator().zeros()
        const inflectionLocations = splineDP.curvatureNumerator().zeros()
        let sequenceDiffEventsInit: Array<DifferentialEvent> = this.generateSequenceDifferentialEvents(curvatureExtremaLocations, inflectionLocations)
        console.log("Event(s): ", JSON.parse(JSON.stringify(sequenceDiffEventsInit)))

        /*console.log("optimize: inits0X " + this.curveModel.spline.controlPoints[0].x + " inits0Y " + this.curveModel.spline.controlPoints[0].y + " ndcX " + ndcX + " ndcY " + ndcY )*/
        this.curveModel.setControlPoint(selectedControlPoint, ndcX, ndcY)
        this.optimizationProblem.setTargetSpline(this.curveModel.spline)
        
        try {
            this.optimizer.optimize_using_trust_region(10e-8, 100, 800)
            /*console.log("inactive constraints: " + this.optimizationProblem.curvatureExtremaConstraintsFreeIndices)*/
            /* JCL 2020/09/18 relocate the curve after the optimization process to clamp its first control point */
            //console.log("optimize : " + this.curveSceneController.activeLocationControl)
            let delta: Vector_2d[] = []
            for(let i = 0; i < this.curveModel.spline.controlPoints.length; i += 1) {
                let inc = this.optimizationProblem.spline.controlPoints[i].substract(this.curveModel.spline.controlPoints[i])
                delta.push(inc)
            }

            /* JCL 2020/11/06 Set up the sequence of differential events along the current curve*/
            const splineDPoptim = new BSpline_R1_to_R2_DifferentialProperties(this.optimizationProblem.spline)
            let curvatureExtremaLocationsOptim = splineDPoptim.curvatureDerivativeNumerator().zeros()
            let inflectionLocationsOptim = splineDPoptim.curvatureNumerator().zeros()
            let sequenceDiffEventsOptim: Array<DifferentialEvent> = this.generateSequenceDifferentialEvents(curvatureExtremaLocationsOptim, inflectionLocationsOptim)
            console.log("Event(s) optim: ", JSON.parse(JSON.stringify(sequenceDiffEventsOptim)))
            let neighboringEvents: Array<NeighboringEvents> = []
            if(this.curveSceneController.controlOfCurvatureExtrema && this.curveSceneController.controlOfInflection) {
                neighboringEvents = this.neighboringDifferentialEvents(sequenceDiffEventsInit, sequenceDiffEventsOptim)
                if(sequenceDiffEventsInit.length >= sequenceDiffEventsOptim.length) {
                    if(neighboringEvents.length > 0) {
                        if(this.curveSceneController.counterLostEvent === 0) {
                            this.curveSceneController.lastLostEvent = neighboringEvents[0]
                            this.curveSceneController.counterLostEvent += 1
                        } else if(this.curveSceneController.lastLostEvent.event === neighboringEvents[0].event && this.curveSceneController.lastLostEvent.index === neighboringEvents[0].index) {
                            this.curveSceneController.counterLostEvent += 1
                        } else if(this.curveSceneController.lastLostEvent.event !== neighboringEvents[0].event || 
                            (this.curveSceneController.lastLostEvent.event === neighboringEvents[0].event && this.curveSceneController.lastLostEvent.index === neighboringEvents[0].index)) {
                            this.curveSceneController.counterLostEvent = 0
                            this.curveSceneController.lastLostEvent = {event: NeighboringEventsType.none, index: 0}
                        }
                        console.log("lostEvent counter: " + this.curveSceneController.counterLostEvent)
                    }
                } else {
                    console.log("sequence init " + sequenceDiffEventsInit.length + " optim " + sequenceDiffEventsOptim.length + " controls: extrema " + this.curveSceneController.controlOfCurvatureExtrema + " inflection " + this.curveSceneController.controlOfInflection)
                    console.log("Possibly an inconsistency between seqsuences of differential events at the transision between statuses of inflection and curvature controls")
                }
            }

            if(this.curveSceneController.activeLocationControl === ActiveLocationControl.firstControlPoint) {
                /*console.log("optimize : s[0] " + delta[0].norm() + " s[n] " + delta[delta.length - 1].norm())*/
                this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController.activeLocationControl)
                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
            } else if(this.curveSceneController.activeLocationControl === ActiveLocationControl.both) {
                if(Math.abs(delta[delta.length - 1].substract(delta[0]).norm()) < 1.0E-6) {
                    /*console.log("optimize: s0sn constant")*/
                    /* JCL 2020/09/27 the last control vertex moves like the first one and can be clamped -> pas d'efffet significatif sur l'accumulation d'erreurs*/
                    delta[delta.length - 1] = delta[0]
                    this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController.activeLocationControl)
                    this.curveModel.setSpline(this.optimizationProblem.spline.clone())
                } else {
                    /*console.log("optimize: s0sn variable -> stop evolving")*/
                    this.curveSceneController.activeLocationControl = ActiveLocationControl.stopDeforming
                    this.curveModel.setControlPoints(controlPointsInit)
                }
            } else if(this.curveSceneController.activeLocationControl === ActiveLocationControl.lastControlPoint) {
                this.optimizationProblem.spline.relocateAfterOptimization(delta, this.curveSceneController.activeLocationControl)
                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
            //}
            } else if(this.curveSceneController.activeLocationControl === ActiveLocationControl.none) {
                this.curveModel.setSpline(this.optimizationProblem.spline.clone())
            }
            //this.curveModel.setSpline(this.optimizationProblem.spline.clone())
            if(sequenceDiffEventsOptim.length > 0 && this.curveSceneController.controlOfCurvatureExtrema && this.curveSceneController.controlOfInflection) {
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
            }

            if(neighboringEvents.length === 0) {
                if(sequenceDiffEventsOptim.length > 0) {
                    if(this.curveSceneController.sizeStackControlPolygons < this.curveSceneController.MAX_NB_CONFIGS_CP) {
                        this.curveSceneController.stackControlPolygons.push(this.optimizationProblem.spline.clone().controlPoints)
                        this.curveSceneController.sizeStackControlPolygons += 1
                    } else if(this.curveSceneController.sizeStackControlPolygons === this.curveSceneController.MAX_NB_CONFIGS_CP) {
                        this.curveSceneController.stackControlPolygons.push(this.optimizationProblem.spline.clone().controlPoints)
                        this.curveSceneController.stackControlPolygons.shift()
                    }
                    //console.log("stack CP: ", this.curveSceneController.sizeStackControlPolygons)
                }

            } else if(!this.curveSceneController.allowShapeSpaceChange && neighboringEvents.length > 0) {
                //if(neighboringEvents[0].event === NeighboringEventsType.neighboringCurvatureExtrema) {
                    this.curveSceneController.activeInflectionLocationControl = ActiveInflectionLocationControl.stopDeforming
                    this.curveSceneController.activeExtremaLocationControl = ActiveExtremaLocationControl.stopDeforming
                //}
                let curvatureExtrema: number[] = []
                let inflections: number[] = []
                for(let i = 0; i < neighboringEvents.length; i += 1) {
                    if(neighboringEvents[i].event === NeighboringEventsType.neighboringCurExtremumLeftBoundary ||
                        neighboringEvents[i].event === NeighboringEventsType.neighboringCurExtremumRightBoundary) {
                        if(sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                        else curvatureExtrema.push(sequenceDiffEventsOptim[neighboringEvents[i].index].loc)
                    } else if(neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionLeftBoundary ||
                        neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionRightBoundary) {
                        if(sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) inflections.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                        else inflections.push(sequenceDiffEventsOptim[neighboringEvents[i].index].loc)
                    } else if(neighboringEvents[i].event === NeighboringEventsType.neighboringCurvatureExtrema) {
                        if(sequenceDiffEventsInit.length > sequenceDiffEventsOptim.length) {
                            curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                            curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index + 1].loc)
                        } else {
                            curvatureExtrema.push(sequenceDiffEventsOptim[neighboringEvents[i].index].loc)
                            curvatureExtrema.push(sequenceDiffEventsOptim[neighboringEvents[i].index + 1].loc)
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
                this.curveSceneController.selectedCurvatureExtrema = curvatureExtrema.slice()
                this.curveSceneController.selectedInflection = inflections.slice()

                //if(this.curveSceneController.counterLostEvent === 1) {
                    this.curveModel.setControlPoints(controlPointsInit)
                //}
                /*else if(this.curveSceneController.counterLostEvent > 1) {
                    let controlPoints: Array<Vector_2d> = []
                    if( this.curveSceneController.counterLostEvent <= this.curveSceneController.sizeStackControlPolygons) {
                        controlPoints = this.curveSceneController.stackControlPolygons[this.curveSceneController.sizeStackControlPolygons - this.curveSceneController.counterLostEvent]
                    } else {
                        controlPoints = this.curveSceneController.stackControlPolygons[0]
                    }
                    this.curveModel.setControlPoints(controlPoints)
                }*/
                console.log("Neighboring event(s): " + neighboringEvents[0].event + " location: " + neighboringEvents[0].index + " CP stopDef")
                console.log("CP stopDef: ", JSON.parse(JSON.stringify(this.curveModel.spline.controlPoints)))
            } else if(this.curveSceneController.allowShapeSpaceChange) {
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