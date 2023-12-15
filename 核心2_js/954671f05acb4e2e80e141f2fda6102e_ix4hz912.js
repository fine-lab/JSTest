let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    extrequire("GT3734AT5.ServiceFunc.logToDB").execute(null, JSON.stringify({ LogToDB: true, logLevel: "DEBUG", logModule: 9, description: "签约变更审核流程", reqt: "zuixin", resp: "" })); //调用领域内函数写日志
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let resp = extrequire("GT3734AT5.APIFunc.doFQYBGApproved").execute({ businessId: businessId });
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });