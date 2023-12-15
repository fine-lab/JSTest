let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { wenben: "activityEnd" };
    var res = ObjectStore.insert("GT81406AT4.GT81406AT4.simple0304", object, "95fa9232");
  }
}
exports({ entryPoint: WorkflowAPIHandler });