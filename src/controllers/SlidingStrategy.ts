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

    neighboringDifferentialEvents(orderedDifferentialEvents: Array<DifferentialEvent>, orderedDifferentialEventsOptim: Array<DifferentialEvent>): Array<NeighboringEvents> {
        let result: Array<NeighboringEvents> =  []
        const MIN_DIST_EVENTS = 10^-6

        if(orderedDifferentialEvents.length > 0 && orderedDifferentialEventsOptim.length !== orderedDifferentialEvents.length){
            /* JCL Analyze the sequence of inflections */
            interface modifiedEvents {inter: number, nbE: number}
            let inflectionIndices = []
            for(let i = 0; i < orderedDifferentialEvents.length; i += 1) {
                if(orderedDifferentialEvents[i].event === DiffEventType.inflection) inflectionIndices.push(i)
            }
            let inflectionIndicesOptim = []
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
                            let upperBound = 0
                            intervalExtrema.push(orderedDifferentialEvents[0].loc)
                            if(inflectionIndices.length === 0) {
                                upperBound = orderedDifferentialEvents.length - 1
                            } else {
                                upperBound = inflectionIndices[0] - 1
                            }
                            for(let k = 0; k < upperBound; k += 1) {
                                intervalExtrema.push(orderedDifferentialEvents[k + 1].loc - orderedDifferentialEvents[k].loc)
                            }
                            if(inflectionIndices.length === 0) intervalExtrema.push(1.0 - orderedDifferentialEvents[orderedDifferentialEvents.length - 1].loc)
                            else intervalExtrema.push(orderedDifferentialEvents[inflectionIndices[0]].loc - orderedDifferentialEvents[inflectionIndices[0] - 1].loc)

                            if(orderedDifferentialEventsOptim.length > 0) {
                                intervalExtremaOptim.push(orderedDifferentialEventsOptim[0].loc)
                                if(inflectionIndicesOptim.length === 0) {
                                    upperBound = orderedDifferentialEventsOptim.length - 1
                                } else {
                                    upperBound = inflectionIndicesOptim[0] - 1
                                }
                                for(let k = 0; k < upperBound; k += 1) {
                                    intervalExtremaOptim.push(orderedDifferentialEventsOptim[k + 1].loc - orderedDifferentialEventsOptim[k].loc)
                                }
                                if(inflectionIndicesOptim.length === 0) intervalExtremaOptim.push(1.0 - orderedDifferentialEventsOptim[orderedDifferentialEventsOptim.length - 1].loc)
                                else {
                                    if(inflectionIndicesOptim[0] > 0) intervalExtremaOptim.push(orderedDifferentialEventsOptim[inflectionIndicesOptim[0]].loc - orderedDifferentialEventsOptim[inflectionIndicesOptim[0] - 1].loc)
                                    else intervalExtremaOptim.push(orderedDifferentialEventsOptim[inflectionIndicesOptim[0]].loc)
                                }
                            } else intervalExtremaOptim.push(1.0)
                            let ratio = [], ratioOptim = [], ratioVariation = []
                            let intervalSpan = 1.0
                            if(inflectionIndices.length > 0) intervalSpan = orderedDifferentialEvents[inflectionIndices[0]].loc
                            for(let k = 0; k < intervalExtrema.length; k += 1) {
                                ratio.push(intervalExtrema[k]/intervalSpan)
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
                            let candidateEventIndex = mappedRatio[0].index
                            let maxRatio = {index: 0, value: 0}
                            let intervalOptimSpan = 1.0
                            if(inflectionIndicesOptim.length > 0) intervalOptimSpan = orderedDifferentialEventsOptim[inflectionIndicesOptim[0]].loc
                            for(let k = 0; k < intervalExtremaOptim.length; k += 1) {
                                let currentRatio = intervalExtremaOptim[k]/intervalOptimSpan
                                if(k === 0) {
                                    maxRatio.value = currentRatio
                                } else if(k < candidateEventIndex && currentRatio > maxRatio.value) {
                                    maxRatio.value = currentRatio
                                    maxRatio.index = k
                                }
                                ratioOptim.push(currentRatio)
                                ratioVariation.push(ratioOptim[k]/ratio[k])
                            }
                            if(maxRatio.index !== candidateEventIndex) {
                                console.log("The identification of lost curvature extrema is not robust.")
                            }
                            if(inflectionIndices.length === 0) {
                                if(maxRatio.index === 0) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                                } else if (maxRatio.index === intervalExtremaOptim.length - 1) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEventsOptim.length - 1})
                                } else {
                                    console.log("Inconsistent identification of curvature extremum")
                                    result.push({event: NeighboringEventsType.none, index: maxRatio.index})
                                }
                            } else {
                                if(maxRatio.index === 0) {
                                    result.push({event: NeighboringEventsType.neighboringCurExtremumLeftBoundary, index: 0})
                                } else {
                                    console.log("Inconsistent identification of curvature extremum")
                                    result.push({event: NeighboringEventsType.none, index: maxRatio.index})
                                }
                            }

                        } else if(lostEvents[0].inter === inflectionIndices.length) {
                            result.push({event: NeighboringEventsType.neighboringCurExtremumRightBoundary, index: orderedDifferentialEventsOptim.length - 1})
                        }
                    } else if(lostEvents[0].nbE === 2) {
                        let interval = 1.0, intervalOptim = 1.0
                        let intervalExtrema = []
                        let intervalExtremaOptim = []

                        if(inflectionIndices.length === 0) {
                            interval = 1.0
                            intervalOptim = 1.0
                            intervalExtrema.push(orderedDifferentialEvents[0].loc)
                            for(let k = 0; k < orderedDifferentialEvents.length - 1; k += 1) {
                                intervalExtrema.push(orderedDifferentialEvents[k + 1].loc - orderedDifferentialEvents[k].loc)
                            }
                            intervalExtrema.push(1.0 - orderedDifferentialEvents[orderedDifferentialEvents.length - 1].loc)
                            if(orderedDifferentialEventsOptim.length > 0) {
                                intervalExtremaOptim.push(orderedDifferentialEventsOptim[0].loc)
                                for(let k = 0; k <= orderedDifferentialEventsOptim.length - 1; k += 1) {
                                    intervalExtremaOptim.push(orderedDifferentialEventsOptim[k + 1].loc - orderedDifferentialEventsOptim[k].loc)
                                }
                                intervalExtremaOptim.push(1.0 - orderedDifferentialEventsOptim[orderedDifferentialEventsOptim.length - 1].loc)
                            } else intervalExtremaOptim.push(intervalOptim)

                        } else if(lostEvents[0].inter === inflectionIndices.length) {
                            interval = 1.0 - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter - 1]].loc
                            intervalOptim = 1.0 - orderedDifferentialEventsOptim[inflectionIndices[lostEvents[0].inter - 1]].loc
                            for(let k = inflectionIndices[inflectionIndices.length - 1]; k < orderedDifferentialEvents.length - 1; k += 1) {
                                intervalExtrema.push(orderedDifferentialEvents[k + 1].loc - orderedDifferentialEvents[k].loc)
                            }
                            intervalExtrema.push(1.0 - orderedDifferentialEvents[orderedDifferentialEvents.length - 1].loc)

                            for(let k = inflectionIndicesOptim[inflectionIndicesOptim.length - 1]; k < orderedDifferentialEventsOptim.length - 1; k += 1) {
                                intervalExtremaOptim.push(orderedDifferentialEventsOptim[k + 1].loc - orderedDifferentialEventsOptim[k].loc)
                            }
                            intervalExtremaOptim.push(1.0 - orderedDifferentialEventsOptim[orderedDifferentialEventsOptim.length - 1].loc)

                        } else if(inflectionIndices.length > 1 && lostEvents[0].inter < inflectionIndices.length) {
                            interval = orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter]].loc - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter - 1]].loc
                            for(let k = inflectionIndices[lostEvents[0].inter - 1] + 1; k < inflectionIndices[lostEvents[0].inter]; k += 1) {
                                intervalExtrema.push(orderedDifferentialEvents[k].loc - orderedDifferentialEvents[k - 1].loc)
                            }
                            intervalExtrema.push(orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter]].loc - orderedDifferentialEvents[inflectionIndices[lostEvents[0].inter] - 1].loc)

                            intervalOptim = orderedDifferentialEventsOptim[inflectionIndicesOptim[lostEvents[0].inter]].loc - orderedDifferentialEventsOptim[inflectionIndicesOptim[lostEvents[0].inter - 1]].loc
                            for(let k = inflectionIndicesOptim[lostEvents[0].inter - 1] + 1; k < inflectionIndicesOptim[lostEvents[0].inter]; k += 1) {
                                intervalExtremaOptim.push(orderedDifferentialEventsOptim[k].loc - orderedDifferentialEventsOptim[k - 1].loc)
                            }
                            intervalExtremaOptim.push(orderedDifferentialEventsOptim[inflectionIndicesOptim[lostEvents[0].inter]].loc - orderedDifferentialEventsOptim[inflectionIndicesOptim[lostEvents[0].inter] - 1].loc)

                        } else if(inflectionIndices[lostEvents[0].inter] - inflectionIndices[lostEvents[0].inter - 1] < 4) {
                            /* JCL A minimum of four intervals is required to obtain a meaningful loss of curvature extrema */
                            console.log("Inconsistent number of curvature extrema in the current interval of inflections. Number too small.")
                        }

                        let ratio = [], ratioOptim = [], ratioVariation = []
                        for(let k = 0; k < intervalExtrema.length; k += 1) {
                            ratio.push(intervalExtrema[k]/interval)
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
                        let candidateEventIndex = mappedRatio[0].index
                        let maxRatio = {index: 0, value: 0}
                        for(let k = 0; k < intervalExtremaOptim.length; k += 1) {
                            let currentRatio = intervalExtremaOptim[k]/intervalOptim
                            if(k === 0) {
                                maxRatio.value = currentRatio
                            } else if(k < candidateEventIndex && currentRatio > maxRatio.value) {
                                maxRatio.value = currentRatio
                                maxRatio.index = k
                            }
                            ratioOptim.push(currentRatio)
                            ratioVariation.push(ratioOptim[k]/ratio[k])
                        }
                        if(maxRatio.index !== candidateEventIndex - 1) {
                            console.log("The identification of lost curvature extrema is not robust.")
                        }
                        /*let mappedRatioOptim = ratioOptim.map(function(location, i) {
                            return { index: i, value: location };
                          })
                        mappedRatioOptim.sort(function(a, b) {
                            if (a.value > b.value) {
                              return 1;
                            }
                            if (a.value < b.value) {
                              return -1;
                            }
                            return 0;
                        }) */
                        if(inflectionIndices.length === 0) {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: maxRatio.index})
                        } else if(lostEvents[0].inter === inflectionIndices.length) {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[inflectionIndices.length - 1] + maxRatio.index + 1})
                        } else {
                            result.push({event: NeighboringEventsType.neighboringCurvatureExtrema, index: inflectionIndices[lostEvents[0].inter - 1] + maxRatio.index + 1})
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
                    result.push({event: NeighboringEventsType.neighboringInflectionLeftBoundary, index: 0})
                } else if(orderedDifferentialEvents[0].event === DiffEventType.inflection && orderedDifferentialEventsOptim[0].event !== DiffEventType.inflection) {
                    result.push({event: NeighboringEventsType.neighboringInflectionLeftBoundary, index: 0})
                } else if(orderedDifferentialEvents[orderedDifferentialEvents.length - 1].event === DiffEventType.inflection && orderedDifferentialEventsOptim[orderedDifferentialEventsOptim.length - 1].event !== DiffEventType.inflection) {
                    result.push({event: NeighboringEventsType.neighboringInflectionRightBoundary, index: orderedDifferentialEvents.length - 1})
                } else {
                    throw new Error("Inconsistent content of the sequence of event to identify the loss of an inflection at a curve extremity.")
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
                if(refEventLocationOptim.length !== refEventLocation.length - 1 && inflectionIndicesOptim.length !== inflectionIndices.length - 2) {
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
                    }

                    for(let k = 0; k < intervalEventOptim.length; k += 1) {
                        if(intervalEvent[k] !== intervalEventOptim[k]) {
                            result.push({event: NeighboringEventsType.neighboringInflectionsCurvatureExtremum, index: refEventLocation[k]})
                        }
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
        //console.log("CP before: ", JSON.parse(JSON.stringify(controlPointsInit)))

        /* JCL 2020/11/06 Set up the sequence of differential events along the current curve*/
        const splineDP = new BSpline_R1_to_R2_DifferentialProperties(this.curveModel.spline)
        const curvatureExtremaLocations = splineDP.curvatureDerivativeNumerator().zeros()
        const inflectionLocations = splineDP.curvatureNumerator().zeros()
        let sequenceDiffEventsInit: Array<DifferentialEvent> = this.generateSequenceDifferentialEvents(curvatureExtremaLocations, inflectionLocations)
        //console.log("Event(s): ", JSON.parse(JSON.stringify(sequenceDiffEventsInit)))

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
            //console.log("Event(s) optim: ", JSON.parse(JSON.stringify(sequenceDiffEventsOptim)))
            let neighboringEvents: Array<NeighboringEvents> = []
            if(this.curveSceneController.controlOfCurvatureExtrema && this.curveSceneController.controlOfInflection) {
                if(sequenceDiffEventsInit.length >= sequenceDiffEventsOptim.length) {
                    neighboringEvents = this.neighboringDifferentialEvents(sequenceDiffEventsInit, sequenceDiffEventsOptim)
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
                        curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                    } else if(neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionLeftBoundary ||
                        neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionRightBoundary) {
                        inflections.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                    } else if(neighboringEvents[i].event === NeighboringEventsType.neighboringCurvatureExtrema) {
                        curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                        curvatureExtrema.push(sequenceDiffEventsInit[neighboringEvents[i].index + 1].loc)
                    } else if(neighboringEvents[i].event === NeighboringEventsType.neighboringInflectionsCurvatureExtremum) {
                        inflections.push(sequenceDiffEventsInit[neighboringEvents[i].index].loc)
                        inflections.push(sequenceDiffEventsInit[neighboringEvents[i].index + 2].loc)
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