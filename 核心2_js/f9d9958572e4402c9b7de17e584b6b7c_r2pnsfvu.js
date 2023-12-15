let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    //  发送工作通知
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //  发送工作通知
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    //  发送工作通知
  }
}
exports({ entryPoint: WorkflowAPIHandler });