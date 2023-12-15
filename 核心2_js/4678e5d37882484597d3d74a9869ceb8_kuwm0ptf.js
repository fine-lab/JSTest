let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    throw new Error(11111);
    var a = activityEndMessage;
    console.info("insert false1111111");
    return false;
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    throw new Error(222);
    var a = activityEndMessage;
    console.info("insert false");
    return false;
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    throw new Error(333);
    var a = activityEndMessage;
    console.info("insert success");
    return false;
  }
}
exports({ entryPoint: WorkflowAPIHandler });