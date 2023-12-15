let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let billnum = "offer";
    let runleid = "youridHere";
    let ids = [businessId];
    let result = busWorkFlowPush(billnum, runleid, ids);
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });