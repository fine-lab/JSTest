let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { wenben: "value2" };
    var res = ObjectStore.insert("GT85430AT197.GT85430AT197.simple0326", object, "a9183fe6");
  }
}
exports({ entryPoint: WorkflowAPIHandler });