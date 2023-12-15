let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    //根据businessId查询子表生产工号
    let sql = "select shengchangonghao from GT102917AT3.GT102917AT3.Taskorderdetails where TaskorderdetailsFk= '" + businessId + "'";
    var res = ObjectStore.queryByYonQL(sql);
    for (var i = 0; i < res.length; i++) {
      let id1 = res[i].shengchangonghao;
      //获取当前时间戳
      let yy = new Date().getFullYear() + "-";
      let mm = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) + "-" : new Date().getMonth() + 1 + "-";
      let dd = new Date().getDate() + " ";
      let hh = new Date().getHours() + 8 + ":";
      let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() + ":" : new Date().getMinutes() + ":";
      let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
      var date = yy + mm + dd + hh + mf + ss;
      // 更新条件
      var updateWrapper = new Wrapper();
      updateWrapper.eq("BasicInformationDetails_id", id1);
      // 待更新字段内容
      var toUpdate = { gaozhidanwei: date };
      // 执行更新
      var res = ObjectStore.update("GT102917AT3.GT102917AT3.Beforetheconstruction", toUpdate, updateWrapper, "50b55ce8");
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });