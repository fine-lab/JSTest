let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { wenben: "processStart" };
    var res = ObjectStore.insert("GT702AT2.GT702AT2.simple0224", object, "6e5f20eb");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { wenben: "processEnd" };
    var res = ObjectStore.insert("GT702AT2.GT702AT2.simple0224", object, "6e5f20eb");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { wenben: "activityEnd" };
    var res = ObjectStore.insert("GT702AT2.GT702AT2.simple0224", object, "6e5f20eb");
  }
}
exports({ entryPoint: WorkflowAPIHandler });