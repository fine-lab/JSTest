let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return true;
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "删除";
    let body = {
      appCode: "beiwei-oms",
      appApiCode: "ys.cancel.clck.order",
      schemeCode: "bw47",
      jsonBody: { outBizOrderCode: param.data[0].code }
    };
    console.log(JSON.stringify(body));
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
    console.log(strResponse);
    let str = JSON.parse(strResponse);
    // 打印日志
    let LogBody = {
      data: { code: param.data[0].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
    };
    let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
    console.log(LogResponse);
    if (str.success != true) {
      if (str.errorCode != "A1000") {
        throw new Error("调用OMS材料出库取消API失败！" + str.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });