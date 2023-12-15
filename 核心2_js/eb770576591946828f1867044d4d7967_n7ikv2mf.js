let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var indexid = processStateChangeMessage.businessKey.indexOf("_");
    var businessKey = processStateChangeMessage.businessKey.substring(indexid + 1);
    let func1 = extrequire("GT27606AT15.backDefaultGroup.ChangeToContract");
    let res = func1.execute({ id: businessKey });
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });