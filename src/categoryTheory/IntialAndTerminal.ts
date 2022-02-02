
import { Fun, fun, Prod, fst, snd } from "./Product"
import { curry } from "../categoryTheory/Curry"


//Inital object
export type Zero = never 
export let absurd = <a>() : Fun<Zero, a> => fun<Zero, a>(_ => {throw new Error("Does not exist.")})

//Terminal object
export interface Unit {}
export let unit = <a>() : Fun<a, Unit> => fun(x => ({}))

export let id = function<a>() : Fun<a,a> {return fun(x => x)}

// i : (0->a) -> 1
// i = unit
export let powerOfZero = function<a>() : Fun<Fun<Zero, a>, Unit> {
    return unit()
}

// i : 1 -> (0->a)
// i = curry(f), where f: 1*0 -> a
// f = snd; absurd
export let power_of_zero_inv = function<a>() :
    Fun<Unit, Fun<Zero, a>> {
        return curry(absurd<a>().after(snd<Unit, Zero>()))
    }

// a*1 = a
export let product_identity = function<a>() : Fun<Prod<any, Unit>,a> {
    return fst<a, Unit>()
}

// 1*a = a
export let product_indentity_inv = function<a>() : Fun<any, Prod<a, Unit>> {
        return id<a>().times(unit<a>())
}
