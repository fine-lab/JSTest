let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let msg = "success";
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    const reqNewFlag = request.newFlag;
    if (reqNewFlag == null || reqNewFlag == undefined || reqNewFlag == "0") {
      //删除
      const reqVoucherCode = request.voucherCode;
      msg = "删除凭证成功";
    } else {
      //生成凭证
      msg = "生成凭证成功";
    }
    return { rst: true, data: 123 };
  }
}
exports({ entryPoint: MyAPIHandler });