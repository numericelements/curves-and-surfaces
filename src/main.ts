import { ChartEventListener, CurveModelDefinitionEventListener, CurveSceneEventListener, FileEventListener, ShapeSpaceNavigationEventListener } from "./userInterfaceController/UserInterfaceEventListener";

export function main() {

    const curveModelDefinitionEventListener = new CurveModelDefinitionEventListener();
    const curveSceneEventListener = new CurveSceneEventListener(curveModelDefinitionEventListener);
    const shapeSpaceNavigationEventListener = new ShapeSpaceNavigationEventListener(curveModelDefinitionEventListener.shapeNavigableCurve, curveSceneEventListener.curveSceneController);
    const chartEventListener = new ChartEventListener(curveModelDefinitionEventListener.shapeNavigableCurve);
    const fileEventListener = new FileEventListener(curveModelDefinitionEventListener, curveSceneEventListener.curveSceneController);
    curveSceneEventListener.curveSceneController.renderFrame();
   
}

main()