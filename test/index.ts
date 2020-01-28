import * as literal from "./literal.ts"
import * as binary from "./binary.ts"

let tests = [...Object.values(literal),...Object.values(binary)]

import {
  runTests,
  test
} from "https://deno.land/std/testing/mod.ts";

tests.forEach(fn=>test(fn))
runTests()