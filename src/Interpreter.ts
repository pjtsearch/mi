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
			}else if (expr.operator.type === MINUS){
				return this.interpret(expr.left,vars)-this.interpret(expr.right,vars)
			}else if (expr.operator.type === STAR){
				return this.interpret(expr.left,vars)*this.interpret(expr.right,vars)
			}else if (expr.operator.type === SLASH){
				return this.interpret(expr.left,vars)/this.interpret(expr.right,vars)
			}
		}else if (expr instanceof Expr.Literal){
			if (expr.value.type === NUMBER) return expr.value.literal
			return vars[expr.value.lexeme]
		}else if (expr instanceof Expr.Grouping){
			return this.interpret(expr.expression,vars)
		}else if (expr instanceof Expr.Unary){
			if (expr.operator.type === MINUS){
				return -1 * this.interpret(expr.right,vars)
			}
		}
	}
}