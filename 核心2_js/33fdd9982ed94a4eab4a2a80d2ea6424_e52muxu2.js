let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { new1: "value" };
    var res = ObjectStore.insert("GT105633AT218.GT105633AT218.test0701", object, "00e26c35");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { new1: "activityEnd" };
    var res = ObjectStore.insert("GT105633AT218.GT105633AT218.test0701", object, "00e26c35");
  }
}
exports({ entryPoint: WorkflowAPIHandler });