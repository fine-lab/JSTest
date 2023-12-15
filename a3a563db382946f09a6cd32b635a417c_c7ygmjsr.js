let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {
    let str = activityEndMessage.businessKey; //获取上下文信息businesskey:表单编码_单据id
    var obj = split(str, "_", 2);
    var obj1 = JSON.parse(obj);
    var tid = obj1[1];
    var object = { id: tid, jiekuanzhuangtai: "已结清" };
    var res = ObjectStore.updateById("GT18647AT1.GT18647AT1.gysfkd", object, "ce3c614e"); //用id对当前单据进行更新
  }
}
exports({ entryPoint: WorkflowAPIHandler });