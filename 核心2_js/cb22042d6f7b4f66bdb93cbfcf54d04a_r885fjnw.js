let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let processInstId = processStateChangeMessage.userId;
    var object = { info: JSON.stringify(processInstId) };
    ObjectStore.insert("AT169C965A08F00009.AT169C965A08F00009.approval", object, "8489a7da");
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });