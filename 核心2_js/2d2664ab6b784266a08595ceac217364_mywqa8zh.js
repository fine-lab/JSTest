let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestStr = JSON.stringify(request.prop);
    var res = replace(requestStr, "!", "");
    let product = JSON.parse(res);
    let func1 = extrequire("GT62AT45.backDesignerFunction.getCilentSave");
    let res1 = func1.execute(null, product);
    if (res1.body == undefined) {
      let resultError = {
        strResponses: {
          message: "-- 银行信息未填写，请检查 --"
        }
      };
      return resultError;
    }
    let func2 = extrequire("GT62AT45.backDesignerFunction.sendSap");
    let sapStrResponse = func2.execute(null, res1.body); // null可换SAP接口url地址
    let strResponseJSON = JSON.parse(sapStrResponse.strResponse);
    if (strResponseJSON != null) {
      let flag = strResponseJSON.ZIF_MA_FUNC_002.TABLES.ZIFS_MA002_RETURN[0].MESSAGE_ADD;
      if (flag == 0) {
        let errorMessage = strResponseJSON.ZIF_MA_FUNC_002.TABLES.ZIFS_MA002_RETURN[0].ZMESSAGE;
        throw new Error("-- 客户档案推送SAP保存失败：" + JSON.stringify(errorMessage) + " --");
      } else if (flag == 2) {
        // 修改操作不调用审核
        let strResponseJSONs = JSON.parse(sapStrResponse.strResponse);
        let ZIFS_MA002_RETURN = strResponseJSONs.ZIF_MA_FUNC_002.TABLES.ZIFS_MA002_RETURN[0]; // SAP系统返回数据列表
        let func3 = extrequire("GZTBDM.backDesignerFunction.SapClientAudit");
        let auditStrResponse = func3.execute(null, ZIFS_MA002_RETURN); // 返回值：sap客商编码
        // 拿到sap客商编码，给自定义字段赋
        let func4 = extrequire("GT62AT45.backDesignerFunction.getClientUpdate");
        let res3 = func4.execute(auditStrResponse, product);
        // 获取ys系统token
        let func5 = extrequire("GT62AT45.backDesignerFunction.getYsToken");
        let tokenStr = func5.execute(null, null);
        let token = tokenStr.access_token;
        var contenttype = "application/json;charset=UTF-8";
        var header = {
          "Content-Type": contenttype
        };
        // 调用ys客户档案修改接口：
        let url = "https://www.example.com/" + token;
        var strResponse = postman("post", url, JSON.stringify(header), JSON.stringify(res3.body));
        var strResponses = JSON.parse(strResponse);
        if (strResponses.code != "200") {
          // 更新ys系统客户档案失败：
          throw new Error("-- 更新ys系统客户档案失败：" + JSON.stringify(strResponses.message) + " --");
        }
      }
    } else {
      // 调用接口失败
      throw new Error("-- 调用SAP接口失败 --");
    }
    return { strResponses };
  }
}
exports({ entryPoint: MyAPIHandler });