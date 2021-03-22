import { SequenceOfDifferentialEvents } from "./SequenceOfDifferentialEvents";
import { ModifiedCurvatureEvents } from "./ModifiedEvents";
import { NeighboringEvents, NeighboringEventsType } from "./NeighboringEvents";
import { SequenceOfIntervals } from "./Sequence0fIntervals";

export const UPPER_BOUND_CURVE_INTERVAL = 1.0;
export const LOWER_BOUND_CURVE_INTERVAL = 0.0;
export const CURVE_INTERVAL_SPAN = UPPER_BOUND_CURVE_INTERVAL - LOWER_BOUND_CURVE_INTERVAL;
export const RETURN_ERR0R_CODE = -1;

enum Direction {Forward, Reverse}

export class ComparatorOfSequencesOfDiffEvents {

    private _sequenceDiffEvents1: SequenceOfDifferentialEvents;
    private _sequenceDiffEvents2: SequenceOfDifferentialEvents;
    private intervalsBtwExtrema1?: SequenceOfIntervals;
    private intervalsBtwExtrema2?: SequenceOfIntervals;
    public modifiedEvents: Array<ModifiedCurvatureEvents> = [];

    constructor(sequenceDiffEvents1: SequenceOfDifferentialEvents, sequenceDiffEvents2: SequenceOfDifferentialEvents) {
        this._sequenceDiffEvents1 = sequenceDiffEvents1;
        this._sequenceDiffEvents2 = sequenceDiffEvents2;
    }

    /**
     * Compare the sequences of differential events _sequenceDiffEvents1 and _sequenceDiffEvents2 to look for curvature extrema changes (appearing/disappearing)
     * when the number of inflections is identical in each sequence
     * @returns an array of ModifiedCurvatureEvents where each interval is defined by two successive inflections. This interval is characterized by the 
     * right inflection identified by its INDEX in the array of indices of inflections found in _sequenceDiffEvents1. When event changes occur in the last interval
     * of _sequenceDiffEvents1, i.e., after the last inflection of this sequence, the right bound of this interval is set to: indicesInflection1.length
     * (the number inflections + 1).
     */
    locateIntervalAndNumberOfEventChanges(): Array<ModifiedCurvatureEvents> {
        if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
            let shift = 0;
            for(let j = 0; j < this._sequenceDiffEvents1.indicesOfInflections.length; j += 1) {
                let delta = this._sequenceDiffEvents1.indicesOfInflections[j] - this._sequenceDiffEvents2.indicesOfInflections[j];
                if(delta !== shift) {
                    let modEventInInterval = new ModifiedCurvatureEvents(j, (delta-shift));
                    this.modifiedEvents.push(modEventInInterval);
                    shift = shift + delta;
                }
            }
            if(this._sequenceDiffEvents1.indicesOfInflections.length > 0 && this.modifiedEvents.length === 0) {
                // There are inflections and no changes in the first indicesInflectionInit.length intervals -> changes take place in the last interval
                let modEventInInterval = new ModifiedCurvatureEvents(this._sequenceDiffEvents1.indicesOfInflections.length, (this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()));
                this.modifiedEvents.push(modEventInInterval);
            }
            if(this._sequenceDiffEvents1.indicesOfInflections.length === 0) {
                // There is no inflexion in the sequence of events -> all events take place in the 'first' interval
                let modEventInInterval = new ModifiedCurvatureEvents(0, (this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()));
                this.modifiedEvents.push(modEventInInterval);
            }
        }
        if(this._sequenceDiffEvents1.length() === this._sequenceDiffEvents2.length() && this._sequenceDiffEvents1.indicesOfInflections.length > 0) {
            this.checkConsistencySumModifiedEvents();
        }
        this.checkConsistencyModifiedEvents();

        return this.modifiedEvents;
    }

    locateNeiboringEvents(): NeighboringEvents {
        this.modifiedEvents = this.locateIntervalAndNumberOfEventChanges();
        let neighboringEvents = new NeighboringEvents(NeighboringEventsType.none, -1);
        if(this.modifiedEvents.length === 0) {
            if(this._sequenceDiffEvents1.indicesOfInflections.length === this._sequenceDiffEvents2.indicesOfInflections.length) {
                // No change in curvature extrema has been identified as well as no change in inflections
                throw new Error("Inconsistent analysis of lost events in the sequence of differential events.");
            } else {
                
            }

        } else if(this.modifiedEvents.length === 1) {
            this._sequenceDiffEvents1.checkConsistencyIntervalBtwInflections(this.modifiedEvents[0]);
            if(this.modifiedEvents[0].nbEvents === 1) {
                // Because there is only one event disappearing and this event is of type curvature extremum, it can take place eitehr in the first or in the last interval
                if(this.modifiedEvents[0].indexInflection === 0) {
                    let indexInflection = this.modifiedEvents[0].indexInflection;
                    this.intervalsBtwExtrema1 = this._sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(indexInflection);
                    this.intervalsBtwExtrema2 = this._sequenceDiffEvents2.computeIntervalsBtwCurvatureExtrema(indexInflection);
                    let candidateEventIndex = this.intervalsBtwExtrema1.indexSmallestInterval(this.modifiedEvents[0].nbEvents);
                    let ratioLeft = 0.0, ratioRight = 0.0, indexMaxIntverVar = -1;
                    if(this.intervalsBtwExtrema2.sequence.length > 0) {
                        ratioLeft = (this.intervalsBtwExtrema2.sequence[0]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[0]/this.intervalsBtwExtrema1.span)
                        ratioRight = (this.intervalsBtwExtrema2.sequence[this.intervalsBtwExtrema2.sequence.length - 1]/this.intervalsBtwExtrema2.span)/(this.intervalsBtwExtrema1.sequence[this.intervalsBtwExtrema1.sequence.length - 1]/this.intervalsBtwExtrema1.span)
                        if(ratioLeft > ratioRight) {
                            indexMaxIntverVar = 0;
                            let maxRatioR = this.indexIntervalMaximalVariation(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2, indexMaxIntverVar, this.modifiedEvents[0].nbEvents, Direction.Reverse);
                            if(maxRatioR.value > ratioLeft) {
                                indexMaxIntverVar = maxRatioR.index;
                            }
                        } else {
                            indexMaxIntverVar = this.intervalsBtwExtrema1.sequence.length - 1;
                            let maxRatioF = this.indexIntervalMaximalVariation(this.intervalsBtwExtrema1, this.intervalsBtwExtrema2, indexMaxIntverVar, this.modifiedEvents[0].nbEvents, Direction.Forward);
                            if(maxRatioF.value > ratioRight) {
                                indexMaxIntverVar = maxRatioF.index;
                            }
                        }
                    } else {
                        indexMaxIntverVar = candidateEventIndex;
                    }
                } else if(this.modifiedEvents[0].indexInflection === this._sequenceDiffEvents1.indicesOfInflections.length) {
                    let indexInflection = this.modifiedEvents[0].indexInflection;
                    let intervalsBtwExtrema1: SequenceOfIntervals = this._sequenceDiffEvents1.computeIntervalsBtwCurvatureExtrema(indexInflection);

                } else {
                    throw new Error("Inconsistent content of events in this interval.");
                }
            }
        }
        return neighboringEvents;
    }

    indexIntervalMaximalVariation(intervalsExtrema: SequenceOfIntervals, intervalsExtremaOptim: SequenceOfIntervals, candidateEvent: number, nbEvents: number, scan: Direction): {index: number, value: number} {
        let intervalIndex = RETURN_ERR0R_CODE;
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

    checkConsistencyModifiedEvents(): void {
        this.modifiedEvents.forEach(element => {
            if(element.indexInflection > 0 && element.indexInflection < this._sequenceDiffEvents1.indicesOfInflections.length) {
                if(element.nbEvents % 2 !== 0) {
                    throw new Error("The number of differential events appaearing/disappearing in interval [" + this._sequenceDiffEvents1.indicesOfInflections[element.indexInflection - 1]
                    + ", " + this._sequenceDiffEvents1.indicesOfInflections[element.indexInflection] + "] must be even.");
                }
            }
        });
    }

    checkConsistencySumModifiedEvents(): void {
        let sum = 0;
        this.modifiedEvents.forEach(element => {
            sum += element.nbEvents;
        });
        if(sum !== 0) {
            throw new Error("The sum of events appearing/disappearing must be null but is not: " + sum);
        }
    }

}