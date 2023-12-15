let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    let token = res.access_token;
    //获取门店
    var body = {
      pageSize: 1000,
      pageIndex: 1
    };
    var reqwlurl = "https://www.example.com/" + token;
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    let rst = "";
    var custResponse = postman("POST", reqwlurl, JSON.stringify(header), JSON.stringify(body));
    var custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    return { rst: rst };
  }
}
exports({ entryPoint: MyAPIHandler });