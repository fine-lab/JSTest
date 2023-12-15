let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var ids = request.code;
    var approvalstatuss = request.approvalstatus;
    var moens = request.moen == null ? "" : request.moen + "<<审批时间:" + request.approvaldata;
    //数据库进行操作
    //更新实体 只更新主表
    var object = { id: ids, approvalstatus: approvalstatuss, moen: moens };
    var res = ObjectStore.updateById("AT168516D809980006.AT168516D809980006.paymentrequest20221228", object, "paymentrequest20221228");
    return { code: object };
  }
}
exports({ entryPoint: MyAPIHandler });