let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "关闭";
    for (let i = 0; i < param.data.length; i++) {
      let code = param.data[i].code;
      let header = { key: "yourkeyHere" };
      let body = {
        appCode: "beiwei-oms",
        appApiCode: "ys.close.order.dbck",
        schemeCode: "bw47",
        jsonBody: { outBizOrderCode: code, cancellationType: "关闭操作" }
      };
      console.log(JSON.stringify(body));
      let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(body));
      console.log(strResponse);
      let str = JSON.parse(strResponse);
      // 打印日志
      let LogBody = { data: { code: code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType } };
      let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
      console.log(LogResponse);
      if (str.success != true) {
        throw new Error("调用OMS调拨订单关单API失败！" + str.errorMessage);
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });