let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let result = {};
    let func = extrequire("FA.billChange.defToAttrextBack");
    let configMap = func.execute();
    let { defineToAttrextMapping } = configMap;
    let snAttrCode = defineToAttrextMapping["define1"] || "attrext3";
    //获取参数 SN
    result.isPass = true;
    let snValues = request.snValues;
    let billCodes = request.billCodes;
    let snInSqlCond = "('" + snValues.join("','") + "')";
    let codeInSqlCond = "('" + billCodes.join("','") + "')";
    //根据sn 获取数据库中是否有相同数据
    var yonsql =
      "select fixedAssetsInfoCharacter." +
      snAttrCode +
      ",code from fa.fixedasset.FixedAssetsInfo  where fixedAssetsInfoCharacter." +
      snAttrCode +
      " in " +
      snInSqlCond +
      " and code not in " +
      codeInSqlCond;
    var res = ObjectStore.queryByYonQL(yonsql, "yonyoufi");
    if (res && res.length > 0) {
      result.isPass = false;
      result.repeatInfo = res;
    }
    //校验固定资产变动单中是否有重复项
    if (result.isPass) {
      var changBillSql =
        "select code as '变动单号',details.extendDefine1 as SN,details.assetid.code as '资产编码'  from fa.changebill.ChangeBillVO left join fa.changebill.ChangeBillDetailVO details on details.changebill = id where status <> 1 and details.extendDefine1 in " +
        snInSqlCond +
        " and details.assetid.code not in " +
        codeInSqlCond;
      var changCheckRes = ObjectStore.queryByYonQL(changBillSql, "yonyoufi");
      if (changCheckRes && changCheckRes.length > 0) {
        result.isPass = false;
        result.repeatInfo = changCheckRes;
      }
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });