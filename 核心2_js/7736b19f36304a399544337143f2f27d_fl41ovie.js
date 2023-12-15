let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { new1: "processStart" };
    var res = ObjectStore.insert("GT18656AT200.GT18656AT200.test03", object, "9d00b54a");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { new1: "processEnd" };
    var res = ObjectStore.insert("GT18656AT200.GT18656AT200.test03", object, "9d00b54a");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { new1: "activityEnd" };
    var res = ObjectStore.insert("GT18656AT200.GT18656AT200.test03", object, "9d00b54a");
  }
}
exports({ entryPoint: WorkflowAPIHandler });