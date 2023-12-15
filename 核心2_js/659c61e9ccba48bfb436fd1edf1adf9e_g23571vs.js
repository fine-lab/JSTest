let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true) {
      var businessKey = processStateChangeMessage.businessKey;
      var id = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      //查询客户分配ID 和客户ID
      var sql = "select * from GT54604AT1.GT54604AT1.barcode_write_off where id = " + id;
      var res = ObjectStore.queryByYonQL(sql);
      var merchant = res[0].merchant;
      //查询客户档案
      let url = "https://www.example.com/" + merchant;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      //查询申请详情
      var querySql = "select * from GT54604AT1.GT54604AT1.code_write_off where barcode_write_off_id = " + id;
      var queryRes = ObjectStore.queryByYonQL(querySql);
      //计算申请总金额
      var count = 0;
      for (let index = 0; index < queryRes.length; index++) {
        count = count + queryRes[index].appliedWriteOffAmount;
        if (queryRes[index].eliminate == "1") {
          var unWriteOffAmount = queryRes[index].unWriteOffAmount;
          //查询客户档案
          let url = "https://www.example.com/" + merchant;
          let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
          var customerRes = JSON.parse(apiResponse);
          //处理客户档案数据
          var data = customerRes.data;
          var customerDefine9 = data.customerDefine.customerDefine9;
          //条码费已申请
          data.customerDefine.customerDefine9 = Number(customerDefine9) - Number(unWriteOffAmount);
          data._status = "Update";
          //修改客户档案接口
          var body = { data };
          let updateCustomerUrl = "https://www.example.com/";
          let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
        }
      }
      //处理客户档案数据
      var data = customerRes.data;
      //条码费已申请已核销
      var customerDefine23 = data.customerDefine.customerDefine23;
      //条码费已申请未核销
      var customerDefine21 = data.customerDefine.customerDefine21;
      //条码费已申请
      var customerDefine9 = data.customerDefine.customerDefine9;
      //条码费已核销
      var customerDefine20 = data.customerDefine.customerDefine20;
      //条码费已核销未使用
      var customerDefine18 = data.customerDefine.customerDefine18;
      if (customerDefine23 == null || customerDefine23 == undefined) {
        customerDefine23 = 0;
      }
      if (customerDefine21 == null || customerDefine21 == undefined) {
        customerDefine21 = 0;
      }
      //条码费已申请已核销
      var money = Number(customerDefine23) + Number(count);
      data.customerDefine.customerDefine23 = Number(money);
      if (customerDefine20 == null || customerDefine20 == undefined) {
        data.customerDefine.customerDefine20 = Number(money);
      } else {
        data.customerDefine.customerDefine20 = Number(customerDefine20) + Number(count);
      }
      data.customerDefine.customerDefine21 = Number(customerDefine9) - Number(money);
      if (customerDefine18 == null || customerDefine18 == undefined) {
        data.customerDefine.customerDefine18 = Number(money);
      } else {
        data.customerDefine.customerDefine18 = Number(customerDefine18) + Number(count);
      }
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });