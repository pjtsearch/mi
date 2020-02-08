// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// A script preamble that provides the ability to load a single outfile
// TypeScript "bundle" where a main module is loaded which recursively
// instantiates all the other modules in the bundle.  This code is used to load
// bundles when creating snapshots, but is also used when emitting bundles from
// Deno cli.

// @ts-nocheck

/**
 * @type {(name: string, deps: ReadonlyArray<string>, factory: (...deps: any[]) => void) => void=}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let define;

/**
 * @type {(mod: string) => any=}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let instantiate;

/**
 * @callback Factory
 * @argument {...any[]} args
 * @returns {object | void}
 */

/**
 * @typedef ModuleMetaData
 * @property {ReadonlyArray<string>} dependencies
 * @property {(Factory | object)=} factory
 * @property {object} exports
 */

(function() {
  /**
   * @type {Map<string, ModuleMetaData>}
   */
  const modules = new Map();

  /**
   * Bundles in theory can support "dynamic" imports, but for internal bundles
   * we can't go outside to fetch any modules that haven't been statically
   * defined.
   * @param {string[]} deps
   * @param {(...deps: any[]) => void} resolve
   * @param {(err: any) => void} reject
   */
  const require = (deps, resolve, reject) => {
    try {
      if (deps.length !== 1) {
        throw new TypeError("Expected only a single module specifier.");
      }
      if (!modules.has(deps[0])) {
        throw new RangeError(`Module "${deps[0]}" not defined.`);
      }
      resolve(getExports(deps[0]));
    } catch (e) {
      if (reject) {
        reject(e);
      } else {
        throw e;
      }
    }
  };

  define = (id, dependencies, factory) => {
    if (modules.has(id)) {
      throw new RangeError(`Module "${id}" has already been defined.`);
    }
    modules.set(id, {
      dependencies,
      factory,
      exports: {}
    });
  };

  /**
   * @param {string} id
   * @returns {any}
   */
  function getExports(id) {
    const module = modules.get(id);
    if (!module) {
      // because `$deno$/ts_global.d.ts` looks like a real script, it doesn't
      // get erased from output as an import, but it doesn't get defined, so
      // we don't have a cache for it, so because this is an internal bundle
      // we can just safely return an empty object literal.
      return {};
    }
    if (!module.factory) {
      return module.exports;
    } else if (module.factory) {
      const { factory, exports } = module;
      delete module.factory;
      if (typeof factory === "function") {
        const dependencies = module.dependencies.map(id => {
          if (id === "require") {
            return require;
          } else if (id === "exports") {
            return exports;
          }
          return getExports(id);
        });
        factory(...dependencies);
      } else {
        Object.assign(exports, factory);
      }
      return exports;
    }
  }

  instantiate = dep => {
    define = undefined;
    const result = getExports(dep);
    // clean up, or otherwise these end up in the runtime environment
    instantiate = undefined;
    return result;
  };
})();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define("TokenType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TokenType;
    (function (TokenType) {
        //Literals
        TokenType[TokenType["NUMBER"] = 0] = "NUMBER";
        TokenType[TokenType["VARIABLE"] = 1] = "VARIABLE";
        TokenType[TokenType["STRING"] = 2] = "STRING";
        //Operations
        TokenType[TokenType["LEFT_PAREN"] = 3] = "LEFT_PAREN";
        TokenType[TokenType["RIGHT_PAREN"] = 4] = "RIGHT_PAREN";
        TokenType[TokenType["CIRCUMFLEX"] = 5] = "CIRCUMFLEX";
        TokenType[TokenType["STAR"] = 6] = "STAR";
        TokenType[TokenType["SLASH"] = 7] = "SLASH";
        TokenType[TokenType["PLUS"] = 8] = "PLUS";
        TokenType[TokenType["MINUS"] = 9] = "MINUS";
        //Equality
        TokenType[TokenType["EQUAL"] = 10] = "EQUAL";
        TokenType[TokenType["GREATER"] = 11] = "GREATER";
        TokenType[TokenType["GREATER_EQUAL"] = 12] = "GREATER_EQUAL";
        TokenType[TokenType["LESS"] = 13] = "LESS";
        TokenType[TokenType["LESS_EQUAL"] = 14] = "LESS_EQUAL";
        //Keywords
        TokenType[TokenType["IMPORT"] = 15] = "IMPORT";
        TokenType[TokenType["FROM"] = 16] = "FROM";
        //Other
        TokenType[TokenType["COMMA"] = 17] = "COMMA";
        TokenType[TokenType["ENTER"] = 18] = "ENTER";
        TokenType[TokenType["EOF"] = 19] = "EOF";
    })(TokenType || (TokenType = {}));
    exports.default = TokenType;
    /*export let [
      //Literals
      NUMBER,VARIABLE,
      //Operations
      LEFT_PAREN,RIGHT_PAREN,
      CIRCUMFLEX,
      STAR,SLASH,
      PLUS,MINUS,
      //Equality
      EQUAL,
      GREATER, GREATER_EQUAL,
      LESS, LESS_EQUAL,
      //Keywords
      SIN,COS,TAN
    ] = Object.values(TokenType).filter(value=>typeof value === "string")*/
    exports.keywords = {
        import: TokenType.IMPORT,
        from: TokenType.FROM,
    };
});
define("Token", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Token {
        constructor(type, lexeme, literal, line, column) {
            this.type = type;
            this.lexeme = lexeme;
            this.literal = literal;
            this.line = line;
            this.column = column;
        }
        toString() {
            return `${this.type} ${this.lexeme} ${this.literal}`;
        }
    }
    exports.default = Token;
});
define("OptionsType", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("utils/color", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let enabled = true;
    if (typeof Deno === "undefined") {
        enabled = false;
    }
    else {
        if (Deno.noColor === true) {
            enabled = false;
        }
    }
    function setEnabled(value) {
        if (!enabled) {
            return;
        }
        enabled = value;
    }
    exports.setEnabled = setEnabled;
    function getEnabled() {
        return enabled;
    }
    exports.getEnabled = getEnabled;
    function code(open, close) {
        return {
            open: `\x1b[${open}m`,
            close: `\x1b[${close}m`,
            regexp: new RegExp(`\\x1b\\[${close}m`, "g")
        };
    }
    function run(str, code) {
        return enabled
            ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
            : str;
    }
    function reset(str) {
        return run(str, code(0, 0));
    }
    exports.reset = reset;
    function bold(str) {
        return run(str, code(1, 22));
    }
    exports.bold = bold;
    function dim(str) {
        return run(str, code(2, 22));
    }
    exports.dim = dim;
    function italic(str) {
        return run(str, code(3, 23));
    }
    exports.italic = italic;
    function underline(str) {
        return run(str, code(4, 24));
    }
    exports.underline = underline;
    function inverse(str) {
        return run(str, code(7, 27));
    }
    exports.inverse = inverse;
    function hidden(str) {
        return run(str, code(8, 28));
    }
    exports.hidden = hidden;
    function strikethrough(str) {
        return run(str, code(9, 29));
    }
    exports.strikethrough = strikethrough;
    function black(str) {
        return run(str, code(30, 39));
    }
    exports.black = black;
    function red(str) {
        return run(str, code(31, 39));
    }
    exports.red = red;
    function green(str) {
        return run(str, code(32, 39));
    }
    exports.green = green;
    function yellow(str) {
        return run(str, code(33, 39));
    }
    exports.yellow = yellow;
    function blue(str) {
        return run(str, code(34, 39));
    }
    exports.blue = blue;
    function magenta(str) {
        return run(str, code(35, 39));
    }
    exports.magenta = magenta;
    function cyan(str) {
        return run(str, code(36, 39));
    }
    exports.cyan = cyan;
    function white(str) {
        return run(str, code(37, 39));
    }
    exports.white = white;
    function gray(str) {
        return run(str, code(90, 39));
    }
    exports.gray = gray;
    function bgBlack(str) {
        return run(str, code(40, 49));
    }
    exports.bgBlack = bgBlack;
    function bgRed(str) {
        return run(str, code(41, 49));
    }
    exports.bgRed = bgRed;
    function bgGreen(str) {
        return run(str, code(42, 49));
    }
    exports.bgGreen = bgGreen;
    function bgYellow(str) {
        return run(str, code(43, 49));
    }
    exports.bgYellow = bgYellow;
    function bgBlue(str) {
        return run(str, code(44, 49));
    }
    exports.bgBlue = bgBlue;
    function bgMagenta(str) {
        return run(str, code(45, 49));
    }
    exports.bgMagenta = bgMagenta;
    function bgCyan(str) {
        return run(str, code(46, 49));
    }
    exports.bgCyan = bgCyan;
    function bgWhite(str) {
        return run(str, code(47, 49));
    }
    exports.bgWhite = bgWhite;
});
define("Error", ["require", "exports", "utils/color"], function (require, exports, color_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseError {
        constructor(type, message, line, column, source) {
            //if (Deno){
            let err = color_ts_1.bold(color_ts_1.red(`[${type}] `));
            err += `${message} `;
            if (line !== undefined)
                err += color_ts_1.bold(color_ts_1.blue(`${line}`));
            if (column !== undefined)
                err += color_ts_1.bold(color_ts_1.blue(`:${column}`));
            if (source) {
                err += "\n" + source.split("\n")[line - 1];
                err += color_ts_1.bold(color_ts_1.red("\n" + new Array(column).join(" ") + "^"));
                err += color_ts_1.bold(color_ts_1.red("\n" + new Array(column - 1).join(" ") + "Here"));
            }
            console.error(err);
            /*}else{
                let err = `[${type}] `
                err+=`${message} `
                if (line!==undefined) err+=`${line}`
                if (column!==undefined) err+=`:${column}`
                if (source){
                    err+="\n"+source.split("\n")[line-1]
                    err+="\n"+new Array(column).join(" ")+"^"
                    err+="\n"+new Array(column-1).join(" ")+"Here"
                }
            }*/
        }
    }
    exports.BaseError = BaseError;
    class RefError extends BaseError {
        constructor(name) {
            super("RefError", `${name.lexeme} is undefined`, name.line, name.column);
        }
    }
    exports.RefError = RefError;
    class ParseError extends BaseError {
        constructor(message, line, column, source) {
            super("ParseError", message, line, column, source);
        }
    }
    exports.ParseError = ParseError;
    class InterpreterError extends BaseError {
        constructor(message, line, column, source) {
            super("InterpreterError", message, line, column, source);
        }
    }
    exports.InterpreterError = InterpreterError;
    class ScanError extends BaseError {
        constructor(message, line, column, source) {
            super("ScanError", message, line, column, source);
        }
    }
    exports.ScanError = ScanError;
});
define("Environment", ["require", "exports", "Error"], function (require, exports, Error_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Environment {
        constructor(enclosing = null) {
            this.values = new Map();
            this.enclosing = enclosing;
        }
        define(name, value) {
            this.values.set(name, value);
        }
        get(name) {
            if (this.values.has(name.lexeme)) {
                return this.values.get(name.lexeme);
            }
            if (this.enclosing != null)
                return this.enclosing.get(name);
            throw new Error_ts_1.RefError(name);
            //referenceError(name,-1,true)
            //throw new Error(name + " Undefined variable '" + name.lexeme + "'."); 
        }
    }
    exports.default = Environment;
});
define("Expr", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Binary {
        constructor(left, operator, right) {
            this.left = left;
            this.operator = operator;
            this.right = right;
        }
    }
    exports.Binary = Binary;
    class Grouping {
        constructor(expression) {
            this.expression = expression;
        }
    }
    exports.Grouping = Grouping;
    class Literal {
        constructor(value) {
            this.value = value;
        }
    }
    exports.Literal = Literal;
    class Unary {
        constructor(operator, right) {
            this.operator = operator;
            this.right = right;
        }
    }
    exports.Unary = Unary;
    class Variable {
        constructor(name) {
            this.name = name;
        }
    }
    exports.Variable = Variable;
    class Call {
        constructor(callee, paren, args) {
            this.callee = callee;
            //location of parenthesis for errors
            this.paren = paren;
            this.args = args;
        }
    }
    exports.Call = Call;
    class Expr {
    }
    Expr.Binary = Binary;
    Expr.Grouping = Grouping;
    Expr.Literal = Literal;
    Expr.Unary = Unary;
    Expr.Variable = Variable;
    Expr.Call = Call;
    exports.default = Expr;
});
define("Stmt", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Expression {
        constructor(expression) {
            this.expression = expression;
        }
    }
    exports.Expression = Expression;
    class Function {
        constructor(name, params, body) {
            this.name = name;
            this.params = params;
            this.body = body;
        }
    }
    exports.Function = Function;
    class Var {
        constructor(name, initializer) {
            this.name = name;
            this.initializer = initializer;
        }
    }
    exports.Var = Var;
    class Import {
        constructor(imports, source) {
            this.imports = imports;
            this.source = source;
        }
    }
    exports.Import = Import;
    class Stmt {
    }
    exports.default = Stmt;
    Stmt.Expression = Expression;
    Stmt.Function = Function;
    Stmt.Var = Var;
    Stmt.Import = Import;
});
define("Funct", ["require", "exports", "Environment"], function (require, exports, Environment_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Environment_ts_1 = __importDefault(Environment_ts_1);
    class Funct {
        constructor(declaration) {
            this.declaration = declaration;
        }
        call(interpreter, args, environment) {
            let functEnvironment = new Environment_ts_1.default(environment);
            this.declaration.params.forEach((param, i) => functEnvironment.define(param.lexeme, args[i]));
            return interpreter.interpretOne(this.declaration.body, functEnvironment);
        }
    }
    exports.default = Funct;
});
define("Interpreter", ["require", "exports", "TokenType", "Expr", "Stmt", "Environment", "Funct", "Error", "standard-lib/index"], function (require, exports, TokenType_ts_1, Expr_ts_1, Stmt_ts_1, Environment_ts_2, Funct_ts_1, Error_ts_2, index_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    TokenType_ts_1 = __importDefault(TokenType_ts_1);
    Expr_ts_1 = __importDefault(Expr_ts_1);
    Stmt_ts_1 = __importDefault(Stmt_ts_1);
    Environment_ts_2 = __importDefault(Environment_ts_2);
    Funct_ts_1 = __importDefault(Funct_ts_1);
    index_ts_1 = __importDefault(index_ts_1);
    let { NUMBER, VARIABLE, STRING, LEFT_PAREN, RIGHT_PAREN, CIRCUMFLEX, STAR, SLASH, PLUS, MINUS, EQUAL, GREATER, GREATER_EQUAL, LESS, LESS_EQUAL, IMPORT } = TokenType_ts_1.default;
    class Interpreter {
        constructor(statements, source, options) {
            this.globals = new Environment_ts_2.default();
            this.environment = this.globals;
            this.statements = statements;
            this.source = source;
            this.options = options;
        }
        interpret() {
            return this.statements.map(statement => this.interpretOne(statement));
        }
        interpretOne(stmt, environment = this.globals) {
            //debug("typeof expr: ",typeof expr)
            if (stmt instanceof Stmt_ts_1.default.Expression) {
                return this.interpretOne(stmt.expression, environment);
            }
            else if (stmt instanceof Stmt_ts_1.default.Var) {
                let value = null;
                if (stmt.initializer) {
                    value = this.interpretOne(stmt.initializer, environment);
                }
                environment.define(stmt.name.lexeme, value);
                return null;
            }
            else if (stmt instanceof Stmt_ts_1.default.Import) {
                let source = stmt.source.literal;
                let mod = index_ts_1.default.find(module => module.name === source);
                if (!mod)
                    this.error(`Module not found: ${source}`);
                stmt.imports.forEach(imp => {
                    let value = mod.exports[imp.lexeme];
                    if (!value)
                        this.error(`Module not found: ${source} -> ${imp.lexeme}`);
                    environment.define(imp.lexeme, value);
                });
                return null;
            }
            else if (stmt instanceof Stmt_ts_1.default.Function) {
                //environment.define(stmt.name.lexeme, stmt)
                const funct = new Funct_ts_1.default(stmt);
                environment.define(stmt.name.lexeme, funct);
                return null;
            }
            else if (stmt instanceof Expr_ts_1.default.Call) {
                // @ts-ignore
                //console.log(environment.get("f"))
                const callee = this.interpretOne(stmt.callee, environment);
                let args = stmt.args.map(arg => this.interpretOne(arg, environment));
                const funct = callee;
                return funct.call(this, args, environment);
                // @ts-ignore
                //const funct = <Stmt.Function> environment.get(stmt.callee.name)
                //let functEnvironmet = new Environment(environment)
                //stmt.args.forEach((arg,i)=>functEnvironmet.define(funct.params[i].lexeme,this.interpretOne(arg,environment)))
                //return this.interpretOne(funct.body,functEnvironmet)
            }
            else if (stmt instanceof Expr_ts_1.default.Variable) {
                return environment.get(stmt.name);
            }
            else if (stmt instanceof Expr_ts_1.default.Binary) {
                if (stmt.operator.type === PLUS) {
                    return this.interpretOne(stmt.left, environment) + this.interpretOne(stmt.right, environment);
                }
                else if (stmt.operator.type === MINUS) {
                    return this.interpretOne(stmt.left, environment) - this.interpretOne(stmt.right, environment);
                }
                else if (stmt.operator.type === STAR) {
                    return this.interpretOne(stmt.left, environment) * this.interpretOne(stmt.right, environment);
                }
                else if (stmt.operator.type === SLASH) {
                    return this.interpretOne(stmt.left, environment) / this.interpretOne(stmt.right, environment);
                }
                else if (stmt.operator.type === CIRCUMFLEX) {
                    return Math.pow(this.interpretOne(stmt.left, environment), this.interpretOne(stmt.right, environment));
                }
            }
            else if (stmt instanceof Expr_ts_1.default.Literal) {
                return stmt.value.literal;
            }
            else if (stmt instanceof Expr_ts_1.default.Grouping) {
                return this.interpretOne(stmt.expression, environment);
            }
            else if (stmt instanceof Expr_ts_1.default.Unary) {
                if (stmt.operator.type === MINUS) {
                    return -1 * this.interpretOne(stmt.right, environment);
                }
            }
        }
        error(message) {
            //console.log(this.peek())
            throw new Error_ts_2.InterpreterError(message);
        }
        debug(...args) {
            if (this.options.dev)
                console.log(...args);
        }
    }
    exports.default = Interpreter;
});
define("Callable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("standard-lib/print", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Print {
        call(interpreter, args, environment) {
            console.log(...args);
            return null;
        }
    }
    exports.default = {
        name: "mi:print",
        exports: {
            print: new Print()
        }
    };
});
define("standard-lib/trig", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Sin {
        call(interpreter, args, environment) {
            if (typeof args[0] === "number")
                return Math.sin(args[0]);
        }
    }
    class Cos {
        call(interpreter, args, environment) {
            if (typeof args[0] === "number")
                return Math.cos(args[0]);
        }
    }
    class Tan {
        call(interpreter, args, environment) {
            if (typeof args[0] === "number")
                return Math.tan(args[0]);
        }
    }
    exports.default = {
        name: "mi:trig",
        exports: {
            sin: new Sin(),
            cos: new Cos(),
            tan: new Tan(),
        }
    };
});
define("standard-lib/sqrt", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Sqrt {
        call(interpreter, args, environment) {
            if (typeof args[0] === "number")
                return Math.sqrt(args[0]);
        }
    }
    exports.default = {
        name: "mi:sqrt",
        exports: {
            sqrt: new Sqrt()
        }
    };
});
define("standard-lib/index", ["require", "exports", "standard-lib/print", "standard-lib/trig", "standard-lib/sqrt"], function (require, exports, print_ts_1, trig_ts_1, sqrt_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    print_ts_1 = __importDefault(print_ts_1);
    trig_ts_1 = __importDefault(trig_ts_1);
    sqrt_ts_1 = __importDefault(sqrt_ts_1);
    exports.default = [
        print_ts_1.default,
        trig_ts_1.default,
        sqrt_ts_1.default
    ];
});
define("Scanner", ["require", "exports", "Token", "TokenType", "Error", "standard-lib/index"], function (require, exports, Token_ts_1, TokenType_ts_2, Error_ts_3, index_ts_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Token_ts_1 = __importDefault(Token_ts_1);
    TokenType_ts_2 = __importStar(TokenType_ts_2);
    index_ts_2 = __importDefault(index_ts_2);
    let { NUMBER, VARIABLE, STRING, LEFT_PAREN, RIGHT_PAREN, CIRCUMFLEX, STAR, SLASH, PLUS, MINUS, EQUAL, GREATER, GREATER_EQUAL, LESS, LESS_EQUAL, IMPORT, COMMA, ENTER, EOF } = TokenType_ts_2.default;
    class Scanner {
        constructor(source, options) {
            this.tokens = [];
            this.start = 0;
            this.current = 0;
            this.column = 1;
            this.line = 1;
            this.source = source;
            this.options = options;
        }
        scanTokens() {
            while (!this.isAtEnd()) {
                // We are at the beginning of the next lexeme.
                this.start = this.current;
                this.scanToken();
            }
            this.tokens.push(new Token_ts_1.default(EOF, "", null, this.line, this.column));
            return this.tokens;
        }
        isAtEnd() {
            return this.current >= this.source.length;
        }
        scanToken() {
            let char = this.advance();
            switch (char) {
                case '(':
                    this.addToken(LEFT_PAREN);
                    break;
                case ')':
                    this.addToken(RIGHT_PAREN);
                    break;
                case '^':
                    this.addToken(CIRCUMFLEX);
                    break;
                case '*':
                    this.addToken(STAR);
                    break;
                case '/':
                    this.addToken(SLASH);
                    break;
                case '+':
                    this.addToken(PLUS);
                    break;
                case '-':
                    this.addToken(MINUS);
                    break;
                case ',':
                    this.addToken(COMMA);
                    break;
                case '=':
                    this.addToken(EQUAL);
                    break;
                case '<':
                    this.addToken(this.match('=') ? LESS_EQUAL : LESS);
                    break;
                case '>':
                    this.addToken(this.match('=') ? GREATER_EQUAL : GREATER);
                    break;
                case '"':
                    this.string();
                    break;
                case '\n':
                    this.column = 1;
                    this.line++;
                    this.addToken(ENTER);
                    break;
                // Ignore whitespace.
                case ' ':
                case '\r':
                case '\t':
                    break;
                default:
                    if (this.isDigit(char)) {
                        this.number();
                    }
                    else if (this.isAlpha(char)) {
                        this.variable();
                    }
                    else {
                        throw new Error_ts_3.ScanError(`Unexpected character: "${char}"`, this.line, this.start + 1, this.source);
                    }
                    break;
            }
        }
        advance() {
            if (this.source.charAt(this.current - 1) !== "\n")
                this.column++;
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
        addToken(type, literal) {
            let text = this.source.substring(this.start, this.current);
            this.tokens.push(new Token_ts_1.default(type, text, literal, this.line, this.column));
        }
        match(expected) {
            if (this.isAtEnd())
                return false;
            if (this.source.charAt(this.current) != expected)
                return false;
            this.current++;
            this.column++;
            return true;
        }
        peek() {
            if (this.isAtEnd())
                return '\0';
            return this.source.charAt(this.current);
        }
        peekNext() {
            if (this.current + 1 >= this.source.length)
                return '\0';
            return this.source.charAt(this.current + 1);
        }
        isDigit(char) {
            return char >= '0' && char <= '9';
        }
        isAlpha(char) {
            return (char >= 'a' && char <= 'z') ||
                (char >= 'A' && char <= 'Z');
        }
        number() {
            while (this.isDigit(this.peek()))
                this.advance();
            // Look for a decimal part.                            
            if (this.peek() == '.' && this.isDigit(this.peekNext())) {
                // Consume the "."                                      
                this.advance();
                while (this.isDigit(this.peek()))
                    this.advance();
            }
            this.addToken(NUMBER, Number(this.source.substring(this.start, this.current)));
        }
        variable() {
            // To check if it is keyword
            let connected = "";
            let i = this.start;
            while (this.isAlpha(this.source.charAt(i))) {
                connected += this.source.charAt(i);
                i++;
            }
            let standardLibExports = index_ts_2.default.map(mod => Object.keys(mod.exports)).flat();
            //advance it
            if (Object.keys(TokenType_ts_2.keywords).includes(connected) || standardLibExports.includes(connected)) {
                while (this.isAlpha(this.peek()))
                    this.advance();
            }
            let text = this.source.substring(this.start, this.current);
            let type = TokenType_ts_2.keywords[text];
            if (type == undefined)
                type = VARIABLE;
            this.addToken(type);
        }
        string() {
            while (this.peek() != '"' && !this.isAtEnd()) {
                if (this.peek() == '\n')
                    this.line++;
                this.advance();
            }
            // Unterminated string.                                 
            if (this.isAtEnd()) {
                throw new Error_ts_3.ScanError(`Unterminated string`, this.line, this.start + 1, this.source);
                return;
            }
            // The closing ".                                       
            this.advance();
            // Trim the surrounding quotes.                         
            let value = this.source.substring(this.start + 1, this.current - 1);
            this.addToken(STRING, value);
        }
        debug(...args) {
            if (this.options.dev)
                console.log(...args);
        }
    }
    exports.default = Scanner;
});
define("Parser", ["require", "exports", "Token", "TokenType", "Expr", "Stmt", "Error"], function (require, exports, Token_ts_2, TokenType_ts_3, Expr_ts_2, Stmt_ts_2, Error_ts_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Token_ts_2 = __importDefault(Token_ts_2);
    TokenType_ts_3 = __importDefault(TokenType_ts_3);
    Expr_ts_2 = __importDefault(Expr_ts_2);
    Stmt_ts_2 = __importDefault(Stmt_ts_2);
    let { NUMBER, VARIABLE, STRING, LEFT_PAREN, RIGHT_PAREN, CIRCUMFLEX, STAR, SLASH, PLUS, MINUS, EQUAL, GREATER, GREATER_EQUAL, LESS, LESS_EQUAL, IMPORT, FROM, COMMA, ENTER, EOF } = TokenType_ts_3.default;
    class Parser {
        constructor(tokens, source, options) {
            this.current = 0;
            this.tokens = tokens;
            this.source = source;
            this.options = options;
        }
        // RULES
        expression() {
            //return this.equality();       
            return this.addition();
        }
        statement() {
            if (this.check(VARIABLE) && this.checkNext(EQUAL)) {
                return this.varStatement();
            }
            else if (this.match(IMPORT)) {
                return this.importStatement();
            }
            else {
                return this.expressionStatement();
            }
        }
        expressionStatement() {
            let expr = this.expression();
            //need peek becuase otherwise returns false becuase EOF
            if (!this.check(ENTER) && this.peek().type != EOF) {
                this.error("Expect ENTER or EOF after expression.");
            }
            else {
                this.advance();
            }
            return new Stmt_ts_2.default.Expression(expr);
        }
        varStatement() {
            let name = this.consume(VARIABLE, "Expect variable name.");
            // advance equal
            this.advance();
            let initializer = this.expression();
            if (!this.check(ENTER) && this.peek().type != EOF) {
                this.error("Expect ENTER or EOF after expression.");
            }
            else {
                this.advance();
            }
            return new Stmt_ts_2.default.Var(name, initializer);
        }
        importStatement() {
            let imports = [];
            if (!this.check(FROM)) {
                imports.push(this.consume(VARIABLE, "Expect variable name."));
                while (this.match(COMMA)) {
                    imports.push(this.consume(VARIABLE, "Expect variable name."));
                }
            }
            this.consume(FROM, "Expect 'from' in import.");
            let source = this.consume(STRING, "Expect import source.");
            if (!this.check(ENTER) && this.peek().type != EOF) {
                this.error("Expect ENTER or EOF after expression.");
            }
            else {
                this.advance();
            }
            return new Stmt_ts_2.default.Import(imports, source);
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
        addition() {
            let expr = this.multiplication();
            this.debug(this.current, "addition", expr);
            while (this.match(MINUS, PLUS)) {
                let operator = this.previous();
                let right = this.multiplication();
                if (right === undefined)
                    this.error("Expected expression after addition or subtraction.");
                expr = new Expr_ts_2.default.Binary(expr, operator, right);
            }
            return expr;
        }
        multiplication() {
            let expr = this.exponent();
            this.debug(this.current, "multiplication", expr);
            while (this.match(SLASH, STAR)) {
                let operator = this.previous();
                let right = this.exponent();
                if (right === undefined)
                    this.error("Expected expression after multiplication or division.");
                expr = new Expr_ts_2.default.Binary(expr, operator, right);
            }
            while (this.check(VARIABLE)) {
                let operator = new Token_ts_2.default(STAR, "*", undefined, this.peek().line, this.current);
                let right = this.exponent();
                expr = new Expr_ts_2.default.Binary(expr, operator, right);
            }
            while (this.check(LEFT_PAREN)) {
                let operator = new Token_ts_2.default(STAR, "*", undefined, this.peek().line, this.current);
                let right = this.exponent();
                expr = new Expr_ts_2.default.Binary(expr, operator, right);
            }
            return expr;
        }
        exponent() {
            let expr = this.unary();
            this.debug(this.current, "exponent", expr);
            while (this.match(CIRCUMFLEX)) {
                let left = expr;
                let operator = this.previous();
                let right = this.unary();
                if (right === undefined)
                    this.error("Expected expression after exponent.");
                expr = new Expr_ts_2.default.Binary(left, operator, right);
            }
            return expr;
        }
        unary() {
            this.debug(this.current, "unary");
            if (this.match(MINUS)) {
                let operator = this.previous();
                let right = this.unary();
                if (right === undefined)
                    this.error("Expected expression after unary minus.");
                return new Expr_ts_2.default.Unary(operator, right);
            }
            return this.functionOrCall();
        }
        functionOrCall() {
            // Only a call if is a variable, so that if its a number it will be multiplied
            let isCalleeVar;
            if (this.check(VARIABLE)) {
                isCalleeVar = true;
            }
            let expr = this.primary();
            if (isCalleeVar) {
                while (true) {
                    if (this.match(LEFT_PAREN)) {
                        expr = this.finishFunctionOrCall(expr);
                    }
                    else {
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
        finishFunctionOrCall(callee) {
            let args = [];
            if (!this.check(RIGHT_PAREN)) {
                args.push(this.expression());
                while (this.match(COMMA)) {
                    args.push(this.expression());
                }
            }
            let paren = this.consume(RIGHT_PAREN, "Expect ')' after arguments.");
            if (this.match(EQUAL)) {
                if (!args.every(arg => arg instanceof Expr_ts_2.default.Variable))
                    this.error("Expected function declaration to have variables as parameters.");
                let body = this.expression();
                if (body === undefined)
                    this.error("Expected expression after function declaration.");
                // @ts-ignore
                return new Stmt_ts_2.default.Function(callee.name, args.map(arg => arg.name), body);
            }
            else {
                return new Expr_ts_2.default.Call(callee, paren, args);
            }
        }
        primary() {
            if (this.match(NUMBER)) {
                this.debug(this.current, "primary NUMBER");
                return new Expr_ts_2.default.Literal(this.previous());
            }
            if (this.match(VARIABLE)) {
                this.debug(this.current, "primary VARIABLE");
                return new Expr_ts_2.default.Variable(this.previous());
            }
            if (this.match(STRING)) {
                this.debug(this.current, "primary STRING");
                return new Expr_ts_2.default.Literal(this.previous());
            }
            if (this.match(LEFT_PAREN)) {
                let expr = this.expression();
                this.consume(RIGHT_PAREN, "Expect ')' after expression.");
                this.debug(this.current, "primary LEFT_PAREN", expr);
                return new Expr_ts_2.default.Grouping(expr);
            }
        }
        // END RULES
        match(...types) {
            for (let i in types) {
                let type = types[i];
                if (this.check(type)) {
                    this.advance();
                    return true;
                }
            }
            return false;
        }
        check(type) {
            if (this.isAtEnd())
                return false;
            return this.peek().type == type;
        }
        checkNext(type) {
            if (this.isAtEnd() || this.isNextAtEnd())
                return false;
            return this.peekNext().type == type;
        }
        advance() {
            if (!this.isAtEnd())
                this.current++;
            return this.previous();
        }
        isAtEnd() {
            return this.peek().type == EOF;
        }
        isNextAtEnd() {
            return this.peekNext().type == EOF;
        }
        peek() {
            return this.tokens[this.current];
        }
        peekNext() {
            return this.tokens[this.current + 1];
        }
        previous() {
            return this.tokens[this.current - 1];
        }
        consume(type, message) {
            if (this.check(type))
                return this.advance();
            //throw new Error(/*this.peek(), */message);  
            this.error(message);
        }
        error(message) {
            //console.log(this.peek())
            throw new Error_ts_4.ParseError(message, this.peek().line, this.peek().column, this.source);
        }
        parse() {
            let statements = [];
            while (!this.isAtEnd()) {
                statements.push(this.statement());
            }
            return statements;
        }
        debug(...args) {
            if (this.options.dev)
                console.log(...args);
        }
    }
    exports.default = Parser;
});
define("index", ["require", "exports", "Scanner", "Parser", "Interpreter"], function (require, exports, Scanner_ts_1, Parser_ts_1, Interpreter_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Scanner_ts_1 = __importDefault(Scanner_ts_1);
    Parser_ts_1 = __importDefault(Parser_ts_1);
    Interpreter_ts_1 = __importDefault(Interpreter_ts_1);
    /*
    if (Deno.args[0] === "ast"){
      var scanner = new Scanner(Deno.args[1])
      var tokens = scanner.scanTokens()
      var parser = new Parser(tokens,Deno.args[1])
    
      let answer = JSON.stringify(parser.parse(),null,1)
        if (Deno.args.includes("--tokens") || Deno.args.includes("-t"))console.log(tokens)
      console.log(answer)
    }else if (Deno.args[0] === "interpret"){
        let scanner = new Scanner(Deno.args[1])
      let tokens = scanner.scanTokens()
      let parser = new Parser(tokens,Deno.args[1])
      let parsed = parser.parse()
        debug(JSON.stringify(parsed,null,1))
        let interpreter = new Interpreter(parsed,Deno.args[1])
        let answer = interpreter.interpret()
    }
    */
    class MI {
        constructor(options) {
            this.options = options;
        }
        scan(source) {
            const scanner = new Scanner_ts_1.default(source, this.options);
            return scanner.scanTokens();
        }
        parse(source) {
            const tokens = this.scan(source);
            const parser = new Parser_ts_1.default(tokens, source, this.options);
            return parser.parse();
        }
        interpret(source) {
            const ast = this.parse(source);
            const interpreter = new Interpreter_ts_1.default(ast, source, this.options);
            return interpreter.interpret();
        }
        interpretExpression(command) {
            const options = { dev: false };
            const scanner = new Scanner_ts_1.default(command, options);
            const tokens = scanner.scanTokens();
            const parser = new Parser_ts_1.default(tokens, command, options);
            const ast = parser.parse();
            const interpreter = new Interpreter_ts_1.default([], "", options);
            return interpreter.interpretOne(ast[0]);
        }
    }
    exports.default = MI;
});

export default instantiate("index").default;
