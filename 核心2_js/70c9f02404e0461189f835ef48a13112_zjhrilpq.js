let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    if (!request.id) return;
    // 获取商品规格
    var sql = "select * from GT8144AT171.GT8144AT171.guige where guigeFk=" + request.id;
    var res = ObjectStore.queryByYonQL(sql);
    // 如果有商品规格 遍历获取商品值
    if (res.length > 0) {
      res.forEach((item, idx) => {
        var sqlval = "select * from GT8144AT171.GT8144AT171.guigezhi where guigezhiFk=" + item.id;
        var resval = ObjectStore.queryByYonQL(sqlval);
        if (resval.length > 0) {
          res[idx].children = resval;
        }
      });
    }
    return { data: res };
  }
}
exports({ entryPoint: MyAPIHandler });