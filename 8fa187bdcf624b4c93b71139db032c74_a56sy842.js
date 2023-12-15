let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object1 = { username: "bussinesskey" };
    var res = ObjectStore.insert("AT1731071017280003.AT1731071017280003.T_001", object1, "T_001");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object1 = { username: "bussinesskey" };
    var res = ObjectStore.insert("AT1731071017280003.AT1731071017280003.T_001", object1, "T_001");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    // 给华新丽华提供一个“环节结束”更新数据库表字段的代码示例，供其客开团队参考
    var object1 = { username: "bussinesskey" };
    var res = ObjectStore.insert("AT1731071017280003.AT1731071017280003.T_001", object1, "T_001");
  }
}
exports({ entryPoint: WorkflowAPIHandler });