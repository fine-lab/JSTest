let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    debugger;
    var indexid = processStateChangeMessage.businessKey.indexOf("_");
    var businessKey = processStateChangeMessage.businessKey.substring(indexid + 1);
    var object = { id: businessKey };
    //实体查询
    var res = ObjectStore.selectById("GT25173AT14.GT25173AT14.FQXT", object);
    var resJson = JSON.stringify(res);
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });