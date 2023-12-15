let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
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
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });