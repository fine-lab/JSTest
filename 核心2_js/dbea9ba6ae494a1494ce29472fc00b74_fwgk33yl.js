let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    debugger;
    let func1 = extrequire("GT25173AT14.backDefaultGroup.ProcessEnd");
    let res = func1.execute(processStateChangeMessage);
    return res;
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });