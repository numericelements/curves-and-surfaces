import { IObserver } from "../designPatterns/Observer";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";
import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { Vector3d } from "../mathVector/Vector3d";
import { Object3dShadowShaders } from "./Object3dShadowShaders";
import { AbstractObject3dShadowView } from "./AbstractObject3dShadowView";
import { computeApproximatedTangentsFromPointsSequence, computeRandomUpVector, computeUpVectorSequence, indicesForOneCylinder, orientedEllipse } from "./Curve3dView";


export class Curve3dShadowView extends AbstractObject3dShadowView implements IObserver<BSplineR1toR3> {


    constructor(private spline: BSplineR1toR3, object3dShadowShaders: Object3dShadowShaders, lightDirection: number[], private closed: boolean) {
        super(object3dShadowShaders, lightDirection)
        this.updateVerticesAndIndices()
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShadowShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }

    updateVerticesAndIndices() {
        const radius = 0.005
        const sectorCount = 20
        const stackCount = 200

        let indices: number[] = []
        let startingIndex = 0

        const vertices = this.computeVertices(radius, stackCount, sectorCount)

        for (let i = 0; i < stackCount - 1;  i += 1) {
            let ind = indicesForOneCylinder(startingIndex, sectorCount)
            indices = [...indices, ...ind]
            startingIndex += sectorCount + 1
        }
        
        this.vertices = toFloat32Array(vertices)
        this.indices = toUint16Array(indices)

    }

    frames(number: number) {
        const start = this.spline.knots[this.spline.degree]
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1]
        let pointSequenceOnSpline: Vector3d[] = []
        for (let i = 0; i < number; i += 1) {
            let point = this.spline.evaluate(i / (number - 1) * (end - start) + start)
            pointSequenceOnSpline.push(point as Vector3d)
        }
        const tangentSequenceOnSpline = computeApproximatedTangentsFromPointsSequence(pointSequenceOnSpline)
        const randomUpVector = computeRandomUpVector(tangentSequenceOnSpline[0])
        const upVectorSequenceOnSpline = computeUpVectorSequence(tangentSequenceOnSpline, randomUpVector)
        return {pointSequence: pointSequenceOnSpline, tangentSequence: tangentSequenceOnSpline, upVectorSequence: upVectorSequenceOnSpline}
    }

    computeVertices(radius: number, stackCount: number, sectorCount: number) {
        let frames = this.frames(stackCount)
        let result: number[] = []
        for (let i = 0; i < frames.pointSequence.length; i += 1) {
            let oe = orientedEllipse(frames.pointSequence[i], frames.tangentSequence[i], frames.upVectorSequence[i], sectorCount, radius, radius)
            for (let j = 0; j < oe.vertices.length; j += 1) {
                // vertex position (x, y, z)
                result.push(oe.vertices[j].x)
                result.push(oe.vertices[j].y)
                result.push(oe.vertices[j].z)
                // normalized vertex normal (nx, ny, nz)
                result.push(oe.normals[j].x)
                result.push(oe.normals[j].y)
                result.push(oe.normals[j].z)
                // Color
                result.push(1.0)
                result.push(0.5)
                result.push(0.5)
            }
        }

        return result
    }

    update(spline: BSplineR1toR3) {

        this.spline = spline
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }

}



