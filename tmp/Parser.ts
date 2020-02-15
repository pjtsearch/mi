 import Token from "./Token"
 import TokenType,{keywords} from "./TokenType"
 import Expr from "./Expr"
 import Stmt from "./Stmt"
// import debug from "./debug"
 import OptionsType from "./OptionsType"
 import {ParseError} from "./Error"


let {NUMBER,VARIABLE,STRING,LEFT_PAREN,RIGHT_PAREN,CIRCUMFLEX,STAR,SLASH,PLUS,MINUS,EQUAL,GREATER, GREATER_EQUAL,LESS, LESS_EQUAL,IMPORT,FROM,COMMA,ENTER,EOF} = TokenType

export default class Parser {                                         
  tokens:Token[];                    
  current:number = 0;  
	source:string
	options:OptionsType

  constructor(tokens:Token[],source:string,options:OptionsType) {                         
    this.tokens = tokens;
		this.source = source
		this.options = options
  }                     
  // RULES
  expression():Expr {
    //return this.equality();       
		return this.addition()
  }
	
	statement():Stmt {
		if (this.check(VARIABLE) && this.checkNext(EQUAL)){
			return this.varStatement()
		}else if (this.match(IMPORT)) {
			return this.importStatement();
		}else{
    	return this.expressionStatement();      
		}
  }             
	
	expressionStatement():Stmt {                 
    let expr = this.expression();
		//need peek becuase otherwise returns false becuase EOF
		if (!this.check(ENTER) && this.peek().type != EOF){
			this.error("Expect ENTER or EOF after expression.")
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
			this.error("Expect ENTER or EOF after expression.")
		}else{
			this.advance()
		}
    return new Stmt.Var(name, initializer);
	}
	importStatement():Stmt {
		let imports = []
		if (!this.check(FROM)) {     
			imports.push(this.consume(VARIABLE, "Expect variable name."));
      while (this.match(COMMA)) {                                                            
        imports.push(this.consume(VARIABLE, "Expect variable name."));                                  
      }                                         
    }
		this.consume(FROM,"Expect 'from' in import.")
		let source:Token = this.consume(STRING, "Expect import source.");
		
    if (!this.check(ENTER) && this.peek().type != EOF){
			this.error("Expect ENTER or EOF after expression.")
		}else{
			this.advance()
		}
    return new Stmt.Import(imports,source);  
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
    this.debug(this.current,"addition",expr)
    
    while (this.match(MINUS, PLUS)) {
      let operator:Token = this.previous();                  
      let right:Expr = this.multiplication();
			if (right === undefined) this.error("Expected expression after addition or subtraction.")
      expr = new Expr.Binary(expr, operator, right);
    }                                               

    return expr;                                    
  }                                                 

  multiplication():Expr {                   
    let expr:Expr = this.exponent();                            
    this.debug(this.current,"multiplication",expr)

    while (this.match(SLASH, STAR)) {                    
      let operator:Token = this.previous();                  
      let right:Expr = this.exponent();     
			if (right === undefined) this.error("Expected expression after multiplication or division.")
      expr = new Expr.Binary(expr, operator, right);
    }                   
    
    while (this.check(VARIABLE)) {
      let operator:Token = new Token(STAR, "*", undefined,this.peek().line,this.current);  
      let right:Expr = this.exponent();                         
      expr = new Expr.Binary(expr, operator, right);
    }
    
    while (this.check(LEFT_PAREN)) {
      let operator:Token = new Token(STAR, "*", undefined,this.peek().line,this.current);
      let right:Expr = this.exponent();   
      expr = new Expr.Binary(expr, operator, right);
    }

    return expr;                                    
  }
	
	
	exponent():Expr{
		let expr = this.unary()
		this.debug(this.current,"exponent",expr)
		while (this.match(CIRCUMFLEX)) {
			let left = expr
      let operator:Token = this.previous();                  
      let right:Expr = this.unary();
			if (right === undefined) this.error("Expected expression after exponent.")
      expr = new Expr.Binary(left, operator, right);
    }
		return expr
	}
  
  unary():Expr {   
    this.debug(this.current,"unary")
    
    if (this.match(MINUS)) {           
      let operator:Token = this.previous();           
      let right:Expr = this.unary();       
			if (right === undefined) this.error("Expected expression after unary minus.")
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
			if (!args.every(arg=>arg instanceof Expr.Variable)) this.error("Expected function declaration to have variables as parameters.")
			let body = this.expression()
			if (body === undefined) this.error("Expected expression after function declaration.")
			// @ts-ignore
			return new Stmt.Function(callee.name,args.map(arg=>arg.name),body)
		}else{
			return new Expr.Call(callee, paren, args);     
		}           
  }
  
  primary():Expr {
    if (this.match(NUMBER)) {  
      this.debug(this.current,"primary NUMBER")
      return new Expr.Literal(this.previous());         
    }                 
    
    if (this.match(VARIABLE)) {
      this.debug(this.current,"primary VARIABLE")
      return new Expr.Variable(this.previous());  
    }
		
		if (this.match(STRING)) {   
			this.debug(this.current,"primary STRING")
      return new Expr.Literal(this.previous());         
    }     
		
    if (this.match(LEFT_PAREN)) {                               
      let expr:Expr = this.expression();   
      this.consume(RIGHT_PAREN, "Expect ')' after expression.");
      this.debug(this.current,"primary LEFT_PAREN",expr)
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

    //throw new Error(/*this.peek(), */message);  
		this.error(message)
  }   
  
  error(message:string) {
		//console.log(this.peek())
		throw new ParseError(message,this.peek().line,this.peek().column,this.source)                          
  }   
  
  parse():Stmt[] {                
		let statements:Stmt[] = [];  
    while (!this.isAtEnd()) {                        
      statements.push(this.statement());              
    }

    return statements;
  }    
	debug(...args){
		if (this.options.dev) console.log(...args)
	}
}                                                      
