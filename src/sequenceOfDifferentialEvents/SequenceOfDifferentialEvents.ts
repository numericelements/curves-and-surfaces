import { DifferentialEvent, InflectionEvent, CurvatureExtremumEvent } from "./DifferentialEvent";
import { SequenceOfIntervals } from "./SequenceOfIntervals";
import { ModifiedCurvatureEvents } from "./ModifiedDifferentialEvents";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";

/* named constants */
import { ORDER_INFLECTION, ORDER_CURVATURE_EXTREMUM } from "./DifferentialEvent";
import { CURVE_INTERVAL_SPAN,
        LOWER_BOUND_CURVE_INTERVAL, 
        UPPER_BOUND_CURVE_INTERVAL,
        TWO_CURVEXT_EVENTS_APPEAR,
        TWO_CURVEXT_EVENTS_DISAPPEAR} from "./ComparatorOfSequencesDiffEvents";

/*
* Set up a sequence of differential events as part of the characterization of a curve shape space
*/
export const MIN_NB_INTERVALS_BTW_INFL_2CEXT_REMOVED = 4;
export const MIN_NB_INTERVALS_BTW_INFL_2CEXT_ADDED = 2;
export const MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED = 3;

export class SequenceOfDifferentialEvents {

    private _sequence: Array<DifferentialEvent>;
    private _indicesOfInflections: number[];

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
            for(let curvatExtremum of curvatureExtrema) {
                const event = new CurvatureExtremumEvent(curvatExtremum);
                this._sequence.push(event);
            }
        } else if(curvatureExtrema === undefined && inflections !== undefined) {
            if(inflections.length > 1) {
                throw new Error("Unable to generate a sequence of differential events: too many consecutive inflections.");
            } else {
                const event = new InflectionEvent(inflections[0]);
                this._sequence.push(event);
            }
        } else if(curvatureExtrema !== undefined && inflections !== undefined) {
            this.insertEvents(curvatureExtrema, inflections);
        }
        this._indicesOfInflections = this.generateIndicesInflection();
    }

    set event(event: DifferentialEvent) {
        this._sequence.push(event);
        this.checkSequenceConsistency();
    }

    get lastEvent(): DifferentialEvent | undefined {
        let event: DifferentialEvent;
        if(this._sequence[this._sequence.length - 1] !== undefined) {
            event = this._sequence[this._sequence.length - 1];
            this._sequence.pop();
            return event;
        } else {
            let error = new ErrorLog(this.constructor.name, "lastEvent", "Cannot get event because the sequence is empty.");
            error.logMessageToConsole();
        }

    }

    get sequence(): Array<DifferentialEvent> {
        return this._sequence;
    }

    get indicesOfInflections(): number[] {
        return this._indicesOfInflections;
    }

    length(): number {
        return this._sequence.length;
    }

    eventAt(i: number): DifferentialEvent;
    eventAt(i: number): undefined;
    eventAt(i: number): any {
        if(i >= 0 && i < this._sequence.length) {
            return this._sequence[i].clone();
        } else {
            return undefined;
        }
    }

    insertAt(event: DifferentialEvent, index: number): void {
        this._sequence.splice(index, 0, event);
        this.checkSequenceConsistency();
    }

    nbInflections(): number {
        let nbInflections = 0;
        this._sequence.forEach(element => {
            if(element.order === ORDER_INFLECTION) {
                nbInflections +=1;
            }
        });
        return nbInflections;
    }

    nbCurvatureExtrema(): number {
        let nbCurvatureExtrema = 0;
        this._sequence.forEach(element => {
            if(element.order === ORDER_CURVATURE_EXTREMUM) {
                nbCurvatureExtrema +=1;
            }
        });
        return nbCurvatureExtrema;
    }

    generateIndicesInflection(): number[] {
        let inflectionIndices: number[] = [];
        this._sequence.forEach((element, index) => {
            if(element.order === ORDER_INFLECTION) {
                inflectionIndices.push(index);
            }
        });
        return inflectionIndices;
    }

    generateIndicesOscillations(): number[] {
        let oscillationIndices: number[] = [];
        for(let index of this._indicesOfInflections) {
            if(this._sequence.length > index + 2 &&
                this._sequence[index + 1].order === ORDER_CURVATURE_EXTREMUM && this._sequence[index + 2].order === ORDER_INFLECTION) {
                    oscillationIndices.push(index + 1);
                }
        }
        return oscillationIndices;
    }

    insertEvents(curvatureExtrema: number[], inflections: number[]):void {
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
            if(curvatureExtrema[i] > inflections[j]) {
                while(curvatureExtrema[i] > inflections[j]) {
                    const inflectionEvent = new InflectionEvent(inflections[j]);
                    this._sequence.push(inflectionEvent);
                    j += 1;
                }
            }
            const curvatureEvent = new CurvatureExtremumEvent(curvatureExtrema[i]);
            this._sequence.push(curvatureEvent);
        }
        if(j < inflections.length) {
            const inflectionEvent = new InflectionEvent(inflections[j]);
            this._sequence.push(inflectionEvent);
            j += 1;
        }
        if(indexExtrema > 0) {
            throw new Error("Inconsistent sequence of differential events because the location of curvature extrema is not stricly increasing at index."
            + indexExtrema);
        }
        if(j < inflections.length) {
            throw new Error("Inconsistent sequence of differential events that terminates with multiple inflections.");
        } else if(this._sequence.length !== curvatureExtrema.length + inflections.length) {
            // throw new Error("Inconsistent length of sequence of differential events.");
            // JCL temporary modification
            const warning = new WarningLog(this.constructor.name, "insertEvents", "Inconsistent length of sequence of differential events.");
            warning.logMessageToConsole();
        }
        this.checkSequenceConsistency();
        this._indicesOfInflections = this.generateIndicesInflection();
    }

    computeIntervalsBtwCurvatureExtrema(indexInflection: number): SequenceOfIntervals {
        let intervalExtrema = new SequenceOfIntervals();
        if(this._indicesOfInflections.length === 0 && this._sequence.length === 0) {
            intervalExtrema.span = CURVE_INTERVAL_SPAN;
            intervalExtrema.sequence.push(intervalExtrema.span);
        } else if(this._indicesOfInflections.length === 0 && this._sequence.length > 0) {
            intervalExtrema.span = CURVE_INTERVAL_SPAN;
            intervalExtrema.sequence.push(this._sequence[0].location - LOWER_BOUND_CURVE_INTERVAL);
            for(let k = 0; k < this._sequence.length - 1; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k + 1].location - this._sequence[k].location);
            }
            intervalExtrema.sequence.push(UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._sequence.length - 1].location);

        } else if(indexInflection === this._indicesOfInflections.length) {
            intervalExtrema.span = UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._indicesOfInflections[indexInflection - 1]].location;
            for(let k = this._indicesOfInflections[this._indicesOfInflections.length - 1]; k < this._sequence.length - 1; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k + 1].location - this._sequence[k].location);
            }
            intervalExtrema.sequence.push(UPPER_BOUND_CURVE_INTERVAL - this._sequence[this._sequence.length - 1].location);

        } else if(indexInflection === 0 && this._indicesOfInflections[0] > 0) {
            intervalExtrema.span = this._sequence[this._indicesOfInflections[indexInflection]].location - LOWER_BOUND_CURVE_INTERVAL;
            intervalExtrema.sequence.push(this._sequence[0].location - LOWER_BOUND_CURVE_INTERVAL);
            for(let k = 1; k < this._indicesOfInflections[indexInflection]; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k].location - this._sequence[k - 1].location);
            }
            intervalExtrema.sequence.push(intervalExtrema.span - this._sequence[this._indicesOfInflections[indexInflection] - 1].location);

        } else if(indexInflection === 0 && this._indicesOfInflections[0] === 0) {
            intervalExtrema.span = this._sequence[this._indicesOfInflections[indexInflection]].location - LOWER_BOUND_CURVE_INTERVAL;
            intervalExtrema.sequence.push(intervalExtrema.span);

        } else if(this._indicesOfInflections.length > 1 && indexInflection < this._indicesOfInflections.length) {
            intervalExtrema.span = this._sequence[this._indicesOfInflections[indexInflection]].location - this._sequence[this._indicesOfInflections[indexInflection - 1]].location;
            for(let k = this._indicesOfInflections[indexInflection - 1] + 1; k < this._indicesOfInflections[indexInflection]; k += 1) {
                intervalExtrema.sequence.push(this._sequence[k].location - this._sequence[k - 1].location);
            }
            intervalExtrema.sequence.push(this._sequence[this._indicesOfInflections[indexInflection]].location - this._sequence[this._indicesOfInflections[indexInflection] - 1].location);

        }

        return intervalExtrema;
    }

    checkTypeConsistency(): void {
        if(this._sequence.length === 0) return
        let currentOrder = this._sequence[0].order;
        let index = 0;

        // Look for type consistency. If two successive differential events are inflections, the sequence is incorrect
        // All other configurations are valid
        for(let i = 1; i < this._sequence.length; i += 1) {
            if(currentOrder === ORDER_INFLECTION && this._sequence[i].order === ORDER_INFLECTION) {
                index = i;
                break;
            } else {
                currentOrder = this._sequence[i].order;
            }
        }
        if(index > 0) {
            let message = "Inconsistent sequence of differential events: two successive inflections at indices " + (index - 1) + " and " + index;
            let error = new ErrorLog(this.constructor.name, "checkTypeConsistency", message);
            error.logMessageToConsole();
        }
    }

    checkLocationConsistency(): void {
        if(this._sequence.length === 0) return
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
            let message = "Inconsistent sequence of differential events: two successive events have non strictly increasing abscissa at indices " + 
                (index - 1) + " and " + index + " with values " + this._sequence[index - 1].location + " and " + this._sequence[index].location;
            let error = new ErrorLog(this.constructor.name, "checkLocationConsistency", message);
            error.logMessageToConsole();
        }
    }

    checkSequenceConsistency(): void {
        this.checkTypeConsistency();
        this.checkLocationConsistency();
    }


    checkConsistencyIntervalBtwInflections(modifiedEvent: ModifiedCurvatureEvents): void {
        const inflectionIndex = modifiedEvent.indexInflection;
        const nbModifiedEvents = modifiedEvent.nbEvents;
        if(this._indicesOfInflections.length > 2) {
            if(inflectionIndex > 0) {
                if(nbModifiedEvents === TWO_CURVEXT_EVENTS_APPEAR && this._indicesOfInflections[inflectionIndex] - this._indicesOfInflections[inflectionIndex - 1] < MIN_NB_INTERVALS_BTW_INFL_2CEXT_REMOVED) {
                    /* JCL A minimum of four intervals is required to obtain a meaningful loss of curvature extrema */
                    let error = new ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the current interval of inflections. Number too small for curvature extrema removal.");
                    error.logMessageToConsole();
                } else if(nbModifiedEvents === TWO_CURVEXT_EVENTS_DISAPPEAR && this._indicesOfInflections[inflectionIndex] - this._indicesOfInflections[inflectionIndex - 1] < MIN_NB_INTERVALS_BTW_INFL_2CEXT_ADDED) {
                    let error = new ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the current interval of inflections. Number too small for curvature extrema insertion.");
                    error.logMessageToConsole();
                }
            }
        }
        else if((inflectionIndex === 0 || inflectionIndex === this._indicesOfInflections.length) && this._indicesOfInflections.length > 0) {
            if(nbModifiedEvents === TWO_CURVEXT_EVENTS_APPEAR && inflectionIndex === 0 && this._indicesOfInflections[inflectionIndex] < MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED) {
                let error = new ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the first interval of inflections. Number too small.");
                error.logMessageToConsole();
            } else if(nbModifiedEvents === TWO_CURVEXT_EVENTS_APPEAR && inflectionIndex === this._indicesOfInflections.length && this._indicesOfInflections.length - this._indicesOfInflections[inflectionIndex - 1] < MIN_NB_INTERVALS_BEFORE_AFTER_INFL_2CEXT_REMOVED) {
                let error = new ErrorLog(this.constructor.name, "checkConsistencyIntervalBtwInflections", "Inconsistent number of curvature extrema in the last interval of inflections. Number too small.");
                error.logMessageToConsole();
            }
        }
    }
}