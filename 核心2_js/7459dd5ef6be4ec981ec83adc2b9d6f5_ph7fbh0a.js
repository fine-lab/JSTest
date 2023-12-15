let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取数据中心url
    let funcUrl = extrequire("ST.sf.gateWayUrl");
    let urlRes = funcUrl.execute(null);
    var gatewayUrl = urlRes.gatewayUrl;
    //获取Token
    let funcToken = extrequire("ST.sf.getYsToken");
    let tokenRes = funcToken.execute(null);
    var token = tokenRes.access_token;
    var updateUrl = gatewayUrl + "/yonbip/scm/salesout/single/update?access_token=" + token;
    let header = { "Content-Type": "application/json;charset=UTF-8" };
    let resubmitCheckKey = replace(uuid(), "-", "");
    var bodyData = {
      resubmitCheckKey: resubmitCheckKey,
      _status: "Update",
      id: request.id,
      headDefine: {
        id: request.id,
        _status: "Update",
        define2: request.tracknum //快递单号
      }
    };
    let body = { data: bodyData };
    var strResponse = postman("POST", updateUrl, JSON.stringify(header), JSON.stringify(body));
    var responseObj = JSON.parse(strResponse);
    if (responseObj.code != 200) {
      throw new Error("回更快递单号出错：" + responseObj.message);
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });