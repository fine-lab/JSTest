let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //判断当前流程是否驳回
    if (processStateChangeMessage.processActionType === "suspension") {
      var businessKey = processStateChangeMessage.businessKey;
      var id = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      //查询客户分配ID 和客户ID
      var sql = "select * from GT54604AT1.GT54604AT1.barcode_application where id = " + id;
      var res = ObjectStore.queryByYonQL(sql);
      var merchant = res[0].merchant;
      //查询客户档案
      let url = "https://www.example.com/" + merchant;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      //查询申请详情
      var querySql = "select * from GT54604AT1.GT54604AT1.barcode_details where barcode_application_id = " + id;
      var queryRes = ObjectStore.queryByYonQL(querySql);
      //计算申请总金额
      var count = 0;
      for (let index = 0; index < queryRes.length; index++) {
        count = count + queryRes[index].barcodeAmount;
      }
      //处理客户档案数据
      var data = customerRes.data;
      var money = data.customerDefine.customerDefine26;
      data.customerDefine.customerDefine26 = Number(money) + Number(count);
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
    }
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true) {
      var businessKey = processStateChangeMessage.businessKey;
      var id = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      //查询客户分配ID 和客户ID
      var sql = "select * from GT54604AT1.GT54604AT1.barcode_application where id = " + id;
      var res = ObjectStore.queryByYonQL(sql);
      var merchant = res[0].merchant;
      //查询客户档案
      let url = "https://www.example.com/" + merchant;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      //查询申请详情
      var querySql = "select * from GT54604AT1.GT54604AT1.barcode_details where barcode_application_id = " + id;
      var queryRes = ObjectStore.queryByYonQL(querySql);
      //计算申请总金额
      var count = 0;
      for (let index = 0; index < queryRes.length; index++) {
        count = count + queryRes[index].barcodeAmount;
      }
      //处理客户档案数据
      var data = customerRes.data;
      //条码费已申请
      var customerDefine9 = data.customerDefine.customerDefine9;
      //条码费已申请未核销
      var customerDefine21 = data.customerDefine.customerDefine21;
      //条码费已申请已核销
      var customerDefine23 = data.customerDefine.customerDefine23;
      if (customerDefine9 == null || customerDefine9 == undefined) {
        customerDefine9 = 0;
      }
      if (customerDefine21 == null || customerDefine21 == undefined) {
        customerDefine21 = 0;
      }
      if (customerDefine23 == null || customerDefine23 == undefined) {
        customerDefine23 = 0;
      }
      //条码费已申请
      data.customerDefine.customerDefine9 = Number(customerDefine9) + Number(count);
      //条码费已申请未核销
      data.customerDefine.customerDefine21 = Number(count) - Number(customerDefine23);
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
      //测试脚本是否执行
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });