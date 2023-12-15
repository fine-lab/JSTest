let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let orderSql =
      "select id,extend71,extend72,headParallel.pubDate as pubDate,purchaseOrders.extendOrdersMapping as orderMapping,purchaseOrders.extend119 as batchId,purchaseOrders.extend118 as batchNo ";
    orderSql += " from pu.purchaseorder.PurchaseOrder where id = '" + id + "'";
    let orderRes = ObjectStore.queryByYonQL(orderSql);
    if (orderRes[0].extend72 != "SS") {
      return {};
    }
    let shiSql = "select id,orders_mapping as orderMapping from GT37595AT2.GT37595AT2.shippingscheduleb where shippingschedule_id = '" + orderRes[0].extend71 + "'";
    let shiRes = ObjectStore.queryByYonQL(shiSql, "developplatform");
    let mappingMap = {};
    shiRes.forEach((item) => {
      mappingMap[item.orderMapping] = { id: item.id };
    });
    // 批次明细id，用于查询批次信息
    let batchNos = [];
    orderRes.forEach((item) => {
      if (item.batchNo) {
        batchNos.push(item.batchNo);
      }
    });
    let batchMap = {};
    if (batchNos.length > 0) {
      let batchSql = "select code,batch_time from GT18AT2.GT18AT2.batch_price where code in ('" + batchNos.join("','") + "')";
      let batchRes = ObjectStore.queryByYonQL(batchSql, "developplatform");
      batchRes.forEach((item) => {
        batchMap[item.code] = { batchTime: item.batch_time };
      });
    }
    let shiObj = { id: orderRes[0].extend71 };
    let shiDetails = [];
    // 要货计划_采购订单行对行关联字段
    orderRes.forEach((item) => {
      let shiDetail = {};
      shiDetail.id = mappingMap[item.orderMapping].id;
      shiDetail.poSendDate = item.pubDate;
      if (batchMap[item.batchNo]) {
        shiDetail.supplier_receives_ceg_time = batchMap[item.batchNo].batchTime;
      }
      shiDetail._status = "Update";
      shiDetails.push(shiDetail);
    });
    shiObj.shippingschedulebList = shiDetails;
    var currentUser = JSON.parse(AppContext()).currentUser;
    let url = ObjectStore.env().url;
    let updateurl = url + "/iuap-api-gateway/" + currentUser.tenantId + "/product_ref/product_ref_01/updateShipping";
    let updateRes = openLinker("POST", updateurl, "PU", JSON.stringify(shiObj));
    updateRes = JSON.parse(updateRes);
    if (updateRes.code != "200") {
      throw new Error("回写要货计划失败！");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });