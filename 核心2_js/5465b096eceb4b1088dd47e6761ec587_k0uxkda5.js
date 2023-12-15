let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询转库单列表URL
    let listqueryurl = "https://www.example.com/";
    let billcode = request.billcode;
    let bodys = {
      pageSize: 10,
      pageIndex: 1,
      simpleVOs: [
        {
          value1: billcode,
          op: "eq",
          field: "defines.define1",
          value2: ""
        }
      ]
    };
    let apiResponse = openLinker("POST", listqueryurl, "SCMSA", JSON.stringify(bodys));
    return JSON.parse(apiResponse);
  }
}
exports({ entryPoint: MyAPIHandler });