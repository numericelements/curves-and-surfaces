"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurvatureExtremumEvent = exports.InflectionEvent = exports.DifferentialEvent = exports.ORDER_CURVATURE_EXTREMUM = exports.ORDER_INFLECTION = void 0;
/*
* Characterization of differential events as key points of the curvature derivatives along a curve
*/
exports.ORDER_INFLECTION = 0;
exports.ORDER_CURVATURE_EXTREMUM = 1;
var DifferentialEvent = /** @class */ (function () {
    /**
     * instantiation of differential event given its type and location along a curve
     * @param order order of differential event that indicates
     * @param uAbscissa location of the differential event along the curve as defined with its parametric location
     */
    function DifferentialEvent(order, uAbscissa) {
        this._order = order;
        this._location = uAbscissa;
        this.checkOrder();
    }
    Object.defineProperty(DifferentialEvent.prototype, "location", {
        get: function () {
            return this._location;
        },
        set: function (uAbscissa) {
            this._location = uAbscissa;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DifferentialEvent.prototype, "order", {
        get: function () {
            return this._order;
        },
        set: function (order) {
            this._order = order;
        },
        enumerable: false,
        configurable: true
    });
    DifferentialEvent.prototype.clone = function () {
        var event = this._order;
        var location = this._location;
        return new DifferentialEvent(event, location);
    };
    DifferentialEvent.prototype.checkOrder = function () {
        if (this._order < exports.ORDER_INFLECTION) {
            throw new Error("Incorrect order of differential event " + this._order + ". Must be positive.");
        }
    };
    return DifferentialEvent;
}());
exports.DifferentialEvent = DifferentialEvent;
var InflectionEvent = /** @class */ (function (_super) {
    __extends(InflectionEvent, _super);
    function InflectionEvent(uAbscissa) {
        var _this = this;
        var order = exports.ORDER_INFLECTION;
        _this = _super.call(this, order, uAbscissa) || this;
        return _this;
    }
    return InflectionEvent;
}(DifferentialEvent));
exports.InflectionEvent = InflectionEvent;
var CurvatureExtremumEvent = /** @class */ (function (_super) {
    __extends(CurvatureExtremumEvent, _super);
    function CurvatureExtremumEvent(uAbscissa) {
        var _this = this;
        var order = exports.ORDER_CURVATURE_EXTREMUM;
        _this = _super.call(this, order, uAbscissa) || this;
        return _this;
    }
    return CurvatureExtremumEvent;
}(DifferentialEvent));
exports.CurvatureExtremumEvent = CurvatureExtremumEvent;
