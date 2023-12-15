let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var res = ObjectStore.queryByYonQL("select * from GT4691AT1.GT4691AT1.MFrontSaleOrderMain where id in (" + request.idList + ") and   ( fmbPass  = '否' or  fmbBox = '否'  )");
    for (var prop in res) {
      //不成箱
      if (res[prop].fmbBox == "否") {
        return { type: "bBox", message: "订单号【" + res[prop].code + "】提交失败：\n" + res[prop].fmBoxMsg };
      }
      if (res[prop].fmbPass == "否") {
        return { type: "bPass", message: "订单号【" + res[prop].code + "】提交失败：\n" + res[prop].fmLimitMsg };
      }
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });