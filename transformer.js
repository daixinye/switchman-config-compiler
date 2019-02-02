/*
Input: 
[ 
  { type: 'annotation', value: '这里是注释，也许会有空格之类的隔开哦' },
  { type: 'rule',
    value: [ '127.0.0.1:8000', 'http://www.daixinye.com/path' ] },
  { type: 'sub_rule', value: [ '=Host', 'test.daixinye.com' ] },
  { type: 'sub_rule', value: [ '+Cookie', 'hostsxy=true;' ] } 
]

Temp Output:
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

Final Output:
[
  {
    "origin": {
      "protocol": "http:",
      "hostname": "www.daixinye.com",
      "path": "/path"
    },
    "target": {
      "hostname": "127.0.0.1",
      "port": "8000",
      "headers": [
        {
          "header": "host",
          "operator": "=",
          "value": "test.daixinye.com"
        },
        {
          "header": "cookie",
          "operator": "+",
          "value": "hostsxy=true;"
        }
      ]
    }
  }
]
*/

const url = require("url");
const OPERATOR = /[+=]/;

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

  newAst = newAst.map(rule => {
    if (rule.origin.indexOf("http") === -1) {
      rule.origin = "all://" + rule.origin;
    }
    const origin = url.parse(rule.origin);
    const target = url.parse(origin.protocol + "//" + rule.target);
    const headers = rule.headers;

    return {
      origin: {
        protocol: origin.protocol === "all:" ? null : origin.protocol,
        hostname: origin.hostname,
        path: origin.path ? origin.path : "/"
      },
      target: {
        hostname: target.hostname,
        port: target.port || 80
      },
      headers: headers.map(subrule => {
        const method = subrule.method;
        const value = subrule.value;

        const operator = method.slice(0, 1);
        const header = method.slice(1);

        if (OPERATOR.test(operator)) {
          return {
            header,
            operator,
            value
          };
        } else {
          throw new TypeError(operator);
        }
      })
    };
  });
  return newAst;
}

module.exports = transformer;

if (require.main === module) {
  const tokenizer = require("./tokenizer");
  const parser = require("./parser");
  const fs = require("fs");
  const input = fs.readFileSync("./.hostsxy.simple", {
    encoding: "utf-8"
  });

  console.log(transformer(parser(tokenizer(input))));
}
