import { Fun, fun, Prod } from "./Product"

//curry(f) : a -> (b->c)

export let curry = function<a, b, c> (f: Fun<Prod<a,b>,c>) :
    Fun<a, Fun<b,c>> {
        return fun(a => fun(b => f.f({ fst:a, snd:b })))
    }

export let apply = <a, b>(f: Fun<a, b>, x:a) : b => f.f(x)

export let apply_pair = function<a,b>() :
    Fun<Prod<Fun<a,b>, a>, b> {
        return fun(p => p.fst.f(p.snd))
    }