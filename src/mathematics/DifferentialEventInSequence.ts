export enum DiffEventType {inflection, curvatExtremum, unDefined}

/*
* Characterization of differential events as key points along a curve
*/
export class DifferentialEventInSequence {
    
    private _event: DiffEventType; 
    private _location: number;

    /**
     * instantiation of differential event given its type and location along a curve
     * @param event type of differential event set among: inflection, curvatExtremum, unDefined 
     * @param uAbscissa location of the differential event along the curve as defined with its parametric location
     */
    constructor(event: DiffEventType, uAbscissa: number) {
        this._event = event;
        this._location = uAbscissa;
    }

    set location(uAbscissa: number) {
        this._location = uAbscissa;
    }

    set event(eventType: DiffEventType) {
        this._event = eventType;
    }

    get location() {
        return this._location;
    }

    get event() {
        return this._event;
    }

    clone():DifferentialEventInSequence {
        let event = this._event;
        let location = this._location;
        return new DifferentialEventInSequence(event, location);
    }
}