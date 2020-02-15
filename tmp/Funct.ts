 import Callable from "./Callable"
 import Stmt,{Function as StmtFunction} from "./Stmt"
 import Environment from "./Environment"
 import Interpreter from "./Interpreter"

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