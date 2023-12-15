let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { new1: "11" };
    var res = ObjectStore.insert("AT1840871816E00004.AT1840871816E00004.tsxx", object, "tsxx");
  }
}
exports({ entryPoint: WorkflowAPIHandler });