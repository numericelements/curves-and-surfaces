
import { VectorInterface } from "./VectorInterface"

/**
 * A three dimensional vector
 */

 export class Vector3d implements VectorInterface {
 
     constructor(public x = 0, public y = 0, public z = 0) {
     }
 
     negative()  {
         return new Vector3d(-this.x, -this.y, -this.z)
     }
 
     add(v: Vector3d) {
         return new Vector3d(this.x+v.x, this.y+v.y, this.z+v.z)
     }
 
     multiply(value: number) {
         return new Vector3d(this.x*value, this.y*value, this.z*value)
     }
 
     substract(v: Vector3d) {
         return new Vector3d(this.x - v.x, this.y - v.y, this.z - v.z)
     }
 
     
     normalize() {
         let norm = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
         let x = this.x / norm
         let y = this.y / norm
         let z = this.z / norm
         return new Vector3d(x, y, z)
     }
 
     dot(v: Vector3d) {
         return this.x * v.x + this.y * v.y + this.z * v.z
     }
 
     distance(v: Vector3d) {
         return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2) + Math.pow(this.z - v.z, 2))
     }
 
     norm() {
         return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
     }
 
     clone() {
         return new Vector3d(this.x, this.y, this.z)
     }

     crossPoduct(v: Vector3d) {
        return new Vector3d(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x)
    }
 
 }
 
 
 