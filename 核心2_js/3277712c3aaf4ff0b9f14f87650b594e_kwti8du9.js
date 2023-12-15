let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var DBid = param.data[0].id;
    let URL = extrequire("GT101792AT1.common.PublicURL");
    let URLData = URL.execute(null, null);
    let func1 = extrequire("ST.api001.getToken"); //获取token
    let res = func1.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "审核";
    //查询调拨订单
    let DBAPIURL = extrequire("ST.rule.DBOrderQuery");
    let DBorderBody = DBAPIURL.execute(null, { DBid: DBid, state: "out", srcBillNO: param.data[0].code });
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    console.log(JSON.stringify(DBorderBody.body));
    let strResponse = postman("post", "https://www.example.com/", JSON.stringify(headers), JSON.stringify(DBorderBody.body));
    console.log(strResponse);
    let str = JSON.parse(strResponse);
    // 打印日志
    let LogBody = {
      data: { code: param.data[0].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
    };
    let LogResponse = postman("post", URLData.URL + "/iuap-api-gateway/kwti8du9/001/al001/RequestLog?access_token=" + token, JSON.stringify(headers), JSON.stringify(LogBody));
    console.log(LogResponse);
    if (str.success != true) {
      throw new Error("调用OMS调出创建API失败！" + str.errorMessage);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });