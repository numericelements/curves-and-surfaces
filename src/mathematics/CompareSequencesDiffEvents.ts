import { SequenceDifferentialEvents } from "../mathematics/SequenceDifferentialEvents";
import { ModifiedCurvatureEvents } from "../mathematics/ModifiedEvents";
import { NeighboringEvents, NeighboringEventsType } from "./NeighboringEvents";


export class CompareSequencesDiffEvents {

    private _sequenceDiffEvents1: SequenceDifferentialEvents;
    private _sequenceDiffEvents2: SequenceDifferentialEvents;
    private indicesInflection1: number[];
    private indicesInflection2: number[];
    public modifiedEvents: Array<ModifiedCurvatureEvents> = [];

    constructor(sequenceDiffEvents1: SequenceDifferentialEvents, sequenceDiffEvents2: SequenceDifferentialEvents) {
        this._sequenceDiffEvents1 = sequenceDiffEvents1;
        this._sequenceDiffEvents2 = sequenceDiffEvents2;
        this.indicesInflection1 = this._sequenceDiffEvents1.indicesInflection();
        this.indicesInflection2 = this._sequenceDiffEvents2.indicesInflection();
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
        if(this.indicesInflection1.length === this.indicesInflection2.length) {
            let shift = 0;
            for(let j = 0; j < this.indicesInflection1.length; j += 1) {
                let delta = this.indicesInflection1[j] - this.indicesInflection2[j];
                if(delta !== shift) {
                    let modEventInInterval = new ModifiedCurvatureEvents(j, (delta-shift));
                    this.modifiedEvents.push(modEventInInterval);
                    shift = shift + delta;
                }
            }
            if(this.indicesInflection1.length > 0 && this.modifiedEvents.length === 0) {
                // There are inflections and no changes in the first indicesInflectionInit.length intervals -> changes take place in the last interval
                let modEventInInterval = new ModifiedCurvatureEvents(this.indicesInflection1.length, (this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()));
                this.modifiedEvents.push(modEventInInterval);
            }
            if(this.indicesInflection1.length === 0) {
                // There is no inflexion in the sequence of events -> all events take place in the 'first' interval
                let modEventInInterval = new ModifiedCurvatureEvents(0, (this._sequenceDiffEvents1.length() - this._sequenceDiffEvents2.length()));
                this.modifiedEvents.push(modEventInInterval);
            }
        }
        if(this._sequenceDiffEvents1.length() === this._sequenceDiffEvents2.length() && this.indicesInflection1.length > 0) {
            this.checkConsistencySumModifiedEvents();
        }
        this.checkConsistencyModifiedEvents();

        return this.modifiedEvents;
    }

    locateNeiboringEvents(): NeighboringEvents {
        this.modifiedEvents = this.locateIntervalAndNumberOfEventChanges();
        let neighboringEvents = new NeighboringEvents(NeighboringEventsType.none, -1);
        if(this.modifiedEvents.length === 0) {
            throw new Error("Inconsistent analysis of lost events in the sequence of differential events");
        } else if(this.modifiedEvents.length === 1) {
            if(this.modifiedEvents[0].nbEvents === 1) {
                if(this.modifiedEvents[0].indexInflection === 0) {
                    
                } else if(this.modifiedEvents[0].indexInflection === this.indicesInflection1.length) {

                } else {
                    throw new Error("Inconsistent content of events in this interval.");
                }
            }
        }
        return neighboringEvents;
    }

    checkConsistencyModifiedEvents(): void {
        this.modifiedEvents.forEach(element => {
            if(element.indexInflection > 0 && element.indexInflection < this.indicesInflection1.length) {
                if(element.nbEvents % 2 !== 0) {
                    throw new Error("The number of differential events appaearing/disappearing in interval [" + this.indicesInflection1[element.indexInflection - 1]
                    + ", " + this.indicesInflection1[element.indexInflection] + "] must be even.");
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