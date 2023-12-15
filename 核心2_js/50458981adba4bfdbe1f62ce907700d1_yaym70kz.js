let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //从流程数据中获取单据id
    var id = eval(split(processStateChangeMessage.businessKey, "_", 2))[1];
    //从流程数据中获取流程审批人id
    var userId = processStateChangeMessage.userId;
    //从流程数据中获取流程结束状态
    let processEnd = processStateChangeMessage.processEnd;
    if (processEnd) {
      processEnd = 1;
    } else {
      processEnd = 0;
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });