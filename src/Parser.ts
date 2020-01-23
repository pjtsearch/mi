import Token from "./Token.ts"
import TokenType,{keywords} from "./TokenType.ts"
import Expr from "./Expr.ts"
import Stmt from "./Stmt.ts"
import debug from "./debug.ts"

let {NUMBER,VARIABLE,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,SIN,COS,TAN,ENTER,EOF} = TokenType

export default class Parser {                                         
  tokens:Token[];                    
  current:number = 0;                             

  constructor(tokens:Token[]) {                         
    this.tokens = tokens;                              
  }                     
  // RULES
  expression():Expr {
    //return this.equality();       
		return this.addition()
  }
	
	statement():Stmt {
    return this.expressionStatement();             
  }             
	
	expressionStatement():Stmt {                 
    let expr = this.expression();
		if (this.peek().type !== ENTER){
			if (this.peek().type !== EOF) console.error("Expect ENTER after expression.")
		}else{
			this.consume(ENTER, "Expect ENTER after expression.")
		}
		
    return new Stmt.Expression(expr);                  
  }                                                    
  /*
  // DOES EQUALITY APPLY, SHOULD ONLY USE ASSIGNMENT?
  equality():Expr {                         
    let expr:Expr = this.comparison();
    debug(this.current,"equality",expr)
    
    // ADD BANG EQUAL AGAIN
    while (this.match(EQUAL)) {        
      let operator:Token = this.previous();                  
      let right:Expr = this.comparison();                    
      expr = new Expr.Binary(expr, operator, right);
    }                                               

    return expr;                                    
  }              
  
  comparison():Expr {                                
    let expr:Expr = this.addition();
    debug(this.current,"comparison",expr)
    while (this.match(GREATER, GREATER_EQUAL, LESS, LESS_EQUAL)) {
      let operator:Token = this.previous();                           
      let right:Expr = this.addition();                               
      expr = new Expr.Binary(expr, operator, right);         
    }                                                        

    return expr;                                             
  }        
  */
  addition():Expr {                         
    let expr:Expr = this.multiplication();
    debug(this.current,"addition",expr)
    
    while (this.match(MINUS, PLUS)) {
      let operator:Token = this.previous();                  
      let right:Expr = this.multiplication();
      expr = new Expr.Binary(expr, operator, right);
    }                                               

    return expr;                                    
  }                                                 

  multiplication():Expr {                   
    let expr:Expr = this.exponent();                            
    debug(this.current,"multiplication",expr)

    while (this.match(SLASH, STAR)) {                    
      let operator:Token = this.previous();                  
      let right:Expr = this.exponent();                         
      expr = new Expr.Binary(expr, operator, right);
    }                   
    
    while (this.match(VARIABLE)) {
      let operator:Token = new Token(STAR, "*", undefined,this.peek().line);  
      //reverse to get variable, becuase match advances
      this.current--
      let right:Expr = this.exponent();                         
      expr = new Expr.Binary(expr, operator, right);
    }
    
    while (this.match(LEFT_PAREN)) {
      let operator:Token = new Token(STAR, "*", undefined,this.peek().line);
      this.current--
      let right:Expr = this.exponent();   
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;                                    
  }
	
	
	exponent():Expr{
		let expr = this.unary()
		debug(this.current,"exponent",expr)
		while (this.match(CIRCUMFLEX)) {
			let left = expr
      let operator:Token = this.previous();                  
      let right:Expr = this.unary();
      expr = new Expr.Binary(left, operator, right);
    }
		return expr
	}
  
  unary():Expr {   
		//let expr = this.primary()
    debug(this.current,"unary")
    
    if (this.match(MINUS)) {           
      let operator:Token = this.previous();           
      let right:Expr = this.unary();                  
      return new Expr.Unary(operator, right);
    }
		/*if (this.check(CIRCUMFLEX)) {
			this.current--
			let left = this.primary()
			console.log("exponent",this.current,left)
			this.advance()
      let operator:Token = this.previous();                  
      let right:Expr = this.unary();
      return new Expr.Binary(left, operator, right);
    }*/
		//console.log(this.current++,this.peek())
		//this.current++
		//if (this.tokens[this.current+1].type == CIRCUMFLEX) {
    //return expr; 
		return this.primary()
  }               
  
  primary():Expr {
    if (this.match(NUMBER)) {  
      debug(this.current,"primary NUMBER")
      return new Expr.Literal(this.previous());         
    }                 
    
    if (this.match(VARIABLE)) {
      debug(this.current,"primary VARIABLE")
      return new Expr.Literal(this.previous());  
    }
		
		//let expr = this.unary()
		/*if (this.match(CIRCUMFLEX)) {
			let left = this.expression();
      let operator:Token = this.previous();                  
      let right:Expr = this.unary();
      return new Expr.Binary(left, operator, right);
    }*/
		

    if (this.match(LEFT_PAREN)) {                               
      let expr:Expr = this.expression();   
      this.consume(RIGHT_PAREN, "Expect ')' after expression.");
      debug(this.current,"primary LEFT_PAREN",expr)
      return new Expr.Grouping(expr);                      
    }         
  }               
  
  // END RULES
  
  //
  // WHAT IS THE TYPE OF types
  //      _________________|
  //      |
  //      v
  match(...types:TokenType[]):boolean {
    for (let i in types) {          
      let type:TokenType = types[i]
      if (this.check(type)) {                     
        this.advance();                           
        return true;                         
      }                                      
    }
    return false;                            
  }         
  
  check(type:TokenType):boolean {
    if (this.isAtEnd()) return false;         
    return this.peek().type == type;          
  }                     
  
  advance():Token {   
    if (!this.isAtEnd()) this.current++;
    return this.previous();        
  }          
  //
  //
  //
  //
  //
  // NEED TO FIX THIS; SCANNER DOESN'T HAVE EOF RIGHT NOW
  //
  //                            |
  //                            |
  //                            |
  //                            |
  //                            v
  isAtEnd():boolean {      
    return this.peek().type == EOF;     
    //if (this.current == this.tokens.length) return true;     
    //return false
  }

  peek():Token {      
    //
    //
    // IS THIS RIGHT? SHOULD IT BE current + 1 ?
    //
    //              |
    //              |
    //              v
    return this.tokens[this.current];    
  }                                

  previous():Token {       
    return this.tokens[this.current - 1];
  }       
  
  consume(type:TokenType, message:string):Token {
    if (this.check(type)) return this.advance();

    throw new Error(/*this.peek(), */message);                        
  }   
  
  error(token:Token, message:string) {
    console.error(token, message);                           
    return new Error();                             
  }   
  
  parse():Stmt[] {                
		let statements:Stmt[] = [];  
    while (!this.isAtEnd()) {                        
      statements.push(this.statement());              
    }

    return statements;
  }                             
}                                                      
