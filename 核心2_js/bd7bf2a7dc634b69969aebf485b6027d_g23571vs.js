let AbstractWorkflowAPIHandler = require("AbstractWorkflowAPIHandler");
class WorkflowAPIHandler extends AbstractWorkflowAPIHandler {
  // 流程实例初始化
  processInstanceStart(processStartMessage) {}
  // 流程完成
  processInstanceEnd(processStateChangeMessage) {
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true && processStateChangeMessage.processActionType !== "suspension") {
      var businessKey = processStateChangeMessage.businessKey;
      var id = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      //查询客户分配ID 和客户ID
      var sql = "select * from GT54604AT1.GT54604AT1.marke_verification where id = " + id;
      var res = ObjectStore.queryByYonQL(sql);
      var merchantApplyRangeId = res[0].merchantid;
      var merchant = res[0].merchant;
      var detailsSql = "select * from GT54604AT1.GT54604AT1.write_off_details where marke_verification_id = " + id;
      var detailsRes = ObjectStore.queryByYonQL(detailsSql);
      //申请核销金额
      var writeOffAmount = 0;
      for (var k = 0; k < detailsRes.length; k++) {
        writeOffAmount = writeOffAmount + detailsRes[k].appliedWriteOffAmount;
        if (detailsRes[k].eliminate === "1") {
          var unWriteOffAmount = detailsRes[k].unWriteOffAmount;
          //查询客户档案
          let url = "https://www.example.com/" + merchant + "&merchantApplyRangeId=" + merchantApplyRangeId;
          let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
          var customerRes = JSON.parse(apiResponse);
          //处理客户档案数据（市场费历史剩余金额）
          var data = customerRes.data;
          var money = data.customerDefine.customerDefine13;
          var customerDefine10 = data.customerDefine.customerDefine10;
          //市场费可申请
          data.customerDefine.customerDefine13 = Number(money) + Number(unWriteOffAmount);
          //市场费已申请
          data.customerDefine.customerDefine10 = Number(customerDefine10) - Number(unWriteOffAmount);
          data._status = "Update";
          //修改客户档案接口
          var body = { data };
          let updateCustomerUrl = "https://www.example.com/";
          let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
        }
      }
      //查询客户档案
      let url = "https://www.example.com/" + merchant + "&merchantApplyRangeId=" + merchantApplyRangeId;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      var data = customerRes.data;
      var customerDefine10 = data.customerDefine.customerDefine10;
      var customerDefine14 = data.customerDefine.customerDefine14;
      var customerDefine17 = data.customerDefine.customerDefine17;
      if (customerDefine14 == null || customerDefine14 == undefined) {
        customerDefine14 = 0;
      }
      //市场费已申请已核销
      var customerDefine14 = Number(customerDefine14) + Number(writeOffAmount);
      data.customerDefine.customerDefine14 = customerDefine14;
      data.customerDefine.customerDefine17 = (Number(customerDefine17) + Number(writeOffAmount)).toFixed(2);
      //市场费已申请未核销
      data.customerDefine.customerDefine22 = Number(customerDefine10) - Number(customerDefine14);
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
      //核销清零后，修改申请单核销状态为已完结：2
      //剩余核销金额为0 修改申请单核销状态为已完结：2
      for (var y = 0; y < detailsRes.length; y++) {
        //核销清零后，修改申请单核销状态
        var marketApplicationId = detailsRes[y].market_application;
        var expensType = detailsRes[y].expense_type;
        //核销清零、剩余未核销金额等于0
        if (detailsRes[y].eliminate === "1" || detailsRes[y].unWriteOffAmount == 0) {
          var sql = "select * from GT54604AT1.GT54604AT1.market_details where market_application_id = " + marketApplicationId + " and marketType = " + expensType;
          var res = ObjectStore.queryByYonQL(sql);
          var object = { id: res[0].id, marketFeeState: "2" };
          var res2 = ObjectStore.updateById("GT54604AT1.GT54604AT1.market_details", object);
        }
        //查询市场费申请单详情
        var sql = "select * from GT54604AT1.GT54604AT1.market_details where market_application_id = " + marketApplicationId;
        var res = ObjectStore.queryByYonQL(sql);
        //记录核销已完结数据数量
        var count = 0;
        for (var f = 0; f < res.length; f++) {
          if (res[f].marketFeeState == 2) {
            count = count + 1;
          }
        }
        //核销完结数量 == 详情单数据时，修改市场费申请单核销状态为已完结
        if (count == res.length) {
          var object = { id: marketApplicationId, marketFeeState: "2" };
          var res2 = ObjectStore.updateById("GT54604AT1.GT54604AT1.market_application", object);
        }
      }
      //测试脚本是否执行
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });