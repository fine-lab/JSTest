let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //获取合同对象
    var contractData = param.data[0];
    //获取费用明细
    if (contractData.lease_a_contract_rent_detailList == null) {
      throw new Error("请检查是否生成费用明细！");
    }
    //获取合同关联房间表
    var houseList = ObjectStore.selectByMap("GT40934AT6.GT40934AT6.lease_a_contract_house", { lease_a_contract_id: contractData.id });
    //获取运行状态 "签约中"  记录id
    var object = { fstatetype: "签约中" };
    var res = ObjectStore.selectByMap("GT38835AT1.GT38835AT1.pub_manage_state", object);
    //循环房间表
    for (var i = 0; i < houseList.length; i++) {
      var houseId = houseList[i].house_name;
      //获取房间表数据
      var houseData = ObjectStore.selectById("GT38835AT1.GT38835AT1.pub_house", { id: houseId });
      houseData.housing_status = res[0].id;
      houseData.housing_status_fstatetype = res[0].fstatetype;
      //更新房间表数据
      ObjectStore.updateById("GT38835AT1.GT38835AT1.pub_house", houseData, "dfa358b5");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });