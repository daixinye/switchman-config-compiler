const tokenizer = require("./tokenizer");
const parser = require("./parser");
const transformer = require("./transformer");
const codeGenerator = require("./codeGenerator");

function compiler(input) {
  const tokens = tokenizer(input);
  const ast = parser(tokens);
  const newAst = transformer(ast);
  const output = codeGenerator(newAst);

  return output;
}

module.exports = compiler;

if (require.main === module) {
  const input = "(add 2 (subtract 4 2))";
  console.log(compiler(input));
}
