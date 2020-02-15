export class Expression {
    constructor(expression) {
        this.expression = expression;
    }
}
export class Function {
    constructor(name, params, body) {
        this.name = name;
        this.params = params;
        this.body = body;
    }
}
export class Var {
    constructor(name, initializer) {
        this.name = name;
        this.initializer = initializer;
    }
}
export class Import {
    constructor(imports, source) {
        this.imports = imports;
        this.source = source;
    }
}
export default class Stmt {
}
Stmt.Expression = Expression;
Stmt.Function = Function;
Stmt.Var = Var;
Stmt.Import = Import;
