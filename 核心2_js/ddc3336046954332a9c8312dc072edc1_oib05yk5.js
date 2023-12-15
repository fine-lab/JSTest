let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { new1: "processStart" };
    var res = ObjectStore.insert("GT52133AT90.GT52133AT90.test0910", object, "38fed779");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { new1: "processEnd" };
    var res = ObjectStore.insert("GT52133AT90.GT52133AT90.test0910", object, "38fed779");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { new1: "activityEnd" };
    var res = ObjectStore.insert("GT52133AT90.GT52133AT90.test0910", object, "38fed779");
  }
}
exports({ entryPoint: WorkflowAPIHandler });