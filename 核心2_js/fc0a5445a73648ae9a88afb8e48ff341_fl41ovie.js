let AbstractWorkflowStartHandler = require("AbstractWorkflowStartHandler");
class WorkflowStartHandler extends AbstractWorkflowStartHandler {
  // 流程实例初始化
  execute(processStartMessage) {}
}
exports({ entryPoint: WorkflowStartHandler });
let AbstractWorkflowEndHandler = require("AbstractWorkflowEndHandler");
class WorkflowEndHandler extends AbstractWorkflowEndHandler {
  // 流程完成
  execute(processStateChangeMessage) {}
}
exports({ entryPoint: WorkflowEndHandler });
let AbstractWorkflowCompleteHandler = require("AbstractWorkflowCompleteHandler");
class WorkflowCompleteHandler extends AbstractWorkflowCompleteHandler {
  // 任务完成
  execute(activityEndMessage) {}
}
exports({ entryPoint: WorkflowCompleteHandler });