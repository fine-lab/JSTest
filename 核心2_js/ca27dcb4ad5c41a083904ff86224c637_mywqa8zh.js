let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = request.datum;
    // 根据客户id，查询客户档案维护的SAP客户编码
    let clientId = data.agentId != undefined ? data.agentId : undefined;
    let sql = "select * from aa.merchant.Merchant where id = '" + clientId + "'";
    var res = ObjectStore.queryByYonQL(sql, "productcenter");
    let orgId = res[0].orgId;
    // 调用YS客户档案详情查询接口
    let func2 = extrequire("GT62AT45.backDesignerFunction.getYsToken");
    let res2 = func2.execute(null, null);
    let token = res2.access_token;
    var contenttype = "application/json;charset=UTF-8";
    var header = {
      "Content-Type": contenttype
    };
    let url = "https://www.example.com/" + token + "&id=" + clientId + "&orgId" + orgId;
    var strResponse = postman("get", url, JSON.stringify(header), null);
    let clientData = JSON.parse(strResponse);
    let clientCode = clientData.data.merchantDefine != undefined ? clientData.data.merchantDefine.define1 : undefined;
    if (clientCode == undefined) {
      throw new Error("-- 该客户档案未在SAP系统维护 --");
    }
    // 组装SAP查询客商额度的body请求参数
    let body = {
      funName: "ZIF_QURY_FUNC_002",
      field: {
        IV_VKBUR: "1340", // 部门编码 - 固定值：1340
        IV_KUNNR: clientCode // 客户编码
      }
    };
    let func1 = extrequire("GT62AT45.backDesignerFunction.sendSap");
    let res1 = func1.execute(null, body);
    let strResponses = JSON.parse(res1.strResponse);
    if (res1 != null) {
      if (strResponses.ZIF_QURY_FUNC_002.OUTPUT.TRAN_FLAG == 0) {
        // 查询成功
        var sapClientED = res1.strResponse.ZIF_QURY_FUNC_002.TABLES.ITEMS; // SAP客商额度表数据
      } else {
        // 查询SAP接口失败
        throw new Error("-- 查询SAP接口失败：" + JSON.stringify(strResponses.ZIF_QURY_FUNC_002.OUTPUT.MESSAGE) + " --");
      }
    } else {
      // 查询SAP接口失败
      throw new Error("-- 调用SAP接口失败 --");
    }
    return { sapClientED };
  }
}
exports({ entryPoint: MyAPIHandler });