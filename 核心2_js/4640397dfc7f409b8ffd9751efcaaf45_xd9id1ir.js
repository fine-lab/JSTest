let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let userId = request.userId;
    let deptId = request.deptId;
    let tfAmount = "";
    if (userId && deptId) {
      try {
        //查询出期初个人借款单  znbzbx.loanbill.LoanBillVO  期初标记：beginningFlag； 借款金额 nloanmny  费用承担部门：vfinacedeptid  查询条件：审核完成
        let jkSQL = "select sum(nloanmny)  from znbzbx.loanbill.LoanBillVO where  status=1 and pk_handlepsn='" + userId + "' ";
        let jkSqlRes = ObjectStore.queryByYonQL(jkSQL, "znbzbx");
        //借款金额
        let nloanmnyVal = "";
        if (jkSqlRes != null && jkSqlRes != undefined && jkSqlRes.length > 0) {
          nloanmnyVal = jkSqlRes[0].nloanmny;
        }
        //查询出个人报销单中所有的合计数值   查询条件：审核完成     移除部门  and vfinacedeptid='"+deptId+"'
        let bxSql =
          "select sum(nexpensemny) from znbzbx.commonexpensebill.CommonExpenseBillVO where status=1 and  pk_handlepsn='" + userId + "' and bustype='1617153120929841157' order by pubts desc ";
        let bxSqlRes = ObjectStore.queryByYonQL(bxSql, "znbzbx");
        //当前报销人所以得报销金额
        let totalAmount = "";
        if (bxSqlRes != null && bxSqlRes != undefined && bxSqlRes.length > 0) {
          totalAmount = bxSqlRes[0].nexpensemny;
        }
        //计算出期末剩余金额
        tfAmount = Number(nloanmnyVal) - Number(totalAmount);
      } catch (e) {
        throw new Error("查询TF个人余额失败：" + e);
      }
    }
    return { version: "getTFAmount", tfAmount: tfAmount };
  }
}
exports({ entryPoint: MyAPIHandler });