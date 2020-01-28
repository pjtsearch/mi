import {assertEquals} from "https://deno.land/std/testing/mod.ts";
import MI from "../src/index.ts"

export function literalNumber(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("1"),1)
}

export function literalString(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression('"test"'),"test")
}