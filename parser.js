/*
Input:
```
[ 
  { type: 'hash', value: '#' },
  { type: 'string', value: '这里是注释，也许会有' },
  { type: 'string', value: '空格' },
  { type: 'string', value: '之类的隔开哦' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: '127.0.0.1:8000' },
  { type: 'string', value: 'http://www.daixinye.com/path' },
  { type: 'newline', value: '\n' },
  { type: 'tab', value: '  ' },
  { type: 'string', value: '=Host' },
  { type: 'string', value: 'test.daixinye.com' },
  { type: 'newline', value: '\n' },
  { type: 'tab', value: '  ' },
  { type: 'string', value: '+Cookie' },
  { type: 'string', value: 'hostsxy=true;' } 
]
```
Output:
```
[
  {
    "type": "annotation",
    "value": "这里是注释，也许会有 空格 之类的隔开哦"
  },
  {
    "type": "rule",
    "value": ["127.0.0.1:8000",http://www.daixinye.com/path"]
    }
  },
  {
    "type": "subrule",
    "value": [=host","test.daixinye.com"]
  },
  {
    "type": "subrule",
    "value": ["+cookie", "hostsxy=true;"]
  }
]
```
 */

const OPERATOR = /[+=]/;
function parser(tokens) {
  const ast = [];
  let current = 0;
  let newline = true;

  function walk() {
    let token = tokens[current];

    if (token.type === "newline") {
      newline = true;
      current++;
      return null;
    }

    if (token.type === "hash") {
      let annotation = "";
      token = tokens[++current];
      while (token.type !== "newline" && current < tokens.length) {
        annotation += token.value;
        token = tokens[++current];
      }
      return {
        type: "annotation",
        value: annotation
      };
    }

    if (token.type === "string" && newline) {
      let prev = tokens[current];
      let next = tokens[++current];
      if (next.type === "string") {
        newline = false;
        current++;
        return { type: "rule", value: [prev.value, next.value] };
      } else {
        throw new TypeError(token.type);
      }
    }

    if (token.type === "tab") {
      if (newline) {
        current++;
        let result = walk();
        if (result) {
          result.type = "sub_" + result.type;
        }
        return result;
      } else {
        current++;
        return null;
      }
    }

    throw new TypeError(token.type);
  }

  while (current < tokens.length) {
    let rule = walk();
    rule && ast.push(rule);
  }
  return ast;
}

module.exports = parser;

if (require.main === module) {
  const tokenizer = require("./tokenizer");
  const fs = require("fs");
  const input = fs.readFileSync("./.hostsxy", {
    encoding: "utf-8"
  });

  console.log(parser(tokenizer(input)));
}
