let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    let businessIdArr = processStartMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    //可以对返回参数进行处理，例如调用第三方接口
    //此处为方便验证调用插入接口
    let sql = "select new2,new3,new4,new5,fujian from GT81114AT94.GT81114AT94.billtest20220310 where id = '" + businessId + "'";
    let res = ObjectStore.queryByYonQL(sql);
    var object = { liuchengshilichushihua: JSON.stringify(res) };
    ObjectStore.insert("GT81114AT94.GT81114AT94.approvesql", object, "08233b8a");
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessIdArr = processStateChangeMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    //可以对返回参数进行处理，例如调用第三方接口
    //此处为方便验证调用插入接口
    let sql = "select new2,new3,new4,new5,fujian from GT81114AT94.GT81114AT94.billtest20220310 where id = '" + businessId + "'";
    let res = ObjectStore.queryByYonQL(sql);
    var object = { liuchengwancheng: JSON.stringify(res) };
    ObjectStore.insert("GT81114AT94.GT81114AT94.approvesql", object, "08233b8a");
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });