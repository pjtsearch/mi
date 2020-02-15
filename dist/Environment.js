import { RefError } from "./Error.ts";
export default class Environment {
    constructor(enclosing = null) {
        this.values = new Map();
        this.enclosing = enclosing;
    }
    define(name, value) {
        this.values.set(name, value);
    }
    get(name) {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }
        if (this.enclosing != null)
            return this.enclosing.get(name);
        throw new RefError(name);
        //referenceError(name,-1,true)
        //throw new Error(name + " Undefined variable '" + name.lexeme + "'."); 
    }
}
