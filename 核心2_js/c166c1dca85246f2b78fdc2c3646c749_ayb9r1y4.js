let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    //根据businessId查询子表生产工号
    let sql = "select productionWorkNumber from GT102917AT3.GT102917AT3.detailsOfLiftingStatement where liftTheBalanceSheet_id = '" + businessId + "'";
    var res = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < res.length; i++) {
      let id = res[i].productionWorkNumber;
      //获取当前时间戳
      var date1 = new Date();
      var date = date1.replace(/-/g, "/");
      var updateWrapper1 = new Wrapper();
      updateWrapper1.eq("id", id);
      // 待更新字段内容
      var toUpdate1 = { door: date };
      // 执行更新
      var res1 = ObjectStore.update("GT102917AT3.GT102917AT3.subcontractDetails", toUpdate1, updateWrapper1, "5ff76a5f");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });