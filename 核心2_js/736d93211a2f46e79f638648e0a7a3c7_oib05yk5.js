let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { new1: "processStart" };
    var res = ObjectStore.insert("GT31425AT7.GT31425AT7.simple0619", object, "846c7eed");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { new1: "processEnd" };
    var res = ObjectStore.insert("GT31425AT7.GT31425AT7.simple0619", object, "846c7eed");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { new1: "activityEnd" };
    var res = ObjectStore.insert("GT31425AT7.GT31425AT7.simple0619", object, "846c7eed");
  }
}
exports({ entryPoint: WorkflowAPIHandler });