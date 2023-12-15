let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let sql = "select verifystate,merchantid from AT177016BE17B80006.AT177016BE17B80006.merchant_changes where id='" + businessId + "'";
    var res = ObjectStore.queryByYonQL(sql);
    let result = res[0].verifystate;
    let merchant = res[0].merchantid;
    if (result == 2) {
      let body = {
        fullname: "aa.merchant.MerchantDefine",
        data: [{ id: merchant, define16: result }]
      };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "SFA", JSON.stringify(body));
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });