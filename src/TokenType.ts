 enum TokenType {
  //Literals
  NUMBER,VARIABLE,
  //Operations
  LEFT_PAREN,RIGHT_PAREN,
  CIRCUMFLEX,
  STAR,SLASH,
  PLUS,MINUS,
  //Equality
  EQUAL,                             
  GREATER, GREATER_EQUAL,                          
  LESS, LESS_EQUAL,   
  //Keywords
  SIN,COS,TAN,
	 
	EOF
}
export default TokenType

/*export let [
  //Literals
  NUMBER,VARIABLE,
  //Operations
  LEFT_PAREN,RIGHT_PAREN,
  CIRCUMFLEX,
  STAR,SLASH,
  PLUS,MINUS,
  //Equality
  EQUAL,                             
  GREATER, GREATER_EQUAL,                          
  LESS, LESS_EQUAL,   
  //Keywords
  SIN,COS,TAN
] = Object.values(TokenType).filter(value=>typeof value === "string")*/

export let keywords = {
  sin:TokenType.SIN,cos:TokenType.COS,tan:TokenType.TAN
}
