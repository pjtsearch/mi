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
export default {
    name: "mi:trig",
    exports: {
        sin: new Sin(),
        cos: new Cos(),
        tan: new Tan(),
    }
};
