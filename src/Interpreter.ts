import Token from "./Token.ts"
import TokenType,{keywords} from "./TokenType.ts"
import Expr from "./Expr.ts"
import Stmt from "./Stmt.ts"
import debug from "./debug.ts"

let {NUMBER,VARIABLE,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,SIN,COS,TAN} = TokenType

export default class Interpreter {
	statements:Expr[]
	constructor(statements:Expr[]){
		this.statements = statements
	}
	interpret(vars:Object){
		return this.statements.map(statement=>this.interpretOne(statement,vars))
	}
	interpretOne(expr:Expr,vars:Object){
		//debug("typeof expr: ",typeof expr)
		if (expr instanceof Stmt.Expression){
			return this.interpretOne(expr.expression,vars)
		}else if (expr instanceof Stmt.Var){
			if (!expr.initializer) return vars[expr.name.lexeme]
		}else if (expr instanceof Expr.Binary){
			if (expr.operator.type === PLUS){
				return this.interpretOne(expr.left,vars)+this.interpretOne(expr.right,vars)
			}else if (expr.operator.type === MINUS){
				return this.interpretOne(expr.left,vars)-this.interpretOne(expr.right,vars)
			}else if (expr.operator.type === STAR){
				return this.interpretOne(expr.left,vars)*this.interpretOne(expr.right,vars)
			}else if (expr.operator.type === SLASH){
				return this.interpretOne(expr.left,vars)/this.interpretOne(expr.right,vars)
			}else if (expr.operator.type === CIRCUMFLEX){
				return Math.pow(this.interpretOne(expr.left,vars),this.interpretOne(expr.right,vars))
			}
		}else if (expr instanceof Expr.Literal){
			return expr.value.literal
		}else if (expr instanceof Expr.Grouping){
			return this.interpretOne(expr.expression,vars)
		}else if (expr instanceof Expr.Unary){
			if (expr.operator.type === MINUS){
				return -1 * this.interpretOne(expr.right,vars)
			}
		}
	}
}