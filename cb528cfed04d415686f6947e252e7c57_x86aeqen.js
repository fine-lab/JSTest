let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    console.log("环节结束事件回调");
  }
}
exports({ entryPoint: WorkflowAPIHandler });