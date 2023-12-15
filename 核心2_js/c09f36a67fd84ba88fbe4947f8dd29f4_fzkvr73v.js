let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    //房屋合并主表id
    let businessId = businessIdArr[1];
    //获取房屋合并前子表信息
    var beforeData = { property_consolidation_id: businessId };
    var beforeCon = ObjectStore.selectByMap("GT45116AT12.GT45116AT12.property_info_before_con", beforeData);
    //获取房屋合并后子表信息
    var afterData = { property_consolidation_id: businessId };
    var afterCon = ObjectStore.selectByMap("GT45116AT12.GT45116AT12.property_info_after_con", afterData);
    //获取房产管理数据
    var houseId = beforeCon[0].house_id;
    var house = ObjectStore.selectById("GT38835AT1.GT38835AT1.pub_house", { id: houseId });
    //循环保存房产管理
    for (let i = 0; i < afterCon.length; i++) {
      var insertHouse = new Object();
      insertHouse = house;
      insertHouse.housecode = afterCon[i].room_code; //房产编码
      insertHouse.houseno = afterCon[i].room_number; //房间号
      insertHouse.housename = afterCon[i].room_name; //房产名称
      insertHouse.housetype = afterCon[i].room_type; //房产类型id
      insertHouse.housetype_name = afterCon[i].room_type; //房产类型
      insertHouse.floor_area = afterCon[i].area_of_structure; //建筑面积
      insertHouse.nrpublicarea = afterCon[i].content_canal_area; // 公摊面积
      insertHouse.nleaseoutarea = afterCon[i].charging_area; //租赁面积
      insertHouse.housing_status = afterCon[i].housing_status; //运营状态id
      insertHouse.housing_status_fstatetype = afterCon[i].housing_status_fdisplaycolor; //运营状态
      insertHouse.ninarea = 0;
      //插入房产管理表
      ObjectStore.insert("GT38835AT1.GT38835AT1.pub_house", insertHouse, "dfa358b5");
    }
    //修改原房产管理表
    for (let i = 0; i < beforeCon.length; i++) {
      var houseId = beforeCon[i].house_id;
      var housedata = ObjectStore.selectById("GT38835AT1.GT38835AT1.pub_house", { id: houseId });
      housedata.is_history = "是";
      //修改原房产管理表
      ObjectStore.updateById("GT38835AT1.GT38835AT1.pub_house", housedata);
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });