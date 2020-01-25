import Token from "./Token.ts"

export class BaseError extends Error {
	constructor(message:string,line?:number){
		super(`${message}:${line?line:''}`)
	}
}

export class RefError extends BaseError {
	constructor(name:Token) {
		let message = `${name.lexeme} is undefined`
		super(message,name.line);
		this.name = "RefError";
		this.stack = "test"
	}
}