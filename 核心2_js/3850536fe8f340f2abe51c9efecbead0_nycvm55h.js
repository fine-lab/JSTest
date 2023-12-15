let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { id: "youridHere", zhaiyao: "这个摘要修改了" };
    var res = ObjectStore.updateById("GT43082AT14.GT43082AT14.xaptest02", object, "xaptest02");
  }
}
exports({ entryPoint: WorkflowAPIHandler });