let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let requestStr = JSON.stringify(request.prop);
    var res = replace(requestStr, "!", "");
    let product = JSON.parse(res);
    // 推送sap获取保存参数
    let func4 = extrequire("GT62AT45.backDesignerFunction.getProductSave");
    let res1 = func4.execute(null, product);
    if (res1.body == undefined) {
      // 用户未填写进项和销项税率
      let resultError = {
        productResponseJSON: {
          message: "-- 销项税率或进项税率未填写，请检查 --"
        }
      };
      return resultError;
    }
    // 调用sap接口：
    let func1 = extrequire("GT62AT45.backDesignerFunction.sendSap");
    let strResponse = func1.execute(null, res1.body); // null可换SAP接口url地址
    let responseJSON = JSON.parse(strResponse.strResponse);
    if (responseJSON != null) {
      if (responseJSON.ZIF_MA_FUNC_005.OUTPUT.ZIFS_MA005_RTNH.TRAN_FLAG == 1) {
        throw new Error("-- YS档案推送SAP系统失败：" + JSON.stringify(responseJSON.ZIF_MA_FUNC_005.OUTPUT.ZIFS_MA005_RTNH.MESSAGE) + " --");
      } else {
        // 判断用户当前是更新操作还是新增，更新不需要调用以下代码
        // 拿到sap物料信息
        let ZIFS_MA005_RTNH = responseJSON.ZIF_MA_FUNC_005.OUTPUT.ZIFS_MA005_RTNH;
        let sapCode = ZIFS_MA005_RTNH.MATNR;
        let func2 = extrequire("GT62AT45.backDesignerFunction.getYsToken");
        let tokenStr = func2.execute(null, null);
        let token = tokenStr.access_token;
        var contenttype = "application/json;charset=UTF-8";
        var header = {
          "Content-Type": contenttype
        };
        // 获取ys物料档案更新body参数：
        let func3 = extrequire("GT62AT45.backDesignerFunction.getProductUpdate");
        let res3 = func3.execute(sapCode, product);
        let url = "https://www.example.com/" + token;
        var productResponse = postman("post", url, JSON.stringify(header), JSON.stringify(res3.bodyNew));
        var productResponseJSON = JSON.parse(productResponse);
        if (productResponseJSON.code != 200) {
          throw new Error("更新ys物料档案失败：" + JSON.stringify(productResponseJSON.message));
        }
      }
    } else {
      throw new Error("-- 调用SAP接口失败 --");
    }
    return { productResponseJSON };
  }
}
exports({ entryPoint: MyAPIHandler });