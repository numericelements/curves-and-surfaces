//source : https://medium.com/@giuseppemaggiore/category-theory-for-typescript-programmers-a2372f771b20


/*
f : a -> b
g : b -> c
f;g : a -> c
*/

export interface Fun<a, b> {
    f: (_:a) => b
    after: <c>(f: Fun<c, a>) => Fun<c, b>
    then: <c>(f: Fun<b, c>) => Fun<a, c>
}

export let fun = <a,b>(f:(_:a) => b) : Fun<a,b> => ({
    f:f,
    after: function<c>(this:Fun<a,b>, g:Fun<c,a>) : Fun<c,b> { 
      return fun<c,b>((x) => this.f(g.f(x))) },
    then: function<c>(this:Fun<a,b>, g:Fun<b,c>) : Fun<a,c> { 
      return fun<a,c>((x) => g.f(this.f(x))) }
})

let incr:Fun<number,number> = fun(x => x + 1)
let is_even:Fun<number,boolean> = fun(x => x % 2 == 0)
let not:Fun<boolean,boolean> = fun(x => !x)

export let composedFunction = incr.then(is_even).then(not)