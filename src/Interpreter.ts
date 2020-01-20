import Token from "./Token.ts"
import TokenType,{keywords} from "./TokenType.ts"
import Expr from "./Expr.ts"
import debug from "./debug.ts"

let {NUMBER,VARIABLE,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,SIN,COS,TAN} = TokenType

export default class Interpreter {
	expr:Expr
	constructor(expr){
		this.expr = expr
	}
	interpret(expr:Expr=this.expr,vars:Object){
		//debug("typeof expr: ",typeof expr)
		if (expr instanceof Expr.Binary){
			if (expr.operator.type === PLUS){
				return this.interpret(expr.left,vars)+this.interpret(expr.right,vars)
			}
		}else if (expr instanceof Expr.Literal){
			if (typeof expr.value === "number") return expr.value
			return vars[expr.value]
		}
	}
}