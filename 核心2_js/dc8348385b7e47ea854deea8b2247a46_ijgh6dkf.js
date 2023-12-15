let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { id: "youridHere", yongyinleixing: "333" };
    var res = ObjectStore.updateById("GT55544AT2.GT55544AT2.XAPTEST", object, "XAPTEST");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { id: "youridHere", yongyinleixing: "444" };
    var res = ObjectStore.updateById("GT55544AT2.GT55544AT2.XAPTEST", object, "XAPTEST");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { id: "youridHere", yongyinleixing: "5555" };
    var res = ObjectStore.updateById("GT55544AT2.GT55544AT2.XAPTEST", object, "XAPTEST");
  }
}
exports({ entryPoint: WorkflowAPIHandler });