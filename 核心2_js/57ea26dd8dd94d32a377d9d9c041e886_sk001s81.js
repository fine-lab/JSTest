let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let address = request.url;
    let mainId = request.mainId;
    let result = [];
    let sql = "";
    let domain = "ustock";
    if (address == "yonbip_scm_storeprorecord_list" || address.indexOf("storeprorecord") > -1) {
      //产品入库单
      sql =
        "select id,id sourceautoid,mainid.id sourceid,mainid.org.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,product.oUnitId.name unitName,product.cName materialName,product.id materialId  from st.storeprorecord.StoreProRecords  where  1=1";
    } else if (address == "yonbip_scm_purinrecord_list" || address.indexOf("purinrecord") > -1) {
      //采购入库
      sql =
        "select id,id sourceautoid,mainid.id sourceid,mainid.purchaseOrg.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,unit.name unitName,product.cName materialName,product.id materialId from st.purinrecord.PurInRecords  where  1=1";
    } else if (address == "yonbip_scm_othinrecord_list" || address.indexOf("othinrecord") > -1) {
      //期初库存（其他入库单的一种）
      sql =
        "select id,id sourceautoid, mainid.id sourceid,mainid.org.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,unit.name unitName,product.cName materialName,product.id materialId from 		st.othinrecord.OthInRecords  where  1=1 ";
    } else if (address == "yonbip_scm_salesout_list" || address.indexOf("salesout") > -1) {
      //销售出库单
      sql =
        "select id,id sourceautoid,mainid.id sourceid,mainid.org.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,unit.name unitName,product.cName materialName,product.id materialId,saleStyle sellType from st.salesout.SalesOuts  where  1=1 ";
    } else if (address == "yonbip_scm_arrivalorder_list" || address.indexOf("arrivalorder") > -1) {
      //采购到货
      sql =
        "select id,id sourceautoid,mainid.id sourceid,mainid.org.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,unit.name unitName,product.cName materialName,product.id materialId,totalInQuantity from pu.arrivalorder.ArrivalOrders  where 1=1 ";
      domain = "upu";
    } else if (address == "yonbip_sd_voucherdelivery_list" || address.indexOf("voucherdelivery") > -1) {
      //销售发货
      sql =
        "select id,id sourceautoid,deliveryId.id sourceid,deliveryId.stockOrgId.name orgName,deliveryId.code billCode,deliveryId.vouchdate vouchDate,stockId warehouse,batchNo batchno,productDate producedate,invalidDate invaliddate,subQty materialNum,masterUnitId.name unitName,productId.name materialName,productId.detail.isSerialNoManage isSerialNoManage,productId.id materialId,orderProductType sellType from 		voucher.delivery.DeliveryDetail  where  (deliveryId.statusCode = 'PARTOUTSTOCKED' or deliveryId.statusCode = 'DELIVERING')  ";
      sql += "and subQty >= 1 and deliveryId ='" + mainId + "'";
      domain = "udinghuo";
      result = ObjectStore.queryByYonQL(sql, domain);
      return { apiResponse: result };
    } else if (address === "dbdd") {
      sql =
        "select id,mainid mainId, mainid.code billCode,mainid.inorg.name orgName,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,priceUOM.name unitName,product.cName materialName,product.id materialId,finishoutqty  from st.transferapply.TransferApplys where 1=1";
    } else if (address === "dcck") {
      sql =
        "select id,mainid mainId, mainid.code billCode,mainid.outorg.name orgName,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty materialNum,product.oUnitId.name unitName,product.cName materialName,product.id materialId,finishinqty  from st.storeout.StoreOutDetail where 1=1";
    }
    sql += " and mainid ='" + mainId + "'";
    result = ObjectStore.queryByYonQL(sql, domain);
    if (address == "yonbip_scm/arrivalorder_list" || address.indexOf("arrivalorder") > -1) {
      //采购到货
      let res = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].totalInQuantity < result[i].materialNum) {
          res.push(result[i]);
        }
      }
      if (res.length == 0) {
        throw new Error("到货单已入库！");
      }
      return { apiResponse: res };
    } else if (address == "dbdd") {
      let res = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].finishoutqty < result[i].materialNum) {
          //过滤已出库的单
          res.push(result[i]);
        }
      }
      if (res.length == 0) {
        throw new Error("订单已出库！");
      }
      return { apiResponse: res };
    } else if (address == "dcck") {
      let res = [];
      for (let i = 0; i < result.length; i++) {
        if (result[i].finishinqty < result[i].materialNum) {
          //过滤已入库的单
          res.push(result[i]);
        }
      }
      if (res.length == 0) {
        throw new Error("单据已入库！");
      }
      return { apiResponse: res };
    }
    return { apiResponse: result };
  }
}
exports({ entryPoint: MyAPIHandler });