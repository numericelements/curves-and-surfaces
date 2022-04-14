import { IObserver } from "../designPatterns/Observer";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";
import { BSplineR1toR3 } from "../bsplines/R1toR3/BSplineR1toR3";
import { Vector3d } from "../mathVector/Vector3d";
import { rotationMatrixFromTwoVectors } from "../mathVector/RotationMatrix";
import { Object3dShaders } from "./Object3dShaders";
import { BaseObject3dView } from "./BaseObject3dView";

export class Curve3dView extends BaseObject3dView implements IObserver<BSplineR1toR3> {

    //private controlPoints: Vector3d[]

    constructor(private spline: BSplineR1toR3, object3dShaders: Object3dShaders, lightDirection: number[], private closed: boolean) {
        super(object3dShaders, lightDirection)
        this.spline = spline
        this.updateVerticesAndIndices()

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
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

export function computeRandomUpVector(tangentVector: Vector3d) {
    if (tangentVector.x > tangentVector.y) {
        return tangentVector.crossPoduct(new Vector3d(0, 1, 0)).normalize()
    } else {
        return tangentVector.crossPoduct(new Vector3d(1, 0, 0)).normalize()
    }
}

export function indicesForOneCylinder(startingIndex: number, sectorCount: number) {
    let result: number[] = []
        let k1 = 0  // beginning of current stack
        let k2 = k1 + sectorCount + 1   // beginning of next stack
        for (let j = 0; j < sectorCount; j += 1, k1 += 1, k2 += 1) {
                result.push(k1 + startingIndex)
                result.push(k2 + startingIndex)
                result.push(k1 + 1 + startingIndex)
                result.push(k1 + 1 + startingIndex)
                result.push(k2 + startingIndex)
                result.push(k2 + 1 + startingIndex)
        }
    return result

}

export function computeUpVectorSequence(tangentSequence: Vector3d[], firstUpVector: Vector3d) {
    let result: Vector3d[] = []
    result.push(firstUpVector)
    for (let i = 0; i < tangentSequence.length - 1; i += 1 ) {
        let rotationMatrix = rotationMatrixFromTwoVectors(tangentSequence[i], tangentSequence[i + 1])
        let lastUpVector = result[result.length -1]
        let newUpVector = rotationMatrix.multiplyByVector([lastUpVector.x, lastUpVector.y, lastUpVector.z])
        result.push(new Vector3d(newUpVector[0], newUpVector[1], newUpVector[2]).normalize())
    }
    return result
    
}

export function orientedEllipse(center: Vector3d, normal: Vector3d, up: Vector3d, sectorCount: number, semiMinorAxis: number, semiMajorAxis: number, miter: Vector3d = new Vector3d(1, 0, 0)) {
    const sectorStep = 2 * Math.PI / sectorCount
    let vertices: Vector3d[] = []
    let normals: Vector3d[] = []
    let side = normal.crossPoduct(up).normalize()
    for (let i = 0; i <= sectorCount; i += 1) {
        let sectorAngle = i * sectorStep  // starting for 0 to 2pi
        let v1 = up.multiply(Math.sin(sectorAngle)*semiMinorAxis)
        let v2 = side.multiply(Math.cos(sectorAngle)*semiMajorAxis)
        vertices.push(v1.add(v2).add(center))
    }
    for (let i = 0; i <= sectorCount; i += 1) {
        let sectorAngle = i * sectorStep  // starting for 0 to 2pi
        let v1 = up.multiply(Math.sin(sectorAngle)*semiMinorAxis)
        let v2 = side.multiply(Math.cos(sectorAngle)*semiMajorAxis)
        normals.push(v1.add(v2).normalize())
    }

    return {vertices: vertices, normals: normals}
}


function computeMiterFromPointsSequence(points: Vector3d[], radius: number) {
    const tolerance = 10e-5
    const maxLength = radius * 3
    let miters: Vector3d[] = []
    let lengths: number[] = []
    let normal: Vector3d
    for (let i = 1; i < points.length - 1; i += 1) {
        let tangent = points[i + 1].substract(points[i - 1]).normalize()
        let v1 = points[i + 1].substract(points[i])
        let v2 = points[i + 2].substract(points[i + 1])
        let n = v1.crossPoduct(v2)
        if (n.norm() > tolerance ) {
            normal = n.normalize()
        } else {
            normal = computeRandomUpVector(tangent)
        }
        miters.push(normal)
        let l = normal.crossPoduct(v1).norm()
        if (l > maxLength) {l = maxLength }
        if (l > tolerance) {
            lengths.push(radius / l)
        } else {
            lengths.push(radius)
        }
    }
    return {miters: miters, lengths: lengths}
}

export function computeApproximatedTangentsFromPointsSequence(points: Vector3d[]) {
    let result: Vector3d[] = []
    let tangent = (points[1].substract(points[0])).normalize()
    result.push(tangent)
    for (let i = 1; i < points.length - 1; i += 1) {
        tangent = (points[i+1].substract(points[i-1])).normalize()
        result.push(tangent)
    }
    tangent = (points[points.length - 1].substract(points[points.length - 2])).normalize()
    result.push(tangent)
    return result
}