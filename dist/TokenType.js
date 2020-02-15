var TokenType;
(function (TokenType) {
    //Literals
    TokenType[TokenType["NUMBER"] = 0] = "NUMBER";
    TokenType[TokenType["VARIABLE"] = 1] = "VARIABLE";
    TokenType[TokenType["STRING"] = 2] = "STRING";
    //Operations
    TokenType[TokenType["LEFT_PAREN"] = 3] = "LEFT_PAREN";
    TokenType[TokenType["RIGHT_PAREN"] = 4] = "RIGHT_PAREN";
    TokenType[TokenType["CIRCUMFLEX"] = 5] = "CIRCUMFLEX";
    TokenType[TokenType["STAR"] = 6] = "STAR";
    TokenType[TokenType["SLASH"] = 7] = "SLASH";
    TokenType[TokenType["PLUS"] = 8] = "PLUS";
    TokenType[TokenType["MINUS"] = 9] = "MINUS";
    //Equality
    TokenType[TokenType["EQUAL"] = 10] = "EQUAL";
    TokenType[TokenType["GREATER"] = 11] = "GREATER";
    TokenType[TokenType["GREATER_EQUAL"] = 12] = "GREATER_EQUAL";
    TokenType[TokenType["LESS"] = 13] = "LESS";
    TokenType[TokenType["LESS_EQUAL"] = 14] = "LESS_EQUAL";
    //Keywords
    TokenType[TokenType["IMPORT"] = 15] = "IMPORT";
    TokenType[TokenType["FROM"] = 16] = "FROM";
    //Other
    TokenType[TokenType["COMMA"] = 17] = "COMMA";
    TokenType[TokenType["ENTER"] = 18] = "ENTER";
    TokenType[TokenType["EOF"] = 19] = "EOF";
})(TokenType || (TokenType = {}));
export default TokenType;
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
    import: TokenType.IMPORT,
    from: TokenType.FROM,
};
