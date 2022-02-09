
// x = 1 + ax
// x = 1 + a + aax
// x = 1 + a + aaa + aaax
// x + 1 + a + aaa + aaaa + ...

type ValueOrArray<T> = T | ValueOrArray<T>[]

type NestedStringArray = ValueOrArray<string>

const nestedStringArray: NestedStringArray = [
  'hello',
  ['w', ['o', 'r', 'l'], 'd'],
]

