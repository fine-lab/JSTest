let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let address = request.url;
    let startDate = request.startDate;
    let endDate = request.endDate;
    let sql = "";
    let domain = "ustock";
    if (address == "/yonbip/mfg/productionorder/list" || address.indexOf("productionorder") > -1) {
      //生产订单
      sql =
        "select *,productId.unit.name unitName,expirationDate invaliddate,quantity subQty,orgId.name orgName,orderId.code code, orderId.vouchdate vouchdate,productId.name materialName ,quantity  materialNum  " +
        "from po.order.OrderProduct where orderId.status = 1 and orderId.vouchdate >= '" +
        startDate +
        "'  and orderId.vouchdate <= '" +
        endDate +
        "' order by orderId.vouchdate desc";
      domain = "productionorder";
    } else if (address == "/yonbip/scm/purinrecord/list" || address.indexOf("purinrecord") > -1) {
      //采购入库
      sql =
        "select id,mainid.id mainId,mainid.purchaseOrg.name orgName,mainid.code code,mainid.vouchdate vouchdate,batchno,producedate,invaliddate," +
        "qty materialNum,unit.name unitName,product.cName materialName,product.id materialId from st.purinrecord.PurInRecords " +
        "where mainid.status = 1  and mainid.vouchdate >= '" +
        startDate +
        "'  and mainid.vouchdate <= '" +
        endDate +
        "'  order by mainid.vouchdate desc";
    } else if (address == "/yonbip/scm/storeprorecord/list" || address.indexOf("storeprorecord") > -1) {
      //产品入库列表查询
      sql =
        "select id,mainid.id mainId,mainid.org.name orgName,mainid.code code,mainid.vouchdate vouchdate,batchno,producedate,invaliddate,qty " +
        "materialNum,product.oUnitId.name unitName,product.cName materialName,product.id materialId from st.storeprorecord.StoreProRecords where " +
        "mainid.status = 1 and mainid.vouchdate >= '" +
        startDate +
        "'  and mainid.vouchdate <= '" +
        endDate +
        "' order by mainid.vouchdate desc";
    } else {
      let apiResponse = [];
      return { apiResponse };
    }
    let apiResponse = ObjectStore.queryByYonQL(sql, domain);
    return { apiResponse: apiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });