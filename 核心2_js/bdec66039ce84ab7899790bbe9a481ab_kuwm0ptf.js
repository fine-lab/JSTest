let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    throw new error(processStateChangeMessage);
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    throw new error(processStateChangeMessage);
  }
}
exports({ entryPoint: WorkflowAPIHandler });