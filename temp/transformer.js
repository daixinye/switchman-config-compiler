function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(function(child) {
      traverserNode(child, parent);
    });
  }

  function traverserNode(node, parent) {
    let method = visitor[node.type];

    if (method) {
      method(node, parent);
    }

    switch (node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;
      case "CallExpression":
        traverseArray(node.params, node);
        break;
      case "NumberLiteral":
        break;
      default:
        throw new TypeError(node.type);
    }
  }
  traverserNode(ast, null);
}

function transformer(AST) {
  const newAST = {
    type: "Program",
    body: []
  };

  AST._context = newAST.body;

  const visitor = {
    Program(node, parent) {
      return node;
    },
    CallExpression(node, parent) {
      let expression = {
        type: "CallExpression",
        callee: {
          type: "Identifier",
          name: node.name
        },
        arguments: []
      };

      node._context = expression.arguments;

      if (parent.type !== "CallExpression") {
        expression = {
          type: "ExpressionStatement",
          expression
        };
      }

      parent._context.push(expression);
    },
    NumberLiteral(node, parent) {
      parent._context.push({
        type: "NumberLiteral",
        value: node.value
      });
    }
  };

  traverser(AST, visitor);

  return newAST;
}

module.exports = transformer;

if (require.main === module) {
  const AST = {
    type: "Program",
    body: [
      {
        type: "CallExpression",
        name: "add",
        params: [
          {
            type: "NumberLiteral",
            value: "2"
          },
          {
            type: "CallExpression",
            name: "subtract",
            params: [
              {
                type: "NumberLiteral",
                value: "4"
              },
              {
                type: "NumberLiteral",
                value: "2"
              }
            ]
          }
        ]
      }
    ]
  };

  console.log(JSON.stringify(transformer(AST), null, 2));
}
