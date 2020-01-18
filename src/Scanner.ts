import Token from "./Token.ts"
import TokenType,{keywords} from "./TokenType.ts"

let {NUMBER,VARIABLE,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,SIN,COS,TAN} = TokenType

export default class Scanner {   
  source:string;
  tokens:Token[] = [];    
  start:number = 0;                               
  current:number = 0;                          
  constructor(source:string){                              
    this.source = source;                       
  }
  scanTokens():Token[] {                        
    while (!this.isAtEnd()) {                            
      // We are at the beginning of the next lexeme.
      this.start = this.current;                              
      this.scanToken();                                  
    }
    return this.tokens;                                  
  }    
  isAtEnd():boolean {         
    return this.current >= this.source.length;
  }         
  scanToken():void {                     
    let char:string = this.advance();                          
    switch (char) {                                 
      case '(': this.addToken(LEFT_PAREN); break;     
      case ')': this.addToken(RIGHT_PAREN); break;             
      case '^': this.addToken(CIRCUMFLEX); break;
      case '*': this.addToken(STAR); break;
      case '/': this.addToken(SLASH); break;         
      case '+': this.addToken(PLUS); break;           
      case '-': this.addToken(MINUS); break; 
      case '=': this.addToken(EQUAL); break;    
      case '<': this.addToken(this.match('=') ? LESS_EQUAL : LESS); break;      
      case '>': this.addToken(this.match('=') ? GREATER_EQUAL : GREATER); break;
      // Ignore whitespace.
      case ' ':                                    
      case '\r':                                   
      case '\t':                   
        break;
        
      default:             
        if (this.isDigit(char)) {                          
          this.number();                                
        } else if (this.isAlpha(char)) {                   
          this.variable();                            
        } else {    
          console.error(`Unexpected character: "${char}"`);
        }
      break;
    }                                            
  }      
  advance():string {                               
    this.current++;                                           
    return this.source.charAt(this.current - 1);                   
  }
  //
  //
  //
  //
  // HOW DOES THIS WORK?  DO YOU NEED IT?
  // https://www.craftinginterpreters.com/scanning.html#recognizing-lexemes
  //
  //
  /*addToken(type:TokenType):void {                
    this.addToken(type, null);                                
  }   */                                                   

  addToken(type:TokenType, literal?:Object):void {
    let text:string = this.source.substring(this.start, this.current);      
    this.tokens.push(new Token(type, text, literal));    
  }               
  match(expected:string):boolean {                 
    if (this.isAtEnd()) return false;                         
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;                                           
    return true;                                         
  }        
  peek():string {           
    if (this.isAtEnd()) return '\0';   
    return this.source.charAt(this.current);
  }  
  peekNext():string {                         
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);              
  } 
  isDigit(char:string):boolean {
    return char >= '0' && char <= '9';   
  } 
  isAlpha(char:string):boolean {       
    return (char >= 'a' && char <= 'z') ||      
           (char >= 'A' && char <= 'Z')                
  }
  
  
  
  
  
  number():void {                                     
    while (this.isDigit(this.peek())) this.advance();

    // Look for a decimal part.                            
    if (this.peek() == '.' && this.isDigit(this.peekNext())) {               
      // Consume the "."                                      
      this.advance();                                              

      while (this.isDigit(this.peek())) this.advance();                      
    }                                                         

    this.addToken(NUMBER,Number(this.source.substring(this.start, this.current)));
  }      
  variable():void {                
    while (this.isAlpha(this.peek())) this.advance();
    
    let text:string = this.source.substring(this.start, this.current);

    let type:TokenType = keywords[text];           
    if (type == undefined) type = VARIABLE;           
    this.addToken(type);                      
  }               
}               
