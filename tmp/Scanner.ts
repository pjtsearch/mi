 import Token from "./Token"
 import TokenType,{keywords} from "./TokenType"
 import OptionsType from "./OptionsType"
 import {ScanError} from "./Error"
 import standardLib from "./standard-lib/index"

let {NUMBER,VARIABLE,STRING,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,IMPORT,COMMA,ENTER,EOF} = TokenType

export default class Scanner {   
  source:string;
  tokens:Token[] = [];    
  start:number = 0;                               
  current:number = 0;    
	column:number = 1;
	line:number = 1;  
  options:OptionsType
  modules:any[] = standardLib
  constructor(source:string,options:OptionsType){                              
    this.source = source;            
    this.options = options;
    const modules = options.modules ? options.modules : []
		this.modules = [...modules,...standardLib]
  }
  scanTokens():Token[] {                        
    while (!this.isAtEnd()) {                            
      // We are at the beginning of the next lexeme.
      this.start = this.current;                              
      this.scanToken();                                  
    }
		this.tokens.push(new Token(EOF, "", null, this.line, this.column));    
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
			case ',': this.addToken(COMMA); break;
      case '=': this.addToken(EQUAL); break;    
      case '<': this.addToken(this.match('=') ? LESS_EQUAL : LESS); break;      
      case '>': this.addToken(this.match('=') ? GREATER_EQUAL : GREATER); break;
			case '"': this.string(); break;
			case '\n':        
				this.column = 1
        this.line++;    
				this.addToken(ENTER)
				break;   
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
          throw new ScanError(`Unexpected character: "${char}"`,this.line,this.start+1,this.source);
        }
      break;
    }                                            
  }      
  advance():string {   
		if (this.source.charAt(this.current - 1)!== "\n")this.column++
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

  addToken(type:TokenType, literal?:number | string):void {
    let text:string = this.source.substring(this.start, this.current);      
    this.tokens.push(new Token(type, text, literal, this.line, this.column));    
  }               
  match(expected:string):boolean {                 
    if (this.isAtEnd()) return false;                         
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;  
		this.column++;
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
		// To check if it is keyword
		let connected = ""
		let i = this.start
    while (this.isAlpha(this.source.charAt(i))) {
			connected+=this.source.charAt(i)
			i++
		}
		let standardLibExports = this.modules.map(mod=>Object.keys(mod.exports)).flat()
		//advance it
		if (Object.keys(keywords).includes(connected)||standardLibExports.includes(connected)){	
			while (this.isAlpha(this.peek()))this.advance();
		}
    
    let text:string = this.source.substring(this.start, this.current);

    let type:TokenType = keywords[text];           
    if (type == undefined) type = VARIABLE;           
    this.addToken(type);                      
  } 
	string():void {                                   
    while (this.peek() != '"' && !this.isAtEnd()) {                   
      if (this.peek() == '\n') this.line++;                           
      this.advance();                                            
    }

    // Unterminated string.                                 
    if (this.isAtEnd()) {              
			throw new ScanError(`Unterminated string`,this.line,this.start+1,this.source);
      return;                                               
    }                                                       

    // The closing ".                                       
    this.advance();                                              

    // Trim the surrounding quotes.                         
    let value:string = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(STRING, value);                                
  }                                                         
	debug(...args){
		if (this.options.dev) console.log(...args)
	}
}               
