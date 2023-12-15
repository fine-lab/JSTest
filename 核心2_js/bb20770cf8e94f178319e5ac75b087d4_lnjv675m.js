let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let obj = JSON.parse(param.requestData);
    //在审核的时候，需要校验待分配人数和本次分配人数是否一致。
    let AccYear = obj.AccYear; //账务年度
    let baseOrg = obj.org_id; //组织单元
    let sql = "select count(id) from GT104180AT23.GT104180AT23.SurplusAccrualDetailed where dr = 0 and AccYear = '" + AccYear + "' and baseOrg = '" + baseOrg + "'";
    let res = ObjectStore.queryByYonQL(sql);
    res = res[0].id;
    if (res == 0) {
      throw new Error("待分配的账户数量为0，无需进行分配！");
    } else if (res > 0) {
      let YearDistributionDetailedSql = "select count(id) from GT104180AT23.GT104180AT23.YearDistributionDetailed where YearDistribution_id = '" + obj.id + "' and dr = 0";
      let YearDistributionDetailedRes = ObjectStore.queryByYonQL(YearDistributionDetailedSql);
      let YearDistributionDetailedCount = YearDistributionDetailedRes[0].id;
      if (res !== YearDistributionDetailedCount) {
        throw new Error("\n待分配账户数量和本次分配的账户数量不一致，\n请继续录入需要分配的账户");
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });