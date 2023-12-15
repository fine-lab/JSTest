let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true) {
      var businessKey = processStateChangeMessage.businessKey;
      var id = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      //查询流转完结表单数据
      var quersql = "select * from GT60601AT58.GT60601AT58.circulationFinish where id=" + id;
      var res = ObjectStore.queryByYonQL(quersql);
      //更新内部流转单数据
      var nblzdObject = { id: res[0].entCust_name, innerStatus: res[0].innerStatus };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenInnerCircu", nblzdObject, "27b492a8");
      //查询内部流转单数据
      var nblzdquersql = "select * from GT60601AT58.GT60601AT58.serCenInnerCircu where id=" + res[0].entCust_name;
      var nblzddata = ObjectStore.queryByYonQL(nblzdquersql);
      //更新内部人才库主表状态为【闲置】
      var nbrckObject = { id: nblzddata[0].cerContract_number, innerStatus: "1" };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenPerDepot", nbrckObject, "9a3bc57c");
      //依据流转单主键,和流转单编号查询内部人才库轨迹信息
      var queryGj = "select * from GT60601AT58.GT60601AT58.serCenPerDepot_a where serCenPerDepot_id=" + nblzddata[0].cerContract_number + " and circu_number=" + nblzddata[0].code;
      var gjdata = ObjectStore.queryByYonQL(queryGj);
      //更新内部人才库轨迹数据，状态为【完结】
      var gjupateObject = { id: gjdata[0].id, circuStatus: res[0].innerStatus };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenPerDepot_a", gjupateObject, "9a3bc57c");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });