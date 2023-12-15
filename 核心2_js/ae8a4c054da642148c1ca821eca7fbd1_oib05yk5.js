let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var object = { wenben: "processStart", shuzhi: 9 };
    var res = ObjectStore.insert("GT44903AT33.GT44903AT33.simpletest", object, "fd579244");
    //进行数据插入，执行成功后在列表上检查插入数据的内容
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { wenben: "processEnd", shuzhi: 9 };
    var res = ObjectStore.insert("GT44903AT33.GT44903AT33.simpletest", object, "fd579244");
    //进行数据插入，执行成功后在列表上检查插入数据的内容
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var object = { wenben: "activityEnd", shuzhi: 9 };
    var res = ObjectStore.insert("GT44903AT33.GT44903AT33.simpletest", object, "fd579244");
    //进行数据插入，执行成功后在列表上检查插入数据的内容
  }
}
exports({ entryPoint: WorkflowAPIHandler });