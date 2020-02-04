import {assertEquals} from "https://deno.land/std/testing/mod.ts";
import MI from "../src/index.ts"
import printExports from "../src/standard-lib/print.ts"

export function print(){
  const mi = new MI({dev:false})
  assertEquals(mi.interpret(`import print from "mi:print"
  print`),[null,printExports.exports.print])
}