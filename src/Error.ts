import Token from "./Token.ts"

export class BaseError {
	constructor(type:string,message:string,line?:number,column?:number,source?:string){
		console.error(`[${type}] ${message} - ${line!==undefined?`${line}`:''}${column!==undefined?`:${column}`:''}
${source ? source.split("\n")[line-1]:""}
${new Array(column).join(" ")}^
${new Array(column-1).join(" ")}Here`)
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

export class ScanError extends BaseError {
	constructor(message:string,line?:number,column?:number,source?:string) {
		super("ScanError",message,line,column,source);
	}
}