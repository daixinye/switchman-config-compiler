function codeGenerator(newAst) {
  let code = JSON.stringify(newAst, null, 2);

  return code;
}

module.exports = codeGenerator;

if (require.main === module) {
  const tokenizer = require("./tokenizer");
  const parser = require("./parser");
  const transformer = require("./transformer");
  const fs = require("fs");
  const input = fs.readFileSync("./.hostsxy.simple", {
    encoding: "utf-8"
  });

  console.log(codeGenerator(transformer(parser(tokenizer(input)))));
}
