let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var object1 = { whetherAdd: false, verifystate: 2 };
    var res1 = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.personTrainApply", object1);
    var str = JSON.stringify(res1);
    for (var i = 0; i < res1.length; i++) {
      if (res1[i].trainType == "4") {
        var object2 = { personTrainApply_id: res1[i].id };
        var res = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.personApply_sonV1_2", object2);
        for (var j = 0; j < res.length; j++) {
          res[j]["simple_name"] = res[j].new24;
          res[j]["new24"] = "";
          res[j]["trainCode"] = res1[i].train_Info;
          res[j]["trainName"] = res1[i].trainName;
          res[j]["trainTypeType"] = res1[i].trainType;
          res[j]["trainDate"] = res1[i].trainDate;
          res[j]["status"] = "1";
          //根据号码查询施工人员信息
          if (typeof res[j].call_num == "undefined" || res[j].call_num == null || res[j].call_num == "") {
            res[j]["call_num"] = "*********";
          }
          var res2 = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.buildma_info", { call_num: res[j].call_num });
          if (res2[0]) {
            res[j]["throughTrainType"] = res2[0].throughTrainType;
            ObjectStore.deleteByMap("GT42921AT2.GT42921AT2.buildma_info", { call_num: res[j].call_num }, "096903d0");
            ObjectStore.insert("GT42921AT2.GT42921AT2.buildma_info", res[j], "096903d0");
            ObjectStore.updateById("GT42921AT2.GT42921AT2.personTrainApply", { id: res1[i].id, whetherAdd: true }, "023a78ee");
            var str3 = JSON.stringify(res2);
          } else {
            if (res[j]["call_num"] == "*********") {
            } else {
              ObjectStore.insert("GT42921AT2.GT42921AT2.buildma_info", res[j], "096903d0");
              ObjectStore.updateById("GT42921AT2.GT42921AT2.personTrainApply", { id: res1[i].id, whetherAdd: true }, "023a78ee");
            }
          }
        }
      } else {
        var object2 = { personApply_sonFk: res1[i].id };
        var res = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.personApply_son", object2);
        for (var j = 0; j < res.length; j++) {
          res[j]["simple_name"] = res[j].new24;
          res[j]["new24"] = "";
          res[j]["trainCode"] = res1[i].train_Info;
          res[j]["trainName"] = res1[i].trainName;
          res[j]["trainTypeType"] = res1[i].trainType;
          res[j]["trainDate"] = res1[i].trainDate;
          res[j]["status"] = "1";
          if (typeof res[j].call_num == "undefined" || res[j].call_num == null || res[j].call_num == "") {
            res[j]["call_num"] = "*********";
          }
          var res2 = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.buildma_info", { call_num: res[j].call_num });
          if (res2[0]) {
            res[j]["throughTrainType"] = res2[0].throughTrainType;
            ObjectStore.deleteByMap("GT42921AT2.GT42921AT2.buildma_info", { call_num: res[j].call_num }, "096903d0");
            ObjectStore.insert("GT42921AT2.GT42921AT2.buildma_info", res[j], "096903d0");
            ObjectStore.updateById("GT42921AT2.GT42921AT2.personTrainApply", { id: res1[i].id, whetherAdd: true }, "023a78ee");
            var str3 = JSON.stringify(res2);
          } else {
            if (res[j]["call_num"] == "*********") {
            } else {
              ObjectStore.insert("GT42921AT2.GT42921AT2.buildma_info", res[j], "096903d0");
              ObjectStore.updateById("GT42921AT2.GT42921AT2.personTrainApply", { id: res1[i].id, whetherAdd: true }, "023a78ee");
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });