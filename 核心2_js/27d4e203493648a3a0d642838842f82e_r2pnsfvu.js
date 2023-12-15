let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    debugger;
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    debugger;
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    debugger;
  }
}
exports({ entryPoint: WorkflowAPIHandler });