let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var ch = param.data[0].materialSourceList;
    if (undefined != ch && ch.length > 0) {
      ch.forEach((data) => {
        var chch = data.mixtureConfigList;
        if (undefined != chch && chch.length > 0) {
          //先根据物料编码判断在原材需用量是否存在
          chch.forEach((chchdata) => {
            var raw_materialRes = ObjectStore.queryByYonQL('select id from GT9144AT102.GT9144AT102.raw_material where code="' + chchdata.materialCode + '"');
            if (undefined != raw_materialRes && raw_materialRes.length > 0) {
              //查找数据库查出相同编码的统计量
              var totalNeedsSql = "select totalNeed from GT9144AT102.GT9144AT102.mixtureConfig where materialCode='" + chchdata.materialCode + "'";
              var raw_materialResTotal = ObjectStore.queryByYonQL(totalNeedsSql);
              if (raw_materialResTotal.length > 0) {
                var raw_materialResTotals = 0;
                raw_materialResTotal.forEach((data) => {
                  raw_materialResTotals += data.totalNeed;
                });
                var updateObject = { id: raw_materialRes[0].id, total_demand: raw_materialResTotals };
                ObjectStore.updateById("GT9144AT102.GT9144AT102.raw_material", updateObject);
              }
            } else {
              var object = { code: chchdata.materialCode, Product: chchdata.material, type: chchdata.spe_model_name, calculate: chchdata.Unit_name, total_demand: chchdata.totalNeed };
              ObjectStore.insert("GT9144AT102.GT9144AT102.raw_material", object, "GT9144AT102");
            }
          });
        }
      });
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });