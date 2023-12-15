let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var str = JSON.stringify(processStartMessage);
    var object = { new1: "processStartMessage" };
    var res = ObjectStore.insert("GT37770AT29.GT37770AT29.dataTest", object, "d62565e0");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var str = JSON.stringify(processStateChangeMessage);
    var object = { new1: "processStateChangeMessage" };
    var res = ObjectStore.insert("GT37770AT29.GT37770AT29.dataTest", object, "d62565e0");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var str = JSON.stringify(activityEndMessage);
    var object = { new1: "activityEndMessage" };
    var res = ObjectStore.insert("GT37770AT29.GT37770AT29.dataTest", object, "d62565e0");
  }
}
exports({ entryPoint: WorkflowAPIHandler });