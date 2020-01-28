import Environment from "./Environment.ts"
import Interpreter from "./Interpreter.ts"

export default interface Callable {
	call(interpreter:Interpreter, args:Object[],environment:Environment):Object;
}