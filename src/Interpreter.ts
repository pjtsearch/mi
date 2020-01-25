import Token from "./Token.ts"
import TokenType,{keywords} from "./TokenType.ts"
import Expr from "./Expr.ts"
import Stmt from "./Stmt.ts"
import debug from "./debug.ts"
import Environment from "./Environment.ts"

let {NUMBER,VARIABLE,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,SIN,COS,TAN} = TokenType

export default class Interpreter {
	globals:Environment = new Environment(); 
	environment:Environment = this.globals
	statements:Stmt[]
	constructor(statements:Stmt[]){
		this.statements = statements
	}
	interpret(){
		this.statements.forEach(statement=>debug(this.interpretOne(statement)))
	}
	interpretOne(stmt:Stmt,environment:Environment=this.globals){
		//debug("typeof expr: ",typeof expr)
		if (stmt instanceof Stmt.Expression){
			return this.interpretOne(stmt.expression,environment)
		}else if (stmt instanceof Stmt.Var){
			let value = null
			if (stmt.initializer){
				value = this.interpretOne(stmt.initializer,environment);  
			}
			environment.define(stmt.name.lexeme, value)
			return null
		//FIX: Make a class or something
		}else if (stmt instanceof Stmt.Function){
			environment.define(stmt.name.lexeme, stmt)
			return null
		//FIX: make more robust
		}else if (stmt instanceof Expr.Call){
			// @ts-ignore
			//console.log(environment.get("f"))
			// @ts-ignore
			const funct = <Stmt.Function> environment.get(stmt.callee.name)
			let functEnvironmet = new Environment(environment)
			stmt.args.forEach((arg,i)=>functEnvironmet.define(funct.params[i].lexeme,this.interpretOne(arg)))
			return this.interpretOne(funct.body,functEnvironmet)
		}else if (stmt instanceof Expr.Variable){
			return environment.get(stmt.name);
		}else if (stmt instanceof Expr.Binary){
			if (stmt.operator.type === PLUS){
				return this.interpretOne(stmt.left,environment)+this.interpretOne(stmt.right,environment)
			}else if (stmt.operator.type === MINUS){
				return this.interpretOne(stmt.left,environment)-this.interpretOne(stmt.right,environment)
			}else if (stmt.operator.type === STAR){
				return this.interpretOne(stmt.left,environment)*this.interpretOne(stmt.right,environment)
			}else if (stmt.operator.type === SLASH){
				return this.interpretOne(stmt.left,environment)/this.interpretOne(stmt.right,environment)
			}else if (stmt.operator.type === CIRCUMFLEX){
				return Math.pow(this.interpretOne(stmt.left,environment),this.interpretOne(stmt.right,environment))
			}
		}else if (stmt instanceof Expr.Literal){
			return stmt.value.literal
		}else if (stmt instanceof Expr.Grouping){
			return this.interpretOne(stmt.expression,environment)
		}else if (stmt instanceof Expr.Unary){
			if (stmt.operator.type === MINUS){
				return -1 * this.interpretOne(stmt.right,environment)
			}
		}
	}
}