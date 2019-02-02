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
function tokenizer(input) {
  return input;
}

module.exports = tokenizer;
