let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var deptid = request.deptid;
    var agentId = request.agentId;
    var sql =
      "select  b.agentId , code  from  marketing.credit.CreditTargetDomain  " +
      " inner join marketing.credit.CreditTargetDomainItem b  on b.targetDomainId = id " +
      " where  targetType = '0,2'  and  isEnabled = 'true'  and b.departmentId = '" +
      deptid +
      "'  and  b.agentId = '" +
      agentId +
      "'  "; //
    var creditRes = ObjectStore.queryByYonQL(sql, "marketingbill");
    var res = {};
    if (creditRes == null || creditRes.length == 0) {
      res.flag = false;
    } else {
      res.flag = true;
      res.code = creditRes[0].code;
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });