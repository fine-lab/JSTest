let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    debugger;
    //获取参数 SN
    let isPass = true;
    let snValues = param.snValues;
    let billCodes = param.billCodes;
    let snInSqlCond = "('" + snValues.join("','") + "')";
    let codeInSqlCond = "('" + billCodes.join("','") + "')";
    //根据sn 获取数据库中是否有相同数据
    var yonsql = "select freeChId.attrext5 from fa.fixedasset.FixedAssetsInfo where freeChId.attrext5 in " + snInSqlCond + " and code not in " + codeInSqlCond;
    var res = ObjectStore.queryByYonQL(yonsql);
    if (res && res.legth > 0) {
      isPass = false;
    }
    return { isPass: isPass };
  }
}
exports({ entryPoint: MyTrigger });