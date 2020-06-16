import { IObserver } from "../designPatterns/Observer";
import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import { BSpline_R1_to_R2, create_BSpline_R1_to_R2 } from "../mathematics/BSpline_R1_to_R2";
import { ControlPointsShaders } from "../views/ControlPointsShaders";
import { ControlPointsView } from "../views/ControlPointsView";
import { ControlPolygonShaders } from "../views/ControlPolygonShaders";
import { ControlPolygonView } from "../views/ControlPolygonView";
import { CurveShaders } from "../views/CurveShaders";
import { CurveView } from "../views/CurveView";
import { BSpline_R1_to_R1 } from "../mathematics/BSpline_R1_to_R1";
import { IRenderFrameObserver } from "../designPatterns/RenderFrameObserver";
import { BSpline_R1_to_R2_DifferentialProperties } from "../mathematics/BSpline_R1_to_R2_DifferentialProperties";



export class FunctionBSceneController implements IRenderFrameObserver<BSpline_R1_to_R2_interface> {


    private spline: BSpline_R1_to_R2
    private controlPointsShaders: ControlPointsShaders
    private controlPointsView: ControlPointsView
    private controlPolygonShaders: ControlPolygonShaders
    private controlPolygonView: ControlPolygonView
    private curveShaders: CurveShaders
    private curveView: CurveView
    private xAxis: ControlPolygonView


    constructor(private canvas: HTMLCanvasElement, private gl: WebGLRenderingContext) {
        this.spline = new BSpline_R1_to_R1([0, 1, 0], [0, 0, 0, 1, 1, 1]).curve()
        this.spline = this.spline.move(-0.5, 0)
        this.controlPointsShaders = new ControlPointsShaders(this.gl)
        this.controlPointsView = new ControlPointsView(this.spline, this.controlPointsShaders, 1, 1, 1)
        this.controlPolygonShaders = new ControlPolygonShaders(this.gl)
        this.controlPolygonView = new ControlPolygonView(this.spline, this.controlPolygonShaders, false)
        this.curveShaders = new CurveShaders(this.gl)
        this.curveView = new CurveView(this.spline, this.curveShaders, 216 / 255, 200 / 255, 95 / 255, 1)
        this.xAxis = new ControlPolygonView(create_BSpline_R1_to_R2([[-1, 0], [1, 0]], [0, 0, 1, 1]), this.controlPolygonShaders, false)

    }

    update(message: BSpline_R1_to_R2): void {
        this.spline = new BSpline_R1_to_R2_DifferentialProperties(message).curvatureDerivativeNumerator().curve()
        let max = 0
        this.spline.controlPoints.forEach(element => {
            let temp = Math.abs(element.y)
            if (temp > max) {
                max = temp
            }
        })

        this.spline = this.spline.move(-0.5, 0)

        this.spline = this.spline.scaleX(1.8)

        if (max !== 0) {
            this.spline = this.spline.scaleY(1 / (max * 2.1))
        }

        this.controlPointsView.update(this.spline)
        this.controlPolygonView.update(this.spline)
        this.curveView.update(this.spline)
    }

    renderFrame() {
        let px = 100,
        size = Math.min(window.innerWidth, window.innerHeight) - px;
        this.canvas.width = size;
        this.canvas.height = size * 0.5;
        this.gl.viewport(0, -this.canvas.height * 0.5, this.canvas.width, this.canvas.height * 2);
        this.gl.clearColor(0.7, 0.7, 0.7, 1)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        this.xAxis.renderFrame()
        this.curveView.renderFrame()
        this.controlPolygonView.renderFrame()
        this.controlPointsView.renderFrame()
    }


    
}