let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    let body = {
      appCode: "beiwei-ys",
      schemeCode: "bw47",
      appApiCode: "ys.cancel.qtck.interface",
      jsonBody: { outBizOrderCode: param.data[0].code }
    };
    let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(body));
    let str = JSON.parse(strResponse);
    if (str.success != true) {
      if (str.errorCode != "A1000") {
        throw new Error("调用OMS其他出库单取消API失败，失败原因：" + str.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });