let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    // 获取sap客户档案保存body参数：
    let func4 = extrequire("GT62AT45.backDesignerFunction.getCilentSave");
    let res4 = func4.execute(null, param);
    // 调用SAP接口：
    let func1 = extrequire("GT62AT45.backDesignerFunction.sendSap");
    let sapStrResponse = func1.execute(null, res4.body); // null可换SAP接口url地址
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
        let func2 = extrequire("GZTBDM.backDesignerFunction.SapClientAudit");
        let auditStrResponse = func2.execute(null, ZIFS_MA002_RETURN); // 返回值：sap客商编码
        // 拿到sap客商编码，给自定义字段赋
        let func3 = extrequire("GT62AT45.backDesignerFunction.getClientUpdate");
        let res3 = func3.execute(auditStrResponse, param);
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
        let strResponseJSON = JSON.parse(strResponse);
        if (strResponseJSON.code != "200") {
          // 更新ys系统客户档案失败：
          throw new Error("更新ys系统客户档案失败：" + JSON.stringify(strResponseJSON.message));
        }
      }
    } else {
      // 调用接口失败
      throw new Error("-- 调用SAP接口失败 --");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });