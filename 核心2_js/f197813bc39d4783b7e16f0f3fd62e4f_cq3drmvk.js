let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 获取三个参数
    let getcode = request.code;
    let getapprovalstatus = request.approvalstatus;
    let getmoen = request.moen;
    var sql1 = " select * from AT168516D809980006.AT168516D809980006.paymentrequest20221228  where code = '" + getcode + "'";
    var res1 = ObjectStore.queryByYonQL(sql1);
    let status = res1[0].approvalstatus;
    if (status !== "2") {
      throw new Error("没有处于审批中的状态");
    } else {
      //修改页面
      var object = { id: res1[0].id, approvalstatus: getapprovalstatus };
      var resup = ObjectStore.updateById("AT168516D809980006.AT168516D809980006.paymentrequest20221228", object, "d32021b9List");
      var res2 = ObjectStore.queryByYonQL(sql1);
      if (res2[0].approvalstatus == getapprovalstatus) {
        return "成功";
      } else {
        return "失败";
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });