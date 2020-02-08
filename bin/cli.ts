#!/usr/bin/deno --allow-read
import MI from "../src/index.ts"
import { input } from "https://raw.githubusercontent.com/johnsonjo4531/read_lines/master/input.ts";
import Scanner from "../src/Scanner.ts"
import Parser from "../src/Parser.ts"
import Interpreter from "../src/Interpreter.ts"
import Stmt from "../src/Stmt.ts"
import Token from "../src/Token.ts"

if (Deno.args[0] === "ast"){
	let mi = new MI({dev:false})
  let answer = JSON.stringify(mi.parse(Deno.args[1]),null,1)
 	//if (Deno.args.includes("--tokens") || Deno.args.includes("-t"))console.log(tokens)
  console.log(answer)
}else if (Deno.args[0] === "scan"){
	let mi = new MI({dev:false})
	let answer = JSON.stringify(mi.scan(Deno.args[1]),null,1)
	console.log(answer)
}else if (Deno.args[0] === "interpret"){
	let mi = new MI({dev:false})
	//console.log(JSON.stringify(mi.parse(Deno.args[1]),null,1))
	let answer = mi.interpret((Deno.args[1]))
}else if (!Deno.args[0]){
	let mi = new MI({dev:false});
	(async () => {
		console.log("-- MI REPL --");
		const options = {dev:false}
		const interpreter:Interpreter = new Interpreter([],"",options)
		while (true){
			const command:string = await input("> ") as string;
			try{
				const scanner:Scanner = new Scanner(command,options)
				const tokens:Token[] = scanner.scanTokens()
				const parser:Parser = new Parser(tokens,command,options)
				const ast:Stmt[] = parser.parse()
				console.log(interpreter.interpretOne(ast[0]))
			}catch(err){
				console.error(err)
			}
		}
	})();
}

if (Deno.args.includes("-v")||Deno.args.includes("--version")){
	(async()=>{
		const decoder = new TextDecoder('utf-8');
		const {version} = JSON.parse(decoder.decode(await Deno.readFile('package.json')));
		console.log(version)
	})()
}