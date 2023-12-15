let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let a = 0;
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let a = 0;
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let a = 0;
  }
}
exports({ entryPoint: WorkflowAPIHandler });