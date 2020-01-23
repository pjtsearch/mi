import Token from "./Token.ts"
import TokenType,{keywords} from "./TokenType.ts"
import Expr from "./Expr.ts"
import Stmt from "./Stmt.ts"
import debug from "./debug.ts"
import Environment from "./Environment.ts"

let {NUMBER,VARIABLE,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,SIN,COS,TAN} = TokenType

export default class Interpreter {
	environment:Environment = new Environment(); 
	statements:Stmt[]
	constructor(statements:Stmt[]){
		this.statements = statements
	}
	interpret(){
		this.statements.forEach(statement=>debug(this.interpretOne(statement)))
	}
	interpretOne(stmt:Stmt){
		//debug("typeof expr: ",typeof expr)
		if (stmt instanceof Stmt.Expression){
			return this.interpretOne(stmt.expression)
		}else if (stmt instanceof Stmt.Var){
			let value = null
			if (stmt.initializer){
				value = this.interpretOne(stmt.initializer);  
			}
			this.environment.define(stmt.name.lexeme, value)
			return null
		}else if (stmt instanceof Expr.Variable){
			return this.environment.get(stmt.name);
		}else if (stmt instanceof Expr.Binary){
			if (stmt.operator.type === PLUS){
				return this.interpretOne(stmt.left)+this.interpretOne(stmt.right)
			}else if (stmt.operator.type === MINUS){
				return this.interpretOne(stmt.left)-this.interpretOne(stmt.right)
			}else if (stmt.operator.type === STAR){
				return this.interpretOne(stmt.left)*this.interpretOne(stmt.right)
			}else if (stmt.operator.type === SLASH){
				return this.interpretOne(stmt.left)/this.interpretOne(stmt.right)
			}else if (stmt.operator.type === CIRCUMFLEX){
				return Math.pow(this.interpretOne(stmt.left),this.interpretOne(stmt.right))
			}
		}else if (stmt instanceof Expr.Literal){
			return stmt.value.literal
		}else if (stmt instanceof Expr.Grouping){
			return this.interpretOne(stmt.expression)
		}else if (stmt instanceof Expr.Unary){
			if (stmt.operator.type === MINUS){
				return -1 * this.interpretOne(stmt.right)
			}
		}
	}
}