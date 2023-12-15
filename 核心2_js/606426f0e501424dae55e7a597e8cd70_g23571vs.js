let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var sql = "select * from GT54604AT1.GT54604AT1.marke_verification where verifystate = 2 ";
    var res = ObjectStore.queryByYonQL(sql);
    var count = 0;
    var flag = "false";
    for (var j = 0; j < res.length; j++) {
      var detailsSql =
        "select * from GT54604AT1.GT54604AT1.write_off_details where marke_verification_id = " +
        res[j].id +
        " and market_application = " +
        request.applicationId +
        " and expense_type = " +
        request.expenseType;
      var detailsRes = ObjectStore.queryByYonQL(detailsSql);
      if (detailsRes.length > 0) {
        for (var i = 0; i < detailsRes.length; i++) {
          //控制当前同市场费申请单，同费用类型是否清零，1为清零，清零后，不可以在申请
          if (detailsRes[i].eliminate === "1") {
            return { res: flag };
          } else {
            count = count + Number(detailsRes[i].appliedWriteOffAmount);
          }
        }
      }
    }
    return { res: count };
  }
}
exports({ entryPoint: MyAPIHandler });