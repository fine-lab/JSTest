let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let selectRows = request.selectRows;
    if (!selectRows || selectRows.length == 0) {
      return { res: "请选择需要同步的数据" };
    }
    let selectRowsId = [];
    selectRows.forEach((item) => {
      selectRowsId.push(item.id);
    });
    let shiSql = "select id,order_remark,(select id,orders_mapping from shippingschedulebList) as shippingschedulebList from GT37595AT2.GT37595AT2.shippingschedule ";
    shiSql += " where source_flag = 'SS' and shippingschedulebList.deviceSupplier != 'YD'  and shippingschedulebList.poCode is null";
    shiSql += " and id in ('" + selectRowsId.join("','") + "') ";
    let shiRes = ObjectStore.queryByYonQL(shiSql);
    if (shiRes.length == 0) {
      return {};
    }
    let shiIds = [];
    shiRes.forEach((item) => {
      shiIds.push(item.id);
    });
    let orderSql = "select code,extend71 as shiId,headParallel.orderSubject as orderSubject,purchaseOrders.extendOrdersMapping as extendOrdersMapping from pu.purchaseorder.PurchaseOrder ";
    orderSql += " where extend72 = 'SS' and extend71 in ('" + shiIds.join("','") + "') ";
    let orderRes = ObjectStore.queryByYonQL(orderSql, "upu");
    if (orderRes.length == 0) {
      return {};
    }
    let orderMap = {};
    orderRes.forEach((item) => {
      let key = item.shiId + "@" + item.extendOrdersMapping;
      orderMap[key] = { code: item.code, orderSubject: item.orderSubject };
    });
    let updateObj = [];
    for (let i = 0; i < shiRes.length; i++) {
      let shiObj = shiRes[i];
      let count = 0;
      let shippingschedulebList = shiObj.shippingschedulebList;
      let updateList = [];
      for (let j = 0; j < shippingschedulebList.length; j++) {
        let shippingscheduleb = shippingschedulebList[j];
        let key = shiObj.id + "@" + shippingscheduleb.orders_mapping;
        if (!orderMap[key]) {
          continue;
        }
        if (count == 0) {
          if (shiObj.order_remark) {
            shiObj.order_remark = orderMap[key].orderSubject;
          } else {
            shiObj.order_remark = orderMap[key].orderSubject;
          }
          count++;
        }
        shippingscheduleb.poCode = orderMap[key].code;
        shippingscheduleb.supplier_receives_ceg_time = XXX;
        shippingscheduleb._status = "Update";
        updateList.push(shippingscheduleb);
      }
      let purchaseorderSql = "select * from pu.purchaseorder.PurchaseOrder where extend72 = 'SS' and extend71 in ('" + shiIds.join("','") + "') ";
      let purchaseorderRes = ObjectStore.queryByYonQL(orderSql, "upu");
      if (purchaseorderRes.length > 0) {
        let lineDataList = [];
        for (var i = 0; i < purchaseorderRes.length; i++) {
          let purchaseOrder = purchaseorderRes[i];
          //批次号
          let batchNo = purchaseOrder.extend118;
          let priceSql = "select  batch_time from GT18AT2.GT18AT2.batch_price where code = " + batchNo;
          var priceRes = ObjectStore.queryByYonQL(priceSql, "developplatform");
          let batch_time = null;
          if (priceRes.length > 0) {
            batch_time = priceRes[0].batch_time;
          }
          //价格(PO的含税单价)
          let price = purchaseOrder.oriTaxUnitPrice;
          let extendOrdersMapping = purchaseOrder.extendOrdersMapping;
          let pubDateStr = "";
          if (purchaseOrder.headParallel && purchaseOrder.headParallel[0].pubDate) {
            let pubDate = purchaseOrder.headParallel[0].pubDate;
            pubDateStr = getDate(pubDate);
          }
          let poConfirmTimeStr = "";
          let poActiveDateStr = "";
          if (purchaseOrder.headParallel && purchaseOrder.headParallel[0].vendorConfirmTime) {
            let poConfirmTime = purchaseOrder.headParallel[0].vendorConfirmTime;
            poConfirmTimeStr = getDate(poConfirmTime);
          }
          if (purchaseOrder.auditDate) {
            let poActiveDate = purchaseOrder.auditDate;
            poActiveDateStr = getDate(poActiveDate);
          }
          (shiObj.extendOrdersMapping = extendOrdersMapping || ""), (shiObj.supplier_receives_ceg_time = batch_time);
          shiObj.price = price;
          shiObj.poSendDate = pubDateStr;
          shiObj.po_confirm_time = poConfirmTimeStr;
          shiObj.po_activation_time = poActiveDateStr;
          lineDataList.push(lineData);
        }
        if (updateList.length > 0) {
          shiObj.shippingschedulebList = updateList;
          updateObj.push(shiObj);
        }
      }
      let updateRes = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", updateObj, "02a3de71");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });