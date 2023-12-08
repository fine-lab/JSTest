let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    let businessIdArr = activityEndMessage.businessKey.split("_");
    let businessId = businessIdArr[1];
    [光标位置]
    //可以对返回参数进行处理，例如调用第三方接口
    //此处为方便验证调用插入接口AT1840871816E00004.AT1840871816E00004.xschs001 xschs001
    let sql = "select xiangmumingchen,ziduan2,ziduan3 from AT1840871816E00004.AT1840871816E00004.xschs001 where id = '" + businessId + "'";
    let res = ObjectStore.queryByYonQL(sql);
    var object = { new1: JSON.stringify(res) };
    var res = ObjectStore.insert("AT1840871816E00004.AT1840871816E00004.tsxx", object, "tsxx");
  }
}
exports({ entryPoint: WorkflowAPIHandler });