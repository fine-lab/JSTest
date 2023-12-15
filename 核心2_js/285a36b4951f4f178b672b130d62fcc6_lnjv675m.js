let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    let businessKey = processStateChangeMessage.businessKey;
    var res0 = split(businessKey, "_", 2);
    res0 = JSON.parse(res0);
    let id = res0[1];
    let sql1 = "select LastOrgRegister from GT34544AT7.GT34544AT7.OrgRegister where id = '" + id + "'";
    let res1 = ObjectStore.queryByYonQL(sql1);
    let LastOrgRegister = res1[0].LastOrgRegister;
    var object1 = { id: LastOrgRegister, LastRecordFlag: "0" };
    var res2 = ObjectStore.updateById("GT34544AT7.GT34544AT7.OrgRegister", object1, "yb98bfd5fb");
    var object3 = { id: id, LastRecordFlag: "1" };
    var res3 = ObjectStore.updateById("GT34544AT7.GT34544AT7.OrgRegister", object3, "yb98bfd5fb");
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });