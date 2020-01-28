import * as literal from "./literal.ts"

let tests = [...Object.values(literal)]

import {
  runTests,
  test
} from "https://deno.land/std/testing/mod.ts";

tests.forEach(fn=>test(fn))
runTests()