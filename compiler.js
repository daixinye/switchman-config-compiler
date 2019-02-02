const tokenizer = require("./tokenizer");
const parser = require("./parser");
const transformer = require("./transformer");
const codeGenerator = require("./codeGenerator");

function compiler(input) {
  return codeGenerator(transformer(parser(tokenizer(input))));
}

module.exports = compiler;

if (require.main === module) {
  const fs = require("fs");
  const input = fs.readFileSync("./.hostsxy.simple", {
    encoding: "utf-8"
  });

  console.log(compiler(input));
}
