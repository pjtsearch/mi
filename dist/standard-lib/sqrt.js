class Sqrt {
    call(interpreter, args, environment) {
        if (typeof args[0] === "number")
            return Math.sqrt(args[0]);
    }
}
export default {
    name: "mi:sqrt",
    exports: {
        sqrt: new Sqrt()
    }
};
