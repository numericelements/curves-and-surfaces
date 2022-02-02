

export interface Prod<a,b>{ fst:a, snd:b}

let times = <c, a, b>(f:(_:c) => a, g: (_:c) => b) =>
    (x:c) : Prod<a, b> => ({fst:f(x), snd:g(x)})

export interface Fun<a, b> {
        f: (_:a) => b
        after: <c>(f: Fun<c, a>) => Fun<c, b>
        then: <c>(f: Fun<b, c>) => Fun<a, c>
        times: <c>(g:Fun<a,c>) => Fun<a, Prod<b,c>>
}

export let fun = <a,b>(f:(_:a) => b) : Fun<a,b> => ({
        f:f,
        after: function<c>(this:Fun<a,b>, g:Fun<c,a>) : Fun<c,b> { 
          return fun<c,b>((x) => this.f(g.f(x))) },
        then: function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> { 
          return fun<a,c>((x) => g.f(this.f(x))) },
        times: function<c>(this:Fun<a,b>, g:Fun<a,c>) : Fun<a, Prod<b,c>>
            { return fun(times(this.f, g.f))}
})

export let fst = function<a,b>() : Fun<Prod<a,b>,a> {
    return fun<Prod<a,b>,a>(p => p.fst) 
}

export let snd = function<a,b>() : Fun<Prod<a,b>,b> {
    return fun<Prod<a,b>,b>(p => p.snd) 
}

let incr:Fun<number,number> = fun(x => x + 1)
let is_even:Fun<number,boolean> = fun(x => x % 2 == 0)

export let productFunction:Fun<number, Prod<number, boolean>> = incr.times(is_even)

export let firstArgument:Fun<number, number> = productFunction.then(fst()).then(incr)


