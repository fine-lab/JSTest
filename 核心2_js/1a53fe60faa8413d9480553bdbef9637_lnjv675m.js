let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let AccInitialization = JSON.parse(param.requestData); //社员账户初始化单据
    let InitializationDate = AccInitialization.InitializationDate; //社员账户启用年月
    let org_id = AccInitialization.org_id;
    let AccInitialization_id = AccInitialization.id;
    let AccInitialization_sql = "select count(id) from GT104180AT23.GT104180AT23.AccInitializationDetail where AccInitializationDetailFk = '" + AccInitialization_id + "' and dr = 0";
    let AccInitialization_res = ObjectStore.queryByYonQL(AccInitialization_sql);
    let AccInitialization_count = AccInitialization_res[0].id;
    let MemberAcc_sql = "select count(id) from GT104180AT23.GT104180AT23.MemberAcc where joindate<'" + InitializationDate + "' and JoinStockFlag = 0 and Delflag = 0 and org_id = '" + org_id + "'";
    let MemberAcc_res = ObjectStore.queryByYonQL(MemberAcc_sql);
    let MemberAcc_count = MemberAcc_res[0].id;
    if (AccInitialization_count !== MemberAcc_count) {
      throw new Error("\n待初始化账户数：" + MemberAcc_count + ",本次初始化账户数：" + AccInitialization_count);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });