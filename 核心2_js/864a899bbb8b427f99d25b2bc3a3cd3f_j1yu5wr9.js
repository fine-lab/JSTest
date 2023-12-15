let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var rows = request.rows;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    var requrl = "https://www.example.com/" + token;
    //获取下游来源单据是否有上游单据
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var codes = [];
    let result = false;
    for (var i = 0; i < rows.length; i++) {
      var body = "";
      body = {
        pageIndex: "1",
        pageSize: "10",
        isSum: "false",
        simpleVOs: [
          {
            field: "srcBillNO",
            op: "eq",
            value1: rows[i].code
          }
        ]
      };
      var custResponse = postman("POST", requrl, JSON.stringify(header), JSON.stringify(body));
      var custresponseobj = JSON.parse(custResponse);
      if ("200" == custresponseobj.code) {
        let rst = custresponseobj.data;
        if (rst.recordCount > 0) {
          result = true;
          codes.push(rows[i].code);
        }
      }
    }
    return { result: result, codes: codes };
  }
}
exports({ entryPoint: MyAPIHandler });