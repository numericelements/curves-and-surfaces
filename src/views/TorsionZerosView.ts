import { IObserver } from "../designPatterns/Observer";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";
import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { Vector3d } from "../mathVector/Vector3d";
import { Object3dShaders } from "./Object3dShaders";
import { AbstractObject3dView } from "./AbstractObject3dView";
import { BSplineR1toR3DifferentialProperties } from "../bsplines/BSplineR1toR3DifferentialProperties";
import { indicesForOneSphere, verticesForOneSphere } from "./ControlPoints3dView";

export class TorsionZerosView extends AbstractObject3dView  implements IObserver<BSplineR1toR3> {


    private zeros: Vector3d[]

    constructor(private spline: BSplineR1toR3, object3dShaders: Object3dShaders, lightDirection: number[]) {
        super(object3dShaders, lightDirection)

        const splineDP = new BSplineR1toR3DifferentialProperties(spline)
        this.zeros = splineDP.torsionZeros()

        this.updateVerticesAndIndices()
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }        
    }

    updateVerticesAndIndices() {
        const radius = 0.012
        const sectorCount = 50
        const stackCount = 50

        let vertices: number[] = []
        let indices: number[] = []
        let startingIndex = 0

        for (let zero of this.zeros) {
            let v = verticesForOneSphere(zero, radius, sectorCount, stackCount, { red: 1, green: 0.75, blue: 0.75 })
            let ind = indicesForOneSphere(startingIndex, sectorCount, stackCount)
            vertices = [...vertices, ...v]
            indices = [...indices, ...ind]
            startingIndex += v.length / 9
        }
        this.vertices = toFloat32Array(vertices)
        this.indices = toUint16Array(indices)
    }

    updateVerticesIndicesAndBuffers() {
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }

    update(spline: BSplineR1toR3) {
        this.spline = spline
        const splineDP = new BSplineR1toR3DifferentialProperties(spline)
        this.zeros = splineDP.torsionZeros()
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }


}
