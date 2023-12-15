let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let resp = extrequire("GT3734AT5.ServiceFunc.doForSignFlow").execute(null, JSON.stringify({ businessId: businessId }));
  }
  // 环节结束
  activityComplete(activityEndMessage) {
  }
}
exports({ entryPoint: WorkflowAPIHandler });