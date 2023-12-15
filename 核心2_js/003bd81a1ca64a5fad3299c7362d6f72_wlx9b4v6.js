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
      //将变更申请单的业务流程更改
      var upateBgsqd = { id: idnumber, bizFlowId: "yourIdHere", bizFlowName: "收证合同变更申请单推送最新收证合同数据" };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.cerContractChange", upateBgsqd, "ae6e507b");
      var sql = "select * from GT60601AT58.GT60601AT58.cerContractChange  where id=" + idnumber;
      var res = ObjectStore.queryByYonQL(sql);
      //将收证合同数据状态改为【合同到期】
      var upateSzht = { id: res[0].cerContract_code, vstate: "4" };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.certReceiContract", upateSzht, "301cb08a");
      //依据收证合同主键查询人才库档案数据
      var rckdaSql = "select * from GT60601AT58.GT60601AT58.personDepotArchives where dr=0 and cerStatus in (1,2) and receiContract_code='" + res[0].cerContract_code + "'";
      var rckdaRes = ObjectStore.queryByYonQL(rckdaSql);
      if (rckdaRes.length > 0) {
        for (var j = 0; j < rckdaRes.length; j++) {
          //更新人才库档案主表数据
          var upateRckda = { id: rckdaRes[j].id, cerStatus: "4" };
          ObjectStore.updateById("GT60601AT58.GT60601AT58.personDepotArchives", upateRckda, "207c857b");
          //查询人才库档案轨迹数据
          var rckdagjSql = "select * from GT60601AT58.GT60601AT58.perDepotArchives_c  where dr=0 and issuingContract_status in(1,2) and personDepotArchives_id='" + rckdaRes[j].id + "'";
          var rckdagjRes = ObjectStore.queryByYonQL(rckdagjSql);
          if (rckdagjRes.length > 0) {
            for (var k = 0; k < rckdagjRes.length; k++) {
              var upateRckdaGj = { id: rckdagjRes[k].id, issuingContract_status: "4" };
              ObjectStore.updateById("GT60601AT58.GT60601AT58.perDepotArchives_c", upateRckdaGj, "207c857b");
            }
          }
          //查询出证合同数据
          var czhtsql = "select * from GT60601AT58.GT60601AT58.issuingContract where dr=0 and issuingContract_status=2 and receiContract_code='" + rckdaRes[j].id + "'";
          var czhtres = ObjectStore.queryByYonQL(czhtsql);
          if (czhtres.length > 0) {
            for (var q = 0; q < czhtres.length; q++) {
              //将出证合同数据状态改为【合同到期】
              var upateCzht = { id: czhtres[q].id, issuingContract_status: "4" };
              ObjectStore.updateById("GT60601AT58.GT60601AT58.issuingContract", upateCzht, "909674b8");
              //依据出证合同查询内部人才库数据
              var rckSql = "select * from GT60601AT58.GT60601AT58.serCenPerDepot where dr=0 and innerStatus in (1,2) and issuingContract_code='" + czhtres[q].id + "'";
              var rckRes = ObjectStore.queryByYonQL(rckSql);
              if (rckRes.length > 0) {
                for (var a = 0; a < rckRes.length; a++) {
                  //更改内部人才库主表数据
                  var upateRck = { id: rckRes[a].id, innerStatus: "5" };
                  ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenPerDepot", upateRck, "9a3bc57c");
                  //查询人才库轨迹数据
                  var rckgjSql = "select * from GT60601AT58.GT60601AT58.serCenPerDepot_a where dr=0 and circuStatus in (1,2,3) and serCenPerDepot_id='" + rckRes[a].id + "'";
                  var rckgjRes = ObjectStore.queryByYonQL(rckgjSql);
                  if (rckgjRes.length > 0) {
                    //更新人才库轨迹数据
                    for (var b = 0; j < rckgjRes.length; j++) {
                      var upateGj = { id: rckgjRes[b].id, circuStatus: "5" };
                      ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenPerDepot_a", upateGj, "9a3bc57c");
                    }
                  }
                  //查询内部流转单数据
                  var lzdSql = "select * from GT60601AT58.GT60601AT58.serCenInnerCircu where dr=0 and innerStatus in(2,3) and cerContract_number='" + rckRes[a].id + "'";
                  var lzdRes = ObjectStore.queryByYonQL(lzdSql);
                  if (lzdRes.length > 0) {
                    for (var d = 0; d < lzdRes.length; d++) {
                      //更新内部流转单数据
                      var upateLzd = { id: lzdRes[d].id, innerStatus: "5" };
                      ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenInnerCircu", upateLzd, "27b492a8");
                      //查询完结单数据
                      var wjdSql = "select * from GT60601AT58.GT60601AT58.circulationFinish where dr=0 and innerStatus=3 and entCust_name='" + lzdRes[d].id + "'";
                      var wjdRes = ObjectStore.queryByYonQL(wjdSql);
                      //更新完结单数据
                      if (wjdRes.length > 0) {
                        for (var p = 0; p < wjdRes.length; p++) {
                          var upateWjd = { id: wjdRes[p].id, innerStatus: "5" };
                          ObjectStore.updateById("GT60601AT58.GT60601AT58.circulationFinish", upateWjd, "e7f4a94f");
                        }
                      }
                    }
                  }
                }
              }
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