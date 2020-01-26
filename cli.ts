import MI from "./src/index.ts"

if (Deno.args[0] === "ast"){
	let mi = new MI({dev:true})
  let answer = JSON.stringify(mi.parse(Deno.args[1]),null,1)
 	//if (Deno.args.includes("--tokens") || Deno.args.includes("-t"))console.log(tokens)
  console.log(answer)
}else if (Deno.args[0] === "interpret"){
	let mi = new MI({dev:true})
	console.log(JSON.stringify(mi.parse(Deno.args[1]),null,1))
	let answer = mi.interpret((Deno.args[1]))
}