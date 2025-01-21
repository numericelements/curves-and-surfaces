"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var UserInterfaceEventListener_1 = require("./userInterfaceController/UserInterfaceEventListener");
function main() {
    try {
        var curveModelDefinitionEventListener = new UserInterfaceEventListener_1.CurveModelDefinitionEventListener();
        var shapeSpaceNavigationEventListener = new UserInterfaceEventListener_1.ShapeSpaceNavigationEventListener(curveModelDefinitionEventListener);
        var curveSceneEventListener = new UserInterfaceEventListener_1.CurveSceneEventListener(curveModelDefinitionEventListener, shapeSpaceNavigationEventListener);
        var chartEventListener = new UserInterfaceEventListener_1.ChartEventListener(curveModelDefinitionEventListener.shapeNavigableCurve);
        var fileEventListener = new UserInterfaceEventListener_1.FileEventListener(curveModelDefinitionEventListener, curveSceneEventListener.curveSceneController);
        curveSceneEventListener.curveSceneController.renderFrame();
    }
    catch (error) {
        console.error(error);
    }
}
exports.main = main;
main();
