import Callable from "./Callable.ts"
import Stmt,{Function as StmtFunction} from "./Stmt.ts"
import Environment from "./Environment.ts"
import Interpreter from "./Interpreter.ts"

export default class Funct implements Callable {
  declaration:StmtFunction;
  constructor(declaration:StmtFunction) {
    this.declaration = declaration;       
  }                                                             
  call(interpreter:Interpreter, args:Object[],environment:Environment):Object {
		let functEnvironment = new Environment(environment)
		this.declaration.params.forEach((param,i)=>functEnvironment.define(param.lexeme,args[i]))
    return interpreter.interpretOne(this.declaration.body, functEnvironment);                                                       
  }                                                                    
}                      