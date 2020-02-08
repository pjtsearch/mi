import Token from "./Token.ts"
import TokenType,{keywords} from "./TokenType.ts"
import Expr from "./Expr.ts"
import Stmt from "./Stmt.ts"
//import debug from "./debug.ts"
import OptionsType from "./OptionsType.ts"
import Environment from "./Environment.ts"
import Callable from "./Callable.ts"
import Funct from "./Funct.ts"
import {InterpreterError} from "./Error.ts"
import standardLib from "./standard-lib/index.ts"

let {NUMBER,VARIABLE,STRING,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,IMPORT} = TokenType

export default class Interpreter {
	globals:Environment = new Environment(); 
	environment:Environment = this.globals
	statements:Stmt[]
	source:string
	options:OptionsType
	modules:any[] = standardLib
	constructor(statements:Stmt[],source:string,options:OptionsType){
		this.statements = statements
		this.source = source
		this.options = options
		const modules = options.modules ? options.modules : []
		this.modules = [...modules,...standardLib]
	}
	interpret(){
		return this.statements.map(statement=>this.interpretOne(statement))
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
		}else if (stmt instanceof Stmt.Import){
			let source:string = stmt.source.literal as string;  
			let mod = this.modules.find(module=>module.name===source)
			if (!mod) this.error(`Module not found: ${source}`)
			stmt.imports.forEach(imp=>{
				let value = mod.exports[imp.lexeme]
				if (!value) this.error(`Module not found: ${source} -> ${imp.lexeme}`)
				environment.define(imp.lexeme, value)
			})
			return null
		}else if (stmt instanceof Stmt.Function){
			//environment.define(stmt.name.lexeme, stmt)
			const funct = new Funct(stmt)
			environment.define(stmt.name.lexeme, funct);  
			return null
		}else if (stmt instanceof Expr.Call){
			// @ts-ignore
			//console.log(environment.get("f"))
			const callee = this.interpretOne(stmt.callee,environment)
			let args:Object[] = stmt.args.map(arg=>this.interpretOne(arg,environment))
			const funct:Callable = <Callable> callee;         
    	return funct.call(this, args, environment);
			// @ts-ignore
			//const funct = <Stmt.Function> environment.get(stmt.callee.name)
			//let functEnvironmet = new Environment(environment)
			//stmt.args.forEach((arg,i)=>functEnvironmet.define(funct.params[i].lexeme,this.interpretOne(arg,environment)))
			//return this.interpretOne(funct.body,functEnvironmet)
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
	error(message:string) {
		//console.log(this.peek())
		throw new InterpreterError(message)                          
  }   
	debug(...args){
		if (this.options.dev) console.log(...args)
	}
}