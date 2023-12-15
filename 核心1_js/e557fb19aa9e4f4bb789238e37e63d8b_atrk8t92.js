let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var uspaceReceiver = ["be980cf3-34d2-497e-ba87-4067045ec5fa"];
    var channels = ["uspace"];
    var title = "制单审批结束后下推测试";
    var content = "通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var uspaceReceiver = ["be980cf3-34d2-497e-ba87-4067045ec5fa"];
    var channels = ["uspace"];
    var title = "制单审批结束后下推测试";
    var content = "通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，通知库管员，";
    var messageInfo = {
      sysId: "yourIdHere",
      tenantId: "yourIdHere",
      uspaceReceiver: uspaceReceiver,
      channels: channels,
      subject: title,
      content: content
    };
    var result = sendMessage(messageInfo);
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({
  entryPoint: WorkflowAPIHandler
});