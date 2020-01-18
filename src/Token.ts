import TokenType from "./TokenType.ts"

export default class Token {                                                     
  type:TokenType;                                           
  lexeme:string;                                            
  literal:Object;

  constructor(type:TokenType, lexeme:string, literal:Object) {
    this.type = type;                                             
    this.lexeme = lexeme;                                         
    this.literal = literal;                                          
  }                                                               

  toString():string {
    return `${this.type} ${this.lexeme} ${this.literal}`
  }                                                               
}            
