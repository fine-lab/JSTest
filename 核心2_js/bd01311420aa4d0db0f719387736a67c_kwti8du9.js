let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    // 获取token
    let func123 = extrequire("GT101792AT1.common.getApiToken");
    let res = func123.execute(require);
    let token = res.access_token;
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let Data = { code: "CGDD2311070044", success: true, errorCode: "NULL", errorMessage: "NULL", RequestDate: "2023-11-08 14:12:23", operateType: "审核" };
    // 打印日志
    let LogBody = { data: Data };
    let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
    return {};
  }
}
exports({ entryPoint: MyTrigger });