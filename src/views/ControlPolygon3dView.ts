import { IObserver } from "../designPatterns/Observer";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";
import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { Vector3d } from "../mathVector/Vector3d";
import { rotationMatrixFromTwoVectors } from "../mathVector/RotationMatrix";
import { Object3dShaders } from "./Object3dShaders";
import { AbstractObject3dView } from "./AbstractObject3dView";


export class ControlPolygon3dView extends AbstractObject3dView implements IObserver<BSplineR1toR3> {

    private controlPoints: Vector3d[]

    constructor(spline: BSplineR1toR3, object3dShaders: Object3dShaders, lightDirection: number[], private closed: boolean) {
        super(object3dShaders, lightDirection)
        this.controlPoints = spline.freeControlPoints
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0])
        }
        this.updateVerticesAndIndices()
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
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

export function verticesForOneCylinder(centerTop: Vector3d, centerBottom: Vector3d, radius: number, sectorCount: number) {

    let axisVector = centerTop.substract(centerBottom).normalize()

    const circleTop = orientedCircle(centerTop, radius, axisVector, sectorCount)
    const circleBottom = orientedCircle(centerBottom, radius, axisVector, sectorCount)

    let result: number[] = []

    for (let i = 0; i < circleTop.vertices.length; i += 1) {
        // vertex position (x, y, z)
        result.push(circleTop.vertices[i].x)
        result.push(circleTop.vertices[i].y)
        result.push(circleTop.vertices[i].z)
        // normalized vertex normal (nx, ny, nz)
        result.push(circleTop.normals[i].x)
        result.push(circleTop.normals[i].y)
        result.push(circleTop.normals[i].z)
        // Color
        result.push(0.5)
        result.push(0.5)
        result.push(0.5)
    }

    for (let i = 0; i < circleBottom.vertices.length; i += 1) {
        // vertex position (x, y, z)
        result.push(circleBottom.vertices[i].x)
        result.push(circleBottom.vertices[i].y)
        result.push(circleBottom.vertices[i].z)
        // normalized vertex normal (nx, ny, nz)
        result.push(circleBottom.normals[i].x)
        result.push(circleBottom.normals[i].y)
        result.push(circleBottom.normals[i].z)
        // Color
        result.push(0.8)
        result.push(0.8)
        result.push(0.8)
    }

    return result
}

export function orientedCircle(center: Vector3d, radius: number, axisVector: Vector3d, sectorCount: number) {
    const n = axisVector.dot(new Vector3d(0, 0, 1))
    const sectorStep = 2 * Math.PI / sectorCount
    let vertices: Vector3d[] = []
    let normals: Vector3d[] = []
    if (n > 0) {
        const rotationMatrix = rotationMatrixFromTwoVectors(new Vector3d(0, 0, 1), axisVector)
        for (let j = 0; j <= sectorCount; j += 1) {
            let sectorAngle = j * sectorStep  // starting for 0 to 2pi
            // cicle in the plane xy 
            let x = radius * Math.cos(sectorAngle)
            let y = radius * Math.sin(sectorAngle)
            let v = rotationMatrix.multiplyByVector([x, y, 0])
            vertices.push(new Vector3d(v[0] + center.x, v[1] + center.y, v[2] + center.z) )

            let nx = Math.cos(sectorAngle)
            let ny = Math.sin(sectorAngle)
            let nv = rotationMatrix.multiplyByVector([nx, ny, 0])
            normals.push(new Vector3d(nv[0], nv[1], nv[2]))
        }
    }
    else {
        const rotationMatrix = rotationMatrixFromTwoVectors(new Vector3d(0, 1, 0), axisVector)
        for (let j = 0; j <= sectorCount; j += 1) {
            let sectorAngle = j * sectorStep  // starting for 0 to 2pi
            // cicle in the plane xz 
            let x = radius * Math.cos(sectorAngle)  
            let z = radius * Math.sin(sectorAngle)
            let v = rotationMatrix.multiplyByVector([x, 0, z])
            vertices.push(new Vector3d(v[0] + center.x, v[1] + center.y, v[2] + center.z) )

            let nx = Math.cos(sectorAngle)
            let nz = Math.sin(sectorAngle)
            let nv = rotationMatrix.multiplyByVector([nx, 0, nz])
            normals.push(new Vector3d(nv[0], nv[1], nv[2]))
        }
    }
    return {vertices: vertices, normals: normals}
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

