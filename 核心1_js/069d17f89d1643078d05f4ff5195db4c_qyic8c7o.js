let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取商机子表产品线明细数据
    let sql =
      "select id,product.code wuliaobianma,product.name chanpinlingyu,manageClass.name ziduan4,productLine.name chanpinxian,unitPrice danjia,num shuliang,discount zhekou,money jinexiaojisuan,'Insert' _status from sfa.oppt.OpptItem where opptId='" +
      request.opptId +
      "'";
    let res = ObjectStore.queryByYonQL(sql, "yycrm");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });