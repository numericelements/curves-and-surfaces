import { IObserver } from "../designPatterns/Observer";
import { toFloat32Array, toUint16Array } from "./ArrayConversion";
import { BSplineR1toR3 } from "../bsplines/BSplineR1toR3";
import { linePlaneIntersection, pointLineDistance, Vector3d } from "../mathVector/Vector3d";
import { Object3dShaders } from "./Object3dShaders";
import { AbstractObject3dView } from "./AbstractObject3dView";
import { CholeskyDecomposition } from "../linearAlgebra/CholeskyDecomposition";
import { lusolve } from "../linearAlgebra/LUSolve";

export class ControlPoints3dView extends AbstractObject3dView  implements IObserver<BSplineR1toR3> {

    private selectedControlPoint: number | null = null

    constructor(private spline: BSplineR1toR3, object3dShaders: Object3dShaders, lightDirection: number[]) {
        super(object3dShaders, lightDirection)
        this.updateVerticesAndIndices()
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.object3dShaders.gl);
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

        for (let i = 0; i < this.spline.controlPoints.length; i += 1) {
            let v : number[]
            if (i === this.selectedControlPoint) {
                v = verticesForOneSphere(this.spline.controlPoints[i], radius, sectorCount, stackCount, {red: 0.7, green: 0.7, blue: 0.7})
            } else {
                v = verticesForOneSphere(this.spline.controlPoints[i], radius, sectorCount, stackCount, {red: 0.5, green: 0.5, blue: 0.5})
            }
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
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }

    controlPointSelection(x: number, y: number, deltaSquared: number = 0.01) {
        let result = null
        let previousDistance: number | null = null
        const l = this.pickingLine(x, y)
        for (let i = 0; i < this.spline.controlPoints.length; i += 1) {
            const m = this.getModelTransformationMatrix()
            const cp = this.spline.controlPoints[i]
            const v = m.multiplyByVector([cp.x, cp.y, cp.z])
            const p = new Vector3d(v[0], v[1], v[2])
            if (pointLineDistance(p, l.p1, l.p2) < deltaSquared) {
                let d = this.distanceToCamera(p)
                if (d !== null) {
                    if (previousDistance === null || d < previousDistance ) {
                        result = i
                        previousDistance = d
                    }
                }
            }
        }
        return result
    }

    getSelectedControlPoint() {
        return this.selectedControlPoint
    }


    setSelected(controlPointIndex: number | null) {
        this.selectedControlPoint = controlPointIndex
    }

    
    computeNewPosition(ndcX: number, ndcY: number) {
        let result: Vector3d | null = null
        if (this.selectedControlPoint !== null) {
            const m = this.getModelTransformationMatrix()
            const cp = this.spline.controlPoints[this.selectedControlPoint]
            const v = m.multiplyByVector([cp.x, cp.y, cp.z])
            const p = new Vector3d(v[0], v[1], v[2])

            const l = this.pickingLine(ndcX, ndcY) 
            let pp = linePlaneIntersection(l.p1, l.p2, this.getLookAtOrigin(), this.getCameraPosition(), p)
            let point = lusolve(m, [pp.x, pp.y, pp.z])
            if (point !== undefined) {
                result = new Vector3d(point[0], point[1], point[2])
            }
        }
        return result
        
    }




}

export function  verticesForOneSphere(center: Vector3d, radius: number, sectorCount: number, stackCount: number, color: {red: number, green: number, blue: number}) {
    //http://www.songho.ca/opengl/gl_sphere.html

    let x, y, z, xy: number // vertex position
    let nx, ny, nz: number // vertex normal
    let sectorAngle, stackAngle: number 
    const lengthInv = 1 / radius 
    const sectorStep = 2 * Math.PI / sectorCount

    const stackStep = Math.PI / stackCount
    let result: number[] = []

    for (let i = 0; i <= stackCount; i += 1) {

        stackAngle = Math.PI / 2 - i * stackStep  // starting from pi/2 to -pi/2

        xy = radius * Math.cos(stackAngle)
        z = radius * Math.sin(stackAngle)

        // add (sectorCout+1) vertices per stack
        // the first and last vertices have the same position and normal
        for (let j = 0; j <= sectorCount; j += 1) {
            sectorAngle = j * sectorStep  // starting for 0 to 2pi
            // vertex position (x, y, z)
            x = xy * Math.cos(sectorAngle)   // r * cos(u) * cos(v)
            y = xy * Math.sin(sectorAngle)   // r * cos(u) * sin(v)
            result.push(x + center.x)
            result.push(y + center.y)
            result.push(z + center.z)
            // normalized vertex normal (nx, ny, nz)
            nx = x * lengthInv
            ny = y * lengthInv
            nz = z * lengthInv
            result.push(nx)
            result.push(ny)
            result.push(nz)
            // Color
            result.push(color.red)
            result.push(color.green)
            result.push(color.blue)
        }
    }
    return result
}

export function indicesForOneSphere(startingIndex: number, sectorCount: number, stackCount: number) {

    let result: number[] = []

    for (let i = 0; i < stackCount; i += 1) {
        let k1 = i * (sectorCount + 1)  // beginning of current stack
        let k2 = k1 + sectorCount + 1   // beginning of next stack
        for (let j = 0; j < sectorCount; j += 1, k1 += 1, k2 += 1) {
            if ( i != 0) {
                result.push(k1 + startingIndex)
                result.push(k2 + startingIndex)
                result.push(k1 + 1 + startingIndex)
            }
            if ( i != (stackCount-1)) {
                result.push(k1 + 1 + startingIndex)
                result.push(k2 + startingIndex)
                result.push(k2 + 1 + startingIndex)
            }
        }
    }
    return result

}