let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var jsonStr = JSON.stringify(processStateChangeMessage);
    var object = { id: "youridHere", dawenben: jsonStr };
    var res = ObjectStore.updateById("GT79146AT92.GT79146AT92.funcStore", object, "0318d70e");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var jsonStr = JSON.stringify(activityEndMessage);
    var object = { id: "youridHere", dawenben: jsonStr };
    var res = ObjectStore.updateById("GT79146AT92.GT79146AT92.funcStore", object, "0318d70e");
  }
}
exports({ entryPoint: WorkflowAPIHandler });