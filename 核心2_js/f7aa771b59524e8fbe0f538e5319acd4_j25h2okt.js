let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取token
    let func123 = extrequire("SCMSA.xs001.getToken");
    let res = func123.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 销售订单详情查询
    let XSDeatil = postman("get", "https://www.example.com/" + token + "&id=" + param, JSON.stringify(headers), null);
    let XSAPI = JSON.parse(XSDeatil);
    if (XSAPI.code == "200") {
      var define = XSAPI.data.headFreeItem.define2;
    } else {
      throw new Error("查询销售订单失败，" + XSAPI.message);
    }
    return { define: define };
  }
}
exports({ entryPoint: MyTrigger });