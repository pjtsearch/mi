 enum TokenType {
  //Literals
  NUMBER,VARIABLE,STRING,
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
	IMPORT,FROM,
	//Other
	COMMA,ENTER,EOF
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
  import:TokenType.IMPORT,
  from:TokenType.FROM,
}
