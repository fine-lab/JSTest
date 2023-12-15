let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var businessKey = processStartMessage.businessKey;
    //获取存储的id
    var object = { id: "youridHere" };
    var res = ObjectStore.selectById("AT1840871816E00004.AT1840871816E00004.spdebug", object);
    if (res.new3 != businessKey) {
      // 如果id 变化，就更新存储
      var object = { id: "youridHere", new1: "100", new2: "101", new3: businessKey };
      var res = ObjectStore.updateById("AT1840871816E00004.AT1840871816E00004.spdebug", object, "spdebug");
    } else {
      // 否则，不更新
    }
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    //可以对返回参数进行处理，例如调用第三方接口
    //此处为方便验证调用插入接口AT1840871816E00004.AT1840871816E00004.xschs001 xschs001
    //任务执行
    if (wanchengshu == zongshu) {
    }
  }
}
exports({ entryPoint: WorkflowAPIHandler });