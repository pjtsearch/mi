import {assertEquals} from "https://deno.land/std/testing/mod.ts";
import MI from "../src/index.ts"

export function binaryAddition(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("1+1"),2)
}

export function binaryMultiplicationStar(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression('2*2'),4)
}

export function binaryMultiplicationParenthesis(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression('2(2)'),4)
}

export function binaryMultiplicationVariable(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpret(`x=2
2x`),[null,4])
}

export function binaryExponent(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("2^2"),4)
}
