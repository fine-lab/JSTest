let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let paramRequest = JSON.parse(param.requestData);
    let item79tf = paramRequest.item79tf; //组织当前账务年度(个人)
    let item83rf = paramRequest.item83rf; //当前年度(个人)
    let JoinStockFlag = paramRequest.JoinStockFlag; //入股标识(个人)
    let item68ce = paramRequest.item68ce; //组织当前账务年度(法人)
    let item70yk = paramRequest.item70yk; //当前年度(法人)
    JoinStockFlag = paramRequest.JoinStockFlag; //入股标识(法人)
    if (JoinStockFlag !== "0") {
      throw new Error("\n已经入股！");
    }
    if (item79tf !== item83rf) {
      throw new Error("\n该组织账务年度不是当前年度");
    }
    if (item68ce !== item70yk) {
      throw new Error("\n该组织账务年度不是当前年度");
    }
    //校验社员是否已经在初始化子表中  如果在就不能弃审（个人）
    let AccInitializationDetailSql = "select id from GT104180AT23.GT104180AT23.AccInitializationDetail where coopMember = '" + paramRequest.id + "' and dr = 0";
    let AccInitializationDetailRes = ObjectStore.queryByYonQL(AccInitializationDetailSql);
    if (AccInitializationDetailRes.length > 0) {
      throw new Error("\n该社员已经存在于账户期初的初始化名单中，\n请先在'账户期初'应用中将其移除");
    }
    //校验社员是否已经在初始化子表中  如果在就不能弃审（法人）
    AccInitializationDetailSql = "select id from GT104180AT23.GT104180AT23.AccInitializationDetail where coopMember_C = '" + paramRequest.id + "' and dr = 0";
    AccInitializationDetailRes = ObjectStore.queryByYonQL(AccInitializationDetailSql);
    if (AccInitializationDetailRes.length > 0) {
      throw new Error("\n该社员已经存在于账户期初的初始化名单中，\n请先在'账户期初'应用中将其移除");
    }
    let paramRetrun = param.return;
    let z_CoopMember = paramRequest.z_CoopMember;
    let data = {
      id: paramRequest.z_CoopMember
    };
    let request = {};
    request.uri = "/yonbip/digitalModel/customerdoc/stop";
    request.body = { data: data };
    let func = extrequire("GT34544AT7.common.baseOpenApi");
    let res = func.execute(request).res;
    if (res.code !== "200") {
      throw new Error("取消审核失败！请联系管理员！" + JSON.stringify(res));
    }
    return { res };
  }
}
exports({ entryPoint: MyTrigger });