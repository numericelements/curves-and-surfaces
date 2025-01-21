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
exports.KnotIndexStrictlyIncreasingSequence = void 0;
var AbstractKnotIndex_1 = require("./AbstractKnotIndex");
var KnotIndexConstructorInterface_1 = require("./KnotIndexConstructorInterface");
/**
 * Represents a knot index in a strictly increasing sequence
 *
 * @description
 * Implements a knot index where each value must be strictly greater than the previous one
 * in the sequence. This is used in B-spline knot sequences where no repeated knot values
 * are allowed, ensuring strict monotonicity.
 *
 * @extends AbstractKnotIndex
 */
var KnotIndexStrictlyIncreasingSequence = /** @class */ (function (_super) {
    __extends(KnotIndexStrictlyIncreasingSequence, _super);
    /**
     * Creates a new strictly increasing knot index
     * @param value - The initial index value
     * @throws {RangeError} If value is negative
     */
    function KnotIndexStrictlyIncreasingSequence(value) {
        var _this = _super.call(this, value) || this;
        _this._knotIndex = { type: KnotIndexConstructorInterface_1.KNOT_INDEX_STRICTLY_INCREASING_SEQUENCE, index: value };
        return _this;
    }
    return KnotIndexStrictlyIncreasingSequence;
}(AbstractKnotIndex_1.AbstractKnotIndex));
exports.KnotIndexStrictlyIncreasingSequence = KnotIndexStrictlyIncreasingSequence;
