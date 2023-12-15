let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { new1: "processStart" };
    var res = ObjectStore.insert("GT24832AT175.GT24832AT175.simple1112", object, "9d230e84");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { new1: "processEnd" };
    var res = ObjectStore.insert("GT24832AT175.GT24832AT175.simple1112", object, "9d230e84");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { new1: "activityEnd" };
    var res = ObjectStore.insert("GT24832AT175.GT24832AT175.simple1112", object, "9d230e84");
  }
}
exports({ entryPoint: WorkflowAPIHandler });