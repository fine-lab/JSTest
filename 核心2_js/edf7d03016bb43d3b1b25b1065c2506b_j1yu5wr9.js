let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let unit = request.unit;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    let token = res.access_token;
    //根据物料编码查询物料相关信息
    let contenttype = "application/json;charset=UTF-8";
    let message = "";
    let header = {
      "Content-Type": contenttype
    };
    let reqwlurl = "https://www.example.com/" + token + "&id=" + unit;
    let xqrst = "";
    let custxqResponse = postman("GET", reqwlurl, JSON.stringify(header), null);
    let custresxqponseobj = JSON.parse(custxqResponse);
    if ("200" == custresxqponseobj.code) {
      xqrst = custresxqponseobj.data;
    }
    return { xqrst };
  }
}
exports({ entryPoint: MyAPIHandler });