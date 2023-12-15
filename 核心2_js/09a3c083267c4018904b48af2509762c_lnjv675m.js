let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取资金名称
    let HyFund_cutFk = request.HyFund_cutFk;
    //通过资金名称获取主表整行数据
    let func1 = extrequire("GT35175AT8.dataQuery.queryByOneCondition");
    let res1 = func1.execute({ fund_name: HyFund_cutFk });
    let id = res1.res[0].id;
    //获取该主表所有切块子表切块金额总和
    let sql = "select sum(fund_loc) from GT35175AT8.GT35175AT8.HyFund_cut	where HyFund_cutFk = " + id;
    let res2 = ObjectStore.queryByYonQL(sql, "developplatform");
    var res;
    if (res2 === undefined || res2.length === 0 || res2.size) {
      res = 0;
    } else {
      res = res2[0].fund_loc;
    }
    return { res: res };
  }
}
exports({ entryPoint: MyAPIHandler });