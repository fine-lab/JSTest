let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    debugger;
    var str = JSON.stringify(processStateChangeMessage);
    let processEnd = processStateChangeMessage.processEnd;
    let businessKey = processStateChangeMessage.businessKey;
    var data;
    if (!processEnd) {
      data = { log: str, type: "processStateChangeMessage", memo: "流程未完成" };
      ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
      return;
    }
    var businessKeys = businessKey.split("_");
    if (businessKeys.length <= 0) {
      data = { log: str, type: "processStateChangeMessage", memo: "businessKey出现异常:" + businessKey };
      ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
      return;
    }
    let busiId = businessKeys[businessKeys.length - 1];
    // 查询回程信息 获取出国境办理id
    var sql = "select * from AT15BFE8B816C80007.AT15BFE8B816C80007.cgjhc where id = " + busiId;
    var billData = ObjectStore.queryByYonQL(sql);
    if (!billData || billData.length <= 0) {
      data = { log: str, type: "processStateChangeMessage", memo: "获取出国境回程信息失败，businessKey:" + businessKey };
      ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
      return;
    }
    // 回程信息
    let hcxx = billData[0];
    let cgjsqInformation = hcxx.cgjsqInformation;
    if (!cgjsqInformation) {
      data = { log: str, type: "processStateChangeMessage", memo: "回程信息上未维护出国境办理信息，businessKey:" + businessKey };
      ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
      return;
    }
    sql = "select * from AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqbl where id = " + cgjsqInformation;
    billData = ObjectStore.queryByYonQL(sql);
    if (!billData || billData.length <= 0) {
      data = { log: str, type: "processStateChangeMessage", memo: "获取出国境办理信息失败，businessKey:" + businessKey };
      ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
      return;
    }
    // 办理信息
    let blxx = billData[0];
    sql = "select * from AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqgl where source_id = " + cgjsqInformation + " order by createTime desc";
    billData = ObjectStore.queryByYonQL(sql);
    if (!billData || billData.length <= 0) {
      data = { log: str, type: "processStateChangeMessage", memo: "获取出国境管理信息失败，businessKey:" + businessKey };
      ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
      return;
    }
    // 管理信息
    let glxx = billData[0];
    let blObj = { id: blxx.id, nhLeavestatus: "3" };
    let glObj = { id: glxx.id, nhLeavestatus: "3" };
    var blres = ObjectStore.updateById("AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqbl", blObj, "cgjbl");
    var glres = ObjectStore.updateById("AT15BFE8B816C80007.AT15BFE8B816C80007.cgsqgl", glObj, "cgjsqgl_001");
    data = { log: str, type: "processStateChangeMessage", memo: "回写成功！出国境办理id:" + blres.id + ";出国境管理id:" + glres.id };
    ObjectStore.insert("AT15BFE8B816C80007.AT15BFE8B816C80007.ncLogTemp", data, "ncLogTemp");
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });