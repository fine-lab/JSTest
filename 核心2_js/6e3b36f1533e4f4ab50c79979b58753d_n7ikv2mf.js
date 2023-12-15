let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let logfunc1 = extrequire("GT33423AT4.backDefaultGroup.TestLog");
    var log2 = { billName: "外包协同任务单", operation: "审批结束", ziduan1: "processStateChangeMessage", logLevel: "info", content: JSON.stringify(processStateChangeMessage) };
    let res2 = logfunc1.execute(log2);
    if (processStateChangeMessage.processEnd) {
      let EndTOPOMP = extrequire("GT51004AT10.wbxt.EndTOPOMP");
      let res = EndTOPOMP.execute(processStateChangeMessage);
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });