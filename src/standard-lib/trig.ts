import Callable from "../Callable.ts"
import Stmt from "../Stmt.ts"
import Environment from "../Environment.ts"
import Interpreter from "../Interpreter.ts"

class Sin implements Callable {                                                       
  call(interpreter:Interpreter, args:Object[],environment:Environment):Object {
		if (typeof args[0] === "number")return Math.sin(args[0])
  }                                                                    
}       

class Cos implements Callable {                                                       
  call(interpreter:Interpreter, args:Object[],environment:Environment):Object {
		if (typeof args[0] === "number")return Math.cos(args[0])
  }                                                                    
}     

class Tan implements Callable {                                                       
  call(interpreter:Interpreter, args:Object[],environment:Environment):Object {
		if (typeof args[0] === "number")return Math.tan(args[0])
  }                                                                    
}     

export default {
	name:"mi:trig",
	exports:{
		sin:new Sin(),
		cos:new Cos(),
		tan:new Tan(),
	}
}