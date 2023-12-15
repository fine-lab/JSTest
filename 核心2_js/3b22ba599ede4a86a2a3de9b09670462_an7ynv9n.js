let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    return;
    var data = param.data[0];
    var accessToken;
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    var rebateAmountDetail = getRebateAmount({ id: data.id });
    nccCustCostApply(rebateAmountDetail);
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function nccCustCostApply(params) {
      let req = {
        currencyCode: getCurrency({ id: params.originalPk }).code,
        orgCode: getOrg({ id: params.salesOrgId }).code,
        customerCode: getMerchant({ id: params.agentId }).code,
        otherSysCode: params.code,
        billdate: params.vouchdate,
        memo: params.memo,
        jtMoney: params.headItem.define1,
        xfMoney: params.rebateMoney
      };
      saveCustCostApply(req);
    }
    function saveCustCostApply(params) {
      let result = postman("post", config.nccUrl + "/servlet/saveCustCostApply", "", JSON.stringify(params));
      try {
        result = JSON.parse(result);
        if (result.code + "" != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("NCC客户费用单 " + e + ";参数:" + JSON.stringify(params));
      }
    }
    function getMerchant(params) {
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        result = JSON.parse(result);
        if (result.code + "" != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询客户档案详情 " + e);
      }
      return result.data;
    }
    function getCurrency(params) {
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询币种信息 " + e + "[" + params.id + "]");
      }
      return result.data;
    }
    function getOrg(params) {
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        result = JSON.parse(result);
        if (result.code + "" != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询组织详情 " + e + "[" + params.id + "]");
      }
      return result.data;
    }
    function getRebateAmount(params) {
      let result = postman("post", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        result = JSON.parse(result);
        if (result.code + "" != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询客户费用-金额详情 " + e);
      }
      return result.data;
    }
  }
}
exports({ entryPoint: MyTrigger });