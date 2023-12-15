let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let apiResponse = apiman("post", "https://www.example.com/", "入社审核初始化", null);
    var strResponse = postman("post", "https://www.example.com/", "入社审核初始化", null);
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let apiResponse = apiman("post", "https://www.example.com/", "入社审核完成", null);
    var strResponse = postman("post", "https://www.example.com/", "入社审核完成", null);
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let apiResponse = apiman("post", "https://www.example.com/", "入社审核环节结束", null);
    var strResponse = postman("post", "https://www.example.com/", "入社审核环节结束", null);
  }
}
exports({ entryPoint: WorkflowAPIHandler });