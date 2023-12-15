let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    //获取租赁合同主表
    var voucher = ObjectStore.selectById("GT40934AT6.GT40934AT6.lease_a_contract", { id: businessId });
    //获取房间表数据
    var houseList = ObjectStore.selectByMap("GT40934AT6.GT40934AT6.lease_a_contract_house", { lease_a_contract_id: voucher.id });
    //获取运行状态 "已签约"  记录id
    var object = { fstatetype: "已签约" };
    var res = ObjectStore.selectByMap("GT38835AT1.GT38835AT1.pub_manage_state", object);
    for (var i = 0; i < houseList.length; i++) {
      // 获取房产管理表ID
      var house_id = houseList[i].house_name;
      //根据房产管理表id获取房产管理表记录
      var house_Data = ObjectStore.selectById("GT38835AT1.GT38835AT1.pub_house", { id: house_id });
      house_Data.housing_status = res[0].id;
      house_Data.housing_status_fstatetype = res[0].fstatetype;
      ObjectStore.updateById("GT38835AT1.GT38835AT1.pub_house", house_Data, "dfa358b5");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });