let AbstractAPIHandler = require("AbstractAPIHandler");
const ENV_KEY = "yourKEYHere";
const ENY_SEC = "ba2a2bded3a84844baa71fe5a3e59e00";
const HEADER_STRING = JSON.stringify({
  appkey: ENV_KEY,
  appsecret: ENY_SEC
});
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let { org_id, merchant } = request;
    let url = `https://api.diwork.com/yonbip/digitalModel/merchant/queryByPage`;
    let resultJson = ublinker(
      "post",
      url,
      HEADER_STRING,
      JSON.stringify({
        data: "id,code,name,merchantAddressInfos.mergerName,merchantAddressInfos.isDefault,merchantAddressInfos.id,merchantAddressInfos.addressCode",
        page: {
          pageIndex: 1,
          pageSize: 10
        },
        condition: {
          simpleVOs: [
            {
              logicOp: "and",
              conditions: [
                {
                  field: "id",
                  op: "eq",
                  value1: merchant
                },
                {
                  field: "merchantAppliedDetail.merchantApplyRangeId.orgId",
                  op: "eq",
                  value1: org_id
                }
              ]
            }
          ]
        }
      })
    );
    var resultObj = JSON.parse(resultJson);
    if (resultObj.code == 200) {
      resultObj = resultObj.data;
      if (!(resultObj["recordList"] && resultObj["recordList"].length > 0)) {
        throw new Error(`客户${merchant}未找到`);
      }
      return resultObj.recordList[0];
    } else {
      throw new Error(resultObj.message);
    }
  }
}
exports({ entryPoint: MyAPIHandler });