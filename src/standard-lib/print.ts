import Callable from "../Callable.ts"
import Stmt from "../Stmt.ts"
import Environment from "../Environment.ts"
import Interpreter from "../Interpreter.ts"

class Print implements Callable {                                                       
  call(interpreter:Interpreter, args:Object[],environment:Environment):Object {
		console.log(...args)
		return null
  }                                                                    
}       

export default {
	name:"mi:print",
	exports:{
		print:new Print()
	}
}