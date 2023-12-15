let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT101792AT1.common.getApiToken");
    let res = func1.execute(null, null);
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let url = "https://www.example.com/" + res.access_token + "&id=" + param.id + "&orgId=" + param.orgId;
    var strResponse = postman("get", url, JSON.stringify(header), null);
    let jsonData = JSON.parse(strResponse);
    let data = jsonData.data;
    let record = data;
    return { record };
  }
}
exports({ entryPoint: MyTrigger });