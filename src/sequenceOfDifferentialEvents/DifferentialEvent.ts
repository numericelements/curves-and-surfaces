
/*
* Characterization of differential events as key points of the curvature derivatives along a curve
*/
export const ORDER_INFLECTION = 0;
export const ORDER_CURVATURE_EXTREMUM = 1;

export class DifferentialEvent {
    
    private _order: number; 
    protected _location: number;

    /**
     * instantiation of differential event given its type and location along a curve
     * @param order order of differential event that indicates 
     * @param uAbscissa location of the differential event along the curve as defined with its parametric location
     */
    constructor(order: number, uAbscissa: number) {
        this._order = order;
        this._location = uAbscissa;
        this.checkOrder();
    }

    set location(uAbscissa: number) {
        this._location = uAbscissa;
    }

    set order(order: number) {
        this._order = order;
    }

    get location() {
        return this._location;
    }

    get order() {
        return this._order;
    }

    clone():DifferentialEvent {
        let event = this._order;
        let location = this._location;
        return new DifferentialEvent(event, location);
    }

    checkOrder() {
        if(this._order < ORDER_INFLECTION) {
            throw new Error("Incorrect order of differential event " + this._order + ". Must be positive.");
        }
    }

}
export class InflectionEvent extends DifferentialEvent {
    
    constructor(uAbscissa: number) {
        let order = ORDER_INFLECTION;
        super(order, uAbscissa);
    }

}

export class CurvatureExtremumEvent extends DifferentialEvent {

    constructor(uAbscissa: number) {
        let order = ORDER_CURVATURE_EXTREMUM;
        super(order, uAbscissa);
    }
}
