 import Callable from "../Callable"
 import Stmt from "../Stmt"
 import Environment from "../Environment"
 import Interpreter from "../Interpreter"

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