import Environment from "./Environment.ts";
export default class Funct {
    constructor(declaration) {
        this.declaration = declaration;
    }
    call(interpreter, args, environment) {
        let functEnvironment = new Environment(environment);
        this.declaration.params.forEach((param, i) => functEnvironment.define(param.lexeme, args[i]));
        return interpreter.interpretOne(this.declaration.body, functEnvironment);
    }
}
