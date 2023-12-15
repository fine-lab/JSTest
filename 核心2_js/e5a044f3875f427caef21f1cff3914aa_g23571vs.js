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
      var sql = "select * from GT54604AT1.GT54604AT1.market_application where id = " + id;
      var res = ObjectStore.queryByYonQL(sql);
      var merchantApplyRangeId = res[0].merchantId;
      var merchant = res[0].Merchant;
      //查询客户档案
      let url = "https://www.example.com/" + merchant + "&merchantApplyRangeId=" + merchantApplyRangeId;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      //查询申请详情
      var querySql = "select * from GT54604AT1.GT54604AT1.market_details where market_application_id = " + id;
      var queryRes = ObjectStore.queryByYonQL(querySql);
      //计算申请总金额
      var count = 0;
      for (let index = 0; index < queryRes.length; index++) {
        count = count + queryRes[index].applyMarketFees;
      }
      //处理客户档案数据（市场费历史剩余金额）
      var data = customerRes.data;
      var money = data.customerDefine.customerDefine13;
      data.customerDefine.customerDefine13 = Number(money) + Number(count);
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
      //测试脚本是否执行
    }
    //判断当前流程是否为最后一级审批人
    if (processStateChangeMessage.processEnd === true) {
      var businessKey = processStateChangeMessage.businessKey;
      var id = businessKey.substring(businessKey.lastIndexOf("_") + 1);
      //查询客户分配ID 和客户ID
      var sql = "select * from GT54604AT1.GT54604AT1.market_application where id = " + id;
      var res = ObjectStore.queryByYonQL(sql);
      var merchantApplyRangeId = res[0].merchantId;
      var merchant = res[0].Merchant;
      //查询客户档案
      let url = "https://www.example.com/" + merchant + "&merchantApplyRangeId=" + merchantApplyRangeId;
      let apiResponse = openLinker("get", url, "SCMSA", JSON.stringify({}));
      var customerRes = JSON.parse(apiResponse);
      //查询申请详情
      var querySql = "select * from GT54604AT1.GT54604AT1.market_details where market_application_id = " + id;
      var queryRes = ObjectStore.queryByYonQL(querySql);
      //计算申请总金额
      var count = 0;
      //核销状态更新，详情见文档（市场费申请新增核销状态）
      var flag = 0;
      //计算搭赠类型费用
      var complimentaryFee = 0;
      for (let index = 0; index < queryRes.length; index++) {
        count = count + queryRes[index].applyMarketFees;
        if (queryRes[index].marketType == "1") {
          complimentaryFee = complimentaryFee + queryRes[index].applyMarketFees;
          flag = flag + 1;
          var object = { id: queryRes[index].id, marketFeeState: "2" };
          var res2 = ObjectStore.updateById("GT54604AT1.GT54604AT1.market_details", object);
        } else {
          var object = { id: queryRes[index].id, marketFeeState: "1" };
          var res2 = ObjectStore.updateById("GT54604AT1.GT54604AT1.market_details", object);
        }
      }
      //处理客户档案数据（市场费历史剩余金额）
      var data = customerRes.data;
      var money = data.customerDefine.customerDefine10;
      var fee = data.customerDefine.customerDefine14;
      var customerDefine17 = data.customerDefine.customerDefine17;
      if (money == null || money == undefined) {
        money = 0;
      }
      if (fee == null || fee == undefined) {
        fee = 0;
      }
      //市场费已申请
      var customerDefine10 = Number(money) + Number(count);
      //市场费已申请已核销
      var customerDefine14 = Number(fee) + Number(complimentaryFee);
      data.customerDefine.customerDefine10 = customerDefine10;
      data.customerDefine.customerDefine14 = customerDefine14;
      if (customerDefine17 == null || customerDefine17 == undefined) {
        data.customerDefine.customerDefine17 = customerDefine24;
      } else {
        data.customerDefine.customerDefine17 = Number(customerDefine17) + Number(complimentaryFee);
      }
      //市场费已申请未核销
      data.customerDefine.customerDefine22 = Number(customerDefine10) - Number(customerDefine14);
      data._status = "Update";
      //修改客户档案接口
      var body = { data };
      let updateCustomerUrl = "https://www.example.com/";
      let customerResponse = openLinker("POST", updateCustomerUrl, "SCMSA", JSON.stringify(body));
      if (flag > 0 && queryRes.length == 1) {
        //审批通过更新核销状态为已结案：2
        var object = { id: id, marketFeeState: "2" };
        var res2 = ObjectStore.updateById("GT54604AT1.GT54604AT1.market_application", object);
      } else {
        //审批通过更新核销状态为进行中：1
        var object = { id: id, marketFeeState: "1" };
        var res2 = ObjectStore.updateById("GT54604AT1.GT54604AT1.market_application", object);
      }
      //测试脚本是否执行
    }
  }
  // 环节结束
  activityComplete(activityEndMessage) {}
}
exports({ entryPoint: WorkflowAPIHandler });