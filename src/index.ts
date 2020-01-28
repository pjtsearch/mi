import Scanner from "./Scanner.ts"
import Parser from "./Parser.ts"
import Stmt from "./Stmt.ts"
import Token from "./Token.ts"
import Interpreter from "./Interpreter.ts"
//import debug from "./debug.ts"
import OptionsType from "./OptionsType.ts"
/*
if (Deno.args[0] === "ast"){
  var scanner = new Scanner(Deno.args[1])
  var tokens = scanner.scanTokens()
  var parser = new Parser(tokens,Deno.args[1])

  let answer = JSON.stringify(parser.parse(),null,1)
 	if (Deno.args.includes("--tokens") || Deno.args.includes("-t"))console.log(tokens)
  console.log(answer)
}else if (Deno.args[0] === "interpret"){
	let scanner = new Scanner(Deno.args[1])
  let tokens = scanner.scanTokens()
  let parser = new Parser(tokens,Deno.args[1])
  let parsed = parser.parse()
	debug(JSON.stringify(parsed,null,1))
	let interpreter = new Interpreter(parsed,Deno.args[1])
	let answer = interpreter.interpret()
}
*/
export default class MI {
	options:OptionsType
	constructor(options){
		this.options = options
	}
	scan(source:string){
		const scanner:Scanner = new Scanner(source,this.options)
		return scanner.scanTokens()
	}
	parse(source:string){
		const tokens:Token[] = this.scan(source)
		const parser:Parser = new Parser(tokens,source,this.options)
    return parser.parse()
	}
	interpret(source:string){
		const ast:Stmt[] = this.parse(source)
		const interpreter:Interpreter = new Interpreter(ast,source,this.options)
    return interpreter.interpret()
	}
}