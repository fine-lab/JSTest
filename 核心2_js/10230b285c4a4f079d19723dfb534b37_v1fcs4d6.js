let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //依据组织id查询大仓库存主表数据
    var querybigWarehSql = " select id from GT83441AT1.GT83441AT1.bigWareStock where dr=0 and org_id='" + request.orgId + "'";
    var bigWarehRes = ObjectStore.queryByYonQL(querybigWarehSql, "developplatform");
    if (bigWarehRes.length == 0) {
      throw new Error("未找到当前组织的【大仓库存】配置信息！");
    }
    //查询大仓库存子表数据
    var querybigWarebSql = " select warehouse from GT83441AT1.GT83441AT1.bigWareStock_b where dr=0 and bigWareStock_id='" + bigWarehRes[0].id + "'";
    var bigWarebRes = ObjectStore.queryByYonQL(querybigWarebSql, "developplatform");
    if (bigWarebRes.length == 0) {
      throw new Error("未找到当前组织的【大仓库存】配置的仓库信息！");
    }
    //拼接仓库查询条件
    var warehousein = ",";
    for (var i = 0; i < bigWarebRes.length; i++) {
      warehousein = warehousein + "'" + bigWarebRes[i].warehouse + "',";
    }
    var newwarehousein = warehousein.substring(1, warehousein.length - 1);
    //依据物料id、组织查询仓库查询对应的现存量信息
    var queryCurrentStockSql =
      " select sum(currentqty) from stock.currentstock.CurrentStock where org='" + request.orgId + "' and product='" + request.proid + "' and warehouse in (" + newwarehousein + ")";
    var currentStockRes = ObjectStore.queryByYonQL(queryCurrentStockSql, "ustock");
    var bigWareStock = 0;
    if (currentStockRes.length > 0) {
      bigWareStock = currentStockRes[0].currentqty;
    }
    return { bigWareStock };
  }
}
exports({ entryPoint: MyAPIHandler });