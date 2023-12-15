let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (request === undefined || request.code === undefined) {
      throw new Error("编码不能为空");
    }
    var accessToken;
    // 配置文件
    var config = extrequire("SCMSA.saleOrderRule.config").execute();
    const saleReturnList = saleReturnByCode({ code: request.code });
    if (saleReturnList === undefined || saleReturnList.id === undefined) {
      throw new Error("根据[" + request.code + "]未查询到销售退货单!");
    }
    const salereturn = saleReturnById({ id: saleReturnList.id });
    if (salereturn.id === undefined) {
      throw new Error("根据[" + request.code + "]未查询到销售退货单详情!");
    }
    // 封装推送OA参数
    let reqOaParam = {
      docSubject: "退货退款" + request.code,
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
        wuliudanhao: salereturn.logisticsBillNo,
        wuliugongsi: salereturn.logisticWayId_name,
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
    // 推送OA
    pushOa(reqOaParam);
    // 原销售订单状态变为OA审核中;
    let writeOrderOaStatus = extrequire("SCMSA.saleOrderRule.writeOrderOaStatus").execute({ code: salereturn.orderNo, status: 1, type: 4 });
    if (writeOrderOaStatus.code !== 200) {
      throw new Error(writeOrderOaStatus.message);
    }
    return { code: 200, message: "success" };
    function getAccessToken() {
      if (accessToken === undefined) {
        accessToken = extrequire("SCMSA.saleOrderRule.getToken").execute().access_token;
      }
      return accessToken;
    }
    function saleReturnByCode(params) {
      let reqBody = {
        code: params.code,
        pageIndex: "1",
        pageSize: "10",
        isSum: true
      };
      // 响应信息
      let result = postman("post", "https://www.example.com/" + getAccessToken(), "", JSON.stringify(reqBody));
      try {
        result = JSON.parse(result);
        if (result.code != "200" || result.data === undefined) {
          throw new Error(result.message);
        }
        let id = result.data.recordList[0].barCode;
        id = substring(id, 19, id.length);
        result.data.recordList[0].id = id;
      } catch (e) {
        throw new Error("查询销售退货  " + e);
      }
      return result.data.recordList[0];
    }
    function saleReturnById(params) {
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