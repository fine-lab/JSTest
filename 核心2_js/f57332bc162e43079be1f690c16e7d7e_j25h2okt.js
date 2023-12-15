let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let Data = JSON.parse(request.data);
    let insertorUpdate = request.insertorUpdate;
    if (insertorUpdate == "Update") {
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      let body = {
        appCode: "beiwei-ys",
        schemeCode: "bw47",
        appApiCode: "ys.cancel.qtrk.interface",
        jsonBody: { outBizOrderCode: Data.code }
      };
      let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(body));
      console.log(JSON.stringify(strResponse));
      let str = JSON.parse(strResponse);
      if (str.success != true) {
        if (str.errorCode != "A1000") {
          throw new Error("调用OMS其他入库单取消API失败，失败原因：" + str.errorMessage);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });