let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var businessKey = processStartMessage.businessKey;
    //获取存储的id
    var object = { id: "youridHere" };
    var res = ObjectStore.selectById("AT186845D616E80006.AT186845D616E80006.test00101", object);
    if (res.new3 != businessKey) {
      // 如果id 变化，就更新存储
      var object = { id: "youridHere", new1: "100", new2: "101", new3: businessKey };
      var res = ObjectStore.updateById("AT186845D616E80006.AT186845D616E80006.test00101", object, "test00101");
    } else {
      // 否则，不更新
    }
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });