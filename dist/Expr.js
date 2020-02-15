export class Binary {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
export class Grouping {
    constructor(expression) {
        this.expression = expression;
    }
}
export class Literal {
    constructor(value) {
        this.value = value;
    }
}
export class Unary {
    constructor(operator, right) {
        this.operator = operator;
        this.right = right;
    }
}
export class Variable {
    constructor(name) {
        this.name = name;
    }
}
export class Call {
    constructor(callee, paren, args) {
        this.callee = callee;
        //location of parenthesis for errors
        this.paren = paren;
        this.args = args;
    }
}
class Expr {
}
Expr.Binary = Binary;
Expr.Grouping = Grouping;
Expr.Literal = Literal;
Expr.Unary = Unary;
Expr.Variable = Variable;
Expr.Call = Call;
export default Expr;
