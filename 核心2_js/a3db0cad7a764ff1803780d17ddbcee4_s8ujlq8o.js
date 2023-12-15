let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let whereStr = request.whereStr;
    let whereSuplier = request.whereSuplier;
    let searchSQL =
      "select *,vendorId.name,(select *,unit.name,(select * from shippingschedulesnList) as shippingschedulesnList from shippingschedulebList) shippingschedulebList from GT37595AT2.GT37595AT2.shippingschedule " +
      whereStr;
    let billData = ObjectStore.queryByYonQL(searchSQL);
    let updateArr = [];
    for (var i = 0; i < billData.length; i++) {
      let subBills = billData[i].shippingschedulebList;
      let updateItem = { id: billData[i].id, submit_status: "6" };
      updateArr.push(updateItem);
    }
    let tokenSql = "select vendorId,appKey,appSecret,appTenantId from GT39745AT6.GT39745AT6.suplierApiMessage " + whereSuplier;
    var tokenRes = ObjectStore.queryByYonQL(tokenSql);
    const tokenMap = new Map();
    for (var w = 0; w < tokenRes.length; w++) {
      var tokenItem = tokenRes[w];
      tokenMap.set(tokenItem.vendorId, { appKey: tokenItem.appKey, appSecret: tokenItem.appSecret, appTenantId: tokenItem.appTenantId });
    }
    let configParamsFun = extrequire("GT37595AT2.commonFun.configParamsFun");
    let configParams = configParamsFun.execute(request.envUrl).configParams;
    //使用-传参分别为： appkey, appsecrect
    whereStr = whereStr.replace("where id in", "where source_id in");
    let rrr;
    let errMsg = "";
    for (let [key, value] of tokenMap) {
      let header = { appkey: tokenMap.get(key).appKey, appsecret: tokenMap.get(key).appSecret };
      let url = configParams.gatewayUrl + "/" + tokenMap.get(key).appTenantId + "/product_ref/product_ref_01/batchUpdStatus";
      let apiResponse = ublinker("post", url, JSON.stringify(header), JSON.stringify({ whereStr: whereStr, opeStatusCode: "6", opeStatusName: "取消确认" }));
      rrr = apiResponse;
      if (apiResponse.code == "999") {
        errMsg += apiResponse.message;
      }
    }
    if (errMsg != "") {
      throw new Error(errMsg);
    }
    var returnRes = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", updateArr, "shippingschedule");
    return { whereStr };
  }
}
exports({ entryPoint: MyAPIHandler });