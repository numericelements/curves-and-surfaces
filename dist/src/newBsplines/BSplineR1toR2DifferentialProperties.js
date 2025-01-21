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
exports.BSplineR1toR2DifferentialProperties = void 0;
var AbstractBSplineR1toR2DifferentialProperties_1 = require("./AbstractBSplineR1toR2DifferentialProperties");
var BSplineR1toR1_1 = require("./BSplineR1toR1");
var BSplineR1toR2DifferentialProperties = /** @class */ (function (_super) {
    __extends(BSplineR1toR2DifferentialProperties, _super);
    function BSplineR1toR2DifferentialProperties(spline) {
        return _super.call(this, spline) || this;
    }
    BSplineR1toR2DifferentialProperties.prototype.bSplineR1toR1Factory = function (controlPoints, knots) {
        return new BSplineR1toR1_1.BSplineR1toR1(controlPoints, knots);
    };
    return BSplineR1toR2DifferentialProperties;
}(AbstractBSplineR1toR2DifferentialProperties_1.AbstractBSplineR1toR2DifferentialProperties));
exports.BSplineR1toR2DifferentialProperties = BSplineR1toR2DifferentialProperties;
