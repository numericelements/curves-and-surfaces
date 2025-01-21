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
exports.KnotIndexIncreasingSequence = void 0;
var AbstractKnotIndex_1 = require("./AbstractKnotIndex");
var KnotIndexConstructorInterface_1 = require("./KnotIndexConstructorInterface");
/**
 * Represents a knot index in an increasing sequence
 *
 * @description
 * Implements a knot index where each value must be greater than or equal to the previous one
 * in the sequence. This allows for repeated knot values, which is useful for representing
 * B-spline knot sequences with multiple knots at the same position.
 *
 * @extends AbstractKnotIndex
 */
var KnotIndexIncreasingSequence = /** @class */ (function (_super) {
    __extends(KnotIndexIncreasingSequence, _super);
    /**
     * Creates a new increasing knot index
     * @param value - The initial index value
     * @throws {RangeError} If value is negative
     */
    function KnotIndexIncreasingSequence(value) {
        var _this = _super.call(this, value) || this;
        _this._knotIndex = { type: KnotIndexConstructorInterface_1.KNOT_INDEX_INCREASING_SEQUENCE, index: value };
        return _this;
    }
    return KnotIndexIncreasingSequence;
}(AbstractKnotIndex_1.AbstractKnotIndex));
exports.KnotIndexIncreasingSequence = KnotIndexIncreasingSequence;
