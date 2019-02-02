/*
Input: 
[ 
  { type: 'annotation', value: '这里是注释，也许会有空格之类的隔开哦' },
  { type: 'rule',
    value: [ '127.0.0.1:8000', 'http://www.daixinye.com/path' ] },
  { type: 'sub_rule', value: [ '=Host', 'test.daixinye.com' ] },
  { type: 'sub_rule', value: [ '+Cookie', 'hostsxy=true;' ] } 
]

Output:
[
  {
    origin: "http://www.daixinye.com/path",
    target: "127.0.0.1:8000",
    headers: [
      {
        method: "=Host",
        value: "test.daixinye.com"
      },
      {
        method: "+Cookie",
        value: "hostsxy=true;"
      }
    ]
  }
]
*/

function transformer(ast) {
  let newAst = [];

  ast = ast.filter(v => v.type !== "annotation");
  ast.forEach(rule => {
    if (rule.type === "rule") {
      newAst.push([rule]);
    }
    if (rule.type === "sub_rule") {
      newAst[newAst.length - 1].push(rule);
    }
  });
  newAst = newAst.map(rules => {
    let rule = {
      target: rules[0].value[0],
      origin: rules[0].value[1],
      headers: []
    };
    rules.slice(1).forEach(subrule => {
      rule.headers.push({
        method: subrule.value[0],
        value: subrule.value[1]
      });
    });
    return rule;
  });

  return newAst;
}

module.exports = transformer;

if (require.main === module) {
  const tokenizer = require("./tokenizer");
  const parser = require("./parser");
  const fs = require("fs");
  const input = fs.readFileSync("./.hostsxy", {
    encoding: "utf-8"
  });

  console.log(transformer(parser(tokenizer(input))));
}
