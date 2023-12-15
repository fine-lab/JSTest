let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //入库单号
    var stocknum = request.stocknum;
    //放行单主键
    var idnumber = request.idnumber;
    //放行单子表数据
    var bodyDatas = request.bodyDatas;
    if (bodyDatas.length == 0) {
      throw new Error("所选入库单号子表数据为空，请检查！");
    }
    for (var i = 0; i < bodyDatas.length; i++) {
      let bodyData = bodyDatas[i];
      var queryBodysql = "select quaReleMenu_id from GT101792AT1.GT101792AT1.quaReleMater where dr=0 and sourcechild_id = '" + bodyData.sourcechild_id + "'";
      var bodyrst = ObjectStore.queryByYonQL(queryBodysql, "developplatform");
      if (idnumber === undefined && bodyrst.length > 0) {
        throw new Error("所选入库单号子表已存在质量放行单，不可再次添加！");
      } else if (idnumber !== undefined && idnumber != bodyrst[0].quaReleMenu_id) {
        throw new Error("所选入库单号子表已存在质量放行单，不可再次添加！");
      }
    }
    return { idnumber };
  }
}
exports({ entryPoint: MyAPIHandler });