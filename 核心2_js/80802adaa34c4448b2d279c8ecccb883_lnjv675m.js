let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取资金名称
    let code = request.code;
    //通过资金编码获取主表整行数据
    let func1 = extrequire("GT35175AT8.dataQuery.queryByOneCondition");
    let res1 = func1.execute({ code: code });
    let id = res1.res[0].id;
    let fund_total = res1.res[0].fund_total;
    //获取该主表所有分配子表切块金额总和
    let sql = "select sum(fund_loc) from GT35175AT8.GT35175AT8.HyFund_allocations where HyFund_MTB = " + id;
    let res2 = ObjectStore.queryByYonQL(sql, "developplatform");
    var res = 0;
    if (res2 !== undefined && res2.length !== 0) {
      res = res2[0].fund_loc;
    }
    return { res: res, fund_total: fund_total };
  }
}
exports({ entryPoint: MyAPIHandler });