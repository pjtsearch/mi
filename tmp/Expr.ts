 import Token from "./Token"

export class Binary {
  left:Expr;
  operator:Token;
  right:Expr;
  constructor(left:Expr, operator:Token, right:Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

export class Grouping {
  expression:Expr;
  constructor(expression:Expr) {
    this.expression = expression;
  }
}

export class Literal {
  value:Token;
  constructor(value:Token) {
    this.value = value;
  }
}

export class Unary {
  operator:Token;
  right:Expr;
  constructor(operator:Token, right:Expr) {
    this.operator = operator;
    this.right = right;
  }
}

export class Variable{
	name:Token
	constructor(name:Token) {
		this.name = name;
	}
}

export class Call {       
	callee:Expr;
	paren:Token;
	args:Expr[];
	constructor(callee:Expr, paren:Token,args:Expr[]) {
		this.callee = callee;         
		//location of parenthesis for errors
		this.paren = paren;                                 
		this.args = args;                         
	}                                              
}      

class Expr {
  static Binary = Binary;
  static Grouping = Grouping;
  static Literal = Literal;
  static Unary = Unary;
	static Variable = Variable;
	static Call = Call;
}
export default Expr
