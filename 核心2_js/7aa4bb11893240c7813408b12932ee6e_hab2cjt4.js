let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var res = AppContext();
    var mailReceiver = ["https://www.example.com/"];
    var channels = ["https://www.example.com/"];
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: res.currentUser.tenantId,
      mailReceiver: mailReceiver,
      channels: channels,
      subject: "normal mail title",
      content: "mail content"
    };
    var result = sendMessage(messageInfo);
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });