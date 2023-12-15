let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    //查询收样
    var sampleSql = "select * from	epub.accountbook.AccountBook where accentity = '" + orgId + "'";
    var sampleRes = ObjectStore.queryByYonQL(sampleSql, "fiepub");
    if (sampleRes.length == 0) {
      throw "该单据的收样组织没有配置账簿，请维护";
    }
    var zhbcode = sampleRes[0].code;
    //调用查询员工接口
    var mobile = "18372753151";
    return { code: zhbcode, mobile: mobile };
  }
}
exports({ entryPoint: MyAPIHandler });