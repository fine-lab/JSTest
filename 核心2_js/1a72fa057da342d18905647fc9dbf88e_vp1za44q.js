let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.selectDatas[0].organizationId;
    //查询收样
    var sampleSql = "select * from	epub.accountbook.AccountBook where accentity = '" + orgId + "'";
    var sampleRes = ObjectStore.queryByYonQL(sampleSql, "fiepub");
    if (sampleRes.length == 0) {
      throw "该单据的收样组织没有配置账簿，请维护";
    }
    var zhbcode = sampleRes[0].code;
    return { zhbcode };
  }
}
exports({ entryPoint: MyAPIHandler });