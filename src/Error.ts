import Token from "./Token.ts"

export class BaseError {
	constructor(type:string,message:string,line?:number,column?:number){
		console.error(`[${type}] ${message} - ${line!==undefined?`${line}`:''}${column!==undefined?`:${column}`:''}`)
	}
}

export class RefError extends BaseError {
	constructor(name:Token) {
		super("RefError",`${name.lexeme} is undefined`,name.line,name.column);
	}
}

export class ParseError extends BaseError {
	constructor(message:string,line?:number,column?:number) {
		super("ParseError",message,line,column);
	}
}