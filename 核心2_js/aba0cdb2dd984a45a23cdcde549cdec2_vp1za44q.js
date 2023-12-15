let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //查询自定义档案维护
    var daId = request.impoidrtTeam;
    var zdydaansql = "select * from 	bd.basedocdef.CustomerDocVO where id ='" + daId + "'";
    var zdydaanponse = ObjectStore.queryByYonQL(zdydaansql, "ucfbasedoc");
    var warehousename = zdydaanponse[0].name;
    //查仓库
    var warehouseSql = "select * from	aa.warehouse.Warehouse where name ='" + warehousename + "'";
    var warehouseponse = ObjectStore.queryByYonQL(warehouseSql, "productcenter");
    if (warehouseponse.length == 0) {
      throw new Error("仓库【" + warehousename + "】没有维护导入小组对应的仓库");
    }
    var isBatchNumberManage = warehouseponse[0].isGoodsPosition;
    if (isBatchNumberManage == "true") {
      throw new Error("仓库【" + warehousename + "】启用了货位管理");
    }
    var warehouObj = warehouseponse[0];
    return { warehouObj };
  }
}
exports({ entryPoint: MyAPIHandler });