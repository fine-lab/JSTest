let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    throw new Error("12344446666");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    throw new Error("123444444");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    throw new Error("12344448888");
  }
}
exports({ entryPoint: WorkflowAPIHandler });