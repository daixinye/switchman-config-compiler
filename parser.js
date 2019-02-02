function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === "number") {
      current++;
      return {
        type: "NumberLiteral",
        value: token.value
      };
    }

    if (token.type === "paren" && token.value === "(") {
      token = tokens[++current];

      var node = {
        type: "CallExpression",
        name: token.value,
        params: []
      };

      token = tokens[++current];

      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        node.params.push(walk());
        token = tokens[current];
      }

      current++;
      return node;
    }
    throw new TypeError(token.type);
  }

  const AST = {
    type: "Program",
    body: []
  };

  while (current < tokens.length) {
    AST.body.push(walk());
  }

  return AST;
}

module.exports = parser;

if (require.main === module) {
  const TOKENS = [
    { type: "paren", value: "(" },
    { type: "name", value: "add" },
    { type: "number", value: "2" },
    { type: "paren", value: "(" },
    { type: "name", value: "subtract" },
    { type: "number", value: "4" },
    { type: "number", value: "2" },
    { type: "paren", value: ")" },
    { type: "paren", value: ")" }
  ];
  const AST = parser(TOKENS);

  console.log(JSON.stringify(AST, null, 2));
}
