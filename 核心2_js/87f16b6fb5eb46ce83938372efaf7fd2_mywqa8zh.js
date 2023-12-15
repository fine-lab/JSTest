let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true) {
      var businessKey = processStateChangeMessage.businessKey;
      var idnumber = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      //根据变更申请的主键id查询到出证合同的主键id
      var sql = "select * from GT8313AT35.GT8313AT35.jjszhtbgsq where id= '" + idnumber + "'";
      var res = ObjectStore.queryByYonQL(sql);
      var szht = res[0].CertificateReceivingContractNo;
      //更新收证合同的状态
      var upszht = { id: szht, state: "2" };
      var upszhtcg = ObjectStore.updateById("GT8313AT35.GT8313AT35.CertificateReceivingContract", upszht, "770602ef");
      //查询收证合同信息
      var sqlr = "select * from GT8313AT35.GT8313AT35.CertificateReceivingContract where id= '" + szht + "'";
      var resr = ObjectStore.queryByYonQL(sqlr);
      var szid = resr[0].id;
      //查询金建人才库信息
      var rcksj = "select * from GT8313AT35.GT8313AT35.JinJianTalentPoolFile where source_id= '" + szid + "'";
      var rckcg = ObjectStore.queryByYonQL(rcksj);
      var rckid = rckcg[0].id;
      //更改金建人才库状态为作废
      var upjjrck = { id: rckid, state: "2" };
      var upjjrckcg = ObjectStore.updateById("GT8313AT35.GT8313AT35.JinJianTalentPoolFile", upjjrck, "cab36459");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });