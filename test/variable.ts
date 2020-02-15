import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import MI from "../src/index.ts"

export function variable(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  x`),[null,2])
}

export function variableAdditionVariable(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  y=2
  x+y`),[null,null,4])
}

export function variableAdditionLiteral(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  x+2`),[null,4])
}

export function variableAdditionGrouping(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  x+(1+1)`),[null,4])
}

export function variableMultiplicationVariable(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  y=2
  xy`),[null,null,4])
}

export function variableMultiplicationVariableParenthesis(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  y=2
  (x)(y)`),[null,null,4])
}

export function variableMultiplicationVariableBothParenthesisAddition(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  y=2
  (x+0)(y+0)`),[null,null,4])
}

export function variableExponentLiteral(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  x^2`),[null,4])
}

export function variableExponentVariable(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`x=2
  y=2
  x^y`),[null,null,4])
}
