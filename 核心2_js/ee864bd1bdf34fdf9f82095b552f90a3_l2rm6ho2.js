let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(message) {}
  // 流程完成
  processInstanceEnd(message) {}
  // 流程撤回
  recall(message) {}
  // 环节结束
  activityComplete(message) {}
}
exports({ entryPoint: WorkflowAPIHandler });