let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var str = JSON.stringify(processStateChangeMessage);
    throw new Error(str);
    var param = {};
    ObjectStore.updateById("AT161E5DFA09D00001.AT161E5DFA09D00001.warehousing_subset_master", param, "warehousing_subset");
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });