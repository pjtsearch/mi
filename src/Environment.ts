import Token from "./Token.ts"
export default class Environment {                                          
	values:Map<string, object> = new Map<string, object>();
	define(name:string, value:object):void {
		this.values.set(name, value);              
	}    
	get(name:Token):Object {                                   
    if (this.values.has(name.lexeme)) {                   
      return this.values.get(name.lexeme);                        
    }

    throw new Error(name + " Undefined variable '" + name.lexeme + "'.");        
  }       
}                                                            