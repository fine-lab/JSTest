let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result = {};
    //获取参数 SN
    result.isPass = true;
    let snValues = request.snValues;
    let billCodes = request.billCodes;
    let snInSqlCond = "('" + snValues.join("','") + "')";
    let codeInSqlCond = "('" + billCodes.join("','") + "')";
    //根据sn 获取数据库中是否有相同数据
    var yonsql = "select fixedDefines.define1,code from fa.fixedasset.FixedAssetsInfo left join fixedDefines where fixedDefines.define1 in " + snInSqlCond + " and code not in " + codeInSqlCond;
    var res = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
    if (res && res.length > 0) {
      result.isPass = false;
      result.repeatInfo = res;
    }
    return result;
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });