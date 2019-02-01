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

  const visitor = {
    Program(node, parent) {
      return node;
    },
    CallExpression(node, parent) {
      return node;
    },
    NumberLiteral(node, parent) {
      return node;
    }
  };

  traverser(AST, visitor);
  console.log(JSON.stringify(AST, null, 2));
}
