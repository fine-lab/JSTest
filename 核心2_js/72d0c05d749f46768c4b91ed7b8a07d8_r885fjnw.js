let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let businessIdArr = processStartMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    var object = { money: 555, total: 6666, orderCode: businessId };
    var res = ObjectStore.insert("AT164059BE09880007.AT164059BE09880007.reportForms1", object, "yba199dbd9");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    var object = { money: 555, total: 5555, orderCode: businessId };
    var res = ObjectStore.insert("AT164059BE09880007.AT164059BE09880007.reportForms1", object, "yba199dbd9");
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let businessIdArr = activityEndMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    var object = { money: 555, total: 5555, orderCode: businessId };
    var res = ObjectStore.insert("AT164059BE09880007.AT164059BE09880007.reportForms1", object, "yba199dbd9");
  }
}
exports({ entryPoint: WorkflowAPIHandler });