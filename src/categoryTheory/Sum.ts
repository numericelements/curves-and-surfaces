//inl : a -> a + b
//inr : b -> a + b
import {Fun, fun} from "./Product"

export type Sum<a,b> = { kind:"left", value:a} | {kind:"right", value:b}

export let inl = function <a,b>() : Fun<a, Sum<a,b>> {
    return fun<a, Sum<a,b>>(x => ({kind:"left", value:x}))
}

export let inr = function <a,b>() : Fun<b, Sum<a,b>> {
    return fun<b, Sum<a,b>>(x => ({kind:"right", value:x}))
}


