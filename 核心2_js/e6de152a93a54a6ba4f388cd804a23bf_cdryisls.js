let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestStr = JSON.stringify(request.prop);
    var res = replace(requestStr, "!", "");
    let product = JSON.parse(res);
    // 推送sap获取保存参数
    let func4 = extrequire("AT15C9C13409B00004.A3.getProductSave");
    let res1 = func4.execute(null, product);
    if (res1.body == undefined) {
      // 用户未填写进项和销项税率
      let resultError = {
        productResponseJSON: {
          message: "销项税率或进项税率未填写，请检查"
        }
      };
      return resultError;
    }
    // 调用sap接口：
    let func1 = extrequire("AT15C9C13409B00004.A3.sendSap");
    let strResponse = func1.execute(null, res1.body); // null可换SAP接口url地址
    let responseJSON = JSON.parse(strResponse.strResponse);
    if (responseJSON != undefined) {
      if (responseJSON.ZIF_MA_FUNC_005 != undefined && responseJSON.ZIF_MA_FUNC_005.OUTPUT != undefined && responseJSON.ZIF_MA_FUNC_005.OUTPUT.ZIFS_MA005_RTNH != undefined) {
        if (responseJSON.ZIF_MA_FUNC_005.OUTPUT.ZIFS_MA005_RTNH.TRAN_FLAG == 1) {
          throw new Error("YS档案推送SAP系统失败：" + JSON.stringify(responseJSON.ZIF_MA_FUNC_005.OUTPUT.ZIFS_MA005_RTNH.MESSAGE));
        } else {
          let sapCode;
          if (responseJSON.ZIF_MA_FUNC_005.OUTPUT.ZIFS_MA005_RTNH.MATNR != undefined) {
            let ZIFS_MA005_RTNH = responseJSON.ZIF_MA_FUNC_005.OUTPUT.ZIFS_MA005_RTNH;
            sapCode = ZIFS_MA005_RTNH.MATNR;
          } else {
            throw new Error("SAP系统未返回SAP系统物料编码");
          }
          let func2 = extrequire("AT15C9C13409B00004.A2.getYsToken");
          let tokenStr = func2.execute(null, null);
          let token = tokenStr.access_token;
          var contenttype = "application/json;charset=UTF-8";
          var header = {
            "Content-Type": contenttype
          };
          // 获取ys物料档案更新body参数：
          let func3 = extrequire("AT15C9C13409B00004.A3.getProductUpdate");
          let res3 = func3.execute(sapCode, product);
          let url = "https://www.example.com/" + token;
          var productResponse = postman("post", url, JSON.stringify(header), JSON.stringify(res3.bodyNew));
          var productResponseJSON = JSON.parse(productResponse);
          if (productResponseJSON != undefined) {
            if (productResponseJSON.code != 200) {
              throw new Error("更新YS物料档案失败：" + JSON.stringify(productResponseJSON.message));
            }
          } else {
            throw new Error("更新YS系统物料档案失败");
          }
        }
      } else {
        throw new Error("调用SAP接口失败,请将此信息提供开发:" + JSON.stringify(responseJSON));
      }
    } else {
      throw new Error("调用SAP接口失败");
    }
    return { productResponseJSON };
  }
}
exports({ entryPoint: MyAPIHandler });