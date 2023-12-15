let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    var object = { id: "youridHere", regionalManagerName: "12345" };
    var res2 = ObjectStore.updateById("GT54604AT1.GT54604AT1.proportion_adjust", object);
    var businessKey = processStateChangeMessage.businessKey;
    var id = businessKey.substring(businessKey.lastIndexOf("_") + 1);
    //查询客户分配ID 和客户ID
    var sql = "select * from GT54604AT1.GT54604AT1.proportion_adjust where id = " + id;
    var res = ObjectStore.queryByYonQL(sql);
    var merchantApplyRangeId = res[0].merchantId;
    var merchant = res[0].merchant;
    //查询客户档案
    let url = "https://www.example.com/" + merchant + "&merchantApplyRangeId=" + merchantApplyRangeId;
    let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
    var customerRes = JSON.parse(apiResponse);
    //查询申请详情
    var querySql = "select * from GT54604AT1.GT54604AT1.apply_Proportion where proportion_adjust_id = " + id;
    var queryRes = ObjectStore.queryByYonQL(querySql);
    //市场费申请额度
    var value1;
    //市场费使用比例
    var value2;
    //条码费使用比例
    var value3;
    for (var i = 0; i <= queryRes.length; i++) {
      if (queryRes[i].adjustmentType === "1") {
        value1 = queryRes[i].applicationProportion;
      } else if (queryRes[i].adjustmentType === "2") {
        value2 = queryRes[i].applicationProportion;
      } else if (queryRes[i].adjustmentType === "3") {
        value3 = queryRes[i].applicationProportion;
      }
    }
    var data = customerRes.data;
    data.customerDefine.customerDefine6 = value1;
    data.customerDefine.customerDefine15 = value2;
    data.customerDefine.customerDefine11 = value3;
    data._status = "Update";
    var body = { data };
    let updateCustomerUrl = "https://www.example.com/";
    let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });