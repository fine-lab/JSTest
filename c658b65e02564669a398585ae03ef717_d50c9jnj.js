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
    shiSql += " where source_flag = 'SS' and shippingschedulebList.deviceSupplier != 'YD' and shippingschedulebList.poCode is null ";
    shiSql += " and id in ('" + selectRowsId.join("','") + "') ";
    let shiRes = ObjectStore.queryByYonQL(shiSql);
    if (shiRes.length == 0) {
      return {};
    }
    let shiIds = [];
    shiRes.forEach((item) => {
      shiIds.push(item.id);
    });
    let orderSql =
      "select status postatus,code,extend71 as shiId,headParallel.orderSubject as orderSubject,purchaseOrders.extendOrdersMapping as extendOrdersMapping,purchaseOrders.oriTaxUnitPrice,purchaseOrders.extend118,headParallel.pubDate,headParallel.vendorConfirmTime from pu.purchaseorder.PurchaseOrder ";
    orderSql += " where extend72 = 'SS' and extend71 in ('" + shiIds.join("','") + "') ";
    let orderRes = ObjectStore.queryByYonQL(orderSql, "upu");
    if (orderRes.length == 0) {
      return {};
    }
    let orderMap = {};
    orderRes.forEach((item) => {
      let key = item.shiId + "@" + item.extendOrdersMapping;
      orderMap[key] = {
        code: item.code,
        orderSubject: item.orderSubject,
        oriTaxUnitPrice: item.purchaseOrders_oriTaxUnitPrice,
        headParallel_pubDate: item.headParallel_pubDate,
        vendorConfirmTime: item.headParallel_vendorConfirmTime,
        batchNo: item.purchaseOrders_extend118,
        auditDate: item.auditDate,
        extendOrdersMapping: item.extendOrdersMapping,
        postatus: item.postatus
      };
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
        shippingscheduleb.poCode = orderMap[key].code;
        if (orderMap[key].code) {
          shiObj.order_remark = orderMap[key].orderSubject;
        }
        //批次号
        let batchNo = orderMap[key].batchNo;
        let priceSql = "select  batch_time from GT18AT2.GT18AT2.batch_price where code = '" + orderMap[key].batchNo + "'";
        var priceRes = ObjectStore.queryByYonQL(priceSql, "developplatform");
        let batch_time = null;
        if (priceRes.length > 0) {
          batch_time = priceRes[0].batch_time;
        }
        shippingscheduleb.supplier_receives_ceg_time = batch_time;
        (shippingscheduleb.extendOrdersMapping = orderMap[key].extendOrdersMapping || ""), (shippingscheduleb.supplier_receives_ceg_time = batch_time);
        shippingscheduleb.price = orderMap[key].oriTaxUnitPrice;
        shippingscheduleb.poSendDate = orderMap[key].headParallel_pubDate;
        shippingscheduleb.po_confirm_time = orderMap[key].vendorConfirmTime;
        shippingscheduleb.po_activation_time = orderMap[key].auditDate;
        shippingscheduleb.poStatus = "已审核";
        shippingscheduleb._status = "Update";
        updateList.push(shippingscheduleb);
      }
      if (updateList.length > 0) {
        shiObj.shippingschedulebList = updateList;
        updateObj.push(shiObj);
      }
    }
    let updateRes = ObjectStore.updateBatch("GT37595AT2.GT37595AT2.shippingschedule", updateObj, "02a3de71");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });