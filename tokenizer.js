/*
 *  Input:
 *  ```
 *  # 这里是注释，也许会有 空格 之类的隔开哦
 *  127.0.0.1:8000 http://www.daixinye.com/path
 *    =Host test.daixinye.com
 *    +Cookie hostsxy=true;
 *  ```
 *
 *  Output:
 *  ```
 *  [
 *      {type: "hash", value: "#"},
 *      {type: "string", value: "这里是注释，也许会有"},
 *      {type: "string", value: "空格"},
 *      {type: "string", value: "之类的隔开哦"},
 *      {type: "newline", value: "\n"},
 *      {type: "string", value: "127.0.0.1:8000"},
 *      {type: "string", value: "http://www.daixinye.com/path"},
 *      {type: "newline", value: "\n"},
 *      {type: "tab", value:"  "},
 *      {type: "string", "=Host"},
 *      {type: "string", "test.daixinye.com"},
 *      {type: "newline", value: "\n"},
 *      {type: "string", "+Cookie"},
 *      {type: "string", "hostsxy=true;"}
 *  ]
 *  ```
 */

const WHITESPACE = /\s/;
const NEWLINE = /\n/;
const STRING = /[a-zA-Z0-9().:;=+/\u4e00-\u9fa5\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/;

function tokenizer(input) {
  let current = 0;
  const tokens = [];

  while (current < input.length) {
    let char = input[current];

    // hash
    if (char === "#") {
      tokens.push({
        type: "hash",
        value: char
      });
      current++;
      continue;
    }

    // newline
    if (NEWLINE.test(char)) {
      tokens.push({
        type: "newline",
        value: "\n"
      });
      current++;
      continue;
    }

    // whitespace or tab
    if (WHITESPACE.test(char)) {
      nextChar = input[++current];
      if (WHITESPACE.test(nextChar) && current < input.length) {
        tokens.push({
          type: "tab",
          value: "  "
        });
        current++;
        continue;
      } else {
        continue;
      }
    }

    // string
    if (STRING.test(char)) {
      let string = "";
      while (STRING.test(char) && current < input.length) {
        string += char;
        current++;
        char = input[current];
      }
      tokens.push({
        type: "string",
        value: string
      });
      continue;
    }

    throw TypeError(`${current} ${char}`);
  }
  return tokens;
}

module.exports = tokenizer;

if (require.main === module) {
  const fs = require("fs");
  const input = fs.readFileSync("./.hostsxy", {
    encoding: "utf-8"
  });

  console.log(tokenizer(input));
}
