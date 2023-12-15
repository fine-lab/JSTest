let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var datas = request.datas;
    //查询内容
    var sql = "select * from st.salesout.SalesOuts where id in ('" + datas.join("','") + "')";
    var res = ObjectStore.queryByYonQL(sql, "ustock");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });