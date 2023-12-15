let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    console.log(JSON.stringify(param.data));
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "删除";
    for (let i = 0; i < param.data.length; i++) {
      let headers = { "Content-Type": "application/json;charset=UTF-8" };
      let body = {
        appCode: "beiwei-oms",
        appApiCode: "dbrk.ys.outbound.interface",
        schemeCode: "bw47",
        jsonBody: { outBizOrderCode: param.data[i].code }
      };
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(body));
      console.log(strResponse);
      let str = JSON.parse(strResponse);
      // 打印日志
      let LogBody = {
        data: { code: param.data[i].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
      };
      let LogResponse = postman("post", "https://www.example.com/" + token, JSON.stringify(headers), JSON.stringify(LogBody));
      console.log(LogResponse);
      if (str.success != true) {
        if (str.errorCode != "A1000") {
          throw new Error("调用OMS调入单取消API失败！" + str.errorMessage);
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });