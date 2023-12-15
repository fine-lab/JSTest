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
      //更新出证合同的状态
      var object = { id: idnumber, hetongzhuangtai: "4" };
      var gxcg = ObjectStore.updateById("GT8313AT35.GT8313AT35.jjczht", object, "829b6f03");
      //查询出证合同的数据
      var sql = "select * from GT8313AT35.GT8313AT35.jjczht where id = '" + idnumber + "'";
      var pon = ObjectStore.queryByYonQL(sql);
      //获取人才库收证合同号id
      var rckszhthid = pon[0].CertificateReceivingContractNo;
      //更新人才库的出证状态
      var rckzt = { id: rckszhthid, state: "4" };
      var gxrckcg = ObjectStore.updateById("GT8313AT35.GT8313AT35.JinJianTalentPoolFile", rckzt, "cab36459");
      //根据收证合同号id查询人才库信息
      var rckxx = "select * from GT8313AT35.GT8313AT35.JinJianTalentPoolFile where id = '" + rckszhthid + "'";
      var cxrck = ObjectStore.queryByYonQL(rckxx);
      var szhtid = cxrck[0].source_id;
      //更新收证合同的出证状态
      var szhtzt = { id: szhtid, state: "4" };
      var gxszhtcg = ObjectStore.updateById("GT8313AT35.GT8313AT35.CertificateReceivingContract", szhtzt, "770602ef");
      //获取企业中心的id
      var qyid = pon[0].PersonalPassword;
      if (qyid != null) {
        //根据需要推送的数据进行更改
        var htxxdj = pon[0].Grade;
        var htxxzy = pon[0].major;
        var htxxzslx = pon[0].certificateType;
        var qyxqmxsql = "select * from GT8313AT35.GT8313AT35.qyxqmx where qyzx_id = '" + qyid + "'";
        var qyxqmxsj = ObjectStore.queryByYonQL(qyxqmxsql);
        var xqmxdj = qyxqmxsj[0].zhengshudengji;
        var xqmxzy = qyxqmxsj[0].zhuanye;
        var xqmxzslx = qyxqmxsj[0].zhengshuleixing;
        var xqmxsl = qyxqmxsj[0].shuliang;
        var xqmxid = qyxqmxsj[0].id;
        if (htxxdj == xqmxdj) {
          if (htxxzy == xqmxzy) {
            if (htxxzslx == xqmxzslx) {
              let jhsl = xqmxsl - 1;
              var object1 = { id: qyid, qyxqmxList: [{ id: xqmxid, shuliang: jhsl, _status: "Update" }] };
              var gxxqmx = ObjectStore.updateById("GT8313AT35.GT8313AT35.qyzx", object1, "dc139f21");
            }
          }
        }
      }
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });