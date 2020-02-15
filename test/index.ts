import * as literal from "./literal.ts"
import * as grouping from "./grouping.ts"
import * as variable from "./variable.ts"
import * as funct from "./funct.ts"
import * as standardLib from "./standard-lib.ts"

const v = Object.values
let tests = [...v(literal),...v(grouping),...v(variable),...v(funct),...v(standardLib)]

tests.forEach(fn=>Deno.test(fn))
Deno.runTests()
