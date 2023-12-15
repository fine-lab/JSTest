let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    //先查询这个组织是否配置了gsp管理参数，以及gsp是否开启
    let type = request.type;
    let typeIds = [];
    let ySql = "";
    if (type == "st_purchaseorder") {
      ySql = "select billType types from GT22176AT10.GT22176AT10.sy01_gspBillType_billType where fkid = ";
    } else if (type == "voucher_order") {
      ySql = "select saleBillType types from GT22176AT10.GT22176AT10.sy01_gspBillType_saleBillType where fkid = ";
    } else if (type == "st_purinrecord") {
      ySql = "select purInBillType types from GT22176AT10.GT22176AT10.sy01_gspBillType_purInBillType where fkid = ";
    } else if (type == "st_salesout") {
      ySql = "select saleOutBillType types from GT22176AT10.GT22176AT10.sy01_gspBillType_saleOutBillType where fkid = ";
    } else {
      return {
        types: typeIds
      };
    }
    let id = ObjectStore.queryByYonQL("select id from GT22176AT10.GT22176AT10.sy01_gspBillType where org_id = '" + orgId + "'", "sy01");
    if (id.length > 0) {
      id = id[0].id;
      let billTypeRes = ObjectStore.queryByYonQL(ySql + id, "sy01");
      for (let i = 0; i < billTypeRes.length; i++) {
        typeIds.push(billTypeRes[i].types);
      }
      return {
        types: typeIds
      };
    } else {
      return {
        types: typeIds
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});