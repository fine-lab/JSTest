let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    if (processStateChangeMessage.processEnd) {
      var indexid = processStateChangeMessage.businessKey.indexOf("_");
      var id = processStateChangeMessage.businessKey.substring(indexid + 1);
      let func1 = extrequire("GT30659AT3.cot.cotCertDate");
      let res = func1.execute({ id: id });
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });