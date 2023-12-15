let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let header = { "Content-Type": "application/xwww-form-urlencoded" };
    let apiResponse = apiman("POST", "https://www.example.com/", JSON.stringify(header), JSON.stringify(header));
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let header = { "Content-Type": "application/xwww-form-urlencoded" };
    let apiResponse = apiman("POST", "https://www.example.com/", JSON.stringify(header), JSON.stringify(header));
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let header = { "Content-Type": "application/xwww-form-urlencoded" };
    let apiResponse = apiman("POST", "https://www.example.com/", JSON.stringify(header), JSON.stringify(header));
  }
}
exports({ entryPoint: WorkflowAPIHandler });