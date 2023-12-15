let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "删除";
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
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
      let str = JSON.parse(strResponse);
      // 打印日志
      let LogBody = {
        data: { code: param.data[i].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
      };
      let LogResponse = postman("post", "https://www.example.com/" + token, JSON.stringify(headers), JSON.stringify(LogBody));
      console.log(LogResponse);
      if (str.success != true) {
        let bodys = {
          appCode: "beiwei-oms",
          appApiCode: "dbck.ys.cancel.interface",
          schemeCode: "bw47",
          jsonBody: { outBizOrderCode: firstupcode }
        };
        console.log(firstupcode);
        let DCResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(bodys));
        console.log(DCResponse);
        let DCData = JSON.parse(DCResponse);
        if (DCData.success != true) {
          if (str.errorCode != "A1000") {
            throw new Error("调用OMS调出单取消API失败！" + DCData.errorMessage);
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });