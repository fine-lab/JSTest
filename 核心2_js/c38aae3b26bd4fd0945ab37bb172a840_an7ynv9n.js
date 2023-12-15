let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    return { code: 200 };
    var accessToken;
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    if (request === undefined) {
      return;
    }
    request.forEach((self) => {
      let salereturn = vouchersalereturn({ id: self.id });
      if (salereturn.id === undefined) {
        return;
      }
      // 推送OA
      let reqOaParam = {
        docSubject: "退货退款" + salereturn.orderNo,
        fdTemplateId: "yourIdHere",
        docCreator: { LoginName: "lcqdzy001" },
        formValues: {
          salesOrgId_name: salereturn.salesOrgId_name,
          transactionTypeId_name: salereturn.transactionTypeId_name,
          vouchdate: salereturn.vouchdate,
          fd_code: salereturn.orderNo,
          formnumber: "",
          agentId_name: salereturn.agentId_name,
          wholeCar: salereturn["headItem!define3"],
          reasonMemo: salereturn.saleReturnReason,
          jingxiaoshang: salereturn["headItem!define11"],
          fenxiaoshang: salereturn["headItem!define10"],
          fd_detail: {
            "fd_detail.agentProductCode": [],
            "fd_detail.agentProductName": [],
            "fd_detail.orderProductType": [],
            "fd_detail.orderProductUnit": [],
            "fd_detail.subQty": []
          }
        }
      };
      salereturn.saleReturnDetails.forEach((v) => {
        reqOaParam.formValues.fd_detail["fd_detail.agentProductCode"].push(v.productCode);
        reqOaParam.formValues.fd_detail["fd_detail.agentProductName"].push(v.productName);
        reqOaParam.formValues.fd_detail["fd_detail.orderProductType"].push(v.orderProductType);
        reqOaParam.formValues.fd_detail["fd_detail.orderProductUnit"].push(v.productUnitName);
        reqOaParam.formValues.fd_detail["fd_detail.subQty"].push(v.subQty);
      });
      pushOa(reqOaParam);
    });
    return { code: 200 };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function vouchersalereturn(params) {
      // 响应信息
      let result = postman("get", "https://www.example.com/" + getAccessToken() + "&id=" + params.id, "", "");
      try {
        result = JSON.parse(result);
        if (result.code != "200") {
          throw new Error(result.message);
        }
      } catch (e) {
        throw new Error("查询销售退货  " + e);
      }
      return result.data;
    }
    function pushOa(siteData) {
      let appKey = config.busAppKey;
      let appSecret = config.busAppSecret;
      // 请求路径
      let path = "P13_006";
      // 来源
      let source = "P13";
      // 随机字符串 100000 899999
      let nonce = Math.round(Math.random() * 899999 + 100000).toString();
      // 时间戳
      let timestamp = Date.parse(new Date()).toString();
      // 数据
      siteData = JSON.stringify(siteData);
      let httpDataJson = JSON.stringify({
        appKey: appKey,
        data: siteData,
        nonce: nonce,
        path: path,
        source: source,
        timestamp: timestamp
      });
      let signStr = appSecret + httpDataJson + appSecret;
      let sign = MD5Encode(signStr);
      // 封装请求参数
      let reqBody = {
        path: path,
        data: siteData,
        appKey: appKey,
        source: source,
        nonce: nonce,
        timestamp: timestamp,
        sign: sign
      };
      // 响应信息
      let result = postman("post", config.busUrl, "", JSON.stringify(reqBody));
      try {
        // 处理总线返回信息
        result = JSON.parse(result);
        // 返回信息校验
        if (result.code != "200" || result.data === undefined) {
          throw new Error(result.msg);
        }
        // 处理oa返回信息
        if (result.data.success !== true) {
          throw new Error(result.data.message);
        }
      } catch (e) {
        throw new Error("请求oa " + e);
      }
    }
  }
}
exports({ entryPoint: MyAPIHandler });