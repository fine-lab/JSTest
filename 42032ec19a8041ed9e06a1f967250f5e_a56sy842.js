let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化，点击提交按钮后系统会调用此方法
  processInstanceStart(processStartMessage) {
    var res = split(processStartMessage.businessKey, "_", 2);
    var billID = JSON.parse(res)[1];
    var object = { id: billID, new2: "初始状态" };
    ObjectStore.updateById("AT17750DC417500007.AT17750DC417500007.test001", object, "test001");
  }
  // 流程完成，所有节点执行完成后，系统会调用此方法
  processInstanceEnd(processStateChangeMessage) {
    // 通过工作流传递的参数，获取单据的ID值
    var res = split(processStateChangeMessage.businessKey, "_", 2);
    var billID = JSON.parse(res)[1];
    // 流程执行完成后，单据实体字段new2更改为“审批完成”
    var object = { id: billID, new2: "审批完成" };
    ObjectStore.updateById("AT17750DC417500007.AT17750DC417500007.test001", object, "test001");
  }
  // 环节结束，每个活动节点执行完成后，系统会调用此方法
  activityComplete(activityEndMessage) {
    // 通过工作流传递的参数，获取单据的ID值
    var res = split(activityEndMessage.businessKey, "_", 2);
    var billID = JSON.parse(res)[1];
    // 根据执行的活动环节设置更新实体字段new2的值
    var object = null;
    // 制定活动“华新1”的时候，将new2字段更新为"华新1节点"
    if (activityEndMessage.actName == "华新1") {
      object = { id: billID, new2: "华新1节点" };
      // 制定活动“华新2”的时候，将new2字段更新为"华新2节点"
    } else if (activityEndMessage.actName == "华新2") {
      object = { id: billID, new2: "华新2节点" };
    }
    // 根据单据的ID，执行更新字段new2
    ObjectStore.updateById("AT17750DC417500007.AT17750DC417500007.test001", object, "test001");
  }
}
exports({ entryPoint: WorkflowAPIHandler });