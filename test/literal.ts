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

export function literalAddition(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("1+1"),2)
}

export function literalMultiplicationStar(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression('2*2'),4)
}

export function literalMultiplicationParenthesis(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression('2(2)'),4)
}

export function literalExponent(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("2^2"),4)
}
