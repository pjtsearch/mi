# MI
MI is a basic math interpreter written in TypeScript.
## Example
```
import MI from "https://raw.githubusercontent.com/pjtsearch/mi/master/src/index.ts";
let mi = new MI({dev:false});
mi.interpret(`
import print from "mi:print"
q(a,b,c,x)=ax^2+bx+c
f(x)=q(2,3,4,x)
print(f(2))
`);
```