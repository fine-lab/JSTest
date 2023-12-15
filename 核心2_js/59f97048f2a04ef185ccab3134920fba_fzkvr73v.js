let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    //房屋拆分主表id
    let businessId = businessIdArr[1];
    //获取房屋拆分前子表信息
    var beforeData = { property_info_before_splitFk: businessId };
    var beforeSplits = ObjectStore.selectByMap("GT45116AT12.GT45116AT12.property_info_before_split", beforeData);
    //获取房屋拆分后子表信息
    var afterData = { property_split_id: businessId };
    var afterSplits = ObjectStore.selectByMap("GT45116AT12.GT45116AT12.property_info_after_split1", afterData);
    //获取房产管理数据
    var houseId = beforeSplits[0].houses_id;
    var house = ObjectStore.selectById("GT38835AT1.GT38835AT1.pub_house", { id: houseId });
    //循环保存房产管理
    for (let i = 0; i < afterSplits.length; i++) {
      var insertHouse = new Object();
      insertHouse = house;
      insertHouse.housecode = afterSplits[i].room_code; //房产编码
      insertHouse.houseno = afterSplits[i].room_number; //房间号
      insertHouse.housename = afterSplits[i].room_name; //房产名称
      insertHouse.housetype = afterSplits[i].room_type; //房产类型id
      insertHouse.housetype_name = afterSplits[i].room_type_name; //房产类型
      insertHouse.floor_area = afterSplits[i].area_of_structure; //建筑面积
      insertHouse.nrpublicarea = afterSplits[i].content_canal_area; // 公摊面积
      insertHouse.nleaseoutarea = afterSplits[i].charging_area; //租赁面积
      insertHouse.housing_status = afterSplits[i].housing_status; //运营状态id
      insertHouse.housing_status_fstatetype = afterSplits[i].housing_status_fdisplaycolor; //运营状态
      insertHouse.ninarea = 0;
      //插入房产管理表
      ObjectStore.insert("GT38835AT1.GT38835AT1.pub_house", insertHouse, "dfa358b5");
    }
    //修改原房产管理表
    for (let i = 0; i < beforeSplits.length; i++) {
      var houseId = beforeSplits[i].houses_id;
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