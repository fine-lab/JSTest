let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var json = JSON.stringify(processStateChangeMessage);
    var object = { id: "youridHere", test1: json };
    var res = ObjectStore.updateById("GT55714AT63.GT55714AT63.erjishenpi", object);
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var json = JSON.stringify(activityEndMessage);
    var object = { id: "youridHere", test2: json };
    var res = ObjectStore.updateById("GT55714AT63.GT55714AT63.erjishenpi", object);
  }
}
exports({ entryPoint: WorkflowAPIHandler });