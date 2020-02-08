# MI
MI is a basic math interpreter written in TypeScript.

## Usage (Deno)
```typescript
import MI from "https://raw.githubusercontent.com/pjtsearch/mi/master/src/index.ts";
let mi = new MI({dev:false});
mi.interpret(`
import print from "mi:print"
q(a,b,c,x)=ax^2+bx+c
f(x)=q(2,3,4,x)
print(f(2))
`);
```

## Instalation (Node)
```bash
yarn add https://github.com/pjtsearch/ts-math-interpreter.git
```

## Usage (Node)
```typescript
const MI = require("mi");
let mi = new MI({dev:false});
mi.interpret(`
import print from "mi:print"
q(a,b,c,x)=ax^2+bx+c
f(x)=q(2,3,4,x)
print(f(2))
`);
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

<!--Please make sure to update tests as appropriate.-->

## License
[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)