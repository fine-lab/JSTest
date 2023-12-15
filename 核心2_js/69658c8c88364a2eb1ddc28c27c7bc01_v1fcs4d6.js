let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
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
    let queryBodySql = "select * from GT83441AT1.GT83441AT1.salesAdvanceOrder_b where id='" + bodyid + "'";
    var bodyRes = ObjectStore.queryByYonQL(queryBodySql, "developplatform");
    if (bodyRes.length == 0) {
      return {};
    }
    //子表更新
    ObjectStore.updateById("GT83441AT1.GT83441AT1.salesAdvanceOrder_b", object, "f01571d6");
    let querySql = "select * from GT83441AT1.GT83441AT1.salesAdvanceOrder_b where dr=0 and salesAdvanceOrder_id='" + billid + "'";
    var res = ObjectStore.queryByYonQL(querySql, "developplatform");
    if (res.length > 0) {
      let isok = true;
      let isend = true;
      for (var i = 0; i < res.length; i++) {
        let bodydata = res[i];
        let lasttotalsubQty = bodydata.totalsubQty == undefined ? 0 : Number(bodydata.totalsubQty); //累计发货数量
        let lasttotalpurcQty = bodydata.totalpurcQty == undefined ? 0 : Number(bodydata.totalpurcQty); //累计采购数量
        let lasttotaltranQty = bodydata.totaltranQty == undefined ? 0 : Number(bodydata.totaltranQty); //累计调拨数量
        let lastsubQty = bodydata.subQty == undefined ? 0 : Number(bodydata.subQty); //销售数量
        let laspurcQty = bodydata.purcQty == undefined ? 0 : Number(bodydata.purcQty); //采购数量
        let lasttranQty = bodydata.tranQty == undefined ? 0 : Number(bodydata.tranQty); //调拨数量
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