"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.from3DProjectiveRealTo2DReal = void 0;
const Vector2DTypeReal_1 = require("../Vector2DTypeReal");
function from3DProjectiveRealTo2DReal(projectiveVector, realVSpace) {
    const realCoord = projectiveVector.applyHomogeneousTransformation();
    if (realVSpace !== undefined) {
        return new Vector2DTypeReal_1.Vector2DTypeReal(realCoord[0], realCoord[1], realVSpace);
    }
    return new Vector2DTypeReal_1.Vector2DTypeReal(realCoord[0], realCoord[1]);
}
exports.from3DProjectiveRealTo2DReal = from3DProjectiveRealTo2DReal;
