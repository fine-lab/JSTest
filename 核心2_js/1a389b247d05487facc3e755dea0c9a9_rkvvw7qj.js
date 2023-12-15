let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取前端传递过来的仓库id
    var stockId = request.stockId;
    // 通过youngsql查询到id与仓库id匹配的bWMS字段
    let sqlsti = "select bWMS from aa.warehouse.Warehouse where id = '" + stockId + "'";
    var resdatasti = ObjectStore.queryByYonQL(sqlsti, "productcenter");
    var bWMS = resdatasti[0].bWMS;
    // 返回到前端
    return { bWMS: bWMS };
  }
}
exports({ entryPoint: MyAPIHandler });