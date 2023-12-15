let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let field = request.field;
    let op = request.op;
    let value = request.value;
    let getToken = extrequire("AT161E5DFA09D00001.apiFunction.getToken");
    let Token = getToken.execute();
    let access_token = Token.access_token;
    let url = "https://www.example.com/" + access_token;
    let body = {
      condition: {
        simpleVOs: [
          {
            field: field,
            op: op,
            value1: value
          }
        ]
      },
      page: {
        pageIndex: 1,
        pageSize: 10
      }
    };
    let header = {};
    let strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(body));
    let Response = JSON.parse(strResponse);
    let recordList = Response.data.recordList;
    let emailList = [];
    recordList.forEach((record) => {
      emailList.push(record.email);
    });
    return { emailList: emailList };
  }
}
exports({ entryPoint: MyAPIHandler });