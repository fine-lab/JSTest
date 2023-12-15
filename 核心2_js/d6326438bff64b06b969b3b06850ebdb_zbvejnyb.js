let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let func1 = extrequire("GT64724AT4.backDefaultGroup.token");
    let res = func1.execute(request);
    let token = res.access_token;
    let id = request.id;
    let reqwlListurl = "https://www.example.com/" + token + "&id=" + id;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let rst = "";
    let custResponse = postman("GET", reqwlListurl, JSON.stringify(header), JSON.stringify(null));
    let custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.data;
    }
    return { rst: rst };
  }
}
exports({ entryPoint: MyAPIHandler });