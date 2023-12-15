let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { new1: "11" };
    var res = ObjectStore.insert("AT184331A609480006.AT184331A609480006.debuglog", object, "yb1e575846");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { new1: "12" };
    var res = ObjectStore.insert("AT184331A609480006.AT184331A609480006.debuglog", object, "yb1e575846");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { new1: "13" };
    var res = ObjectStore.insert("AT184331A609480006.AT184331A609480006.debuglog", object, "yb1e575846");
  }
}
exports({ entryPoint: WorkflowAPIHandler });