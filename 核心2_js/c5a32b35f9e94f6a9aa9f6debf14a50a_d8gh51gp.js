let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var pruId = request.sendBodyMap.pruId;
    var allQty = request.sendBodyMap.qty;
    var xmId = request.sendDataObj.xmid;
    var cpxId = request.sendDataObj.cpxId;
    var makeBodyObjs = new Array();
    //查询物料主数据
    var queryPruSql = "select name,unit,defaultSKUId from pc.product.Product where id='" + pruId + "'"; //查询主计量单位和默认sku
    var pruRes = ObjectStore.queryByYonQL(queryPruSql, "productcenter");
    if (pruRes.length == 0) {
      throw new Error("物料档案未找到！");
    }
    var skuId = pruRes[0].defaultSKUId;
    var unitId = pruRes[0].unit;
    //查询物料业务数据
    var queryPruDetalSql = "select isBatchManage from pc.product.ProductDetail where productId='" + pruId + "'"; //查询是否批次号管理
    var pruDetailRes = ObjectStore.queryByYonQL(queryPruDetalSql, "productcenter");
    if (!pruDetailRes[0].isBatchManage) {
      //非批次号
      var zbdata = {
        product: pruId,
        productsku: skuId,
        unit: unitId,
        stockUnitId: unitId,
        invExchRate: "1",
        qty: allQty,
        project: xmId,
        _status: "Insert"
      };
      var def = {
        define1: cpxId
      };
      zbdata.defines = def;
      makeBodyObjs.push(zbdata);
    } else {
      //批次号
      var sendDataObj = request.sendDataObj;
      //依据组织、仓库、物料、SKU查询对应现存量
      var queryCurrentSql =
        "select currentqty,batchno from stock.currentstock.CurrentStock where product='" +
        pruId +
        "' and productsku='" +
        skuId +
        "' and org='" +
        sendDataObj.orgId +
        "' and warehouse='" +
        sendDataObj.warehouId +
        "' order by pubts";
      var currentRes = ObjectStore.queryByYonQL(queryCurrentSql, "ustock");
      if (currentRes.length == 0) {
        throw new Error("物料【" + pruRes[0].name + "】在【" + sendDataObj.warehouName + "】仓库未找到现存量！");
      }
      for (var i = 0; i < currentRes.length; i++) {
        let newQty = currentRes[i].currentqty; //现存量
        let batchnoValue = currentRes[i].batchno;
        var queryBatchSql =
          "select producedate,invaliddate,batchno from st.batchno.Batchno where product='" + pruId + "' and productsku='" + skuId + "' and batchno='" + batchnoValue + "' order by pubts";
        var batchRes = ObjectStore.queryByYonQL(queryBatchSql, "yonbip-scm-scmbd");
        let sendQty = 0;
        if (newQty <= allQty) {
          sendQty = newQty;
          allQty = allQty - newQty;
        } else {
          sendQty = allQty;
          allQty = 0;
        }
        sendQty = MoneyFormatReturnBd(sendQty, 5);
        var senddata = {
          product: pruId,
          productsku: skuId,
          unit: unitId,
          stockUnitId: unitId,
          invExchRate: "1",
          project: xmId,
          qty: sendQty, //数量
          batchno: batchnoValue, //批次号
          isBatchManage: "true", //是否批次管理
          producedate: batchRes[0].producedate, //生产日期
          invaliddate: batchRes[0].invaliddate, //有效期至
          _status: "Insert"
        };
        makeBodyObjs.push(senddata);
        if (allQty == 0) {
          break;
        }
      }
      allQty = MoneyFormatReturnBd(allQty, 5);
      if (allQty > 0) {
        throw new Error("物料【" + pruRes[0].name + "】在【" + sendDataObj.warehouName + "】仓库中现存量不足，缺少" + allQty);
      }
    }
    return { makeBodyObjs };
  }
}
exports({ entryPoint: MyAPIHandler });