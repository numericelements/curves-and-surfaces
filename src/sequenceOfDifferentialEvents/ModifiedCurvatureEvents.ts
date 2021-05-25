import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { ORDER_INFLECTION,
        ORDER_CURVATURE_EXTREMUM } from "./DifferentialEvent";

export abstract class ModifiedDifferentialEvents {

    private className: string;
    protected order: number;
    protected abstract _nbEvents: number;

    constructor(order: number) {
        this.order = order;
        this.className = this.getClassName();
        this.checkOrder();
    }

    abstract set nbEvents(nbEventsModified: number);
    abstract get nbEvents(): number;

    getClassName(): string {
        this.className = this.constructor.name;
        return this.className;
    }

    checkOrder() {
        if(this.order !== ORDER_INFLECTION && this.order !== ORDER_CURVATURE_EXTREMUM) {
            let e = new ErrorLog(this.className, "Inconsistent value of differential event order.")
        }
    }
}

/**
* Characterization of modified differential events of type curvature extrema within a sequence of differential events.
* It applies to configurations where inflections are invariant (constant number) when a curve gets modified.
* The events are located within a sequence of differential events using the index of an inflection to identify the interval between two successive inflections
*/
export class ModifiedCurvatureEvents extends ModifiedDifferentialEvents {

    private _indexInflection: number;
    protected _nbEvents: number;

    /**
     * instantiates a ModifiedCurvatureEvents that is located within a sequence of differential events
    * @param indexInflection index of the inflection defining the interval between inflection where the number of curvature extrema is modified
    * @param nbEventsModified number of curvature extrema appearing (nbEventsModified > 0) or disappearing (nbEventsModified < 0) between
    * two successive inflections defined by indexInflection.
    * @throws errors if the number of modified event is null
    */
    constructor(indexInflection: number, nbEventsModified: number) {
        super(ORDER_CURVATURE_EXTREMUM);
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

/**
* Characterization of modified differential events of type inflections within a sequence of differential events.
* It applies to configurations where curvature extrema are invariant (constant number) when a curve gets modified.
* The events are located within a sequence of differential events using the index of a curvature extremum to identify 
* either the interval between two successive inflections or an extreme interval (in case of open curves)
*/
export class ModifiedInflectionEvents extends ModifiedDifferentialEvents {

    private _indexCurvatureEx: number;
    protected _nbEvents: number;

    /**
     * instantiates a ModifiedInflectionEvents that is located within a sequence of differential events
    * @param indexCurvatureEx index of the curvature ext defining the intervals where the number of inflections is modified
    * @param nbEventsModified number of inflections appearing (nbEventsModified > 0) or disappearing (nbEventsModified < 0) that
    * are adjacent to the event defined by indexCurvatureEx.
    * @throws errors if the number of modified event is null
    */
    constructor(indexCurvatureEx: number, nbEventsModified: number) {
        super(ORDER_INFLECTION);
        this._indexCurvatureEx = indexCurvatureEx;
        this._nbEvents = nbEventsModified;
        if(this._nbEvents === 0) {
            throw new Error("Warning: ModifiedEvents; the number of modified differential events is set to 0, which is incorrect.");
        }
    }

    set indexCurvatureEx(indexCurvatureEx: number) {
        this._indexCurvatureEx = indexCurvatureEx;
    }

    set nbEvents(nbEventsModified: number) {
        this._nbEvents = nbEventsModified;
    }

    get indexCurvatureEx() {
        return this._indexCurvatureEx;
    }

    get nbEvents() {
        return this._nbEvents;
    }

}