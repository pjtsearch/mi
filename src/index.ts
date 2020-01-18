import Scanner from "./Scanner.ts"
import Parser from "./Parser.ts"

if (Deno.args[0] === "ast"){
  var scanner = new Scanner(Deno.args[1])
  var tokens = scanner.scanTokens()
  var parser = new Parser(tokens)

  let answer = JSON.stringify(parser.parse(),null,1)
  console.log(answer)
}
