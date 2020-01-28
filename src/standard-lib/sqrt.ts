import Callable from "../Callable.ts"
import Stmt from "../Stmt.ts"
import Environment from "../Environment.ts"
import Interpreter from "../Interpreter.ts"

class Sqrt implements Callable {                                                       
  call(interpreter:Interpreter, args:Object[],environment:Environment):Object {
		if (typeof args[0] === "number")return Math.sqrt(args[0])
  }                                                                    
}       

export default {
	name:"mi:sqrt",
	exports:{
		sqrt:new Sqrt()
	}
}