import Token from "./Token.ts"
import TokenType,{keywords} from "./TokenType.ts"
import Expr from "./Expr.ts"
import Stmt from "./Stmt.ts"
import debug from "./debug.ts"

let {NUMBER,VARIABLE,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,SIN,COS,TAN,COMMA,ENTER,EOF} = TokenType

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
		if (this.check(VARIABLE) && this.checkNext(EQUAL)){
			return this.varStatement()
		}else{
    	return this.expressionStatement();      
		}
  }             
	
	expressionStatement():Stmt {                 
    let expr = this.expression();
		//need peek becuase otherwise returns false becuase EOF
		if (!this.check(ENTER) && this.peek().type != EOF){
			console.error("Expect ENTER or EOF after expression.")
		}else{
			this.advance()
		}
		
    return new Stmt.Expression(expr);                  
  }                
	varStatement():Stmt {
		let name:Token = this.consume(VARIABLE, "Expect variable name.");
		// advance equal
		this.advance()

    let initializer:Expr = this.expression();                                                 

    if (!this.check(ENTER) && this.peek().type != EOF){
			console.error("Expect ENTER or EOF after expression.")
		}else{
			this.advance()
		}
    return new Stmt.Var(name, initializer);
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
    debug(this.current,"unary")
    
    if (this.match(MINUS)) {           
      let operator:Token = this.previous();           
      let right:Expr = this.unary();                  
      return new Expr.Unary(operator, right);
    }
		
		return this.functionOrCall()
  }               
	
	functionOrCall():Expr|Stmt {   
		// Only a call if is a variable, so that if its a number it will be multiplied
		let isCalleeVar;
		if (this.check(VARIABLE)) {
			isCalleeVar = true
		}
    let expr:Expr = this.primary();
		
		if (isCalleeVar){
			while (true) {              
				if (this.match(LEFT_PAREN)) {  
					expr = this.finishFunctionOrCall(expr);
				} else {                  
					break;                  
				}                         
			}    
		}

    return expr;                
  }           
	
	//
	//
	// 
	//FIX: make more robust, with error handling
	//
	//
	//
	finishFunctionOrCall(callee:Expr):Expr|Stmt {                              
    let args:Expr[] = [];                         
    if (!this.check(RIGHT_PAREN)) {     
			args.push(this.expression());
      while (this.match(COMMA)) {                                                            
        args.push(this.expression());                                  
      }                                         
    }

    let paren:Token = this.consume(RIGHT_PAREN, "Expect ')' after arguments.");
		
		if (this.match(EQUAL)) {
			let body = this.expression()
			// @ts-ignore
			return new Stmt.Function(callee.name,args.map(arg=>arg.name),body)
		}else{
			return new Expr.Call(callee, paren, args);     
		}           
  }
  
  primary():Expr {
    if (this.match(NUMBER)) {  
      debug(this.current,"primary NUMBER")
      return new Expr.Literal(this.previous());         
    }                 
    
    if (this.match(VARIABLE)) {
      debug(this.current,"primary VARIABLE")
      return new Expr.Variable(this.previous());  
    }
		
    if (this.match(LEFT_PAREN)) {                               
      let expr:Expr = this.expression();   
      this.consume(RIGHT_PAREN, "Expect ')' after expression.");
      debug(this.current,"primary LEFT_PAREN",expr)
      return new Expr.Grouping(expr);                      
    }         
  }               
  
  // END RULES
  
 
	
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
	
	checkNext(type:TokenType):boolean {
    if (this.isAtEnd() || this.isNextAtEnd()) return false;         
    return this.peekNext().type == type;          
  }    
  
  advance():Token {   
    if (!this.isAtEnd()) this.current++;
    return this.previous();        
  }          
  
  isAtEnd():boolean {      
    return this.peek().type == EOF;     
  }
	
	isNextAtEnd():boolean {      
    return this.peekNext().type == EOF; 
  }

  peek():Token {      
    
    return this.tokens[this.current];    
  }              
	
	peekNext():Token {   
    return this.tokens[this.current+1];    
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
