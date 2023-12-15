let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    debugger;
    var str = JSON.stringify(processStartMessage);
    var data = { log: str, type: "processStartMessage" };
    var res = ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    debugger;
    var str = JSON.stringify(processStateChangeMessage);
    var data = { log: str, type: "processStateChangeMessage", memo: "", data: "" };
    var res = ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    debugger;
    var str = JSON.stringify(activityEndMessage);
    var data = { log: str, type: "activityEndMessage" };
    var res = ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
  }
}
exports({ entryPoint: WorkflowAPIHandler });