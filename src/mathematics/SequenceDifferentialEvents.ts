import { DifferentialEventInSequence, DiffEventType } from "../mathematics/DifferentialEventInSequence";
import { ModifiedCurvatureEvents } from "../mathematics/ModifiedEvents";

/*
* Set up a sequence of differential events as part of the characterization of a curve shape space
*/
export class SequenceDifferentialEvents {

    private _sequence: Array<DifferentialEventInSequence>;

    /**
     * Instantiates a sequence of differential events using optionally:
     * @param curvatureExtrema  a strictly increasing sequence of locations of curvature extrema along a curve
     * @param inflections a strictly increasing sequence of locations of inflections along a curve
     * @throws Errors if:
     *          a sequence of inflections is provided only and contains more than one inflection (a sequence cannot contain two or more consecutive inflections)
     *          the sequence of curvature extrema supplied is not strictly increasing
     *          the sequence terminates with more two or more successive inflections
     *          the sequence instantiated has a length that is not equal to the sum of the lengthes of curvatureExtrema.length + inflections.length
     *          type or location inconsistecies are detected in the sequence instantiated or modified
     */
    constructor(curvatureExtrema?: number[], inflections?: number[]) {
        this._sequence = [];
        if(curvatureExtrema !== undefined && inflections === undefined) {
            for(let i=0; i < curvatureExtrema.length; i += 1) {
                let event = new DifferentialEventInSequence(DiffEventType.curvatExtremum, curvatureExtrema[i]);
                this._sequence.push(event);
            }
        } else if(curvatureExtrema === undefined && inflections !== undefined) {
            if(inflections.length > 1) {
                throw new Error("Unable to generate a sequence of differential events: too many consecutive inflections.");
            } else {
                let event = new DifferentialEventInSequence(DiffEventType.inflection, inflections[0]);
                this._sequence.push(event);
            }
        } else if(curvatureExtrema !== undefined && inflections !== undefined) {
            let j = 0;
            let currentLocExtrema = 0.0;
            let indexExtrema = 0;
            for(let i=0; i < curvatureExtrema.length; i += 1) {
                if(i === 0) {
                    currentLocExtrema = curvatureExtrema[i];
                } else if(i > 0 && curvatureExtrema[i] > currentLocExtrema) {
                    currentLocExtrema = curvatureExtrema[i - 1];
                } else {
                    indexExtrema = i;
                }
                let event = new DifferentialEventInSequence(DiffEventType.unDefined, 0.0);
                if(curvatureExtrema[i] > inflections[j]) {
                    while(curvatureExtrema[i] > inflections[j]) {
                        event.event = DiffEventType.inflection;
                        event.location = inflections[j];
                        this._sequence.push(event);
                        j += 1;
                    }
                }
                event.event = DiffEventType.curvatExtremum;
                event.location = curvatureExtrema[i];
                this._sequence.push(event);
            }
            if(j < inflections.length) {
                let event = new DifferentialEventInSequence(DiffEventType.inflection, inflections[j]);
                this._sequence.push(event);
                j += 1;
            }
            if(indexExtrema > 0) {
                throw new Error("Inconsistent sequence of differential events because the location of curvature extrema is not stricly increasing at index."
                + indexExtrema);
            }
            if(j < inflections.length) {
                throw new Error("Inconsistent sequence of differential events that terminates with multiple inflections.");
            } else if(this._sequence.length !== curvatureExtrema.length + inflections.length) {
                throw new Error("Inconsistent length of sequence of differential events.");
            }
            this.checkSequenceConsistency();
        }

    }

    set event(event: DifferentialEventInSequence) {
        this._sequence.push(event);
        this.checkSequenceConsistency();
    }

    get lastEvent(): DifferentialEventInSequence {
        let event: DifferentialEventInSequence;
        if(this._sequence[this._sequence.length - 1] !== undefined) {
            event = this._sequence[this._sequence.length - 1];
            this._sequence.pop();
        } else {
            throw new Error("Cannot get event because the sequence is empty.");
        }
        return event;
    }

    get sequence(): Array<DifferentialEventInSequence> {
        return this._sequence;
    }

    length(): number {
        return this._sequence.length;
    }

    eventAt(i: number): DifferentialEventInSequence;
    eventAt(i: number): undefined;
    eventAt(i: number): any {
        if(i >= 0 && i < this._sequence.length) {
            return this._sequence[i].clone();
        } else {
            return undefined;
        }
    }

    insertAt(event: DifferentialEventInSequence, index: number): void {
        this._sequence.splice(index, 0, event);
        this.checkSequenceConsistency();
    }

    nbInflections(): number {
        let nbInflections = 0;
        this._sequence.forEach(element => {
            if(element.event === DiffEventType.inflection) {
                nbInflections +=1;
            }
        });
        return nbInflections;
    }

    nbCurvatureExtrema(): number {
        let nbCurvatureExtrema = 0;
        this._sequence.forEach(element => {
            if(element.event === DiffEventType.curvatExtremum) {
                nbCurvatureExtrema +=1;
            }
        });
        return nbCurvatureExtrema;
    }

    indicesInflection(): number[] {
        let inflectionIndices: number[] = [];
        this._sequence.forEach((element, index) => {
            if(element.event === DiffEventType.inflection) {
                inflectionIndices.push(index);
            }
        });
        return inflectionIndices;
    }

    locateModifiedCurvatureEvents(sequenceDiffEvents: SequenceDifferentialEvents): Array<ModifiedCurvatureEvents> {
        let indicesInflectionInit: number[] = this.indicesInflection();
        let indicesInflectionOptim: number[] = sequenceDiffEvents.indicesInflection();
        let modifiedEvents: Array<ModifiedCurvatureEvents> = [];
        if(this._sequence.length !== sequenceDiffEvents.length()) {
            if(indicesInflectionInit.length === indicesInflectionOptim.length) {
                let shift = 0;
                for(let j = 0; j < indicesInflectionInit.length; j += 1) {
                    let delta = indicesInflectionInit[j] - indicesInflectionOptim[j];
                    if(delta !== shift) {
                        let modEventInInterval = new ModifiedCurvatureEvents(indicesInflectionInit[j], (delta-shift));
                        modifiedEvents.push(modEventInInterval);
                        shift = shift + delta;
                    }
                }
                if(indicesInflectionInit.length > 0 && modifiedEvents.length === 0) {
                    // There are inflections and no changes in the first indicesInflectionInit.length intervals -> changes take place in the last interval
                    let modEventInInterval = new ModifiedCurvatureEvents(indicesInflectionInit[indicesInflectionInit.length - 1], (this._sequence.length - sequenceDiffEvents.length()));
                    modifiedEvents.push(modEventInInterval);
                }
                if(indicesInflectionInit.length === 0) {
                    // There is no inflexion in the sequence of events -> all events take place in the 'first' interval
                    let modEventInInterval = new ModifiedCurvatureEvents(0, (this._sequence.length - sequenceDiffEvents.length()));
                    modifiedEvents.push(modEventInInterval);
                }
            }
        }

        return modifiedEvents;
    }

    checkTypeConsistency(): void {
        let currentType = this._sequence[0].event;
        let index = 0;
        let indexUndefined = -1;
        if(this._sequence[0].event === DiffEventType.unDefined) {
            indexUndefined = 0;
        } else {
            // Look for type consistency. If two successive differential events are inflections, the sequence is incorrect
            // All other configurations are valid
            for(let i = 1; i < this._sequence.length; i += 1) {
                if(currentType === DiffEventType.inflection && this._sequence[i].event === DiffEventType.inflection) {
                    index = i;
                    break;
                } else {
                    currentType = this._sequence[i].event;
                }
            }
        }
        if(index > 0) {
            throw new Error("Inconsistent sequence of differential events: two successive inflections at indices " + (index - 1) + " and " + index);
        }
        if(indexUndefined >= 0) {
            throw new Error("Inconsistent sequence of differential events: there is an event with undefined status at index" + indexUndefined);
        }
    }

    checkLocationConsistency(): void {
        let index = 0;
        // Look for location consistency. The sequence of abscissae must be strictly increasing
        for(let i = 1; i < this._sequence.length; i += 1) {
            if(this._sequence[i].location > this._sequence[i - 1].location) {
                continue;
            } else {
                index = i;
                break;
            }
        }
        if(index > 0) {
            throw new Error("Inconsistent sequence of differential events: two successive events have non strictly increasing abscissa at indices " + 
            (index - 1) + " and " + index + " with values " + this._sequence[index - 1].location + " and " + this._sequence[index].location);
        }
    }

    checkSequenceConsistency(): void {
        this.checkTypeConsistency();
        this.checkLocationConsistency();
    }
}