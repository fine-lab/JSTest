let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let address = request.url;
    let baseOrg = request.baseOrg;
    let startDate = request.startDate;
    let endDate = request.endDate;
    let sql = "";
    let domain = "ustock";
    if (address == "productionorder_list" || address.indexOf("productionorder") > -1) {
      //生产订单
      sql =
        "select id,orderId.id mainId,produceDate producedate,batchNo batchno ,productId.unit.name unitName,expirationDate invaliddate,quantity materialNum,orderId.orgId.name orgName,orderId.code billCode, orderId.vouchdate vouchDate,productId materialId,productId.code materialCode,productId.name materialName     " +
        "from po.order.OrderProduct where orderId.bizType='0' and orderId.status = 1 and orderId.vouchdate >= '" +
        startDate +
        "'  and orderId.vouchdate <= '" +
        endDate +
        "'";
      domain = "productionorder";
      if (baseOrg != undefined) {
        sql += " and orderId.orgId ='" + baseOrg + "'";
      }
      sql += "order by orderId.vouchdate desc";
    } else if (address == "purinrecord_list" || address.indexOf("purinrecord") > -1) {
      //采购入库
      sql =
        "select id,mainid.id mainId,mainid.purchaseOrg.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate," +
        "qty materialNum,unit.name unitName,product materialId,product.cCode materialCode,product.cName materialName,product.id materialId from st.purinrecord.PurInRecords " +
        "where mainid.status = 1  and mainid.vouchdate >= '" +
        startDate +
        "'  and mainid.vouchdate <= '" +
        endDate +
        "'  ";
      if (baseOrg != undefined) {
        sql += " and mainid.org ='" + baseOrg + "'";
      }
      sql += "order by mainid.vouchdate desc";
    } else if (address == "subcontractorder_list" || address.indexOf("subcontractorder") > -1) {
      //委外订单
      sql =
        "select id,orderId.id mainId,produceDate producedate,batchNo batchno ,productId.unit.name unitName,expirationDate invaliddate,quantity materialNum,orderId.orgId.name orgName,orderId.code billCode, orderId.vouchdate vouchDate,productId materialId,productId.code materialCode,productId.name materialName ,quantity  materialNum  " +
        "from po.order.OrderProduct where orderId.bizType='1' and orderId.status = 1 and orderId.vouchdate >= '" +
        startDate +
        "'  and orderId.vouchdate <= '" +
        endDate +
        "'";
      domain = "productionorder";
      if (baseOrg != undefined) {
        sql += " and orderId.orgId ='" + baseOrg + "'";
      }
      sql += "order by orderId.vouchdate desc";
    } else if (address == "storeprorecord_list" || address.indexOf("storeprorecord") > -1) {
      //产品入库列表查询
      sql =
        "select id,mainid.id mainId,mainid.org.name orgName,mainid.code billCode,mainid.vouchdate vouchDate,batchno,producedate,invaliddate,qty " +
        "materialNum,product.oUnitId.name unitName,product materialId,product.cCode materialCode,product.cName materialName,product.id materialId from st.storeprorecord.StoreProRecords where " +
        "mainid.status = 1 and mainid.vouchdate >= '" +
        startDate +
        "'  and mainid.vouchdate <= '" +
        endDate +
        "' ";
      if (baseOrg != undefined) {
        sql += " and mainid.org ='" + baseOrg + "'";
      }
      sql += "order by mainid.vouchdate desc";
    } else {
      let apiResponse = [];
      return { apiResponse };
    }
    let result = [];
    let apiResponse = ObjectStore.queryByYonQL(sql, domain);
    if (apiResponse != undefined && apiResponse.length > 0) {
      for (let i = 0; i < apiResponse.length; i++) {
        let udiMaterial = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.sy01_udi_product_infov3", { product: apiResponse[i].materialId });
        if (udiMaterial != null && udiMaterial.length > 0) {
          result.push(apiResponse[i]);
        }
      }
    }
    return { apiResponse: result };
  }
}
exports({ entryPoint: MyAPIHandler });