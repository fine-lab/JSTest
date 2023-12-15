let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sendDataObj = request.sendDataObj;
    //材料出库保存请求参数
    var sendData = {
      org: sendDataObj.orgId,
      vouchdate: request.nowDay,
      factoryOrg: sendDataObj.orgId,
      warehouse: sendDataObj.warehouId,
      bustype: "A19001",
      _status: "Insert"
    };
    sendData.materOuts = sendDataObj.makeBodyObjs;
    var sendObj = { data: sendData };
    let func = extrequire("AT15F164F008080007.utils.getWayUrl");
    let funcres = func.execute(null);
    var gatewayUrl = funcres.gatewayUrl;
    let url = gatewayUrl + "/yonbip/scm/materialout/save";
    let apiResponse = openLinker("POST", url, "AT15F164F008080007", JSON.stringify(sendObj));
    var apiResJs = JSON.parse(apiResponse);
    var apiCode = apiResJs.code;
    if (apiCode != 200) {
      throw new Error("保存失败，原因：" + apiResJs.message);
    }
    var apiData = apiResJs.data;
    if (apiData.messages.length != 0) {
      throw new Error("保存失败，原因：" + apiData.messages[0]);
    }
    var infor = apiData.infos[0];
    var code = infor.code;
    return { code };
  }
}
exports({ entryPoint: MyAPIHandler });