let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true) {
      var businessKey = processStateChangeMessage.businessKey;
      var htid = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      var upateSzht = { id: htid, innerStatus: "2", is_pushdown: "Y" };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.inCertContract", upateSzht, "5ff4949d");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });