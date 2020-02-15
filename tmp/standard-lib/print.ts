 import Callable from "../Callable"
 import Stmt from "../Stmt"
 import Environment from "../Environment"
 import Interpreter from "../Interpreter"

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