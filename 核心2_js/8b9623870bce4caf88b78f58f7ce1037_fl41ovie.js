let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {
    var processInstId = processStartMessage.processInstId;
    var indexid = processStartMessage.businessKey.indexOf("_");
    var businessKey = processStartMessage.businessKey.substring(indexid + 1);
    var processInfo = "流程实例初始化";
    var object = { processInstId: processInstId, businessKey: businessKey, processInfo: processInfo };
    var res = ObjectStore.insert("GT13365AT137.GT13365AT137.flow0115", object);
  }
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var processInstId = processStateChangeMessage.processInstId;
    var indexid = processStateChangeMessage.businessKey.indexOf("_");
    var businessKey = processStateChangeMessage.businessKey.substring(indexid + 1);
    var processInfo = "流程完成";
    var object = { processInstId: processInstId, businessKey: businessKey, processInfo: processInfo };
    var res = ObjectStore.insert("GT13365AT137.GT13365AT137.flow0115", object);
  }
  // 环节结束
  activityComplete(activityEndMessage) {
    var processInstId = activityEndMessage.processInstId;
    var actName = activityEndMessage.actName;
    var indexid = activityEndMessage.businessKey.indexOf("_");
    var businessKey = activityEndMessage.businessKey.substring(indexid + 1);
    var processInfo = actName + "环节结束";
    var object = { processInstId: processInstId, businessKey: businessKey, processInfo: processInfo };
    var res = ObjectStore.insert("GT13365AT137.GT13365AT137.flow0115", object);
  }
  // 活动脚本
}
exports({ entryPoint: WorkflowAPIHandler });