import {assertEquals} from "https://deno.land/std/testing/mod.ts";
import MI from "../src/index.ts"

export function funct(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`f(x)=x
  f(4)`),[null,4])
}

export function complicatedFunct(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`f(a,b,c,x)=ax^2+bx+c
  f(4,5,6,7)`),[null,237])
}

export function functComposition(){
	const mi = new MI({dev:false})
  assertEquals(mi.interpret(`f(a,b,c,x)=ax^2+bx+c
  g(x)=f(4,5,6,x)
  g(7)`),[null,null,237])
}