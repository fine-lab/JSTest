let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var tenantId = context != null ? context.tenantId : param.tenantId;
    if (tenantId == null) {
      throw new Error("传入参数不正确！");
    }
    let url = "https://www.example.com/" + tenantId;
    let strResponse = postman("get", url, null, null);
    var strJson = JSON.parse(strResponse);
    if (strJson.code != "00000") {
      throw new Error("获取域名失败：" + strJson.message);
    }
    var domainName = strJson.data;
    return { domainName };
  }
}
exports({ entryPoint: MyTrigger });