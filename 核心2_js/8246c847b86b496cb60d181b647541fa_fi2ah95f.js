let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //查询内容
    var object = {};
    //实体查询
    //选出已通过审核，未添加数据的申请
    var object1 = { whetherAdd: false, verifystate: 2 };
    var res1 = ObjectStore.selectByMap("GT37770AT29.GT37770AT29.personTrainApply", object1);
    for (var i = 0; i < res1.length; i++) {
      var object2 = { personApply_sonFk: res1[i].id };
      var res = ObjectStore.selectByMap("GT37770AT29.GT37770AT29.personApply_son", object2);
      for (var j = 0; j < res.length; j++) {
        res[j]["contractor"] = res1[i].StaffNew;
        res[j]["trainCode"] = res1[i].train_Info;
        res[j]["trainName"] = res1[i].trainName;
        res[j]["trainTypeType"] = res1[i].trainType;
        res[j]["status"] = "1";
        ObjectStore.deleteByMap("GT37770AT29.GT37770AT29.buildma_infoV1_3", { call_num: res[j].call_num }, "b7cf62f2");
        ObjectStore.insert("GT37770AT29.GT37770AT29.buildma_infoV1_3", res[j], "b7cf62f2");
      }
      var res4 = ObjectStore.updateById("GT37770AT29.GT37770AT29.personTrainApply", { id: res1[i].id, whetherAdd: true }, "98fc1d9f");
    }
    var str = JSON.stringify(res1);
    throw new Error(str);
    return {};
  }
}
exports({ entryPoint: MyTrigger });