let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { wenben: "activityEnd" };
    var res = ObjectStore.insert("GT604AT24.GT604AT24.simple0223", object, "020faa74");
  }
}
exports({ entryPoint: WorkflowAPIHandler });