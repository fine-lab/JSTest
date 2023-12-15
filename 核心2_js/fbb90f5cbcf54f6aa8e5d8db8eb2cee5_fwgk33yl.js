let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { id: "youridHere", new5: JSON.stringify(processStartMessage) };
    var res = ObjectStore.updateById("GT64915AT9.GT64915AT9.testdepart1207", object);
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { id: "youridHere", new5: JSON.stringify(processStateChangeMessage) };
    var res = ObjectStore.updateById("GT64915AT9.GT64915AT9.testdepart1207", object);
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { id: "youridHere", new5: JSON.stringify(activityEndMessage) };
    var res = ObjectStore.updateById("GT64915AT9.GT64915AT9.testdepart1207", object);
  }
}
exports({ entryPoint: WorkflowAPIHandler });