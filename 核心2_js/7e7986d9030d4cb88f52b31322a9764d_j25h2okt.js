let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT101792AT1.common.getApiToken");
    let res = func1.execute(null);
    var token = res.access_token;
    let func2 = extrequire("GT101792AT1.common.getGatewayUrl");
    let res2 = func2.execute(null);
    var gatewayUrl = res2.gatewayUrl;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let body = {};
    //调用YS现存量接口获取数据
    let getsdUrl = gatewayUrl + "/yonbip/scm/transferapply/detail?access_token=" + token + "&id=" + param;
    var apiResponse = postman("GET", getsdUrl, JSON.stringify(header), null);
    let result = JSON.parse(apiResponse);
    if (result.code == "200") {
      body = result.data;
    }
    return { body };
  }
}
exports({ entryPoint: MyTrigger });