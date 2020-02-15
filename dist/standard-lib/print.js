class Print {
    call(interpreter, args, environment) {
        console.log(...args);
        return null;
    }
}
export default {
    name: "mi:print",
    exports: {
        print: new Print()
    }
};
