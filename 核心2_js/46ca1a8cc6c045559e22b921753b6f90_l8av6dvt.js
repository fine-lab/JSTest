let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var businessKey = request.businessKey;
    var userCode = request.userCode;
    var processDefinitionKey = request.processDefinitionKey;
    var tenantCode = request.tenantCode;
    var activityId = request.activityId;
    //记录请求数据
    ObjectStore.insert("GT65292AT10.GT65292AT10.prelog", { new1: JSON.stringify(request) });
    //非指定环节返回true
    if (activityId != "approveUserTask_1ca02c7a1d6d987fb91393852cae9f23") {
      result = { desc: "OK", msgSuccess: true };
      return result;
    }
    // 单据id
    var id = businessKey.split("_")[1];
    //单据类型
    var businessType = businessKey.split("_")[0];
    //非指定单据类型返回true
    if (businessType != "55b3013d") {
      result = { desc: "OK", msgSuccess: true };
      return result;
    }
    try {
      var res = ObjectStore.queryByYonQL("select *,(select * from PresaleA_1List) PresaleA_1List from GT65292AT10.GT65292AT10.PresaleAppon where id ='" + id + "'");
    } catch (err) {
      return { err };
    }
    var result = { desc: "售前支持顾问不能为空", msgSuccess: false };
    if (res != null && res.length > 0) {
      if (!!res[0].PresaleA_1List && res[0].PresaleA_1List.length > 0) {
        for (var i in res[0].PresaleA_1List) {
          if (!res[0].PresaleA_1List[i].FormerSupportStaff) {
            var result = { desc: "售前支持顾问ID不能为空", msgSuccess: false };
            ObjectStore.insert("GT65292AT10.GT65292AT10.prelog", { new1: JSON.stringify(result) });
            return result;
          }
        }
        result = { desc: "OK", msgSuccess: true };
      }
    }
    return result;
  }
}
exports({ entryPoint: MyAPIHandler });