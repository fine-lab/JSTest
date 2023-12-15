let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    //可以对返回参数进行处理，例如调用第三方接口
    //此处为方便验证调用插入接口
    let sql = "select verifystate,woCode,documentId from AT1628BB8817180007.AT1628BB8817180007.hxsksp where id = '" + businessId + "'";
    let res = ObjectStore.queryByYonQL(sql);
    //审核中
    if (res.verifystate == "已审核" || res.verifystate == "驳回到制单") {
      var auditOpinion = 0;
      if (res.verifystate == "已审核") {
        auditOpinion = 1;
      } else if (res.verifystate == "驳回到制单") {
        auditOpinion = 2;
      }
      let a = {
        auditOpinion: auditOpinion,
        documentId: res.documentId,
        auditUser: processStateChangeMessage.userCode,
        auditUserName: processStateChangeMessage.userName,
        auditTime: new Date()
      };
      let header = {
        "Content-Type": "application/json;charset=UTF-8"
      };
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });