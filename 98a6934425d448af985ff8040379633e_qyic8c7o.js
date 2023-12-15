let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取人员ID
    let staffId = ObjectStore.user().staffId;
    let state = "待处理";
    let staffName = ObjectStore.user().name;
    //获取人员所在部门编码
    let sql =
      "select id,id as opptinfo,code as opptcode,name as opptinfo_name,headDef.define27 chulizhuangtai,headDef.define28.name Businessattribution_name,customer.name customerinfo,expectSignDate yujiqiandanriqi,expectSignMoney yujiqiandanjine,dept.name fuzerenbumen,ower.name fuzeren,'Insert' _status,'" +
      staffId +
      "' Operator,'" +
      staffName +
      "' Operator_name,opptDate opttime from sfa.oppt.Oppt where headDef.define27='" +
      state +
      "'";
    let res = ObjectStore.queryByYonQL(sql, "yycrm");
    return {
      res
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});