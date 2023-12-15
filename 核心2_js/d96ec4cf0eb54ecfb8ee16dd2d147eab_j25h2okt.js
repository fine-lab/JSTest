let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let body = {
      appCode: "beiwei-oms",
      appApiCode: "ys.cancel.clck.order",
      schemeCode: "bw47",
      jsonBody: { outBizOrderCode: param.data[0].code, cancellationType: "删除" }
    };
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(header), JSON.stringify(body));
    let str = JSON.parse(strResponse);
    if (str.success != true) {
      if (str.errorCode != "A1000") {
        throw new Error("调用OMS材料出库取消API失败！" + str.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });