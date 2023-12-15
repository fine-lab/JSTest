let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    processStartMessage;
    var object = { liuchengbiaoti: "流程开始", jutixinxi: JSON.stringify(processStartMessage) };
    var res = ObjectStore.insert("AT1979BFB417480007.AT1979BFB417480007.LCJYWXX", object, "LCJYWXX");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { liuchengbiaoti: "流程完成", jutixinxi: JSON.stringify(processStateChangeMessage) };
    var res = ObjectStore.insert("AT1979BFB417480007.AT1979BFB417480007.LCJYWXX", object, "LCJYWXX");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { liuchengbiaoti: "环节完成", jutixinxi: JSON.stringify(activityEndMessage) };
    var res = ObjectStore.insert("AT1979BFB417480007.AT1979BFB417480007.LCJYWXX", object, "LCJYWXX");
  }
}
exports({ entryPoint: WorkflowAPIHandler });