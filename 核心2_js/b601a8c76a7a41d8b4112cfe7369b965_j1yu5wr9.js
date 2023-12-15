let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rateId = request.rateId;
    let func1 = extrequire("GT46163AT1.backDefaultGroup.getOpenApiToken");
    let res = func1.execute(request);
    var token = res.access_token;
    //根据税率ID税目
    var rateUrl = "https://www.example.com/" + token;
    //获取下游来源单据是否有上游单据
    var contenttype = "application/json;charset=UTF-8";
    var message = "";
    var header = {
      "Content-Type": contenttype
    };
    var raterst = "";
    let rateResponse = postman("GET", rateUrl + "&id=" + rateId, JSON.stringify(header), null);
    let rateresponseobj = JSON.parse(rateResponse);
    if ("200" == rateresponseobj.code) {
      raterst = rateresponseobj.data;
    }
    return { raterst };
  }
}
exports({ entryPoint: MyAPIHandler });