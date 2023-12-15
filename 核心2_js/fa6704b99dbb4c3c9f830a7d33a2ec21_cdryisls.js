let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 客户档案推送SAP：
    let requestStr = JSON.stringify(request.prop);
    var res = replace(requestStr, "!", "");
    let product = JSON.parse(res);
    let productId = product.id;
    let orgId = product.belongOrg; // 所属组织id
    // 获取ys系统token
    var func5 = extrequire("AT15C9C13409B00004.A2.getYsToken");
    var tokenStr = func5.execute(null, null);
    var token = tokenStr.access_token;
    var header = {
      "Content-Type": contenttype
    };
    // 客户档案推送SAP新增或更新判断：
    let ysUrl = "https://www.example.com/" + token + "&id=" + productId + "&orgId=" + orgId;
    var ysKeHuResponse = postman("get", ysUrl, JSON.stringify(header), null);
    let ysKeHuResponseJSON = JSON.parse(ysKeHuResponse);
    if (ysKeHuResponseJSON.code == "200") {
      // 适用组织编码处理list
      var orgList = [];
      let list = ysKeHuResponseJSON.data.merchantApplyRanges;
      for (var i = 0; i < list.length; i++) {
        orgList.push(list[i].orgCode);
      }
      if (ysKeHuResponseJSON.data.merchantDefine != undefined && ysKeHuResponseJSON.data.merchantDefine.define1 != undefined) {
        product.sapId = ysKeHuResponseJSON.data.merchantDefine.define1;
        let func6 = extrequire("AT15C9C13409B00004.A3.SAPCilentKUpdate");
        let res6 = func6.execute(orgList, product);
        if (res6 == undefined && res6.body == undefined) {
          throw new Error("获取SAP系统客户档案更新参数失败，请稍后重试");
        }
        let func7 = extrequire("AT15C9C13409B00004.A3.sendSap");
        let res7 = func7.execute(null, res6.body);
        let SAPCilentKUpdate = JSON.parse(res7.strResponse);
        if (SAPCilentKUpdate != null) {
          let flag = SAPCilentKUpdate.ZIF_MA_FUNC_003.TABLES.ZIFS_MA002_RETURN[0].MESSAGE_CHANGE;
          if (flag == 0) {
            let errorMessage = SAPCilentKUpdate.ZIF_MA_FUNC_003.TABLES.ZIFS_MA002_RETURN[0].ZMESSAGE;
            throw new Error("客户档案推送SAP更新失败：" + JSON.stringify(errorMessage));
          } else if (flag == 2) {
            let strResponseJSONs = JSON.parse(sapStrResponse.strResponse);
            let ZIFS_MA002_RETURN = strResponseJSONs.ZIF_MA_FUNC_003.TABLES.ZIFS_MA002_RETURN[0]; // SAP系统返回数据列表
            let func3 = extrequire("GZTBDM.backDesignerFunction.SapClientAudit");
            let auditStrResponse = func3.execute(null, ZIFS_MA002_RETURN); // 返回值：sap客商编码
          }
          return { strResponses: { code: 200 } };
        } else {
          throw new Error("客户档案更新推送SAP失败,请重试");
        }
      } else {
        let func1 = extrequire("AT15C9C13409B00004.A3.getCilentSave");
        let res1 = func1.execute(orgList, product);
        if (res1.body == undefined) {
          let resultError = {
            strResponses: {
              message: "银行信息未填写，请检查"
            }
          };
          return resultError;
        }
        let func2 = extrequire("AT15C9C13409B00004.A3.sendSap");
        let sapStrResponse = func2.execute(null, res1.body); // null可换SAP接口url地址
        let strResponseJSON = JSON.parse(sapStrResponse.strResponse);
        if (strResponseJSON != null) {
          if (strResponseJSON.ZIF_MA_FUNC_002 == undefined && strResponseJSON.ZIF_MA_FUNC_002.TABLES == undefined && strResponseJSON.ZIF_MA_FUNC_002.TABLES.ZIFS_MA002_RETURN == undefined) {
            throw new Error("调用SAP接口失败,请将此信息提供开发:" + JSON.stringify(strResponseJSON));
          }
          let flag = strResponseJSON.ZIF_MA_FUNC_002.TABLES.ZIFS_MA002_RETURN[0].MESSAGE_ADD;
          if (flag == 0) {
            let errorMessage = strResponseJSON.ZIF_MA_FUNC_002.TABLES.ZIFS_MA002_RETURN[0].ZMESSAGE;
            throw new Error("客户档案推送SAP保存失败：" + JSON.stringify(errorMessage));
          } else if (flag == 2) {
            let strResponseJSONs = JSON.parse(sapStrResponse.strResponse);
            let ZIFS_MA002_RETURN = strResponseJSONs.ZIF_MA_FUNC_002.TABLES.ZIFS_MA002_RETURN[0]; // SAP系统返回数据列表
            let func3 = extrequire("GZTBDM.backDesignerFunction.SapClientAudit");
            let auditStrResponse = func3.execute(null, ZIFS_MA002_RETURN); // 返回值：sap客商编码
            // 拿到sap客商编码，给自定义字段赋
            let func4 = extrequire("AT15C9C13409B00004.A3.getClientUpdate");
            let res3 = func4.execute(auditStrResponse, product);
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
              throw new Error("更新ys系统客户档案失败：" + JSON.stringify(strResponses.message));
            } else {
              return { strResponses: { code: 200 } };
            }
          } else {
            //（执行超时引起的更新YS客户档案失败问题）
            let sapidStr = strResponseJSON.ZIF_MA_FUNC_002.TABLES.ZIFS_MA002_RETURN[0].ZMESSAGE;
            var res9 = includes(sapidStr, "该笔新增数据已存在您所想拓展的部组,编号");
            if (res9) {
              // 解析SAP接口返回参数：
              var res10 = substring(sapidStr, 21, 32);
              let codeClient = {
                clientCode: res10
              };
              let func14 = extrequire("AT15C9C13409B00004.A3.getClientUpdate");
              let res11 = func14.execute(codeClient, product);
              let url10 = "https://www.example.com/" + token;
              var strResponse1 = postman("post", url10, JSON.stringify(header), JSON.stringify(res11.body));
              var strResponses1 = JSON.parse(strResponse1);
              if (strResponses1.code != "200") {
                // 更新ys系统客户档案失败：
                throw new Error("更新ys系统客户档案失败：" + JSON.stringify(strResponses1.message));
              } else {
                return { strResponses: { code: 200 } };
              }
            }
            return { strResponses: { code: 200 } };
          }
        } else {
          // 调用接口失败
          throw new Error("调用SAP接口失败");
        }
      }
      return { strResponses };
    } else {
      throw new Error("查询客户档案失败，请重试");
    }
  }
}
exports({ entryPoint: MyAPIHandler });