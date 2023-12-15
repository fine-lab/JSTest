let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var id = substring(activityEndMessage.businessKey, 9);
    var object = { id: id, projectStatus: activityEndMessage.actName };
    var res = ObjectStore.updateById("AT1639DE8C09880005.AT1639DE8C09880005.sw011", object, "aaec3996");
  }
}
exports({ entryPoint: WorkflowAPIHandler });