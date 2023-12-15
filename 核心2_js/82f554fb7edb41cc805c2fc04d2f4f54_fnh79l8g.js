let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取合同关联房间表记录
    var contractHouseData = request.houseData;
    //获取运行状态 "空置中"  记录id
    var object = { fstatetype: "空置中" };
    var res = ObjectStore.selectByMap("GT38835AT1.GT38835AT1.pub_manage_state", object);
    var houseId = contractHouseData.house_name;
    //获取房间表数据
    var houseData = ObjectStore.selectById("GT38835AT1.GT38835AT1.pub_house", { id: houseId });
    houseData.housing_status = res[0].id;
    houseData.housing_status_fstatetype = res[0].fstatetype;
    //更新房间表数据
    ObjectStore.updateById("GT38835AT1.GT38835AT1.pub_house", houseData, "dfa358b5");
    return { message_res: true };
  }
}
exports({ entryPoint: MyAPIHandler });