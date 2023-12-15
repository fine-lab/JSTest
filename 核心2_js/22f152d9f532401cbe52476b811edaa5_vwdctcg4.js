let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //中牧U8对接公共脚本，改仓库权限时调整
    //有权限的仓库ID
    var warehouseIds = [2014142475998208, 2014142122431744, 2014141797848320, 2014139695175168, 2014138855969792, 2741236209341440];
    //传入的仓库ID
    var sourceWarehouse = request.warehouse;
    var requestWarehouseIds = [];
    if (sourceWarehouse != undefined && sourceWarehouse.length > 0) {
      //判断原始接口参数传入的仓库是否在设置的权限内，是的话加入
      for (var i = sourceWarehouse.length - 1; i >= 0; i--) {
        var requestWh = sourceWarehouse[i];
        if (warehouseIds.indexOf(requestWh) >= 0) {
          requestWarehouseIds.push(requestWh);
        }
      }
    }
    //未传入的时候取默认
    if (sourceWarehouse === undefined || sourceWarehouse.length == 0) {
      for (var i = warehouseIds.length - 1; i >= 0; i--) {
        requestWarehouseIds.push(warehouseIds[i]);
      }
    }
    return requestWarehouseIds;
  }
}
exports({ entryPoint: MyAPIHandler });