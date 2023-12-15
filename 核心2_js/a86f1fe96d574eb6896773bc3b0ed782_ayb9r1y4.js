let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { id: "youridHere", gaozhidanwei: "123" };
    var res3 = ObjectStore.updateById("GT102917AT3.GT102917AT3.Beforetheconstruction", object, "50b55ce8");
    // 更新条件
    var updateWrapper = new Wrapper();
    updateWrapper.eq("id", "");
    // 待更新字段内容
    var toUpdate = { beizhu: "11111" };
    // 执行更新
    var res = ObjectStore.update("GT102917AT3.GT102917AT3.Beforetheconstruction", toUpdate, updateWrapper, "50b55ce8");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });