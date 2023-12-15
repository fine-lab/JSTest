let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request.code; //单据code
    let orderId = "";
    let orderType = "";
    let sql = "";
    let domain = "ustock";
    //产品入库
    sql = "select id,id mainId,org.name orgName,code billCode,vouchdate vouchDate from st.storeprorecord.StoreProRecord  where  code=" + code;
    let result = ObjectStore.queryByYonQL(sql, "ustock");
    if (result.length > 0) {
      orderType = "storeprorecord";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    //采购入库
    sql = "select id,id mainId,purchaseOrg.name orgName,code billCode,vouchdate vouchDate from st.purinrecord.PurInRecord  where   code=" + code;
    result = ObjectStore.queryByYonQL(sql, "ustock");
    if (result.length > 0) {
      orderType = "st_purinrecord";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    //销售出库单
    sql = "select id,id mainId,org.name orgName,code billCode,vouchdate vouchDate,cust.name customerName,memo remark from st.salesout.SalesOut  where  code=" + code;
    result = ObjectStore.queryByYonQL(sql, "ustock");
    if (result.length > 0) {
      orderType = "st_salesout";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    //期初库存（其他入库单的一种）
    sql = "select id,id mainId,org.name orgName,code billCode,vouchdate vouchDate from 		st.othinrecord.OthInRecord  where  code=" + code;
    result = ObjectStore.queryByYonQL(sql, "ustock");
    if (result.length > 0) {
      orderType = "st_othinrecord";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    //采购到货
    sql = "select id,id mainId,org.name orgName,code billCode,vouchdate vouchDate  from pu.arrivalorder.ArrivalOrder  where code=" + code;
    result = ObjectStore.queryByYonQL(sql, "upu");
    if (result.length > 0) {
      orderType = "pu_arrivalorder";
      domain = "upu";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    //完工报告
    sql = "select id,id mainId,orgId.name orgName,code billCode,vouchdate vouchDate from po.finishedreport.FinishedReport where code=" + code;
    result = ObjectStore.queryByYonQL(sql, "productionorder");
    if (result.length > 0) {
      orderType = "po_finished_report";
      domain = "productionorder";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    //销售发货
    sql = "select id from 			voucher.delivery.DeliveryVoucher  where   code=" + code;
    result = ObjectStore.queryByYonQL(sql, "udinghuo");
    if (result.length > 0) {
      orderType = "voucher_delivery";
      domain = "udinghuo";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    sql = "select id,id mainId,inorg.name orgName, code billCode,vouchdate vouchDate from st.transferapply.TransferApply where code=" + code;
    result = ObjectStore.queryByYonQL(sql, "ustock");
    if (result.length > 0) {
      orderType = "st_transferapply";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    sql = "select id,id mainId,outorg.name orgName, code billCode,vouchdate vouchDate  from st.storeout.StoreOut where code=" + code;
    result = ObjectStore.queryByYonQL(sql, "ustock");
    if (result.length > 0) {
      orderType = "st_storeout";
      return { domain: domain, orderType: orderType, orderId: result[0].id };
    }
    return { result: null };
  }
}
exports({ entryPoint: MyAPIHandler });