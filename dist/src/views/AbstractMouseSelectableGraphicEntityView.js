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
exports.AbstractMouseSelectableGraphicEntityView = exports.BTN_SLCTN_ACCURACY_Squared = exports.SLCTN_ACCURACY_Squared = void 0;
var AbstractGraphicalEntityView_1 = require("./AbstractGraphicalEntityView");
exports.SLCTN_ACCURACY_Squared = 0.005;
exports.BTN_SLCTN_ACCURACY_Squared = 0.01;
var AbstractMouseSelectableGraphicEntityView = /** @class */ (function (_super) {
    __extends(AbstractMouseSelectableGraphicEntityView, _super);
    function AbstractMouseSelectableGraphicEntityView(gl) {
        var _this = _super.call(this, gl) || this;
        _this.SLCTN_ACCURACY_Squared = exports.SLCTN_ACCURACY_Squared;
        _this.BTN_SLCTN_ACCURACY_Squared = exports.BTN_SLCTN_ACCURACY_Squared;
        _this.selectedPoints = [];
        return _this;
    }
    return AbstractMouseSelectableGraphicEntityView;
}(AbstractGraphicalEntityView_1.AbstractGraphicalEntityView));
exports.AbstractMouseSelectableGraphicEntityView = AbstractMouseSelectableGraphicEntityView;
