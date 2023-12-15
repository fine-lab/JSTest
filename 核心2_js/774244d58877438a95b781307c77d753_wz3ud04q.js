let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成   22d7f4a2
  processInstanceEnd(processStateChangeMessage) {
    //从流程中获取申请的表单ID
    var uspaceReceiver = ["c7909cb6-be57-46bd-9e0e-ec56943e339f"];
    var channels = ["uspace"];
    var title = "title work notify";
    var content = "------content-----";
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
exports({ entryPoint: WorkflowAPIHandler });