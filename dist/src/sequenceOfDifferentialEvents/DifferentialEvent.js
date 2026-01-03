"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurvatureExtremumEvent = exports.InflectionEvent = exports.DifferentialEvent = exports.ORDER_CURVATURE_EXTREMUM = exports.ORDER_INFLECTION = void 0;
/*
* Characterization of differential events as key points of the curvature derivatives along a curve
*/
exports.ORDER_INFLECTION = 0;
exports.ORDER_CURVATURE_EXTREMUM = 1;
class DifferentialEvent {
    /**
     * instantiation of differential event given its type and location along a curve
     * @param order order of differential event that indicates
     * @param uAbscissa location of the differential event along the curve as defined with its parametric location
     */
    constructor(order, uAbscissa) {
        this._order = order;
        this._location = uAbscissa;
        this.checkOrder();
    }
    set location(uAbscissa) {
        this._location = uAbscissa;
    }
    set order(order) {
        this._order = order;
    }
    get location() {
        return this._location;
    }
    get order() {
        return this._order;
    }
    clone() {
        let event = this._order;
        let location = this._location;
        return new DifferentialEvent(event, location);
    }
    checkOrder() {
        if (this._order < exports.ORDER_INFLECTION) {
            throw new Error("Incorrect order of differential event " + this._order + ". Must be positive.");
        }
    }
}
exports.DifferentialEvent = DifferentialEvent;
class InflectionEvent extends DifferentialEvent {
    constructor(uAbscissa) {
        let order = exports.ORDER_INFLECTION;
        super(order, uAbscissa);
    }
}
exports.InflectionEvent = InflectionEvent;
class CurvatureExtremumEvent extends DifferentialEvent {
    constructor(uAbscissa) {
        let order = exports.ORDER_CURVATURE_EXTREMUM;
        super(order, uAbscissa);
    }
}
exports.CurvatureExtremumEvent = CurvatureExtremumEvent;
