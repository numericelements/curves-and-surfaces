import { expect } from 'chai';
import { HandleConstraintAtPoint1Point2NoConstraintState } from '../../src/controllers/CurveConstraintSelectionState';
import { CurveSceneController } from '../../src/controllers/CurveSceneController';
import {WebGLUtils} from "../../src/webgl/webgl-utils";

describe('CurveControlState', () => {
    describe('handleInflections', () => {
        it('process a click to activate/deactivate the control of inflections', () => {
            // let document: Document = new Document();
            // const canvas = <HTMLCanvasElement> document.getElementById("webgl");
//             const gl = WebGLUtils().setupWebGL(canvas);
//             const curveSceneController = new CurveSceneController(canvas, gl);
//             const curveConstraintSelectionState = new HandleConstraintAtPoint1Point2NoConstraintState(curveSceneController);
//             expect( () => curveConstraintSelectionState.handleCurveConstraintAtPoint1());
        });
    });
});