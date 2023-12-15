let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取参数 SN
    let SN = request.snValue;
    var code = request.code;
    //根据sn 获取数据库中是否有相同数据
    var yonsql = "select fixedDefines.attrext5 from fa.fixedasset.FixedAssetsInfo left join fixedDefines where fixedDefines.attrext5 = '" + SN + "' and code != '" + code + "'";
    var res = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
    if (res && res.length > 0) {
      throw new Error("SN编码重复：" + SN);
    }
  }
}
exports({ entryPoint: MyAPIHandler });