let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var id = param.data[0].TaskorderdetailsList[0].id;
    // 更新条件
    var object = { id: id, Productionworknumber: "2" };
    var res = ObjectStore.updateById("GT102159AT2.GT102159AT2.Taskorderdetails", object, "63c6c7ed");
    var sql = "select * from GT102159AT2.GT102159AT2.Taskorderdetails where id=" + id + "";
    var res22 = ObjectStore.queryByYonQL(sql);
    return {};
  }
}
exports({ entryPoint: MyTrigger });