let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let func1 = extrequire("ST.api001.getToken");
    let res = func1.execute(require);
    let token = res.access_token;
    let headers = { "Content-Type": "application/json;charset=UTF-8" };
    // 调出仓库
    var outwarehouse = param.OutWarehouse;
    // 调入仓库
    var inwarehouse = param.InWarehouse;
    // 查询调入仓库
    let InSql = "select code from aa.warehouse.Warehouse where id = '" + inwarehouse + "'";
    let inwarehouseRes = ObjectStore.queryByYonQL(InSql, "productcenter");
    var inwarehouseCode = inwarehouseRes[0].code;
    // 查询调出仓库
    let OutSql = "select code from aa.warehouse.Warehouse where id = '" + outwarehouse + "'";
    let outwarehouseRes = ObjectStore.queryByYonQL(OutSql, "productcenter");
    var outwarehouseCode = outwarehouseRes[0].code;
    return { OutInWarehouseReturn: { inwarehouseCode: inwarehouseCode, outwarehouseCode: outwarehouseCode } };
  }
}
exports({ entryPoint: MyTrigger });