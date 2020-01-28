import Expr from "./Expr.ts"
import Token from "./Token.ts"

export class Expression {
	expression:Expr
	constructor(expression:Expr) {
		this.expression = expression;
	}
}

export class Function {
	name:Token;
	params:Token[];
	body:Stmt
	constructor(name:Token, params:Token[], body:Stmt) {
		this.name = name;
		this.params = params;
		this.body = body;
	}
}     

export class Var {
	name:Token;
	initializer:Expr;
	constructor(name:Token, initializer?:Expr) {
		this.name = name;
		this.initializer = initializer;
	}
}

export class Import {
	imports:Token[];
	source:Token;
	constructor(imports:Token[], source:Token) {
		this.imports = imports;
		this.source = source;
	}
}

export default class Stmt{
	static Expression = Expression
	static Function = Function
	static Var = Var
	static Import = Import
}