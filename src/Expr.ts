import Token from "./Token.ts"

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
  value:number | string;
  constructor(value:number | string) {
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

class Expr {
  static Binary = Binary;
  static Grouping = Grouping;
  static Literal = Literal;
  static Unary = Unary;
}
export default Expr
