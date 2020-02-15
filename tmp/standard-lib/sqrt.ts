 import Callable from "../Callable"
 import Stmt from "../Stmt"
 import Environment from "../Environment"
 import Interpreter from "../Interpreter"

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