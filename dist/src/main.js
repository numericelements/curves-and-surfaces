"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const AlgorithmBootstrap_1 = require("./newBsplines/AlgorithmBootstrap");
const UserInterfaceEventListener_1 = require("./userInterfaceController/UserInterfaceEventListener");
function main() {
    try {
        AlgorithmBootstrap_1.AlgorithmBootstrap.initialize();
        const curveModelDefinitionEventListener = new UserInterfaceEventListener_1.CurveModelDefinitionEventListener();
        const shapeSpaceNavigationEventListener = new UserInterfaceEventListener_1.ShapeSpaceNavigationEventListener(curveModelDefinitionEventListener);
        const curveSceneEventListener = new UserInterfaceEventListener_1.CurveSceneEventListener(curveModelDefinitionEventListener, shapeSpaceNavigationEventListener);
        const chartEventListener = new UserInterfaceEventListener_1.ChartEventListener(curveModelDefinitionEventListener.shapeNavigableCurve);
        const fileEventListener = new UserInterfaceEventListener_1.FileEventListener(curveModelDefinitionEventListener, curveSceneEventListener.curveSceneController);
        curveSceneEventListener.curveSceneController.renderFrame();
    }
    catch (error) {
        console.error(error);
    }
}
exports.main = main;
main();
