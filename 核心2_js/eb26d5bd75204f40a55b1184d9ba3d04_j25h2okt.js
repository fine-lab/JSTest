let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    for (let i = 0; i < param.data.length; i++) {
      let details = param.data[i].details;
      var firstupcode = details[0].firstupcode;
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      let body = {
        appCode: "beiwei-oms",
        appApiCode: "dbck.ys.cancel.interface",
        schemeCode: "bw47",
        jsonBody: { outBizOrderCode: param.data[i].code }
      };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        let bodys = {
          appCode: "beiwei-oms",
          appApiCode: "dbck.ys.cancel.interface",
          schemeCode: "bw47",
          jsonBody: { outBizOrderCode: firstupcode }
        };
        let DCResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(bodys));
        let DCData = JSON.parse(DCResponse);
        if (DCData.success != true) {
          throw new Error("调用OMS调出单取消API失败！" + DCData.errorMessage);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });