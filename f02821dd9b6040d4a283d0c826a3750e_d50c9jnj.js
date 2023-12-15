let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res1 = [];
    var sql1 =
      "select (select * from wlztxxmxList order by act_time desc) wlztxxmxList,rec_no,id,log_no,sign_status,sign_bill,mail_status from AT1707A99A16B00005.AT1707A99A16B00005.wlztxx  where rec_no = '" +
      request.rec_no +
      "' ";
    if (!request.wlztxx) {
      res1 = ObjectStore.queryByYonQL(sql1);
      if (!res1 || res1.length == 0 || !res1[0].wlztxxmxList || res1[0].wlztxxmxList == 0) {
        return {};
      }
    } else {
      res1 = request.wlztxx;
    }
    // 回写要货计划
    let searchSql = "select code,arrivalOrders.sourceid as sourceid,arrivalOrders.sourceautoid as sourceautoid,porder.extend71 shiId from ";
    searchSql += " pu.arrivalorder.ArrivalOrder ";
    searchSql += " inner join pu.purchaseorder.PurchaseOrder porder on porder.id = arrivalOrders.sourceid ";
    searchSql += " where arrivalOrders.source = 'st_purchaseorder' ";
    searchSql += " and code = '" + request.rec_no + "'";
    let searchRes = ObjectStore.queryByYonQL(searchSql, "upu");
    if (searchRes.length == 0) {
      return {};
    }
    let sourceautoids = [];
    searchRes.forEach((item) => {
      sourceautoids.push(item.sourceautoid);
    });
    let ordersSql = "select extendOrdersMapping from pu.purchaseorder.PurchaseOrders ";
    ordersSql += " where id in ('" + sourceautoids.join("','") + "') ";
    let orderRes = ObjectStore.queryByYonQL(ordersSql, "upu");
    if (orderRes.length == 0) {
      return {};
    }
    let orderMappings = [];
    orderRes.forEach((item) => {
      orderMappings.push(item.extendOrdersMapping);
    });
    let shiSql =
      "select id,(select id,waybill_no,logistics_status,logistics_transfer_time,logistics_sign_time,first_delivery_time from shippingschedulebList) as shippingschedulebList from GT37595AT2.GT37595AT2.shippingschedule ";
    shiSql += " where id = " + searchRes[0].shiId;
    shiSql += " and shippingschedulebList.orders_mapping in ('" + orderMappings.join("','") + "') ";
    let shiRes = ObjectStore.queryByYonQL(shiSql, "developplatform");
    if (shiRes.length == 0 || !shiRes[0].shippingschedulebList || shiRes[0].shippingschedulebList.length == 0) {
      return {};
    }
    let wlzMsg = {};
    let size = res1[0].wlztxxmxList.length;
    let statusName = { 1: "提货", 2: "发车", 3: "在途", 4: "中转到库", 5: "中转出库", 6: "签收", 7: "附件上传", 8: "已邮寄签收单" };
    res1[0].wlztxxmxList.forEach((item) => {
      if (!wlzMsg["logistics_status"] && item.status_name != "附件上传") {
        wlzMsg["logistics_status"] = item.status_name;
      }
      if (item.status_name == "中转到库" && !wlzMsg["logistics_transfer_time"]) {
        wlzMsg["logistics_transfer_time"] = item.act_time;
      }
      if (item.status_name == "中转出库" && !wlzMsg["first_delivery_time"]) {
        wlzMsg["first_delivery_time"] = item.act_time;
      }
      if (item.status_name == "签收" && !wlzMsg["logistics_sign_time"]) {
        wlzMsg["logistics_sign_time"] = item.act_time;
      }
      if (item.status_name == "附件上传" && !wlzMsg["receipt_certificate_time"]) {
        wlzMsg["receipt_certificate_time"] = item.act_time;
      }
    });
    let updateShi = {};
    updateShi.id = shiRes[0].id;
    let updateShiList = [];
    shiRes[0].shippingschedulebList.forEach((item) => {
      item.waybill_no = res1[0].log_no;
      item.logistics_status = wlzMsg["logistics_status"];
      item.logistics_transfer_time = wlzMsg["logistics_transfer_time"];
      item.first_delivery_time = wlzMsg["first_delivery_time"];
      item.logistics_sign_time = wlzMsg["logistics_sign_time"];
      item.receipt_certificate_time = wlzMsg["receipt_certificate_time"];
      item.supplier_feedback_ata_time = wlzMsg["logistics_transfer_time"];
      item._status = "Update";
      updateShiList.push(item);
    });
    updateShi.shippingschedulebList = updateShiList;
    let updateShiRes = ObjectStore.updateById("GT37595AT2.GT37595AT2.shippingschedule", updateShi, "02a3de71");
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });