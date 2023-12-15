let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取审批结果、审批意见，单据唯一标识
    var processEnd = request.processEnd;
    var approveResult = request.approveResult;
    var billId = request.billId;
    var status = "";
    if (processEnd == "true") {
      status = "审批通过";
    } else if (processEnd == "false") {
      status = "审批拒绝";
    }
    //通过billId找到单据的真实id
    var param = { id: billId, approveStatus: status, approveResult: approveResult };
    var res = ObjectStore.updateById("GT20580AT7.GT20580AT7.riskassessmentfys", param, "500c2fe5");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });