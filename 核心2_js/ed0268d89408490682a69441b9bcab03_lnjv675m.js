let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var txtID = param.return.txtID;
    var request = {};
    request.txtID = txtID;
    let func1 = extrequire("GT35175AT8.writeBack.getMainId");
    let res1 = func1.execute(request);
    //主表id
    var id = res1.res.id;
    //修改切块子表数据
    //拼接sql
    var sql = "update GT35175AT8.GT35175AT8.HyFund_MTB set down_fund_MTB = " + id + " create_downfund = " + 1 + "where txtID = " + txtID;
    //执行sql
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    return {};
  }
}
exports({ entryPoint: MyTrigger });