export default (...args)=>{
  if (Deno.args.includes("--debug") || Deno.args.includes("-d")){
    console.log(...args)
  }
}
