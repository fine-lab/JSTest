let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { name: "test03", age: "03" };
    var res = ObjectStore.insert("GT7884AT99.GT7884AT99.test1030", object, "test1030");
    return { res };
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { name: "test04", age: "04" };
    var res = ObjectStore.insert("GT7884AT99.GT7884AT99.test1030", object, "test1030");
    return { res };
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { name: "test05", age: "05" };
    var res = ObjectStore.insert("GT7884AT99.GT7884AT99.test1030", object, "test1030");
    return { res };
  }
}
exports({ entryPoint: WorkflowAPIHandler });