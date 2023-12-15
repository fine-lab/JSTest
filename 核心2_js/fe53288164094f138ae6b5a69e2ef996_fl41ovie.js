let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage, param) {
    debugger;
    throw new Error("客户地址所有仓库配送范围不合适！");
    return false;
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    debugger;
    throw new Error("客户地址所有仓库配送范围不合适！");
    return false;
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    debugger;
    throw new Error("客户地址所有仓库配送范围不合适！");
    return false;
  }
}
exports({ entryPoint: WorkflowAPIHandler });