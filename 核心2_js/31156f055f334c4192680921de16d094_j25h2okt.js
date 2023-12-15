let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return true;
    var DBid = param.data[0].id;
    // 获取token
    let func123 = extrequire("PU.rule.GetToken");
    let res = func123.execute(require);
    let token = res.access_token;
    let GetTime = extrequire("GT101792AT1.common.LastGetTime");
    let GetTimeReturn = GetTime.execute(null, null);
    let operateType = "审核";
    // 查询调拨订单
    let DBAPIURL = extrequire("ST.unit.DBOrderQuery");
    let DBorderBody = DBAPIURL.execute(null, { DBid: DBid, state: "out", srcBillNO: param.data[0].code });
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    let strResponse = postman("post", "http://47.100.73.161:888/api/unified", JSON.stringify(headers), JSON.stringify(DBorderBody.body));
    let uspaceReceiver = ["1a591623-4800-412a-ad38-d0572e7d583a"];
    let channelses = ["uspace"];
    let title = "调拨订单错误预警！";
    let content = "单据编号为：" + param.data[0].code + "，报错节点：" + "审核" + "，报错信息：" + strResponse;
    let messageInfos = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channelses,
      subject: title,
      content: content,
      groupCode: "prewarning"
    };
    let resulte = sendMessage(messageInfos);
    console.log(strResponse);
    let str = JSON.parse(strResponse);
    // 打印日志
    let LogBody = {
      data: { code: param.data[0].code, success: str.success, errorCode: str.errorCode, errorMessage: str.errorMessage, RequestDate: GetTimeReturn.expireDate, operateType: operateType }
    };
    let LogResponse = postman("post", "https://www.example.com/" + token, JSON.stringify(headers), JSON.stringify(LogBody));
    console.log(LogResponse);
    if (str.success != true) {
      throw new Error("调用OMS调出保存失败：" + str.errorMessage);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });