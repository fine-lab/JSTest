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
      //查询内部流转单数据
      var quersql = "select * from GT60601AT58.GT60601AT58.serCenInnerCircu where id=" + id;
      var res = ObjectStore.queryByYonQL(quersql);
      //回写内部人才库轨迹信息
      var object = {
        circu_number: res[0].code,
        circuStatus: 2,
        entCust_name: res[0].entCust_name,
        entCust_code: res[0].entCust_code,
        entCenter_creator: res[0].entCenter_creator,
        certificateUsePlace: res[0].certificateUsePlace,
        certificateUsePlace_remarks: res[0].certificateUsePlace_remarks,
        purpose: res[0].purpose,
        cycle: res[0].cycle,
        quantity: res[0].quantity,
        contract_enclosure: res[0].contract_enclosure,
        other_enclosure: res[0].other_enclosure,
        serCenPerDepot_id: res[0].cerContract_number
      };
      ObjectStore.insert("GT60601AT58.GT60601AT58.serCenPerDepot_a", object, "9a3bc57c");
      //更改内部人才库主表信息:数量、状态
      var nbrckObject = { id: res[0].cerContract_number, cycle: res[0].cycle, innerStatus: res[0].innerStatus };
      ObjectStore.updateById("GT60601AT58.GT60601AT58.serCenPerDepot", nbrckObject, "9a3bc57c");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });