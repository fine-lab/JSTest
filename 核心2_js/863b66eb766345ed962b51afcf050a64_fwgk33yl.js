let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    ObjectStore.insert("GT65292AT10.GT65292AT10.prelog", { new1: "ABC" });
    ObjectStore.insert("GT65292AT10.GT65292AT10.prelog", { new1: JSON.stringify(activityEndMessage) });
  }
}
exports({ entryPoint: WorkflowAPIHandler });