let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceId = request.sourceMId;
    let type = request.type;
    let checkTotleQty = {};
    if (type == "购进入库验收") {
      //查询购进入库验收单主表
      let masterSql = "select id from GT22176AT10.GT22176AT10.SY01_purinstockysv2 where source_id = " + sourceId;
      let masterRes = ObjectStore.queryByYonQL(masterSql, "sy01");
      let ids = [];
      if (masterRes.length > 0) {
        for (let i = 0; i < masterRes.length; i++) {
          ids.push(masterRes[i].id);
        }
      } else {
        return { checkTotleQty };
        ids.push(-1);
      }
      let str_ids = ids.join(",");
      //查询购进入库验收单子表
      let childSql = "select * from GT22176AT10.GT22176AT10.SY01_purinstockys_l where SY01_purinstockysv2_id in (" + str_ids + ")";
      let childRes = ObjectStore.queryByYonQL(childSql, "sy01");
      let arrivalChildIds = [];
      let arrivalCheckQty = {};
      if (childRes.length > 0) {
        for (let i = 0; i < childRes.length; i++) {
          let index = arrivalChildIds.indexOf(childRes[i].sourcechild_id);
          if (index == -1) {
            arrivalChildIds.push(childRes[i].sourcechild_id);
            arrivalCheckQty[childRes[i].sourcechild_id] = childRes[i].checkQty == NaN ? 0 : Number.parseFloat(childRes[i].checkQty);
          } else {
            arrivalCheckQty[childRes[i].sourcechild_id] += childRes[i].checkQty == NaN ? 0 : Number.parseFloat(childRes[i].checkQty);
          }
        }
        let str_arrivalChildIds = arrivalChildIds.join(",");
        //查询到货单子表信息
        let arrivalChildSql = "select * from pu.arrivalorder.ArrivalOrders where id in (" + str_arrivalChildIds + ")";
        let arrivalChildRes = ObjectStore.queryByYonQL(arrivalChildSql, "upu");
        if (arrivalChildRes.length > 0) {
          for (let i = 0; i < arrivalChildRes.length; i++) {
            let qty = Math.abs(arrivalChildRes[i].qty);
            checkTotleQty[arrivalChildRes[i].id] = Number.parseFloat(qty - arrivalCheckQty[arrivalChildRes[i].id]);
          }
        }
      } else {
        checkTotleQty = {};
      }
    } else if (type == "购进退出复核") {
      //查询购进退出复核单主表
      let masterSql = "select id from GT22176AT10.GT22176AT10.SY01_puroutreviewv2 where source_id=" + sourceId;
      let masterRes = ObjectStore.queryByYonQL(masterSql, "sy01");
      let ids = [];
      if (masterRes.length > 0) {
        for (let i = 0; i < masterRes.length; i++) {
          ids.push(masterRes[i].id);
        }
      } else {
        return { checkTotleQty };
      }
      let str_ids = ids.join(",");
      //查询购进退出复核单子表
      let childSql = "select * from GT22176AT10.GT22176AT10.SY01_gjtcfh_l where SY01_puroutreviewv2_id in (" + str_ids + ")";
      let childRes = ObjectStore.queryByYonQL(childSql, "sy01");
      let arrivalChildIds = [];
      let arrivalCheckQty = {};
      if (childRes.length > 0) {
        for (let i = 0; i < childRes.length; i++) {
          let index = arrivalChildIds.indexOf(childRes[i].sourcechild_id);
          if (index == -1) {
            arrivalChildIds.push(childRes[i].sourcechild_id);
            arrivalCheckQty[childRes[i].sourcechild_id] = childRes[i].qualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].qualifie_qty);
          } else {
            arrivalCheckQty[childRes[i].sourcechild_id] += childRes[i].checkQty == NaN ? 0 : Number.parseFloat(childRes[i].checkQty);
          }
        }
        let str_arrivalChildIds = arrivalChildIds.join(",");
        //查询红字采购订单子表
        let arrivalChildSql = "select * from pu.purchaseorder.PurchaseOrders where qty < 0 and id in (" + str_arrivalChildIds + ")";
        let arrivalChildRes = ObjectStore.queryByYonQL(arrivalChildSql, "upu");
        if (arrivalChildRes.length > 0) {
          for (let i = 0; i < arrivalChildRes.length; i++) {
            let qty = Math.abs(arrivalChildRes[i].qty);
            checkTotleQty[arrivalChildRes[i].id] = Number.parseFloat(qty - arrivalCheckQty[arrivalChildRes[i].id]);
          }
        }
      } else {
        checkTotleQty = {};
      }
    } else if (type == "销售退回验收") {
      //查询销售退回验收单主表
      let masterSql = "select id from GT22176AT10.GT22176AT10.sy01_gspsalereturn where source_id=" + sourceId;
      let masterRes = ObjectStore.queryByYonQL(masterSql, "sy01");
      let ids = [];
      if (masterRes.length > 0) {
        for (let i = 0; i < masterRes.length; i++) {
          ids.push(masterRes[i].id);
        }
      } else {
        return { checkTotleQty };
      }
      let str_ids = ids.join(",");
      //查询销售退回验收子表
      let childSql = "select * from GT22176AT10.GT22176AT10.sy01_gspsalereturns where sy01_gspsalereturn_id in (" + str_ids + ")";
      let childRes = ObjectStore.queryByYonQL(childSql, "sy01");
      let arrivalChildIds = [];
      let arrivalCheckQty = {};
      if (childRes.length > 0) {
        for (let i = 0; i < childRes.length; i++) {
          let index = arrivalChildIds.indexOf(childRes[i].sourcechild_id);
          if (index == -1) {
            arrivalChildIds.push(childRes[i].sourcechild_id);
            arrivalCheckQty[childRes[i].sourcechild_id] =
              (childRes[i].qualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].qualifie_qty)) + (childRes[i].unqualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].unqualifie_qty));
          } else {
            arrivalCheckQty[childRes[i].sourcechild_id] +=
              (childRes[i].qualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].qualifie_qty)) + (childRes[i].unqualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].unqualifie_qty));
          }
        }
        let str_arrivalChildIds = arrivalChildIds.join(",");
        //查询销售退货单子表信息
        let arrivalChildSql = "select * from voucher.salereturn.SaleReturnDetail where id in (" + str_arrivalChildIds + ")";
        let arrivalChildRes = ObjectStore.queryByYonQL(arrivalChildSql, "udinghuo");
        if (arrivalChildRes.length > 0) {
          for (let i = 0; i < arrivalChildRes.length; i++) {
            let qty = Math.abs(arrivalChildRes[i].qty);
            checkTotleQty[arrivalChildRes[i].id] = Number.parseFloat(qty - arrivalCheckQty[arrivalChildRes[i].id]);
          }
        }
      } else {
        checkTotleQty = {};
      }
    } else if (type == "销售出库复核") {
      //查询销售出库复核单主表
      let masterSql = "select id from GT22176AT10.GT22176AT10.sy01_saleoutstofhv6 where source_id=" + sourceId;
      let masterRes = ObjectStore.queryByYonQL(masterSql, "sy01");
      let ids = [];
      if (masterRes.length > 0) {
        for (let i = 0; i < masterRes.length; i++) {
          ids.push(masterRes[i].id);
        }
      } else {
        return { checkTotleQty };
      }
      let str_ids = ids.join(",");
      //查询销售出库复核单子表
      let childSql = "select * from GT22176AT10.GT22176AT10.SY01_xsckfmx_v6 where sy01_saleoutstofhv5_id in (" + str_ids + ")";
      let childRes = ObjectStore.queryByYonQL(childSql, "sy01");
      let arrivalChildIds = [];
      let arrivalCheckQty = {};
      if (childRes.length > 0) {
        for (let i = 0; i < childRes.length; i++) {
          let index = arrivalChildIds.indexOf(childRes[i].sourcechild_id);
          if (index == -1) {
            arrivalChildIds.push(childRes[i].sourcechild_id);
            arrivalCheckQty[childRes[i].sourcechild_id] =
              (childRes[i].qualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].qualifie_qty)) + (childRes[i].unqualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].unqualifie_qty));
          } else {
            arrivalCheckQty[childRes[i].sourcechild_id] +=
              (childRes[i].qualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].qualifie_qty)) + (childRes[i].unqualifie_qty == NaN ? 0 : Number.parseFloat(childRes[i].unqualifie_qty));
          }
        }
        let str_arrivalChildIds = arrivalChildIds.join(",");
        //查询销售发货单子表信息
        let arrivalChildSql = "select * from voucher.delivery.DeliveryDetail where id in (" + str_arrivalChildIds + ")";
        let arrivalChildRes = ObjectStore.queryByYonQL(arrivalChildSql, "udinghuo");
        if (arrivalChildRes.length > 0) {
          for (let i = 0; i < arrivalChildRes.length; i++) {
            let qty = Math.abs(arrivalChildRes[i].qty);
            checkTotleQty[arrivalChildRes[i].id] = Number.parseFloat(qty - arrivalCheckQty[arrivalChildRes[i].id]);
          }
        }
      } else {
        checkTotleQty = {};
      }
    }
    return { checkTotleQty };
  }
}
exports({ entryPoint: MyAPIHandler });