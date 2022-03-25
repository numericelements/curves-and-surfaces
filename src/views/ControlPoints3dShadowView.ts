import { IObserver } from "../designPatterns/Observer";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";
import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { Object3dShadowShaders } from "./Object3dShadowShaders";
import { AbstractObject3dShadowView } from "./AbstractObject3dShadowView";
import { indicesForOneSphere, verticesForOneSphere } from "./ControlPoints3dView";

export class ControlPoints3dShadowView extends AbstractObject3dShadowView implements IObserver<BSplineR1toR3> {

    constructor(private spline: BSplineR1toR3, object3dShadowShaders: Object3dShadowShaders, lightDirection: number[]) {
        super(object3dShadowShaders, lightDirection)
        this.updateVerticesAndIndices()
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShadowShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }

    updateVerticesAndIndices() {
        const radius = 0.015
        const sectorCount = 50
        const stackCount = 50
        let vertices: number[] = []
        let indices: number[] = []
        let startingIndex = 0

        for (let cp of this.spline.controlPoints) {
            let v = verticesForOneSphere(cp, radius, sectorCount, stackCount, {red: 0.5, green: 0.5, blue: 0.5})
            let i = indicesForOneSphere(startingIndex, sectorCount, stackCount)
            vertices = [...vertices, ...v]
            indices = [...indices, ...i]
            startingIndex += v.length / 9
        }
        this.vertices = toFloat32Array(vertices)
        this.indices = toUint16Array(indices)

    }

    update(spline: BSplineR1toR3) {
        this.spline = spline
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }

}