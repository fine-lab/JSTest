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
      var bgsqzf = { id: idnumber, hetongzhuangtai: "2" };
      var bgsq = ObjectStore.updateById("GT8313AT35.GT8313AT35.jjczhtbg", bgsqzf, "3cd53e1a");
      var sql = "select * from GT8313AT35.GT8313AT35.jjczhtbg where id= '" + idnumber + "'";
      var res = ObjectStore.queryByYonQL(sql);
      var czht = res[0].chuzhenghetonghao;
      var czsyf = res[0].Telephone;
      var rckz = res[0].TalentName;
      //更新出证合同的状态
      var object = { id: czht, hetongzhuangtai: "2" };
      var gxcg = ObjectStore.updateById("GT8313AT35.GT8313AT35.jjczht", object, "829b6f03");
      //查询人才库轨迹表
      var sqlr = "select * from GT8313AT35.GT8313AT35.guiji where source_id= '" + czht + "'";
      var resr = ObjectStore.queryByYonQL(sqlr);
      var rckgjid = resr[0].id;
      if (czsyf == 1) {
        //查询服务人才库
        var fwrck = "select * from GT8313AT35.GT8313AT35.ServiceCentre where source_id = '" + czht + "'";
        var fwrcksj = ObjectStore.queryByYonQL(fwrck);
        var fwrckid = fwrcksj[0].id;
        //更改服务人才库状态为作废
        var fwggzt = { id: fwrckid, zhuangtai: "2" };
        var res2 = ObjectStore.updateById("GT8313AT35.GT8313AT35.ServiceCentre", fwggzt, "fbdcef39");
      } else {
        //更新人才库子表轨迹的合同状态
        var object = { id: rckz, guijiList: [{ id: rckgjid, hetongzhuangtai: "2", _status: "Update" }] };
        var res1 = ObjectStore.updateById("GT8313AT35.GT8313AT35.JinJianTalentPoolFile", object, "cab36459");
      }
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });