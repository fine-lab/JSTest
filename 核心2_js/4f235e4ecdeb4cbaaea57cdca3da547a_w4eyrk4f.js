let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let businessIdArr = processStartMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    let sql = "select count(shuliang) as amount from GT45AT17.GT45AT17.poc_requirement_apply_material where poc_requirement_apply_id='" + businessId + "'";
    var res = ObjectStore.queryByYonQL(sql);
    amount = res.get(0).get("amount");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {}
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });