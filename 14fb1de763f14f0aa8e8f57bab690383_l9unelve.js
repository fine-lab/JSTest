let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { wenben: "processStart" };
    var res = ObjectStore.insert("AT1850565017D00005.AT1850565017D00005.hanssimple", object, "yb933f5aa4");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { wenben: "processEnd" };
    var res = ObjectStore.insert("AT1850565017D00005.AT1850565017D00005.hanssimple", object, "yb933f5aa4");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { wenben: "activityEnd" };
    var res = ObjectStore.insert("AT1850565017D00005.AT1850565017D00005.hanssimple", object, "yb933f5aa4");
  }
}
exports({ entryPoint: WorkflowAPIHandler });