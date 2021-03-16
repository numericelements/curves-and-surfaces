import { SequenceDifferentialEvents } from "../mathematics/SequenceDifferentialEvents";

/*
* Characterization of modified differential events of type curvature extrema within a sequence of differential events.
* This object applies to configurations where inflections are invariant (constant number) when a curve gets modified.
* The events are located within a sequence of differential events using the index of an inflection to identify the interval between two successive inflections
*/
export class ModifiedCurvatureEvents {

    private _indexInflection: number;
    private _nbEvents: number;

    /**
     * instantiates a ModifiedCurvatureEvents that is located within a sequence of differential events
    * @param indexInflection index of the inflection defining the interval between inflection where the number of curvature extrema is modified
    * @param nbEventsModified number of curvature extrema appearing (nbEventsModified > 0) or disappearing (nbEventsModified < 0) between
    * two successive inflections defined by indexInflection.
    * @throws errors if the number of modified event is null
    */
    constructor(indexInflection: number, nbEventsModified: number) {
        this._indexInflection = indexInflection;
        this._nbEvents = nbEventsModified;
        if(this._nbEvents === 0) {
            throw new Error("Warning: ModifiedEvents; the number of modified differential events is set to 0, which is incorrect.");
        }
    }

    set indexInflection(indexInflection: number) {
        this._indexInflection = indexInflection;
    }

    set nbEvents(nbEventsModified: number) {
        this._nbEvents = nbEventsModified;
    }

    get indexInflection() {
        return this._indexInflection;
    }

    get nbEvents() {
        return this._nbEvents;
    }
}