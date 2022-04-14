import { setAxisAngle } from "../webgl/quat";
import { IObserver } from "../designPatterns/Observer";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";
import { BSplineR1toR3 } from "../bsplines/R1toR3/BSplineR1toR3";
import { Vector3d } from "../mathVector/Vector3d";
import { rotationMatrixFromTwoVectors } from "../mathVector/RotationMatrix";
import { Object3dShadowShaders } from "./Object3dShadowShaders";
import { BaseObject3dShadowView } from "./BaseObject3dShadowView";
import { indicesForOneCylinder, verticesForOneCylinder } from "./ControlPolygon3dView";


export class ControlPolygon3dShadowView extends BaseObject3dShadowView implements IObserver<BSplineR1toR3> {

    private controlPoints: Vector3d[]

    constructor(spline: BSplineR1toR3, object3dShadowShaders: Object3dShadowShaders, lightDirection: number[], private closed: boolean) {

        super(object3dShadowShaders, lightDirection)
        this.controlPoints = spline.freeControlPoints
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0])
        }
        this.updateVerticesAndIndices()
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShadowShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }

    updateVerticesAndIndices() {
        const radius = 0.003
        const sectorCount = 20

        let vertices: number[] = []
        let indices: number[] = []
        let startingIndex = 0

        for (let i = 0; i < this.controlPoints.length - 1;  i += 1) {
            let v = verticesForOneCylinder(this.controlPoints[i], this.controlPoints[i+1], radius, sectorCount)
            let ind = indicesForOneCylinder(startingIndex, sectorCount)
            vertices = [...vertices, ...v]
            indices = [...indices, ...ind]
            startingIndex += v.length / 9
        }
        
        this.vertices = toFloat32Array(vertices)
        this.indices = toUint16Array(indices)

    }

    update(spline: BSplineR1toR3) {
        this.controlPoints = spline.freeControlPoints
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0])
        }
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }

}

