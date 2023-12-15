let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let oriSum = param.data[0].oriSum;
    let config = extrequire("SCMSA.saleOrderRule.config").execute();
    let nccUrl = config.nccUrl;
    // 获取...数据请求参数
    let headParam = {
      pk_org: param.data[0].accentity_name,
      billno: param.data[0].code,
      billdate: param.data[0].vouchdate,
      customer: param.data[0].customer_name,
      money: param.data[0].oriSum,
      local_money: param.data[0].natSum,
      pk_balatype: param.data[0].settlemode_name,
      recaccount: param.data[0].customerbankaccount_bankAccountName
    };
    // 获取...数据
    let nccOtherData = getNccData(bodyParam);
    function getNccData(params) {
      let strResponse = postman("post", nccUrl + "/uapws/rest/bipToNCCGatherbillService/saveAndApprove", null, JSON.stringify(params));
      try {
        strResponse = JSON.parse(strResponse);
        if (strResponse.code !== "200") {
          throw new Error(strResponse.msg);
        }
      } catch (e) {
        throw new Error("获取...数据失败 " + e);
      }
      return strResponse.data;
    }
  }
}
exports({ entryPoint: MyTrigger });