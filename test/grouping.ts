import {assertEquals} from "https://deno.land/std/testing/mod.ts";
import MI from "../src/index.ts"

export function grouping(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("(1+1)"),2)
}
export function groupingMultiplicationGrouping(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("(1+1)(1+1)"),4)
}

export function groupingMultiplicationLiteral(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("(1+1)(2)"),4)
}

export function groupingMultiplicationLiteralBefore(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("2(1+1)"),4)
}

export function groupingAdditionGrouping(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("(1+1)+(1+1)"),4)
}

export function groupingAdditionLiteral(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("(1+1)+2"),4)
}

export function groupingExponentLiteral(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("(1+1)^2"),4)
}

export function groupingExponentGrouping(){
	const mi = new MI({dev:false})
	assertEquals(mi.interpretExpression("(1+1)^(1+1)"),4)
}