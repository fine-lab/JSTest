let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object1 = { new1: "333" };
    var res = ObjectStore.insert("AT183FE7BE16700006.AT183FE7BE16700006.testdayin", object1, "testdayin");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object1 = { new1: "333" };
    var res = ObjectStore.insert("AT183FE7BE16700006.AT183FE7BE16700006.testdayin", object1, "testdayin");
  }
}
exports({ entryPoint: WorkflowAPIHandler });