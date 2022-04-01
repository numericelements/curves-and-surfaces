/**
 * An n dimensional vector
 */


export interface VectorInterface {

    x : number

    y : number

    negative() : VectorInterface

    add(v: VectorInterface) : VectorInterface

    multiply(value: number) : VectorInterface

    substract(v: VectorInterface): VectorInterface
    
    normalize() : VectorInterface

    dot(v: VectorInterface) : number

    distance(v: VectorInterface) : number

    norm() : number

    clone() : VectorInterface



}


