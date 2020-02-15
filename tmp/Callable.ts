 import Environment from "./Environment"
 import Interpreter from "./Interpreter"

export default interface Callable {
	call(interpreter:Interpreter, args:Object[],environment:Environment):Object;
}