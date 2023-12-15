let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var object1 = { new1: "333", new2: "444" };
    var res = ObjectStore.insert("AT186845D616E80006.AT186845D616E80006.test00101", object1, "test00101");
    throw new Error(JSON.stringify(res));
  }
}
exports({ entryPoint: WorkflowAPIHandler });