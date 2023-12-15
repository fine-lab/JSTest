let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    //检测订单主表
    var BOMsql = "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder where id ='" + id + "'";
    var BOMImportponse = ObjectStore.queryByYonQL(BOMsql, "developplatform");
    var BOMDATA = BOMImportponse[0];
    //检测订单子表
    var BOMsqlz = "select * from AT15F164F008080007.AT15F164F008080007.BOMImport where DetectOrder_id ='" + id + "'";
    var BOMImportponsez = ObjectStore.queryByYonQL(BOMsqlz, "developplatform");
    if (BOMImportponsez.length == 0) {
      throw new Error("表体还没有数据");
    }
    var Detect = {};
    Detect.DetectData = BOMDATA;
    Detect.DetectList = BOMImportponsez;
    return { Detect };
  }
}
exports({ entryPoint: MyAPIHandler });