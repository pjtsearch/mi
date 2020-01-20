import Scanner from "./Scanner.ts"
import Parser from "./Parser.ts"
import Interpreter from "./Interpreter.ts"

if (Deno.args[0] === "ast"){
  var scanner = new Scanner(Deno.args[1])
  var tokens = scanner.scanTokens()
  var parser = new Parser(tokens)

  let answer = JSON.stringify(parser.parse(),null,1)
 	if (Deno.args.includes("--tokens") || Deno.args.includes("-t"))console.log(tokens)
  console.log(answer)
}else if (Deno.args[0] === "interpret"){
	let scanner = new Scanner(Deno.args[1])
  let tokens = scanner.scanTokens()
  let parser = new Parser(tokens)
  let parsed = parser.parse()
	console.log(JSON.stringify(parsed,null,1))
	let interpreter = new Interpreter(parsed)
	let answer = interpreter.interpret(undefined,{x:1})
	console.log(answer)
}
