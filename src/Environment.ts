import Token from "./Token.ts"
export default class Environment {                                          
	values:Map<string, object> = new Map<string, object>();
	enclosing:Environment
	constructor(enclosing:Environment=null) {                     
    this.enclosing = enclosing;                 
  }
	define(name:string, value:object):void {
		this.values.set(name, value);              
	}    
	get(name:Token):Object {                                   
    if (this.values.has(name.lexeme)) {                   
      return this.values.get(name.lexeme);                        
    }
		
		if (this.enclosing != null) return this.enclosing.get(name);

    throw new Error(name + " Undefined variable '" + name.lexeme + "'.");        
  }       
}                                                            