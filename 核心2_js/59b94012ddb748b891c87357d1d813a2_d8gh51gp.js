let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var entryPeriodTime = request.EntryPeriod;
    entryPeriodTime = entryPeriodTime != undefined ? entryPeriodTime : 0;
    var code = request.code;
    code = code != undefined ? code : 0;
    var values = new Array();
    //查询主表
    var sqlSelZ = "select * from AT15F164F008080007.AT15F164F008080007.DetectOrder";
    if (entryPeriodTime != 0 && code != 0) {
      sqlSelZ = sqlSelZ + " where importData like '" + entryPeriodTime + "' and code = '" + code + "'";
    } else if (code != 0) {
      sqlSelZ = sqlSelZ + " where code = '" + code + "'";
    } else if (entryPeriodTime != 0) {
      sqlSelZ = sqlSelZ + " where importData like '" + entryPeriodTime + "'";
    }
    var resmain = ObjectStore.queryByYonQL(sqlSelZ, "developplatform");
    for (var i = 0; i < resmain.length; i++) {
      var main = resmain[i];
      var mainId = resmain[i].id;
      //查询子表
      var sqlBomid = "select * from AT15F164F008080007.AT15F164F008080007.BOMImport where DetectOrder_id = '" + mainId + "'";
      //过滤是委外的数据
      sqlBomid = sqlBomid + " and billOfMaterial in (select id from AT15F164F008080007.AT15F164F008080007.BillOfMaterial where inspectType = '01') ";
      var resBom = ObjectStore.queryByYonQL(sqlBomid, "developplatform");
      if (resBom.length != 0) {
        main.bodys = resBom;
      }
      values.push(main);
    }
    return { values };
  }
}
exports({ entryPoint: MyAPIHandler });