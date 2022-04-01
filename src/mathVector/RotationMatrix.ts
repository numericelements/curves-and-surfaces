import { SquareMatrix } from "../linearAlgebra/SquareMatrix";
import { Vector3d } from "./Vector3d";


// export function rotationMatrixFromTwoVectors(unitVector1: Vector3d, unitVector2: Vector3d, tolerance: number = 10e-5) {
//     // https://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d
//     let p = unitVector1.crossPoduct(unitVector2)
//     let i = new SquareMatrix(3, [1, 0, 0, 0, 1, 0, 0, 0, 1])
//     let v = new SquareMatrix(3, [0, -p.z, p.y, p.z, 0, -p.x, -p.y, p.x, 0])
//     let c = unitVector1.dot(unitVector2) 
//     if (1 + c < tolerance) {
//         throw new Error("The two given vectors points in opposite directions, the rotation matrix is indeterminate")
//     }
//     return i.addByMatrix(v).addByMatrix(v.multiplyByMatrix(v).mutiplyByConstant(1/(1+c)))
// }