let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    throw new Error("流程开始");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    throw new Error("流程完成");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    throw new Error("环节结束");
  }
}
exports({ entryPoint: WorkflowAPIHandler });