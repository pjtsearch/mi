import TokenType from "./TokenType.ts"

export default class Token {                                                     
  type:TokenType;                                           
  lexeme:string;                                            
  literal:number | string;

  constructor(type:TokenType, lexeme:string, literal:number | string) {
    this.type = type;                                             
    this.lexeme = lexeme;                                         
    this.literal = literal;                                          
  }                                                               

  toString():string {
    return `${this.type} ${this.lexeme} ${this.literal}`
  }                                                               
}            
