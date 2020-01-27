import Token from "./Token.ts"
import { bgBlue, red, bold, blue, } from "./utils/color.ts";
export class BaseError {
	constructor(type:string,message:string,line?:number,column?:number,source?:string){
		//if (Deno){
			let err = bold(red(`[${type}] `))
			err+=`${message} `
			if (line!==undefined) err+=bold(blue(`${line}`))
			if (column!==undefined) err+=bold(blue(`:${column}`))
			if (source){
				err+="\n"+source.split("\n")[line-1]
				err+=bold(red("\n"+new Array(column).join(" ")+"^"))
				err+=bold(red("\n"+new Array(column-1).join(" ")+"Here"))
			}
			console.error(err)
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

export class RefError extends BaseError {
	constructor(name:Token) {
		super("RefError",`${name.lexeme} is undefined`,name.line,name.column);
	}
}

export class ParseError extends BaseError {
	constructor(message:string,line?:number,column?:number,source?:string) {
		super("ParseError",message,line,column,source);
	}
}

export class InterpreterError extends BaseError {
	constructor(message:string,line?:number,column?:number,source?:string) {
		super("InterpreterError",message,line,column,source);
	}
}

export class ScanError extends BaseError {
	constructor(message:string,line?:number,column?:number,source?:string) {
		super("ScanError",message,line,column,source);
	}
}