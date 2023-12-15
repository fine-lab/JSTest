let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("GT101792AT1.common.getApiToken");
    let res = func1.execute(null, null);
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let id = param.id;
    let orgId = param.orgId;
    var strResponse = postman(
      "get",
      "https://www.example.com/" + res.access_token + "&id=" + id + "&orgId=" + orgId,
      JSON.stringify(header),
      null
    );
    let jsonData = JSON.parse(strResponse);
    let data = jsonData.data;
    return { data };
  }
}
exports({ entryPoint: MyTrigger });