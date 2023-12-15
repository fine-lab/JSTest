let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let warehouse = request.warehouse; //仓库主键
    let rack = request.location; //货位主键
    let tenantId = ObjectStore.user().tenantId;
    let orgId = request.org;
    let userId = ObjectStore.user().id;
    let sql = "";
    sql =
      "select *,warehouse.name warehouse_name,location.name location_name,location.code cscode,batchnoid pk_batchcode," +
      "productn.name product_cName,productn.code product_cCode,productn.name product_name,productn.model product_model," +
      "productn.modelDescription product_modelSpec,productn.manufacturer cproductorname,productskun productsku," +
      "productn.unit.name unitName,acolytesUnit.name acolytesUnit_name" +
      " from stock.currentstock.CurrentStockLocation CurrentStockLocation " +
      " left join warehouse on CurrentStockLocation.warehouse=warehouse.id " +
      " left join location on CurrentStockLocation.location=location.id " +
      " left join productn on CurrentStockLocation.productn=productn.id" +
      " left join productn.unit on CurrentStockLocation.unit = productn.unit.id" +
      " left join batchnoid on CurrentStockLocation.batchnoid = batchnoid.id" +
      " left join acolytesUnit on CurrentStockLocation.acolytesUnit=acolytesUnit.id " +
      " where org='" +
      orgId +
      "' and warehouse='" +
      warehouse +
      "' and currentqty is not null and currentqty > 0 ";
    if (!!rack) {
      sql += " and location='" + rack + "'";
    }
    sql += " order by pubts asc ";
    var recordList = ObjectStore.queryByYonQL(sql, "ustock");
    return { recordList };
  }
}
exports({ entryPoint: MyAPIHandler });