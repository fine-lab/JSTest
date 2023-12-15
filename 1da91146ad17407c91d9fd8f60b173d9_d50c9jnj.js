let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceid = request.sourceid;
    let sourceautoids = request.sourceautoids;
    if (!sourceid) {
      return {};
    }
    let supplyApdDate = "";
    let extendWeight = 0;
    let extendVolume = 0;
    let extendCount = 0;
    let returnObject = {};
    // 获取sourceid,查询采购订单的要货计划id extend71
    let yonQl2 = " select extend71,purchaseOrders.extendOrdersMapping  as extendOrdersMapping from pu.purchaseorder.PurchaseOrder where id = '" + sourceid + "'";
    yonQl2 += " and purchaseOrders.id in ('" + sourceautoids.join("','") + "')";
    var resss = ObjectStore.queryByYonQL(yonQl2, "upu");
    let shipScheduId = "";
    let extendOrdersMappings = new Map();
    if (resss && resss.length > 0) {
      if (resss[0].extend71) {
        shipScheduId = resss[0].extend71;
        resss.forEach((item) => {
          extendOrdersMappings.set(item.extendOrdersMapping, 1);
        });
      }
    }
    if (!shipScheduId) {
      return {};
    }
    let querySql = " select *,vendorId.name,(select *,unit.name from shippingschedulebList) shippingschedulebList from GT37595AT2.GT37595AT2.shippingschedule where id = '" + shipScheduId + "'";
    let shipResult = ObjectStore.queryByYonQL(querySql, "developplatform");
    if (shipResult && shipResult[0]) {
      let shipSchedulebList = shipResult[0].shippingschedulebList;
      if (shipSchedulebList && shipSchedulebList.length > 0) {
        supplyApdDate = shipSchedulebList[0].supplier_feedback_apd_time;
        shipSchedulebList.forEach((item) => {
          if (extendOrdersMappings.has(item.orders_mapping)) {
            if (item.itemWeight) {
              extendWeight += Number(item.itemWeight);
            }
            if (item.itemVolume) {
              extendVolume += Number(item.itemVolume);
            }
            if (item.itemCount) {
              extendCount += Number(item.itemCount);
            }
          }
        });
        if (extendWeight > 0) {
          returnObject["extendWeight"] = extendWeight;
        }
        if (extendVolume > 0) {
          returnObject["extendVolume"] = extendVolume;
        }
        if (extendCount > 0) {
          returnObject["extendCount"] = extendCount;
        }
      }
    }
    if (supplyApdDate) {
      let extendPickDate = new Date(supplyApdDate);
      // 将apd日期时间加1天,传给到货订单主表的提货时间(extendPickDate)
      extendPickDate.setDate(extendPickDate.getDate() + 1);
      // 将apd时间+1
      var extendPickDateStr = extendPickDate.getFullYear() + "-";
      if (extendPickDate.getMonth() < 9) {
        // 月份从0开始的
        extendPickDateStr += "0";
      }
      extendPickDateStr += extendPickDate.getMonth() + 1 + "-";
      extendPickDateStr += extendPickDate.getDate() < 10 ? "0" + extendPickDate.getDate() : extendPickDate.getDate();
      returnObject["extendPickDateStr"] = extendPickDateStr;
    }
    let orderSql = "select *,(select * from purchaseOrders ) purchaseOrders ";
    orderSql += " from pu.purchaseorder.PurchaseOrder where id  = '" + sourceid + "'";
    let orderRes = ObjectStore.queryByYonQL(orderSql, "upu");
    returnObject["orderRes"] = orderRes;
    returnObject["shipResult"] = shipResult;
    return returnObject;
  }
}
exports({ entryPoint: MyAPIHandler });