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
    if (address == "/yonbip/scm/storeprorecord/list" || address.indexOf("storeprorecord") > -1) {
      //产品入库单
      sql =
        "select id,mainid.id mainId,mainid.org.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,product.oUnitId.name unitName,product.cName materialName,product.id materialId  from st.storeprorecord.StoreProRecords  where  1=1";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and mainid.org.id ='" + baseOrgId + "'";
      }
    } else if (address == "/yonbip/scm/purinrecord/list" || address.indexOf("purinrecord") > -1) {
      //采购入库
      sql =
        "select id,mainid.id mainId,mainid.purchaseOrg.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,unit.name unitName,product.cName materialName,product.id materialId from st.purinrecord.PurInRecords  where  1=1";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and mainid.purchaseOrg.id ='" + baseOrgId + "'";
      }
    } else if (address == "/yonbip/scm/salesout/list" || address.indexOf("salesout") > -1) {
      //销售出库单
      sql =
        "select id,mainid.id mainId,mainid.org.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,unit.name unitName,product.cName materialName,product.id materialId from st.salesout.SalesOuts  where  1=1 ";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and mainid.org.id ='" + baseOrgId + "'";
      }
    } else if (address == "/yonbip/scm/arrivalorder/list" || address.indexOf("arrivalorder") > -1) {
      //采购到货
      sql =
        "select id,mainid.id mainId,mainid.org.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,unit.name unitName,product.cName materialName,product.id materialId,totalInQuantity from pu.arrivalorder.ArrivalOrders  where 1=1 ";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and mainid.org.id ='" + baseOrgId + "'";
      }
      domain = "upu";
    } else if (address == "/yonbip/sd/voucherdelivery/list" || address.indexOf("voucherdelivery") > -1) {
      //销售发货
      sql =
        "select id,deliveryId.id mainId,deliveryId.stockOrgId.name orgName,deliveryId.code billCode,deliveryId.vouchdate vouchDate,batchNo batchno,productDate producedate,invalidDate invaliddate,subQty materialNum,masterUnitId.name unitName,productId.name materialName,productId.id materialId from 		voucher.delivery.DeliveryDetail  where  (deliveryId.statusCode = 'PARTOUTSTOCKED' or deliveryId.statusCode = 'DELIVERING')  ";
      if (baseOrgId != undefined && baseOrgId != "" && baseOrgId != null) {
        sql += " and deliveryId.stockOrgId.id ='" + baseOrgId + "'";
      }
      domain = "udinghuo";
      if (startDate != undefined && startDate != "" && startDate != null) {
        sql += " and deliveryId.vouchdate >='" + startDate + "'";
      }
      if (endDate != undefined && endDate != "" && endDate != null) {
        sql += " and deliveryId.vouchdate <='" + endDate + "'";
      }
      sql += " and deliveryId.status = 1  order by deliveryId.vouchdate desc";
      result = ObjectStore.queryByYonQL(sql, domain);
      return { apiResponse: result };
    }
    if (startDate != undefined && startDate != "" && startDate != null) {
      sql += " and mainid.vouchdate >='" + startDate + "'";
    }
    if (endDate != undefined && endDate != "" && endDate != null) {
      sql += " and mainid.vouchdate <='" + endDate + "'";
    }
    sql += " and mainid.status = 1 order by mainid.vouchdate desc";
    result = ObjectStore.queryByYonQL(sql, domain);
    if (address == "/yonbip/scm/arrivalorder/list" || address.indexOf("arrivalorder") > -1) {
      //采购到货
      let res = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].totalInQuantity < result[i].materialNum) {
          //过滤已入库的到货单
          res.push(result[i]);
        }
      }
      return { apiResponse: res };
    }
    return { apiResponse: result };
  }
}
exports({ entryPoint: MyAPIHandler });