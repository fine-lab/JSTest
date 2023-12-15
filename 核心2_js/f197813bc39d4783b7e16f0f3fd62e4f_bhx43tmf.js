let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取三个参数
    let getcode = request.code;
    let getapprovalstatus = request.approvalstatus;
    let getmoen = request.moen;
    var str = "";
    if (getapprovalstatus == 3 || getapprovalstatus == 4) {
      var sql1 = " select * from AT168516D809980006.AT168516D809980006.paymentrequest20221228  where code = '" + getcode + "'";
      var res1 = ObjectStore.queryByYonQL(sql1);
      if (res1 !== null || res1.length !== 0) {
        let status = res1[0].approvalstatus;
        if (status == "1") {
          str = "没有处于审批中的状态";
          throw new Error("没有处于审批中的状态");
        } else {
          //修改页面
          var object = { id: res1[0].id, approvalstatus: getapprovalstatus, moen: getmoen };
          var resup = ObjectStore.updateById("AT168516D809980006.AT168516D809980006.paymentrequest20221228", object, "d32021b9List");
          str = "成功";
        }
      }
    } else {
      str = "参数getapprovalstatus状态不对，3：审批成功，4：审批失败";
    }
    return { code: str };
  }
}
exports({ entryPoint: MyAPIHandler });