let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let base_path = "https://www.example.com/";
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let base_path = "https://www.example.com/";
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let base_path = "https://www.example.com/";
  }
}
exports({ entryPoint: WorkflowAPIHandler });