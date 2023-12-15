let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let param1 = request.sCode;
    //通过订单编号查询付款凭证信息
    let sqlid = "select voucherId as vId from egl.voucher.VoucherBodyBO where description like '" + param1 + "'";
    let resPayid = ObjectStore.queryByYonQL(sqlid, "yonbip-fi-egl");
    let resdata = resPayid[0];
    throw resdata;
    return { resdata };
  }
}
exports({ entryPoint: MyAPIHandler });