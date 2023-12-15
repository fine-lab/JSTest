let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var fhdurl = "https://www.example.com/" + request.access_token;
    strResponse = postman("post", fhdurl, null, JSON.stringify(request.params));
    responseObj = JSON.parse(strResponse);
    if ("200" == responseObj.code) {
      data = responseObj.data.content;
      return {
        pageIndex: 0,
        pageSize: 10,
        isDefault: "true",
        simpleVOs: [
          {
            value1: "2020-11-18 00:00:00",
            value2: "2020-11-20 23:12:38",
            op: "between",
            field: "auditTime"
          }
        ]
      };
    } else {
      return { code: "aaa" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });