let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var a = processStateChangeMessage.businessKey;
    var sql = "select * from GT54604AT1.GT54604AT1.proportion_adjust where id = " + a;
    var res = ObjectStore.queryByYonQL(sql);
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    GT54604AT1.GT54604AT1.apply_Proportion;
  }
}
exports({ entryPoint: WorkflowAPIHandler });