let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var txtID = request.txtID;
    //拼接sql
    var sql = "select id from GT35175AT8.GT35175AT8.HyFund_MTB where up_fund_allocations_id = " + txtID;
    //执行sql
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    var id = res[0].id;
    // 修改分配子表数据
    var object = { id: txtID, create_downfund: "1", downfund_id: id, release: "ok" };
    var res1 = ObjectStore.updateById("GT35175AT8.GT35175AT8.HyFund_allocations", object, "87cdedf9");
    return { res1: res1 };
  }
}
exports({ entryPoint: MyAPIHandler });