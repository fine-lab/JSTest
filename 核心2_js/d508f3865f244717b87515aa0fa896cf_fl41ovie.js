let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查询表1
    var sql = "select materialCode,Product as material,spe_model as type,Unit,(totalNeed - mixNum) as total " + " from GT9144AT102.GT9144AT102.materialExpense group by Product";
    var res1 = ObjectStore.queryByYonQL(sql);
    // 查询表2
    var sql2 = "select materialCode,material as material,spe_model as type,Unit,sum(totalNeed) as total " + " from GT9144AT102.GT9144AT102.mixtureConfig group by material";
    var res2 = ObjectStore.queryByYonQL(sql2);
    // 对两表查询结果处理，数据物料编码相同合并
    let list = res1.reduce((acc, cur) => {
      let target = acc.find((e) => e.material === cur.material);
      if (target) {
        // 对于编码相同的处理
        target.total = target.total + cur.total;
      } else {
        acc.push(cur);
      }
      return acc;
    }, res2);
    debugger;
    var result = ObjectStore.queryByYonQL("select id,pubts from GT9144AT102.GT9144AT102.material_proportion where pubts <> null ");
    result.map((r) => {
      var object = { id: r.id, pubts: r.pubts };
      var res = ObjectStore.deleteById("GT9144AT102.GT9144AT102.material_proportion", object);
    });
    for (var i = 0; i < list.length; i++) {
      var object = { material: list[i].material, total: list[i].total, type: list[i].type };
      ObjectStore.insert("GT9144AT102.GT9144AT102.material_proportion", object, "5d56fbfc");
    }
    // 返回数据
    return { result: list };
  }
}
exports({ entryPoint: MyAPIHandler });