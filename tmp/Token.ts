 import TokenType from "./TokenType"

export default class Token {                                                     
  type:TokenType;                                           
  lexeme:string;                                            
  literal:Object;
	line:number;
	column:number;

  constructor(type:TokenType, lexeme:string, literal:Object,line:number,column:number) {
    this.type = type;                                             
    this.lexeme = lexeme;                                         
    this.literal = literal;
		this.line = line
		this.column = column
  }                                                               

  toString():string {
    return `${this.type} ${this.lexeme} ${this.literal}`
  }                                                               
}            
