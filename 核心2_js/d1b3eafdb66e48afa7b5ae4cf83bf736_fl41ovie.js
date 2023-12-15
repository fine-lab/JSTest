let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { name1: "流程开始" };
    var res = ObjectStore.insert("GT9378AT105.GT9378AT105.workflow1113", object, "a0af7915");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { name1: "流程结束" };
    var res = ObjectStore.insert("GT9378AT105.GT9378AT105.workflow1113", object, "a0af7915");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { name1: "环节结束" };
    var res = ObjectStore.insert("GT9378AT105.GT9378AT105.workflow1113", object, "a0af7915");
  }
}
exports({ entryPoint: WorkflowAPIHandler });