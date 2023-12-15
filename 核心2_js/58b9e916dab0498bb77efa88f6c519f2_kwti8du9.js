let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var Data = JSON.parse(request.data);
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "保存";
    // 其他出库数据
    let param2 = { data: Data };
    let func = extrequire("ST.rule.INFaterOMS");
    let OutorderData = func.execute(null, param2);
    console.log(JSON.stringify(OutorderData));
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(OutorderData));
    console.log(strResponse);
    let str = JSON.parse(strResponse);
    // 打印日志
    let LogBody = { data: { code: Data.code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType } };
    let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(header), JSON.stringify(LogBody));
    console.log(LogResponse);
    if (str.success != true) {
      throw new Error("调用OMS其他入库确认创建API失败，失败原因：" + str.errorMessage);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });