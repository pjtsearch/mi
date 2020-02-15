import Scanner from "./Scanner.ts";
import Parser from "./Parser.ts";
import Interpreter from "./Interpreter.ts";
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
    constructor(options) {
        this.options = options;
    }
    scan(source) {
        const scanner = new Scanner(source, this.options);
        return scanner.scanTokens();
    }
    parse(source) {
        const tokens = this.scan(source);
        const parser = new Parser(tokens, source, this.options);
        return parser.parse();
    }
    interpret(source) {
        const ast = this.parse(source);
        const interpreter = new Interpreter(ast, source, this.options);
        return interpreter.interpret();
    }
    interpretExpression(command) {
        const options = { dev: false };
        const scanner = new Scanner(command, options);
        const tokens = scanner.scanTokens();
        const parser = new Parser(tokens, command, options);
        const ast = parser.parse();
        const interpreter = new Interpreter([], "", options);
        return interpreter.interpretOne(ast[0]);
    }
}
