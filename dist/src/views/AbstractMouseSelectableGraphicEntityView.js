"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMouseSelectableGraphicEntityView = exports.BTN_SLCTN_ACCURACY_Squared = exports.SLCTN_ACCURACY_Squared = void 0;
const AbstractGraphicalEntityView_1 = require("./AbstractGraphicalEntityView");
exports.SLCTN_ACCURACY_Squared = 0.005;
exports.BTN_SLCTN_ACCURACY_Squared = 0.01;
class AbstractMouseSelectableGraphicEntityView extends AbstractGraphicalEntityView_1.AbstractGraphicalEntityView {
    constructor(gl) {
        super(gl);
        this.SLCTN_ACCURACY_Squared = exports.SLCTN_ACCURACY_Squared;
        this.BTN_SLCTN_ACCURACY_Squared = exports.BTN_SLCTN_ACCURACY_Squared;
        this.selectedPoints = [];
    }
}
exports.AbstractMouseSelectableGraphicEntityView = AbstractMouseSelectableGraphicEntityView;
