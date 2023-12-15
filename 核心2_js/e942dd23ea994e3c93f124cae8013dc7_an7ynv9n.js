let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let oriSum = param.data[0].oriSum;
    let config = extrequire("SCMSA.saleOrderRule.config").execute();
    let nccUrl = config.nccUrl;
    let sendata = [];
    var accessToken;
    param.data.forEach((selfdata) => {
      // 获取...数据请求参数
      let timestamp = new Date(selfdata.vouchdate);
      let headParam = {
        pk_org: selfdata.accentity_code,
        billno: selfdata["headfree!define1"],
        billdate: timestamp.toLocaleDateString().replace(/\//g, "-") + " " + timestamp.toTimeString().substr(0, 8),
        customer: selfdata.customer_code,
        money: selfdata.oriSum,
        local_money: selfdata.natSum,
        pk_balatype: selfdata.settlemode_code,
        recaccount: selfdata.enterprisebankaccount_code
      };
      let senbodydata = [];
      let details = selfdata.PayBillb;
      details.forEach((bodydata) => {
        let customer_code = getMerchant({
          id: bodydata.customer
        }).code;
        let prepayName = bodydata.quickTypeCode == 2 ? "应收款" : bodydata.quickTypeCode == 1 ? "预收款" : bodydata.quickTypeCode;
        senbodydata.push({
          customer: getMerchant({
            id: bodydata.customer
          }).code,
          prepay: prepayName,
          money_cr: bodydata.oriSum,
          local_money_cr: bodydata.natSum
        });
      });
      sendata.push({
        head: headParam,
        body: senbodydata
      });
    });
    // 获取...数据
    let nccOtherData = getNccData(sendata);
    function getMerchant(params) {
      // 响应信息
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        // 转为JSON对象
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询客户档案详情 " + e);
      }
      return result.data;
    }
    function getNccData(params) {
      let strResponse = postman("post", nccUrl + "/servlet/BipToNccGatherbillServlet", null, JSON.stringify(params));
      try {
        strResponse = JSON.parse(strResponse);
        if (strResponse[0].code !== "200" && strResponse[0].code !== 200) {
          throw new Error(strResponse[0].msg);
        }
      } catch (e) {
        throw new Error("推送NCC收款单失败 " + e);
      }
      return strResponse.code;
    }
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
  }
}
exports({ entryPoint: MyTrigger });