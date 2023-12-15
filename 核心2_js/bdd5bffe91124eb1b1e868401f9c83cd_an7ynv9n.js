let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request == undefined || request.agentCode == undefined) {
      throw new Error("agentCode is empty!");
    }
    var accessToken;
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    let agentCodes = getAgentCodes(getPlatformCode(request.agentCode));
    var returnDatas = [];
    agentCodes.forEach((self) => {
      if (self.basecode == request.agentCode) {
        return;
      }
      returnDatas = returnDatas.concat(getMerchantAddress({ code: self.basecode }));
    });
    return { code: 200, data: returnDatas };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function getPlatformCode(agentCode) {
      let req = { code: agentCode };
      let result = postman("post", config.nccUrl + "/servlet/GetCtrlCustCode", "", JSON.stringify(req));
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data.fxscode == undefined || result.data.fxscode == "") {
          throw new Error(`根据客户编码${agentCode}未查询到所属平台`);
        }
      } catch (e) {
        throw new Error("获取所属平台 " + e + ";参数:" + JSON.stringify(req));
      }
      return result.data.fxscode;
    }
    function getAgentCodes(platformCode) {
      let req = { code: platformCode };
      // 响应信息
      let result = postman("post", config.nccUrl + "/servlet/CtrlcustomerQuery", "", JSON.stringify(req));
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.msg);
        } else if (result.data == undefined || result.data.length == 0) {
          return [];
        }
        return result.data;
      } catch (e) {
        throw new Error("根据所属平台管控平台获取所属客户 " + e + ";参数:" + JSON.stringify(req));
      }
    }
    function getMerchantAddress(param) {
      let res = postman("get", "https://www.example.com/" + getAccessToken() + "&code=" + param.code, "", "");
      try {
        res = JSON.parse(res);
        if (res.code != "200") {
          throw new Error(res.message);
        }
        let merchantAddressInfos = res.data.merchantAddressInfos;
        if (merchantAddressInfos != undefined && merchantAddressInfos.length > 0) {
          merchantAddressInfos.forEach((self) => {
            self.agentId = res.data.id;
            self.outSysKey = self.addressCode;
            self.isDefault = false;
            if (self.mergerName != undefined) {
              self.receiveAddress = self.mergerName;
              self.address = self.mergerName;
            } else {
              self.receiveAddress = self.address;
            }
            self.otherAgent = true;
          });
          return merchantAddressInfos;
        } else {
          return [];
        }
      } catch (e) {
        throw new Error("查询客户地址信息 " + e);
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });