import { CurveShapeModelerUserInterface } from "../userInterfaceConntroller/CurveShapeModelerUserInterface";

export function navigationEventListener(curveShapeModelerUserInterface: CurveShapeModelerUserInterface) {

    function inputSelectNavigationMode() {
        console.log("select" + curveShapeModelerUserInterface.inputNavigationMode.value);
        let navigationMode: number;
        navigationMode = Number(curveShapeModelerUserInterface.inputNavigationMode.value);
        curveShapeModelerUserInterface.currentNavigationMode = curveShapeModelerUserInterface.inputNavigationMode.value;
        // sceneController.inputSelectNavigationProcess(navigationMode);
    }

    function clickNavigationMode() {
        console.log("select Navigation click");
        curveShapeModelerUserInterface.inputNavigationMode.value = curveShapeModelerUserInterface.currentNavigationMode;
    }

    curveShapeModelerUserInterface.inputNavigationMode.addEventListener('input', inputSelectNavigationMode);
    curveShapeModelerUserInterface.inputNavigationMode.addEventListener('click', clickNavigationMode);

}