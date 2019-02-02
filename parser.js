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
    "value": {
      "target": "127.0.0.1:8000",
      "origin": "http://www.daixinye.com/path",
      "headers": [
        {
          "operator": "=",
          "name": "host",
          "value": "test.daixinye.com"
        },
        {
          "operator": "+",
          "name": "cookie",
          "value": "hostsxy=true;"
        }
      ]
    }
  }
]
```
 */

function parser(tokens) {
  const ast = {};

  return ast;
}

module.exports = parser;

if (require.main === module) {
  const tokenizer = require("./tokenizer");
  const fs = require("fs");
  const input = fs.readFileSync("./.hostsxy.simple", {
    encoding: "utf-8"
  });

  console.log(parser(tokenizer(input)));
}
