let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let address = request.url;
    let startDate = request.startDate;
    let endDate = request.endDate;
    let baseOrgId = request.baseOrgId;
    if (startDate == undefined) {
      startDate = "";
    }
    if (endDate == undefined) {
      endDate = "";
    }
    let result = [];
    let sql = "";
    let domain = "ustock";
    if (address == "yonbip_scm_storeprorecord_list" || address.indexOf("storeprorecord") > -1) {
      //产品入库单
      sql = "select id,id mainId,org.name orgName,code billCode,vouchdate vouchDate from st.storeprorecord.StoreProRecord  where  1=1";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and org.id ='" + baseOrgId + "'";
      }
    } else if (address == "yonbip_scm_purinrecord_list" || address.indexOf("purinrecord") > -1) {
      //采购入库
      sql = "select id,id mainId,purchaseOrg.name orgName,code billCode,vouchdate vouchDate from st.purinrecord.PurInRecord  where  1=1";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and purchaseOrg.id ='" + baseOrgId + "'";
      }
    } else if (address == "yonbip_scm_salesout_list" || address.indexOf("salesout") > -1) {
      //销售出库单
      sql = "select id,id mainId,org.name orgName,code billCode,vouchdate vouchDate,cust.name customerName,memo remark from st.salesout.SalesOut  where  1=1 ";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and org.id ='" + baseOrgId + "'";
      }
    } else if (address == "yonbip_scm_othinrecord_list" || address.indexOf("othinrecord") > -1) {
      //期初库存（其他入库单的一种）
      sql = "select id,id mainId,org.name orgName,code billCode,vouchdate vouchDate from 		st.othinrecord.OthInRecord  where  1=1 ";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and org.id ='" + baseOrgId + "'";
      }
    } else if (address == "yonbip_scm_arrivalorder_list" || address.indexOf("arrivalorder") > -1) {
      //采购到货
      sql = "select id,id mainId,org.name orgName,code billCode,vouchdate vouchDate from pu.arrivalorder.ArrivalOrder  where 1=1 ";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and org.id ='" + baseOrgId + "'";
      }
      domain = "upu";
    } else if (address == "yonbip_sd_voucherdelivery_list" || address.indexOf("voucherdelivery") > -1) {
      //销售发货
      sql =
        "select id,id mainId,stockOrgId.name orgName,code billCode,agentId.name customerName,vouchdate vouchDate,shippingMemo remark from 			voucher.delivery.DeliveryVoucher  where  (statusCode = 'PARTOUTSTOCKED' or statusCode = 'DELIVERING')  ";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and stockOrgId.id ='" + baseOrgId + "'";
      }
      domain = "udinghuo";
      if (startDate != undefined && startDate != "" && startDate != null) {
        sql += " and vouchdate >='" + startDate + "'";
      }
      if (endDate != undefined && endDate != "" && endDate != null) {
        sql += " and vouchdate <='" + endDate + "'";
      }
      sql += " and status = 1  order by vouchdate desc";
      result = ObjectStore.queryByYonQL(sql, domain);
      return { apiResponse: result };
    } else if (address === "dbdd") {
      sql = "select id,id mainId,inorg.name orgName, code billCode,vouchdate vouchDate from st.transferapply.TransferApply where 1=1";
    } else if (address === "dcck") {
      sql = "select id,id mainId,outorg.name orgName, code billCode,vouchdate vouchDate  from st.storeout.StoreOut where 1=1";
    }
    if (startDate != undefined && startDate != "" && startDate != null) {
      sql += " and vouchdate >='" + startDate + "'";
    }
    if (endDate != undefined && endDate != "" && endDate != null) {
      sql += " and vouchdate <='" + endDate + "'";
    }
    sql += " order by vouchdate desc";
    result = ObjectStore.queryByYonQL(sql, domain);
    return { apiResponse: result };
  }
}
exports({ entryPoint: MyAPIHandler });