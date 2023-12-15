let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    return { request };
    let billid = request.billid;
    let bodyid = request.bodyid;
    let totalpurcQtyValue = request.totalpurcQty; //累计采购数量
    let totaltranQtyValue = request.totaltranQty; //累计调拨数量
    let totalsubQtyValue = request.totalsubQty; //累计发货数量
    var object;
    if (totalpurcQtyValue != null) {
      object = { id: bodyid, totalpurcQty: totalpurcQtyValue };
    } else if (totaltranQtyValue != null) {
      object = { id: bodyid, totaltranQty: totaltranQtyValue };
    } else if (totalsubQtyValue != null) {
      object = { id: bodyid, totalsubQty: totalsubQtyValue };
    }
    ObjectStore.updateById("GT83441AT1.GT83441AT1.salesAdvanceOrder_b", object, "597bb7c9");
    let querySql = "select * from GT83441AT1.GT83441AT1.salesAdvanceOrder_b where dr=0 and salesAdvanceOrder_id=" + billid;
    var res = ObjectStore.queryByYonQL(querySql);
    if (res.length > 0) {
      let isok = true;
      let isend = true;
      for (var i = 0; i < res.length; i++) {
        let bodydata = res[i];
        let lasttotalsubQty = Number(bodydata.totalsubQty); //累计发货数量
        let lasttotalpurcQty = Number(bodydata.totalpurcQty); //累计采购数量
        let lasttotaltranQty = Number(bodydata.totaltranQty); //累计调拨数量
        let lastsubQty = Number(bodydata.subQty); //销售数量
        let laspurcQty = Number(bodydata.purcQty); //采购数量
        let lasttranQty = Number(bodydata.tranQty); //调拨数量
        if (lasttotalpurcQty != laspurcQty || lasttotaltranQty != lasttranQty) {
          isok = false;
        }
        if (lasttotalsubQty != lastsubQty) {
          isend = false;
        }
        if (!isok && !isend) {
          break;
        }
      }
      object = { id: billid, isdelivery: "" + isok, isend: "" + isend };
      ObjectStore.updateById("GT83441AT1.GT83441AT1.salesAdvanceOrder", object, "597bb7c9");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });