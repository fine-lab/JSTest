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
    // 单据id
    var id = businessKey.split("_")[1];
    //单据类型
    var businessType = businessKey.split("_")[0];
    //售前业绩单确认环节
    if (businessType == "4a52fcd3") {
      result = { desc: "OK", msgSuccess: true };
      if (activityId == "approveUserTask_167eb12539680a34c4eb3e5a970aa094" || activityId == "approveUserTask_ae34d68a3962f65ee13afafcf8452fc5") {
        var res = ObjectStore.queryByYonQL("select *,(select * from oppt_adviser_gatherList) oppt_adviser_gather from GT65292AT10.GT65292AT10.oppt_support_collect where id ='" + id + "'");
        if (res != null && res.length > 0) {
          if (!!res[0].oppt_adviser_gather && res[0].oppt_adviser_gather.length > 0) {
            for (var i in res[0].oppt_adviser_gather) {
              if (res[0].oppt_adviser_gather[i].contribution_confirm != "2") {
                var result = { desc: "业绩单贡献度未确认，请联系售前顾问确认贡献度", msgSuccess: false };
                return result;
              }
            }
          }
        }
      }
      ObjectStore.insert("GT65292AT10.GT65292AT10.prelog", { new1: JSON.stringify(res) });
      return result;
    }
    //售前资源申请单
    //非指定单据类型返回true
    if (businessType != "55b3013d") {
      result = { desc: "OK", msgSuccess: true };
      return result;
    }
    var activityIdList = [
      "approveUserTask_877d60852621830a5809474c04022f7f",
      "approveUserTask_3971c1319a30ffa51c1a68d24e33a6b0",
      "approveUserTask_fa6ecfb3d4416ea7cf4c8fb460c9cabf",
      "approveUserTask_fd522e96f8ca8eb240d709c5dce125fa",
      "approveUserTask_d6a6daa5cc3f856db772b40e3f21771b"
    ];
    //非指定环节返回true
    if (activityIdList.indexOf(activityId) == -1) {
      result = { desc: "OK", msgSuccess: true };
      return result;
    }
    try {
      var res = ObjectStore.queryByYonQL("select *,(select * from PresaleA_1List) PresaleA_1List from GT65292AT10.GT65292AT10.PresaleAppon where id ='" + id + "'" + "and tenant_id='youridHere'");
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