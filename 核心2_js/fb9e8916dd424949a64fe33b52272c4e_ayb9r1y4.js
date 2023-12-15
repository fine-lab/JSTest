let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.branch;
    let func1 = extrequire("GT102917AT3.API.token");
    let res = func1.execute(request);
    let token = res.access_token;
    let reqwlListurl = "https://www.example.com/" + token + "&id=" + id;
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let rst = null;
    let custResponse = postman("GET", reqwlListurl, JSON.stringify(header), JSON.stringify(null));
    let custresponseobj = JSON.parse(custResponse);
    if ("200" == custresponseobj.code) {
      rst = custresponseobj.date;
    }
    return { rst: rst };
  }
}
exports({ entryPoint: MyAPIHandler });