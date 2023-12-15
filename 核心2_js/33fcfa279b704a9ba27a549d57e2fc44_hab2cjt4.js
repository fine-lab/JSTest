let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object1 = { whetherAdd: false, verifystate: 2 };
    var res1 = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.personTrainApply", object1);
    for (var i = 0; i < res1.length; i++) {
      var object2 = { personApply_sonFk: res1[i].id };
      var res = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.personApply_son", object2);
      var res4 = ObjectStore.updateById("GT42921AT2.GT42921AT2.personTrainApply", { id: res1[i].id, whetherAdd: true }, "684f664f");
      var str3 = JSON.stringify(res4);
      for (var j = 0; j < res.length; j++) {
        res[j]["contractor"] = res1[i].StaffNew;
        res[j]["trainCode"] = res1[i].train_Info;
        res[j]["trainName"] = res1[i].trainName;
        res[j]["trainTypeType"] = res1[i].trainType;
        res[j]["trainDate"] = res1[i].trainDate;
        res[j]["status"] = "1";
        var res2 = ObjectStore.selectByMap("GT42921AT2.GT42921AT2.buildma_info", { call_num: res[j].call_num });
        if (res2[0]) {
          res[j]["throughTrainType"] = res2[0].throughTrainType;
          ObjectStore.deleteByMap("GT42921AT2.GT42921AT2.buildma_info", { call_num: res[j].call_num }, "a510f6ba");
          ObjectStore.insert("GT42921AT2.GT42921AT2.buildma_info", res[j], "a510f6ba");
          var str3 = JSON.stringify(res2);
        } else {
          ObjectStore.insert("GT42921AT2.GT42921AT2.buildma_info", res[j], "a510f6ba");
        }
      }
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });