let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { new1: "processStart" };
    var res = ObjectStore.insert("AT18C78C8C17C00002.AT18C78C8C17C00002.test0803b1", object, "test0803b1");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });