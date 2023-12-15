let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { new1: "123", name: "123", age: "123" };
    var res = ObjectStore.insert("GT100811AT1.GT100811AT1.test_123", object, "9186ef14");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { new1: "456", name: "456", age: "456" };
    var res = ObjectStore.insert("GT100811AT1.GT100811AT1.test_123", object, "9186ef14");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { new1: "789", name: "789", age: "789" };
    var res = ObjectStore.insert("GT100811AT1.GT100811AT1.test_123", object, "9186ef14");
  }
}
exports({ entryPoint: WorkflowAPIHandler });