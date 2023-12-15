let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { wenben: "activityEnd" };
    var res = ObjectStore.insert("AT1631D73C17180009.AT1631D73C17180009.hans1125", object, "hans1125");
  }
}
exports({ entryPoint: WorkflowAPIHandler });