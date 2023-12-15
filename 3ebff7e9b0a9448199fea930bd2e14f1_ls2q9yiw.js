let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let userInfo = JSON.parse(AppContext());
    var staffId = userInfo.currentUser.staffId;
    processStartMessage["staffId"] = staffId;
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(processStartMessage));
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let userInfo = JSON.parse(AppContext());
    var staffId = userInfo.currentUser.staffId;
    processStateChangeMessage["staffId"] = staffId;
    let header = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let responseObj = postman("post", "https://www.example.com/", JSON.stringify(header), JSON.stringify(processStateChangeMessage));
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });